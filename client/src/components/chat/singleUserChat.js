import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteUnreadChat } from "../redux/unreadChatsInfo/slice";
import { useDispatch } from "react-redux";

export default function SingleUserChat({ user, changeChatPartner, currentChatPartner }) {
    let unreadChatsInfo = useSelector(state => state.unreadChatsInfo);
    const dispatch = useDispatch();
    console.log("pikachu", unreadChatsInfo);

    useEffect(() => {
        console.log("user, currentPartner", user, currentChatPartner);
        if (user.id == currentChatPartner && unreadChatsInfo.includes(user.id)) {
            console.log('in if currentPartner', currentChatPartner);
            dispatch(deleteUnreadChat(currentChatPartner));
        }
    },[unreadChatsInfo]);

    return (
        <>
            <div className={user.id == currentChatPartner ? "single-online-user highlighted-chat" : "single-online-user"}>
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
                <div className="chat-bubble-icon" onClick={()=> changeChatPartner(user.id)}>💬{unreadChatsInfo.map((item) => {if(item == user.id) {return <div></div>;}})}</div>
            </div>
        </>
    );
}
