import {Component} from "react";
import Registration from "./registration.js";
import Login from "./login.js";
import {ForgotPassword} from "./forgotpassword.js";

import {BrowserRouter, Route} from "react-router-dom";

class Welcome extends Component {

    // Route for all logged out pages

    render () {
        return (
            <>
                <h1 className="site-headline">the social wasteland</h1>
                <section>
                    <BrowserRouter>
                        <Route exact path="/">
                            <Registration />
                        </Route>
                        <Route exact path="/login">
                            <Login />
                        </Route>
                        <Route exact path="/forgotpassword">
                            <ForgotPassword />
                        </Route>
                    </BrowserRouter>
                </section>
            </>
        );
    }
}

export default Welcome;