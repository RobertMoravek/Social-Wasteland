import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SingleUser from "./singleUser.js";

export default function OnlineUsers ({changeChatPartner}) {
    let onlineUsers = useSelector((state) => state.onlineUsers);
    return (
        <>
            <div className="online-users-list">
                {onlineUsers.map((user) => (
                    <SingleUser
                        key={user.id}
                        user={user}
                        changeChatPartner={changeChatPartner}
                    />
                ))}
            </div>
        </>
    );
}