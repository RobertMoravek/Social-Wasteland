import { Link } from "react-router-dom";

export default function SingleUser({ user, changeChatPartner }) {
    return (
        <>
            <div className="single-online-user">
                {/* Link to the user's profile */}
                <Link to={"/users/" + user.id}>
                    <img
                        src={user.profile_pic_url || "./defaultprofile.jpg"}
                        alt=""
                        className="tiny-profile-image"
                    />
                    <div className="username-in-list">
                        <p id="username-online-list">
                            {user.firstname} {user.lastname}
                        </p>
                    </div>
                </Link>

            </div>
        </>
    );
}
