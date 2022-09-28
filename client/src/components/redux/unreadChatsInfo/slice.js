export default function unreadChatsInfoReducer(unreadChatsInfo = [], action) {
    if (action.type == "chats/InitialUnreadChatsInfoReceived" && action.payload.length > 0) {
        return (action.payload);
    } else {
        return [];
    }
}


export function receiveInitialUnreadChatsInfo(unreadChatsInfo) {
    return {
        type: "chats/InitialUnreadChatsInfoReceived",
        payload: unreadChatsInfo,
    };
}