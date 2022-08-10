import { useParams } from "react-router";
import { useState, useEffect } from "react";
import {Redirect} from  "react-router-dom";
import Profile from "./profile.js";
import { useHistory } from "react-router-dom";


export default function ShowOtherUsers(userId) {
    const history = useHistory();
    const { id } = useParams();
    let [userInfo, setUserInfo] = useState({});

    useEffect (() => {
        console.log("userId from app", userId.userId);
        console.log("id from url", id);
        if ( id == userId.userId) {
            history.push("/");
        } else {
            fetch(`/loadotheruserinfo/${id}`)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
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
                <img src={userInfo.profile_pic_url} alt="" />
                <p>
                    {userInfo.firstname} {userInfo.lastname}
                </p>
                <p>{userInfo.bio}</p>
            </div>
            
        </>
    );

}