export default function chatReducer(chats = {}, action) {
    if (action.type == "chats/InitialMessagesReceived" && action.payload.length > 0) {
        return {...chats, [action.payload[0].otherUserId]: action.payload};

    // When the payload is empty... (I think I stopped that from happeing on the server)
    } else if (action.type == "chats/InitialMessagesReceived" && action.payload.length == 0) {
        return {...chats};

    } else if (action.type == "chats/NewMessageReceived") {
        return { ...chats, [action.payload.otherUserId]: [action.payload, ...chats[action.payload.otherUserId]] };

    } else {
        return chats;
    }
}

export function receiveInitialChatMessages(messages) {
    return {
        type: "chats/InitialMessagesReceived",
        payload: messages,
    };
}

export function receiveNewChatMessage(message) {
    return {
        type: "chats/NewMessageReceived",
        payload: message,
    };
}

