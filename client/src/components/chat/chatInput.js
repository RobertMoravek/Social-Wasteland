import { socket } from '../../socket';
import { useState } from 'react';

export default function ChatInput ({currentChatPartner}) {

    let [inputField, setInputField] = useState("");

    // Send message with Enter key, if there is a chat message, then delete input
    function sendChatMessageEnter(e) {
        if (e.key == "Enter" && inputField != "" && !e.shiftKey) {
            e.preventDefault();
            socket.emit("new-message", {
                message: inputField,
                otherUserId: currentChatPartner,
            });
            deleteInput();
        // prevent Enter key from generating new line
        } else if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
        }
    }

    // Send message via send button, then delete input
    function sendChatMessage(e) {
        if (inputField != "") {
            socket.emit("new-message", {
                message: inputField,
                otherUserId: currentChatPartner,
            });
        }
        deleteInput();
    }

    // Delete input field and variable
    function deleteInput() {
        document.getElementById("chat-input").value = null;
        setInputField("");
    }


    return (<>
        <div className="chat-input">
            <textarea name="chatInput" id="chat-input" placeholder="Enter your message here" cols="30" rows="1" onKeyDown={sendChatMessageEnter} onChange={e => setInputField(e.currentTarget.value)}></textarea>
            <button id="chat-send" onClick={sendChatMessage}>Send</button>
        </div>
    </>);
}