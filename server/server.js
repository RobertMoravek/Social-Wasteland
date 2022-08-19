const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db.js");
const cryptoRandomString = require("crypto-random-string");
const sendCode = require("./ses.js");
const { uploader } = require("./middleware.js");
const s3 = require("./S3.js");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) => {
        callback(null, req.headers.referer.startsWith("http://localhost:3000"));
    },
});

const onlineUsers = {};

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
app.use(compression());
const cookieSessionMiddleware = cookieSession({
    secret:
        process.env.SESSION_SECRET || require("../secrets.json").SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
    sameSite: true,
});
app.use(cookieSessionMiddleware);

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
    res.redirect("/login");
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

app.get("/loadotheruserinfo/:id", async (req, res) => {
    console.log(req.params.id);
    res.json((await db.getUserInfo(req.params.id)));
});

app.get("/getnewestusers", async (req, res) => {
    res.json((await (db.getNewestUsers())));
});

app.get("/searchusers/:input", async (req, res) => {
    res.json((await (db.searchUsers(req.params.input))));
});

app.post("/updatebio", async (req, res) => {
    res.json((await (db.updateBio(req.session.userId, req.body.newBio))).rows[0]);
});

app.get("/getsinglefriendship/:id", async (req, res) => {
    //Returns the accepted
    res.json(await db.getSingleFriendship(req.session.userId, req.params.id));
});

app.get("/getallfriends/", async (req, res) => {
    //Returns the accepted

    res.json(await db.getAllFriendships(req.session.userId));
});

app.get("/getnumofrequests/", async (req, res) => {
    //Returns the accepted

    res.json(await db.getNumOfRequests(req.session.userId));
});

app.post("/makefriendshiprequest", async (req, res) => {
    // Returns the id of the friendship
    res.json((await db.makeFriendshipRequest(req.session.userId, req.body.otherUserId)));
});

app.post("/cancelfriendship", async (req, res) => {
    // Returns the id of the friendship
    res.json(await db.cancelFriendship(req.session.userId, req.body.otherUserId));
});

app.post("/acceptfriendship", async (req, res) => {
    // Returns the id of the friendship
    res.json(await db.acceptFriendship(req.session.userId, req.body.otherUserId));
});



app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});


io.on("connection", async function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    socket.join(userId);

    onlineUsers[userId] = (function () {
        if (!onlineUsers[userId]) {
            return [socket.id];
        } else {
            return [...onlineUsers[userId], socket.id];
        }
    })();

    
    async function emitOnlineUsers() {
        console.log('running emitOnlineUsers');
        io.emit("onlineusers", (await db.getListOfUsers(Object.keys(onlineUsers))).rows);
    }    
    emitOnlineUsers();
    
    console.log(onlineUsers);

    console.log(
        `User with id: ${userId} and socket id ${socket.id}, just connected!`
    );
    
    async function lastChats (myId, otherUserId) {
        console.log("server side", myId, otherUserId);
        return (await db.getLastChats(myId, otherUserId));
        // console.log(lastChats);
        
    } 

    socket.on("new-chat", async ( {otherUserId} ) => {
        console.log("otheruserid", otherUserId);
        let lastChatsVar = await lastChats(userId, otherUserId);
        console.log(lastChatsVar);
        if (lastChatsVar.rows.length > 0) {
            lastChatsVar.rows[0]["otherUserId"] = otherUserId;
        } else {
            lastChatsVar = { rows: [{otherUserId: otherUserId, text: ""}]}; 
        }
        console.log('lastChatsVar', await lastChatsVar.rows);
        socket.emit("last-10-messages", await lastChatsVar.rows);
    });

    socket.on("new-message", async ({message, otherUserId}) => {

        let newMessageId = await(db.addNewChatMessage(socket.request.session.userId, otherUserId, message));
        let userInfo = await (db.getUserInfo(socket.request.session.userId));
        // console.log("message", message);
        // console.log('newMessageId', newMessageId.rows[0].id);
        // console.log('userInfo', userInfo.rows[0]);

        if (otherUserId == null){
            io.emit("add-new-message", [
                {
                    id: newMessageId.rows[0].id,
                    otherUserId: null,
                    firstname: userInfo.rows[0].firstname,
                    lastname: userInfo.rows[0].lastname,
                    text: message,
                    profile_pic_url: userInfo.rows[0].profile_pic_url,
                    sent_at: newMessageId.rows[0].sent_at
                },
            ]);
        } else {
            console.log("other user id", otherUserId);
            io.to(userId).emit("add-new-message", [
                {
                    id: newMessageId.rows[0].id,
                    "otherUserId": otherUserId,
                    firstname: userInfo.rows[0].firstname,
                    lastname: userInfo.rows[0].lastname,
                    text: message,
                    profile_pic_url: userInfo.rows[0].profile_pic_url,
                    sent_at: newMessageId.rows[0].sent_at,
                },
            ]);
            io.to(otherUserId).emit("add-new-message", [
                {
                    
                    id: newMessageId.rows[0].id,
                    "otherUserId": userId,
                    firstname: userInfo.rows[0].firstname,
                    lastname: userInfo.rows[0].lastname,
                    text: message,
                    profile_pic_url: userInfo.rows[0].profile_pic_url,
                    sent_at: newMessageId.rows[0].sent_at,
                },
            ]);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers[userId] = onlineUsers[userId].filter(id => id!=socket.id );
        onlineUsers[userId].length == 0 && delete onlineUsers[userId]; 
        console.log(onlineUsers);
        emitOnlineUsers();
    });
});