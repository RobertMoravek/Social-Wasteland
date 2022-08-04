import {Component} from "react";
import Registration from "./registration.js";
import Login from "./login.js";
import {ForgotPassword} from "./forgotpassword.js";

import {BrowserRouter, Route} from "react-router-dom";

class Welcome extends Component {


    render () {
        return (
            <>
                <h1 className="site-headline">Welcome</h1>
                <BrowserRouter>
                    <Route exact path="/">
                        <Registration/>
                    </Route>
                    <Route exact path="/login">
                        <Login/>
                    </Route>
                    <Route exact path="/forgotpassword">
                        <ForgotPassword/>
                    </Route>
                </BrowserRouter>
            </>
        );
    }
}

export default Welcome;