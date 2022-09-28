export default function ChatOpener ({toggleChatWindowVisibility, closeOnlineUsers}) {

    function openAndClose() {
        toggleChatWindowVisibility();
        closeOnlineUsers();
    }

    return (
        <>
            <button className="chat-opener" onClick={openAndClose}>Chat</button>
        </>
    );
}