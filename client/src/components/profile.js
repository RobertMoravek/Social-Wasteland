import React, { Component } from 'react';
import ProfilePic from "./profilePic.js";
import BioEditor from "./bioEditor";

export default class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }



    
    render() {
        // console.log("Props in Profile:", this.props);
        return (
            <div className="profile component">
                <h2 className="component-headline">profile</h2>
                <div className="component-content">
                    <ProfilePic
                        openProfilePicUploader={this.props.openProfilePicUploader}
                        imgFromApp={this.props.imgFromApp}
                        firstNameFromApp={this.props.firstNameFromApp}
                        lastNameFromApp={this.props.lastNameFromApp}
                        
                    />
                    <BioEditor bio={this.props.bio} giveBackBio={this.props.giveBackBio}/>
                </div>
                

            </div>

        );
    }
}

