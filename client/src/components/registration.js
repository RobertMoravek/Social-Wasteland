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
        this.setState({[e.currentTarget.name] : e.currentTarget.value})
        // this[e.currentTarget.name] = e.currentTarget.value;
        // console.log(e.currentTarget);
    }

    submitForm(e) {
        e.preventDefault();
        let body = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
        };
        if (!this.checkInputFields(body)){
            setTimeout(() => {
                console.log(this.state.error);
                
            }, 1000);
            // body = JSON.stringify(body);
            // fetch("/register", {
            //     method: "post",
            //     headers: { "Content-Type": "application/json" },
            //     body: body,
            // })
            //     .then((result) => {
            //         return result.json();
            //     })
            //     .then((result) => {
            //         if(!result.error){
            //             location.href = "/";
            //         } else {
            //             this.setState({error : true});
            //             // this.state.error = true;
            //         }
            //     });
        } else {
            console.log('something is missing');
            setTimeout(() => {
                console.log(this.state.error);
            }, 1000);
        }
    }


    checkInputFields() {

        // this.setState({errorData: {
        //     firstName: false,
        //     lastName: false,
        //     email: false,
        //     password: false,
        // }});
        this.setState({error: false});
        console.log("length of firstname", this.state.firstName.length);
        this.setState({ errorData : 
            {firstName : this.state.firstName.length < 2 ? true : false,
                lastName : this.state.lastName.length < 2 ? true : false,
                email : this.state.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? false : true,
                password : this.state.password.length < 8 ? true : false}});
        // this.forceUpdate();
        console.log(this.state.errorData);

        for (let item in this.state.errorData){
            console.log(this.state.errorData[item], item);
            if (this.state.errorData[item]) {
                return true;
            }
        } 
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
                        <label htmlFor="firstName" className={`${!this.state.errorData.firstName ? "" : "error"}`}>First Name</label>
                        <input type="text" name="firstName" onChange={this.changeInputInConstructor} className={`${this.state.errorData.firstName == false ? "" : "red-border"}`}></input>

                        <label htmlFor="lastName" className={`${!this.state.errorData.firstName ? "" : "error"}`}>Last Name</label>
                        <input type="text" name="lastName" onChange={this.changeInputInConstructor} className={`${!this.state.errorData.firstName ? "" : "red-border"}`}></input>

                        <label htmlFor="email" className={`${!this.state.errorData.firstName ? "" : "error"}`}>E-Mail</label>
                        <input type="email" name="email" onChange={this.changeInputInConstructor} className={`${!this.state.errorData.firstName ? "" : "red-border"}`}></input>

                        <label htmlFor="password" className={`${!this.state.errorData.firstName ? "" : "error"}`}>Password</label>
                        <input type="password" name="password" onChange={this.changeInputInConstructor} className={`${!this.state.errorData.firstName ? "" : "red-border"}`}></input>

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