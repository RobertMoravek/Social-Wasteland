export default function friendsReducer(chats = [], action) {
    if (action.type == "chats/InitialMessagesReceived") {
        return action.payload;
    } else if (action.type == "chats/NewMessageReceived") {
        return [action.payload, ...chats ];
    } else {
        return chats;
    }
    
    // console.log("friends in if in reducer", friends);

}

export function receiveInitialChatMessages(messages) {
    // console.log("friends in Slice", friends);
    return {
        type: "chats/InitialMessagesReceived",
        payload: messages,
    };
}

export function receiveNewChatMessage(message) {
    // console.log("friends in Slice", friends);
    return {
        type: "chats/NewMessageReceived",
        payload: message,
    };
}

