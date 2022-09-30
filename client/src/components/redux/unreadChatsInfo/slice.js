export default function unreadChatsInfoReducer(unreadChatsInfo = [], action) {
    if (action.type == "chats/InitialUnreadChatsInfoReceived" ) {
        return (action.payload);
    } else if (action.type == "chats/NewUnreadChatReceived") {
        return ([...unreadChatsInfo, action.payload]);
    } else if (action.type == "chats/DeleteUnreadChat") {
        return (unreadChatsInfo.filter(id => {return id!=action.payload;}));
    }
    return unreadChatsInfo;

}


export function receiveInitialUnreadChatsInfo(unreadChatsInfo) {
    return {
        type: "chats/InitialUnreadChatsInfoReceived",
        payload: unreadChatsInfo,
    };
}

export function receiveNewUnreadChat(newUnreadChat) {
    return {
        type: "chats/NewUnreadChatReceived",
        payload: newUnreadChat,
    };
}

export function deleteUnreadChat(userId) {
    return {
        type: "chats/DeleteUnreadChat",
        payload: userId,
    };
}