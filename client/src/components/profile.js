import { Component } from "react";
import ProfilePic from "./profilePic.js";
import BioEditor from "./bioEditor";
import Friends from "./friends.js";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lasstname: "",
        };

        this.lowerCaseNames = this.lowerCaseNames.bind(this);
    }

    lowerCaseNames() {
        let first = this.props.firstNameFromApp.toLowerCase();
        let last = this.props.lastNameFromApp.toLowerCase();
        return `${first} ${last}`;
    }

    render() {
        return (
            <>
                <div className="component profile ">
                    <h2 className="component-headline">profile</h2>
                    <div className="component-content profile">
                        <ProfilePic
                            toggleProfilePicUploader={
                                this.props.toggleProfilePicUploader
                            }
                            imgFromApp={this.props.imgFromApp}
                            firstNameFromApp={this.props.firstNameFromApp}
                            lastNameFromApp={this.props.lastNameFromApp}
                            classmenu="uploadhover"
                        />
                        <div className="user-info">
                            <h3>{this.lowerCaseNames()}</h3>
                            <BioEditor
                                bio={this.props.bio}
                                giveBackBio={this.props.giveBackBio}
                            />
                        </div>
                    </div>
                </div>
                <Friends></Friends>









            </>
        );
    }
}
