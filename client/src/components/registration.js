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

    // One function to change multiple variables
    changeInputInConstructor (e) {
        this.setState({[e.currentTarget.name] : e.currentTarget.value});
    }

    submitForm(e) {
        e.preventDefault();
        let body = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password
        };
        if (this.checkInputFields()){
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


    async checkInputFields() {
        // let error = false;
        // // this.setState({errorData: {
        // //     firstName: false,
        // //     lastName: false,
        // //     email: false,
        // //     password: false,
        // // }});
        // // this.setState({error: false});
        // console.log("state", this.state);
        // this.setState({ errorData : 
        //     {firstName : this.state.firstName.length < 2 ? true : false,
        //         lastName : this.state.lastName.length < 2 ? true : false,
        //         email : this.state.email.length < 4 ? true : false,
        //         password : this.state.password.length < 8 ? true : false}});
        // // this.forceUpdate();
        // console.log("await errordata", await this.state.errorData);

        // for (let item in this.state.errorData){
        //     // console.log(this.state.errorData[item], item);
        //     if (this.state.errorData[item]) {
        //         return true;

        //     }
        // } 
        // console.log(error);
        // return false;
        return false;
    }

    render () {
        return (
            <div className="component registration">
                <div className="component-headline">
                    <h2>registration</h2>
                </div>
                <div className="component-content">
                    <form className="form" name="registrationForm" onSubmit={this.submitForm}>
                        <label htmlFor="firstName" className={!this.state.errorData.firstName ? "" : "error"}>First Name</label>
                        <input type="text" name="firstName" onChange={this.changeInputInConstructor} className={!this.state.errorData.firstName ? "" : "red-border"}></input>

                        <label htmlFor="lastName" className={!this.state.errorData.firstName ? "" : "error"}>Last Name</label>
                        <input type="text" name="lastName" onChange={this.changeInputInConstructor} className={!this.state.errorData.firstName ? "" : "red-border"}></input>

                        <label htmlFor="email" className={!this.state.errorData.firstName ? "" : "error"}>E-Mail</label>
                        <input type="email" name="email" onChange={this.changeInputInConstructor} className={!this.state.errorData.firstName ? "" : "red-border"}></input>

                        <label htmlFor="password" className={!this.state.errorData.firstName ? "" : "error"}>Password</label>
                        <input type="password" name="password" onChange={this.changeInputInConstructor} className={!this.state.errorData.firstName ? "" : "red-border"}></input>

                        <input type="submit" value="Register"></input>

                        <p>Already a member? <Link to="/login" className="big">Log in here!</Link></p>

                        {this.state.error && <span className="error big">There was an error while trying to send the data. Please try again!</span>}
                    </form>

                </div>
            </div>
        );
    }
}

export default Registration;