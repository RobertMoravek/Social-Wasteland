import {Component} from "react";
import {Link} from "react-router-dom";

class Registration extends Component {

    constructor () {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            error: false,
            errorData: {
                firstName: false,
                lastName: false,
                email: false,
                password: false,
            }

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
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
        };
        if (this.checkInputFields(body)){
            body = JSON.stringify(body);
            fetch("/register", {
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
        this.errorData.firstName = this.state.firstName.length < 2 ? true : false;
        this.errorData.lastName = this.state.lastName.length < 2 ? true : false;
        this.errorData.email = this.state.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? false : true;
        this.errorData.password = this.state.lastName.length < 8 ? true : false;
        for (let item in this.errorData){
            if (!item){
                return false;
            }
        }
        return true;
    }

    render () {
        return (
            <div className="component registration">
                <div className="component-headline">
                    <h2>registration</h2>
                </div>
                <div className="component-content">
                    <form className="form" name="registrationForm" onSubmit={this.submitForm}>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" name="firstName" onChange={this.changeInputInConstructor}></input>

                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" name="lastName" onChange={this.changeInputInConstructor}></input>

                        <label htmlFor="email">E-Mail</label>
                        <input type="email" name="email" onChange={this.changeInputInConstructor}></input>

                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" onChange={this.changeInputInConstructor}></input>

                        <input type="submit" value="Register"></input>

                        <p>Already a member? <Link to="/login">Log in here!</Link></p>

                        {this.state.error && <span className="error big">There was an error while trying to send the data. Please try again!</span>}
                    </form>

                </div>
            </div>
        );
    }
}

export default Registration;