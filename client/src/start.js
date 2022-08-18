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

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            init(store);
            ReactDOM.render(<Provider store={store}><App /></Provider>, document.querySelector("main"));
        }
    })
    .catch(() => {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    });
