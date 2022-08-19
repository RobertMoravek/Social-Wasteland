import { Component } from "react";
import {
    BrowserRouter,
    Route,
    Redirect,
    Switch,
    Link,
    useLocation,
} from "react-router-dom";
import { useParams } from "react-router";
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

// import { Link } from "react-router-dom";

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
            currentChatPartner: null
        };

        this.openProfilePicUploader = this.openProfilePicUploader.bind(this);
        this.toggleMenuVisibility = this.toggleMenuVisibility.bind(this);
        this.toggleOnlineUsersVisibility =
            this.toggleOnlineUsersVisibility.bind(this);
        this.toggleChatWindowVisibility =
            this.toggleChatWindowVisibility.bind(this);
        this.getUpdatedProfileUrl = this.getUpdatedProfileUrl.bind(this);
        this.giveBackBio = this.giveBackBio.bind(this);
        this.closeChat = this.closeChat.bind(this);
        this.closeOnlineUsers = this.closeOnlineUsers.bind(this);
        this.changeChatPartner = this.changeChatPartner.bind(this);
    }

    openProfilePicUploader(e) {
        this.setState({
            isProfileUploaderVisible: !this.state.isProfileUploaderVisible,
        });
    }

    toggleChatWindowVisibility(e) {
        this.setState({
            isChatVisible: !this.state.isChatVisible,
        });
    }

    toggleMenuVisibility(e) {
        this.setState({
            isMenuVisible: !this.state.isMenuVisible,
        });
    }

    toggleOnlineUsersVisibility(e) {
        this.setState({
            isOnlineUsersVisible: !this.state.isOnlineUsersVisible,
        });
    }

    closeOnlineUsers() {
        this.setState({
            isOnlineUsersVisible: false,
        });
    }

    closeChat() {
        console.log('trying to close chat');
        this.setState({
            isChatVisible: false,
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

    changeChatPartner(id){
        this.setState({
            currentChatPartner: id
        });
    }

    render() {
        return (
            <>
                <h1 className="site-headline">the social wasteland</h1>

                <MenuOpener toggleMenuVisibility={this.toggleMenuVisibility} />

                {this.state.isProfileUploaderVisible && (
                    <ProfilePicUploader
                        getUpdatedProfileUrl={this.getUpdatedProfileUrl}
                        openProfilePicUploader={this.openProfilePicUploader}
                    />
                )}

                <ChatOpener
                    toggleChatWindowVisibility={this.toggleChatWindowVisibility}
                    closeOnlineUsers={this.closeOnlineUsers}
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
                            openProfilePicUploader={() => {}}
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
                            />
                        )}

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
