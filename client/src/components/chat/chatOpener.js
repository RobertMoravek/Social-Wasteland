export default function ChatOpener ({toggleChatWindowVisibility, closeOnlineUsers, firstChat, firstChatToggler}) {

    function openAndClose() {
        toggleChatWindowVisibility();
        closeOnlineUsers();
        setTimeout(() => {
            if (firstChat) {
                firstChatToggler();
            }
            
        }, 1000);
    }

    return (
        <>
            <button className="chat-opener" onClick={openAndClose}>Chat</button>
        </>
    );
}