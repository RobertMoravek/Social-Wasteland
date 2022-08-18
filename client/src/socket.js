import { io } from "socket.io-client";
import { receiveInitialChatMessages, receiveNewChatMessage } from "./components/redux/chat/slice.js";
import { useSelector } from "react-redux";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("last-10-messages", async (messages) => {
            
            store.dispatch(receiveInitialChatMessages(messages));
        });

        socket.on("add-new-message", (message) => {
            console.log('getting new message', message);
            store.dispatch(receiveNewChatMessage(message[0]));
        });
    }
};
