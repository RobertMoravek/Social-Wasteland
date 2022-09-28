export default function ChatMessage({message}) {
    console.log("message in chatmessages", message);
    return (<>
        <div className="single-message">
            <img src={message.profile_pic_url || "./defaultprofile.jpg"} alt="" className="tiny-profile-image" />
            <div className="chatTextSection">
                <p className={!message.seen && "unseen"}>{message.firstname} {message.lastname}: {message.text}</p>
                <p className="timestamp">{message.sent_at && message.sent_at.slice(11, 16)}</p>
            </div>
        </div>
    </>);
}