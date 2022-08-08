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

    submitForm(e) {
        e.preventDefault();
        // console.log(e.currentTarget);
        const form = e.currentTarget;
        const fileInput = form.querySelector("input[type=file]");
        if (fileInput.files.length < 1) {
            alert("Add a file, dummy!");
            return;
        }
        const formData = new FormData(form);
        console.log(formData);

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
                    console.log(result);
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
            <form encType="multipart/form-data" className="uploadForm" onSubmit={this.submitForm}>
                <h3 className="uploadHeadline" id="uploadExpander">
                    upload an image<span className="arrowDown"></span>
                </h3>
                <label htmlFor="uploadInput">Image</label>
                <input type="file" name="uploadInput" id="uploadInput" />
                <input type="submit" value="Upload" className="submitButton" />
                <div className="status green"></div>
                <div className="status red"></div>
            </form>
        );
    }
}