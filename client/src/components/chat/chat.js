import ChatBoard from "./chatBoard.js";
import ChatInput from "./chatInput.js";
import OnlineUsersChat from "../chat/onlineusersChat";
import { socket } from "../../socket";
import { useEffect } from "react";
import { deleteUnreadChat } from "../redux/unreadChatsInfo/slice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


export default function Chat ({toggleChatWindowVisibility, changeChatPartner, currentChatPartner, firstChat, id}) {
    const dispatch = useDispatch();
    let chats = useSelector(state => state.chats);
    
    socket.emit("new-chat", {
        otherUserId: currentChatPartner,
        firstChat: firstChat,
    });

    // useEffect(() => {

    // }, [chats]);

    useEffect(() => {
        if (!firstChat) {
            console.log('current chat partner just changed');
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
                <ChatBoard currentChatPartner={currentChatPartner} />
                <OnlineUsersChat changeChatPartner={changeChatPartner} currentChatPartner={currentChatPartner} id={id}/>
            </div>

            <ChatInput currentChatPartner={currentChatPartner}/>
        </div>
    );
    
}