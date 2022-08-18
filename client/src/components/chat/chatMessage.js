export default function ChatMessages({message}) {
    // console.log("message in board", message);
    return (<>
        <div className="single-message">
            <img src={message.profile_pic_url || "./defaultprofile.jpg"} alt="" className="tiny-profile-image" />
            <div className="chatTextSection">
                <p>{message.firstname} {message.lastname}: {message.text}</p>
                <p className="timestamp">{message.sent_at.slice(11, 16)}</p>
            </div>
        </div>
    </>);
}