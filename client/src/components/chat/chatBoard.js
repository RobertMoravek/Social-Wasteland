import ChatMessage from "./chatMessage.js";
import { useSelector } from "react-redux";




export default function ChatBoard() {

    let messages = useSelector((state) => state.chat);
    console.log(messages.map(message => message.id));

    console.log('messages', messages);
    return (<>
        <div className="chat-board">
            {messages && messages.map(message => <ChatMessage key={message.id} message={message}/>)}
        </div>
    </>);
}