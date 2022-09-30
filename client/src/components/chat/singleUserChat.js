import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { deleteUnreadChat } from "../redux/unreadChatsInfo/slice";
import { useDispatch } from "react-redux";
import { socket } from "../../socket";

export default function SingleUserChat({ user, changeChatPartner, currentChatPartner }) {
    let unreadChatsInfo = useSelector(state => state.unreadChatsInfo);
    const dispatch = useDispatch();

    // Listen for changes in the unreadChatsInfo (from emits from the server) and if the current chat partner is the new entry in the unreadChatsInfo, then set it to seen
    useEffect(() => {
        if (user.id == currentChatPartner && unreadChatsInfo.includes(user.id)) {
            dispatch(deleteUnreadChat(currentChatPartner));
            socket.emit("markAsSeen", {currentChatPartner: currentChatPartner});
        }
    },[unreadChatsInfo]);

    return (
        <>
            <div className={user.id == currentChatPartner ? "single-online-user highlighted-chat" : "single-online-user"} onClick={()=> changeChatPartner(user.id)}>
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
                {/* If there is a unread message for this user, insert an empty div, which will be shown as red notification arrow */}
                <div className="chat-bubble-icon">💬{unreadChatsInfo.map((item) => {if(item == user.id) {return <div></div>;}})}</div>
            </div>
        </>
    );
}
