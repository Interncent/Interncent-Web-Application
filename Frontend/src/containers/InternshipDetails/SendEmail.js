import React, { Component } from 'react'
import { apiCall } from '../../services/api'
import { Multiselect } from "multiselect-react-dropdown";
import CKEditor from 'ckeditor4-react';
import Modal from "react-bootstrap/Modal";



class SendEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            subject: '',
            text: '',
            error: ''
        }
        this.multiselectRef = React.createRef()

        this.onSendMail = async (e) => {
            e.preventDefault();
            var emails = this.multiselectRef.current.getSelectedItems();
            if (emails.length === 0) {
                return await this.setState({ error: 'Select Atleast One Recepient' });
            }
            if (this.state.text === '') {
                return await this.setState({ error: 'Mail Body Not Provided' });
            }
            var emailArray = [];
            emails.forEach((email) => {
                emailArray.push(email.text);
            });
            var mailBody = {
                subject: this.state.subject,
                text: this.state.text,
                to: emailArray,
            };
            apiCall('post', "/internship/mailapplicants", { mailBody, userId: this.props.userId, internshipId: this.props.internshipId })
                .then(() => {
                    console.log('Sent Mail');
                    this.props.onHide()
                })
                .catch(err => {
                    console.log(err)
                    this.setState({ error: err.message });
                })
        }
        this.handleChange = (e) => {
            this.setState({ [e.target.name]: e.target.value })
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
                    <Modal.Title>Send Mail</Modal.Title>
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
                    <form className="ui form" onSubmit={this.onSendMail}>
                        <div className="ui field">
                            <label>Subject</label>
                            <input type="text" required name="subject" onChange={this.handleChange}></input>
                        </div>
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
export default SendEmail