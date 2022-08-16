const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");

let dbUrl;
if (process.env.NODE_ENV == 'production') {
    dbUrl = process.env.DATABASE_URL;
} else {
    const {user, password, database} = require("../secrets.json");
    dbUrl = `postgres:${user}:${password}@localhost:5432/${database}`;

}

const db = spicedPg(dbUrl);

module.exports.doesEmailExist = (email) => {
    return db.query(`SELECT * FROM users WHERE email=$1`, [email]);
};

module.exports.insertUser = (firstName, lastName, email, password) => {
    return hashPassword(password)
        .then((result) => {
            return db.query(
                `
                INSERT INTO users (firstname, lastname, email, password)
                    VALUES ($1, $2, $3, $4) RETURNING id`,
                [firstName, lastName, email, result]
            );

        });
};

module.exports.insertResetCode = (email, resetCode) => {
    return db.query(
        `
        INSERT INTO reset_codes (email, code)
            VALUES ($1, $2) RETURNING code`,
        [email, resetCode]
    );

};


module.exports.checkResetCode = (email, code) => {
    return db.query(`SELECT * FROM reset_codes WHERE email=$1 AND code=$2`, [email, code]);
};


module.exports.updatePassword = (email, password) => {
    console.log(email, password);
    return hashPassword(password).
        then((password) => {
            console.log(password);
            return db.query(
                `
                UPDATE users SET password=$2 WHERE email=$1 RETURNING id
                `,
                [email, password]
            );
        })
        .catch(() => {
            return false;
        });
};

module.exports.updateProfilePic = (id, url) => {
    return db.query(
        `
       UPDATE users SET profile_pic_url=$2 WHERE id=$1 RETURNING profile_pic_url
        `,
        [id, url]
    );
};

module.exports.updateBio = (id, bio) => {
    return db.query(
        `
       UPDATE users SET bio=$2 WHERE id=$1 RETURNING bio
        `,
        [id, bio]
    );
};

module.exports.getUserInfo = (id) => {
    
    return db.query(
        `
        SELECT * FROM users WHERE id=$1
        `,
        [id]
    );
};

module.exports.getNewestUsers = () => {
    return db.query(
        `
           SELECT * FROM users ORDER BY id DESC LIMIT 3
        `,
        []
    );
};

module.exports.searchUsers = (input) => {
    return db.query(
        `
        SELECT * FROM users WHERE firstname ILIKE $1 OR lastname ILIKE $1 LIMIT 10;`,
        [input + '%']
    );
};

module.exports.getSingleFriendship = (myId, otherId) => {
    return db.query(
        `
        SELECT * FROM friendships WHERE (sender_id=$1 AND recipient_id=$2) OR (sender_id=$2 AND recipient_id=$1);`,
        [myId, otherId]
    );
};

module.exports.getAllFriendships = (myId) => {
    return db.query(
        `
        SELECT users.id, firstname, lastname, accepted, bio, profile_pic_url FROM users JOIN friendships ON (accepted=true AND recipient_id=$1 AND users.id=friendships.sender_id)
OR (accepted=true AND sender_id=$1 AND users.id=friendships.recipient_id)
OR (accepted=false AND recipient_id=$1 AND users.id=friendships.sender_id)`,
        [myId]
    );
};

module.exports.getNumOfRequests = (myId) => {
    return db.query(
        `
        SELECT COUNT(*) FROM friendships WHERE accepted=false AND recipient_id=$1`,
        [myId]
    );
};


module.exports.makeFriendshipRequest = (myId, otherId) => {
    console.log(myId, otherId);
    return db.query(
        `
       INSERT INTO friendships (sender_id, recipient_id)
                VALUES ($1, $2) RETURNING id
        `,
        [myId, otherId]
    );
};


module.exports.cancelFriendship = (myId, otherId) => {
    return db.query(
        `
       DELETE FROM friendships WHERE (sender_id=$1 AND recipient_id=$2) OR (sender_id=$2 AND recipient_id=$1)
        `,
        [myId, otherId]
    );
};

module.exports.acceptFriendship = (myId, otherId) => {
    return db.query(
        `
       UPDATE friendships SET accepted=true WHERE sender_id=$2 AND recipient_id=$1 RETURNING accepted
        `,
        [myId, otherId]
    );
};




module.exports.getProfile = (id) => {
    
    return Promise.all([
        db.query(
            `
            SELECT * FROM users
            WHERE id = $1`,
            [id]
        ),
        db.query(
            `
            SELECT * FROM profile
            WHERE id = $1`,
            [id]
        )
    ]).then((results) => {
        
        // console.log(results[0].rows);
        // console.log(results[1].rows);
        return results;
    });
};



module.exports.updateProfile = (id, firstName, lastName, email, age, city, url, password) => {
    // console.log(id, firstName, lastName, email, age, city, url, password);
    return Promise.all([

        db.query(
            `
            INSERT INTO profile (id, age, city, userurl)
                VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO 
                UPDATE SET age=$2, city=$3, userurl=$4 WHERE profile.id=$1`,
            [id, age, city, url]
        ),
        db.query(
            `
            UPDATE users SET first=$2, last=$3, email=$4 WHERE id=$1
            `,
            [id, firstName, lastName, email]
        ),
        new Promise((resolve, reject) => {
            if(password != ""){
                hashPassword(password)
                    .then((password) => {
                        resolve (db.query(
                            `
                                UPDATE users SET password=$2 WHERE id=$1
                                `,
                            [id, password]
                        ));
                        reject(new Error ("Error while updating password")); 
                    });
            } else {
                resolve(true);
            }
        })
        
        

    ])
        .then((results) => {
            return results;
        });
};

module.exports.insertProfile = (id, age, city, url) => {
    // console.log(id, age, city, url);
    return db.query(
        `
            INSERT INTO profile (id, age, city, userurl)
                VALUES ($1, $2, $3, $4)
            `,
        [id, age, city, url]
    );
};



module.exports.loginUser = (email, password) => {
    let temp = null;
    return db.query(
        `
                SELECT * FROM users WHERE email = $1`,
        [email]
    )
        .then((result) => {
            temp = result;
            // console.log("result", result)
            return comparePasswords(password, result.rows[0].password);
        })
        .then((result) => {
            // console.log("result after password compare", result);
            if(result){
                // console.log("result.rows[0].id", temp.rows[0].id);
                return temp.rows[0].id;
            } else {
                return null;
            }
        });
};

module.exports.addSignature = (id, signature) => {
    return db.query(
        `
                INSERT INTO signatures (id, signature)
                    VALUES ($1, $2)`,
        [id, signature]
    );
};

module.exports.checkSignature = (id) => {
    return db.query(
        `
            SELECT signature FROM signatures WHERE id = $1 
            `, [id]
    ).then((result) => {
        if (result.rowCount == 1) {
            return true;
        } else {
            return false;
        }
    });
};

module.exports.deleteSignature = (id) => {
    return db
        .query(
            `
            DELETE FROM signatures WHERE id = $1 
            `,
            [id]
        );
};

module.exports.deleteAccount = (id) => {

    return db.query(
        `
            DELETE FROM signatures WHERE id = $1 
            `,
        [id]
    ).then(() => {
        db.query(
            `
                DELETE FROM profile WHERE id = $1 
                `,
            [id]
        );
            
    }).then(() => {
        db.query(
            `
                DELETE FROM users WHERE id = $1 
                `,
            [id]
        );
    }).then((results) => {
        return results;

    });
};


module.exports.showSigner = (id) => {
    let tempResult;
    return db.query(
        `
        SELECT * FROM users
            WHERE id = $1`, [id]
    )
        .then((result) => {
            tempResult = result.rows[0];
            return (db.query(
                `
        SELECT * FROM signatures
            WHERE id = $1`, [id]));

        })
        .then ((result) => {
            // console.log("result1, result2", tempResult, result.rows[0]);

            return [tempResult, result.rows[0]];
        });
};  

module.exports.showSupporters = function () {
    return db
        .query(
            `SELECT * FROM users
                    JOIN signatures
                    ON users.id = signatures.id
                    LEFT OUTER JOIN profile
                    ON users.id = profile.id
                    `
        )
        .then((results) => {
            // console.log('results of showSupporters', results.rows);
            return results.rows;
        });
};

module.exports.showSupportersCity = function (city) {
    return db
        .query(
            `SELECT * FROM users
                    JOIN signatures
                    ON users.id = signatures.id
                    LEFT OUTER JOIN profile
                    ON users.id = profile.id
                    WHERE profile.city = $1
                    `,[city]
        )
        .then((results) => {
            // console.log('results of showSupportersCity db query', results.rows);
            return results.rows;
        });
};


function hashPassword(password) {
    return bcrypt
        .genSalt()
        .then((salt) => {
            return bcrypt.hash(password, salt);
        })
        .then((result) => {
            // `result` will be the hashed password (if nothing went wrong)
            // console.log(result);
            return result;
        });

}

function comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
        .then((result) => {
            // console.log(result);
            return result;
        });
}