import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindUsers() {
    let [newestUsers, setNewestUsers] = useState([]);
    let [userSearchResults, setUserSearchResults] = useState([]);
    let [isNewestUsersVisible, setIsNewestUsersVisible] = useState(true);
    let [userSearchField, setUserSearchField] = useState("");

    useEffect(() => {
        getUsers();
    }, [userSearchField == ""]);

    useEffect(() => {
        getUsers(userSearchField);
    }, [userSearchField]);

    function getUsers(searchInput) {
        if (searchInput) {
            fetch(`/searchusers/${searchInput}`)
                .then((response) => response.json())
                .then((result) => {
                    if (!result.error) {
                        console.log(result);
                        setUserSearchResults(result.rows);
                    } else {
                        console.log("loading newest users failed", result);
                    }
                });
        } else {
            fetch("/getnewestusers")
                .then((response) => response.json())
                .then((result) => {
                    if (!result.error) {
                        console.log(result);
                        setNewestUsers(result.rows);
                    } else {
                        console.log("loading newest users failed", result);
                    }
                });
        }
    }

    function searchFieldInput(e) {
        if (e.currentTarget.value.length > 0) {
            setIsNewestUsersVisible(false);
        } else {
            setIsNewestUsersVisible(true);
        }
        setUserSearchField(e.currentTarget.value);
    }

    function lowerCaseNames(first, last) {
        first = first.toLowerCase();
        last = last.toLowerCase();
        return `${first} ${last}`;
    }

    return (
        <>
            <div className="component users">
                <h2 className="component-headline">other users</h2>
                <div className="component-content friends">
                    <h3 className="subhl">find a user</h3>

                    <div className="findUsers">
                        <div className="searchField">
                            <input
                                type="text"
                                name="userSearch"
                                id="userSearch"
                                onChange={searchFieldInput}
                                placeholder="Enter their name here..."
                            />
                        </div>
                    </div>
                    {isNewestUsersVisible ? (
                        <>
                            <h3 className="subhl extra-top-margin">newest users</h3>
                            <div className="newestUsers">
                                {newestUsers.map((item) => (
                                    <div key={item.id}>
                                        <Link to={"/users/" + item.id} className="single-profile">
                                            <img
                                                src={item.profile_pic_url || "/defaultprofile.jpg"}
                                                alt=""
                                                className="other-profile-image profile-image"

                                            />
                                            <div className="user-info">
                                                <h3>
                                                    {lowerCaseNames(
                                                        item.firstname,
                                                        item.lastname
                                                    )}
                                                </h3>
                                                <p className="bioText bioEditor">
                                                    {item.bio}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="subhl extra-top-margin">user search</h3>
                            <div className="newestUsers">
                                {userSearchResults.map((item) => (
                                    <div key={item.id}>
                                        <Link to={"/users/" + item.id} className="single-profile">
                                            <img
                                                src={item.profile_pic_url || "/defaultprofile.jpg"}
                                                alt=""
                                                className="other-profile-image profile-image"

                                            />
                                            <div className="user-info">
                                                <h3>
                                                    {lowerCaseNames(
                                                        item.firstname,
                                                        item.lastname
                                                    )}
                                                </h3>
                                                <p className="bioText bioEditor">
                                                    {item.bio}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
