import ChatMessage from "./chatMessage.js";

import { useSelector } from "react-redux";




export default function ChatBoard({currentChatPartner}) {
    let onlineUsers = useSelector((state) => state.onlineUsers);

    console.log('currentChatPartner', currentChatPartner);
    console.log('state', useSelector((state) => state.chat));
    let messages = useSelector((state) => state.chat[currentChatPartner]);
    console.log('messages in chatboard', messages);
    if (currentChatPartner) {
        var chatPartnerName = onlineUsers.filter((obj) => {return obj.id == currentChatPartner;});
        console.log("chatPartnerName", chatPartnerName[0].firstname);
        chatPartnerName = chatPartnerName[0].firstname + " " + chatPartnerName[0].lastname;
        

    }
    return (
        <>
            

            {currentChatPartner == null && <h3 className="chat-headline">Chat with everyone!</h3> }
            {currentChatPartner != null && <h3 className="chat-headline">Private chat with {chatPartnerName}</h3> }
            <div className="chat-text-window">
                {messages && messages.map(message => <ChatMessage key={message.id} message={message}/>)}

            </div>


        </>);
}