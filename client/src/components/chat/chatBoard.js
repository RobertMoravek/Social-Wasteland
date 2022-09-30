import ChatMessage from "./chatMessage.js";

import { useSelector } from "react-redux";

export default function ChatBoard({currentChatPartner}) {
    let onlineUsers = useSelector((state) => state.onlineUsers);
    let messages = useSelector((state) => state.chat[currentChatPartner]);


    // If the chat partner is not null (not the main chat room), extract the name of your chat partner to display it at top of chat
    if (currentChatPartner) {
        var chatPartnerName = onlineUsers.filter((obj) => {return obj.id == currentChatPartner;});
        chatPartnerName = chatPartnerName[0].firstname + " " + chatPartnerName[0].lastname;
    }

    return (
        <>
            {currentChatPartner == null && <h3 className="chat-headline">Chat with everyone!</h3> }
            {currentChatPartner != null && <h3 className="chat-headline">Private chat with {chatPartnerName}</h3> }
            <div className="chat-text-window">
                {/* For every message in the chat, create a chat message component */}
                {messages && messages.map(message => <ChatMessage key={message.id} message={message}/>)}
            </div>
        </>);
}