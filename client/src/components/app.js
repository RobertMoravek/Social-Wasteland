import { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch, Link, useLocation } from "react-router-dom";
import { useParams } from "react-router";
import ProfilePic from "./profilePic.js";
import { ProfilePicUploader } from "./profilePicUploader.js";
import Profile from "./profile.js";
import FindUsers from "./findUsers.js";
import ShowOtherUsers from "./otherUserProfile.js";
import Friends from "./friends.js";

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
            bio: "",
            id: "",
        };

        this.openProfilePicUploader = this.openProfilePicUploader.bind(this);
        this.getUpdatedProfileUrl = this.getUpdatedProfileUrl.bind(this);
        this.giveBackBio = this.giveBackBio.bind(this);
    }

    openProfilePicUploader(e) {
        this.setState({
            isProfileUploaderVisible: !this.state.isProfileUploaderVisible,
        });
    }

    componentDidMount() {
        fetch("/loaduserinfo")
            .then((response) => response.json())
            .then((result) => {
                if (!result.error) {
                    // console.log(result);
                    this.setState({
                        firstName: result.firstname,
                        lastName: result.lastname,
                        email: result.email,
                        profilePicUrl: result.profile_pic_url,
                        bio: result.bio,
                        id: result.id,
                    });
                    // console.log(this.state);
                } else {
                    console.log("loading user info failed");
                    // location.reload();
                    // this.state.error = true;
                }
            });
    }

    getUpdatedProfileUrl(url) {
        this.setState({
            profilePicUrl: url,
            isProfileUploaderVisible: !this.state.isProfileUploaderVisible,
        });
        // console.log(this.state);
    }

    giveBackBio(newBio) {
        this.setState({ bio: newBio });
    }

    render() {
        return (
            <>
                <h1 className="site-headline">the social wasteland</h1>

                {this.state.isProfileUploaderVisible && (
                    <ProfilePicUploader
                        getUpdatedProfileUrl={this.getUpdatedProfileUrl}
                        openProfilePicUploader={this.openProfilePicUploader}
                    />
                )}

                <section>
                    <BrowserRouter>
                        <Link to="/">
                            <ProfilePic
                                openProfilePicUploader={() => {}}
                                imgFromApp={this.state.profilePicUrl}
                                firstNameFromApp={this.state.firstName}
                                lastNameFromApp={this.state.lastName}
                                classmenu="menu-profile-image"
                            />
                        </Link>
                        <Switch>
                            <Route exact path="/">
                                <Profile
                                    openProfilePicUploader={
                                        this.openProfilePicUploader
                                    }
                                    imgFromApp={this.state.profilePicUrl}
                                    firstNameFromApp={this.state.firstName}
                                    lastNameFromApp={this.state.lastName}
                                    bio={this.state.bio}
                                    giveBackBio={this.giveBackBio}
                                />
                            </Route>

                            <Route exact path="/users">
                                <FindUsers />
                            </Route>

                            <Route exact path="/friends">
                                <Friends />
                            </Route>

                            <Route exact path="/users/:id">
                                <ShowOtherUsers />
                            </Route>

                            <Redirect from="*" to="/" />
                        </Switch>
                    </BrowserRouter>
                </section>
            </>
        );
    }
}
