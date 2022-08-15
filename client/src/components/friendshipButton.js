import { useParams } from "react-router";
import { useState, useEffect } from "react";


export default function FriendshipButton(id) {
    console.log("id", typeof id, id);
    if (Object.keys(id).length === 0) {
        id = useParams().id;
    } else {
        id = id.id;
    }
    console.log("id", typeof id, id);

    let [buttonInfo, setButtonInfo] = useState({});
   
    
    useEffect (() => {

        fetchFriendshipButton();

    }, [id]);


    function fetchFriendshipButton() {
        console.log('fetching friendship status');
        fetch(`/getsinglefriendship/${id}`)
            .then((response) => response.json())
            .then((result) => {
                console.log("getsinglefriendship", result);
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
    


    function useFriendshipButton() {
        let body = {otherUserId: id};
        console.log(body);
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
                
                fetchFriendshipButton();
                // if(!result.error){
                //     location.href = "/";
                // } else {
                //     this.setState({error : true});
                //     // this.state.error = true;
                // }
            });
    }



    return (
        <button onClick={useFriendshipButton} className="friendship-button">{buttonInfo.text}</button>
    );

}