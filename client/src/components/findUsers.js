import { useState, useEffect } from "react";


export default function FindUsers() {
    let [newestUsers, setNewestUsers] = useState([]);
    let [userSearchResults, setuserSearchResults] = useState([]);
    let [isNewestUsersVisible, setIsNewestUsersVisible] = useState(true);
    let [userSearchField, setUserSearchField] = useState("");  

    useEffect(() => {
        getUsers();
    }, [userSearchField == ""]);

    useEffect(() => {
        getUsers(userSearchField);
    }, [userSearchField]);

    function getUsers(searchInput) {
        if (searchInput){
            fetch(`/searchusers/${searchInput}`)
                .then((response) => response.json())
                .then((result) => {
                    if (!result.error) {
                        console.log(result);
                        setuserSearchResults(result.rows);
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
    
    function searchFieldInput (e) {
        if (e.currentTarget.value.length > 0){
            setIsNewestUsersVisible(false);
        } else {
            setIsNewestUsersVisible(true);
        }
        setUserSearchField(e.currentTarget.value);
    }



    return (
        <div className="findUsers">
            <div className="searchField">
                <label htmlFor="userSearch">Find a user</label>
                <input type="text" name="userSearch" id="userSearch" onChange={searchFieldInput} />
            </div>
            {isNewestUsersVisible ? <div className="newestUsers">
                <h2>newest users</h2>
                {newestUsers.map((item) => (
                    <div key={item.id}>
                        <img src={item.profile_pic_url} alt="" />
                        <p>{item.firstname} {item.lastname}</p>
                    </div>
                ))}
                
            </div> : <div className="userSearchResults">
                <h2>user search</h2>
                {userSearchResults.map((item) => (
                    <div key={item.id}>
                        <img src={item.profile_pic_url} alt="" />
                        <p>{item.firstname} {item.lastname}</p>
                    </div>
                ))}
            </div> }
            
        </div>
    );
}