import ChatBoard from "./chatBoard.js";
import ChatInput from "./chatInput.js";

export default function Chat ({toggleChatWindowVisibility}) {

    return (
        <div className="chat-window">
            <div id="chat-closer" onClick={toggleChatWindowVisibility}>
                X
            </div>
            <ChatBoard />
            <ChatInput />
        </div>
    );
    
}