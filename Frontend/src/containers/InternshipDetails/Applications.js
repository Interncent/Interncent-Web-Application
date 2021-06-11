import React, { Component } from 'react'
import Navbar from '../Global/Navbar'
import PageFooter from '../Global/PageFooter'
import { apiCall } from '../../services/api'
import { Link } from 'react-router-dom'
import SendEmail from './SendEmail'

class Applications extends Component {
    constructor(props) {
        super(props)
        this.state = {
            applications: [],
            searchedApplications: [],
            show: false,
            emails: []
        }

        this.getQueryandFilter = async (query) => {
            if (query === "") {
                this.setState({ searchedApplications: [] });
            }
            const temp = this.state.applications.filter(a => (a.applicantId.fname + " " + a.applicantId.lname).toUpperCase().includes(query.toUpperCase()));
            await this.setState({ searchedApplications: temp });
        }

        this.handleShow = async (emails) => {
            await this.setState({ emails: [emails], show: true })
        }

        this.handleClose = () => {
            this.setState({ show: false })
        }

    }

    componentDidMount() {
        const internshipId = this.props.match.params.id
        apiCall('get', '/internship/applications/' + internshipId, '')
            .then((applications) => {
                this.setState({ applications })
            }).catch((err) => {
                console.log(err)
            });
    }
    render() {
        const content = this.state.searchedApplications.length === 0 ? this.state.applications : this.state.searchedApplications;
        return (
            <div id="applications">
                <Navbar onPage='applications' history={this.props.history} getQuery={this.getQueryandFilter}></Navbar>
                <div style={{ marginTop: '80px' }}>
                    <center><h1 >Applications</h1></center>
                    <div className='applications'>
                        {
                            content.map(app => {
                                return (
                                    <div className="singleApplication">
                                        <img src={app.applicantId.photo} alt='applicant'></img>
                                        <div ><Link style={{ fontWeight: '600' }} to={"/profile/" + app.applicantId.email.split('@')[0]}>{app.applicantId.fname + " " + app.applicantId.lname}</Link></div>
                                        <div className='apllicationBtns'>
                                            <button className='ui button'>
                                                <a href={'/createchat/' + app.applicantId._id} style={{ color: 'black' }} target="_blank" rel="noreferrer" >Message</a>
                                            </button>
                                            <button className='ui button' onClick={() => this.handleShow(app.applicantId.email)}>
                                                Send Mail
                                            </button>

                                            <button className='ui button' style={{ marginLeft: '5px' }} >
                                                <a href={'/viewapplication/' + app._id} style={{ color: 'black' }} target="_blank" rel="noreferrer" >View Application</a>
                                            </button>
                                        </div>

                                    </div>
                                )
                            })

                        }
                        <SendEmail show={this.state.show} onHide={this.handleClose} emails={this.state.emails} userId={this.props.currentUser.user._id} internshipId={this.props.match.params.id}></SendEmail>
                    </div>
                </div>

                <PageFooter></PageFooter>
            </div>
        )
    }
}

export default Applications