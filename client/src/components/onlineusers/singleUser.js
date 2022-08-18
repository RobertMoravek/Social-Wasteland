import { Link } from "react-router-dom";

export default function SingleUser({user}) {
    return (
        <>
            <Link to={"/users/" + user.id}>
                <div className="single-online-user">
                    <img
                        src={user.profile_pic_url || "./defaultprofile.jpg"}
                        alt=""
                        className="tiny-profile-image"
                    />
                    <div className="chatTextSection">
                        <p id="username-online-list">
                            {user.firstname} {user.lastname}
                        </p>
                        {/* <p className="timestamp">{user.sent_at.slice(11, 16)}</p> */}
                    </div>
                </div>
            </Link>
        </>
    );
    
}