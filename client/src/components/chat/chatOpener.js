export default function ChatOpener ({toggleChatWindowVisibility, closeOnlineUsers, firstChat, firstChatToggler}) {

    // Toogles chat window open and closed, closes online users list in the process
    function openAndClose() {
        toggleChatWindowVisibility();
        closeOnlineUsers();
        // If it's the first chat of the session, toggle the first chat variable (with a delay to accomodate for... something.)
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