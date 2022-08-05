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

    changeInputInConstructor (e) {
        this[e.currentTarget.name] = e.currentTarget.value;
    }

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
        // does nothing yet
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

                        <p>Forgot your password? <Link to="/forgotpassword">Change it here!</Link></p>
                        <p>Not yet member? <Link to="/">Register here!</Link></p>

                        {this.state.error && <span className="error big">There was an error while trying to send the data. Please try again!</span>}
                    </form>

                </div>
            </div>
        );
    }
}

export default Login;