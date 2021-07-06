import React, { Component } from "react"
import { apiCall } from "../../services/api"
import Modal from "react-bootstrap/Modal";
import { Multiselect } from "multiselect-react-dropdown";



class RecruitApplicants extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: true
        }
        this.multiselectRef = React.createRef();

        this.handleSubmit = () => {
            var emails = this.multiselectRef.current.getSelectedItems();
            var uidArray = [];
            var emailArray = [];
            emails.forEach((email) => {
                uidArray.push(this.props.emailObj[email.text]);
                emailArray.push(email.text)
            });
            apiCall('put', '/internship/recruited/' + this.props.internshipId, { applications: uidArray, emailArray, title: this.props.title, category: this.props.category })
                .then((result) => {
                    console.log(result)
                    this.props.onHide()
                }).catch((err) => {
                    console.log(err)
                });

        }
    }

    render() {
        return (
            <div className="recruitMembers">
                <Modal show={this.props.show} onHide={this.props.onHide} centered>
                    <Modal.Header closeButton backdrop="static">
                        <Modal.Title>Recruit Applicants</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="toField">
                            <label>*An Email will be sent to the selected applicants. So make sure that you select the right appplicant.</label>
                            <Multiselect
                                options={this.props.emails}
                                selectedValues={this.props.recruited}
                                displayValue="text"
                                ref={this.multiselectRef}

                            />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button class="ui button" onClick={this.handleSubmit}>Submit</button>
                        </div>

                    </Modal.Body>
                </Modal>

            </div>
        )
    }
}



export default RecruitApplicants