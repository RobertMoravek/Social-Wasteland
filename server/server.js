const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db.js");
const cryptoRandomString = require("crypto-random-string");
const sendCode = require("./ses.js");
const { uploader } = require("./middleware.js");
const s3 = require("./S3.js");



app.use(compression());

app.use(express.urlencoded({ extended: false }));

// -> Cookie Stuff
let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    sessionSecret = require("../secrets.json").SESSION_SECRET;
}

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        secret: sessionSecret,
        maxAge: undefined,
    })
);

app.use(express.json());



app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.post("/register", (req, res) => {
    let {firstName, lastName, email, password} = req.body;
    db.insertUser(firstName, lastName, email, password)
        .then((result) => {
            req.session.userId = result.rows[0].id;
            res.json(result.rows[0]);
            return;
            
        })
        .catch((err) => {
            res.json({error: true, code: err.code});
            return;
        });
});

app.post("/login", (req, res) => {
    let {email, password} = req.body;
    db.loginUser(email, password)
        .then((result) => {
            req.session.userId = result;
            res.json(result);
            return;
            
        })
        .catch((err) => {
            res.json({error: true, code: err.code});
            return;
        });
});

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId
    });
});

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

app.post("/checkandsendmailfornewpassword", (req, res) => {
    let {email} = req.body;
    db.doesEmailExist(email)
        .then((result) => {
            if (result.rowCount === 1){
                let code = cryptoRandomString({ length: 6 });
                db.insertResetCode(email, code)
                    .then((result) => {
                        sendCode.sendCode(result.rows[0].code)
                            .then((result) => {
                                res.json({ emailExists: result });
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.json({ emailExists: false });
                    });
            } else {
                res.json({ emailExists: false });
            }
        })
        .catch(() => {
            res.json({ emailExists: false });
        });
    
});

app.post("/checkcode", (req, res) => {
    let {email, code} = req.body;
    db.checkResetCode(email, code)
        .then((result) => {
            // console.log(result);
            if (result.rowCount === 1){
                console.log('code correct');
                res.json({codecorrect: true});
            } else {
                res.json({codecorrect: false});
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({codecorrect: false});
        });
    
});

app.post("/updatepassword", (req, res) => {
    let {email, password} = req.body;
    db.updatePassword(email, password)
        .then((result) => {
            // console.log(result);
            if (result.rowCount === 1){
                res.json({passwordChanged: true});
            } else {
                res.json({ passwordChanged: false });
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({ passwordChanged: false });
        });
    
});

app.post("/uploadprofilepic", uploader.single("uploadInput"), s3.upload, async (req, res) => {
    
    let result = db.updateProfilePic(req.session.userId, "https://s3.amazonaws.com/spicedling/"+req.file.filename);
    // console.log(await result);
    res.json((await result).rows[0].profile_pic_url);
});

app.get("/loaduserinfo", async (req, res) => {
    res.json((await (db.getUserInfo(req.session.userId))).rows[0]);
});

app.post("/updatebio", async (req, res) => {
    res.json((await (db.updateBio(req.session.userId, req.body.newBio))).rows[0]);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
