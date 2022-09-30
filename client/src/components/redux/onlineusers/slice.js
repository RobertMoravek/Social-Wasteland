export default function onlineUsersReducer(onlineUsers = [], action) {
    if (action.type == "onlineusers/received") {
        return action.payload;
    } else { 
        return onlineUsers;
    }
}

export function receiveOnlineUsersSlice(users) {
    return {
        type: "onlineusers/received",
        payload: users,
    };
}
