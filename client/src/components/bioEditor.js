import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditorOpen: false,
            bio: this.props.bio,
            newBio: null,
        };

        this.toggleEditor = this.toggleEditor.bind(this);
        this.changeNewBio = this.changeNewBio.bind(this);
        this.saveNewBio = this.saveNewBio.bind(this);
    }

    // Toggles the editor on and off
    toggleEditor() {
        this.setState({ isEditorOpen: !this.state.isEditorOpen });
    }

    // When text is typed, put it in newBio
    changeNewBio(e) {
        this.setState({ newBio: e.currentTarget.value });
    }

    // If new bio is null (no changes to bio were made), then save bio. Otherwise save bio.
    saveNewBio() {
        let body ="";
        if (this.state.newBio == null){
            body = {
                newBio: this.props.bio,
            };
        } else {
            body = {
                newBio: this.state.newBio,
            };
        }

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
                        <div className="buttons">
                            <button onClick={this.saveNewBio} id="save">Save your bio</button>
                            <button onClick={this.toggleEditor}>Cancel</button>

                        </div>
                    </>
                ) : this.props.bio ? (
                    <>
                        <p className="bioText">{this.props.bio}</p>
                        <button onClick={this.toggleEditor}>
                            Edit your bio
                        </button>
                    </>
                ) : (
                    <button onClick={this.toggleEditor} id="add">Add your bio</button>
                )}
            </div>
        );
    }
}


