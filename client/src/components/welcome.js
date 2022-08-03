import {Component} from "react";
import Registration from "./registration.js";

class Welcome extends Component {


    render () {
        return (
            <>
                <h1 className="siteHeadline">Welcome</h1>
                <Registration/>
            </>
        );
    }
}

export default Welcome;