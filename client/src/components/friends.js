import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsSlice, acceptFriendshipSlice, denyFriendshipSlice } from "./redux/friends/slice.js";
import FriendshipButton from "./friendshipButton.js";

export default function Friends() {
    const dispatch = useDispatch();

    let friends = useSelector(
        (state) => state.friends.filter(friend => friend.accepted)
    );
    let friendRequests = useSelector(
        (state) => state.friends.filter(friend => !friend.accepted)
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

    function lowerCaseNames (first, last) {
        first = first.toLowerCase();
        last = last.toLowerCase();
        return `${first} ${last}`;
    }

    
    return (
        <>
            <div className="component ">
                <h2 className="component-headline">friends</h2>
                <div className="component-content friends">

                    <h2 className="subhl">your friends</h2>
                    {friends.map((friend) => (
                        <>
                            <div key={friend.id} >
                                <Link to={"/users/" + friend.id} className="single-profile">
                                    <img
                                        src={friend.profile_pic_url}
                                        alt={friend.firstname}
                                        className="other-profile-image profile-image"
                                    />
                                    <div className="user-info">
                                        <h3>{lowerCaseNames(friend.firstname, friend.lastname)}</h3>
                                        <p>{friend.bio}</p>
                                    </div>
                                </Link>
                            </div>
                            <FriendshipButton id={friend.id} />
                        </>
                    ))}


                    <h2>your friend requests</h2>
                    {friendRequests.map((friend) => (
                        <div key={friend.id}>
                            <Link to={"/users/" + friend.id}>
                                <img
                                    src={friend.profile_pic_url}
                                    alt={friend.firstname}
                                    className="other-profile-image profile-image"
                                />
                                <p>
                                    {friend.firstname} {friend.lastname}
                                </p>
                                <p>{friend.bio}</p>
                            </Link>
                            <FriendshipButton id={friend.id} />
                        </div>
                    ))}

                </div>
            </div>
        </>
    );
    
}