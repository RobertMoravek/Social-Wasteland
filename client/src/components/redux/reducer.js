import { combineReducers } from "redux";
import friendsReducer from "./friends/slice.js";
import chatReducer from "./chat/slice.js";
import onlineUsersReducer from "./onlineusers/slice.js";

const rootReducer = combineReducers({
    friends: friendsReducer,
    chat: chatReducer,
    onlineUsers: onlineUsersReducer,

});

export default rootReducer;
