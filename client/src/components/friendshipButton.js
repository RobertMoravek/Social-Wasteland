import { useParams } from "react-router";
import { useState, useEffect } from "react";


export default function FriendshipButton(otherUserId) {
    // const history = useHistory();
    const { id } = useParams();
    let [buttonInfo, setButtonInfo] = useState({});
   
    
    useEffect (() => {
        fetchFriendshipButton();
    }, [id]);


    function fetchFriendshipButton() {
        fetch(`/getsinglefriendship/${id}`)
            .then((response) => response.json())
            .then((result) => {
                console.log("getsinglefriendship", result);
                if (result.rows.length == 0) {
                    setButtonInfo({text: "Add as friend", url: "/makefriendshiprequest"});
                } else if (result.rows[0].accepted) {
                    setButtonInfo({text: "Cancel friendship", url: "/cancelfriendship"});
                } else if (result.rows[0].recipient_id == id && !result.rows[0].accepted) {
                    setButtonInfo({text: "Delete friend request", url: "/cancelfriendship"});
                } else if (result.rows[0].sender_id == id && !result.rows[0].accepted) {
                    setButtonInfo({text: "Accept friend request", url: "/acceptfriendship"});
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
        <button onClick={useFriendshipButton}>{buttonInfo.text}</button>
    );

}