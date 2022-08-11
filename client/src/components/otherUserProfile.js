import { useParams } from "react-router";
import { useState, useEffect } from "react";
import {Redirect} from  "react-router-dom";
import FriendshipButton from "./friendshipButton";
import { useHistory } from "react-router-dom";


export default function ShowOtherUsers(userId) {
    const history = useHistory();
    const { id } = useParams();
    let [userInfo, setUserInfo] = useState({});

    useEffect (() => {
        if ( id == userId.userId) {
            history.push("/");
        } else {
            fetch(`/loadotheruserinfo/${id}`)
                .then((response) => response.json())
                .then((result) => {
                    if (!result.error) {
                        if (userId.userId != "") {
                            if(result.rowCount > 0){
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
                });}
    }, [id, userId]);



    return (
        <>
            <div className="user">
                <img src={userInfo.profile_pic_url || "../defaultprofile.jpg"} alt="" className="profile-image"/>
                <p>
                    {userInfo.firstname} {userInfo.lastname}
                </p>
                <p>{userInfo.bio}</p>
                <FriendshipButton/>
            </div>
            
        </>
    );

}