import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SingleUserChat from "./singleUserChat.js";

export default function OnlineUsersChat ({changeChatPartner, currentChatPartner, id}) {
    let onlineUsers = useSelector((state) => state.onlineUsers);
    console.log("onlineusers", onlineUsers);
    return (
        <>
            <div className="online-users-list">
                <div className={!currentChatPartner ? "single-online-user highlighted-chat" : "single-online-user"}>
                    <img
                        src="./defaultprofile.jpg"
                        alt=""
                        className="tiny-profile-image"
                    />
                    <div className="username-in-list">
                        <p id="username-online-list">
                            MAIN CHAT ROOM
                        </p>
                        {/* <p className="timestamp">{user.sent_at.slice(11, 16)}</p> */}
                    </div>
                    <div
                        className="chat-bubble-icon"
                        onClick={() => changeChatPartner(null)}
                    >
                        💬
                    </div>
                </div>

                {onlineUsers.map((user) => (
                    id != user.id &&
                    <SingleUserChat
                        key={user.id}
                        user={user}
                        changeChatPartner={changeChatPartner}
                        currentChatPartner={currentChatPartner}
                    />
                ))}
            </div>
        </>
    );
}