export default function friendsReducer(friends = [], action) {
    if (action.type == "friends/received") {
        friends = action.payload.friends;
    } else if (action.type == "friends/accepted") {
        friends = friends.map((friend) => {
            if (friend.id == action.payload.id) {
                return (friend.accepted = true);
            } else {
                return friend;
            }
        });
    } else if (action.type == "friends/denied") {
        friends = friends.filter((friend) => {
            friend.id != action.payload.id;
        });
    }
    
    // console.log("friends in if in reducer", friends);


    return friends;
}

export function receiveFriendsSlice(friends) {
    // console.log("friends in Slice", friends);
    return {
        type: "friends/received",
        payload: { friends },
    };
}

export function acceptFriendshipSlice(id) {
    return {
        type: "friends/accepted",
        payload: { id },
    };
}

export function denyFriendshipSlice(id) {
    return {
        type: "friends/denied",
        payload: { id },
    };
}