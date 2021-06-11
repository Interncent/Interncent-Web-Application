import React, { Component } from 'react'
import { apiCall } from '../../services/api'
import { Multiselect } from "multiselect-react-dropdown";
import CKEditor from 'ckeditor4-react';
import Modal from "react-bootstrap/Modal";



class SendMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            error: ''
        }
        this.multiselectRef = React.createRef()

        this.onSendMessage = async (e) => {
            e.preventDefault();
            var emails = this.multiselectRef.current.getSelectedItems();
            if (emails.length === 0) {
                return await this.setState({ error: 'Atleast select one Recepient' });
            }
            if (this.state.text === '') {
                return await this.setState({ error: 'Message Body Not Provided' });
            }
            var userIdArray = [];
            emails.forEach((email) => {
                userIdArray.push(this.props.emailObj[email.text]);
            });
            var message = {
                text: this.state.text,
                author: this.props.userId
            };
            console.log({ message, uid: this.props.userId, otherUserIds: userIdArray })
            apiCall('post', "/message/applicants", { message, uid: this.props.userId, otherUserIds: userIdArray })
                .then(() => {
                    console.log('Sent Messages');
                    this.props.onHide()
                })
                .catch(err => {
                    console.log(err)
                    this.setState({ error: err.message });
                })
        }
        this.onEditorChange = (evt) => {
            this.setState({
                text: evt.editor.getData()
            });
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} centered>
                <Modal.Header closeButton backdrop="static">
                    <Modal.Title>Send Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="toField">
                        <label>To</label>
                        <Multiselect
                            options={this.props.emails}
                            selectedValues={this.props.emails}
                            displayValue="text"
                            ref={this.multiselectRef}
                        />
                    </div>
                    <form className="ui form" onSubmit={this.onSendMessage}>
                        <div className="ui field">
                            <label>Text</label>

                            <CKEditor
                                data={this.state.text}
                                onChange={this.onEditorChange} />
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button className="ui button" >Send</button>
                        </div>
                        {this.state.error &&
                            <div class="alert alert-danger mt-3" role="alert">
                                {this.state.error}
                            </div>
                        }
                    </form>
                </Modal.Body>
            </Modal>
        )
    }

}
export default SendMessage