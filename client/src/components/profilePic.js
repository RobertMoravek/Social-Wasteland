
export default function ProfilePic({ openProfilePicUploader, imgFromApp, firstNameFromApp, lastNameFromApp }) {
    // console.log("PROPS in profilePic: ", props);
    let alt = `${firstNameFromApp} ${lastNameFromApp}`;
    imgFromApp = imgFromApp || "../defaultprofile.jpg";
    return (
        <>
            <img
                src={imgFromApp}
                alt={alt}
                className="profile-image"
                onClick={openProfilePicUploader}
            />
        </>
    );
}

