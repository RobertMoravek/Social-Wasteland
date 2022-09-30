import { Component } from "react";

// import { Link } from "react-router-dom";

export class ProfilePicUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePicUpdateError: false,
        };

        this.submitForm = this.submitForm.bind(this);
    }

    // Post the pic to the server
    submitForm(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const fileInput = form.querySelector("input[type=file]");
        // Alert and abort, if no file
        if (fileInput.files.length < 1) {
            alert("Add a file, dummy!");
            return;
        }
        const formData = new FormData(form);

        fetch("/uploadprofilepic", {
            method: "post",
            // headers: { "Content-Type": "application/json" },
            body: formData,
        })
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                if (!result.error) {
                    // Update the url of the shown profile pic
                    this.props.getUpdatedProfileUrl(result);
                } else {
                    console.log('upload failed');
                    this.setState({ profilePicUpdateError: true });
                    // this.state.error = true;
                }
            });

    }

    render() {
        return (
            <div className="uploader-background" onClick={this.props.toggleProfilePicUploader} >
                <form encType="multipart/form-data" className="uploadForm" onClick={(e) => {e.stopPropagation(); e.nativeEvent.stopImmediatePropagation();}} onSubmit={this.submitForm}>
                    <h3 className="uploadHeadline" id="uploadExpander">
                        upload an image<span className="arrowDown"></span>
                    </h3>
                    <input type="file" name="uploadInput" id="uploadInput" />
                    <input type="submit" value="Upload" className="submitButton" />
                    <div className="status green"></div>
                    <div className="status red"></div>
                </form>
            </div>
        );
    }
}