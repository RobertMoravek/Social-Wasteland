export default function MenuOpener({toggleMenuVisibility}) {
    
    return (
        <>
            <div className="hamburger-container" onClick={toggleMenuVisibility}>
                <img src="./Hamburger_icon.png" alt="Menu"  className="hamburger-icon"/>
            </div>

        </>
    );
}