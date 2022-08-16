import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsSlice} from "./redux/friends/slice.js";
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
                <div className="component-content friends" id="requests">
                    <h3 className="subhl">friend requests</h3>
                    {friendRequests.length > 0 ? <></> : <><p>You have no friend requests at the moment.</p><Link to="/users"><button>Find friends!</button></Link></> }
                    {friendRequests.map((friend) => (
                        <div key={friend.id}>
                            <div>
                                <Link
                                    to={"/users/" + friend.id}
                                    className="single-profile"
                                >
                                    <img
                                        src={friend.profile_pic_url}
                                        alt={friend.firstname}
                                        className="other-profile-image profile-image"
                                    />
                                    <div className="user-info">
                                        <h3>
                                            {lowerCaseNames(
                                                friend.firstname,
                                                friend.lastname
                                            )}
                                        </h3>
                                        <p className="bioText bioEditor">
                                            {friend.bio}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                            <FriendshipButton id={friend.id} />
                        </div>
                    ))}

                    <h3 className="subhl extra-top-margin">your friends</h3>
                    {friends.map((friend) => (
                        <div key={friend.id}>
                            <div >
                                <Link
                                    to={"/users/" + friend.id}
                                    className="single-profile"
                                >
                                    <img
                                        src={friend.profile_pic_url}
                                        alt={friend.firstname}
                                        className="other-profile-image profile-image"
                                    />
                                    <div className="user-info">
                                        <h3>
                                            {lowerCaseNames(
                                                friend.firstname,
                                                friend.lastname
                                            )}
                                        </h3>
                                        <p className="bioText bioEditor">
                                            {friend.bio}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                            <FriendshipButton id={friend.id} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
    
}