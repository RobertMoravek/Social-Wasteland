import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SingleUser from "./singleUser.js";

export default function Menu () {
    let onlineUsers = useSelector((state) => state.onlineUsers);
    console.log(onlineUsers);
    return (
        <>
            <div className="online-users-list">
                {onlineUsers.map(user => <SingleUser key={user.id} user={user}/>)}
            </div>
        </>
    );
}