import { io } from "socket.io-client";
import { receiveInitialChatMessages, receiveNewChatMessage } from "./components/redux/chat/slice.js";
import { receiveOnlineUsersSlice } from "./components/redux/onlineusers/slice.js";
import { receiveInitialUnreadChatsInfo, receiveNewUnreadChat } from "./components/redux/unreadChatsInfo/slice.js";

export let socket;

// Create a socket connection, listen for the events and dispatch the received data to the reux store

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("last-10-messages", (messages) => {
            store.dispatch(receiveInitialChatMessages(messages));
        });

        socket.on("unreadChatsInfo", (unreadChatsInfo) => {
            store.dispatch(receiveInitialUnreadChatsInfo(unreadChatsInfo));
        });

        socket.on("newUnreadChat", (newUnreadChat) => {
            store.dispatch(receiveNewUnreadChat(newUnreadChat));
        }),

        socket.on("add-new-message", (message) => {
            store.dispatch(receiveNewChatMessage(message[0]));
        });
        
        socket.on("onlineusers", (users) => {
            store.dispatch(receiveOnlineUsersSlice(users));
        });

    }
};
