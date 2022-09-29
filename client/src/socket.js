import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { receiveInitialChatMessages, receiveNewChatMessage } from "./components/redux/chat/slice.js";
import { receiveOnlineUsersSlice } from "./components/redux/onlineusers/slice.js";
import { receiveInitialUnreadChatsInfo, receiveNewUnreadChat } from "./components/redux/unreadChatsInfo/slice.js";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("last-10-messages", (messages) => {
            console.log('messages', messages);
            store.dispatch(receiveInitialChatMessages(messages));
        });

        socket.on("unreadChatsInfo", (unreadChatsInfo) => {
            console.log("unreadChatsInfo in socket", unreadChatsInfo);
            store.dispatch(receiveInitialUnreadChatsInfo(unreadChatsInfo));
        });

        socket.on("newUnreadChat", (newUnreadChat) => {
            console.log('newUnreadChat', newUnreadChat);
            store.dispatch(receiveNewUnreadChat(newUnreadChat));
        }),

        socket.on("add-new-message", (message) => {
            console.log('getting new message', message);
            store.dispatch(receiveNewChatMessage(message[0]));
        });
        
        socket.on("onlineusers", (users) => {
            console.log('getting online users', users);
            store.dispatch(receiveOnlineUsersSlice(users));
        });

    }
};
