import ChatBoard from "./chatBoard.js";
import ChatInput from "./chatInput.js";
import OnlineUsers from "../onlineusers/onlineusers";
import { socket } from "../../socket";

export default function Chat ({toggleChatWindowVisibility, changeChatPartner, currentChatPartner}) {
    console.log("Chat partner", currentChatPartner);

    socket.emit("new-chat", {
        otherUserId: currentChatPartner,
    });

    return (
        <div className="chat-window">
            <div id="chat-closer" onClick={toggleChatWindowVisibility}>
                X
            </div>
            <div className="chat-board">
                <ChatBoard currentChatPartner={currentChatPartner} />
                <OnlineUsers changeChatPartner={changeChatPartner}/>
            </div>

            <ChatInput currentChatPartner={currentChatPartner}/>
        </div>
    );
    
}