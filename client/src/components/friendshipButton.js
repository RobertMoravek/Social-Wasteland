import { useParams } from "react-router";
import { useState, useEffect } from "react";


export default function FriendshipButton(id) {
    let [buttonInfo, setButtonInfo] = useState({});
    
    // id is either passed in as an object (for some reason) or it is part of the url. pick accordingly
    if (Object.keys(id).length === 0) {
        id = useParams().id;
    } else {
        id = id.id;
    }

    //  On load and if the id changes, fetch friendship status from the server
    useEffect (() => {
        fetchFriendshipButton();
    }, [id]);


    function fetchFriendshipButton() {
        fetch(`/getsinglefriendship/${id}`)
            .then((response) => response.json())
            .then((result) => {
                // Set button text and api-url accordingly 
                if (result.rows.length == 0) {
                    setButtonInfo({text: "Add as friend ✅", url: "/makefriendshiprequest"});
                } else if (result.rows[0].accepted) {
                    setButtonInfo({text: "End friendship ❌", url: "/cancelfriendship"});
                } else if (result.rows[0].recipient_id == id && !result.rows[0].accepted) {
                    setButtonInfo({text: "Delete friend request ❌", url: "/cancelfriendship"});
                } else if (result.rows[0].sender_id == id && !result.rows[0].accepted) {
                    setButtonInfo({text: "Accept friend request ✅", url: "/acceptfriendship"});
                }
            });
    }
    

    // Post to server with the url attached to the button, resulting in the matching action there
    function useFriendshipButton() {
        let body = {otherUserId: id};
        body = JSON.stringify(body);
        fetch(`${buttonInfo.url}`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: body,
        })
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                // Update the status of the button   
                fetchFriendshipButton();
            });
    }



    return (
        <button onClick={useFriendshipButton} className="friendship-button">{buttonInfo.text}</button>
    );

}