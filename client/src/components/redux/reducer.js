import { combineReducers } from "redux";
import friendsReducer from "./friends/slice.js";
import chatReducer from "./chat/slice.js";

const rootReducer = combineReducers({
    friends: friendsReducer,
    chat: chatReducer,
});

export default rootReducer;
