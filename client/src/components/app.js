////////////////
// Due to the educational nature of this project (learing as you go and ever shifting ways to do things), this project is a mess of mixed class and functional components
////////////////


import { Component } from "react";
import {
    BrowserRouter,
    Route,
    Redirect,
    Switch,
} from "react-router-dom";
import ProfilePic from "./profilePic.js";
import { ProfilePicUploader } from "./profilePicUploader.js";
import Profile from "./profile.js";
import FindUsers from "./findUsers.js";
import ShowOtherUsers from "./otherUserProfile.js";
import Friends from "./friends.js";
import Chat from "./chat/chat.js";
import ChatOpener from "./chat/chatOpener.js";
import MenuOpener from "./menu/menuOpener.js";
import Menu from "./menu/menu.js";
import OnlineUsersOpener from "./onlineusers/onlineusersopener.js";
import OnlineUsers from "./onlineusers/onlineusers.js";


export class App extends Component {
    constructor() {
        super();
        this.state = {
            isProfileUploaderVisible: false,
            isChatVisible: false,
            isMenuVisible: false,
            isOnlineUsersVisible: false,
            firstName: "",
            lastName: "",
            email: "",
            profilePicUrl: "",
            bio: "",
            id: "",
            currentChatPartner: null,
            firstChat: true,
        };

        this.toggleProfilePicUploader = this.toggleProfilePicUploader.bind(this);
        this.toggleMenuVisibility = this.toggleMenuVisibility.bind(this);
        this.toggleOnlineUsersVisibility = this.toggleOnlineUsersVisibility.bind(this);
        this.toggleChatWindowVisibility = this.toggleChatWindowVisibility.bind(this);
        this.getUpdatedProfileUrl = this.getUpdatedProfileUrl.bind(this);
        this.giveBackBio = this.giveBackBio.bind(this);
        this.closeChat = this.closeChat.bind(this);
        this.closeOnlineUsers = this.closeOnlineUsers.bind(this);
        this.changeChatPartner = this.changeChatPartner.bind(this);
        this.firstChatToggler = this.firstChatToggler.bind(this);
    }

    // Shows and hides the profile pic uploader
    toggleProfilePicUploader(e) {
        this.setState({
            isProfileUploaderVisible: !this.state.isProfileUploaderVisible,
        });
    }

    // Shows and hides chat window
    toggleChatWindowVisibility(e) {
        this.setState({
            isChatVisible: !this.state.isChatVisible,
        });
    }

    // Shows and hides menu
    toggleMenuVisibility(e) {
        this.setState({
            isMenuVisible: !this.state.isMenuVisible,
        });
    }

    // SHows ans hides online users list
    toggleOnlineUsersVisibility(e) {
        this.setState({
            isOnlineUsersVisible: !this.state.isOnlineUsersVisible,
        });
    }

    // cloeses online users list
    closeOnlineUsers() {
        this.setState({
            isOnlineUsersVisible: false,
        });
    }

    // closes chat
    closeChat() {
        this.setState({
            isChatVisible: false,
        });
    }

    // On mount, load info about the logged in user
    componentDidMount() {
        fetch("/loaduserinfo")
            .then((response) => response.json())
            .then((result) => {
                if (!result.error) {
                    this.setState({
                        firstName: result.firstname,
                        lastName: result.lastname,
                        email: result.email,
                        profilePicUrl: result.profile_pic_url,
                        bio: result.bio,
                        id: result.id,
                    });
                } else {
                    console.log("loading user info failed");
                    // location.reload();
                    // this.state.error = true;
                }
            });
    }

    // After uploading a new profile pic, set the profile pic url the new url and close the uploader
    getUpdatedProfileUrl(url) {
        this.setState({
            profilePicUrl: url,
            isProfileUploaderVisible: !this.state.isProfileUploaderVisible,
        });
    }

    // Change bio text
    giveBackBio(newBio) {
        this.setState({ bio: newBio });
    }

    // Change what person (or main chat) you're talking to
    changeChatPartner(id){
        this.setState({
            currentChatPartner: id
        });
    }

    // Sets the firstChat variable to false
    firstChatToggler() {
        this.setState({firstChat: false});
    }

    render() {
        return (
            <>
                <h1 className="site-headline">the social wasteland</h1>

                <MenuOpener toggleMenuVisibility={this.toggleMenuVisibility} />

                {this.state.isProfileUploaderVisible && (
                    <ProfilePicUploader
                        getUpdatedProfileUrl={this.getUpdatedProfileUrl}
                        toggleProfilePicUploader={this.toggleProfilePicUploader}
                    />
                )}

                <ChatOpener
                    toggleChatWindowVisibility={this.toggleChatWindowVisibility}
                    closeOnlineUsers={this.closeOnlineUsers}
                    firstChat={this.state.firstChat}
                    firstChatToggler={this.firstChatToggler}
                />
                <OnlineUsersOpener
                    toggleOnlineUsersVisibility={
                        this.toggleOnlineUsersVisibility
                    }
                    closeChat={this.closeChat}
                />
                <section>
                    <BrowserRouter>
                        <ProfilePic
                            toggleProfilePicUploader={() => {}}
                            imgFromApp={this.state.profilePicUrl}
                            firstNameFromApp={this.state.firstName}
                            lastNameFromApp={this.state.lastName}
                            classmenu="menu-profile-image"
                        />

                        {this.state.isMenuVisible && <Menu />}
                        {this.state.isOnlineUsersVisible && <OnlineUsers />}

                        {this.state.isChatVisible && (
                            <Chat
                                toggleChatWindowVisibility={this.toggleChatWindowVisibility}
                                changeChatPartner={this.changeChatPartner}
                                currentChatPartner={this.state.currentChatPartner}
                                firstChat={this.state.firstChat}
                                id={this.state.id}
                            />
                        )}

                        <Switch>
                            <Route exact path="/">
                                <Profile
                                    toggleProfilePicUploader={
                                        this.toggleProfilePicUploader
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

                            <Route
                                render={({ location }) =>
                                    //This array includes pages on which user will
                                    // not be redirected
                                    ["/logout"].includes(location.pathname) ? (
                                        (window.location.href = "/logout")
                                    ) : (
                                        <Redirect to="/" />
                                    )
                                }
                            />
                        </Switch>
                    </BrowserRouter>
                </section>
            </>
        );
    }
}
