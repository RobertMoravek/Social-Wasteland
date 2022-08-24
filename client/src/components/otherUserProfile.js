import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import FriendshipButton from "./friendshipButton";
import { useHistory } from "react-router-dom";

export default function ShowOtherUsers(userId) {
    const history = useHistory();
    const { id } = useParams();
    let [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        if (id == userId.userId) {
            history.push("/");
        } else {
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
                        // console.log(this.state);
                    } else {
                        history.replace("/users/");
                        console.log("loading user info failed");
                        // location.reload();
                        // this.state.error = true;
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
                        <h3>
                            {userInfo.firstname} {userInfo.lastname}
                        </h3>
                        <p className="extra-top-margin">{userInfo.bio}</p>
                        <FriendshipButton />
                    </div>
                </div>
            </div>
        </>
    );
}
