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

// Checks wether an id is set in the cookie -> if the user is logged in
app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId
    });
});

// Reset cookie session, redirect to login
app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/login");
});

// If the email exists in the db, generate and send a reset code to that email
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
                        res.json({ error: true });
                    });
            } else {
                res.json({ error: true });
            }
        })
        .catch(() => {
            res.json({ error: true });
        });
    
});

// Check wether the reset code matches the user
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
            res.json({error: true});
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
            res.json({ error: true });
        });
    
});

app.post("/uploadprofilepic", uploader.single("uploadInput"), s3.upload, async (req, res) => {
    try {
        let result = db.updateProfilePic(req.session.userId, "https://s3.amazonaws.com/spicedling/"+req.file.filename);
        res.json((await result).rows[0].profile_pic_url);
    }catch (e) {
        console.log(e);
        res.json({error: true});
    }
});

//  Get info for logged in user
app.get("/loaduserinfo", async (req, res) => {
    try {
        res.json((await (db.getUserInfo(req.session.userId))).rows[0]);
    } catch (e) {
        console.log(e);
        res.json({error: true});
    }

});

// Get info for different user
app.get("/loadotheruserinfo/:id", async (req, res) => {
    try {
        res.json((await db.getUserInfo(req.params.id)));
    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }

});

// Load infos for newest users
app.get("/getnewestusers", async (req, res) => {
    try {
        res.json((await (db.getNewestUsers())));
    
    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }
});

app.get("/searchusers/:input", async (req, res) => {
    try {
        res.json((await (db.searchUsers(req.params.input))));
    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }
});

app.post("/updatebio", async (req, res) => {
    try {
        res.json((await (db.updateBio(req.session.userId, req.body.newBio))).rows[0]);

    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }
});

// Get info about friendshipt status with one other user
app.get("/getsinglefriendship/:id", async (req, res) => {
    //Returns the accepted
    try {
        res.json(await db.getSingleFriendship(req.session.userId, req.params.id));
    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }
});

// Get all friendships of the logged in user
app.get("/getallfriends/", async (req, res) => {
    try {
        res.json(await db.getAllFriendships(req.session.userId));
    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }
});

// Get the number of unanswered friendship requests (to display in the top right corner)
app.get("/getnumofrequests/", async (req, res) => {
    try {
        res.json(await db.getNumOfRequests(req.session.userId));
    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }
});

app.post("/makefriendshiprequest", async (req, res) => {
    // Returns the id of the friendship
    try {
        res.json((await db.makeFriendshipRequest(req.session.userId, req.body.otherUserId)));

    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }
});

// Either deny a request or unfriend a person
app.post("/cancelfriendship", async (req, res) => {
    // Returns the id of the friendship
    try {
        res.json(await db.cancelFriendship(req.session.userId, req.body.otherUserId));

    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }
});

app.post("/acceptfriendship", async (req, res) => {
    // Returns the id of the friendship
    try {
        res.json(await db.acceptFriendship(req.session.userId, req.body.otherUserId));

    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }
});


// Catch-all
app.get("*", function (req, res) {
    try {
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));

    } catch (e) {
        console.log(e);
        res.json({ error: true });
    }
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});



// Everything related to list of online users and chat
///////////////////////////////////////////////////////

io.on("connection", async function (socket) {
    // If user is (no longer) logged in, disconnect them
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    //  Get user id and join a socket with their id
    const userId = socket.request.session.userId;
    socket.join(userId);

    // onlineusers (obj) does or does not contain an entry for the current user. if yes: add one more socket.id to that entry, if not create the entry and add the first socket.id
    onlineUsers[userId] = (function () {
        if (!onlineUsers[userId]) {
            return [socket.id];
        } else {
            return [...onlineUsers[userId], socket.id];
        }
    })();

    //  Emit to all users the list of online users (by first getting their info from the db)
    async function emitOnlineUsers() {
        console.log('running emitOnlineUsers');
        try {
            io.emit("onlineusers", (await db.getListOfUsers(Object.keys(onlineUsers))).rows);
        } catch (e) {
            console.log(e);
        }
    }    
    emitOnlineUsers();
    
    console.log(onlineUsers);

    console.log(
        `User with id: ${userId} and socket id ${socket.id}, just connected!`
    );
    
    //  Gets the previous chats from one conversation (either main chat or with a specific user)
    async function lastChats (myId, otherUserId) {
        console.log("server side", myId, otherUserId);
        try {
            return (await db.getLastChats(myId, otherUserId));
        } catch (e) {
            console.log(e);
        }
        // console.log(lastChats);
    } 

    // Gets a list of the id's from users who have sent messages to you, that you haven't read yet
    async function unreadChatsInfo (myId) {
        console.log('myId vor query', myId);
        try {
            return (db.unreadChatsInfo(myId));

        } catch (e) {
            console.log(e);
        }

    }

    //  When a user "starts" a new chat (opens chat window or switches to different chat)...
    socket.on("new-chat", async ( {otherUserId, firstChat} ) => {
        console.log("otheruserid", otherUserId);
        let lastChatsVar = await lastChats(userId, otherUserId);
        console.log(lastChatsVar);
        // Get and emit the previous chats or insert the message (because somethin breaks if there are no messages ^^')
        if (lastChatsVar.rows.length > 0) {
            lastChatsVar.rows[0]["otherUserId"] = otherUserId;
        } else {
            lastChatsVar = { rows: [{otherUserId: otherUserId, text: "<No messages found>", seen: true}]}; 
        }
        console.log('lastChatsVar', await lastChatsVar.rows);
        socket.emit("last-10-messages", await lastChatsVar.rows);
        
        // If it's the first time this session that the user opens a chat, get and emit a list of ids from users who have sent the user messages, which are still unread
        if (firstChat) {
            let unreadChatsInfoVar = await unreadChatsInfo(userId);
            let unreadChatsInfoArray = [];
            unreadChatsInfoVar.rows.map((item, index) => {
                unreadChatsInfoArray.push(unreadChatsInfoVar.rows[index].user_id);
                // console.log(item);
                // console.log("come on", unreadChatsInfoVar.rows[index].user_id);
            });
            console.log("ids with unread messages", unreadChatsInfoArray);
            socket.emit("unreadChatsInfo", unreadChatsInfoArray);
        }

    });

    // Mark a set of messages by a certain user as seen
    socket.on("markAsSeen", async ({currentChatPartner}) => {
        try {
            db.markAsSeen(userId, currentChatPartner);

        } catch (e) {
            console.log(e);
        }
    });

    // If user sends a new message...
    socket.on("new-message", async ({message, otherUserId}) => {
        let newMessageId;
        let userInfo;
        // ... add it to the db and get the info of the sender (to send along with the message)
        try {
            newMessageId = await(db.addNewChatMessage(socket.request.session.userId, otherUserId, message));
            userInfo = await (db.getUserInfo(socket.request.session.userId));

        } catch (e) {
            console.log(e);
        }
        // console.log("message", message);
        // console.log('newMessageId', newMessageId.rows[0].id);
        // console.log('userInfo', userInfo.rows[0]);

        // If the recipient is "null", the message gets emitted to all online users (to be displayed in the main chat room)
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
            // Emit to all users, that "null" send a message, which is unread (not used on client side atm)
            io.emit("newUnreadChat", userId);

        // or it gets sent to the recipient...
        } else {
            console.log("other user id", otherUserId);
            // by sending it to yourself
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
            // and the recipient
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
            // Also emit the sender id to the list of unreadChats of the recipient
            io.to(otherUserId).emit("newUnreadChat", userId);
        }
    });
    // If a socket disconnects, delete its entry from the onlineusers list. if a user has no more sockets, delete their entry entirely
    socket.on("disconnect", () => {
        onlineUsers[userId] = onlineUsers[userId].filter(id => id!=socket.id );
        onlineUsers[userId].length == 0 && delete onlineUsers[userId]; 
        console.log(onlineUsers);
        //  Emit the updated list
        emitOnlineUsers();
    });
});