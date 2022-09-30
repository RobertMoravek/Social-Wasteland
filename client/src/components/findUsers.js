import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindUsers() {
    let [newestUsers, setNewestUsers] = useState([]);
    let [userSearchResults, setUserSearchResults] = useState([]);
    let [isNewestUsersVisible, setIsNewestUsersVisible] = useState(true);
    let [userSearchField, setUserSearchField] = useState("");

    // When searchfield is empty, try get users without param (latest users)
    useEffect(() => {
        getUsers();
    }, [userSearchField == ""]);

    // If user types something in searchfield, try to get users with params 
    useEffect(() => {
        getUsers(userSearchField);
    }, [userSearchField]);

    // See above
    function getUsers(searchInput) {
        if (searchInput) {
            fetch(`/searchusers/${searchInput}`)
                .then((response) => response.json())
                .then((result) => {
                    if (!result.error) {
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
                        setNewestUsers(result.rows);
                    } else {
                        console.log("loading newest users failed", result);
                    }
                });
        }
    }

    // When user types, either show or don't show newest users "component", then set searchfield variable
    function searchFieldInput(e) {
        if (e.currentTarget.value.length > 0) {
            setIsNewestUsersVisible(false);
        } else {
            setIsNewestUsersVisible(true);
        }
        setUserSearchField(e.currentTarget.value);
    }

    // Change the names to lowercase because of stupid font
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
