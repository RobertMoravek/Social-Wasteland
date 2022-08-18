import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsSlice } from "./redux/friends/slice.js";

export default function ProfilePic({
    openProfilePicUploader,
    imgFromApp,
    firstNameFromApp,
    lastNameFromApp,
    classmenu,
}) {
    let [numOfRequests, setNumOfRequests] = useState(0);

    useEffect(() => {
        (async () => {
            const res = await fetch("/getnumofrequests");
            const data = await res.json();
            // this line right here starts the process of adding info to Redux!!
            // receiveCharacters is an action creator - function that returns an action
            setNumOfRequests(data.rows[0].count);
            console.log(numOfRequests);
        })();
    }, []);
    // console.log("PROPS in profilePic: ", props);
    let alt = `${firstNameFromApp} ${lastNameFromApp}`;
    imgFromApp = imgFromApp || "../defaultprofile.jpg";
    return (
        <>
            <Link to="/">
                <img
                    src={imgFromApp}
                    alt={alt}
                    className={`profile-image ${classmenu}`}
                    onClick={openProfilePicUploader}
                />
            </Link>
            {numOfRequests > 0 ? <Link to="/friends">
                <div className="info-num">{numOfRequests}</div>
            </Link> : <Link to="/friends">
                <div className="info-num gray">{numOfRequests}</div>
            </Link>}
            
        </>
    );
}
