import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./components/redux/reducer.js";
import { Provider } from "react-redux";
import {init} from "./socket.js";

import ReactDOM from "react-dom";
import Welcome from "./components/welcome.js";
import { App } from "./components/app.js";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

// Try to fetch the userId (only exists if user is logged in)
fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        // If it doesn't exist show the Welcome component
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        // Otherwise show the app
        } else {
            init(store);
            ReactDOM.render(<Provider store={store}><App /></Provider>, document.querySelector("main"));
        }
    })
    // If something went wrong, be safe and show the Welcome component
    .catch(() => {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    });
