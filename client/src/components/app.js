import { Component } from "react";
import ProfilePic from "./profilePic.js";
import {ProfilePicUploader} from "./profilePicUploader.js";

// import { Link } from "react-router-dom";

export class App extends Component {
    constructor() {
        super();
        this.state = {
            isProfileUploaderVisible: false,
            firstName: "",
            lastName: "",
            email: "",
            profilePicUrl: "",
        };

        this.openProfilePicUploader = this.openProfilePicUploader.bind(this);
        this.getUpdatetProfileUrl = this.getUpdatetProfileUrl.bind(this);
    }

    openProfilePicUploader() {
        this.setState({isProfileUploaderVisible: !this.state.isProfileUploaderVisible});
    }

    componentDidMount() {
        fetch("/loaduserinfo")
            .then((response) => response.json())
            .then((result) => {
                if (!result.error) {
                    // console.log("loaded user info");
                    this.setState({
                        firstName: result.firstname,
                        lastName: result.lastname,
                        email: result.email,
                        profilePicUrl: result.profile_pic_url
                    });
                    // console.log(this.state);
                } else {
                    console.log("loading user info failed");
                    // location.reload();
                    // this.state.error = true;
                }
            });
    }

    getUpdatetProfileUrl(url){
        this.setState({
            profilePicUrl: url,
            isProfileUploaderVisible: !this.state.isProfileUploaderVisible,
        });
        console.log(this.state);
    }

    render() {
        return (
            <>
                <ProfilePic
                    openProfilePicUploader={this.openProfilePicUploader}
                    imgFromApp={this.state.profilePicUrl}
                    firstNameFromApp={this.state.firstName}
                    lastNameFromApp={this.state.lastName}
                />
                {this.state.isProfileUploaderVisible && <ProfilePicUploader getUpdatetProfileUrl={this.getUpdatetProfileUrl}/>}
                <h1>welcome to the app</h1>
            </>
        );
    }
}