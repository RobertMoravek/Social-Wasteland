import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsSlice, acceptFriendshipSlice, denyFriendshipSlice } from "./redux/friends/slice.js";

export default function Friends() {
    const dispatch = useDispatch();
    let friends = useSelector(
        (state) => {return state.friends;}
    );
    useEffect(() => {
        
        (async () => {
            const res = await fetch("/getallfriends");
            const data = await res.json();
            // this line right here starts the process of adding info to Redux!!
            // receiveCharacters is an action creator - function that returns an action
            dispatch(receiveFriendsSlice(data.rows));
        })();
        
    }, []);

    if (!friends) {
        return null;
    }
    
    const acceptFriendship = async (id) => {
        // console.log("clicked on hot button", id);
        const res = await fetch(`/acceptfriendship/${id}`, { method: "POST" });
        const data = await res.json();
        dispatch(acceptFriendshipSlice(id));
    };
    
    const denyFriendship = async (id) => {
        // console.log("clicked on hot button", id);
        const res = await fetch(`/cancelfriendship/${id}`, { method: "POST" });
        const data = await res.json();
        dispatch(denyFriendshipSlice(id));
    };
    
    console.log("friends before return", friends);
    return (
        <div className="userSearchResults">
            <h2>your friends</h2>
            {friends.map((friend) => (
                <div key={friend.id}>
                    <Link to={"/users/" + friend.id}>
                        <img src={friend.profile_pic_url} alt="" />
                        <p>
                            {friend.firstname} {friend.lastname}
                        </p>
                    </Link>
                </div>
            ))}
        </div>
    );
    
}