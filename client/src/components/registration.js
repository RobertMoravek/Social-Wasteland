import {Component} from "react";

class Registration extends Component {

    constructor () {
        super();
        this.state = {
            firstName: "",
            lastName: "",
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
                        location.reload();
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
        return true;
    }

    render () {
        return (
            <form className="registration" name="registrationForm" onSubmit={this.submitForm}>
                <h2>Registration</h2>
                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" onChange={this.changeInputInConstructor}></input>

                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName" onChange={this.changeInputInConstructor}></input>

                <label htmlFor="email">E-Mail</label>
                <input type="email" name="email" onChange={this.changeInputInConstructor}></input>

                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={this.changeInputInConstructor}></input>

                <input type="submit" value="Register"></input>

                <p>Already a member? <a href="/">Log in here!</a></p>

                {this.state.error && <span className="error big">There was an error while trying to send the data. Please try again!</span>}
            </form>
        );
    }
}

export default Registration;