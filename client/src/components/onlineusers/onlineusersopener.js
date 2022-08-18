export default function MenuOpener({toggleOnlineUsersVisibility, closeChat}) {
    
    function openAndClose() {
        toggleOnlineUsersVisibility();
        closeChat();
    }

    return (
        <>

            <img src="./defaultprofile.jpg" alt=""  className="online-users-icon" onClick={openAndClose}/>

        </>
    );
}