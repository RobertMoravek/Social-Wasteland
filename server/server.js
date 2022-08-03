const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db.js");

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

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
