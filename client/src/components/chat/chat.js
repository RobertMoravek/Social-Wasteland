import ChatBoard from "./chatBoard.js";
import ChatInput from "./chatInput.js";
import OnlineUsersChat from "../chat/onlineusersChat";
import { socket } from "../../socket";
import { useEffect } from "react";
import { deleteUnreadChat } from "../redux/unreadChatsInfo/slice.js";
import { useDispatch } from "react-redux";



export default function Chat ({toggleChatWindowVisibility, changeChatPartner, currentChatPartner, firstChat, id}) {
    const dispatch = useDispatch();
    
    // Emit new chat to server, so it can fetch the messages
    socket.emit("new-chat", {
        otherUserId: currentChatPartner,
        firstChat: firstChat,
    });

    // When the chat partner changes and it's not the first chat, mark the messages of that chat as read in the store and on the server
    useEffect(() => {
        if (!firstChat) {
            dispatch(deleteUnreadChat(currentChatPartner));
            socket.emit("markAsSeen", {currentChatPartner: currentChatPartner});
        }
    }, [currentChatPartner]);

    return (
        <div className="chat-window">
            <div id="chat-closer" onClick={toggleChatWindowVisibility}>
                X
            </div>
            <div className="chat-board">
                {/* Show messages */}
                <ChatBoard currentChatPartner={currentChatPartner} /> 
                {/* Show online users */}
                <OnlineUsersChat changeChatPartner={changeChatPartner} currentChatPartner={currentChatPartner} id={id}/>
            </div>
            {/* Show input field */}
            <ChatInput currentChatPartner={currentChatPartner}/>
        </div>
    );
    
}