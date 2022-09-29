
import { socket } from '../../socket';

import { useState } from 'react';

export default function ChatInput ({currentChatPartner}) {

    

    let [inputField, setInputField] = useState("");

    function sendChatMessageEnter(e) {
        if (e.key == "Enter" && inputField != "" && !e.shiftKey) {
            e.preventDefault();
            socket.emit("new-message", {
                message: inputField,
                otherUserId: currentChatPartner,
            });
            deleteInput();
        } else if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
        }

    }
    function sendChatMessage(e) {
        if (inputField != "") {
            socket.emit("new-message", {
                message: inputField,
                otherUserId: currentChatPartner,
            });
        }
        deleteInput();
    }

    function deleteInput() {
        document.getElementById("chat-input").value = null;
        setInputField("");
    }


    return (<>
        <div className="chat-input">
            <textarea name="chatInput" id="chat-input" placeholder="Enter your message here" cols="30" rows="1" onKeyDown={sendChatMessageEnter} onChange={e => setInputField(e.currentTarget.value)}></textarea>
            {/* <input type="text" name="chatInput" id="chat-input" placeholder="Enter your message here" onKeyDown={sendChatMessageEnter} onChange={e => setInputField(e.currentTarget.value)}></input> */}
            <button id="chat-send" onClick={sendChatMessage}>Send</button>
        </div>
    </>);
}