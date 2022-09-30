import {Component} from "react";
import {Link} from "react-router-dom";

class Login extends Component {

    constructor () {
        super();
        this.state = {
            email: "",
            password: "",
            error: false,
        };

        this.changeInputInConstructor = this.changeInputInConstructor.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    // One function to change multiple variables. Either really dumb or genius.
    changeInputInConstructor (e) {
        this[e.currentTarget.name] = e.currentTarget.value;
    }

    // Submit the login data for the server to verify
    submitForm(e) {
        e.preventDefault();
        let body = {
            email: this.email,
            password: this.password
        };
        if (this.checkInputFields(body)){
            body = JSON.stringify(body);
            fetch("/login", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: body,
            })
                .then((result) => {
                    return result.json();
                })
                .then((result) => {
                    if(!result.error){
                        location.href = "/";
                    } else {
                        this.setState({error : true});
                        // this.state.error = true;
                    }
                });
        } else {
            console.log('something is missing');
        }
    }


    checkInputFields() {
        // And this is where I'd put my data validation... IF I HAD ONE!!!
        return true;
    }

    render () {
        return (
            <div className="component login">
                <div className="component-headline">
                    <h2>login</h2>
                </div>
                <div className="component-content">
                    <form className="form" name="loginForm" onSubmit={this.submitForm}>
                        <label htmlFor="email">E-Mail</label>
                        <input type="email" name="email" onChange={this.changeInputInConstructor}></input>

                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" onChange={this.changeInputInConstructor}></input>

                        <input type="submit" value="Login"></input>

                        <p className="info">Forgot your password? <Link to="/forgotpassword" className="big">Change it here!</Link></p>
                        <p className="info">Not yet member? <Link to="/" className="big">Register here!</Link></p>

                        {this.state.error && <span className="error big">There was an error while trying to send the data. Please try again!</span>}
                    </form>

                </div>
            </div>
        );
    }
}

export default Login;