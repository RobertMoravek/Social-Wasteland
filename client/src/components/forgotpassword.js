import { Component } from "react";
import { Link } from "react-router-dom";

export class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            view: 1,
            email: null,
            resetCode: "",
            password: null,
            error: false,
        };
        this.changeInputInConstructor = this.changeInputInConstructor.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    currentView() {
        if (this.state.view === 1) {
            return (
                <div className="component reset-password">
                    <div className="component-headline">
                        <h2>Reset</h2>
                    </div>
                    <div className="component-content">
                        <form
                            name="resetPasswordEmail"
                            onSubmit={this.submitForm}
                            className="form"
                        >
                            <label htmlFor="email">Your e-mail adress</label>
                            <input type="email" name="email" id="email"  onChange={this.changeInputInConstructor}/>
                            <input type="submit" value="Request new password" />
                        </form>
                        {this.state.error && <span className="error big">There was an error while trying to send the data. Please try again!</span>}
                    </div>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <div className="component reset-password">
                    <div className="component-headline">
                        <h2>Reset</h2>
                    </div>
                    <div className="component-content">
                        <form name="resetPasswordCode" onSubmit={this.submitForm} className="form">
                            <label htmlFor="reset-code">Your reset code</label>
                            <input type="text" name="resetCode" id="reset-code" maxLength={6}  onChange={this.changeInputInConstructor} autoComplete="off" />
                            <input type="submit" value="Submit code" />
                        </form>
                        {this.state.error && <span className="error big">There was an error while trying to send the data. Please try again!</span>}
                    </div>
                </div>
            );
        } else if (this.state.view === 3) {
            return (
                <div className="component reset-password">
                    <div className="component-headline">
                        <h2>Reset</h2>
                    </div>
                    <div className="component-content">
                        <form name="createNewPassword" onSubmit={this.submitForm} className="form">
                            <label htmlFor="new-password">
                                Please enter a new password
                            </label>
                            <input type="password" name="password" id="password"  onChange={this.changeInputInConstructor}/>
                            <input type="submit" value="Submit" />
                        </form>
                        {this.state.error && <span className="error big">There was an error while trying to send the data. Please try again!</span>}
                    </div>
                </div>
            );
        } else if (this.state.view === 4) {
            return (
                <div className="component reset-password">
                    <div className="component-headline">
                        <h2>Reset</h2>
                    </div>
                    <div className="component-content">
                        <h3>You successfully changed your password!</h3>
                        <Link to="/login">Now go and use it to login.</Link>
                    </div>
                </div>
            );
        }
    }

    submitForm(e) {
        e.preventDefault();
        let body = null;
        console.log(this);
        switch (e.currentTarget.name) {
                        case "resetPasswordEmail":
                            this.setState({ error: false });
                            body = {email: this.state.email};
                            body = JSON.stringify(body);
                            fetch("/checkandsendmailfornewpassword", {
                                method: "post",
                                headers: { "Content-Type": "application/json" },
                                body: body,
                            })
                                .then((result) => {
                                    return result.json();
                                })
                                .then((result) => {
                                    if (result.emailExists) {
                                        this.setState({view: 2});
                                    } else {
                                        this.setState({ error: true });
                                        // this.state.error = true;
                                    }
                                });
                            break;
                        case "resetPasswordCode":
                            this.setState({ error: false });
                            body = { email: this.state.email, code: this.state.resetCode };
                            body = JSON.stringify(body);
                            fetch("/checkcode", {
                                method: "post",
                                headers: { "Content-Type": "application/json" },
                                body: body,
                            })
                                .then((result) => {
                                    return result.json();
                                })
                                .then((result) => {
                                    if (result.codecorrect) {
                                        this.setState({ view: 3 });
                                    } else {
                                        this.setState({ error: true });
                                        // this.state.error = true;
                                    }
                                });
                            break;
                        case "createNewPassword":
                            this.setState({ error: false });
                            body = { email: this.state.email, password: this.state.password };
                            body = JSON.stringify(body);
                            fetch("/updatepassword", {
                                method: "post",
                                headers: { "Content-Type": "application/json" },
                                body: body,
                            })
                                .then((result) => {
                                    return result.json();
                                })
                                .then((result) => {
                                    if (result.passwordChanged) {
                                        this.setState({ view: 4 });
                                    } else {
                                        this.setState({ error: true });
                                        // this.state.error = true;
                                    }
                                });
                            break;
        }
    }

    changeInputInConstructor(e) {
        this.setState({[e.currentTarget.name] : e.currentTarget.value});
    }

    render() {
        return <div>{this.currentView()}</div>;
    }
}