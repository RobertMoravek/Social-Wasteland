import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SingleUserChat({ user, changeChatPartner }) {
    let unreadChatsInfo = useSelector(state => state.unreadChatsInfo);
    console.log("pikachu", unreadChatsInfo);
    return (
        <>
            <div className="single-online-user">
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
                        {/* <p className="timestamp">{user.sent_at.slice(11, 16)}</p> */}
                    </div>
                </Link>
                <div className="chat-bubble-icon" onClick={()=> changeChatPartner(user.id)}>💬<span>{unreadChatsInfo.map((item) => {if(item == user.id) {return "X";}})}</span></div>
            </div>
        </>
    );
}
