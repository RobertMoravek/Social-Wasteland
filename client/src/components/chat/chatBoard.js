import ChatMessage from "./chatMessage.js";

import { useSelector } from "react-redux";




export default function ChatBoard({currentChatPartner}) {
    console.log('currentChatPartner', currentChatPartner);
    console.log('state', useSelector((state) => state.chat));
    let messages = useSelector((state) => state.chat[currentChatPartner]);
    console.log('messages in chatboard', messages);
    return (
        <>
            

            {currentChatPartner == null && <h3 className="chat-headline">chat with everyone!</h3> }
            {currentChatPartner != null && <h3 className="chat-headline">private chat with {currentChatPartner}</h3> }
            <div className="chat-text-window">
                {messages && messages.map(message => <ChatMessage key={message.id} message={message}/>)}

            </div>


        </>);
}