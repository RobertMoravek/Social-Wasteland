export default function chatReducer(chats = {}, action) {
    console.log("action payload", action.payload);
    if (action.type == "chats/InitialMessagesReceived" && action.payload.length > 0) {
        console.log('first if');
        return {...chats, [action.payload[0].otherUserId]: action.payload};
        
    } else if (action.type == "chats/InitialMessagesReceived" && action.payload.length == 0) {
        return {...chats};
    } else if (action.type == "chats/NewMessageReceived") {
        return { ...chats, [action.payload.otherUserId]: [action.payload, ...chats[action.payload.otherUserId]] };
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
    // console.log("eieieiei", message);
    return {
        type: "chats/NewMessageReceived",
        payload: message,
    };
}

