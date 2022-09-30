import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProfilePic({
    toggleProfilePicUploader,
    imgFromApp,
    firstNameFromApp,
    lastNameFromApp,
    classmenu,
}) {
    let [numOfRequests, setNumOfRequests] = useState(0);

    // On mount get the number of unanswered friendship requests
    useEffect(() => {
        (async () => {
            const res = await fetch("/getnumofrequests");
            const data = await res.json();
            setNumOfRequests(data.rows[0].count);
        })();
    }, []);

    let alt = `${firstNameFromApp} ${lastNameFromApp}`;
    imgFromApp = imgFromApp || "../defaultprofile.jpg";
    return (
        <>
            <Link to="/">
                <img
                    src={imgFromApp}
                    alt={alt}
                    className={`profile-image ${classmenu}`}
                    onClick={toggleProfilePicUploader}
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
