import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditorOpen: false,
            bio: this.props.bio,
            newBio: "",
        };

        this.toggleEditor = this.toggleEditor.bind(this);
        this.changeNewBio = this.changeNewBio.bind(this);
        this.saveNewBio = this.saveNewBio.bind(this);
    }

    toggleEditor() {
        this.setState({ isEditorOpen: !this.state.isEditorOpen });
    }

    changeNewBio(e) {
        this.setState({ newBio: e.currentTarget.value });
        // console.log(this.state.newBio);
    }

    saveNewBio() {
        let body = {
            newBio: this.state.newBio,
        };
        body = JSON.stringify(body);
        fetch("/updatebio", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: body,
        })
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                // console.log("Result nach db:", result);
                if (result) {
                    this.setState({ bio: result.bio });
                    this.setState({ isEditorOpen: false });
                    this.props.giveBackBio(result.bio);
                }
            });
    }

    render() {
        return (
            <div className="bioEditor">
                {this.state.isEditorOpen ? (
                    <>
                        <textarea
                            name="newBio"
                            id="newBio"
                            cols="30"
                            rows="5"
                            defaultValue={this.props.bio}
                            onChange={this.changeNewBio}
                        ></textarea>
                        <button
                            onClick={this.saveNewBio}>
                            Save your bio
                        </button>
                        <button onClick={this.toggleEditor}>Cancel</button>
                    </>
                ) : this.props.bio ? (
                    <>
                        <div className="bioText">{this.props.bio}</div>
                        <button onClick={this.toggleEditor}>
                            Edit your bio
                        </button>
                    </>
                ) : (
                    <button onClick={this.toggleEditor}>Add your bio</button>
                )}
            </div>
        );
    }
}


