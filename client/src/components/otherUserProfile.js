import { useParams } from "react-router";
import { useState, useEffect } from "react";
import FriendshipButton from "./friendshipButton";
import { useHistory } from "react-router-dom";

export default function ShowOtherUsers(userId) { //userId is the id of the logged in user
    const history = useHistory();
    // Get the id of the other user profile from the url
    const { id } = useParams();
    let [userInfo, setUserInfo] = useState({});

    // If the id of the logged in user and the opened profile are the same, go to the home route
    useEffect(() => {
        if (id == userId.userId) {
            history.push("/");
        } else {
            // otherwise fetch the info for the other user from the server
            fetch(`/loadotheruserinfo/${id}`)
                .then((response) => response.json())
                .then((result) => {
                    if (!result.error) {
                        if (userId.userId != "") {
                            if (result.rowCount > 0) {
                                setUserInfo(result.rows[0]);
                            } else {
                                history.replace("/users");
                            }
                        }
                    } else {
                        // If the user doesn't exist (or something else wnet wrong) go back to the site where you can find users
                        history.replace("/users/");
                        console.log("loading user info failed");
                    }
                });
        }
    }, [id, userId]);


    function lowerCaseNames(first, last) {
        let firstVar = first.toLowerCase();
        let lastVar = last.toLowerCase();
        return `${firstVar} ${lastVar}`;
    }

    return (
        <>
            <div className="component profile ">
                <h2 className="component-headline">not you</h2>
                <div className="component-content profile">
                    <img
                        src={
                            userInfo.profile_pic_url || "../defaultprofile.jpg"
                        }
                        alt=""
                        className="profile-image"
                    />
                    <div className="user-info ">
                        <h3>{Object.keys(userInfo).length > 0 && lowerCaseNames(userInfo.firstname, userInfo.lastname)}</h3>
                        <p className="extra-top-margin">{userInfo.bio}</p>
                        <FriendshipButton />
                    </div>
                </div>
            </div>
        </>
    );
}
