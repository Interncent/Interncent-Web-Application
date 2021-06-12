import React, { Component } from 'react'
import Navbar from '../Global/Navbar'
import PageFooter from '../Global/PageFooter'
import { apiCall } from '../../services/api'
import { Link } from 'react-router-dom'
import ReactExport from "react-export-excel";
import SendEmail from './SendEmail'
import SendMessage from './SendMessage'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Applications extends Component {
    constructor(props) {
        super(props)
        this.state = {
            applications: [],
            searchedApplications: [],
            show: false,
            show2: false,
            ques1: "Why should you be hired for this role?",
            ques2: "",
            emails: [],
            emailObj: {}
        }

        this.getQueryandFilter = async (query) => {
            if (query === "") {
                this.setState({ searchedApplications: [] });
            }
            const temp = this.state.applications.filter(a => (a.applicantId.fname + " " + a.applicantId.lname).toUpperCase().includes(query.toUpperCase()));
            await this.setState({ searchedApplications: temp });
        }

        this.handleShowSingle = async (emails) => {
            await this.setState({ emails: [{ text: emails }], show: true })
        }

        this.getAllEmails = () => {
            let allEmails = []
            this.state.applications.map(a => allEmails.push({ text: a.applicantId.email }))
            this.setState({ emails: allEmails, show: true })
        }
        this.handleClose = () => {
            this.setState({ show: false })
        }
        this.handleClose2 = () => {
            this.setState({ show2: false })
        }

        this.handleMessaging = () => {
            var emailObj = {}
            var allEmails = []

            this.state.applications.forEach(a => {
                emailObj[a.applicantId.email] = a.applicantId._id
                allEmails.push({ text: a.applicantId.email })
            })
            console.log(allEmails)
            this.setState({ emails: allEmails, emailObj, show2: true })
        }

        this.donwloadApplications = () => {
            let arr = []
            this.state.applications.forEach((e) => {
                let thing = { ...e.applicantId }
                thing.a1 = e.answers[0]
                thing.a2 = e.answers[1]
                thing.name = thing.fname + ' ' + thing.lname
                arr.push(thing)
            })
            return arr
        }

    }

    componentDidMount() {
        document.documentElement.scrollTop = '0';

        const internshipId = this.props.match.params.id
        apiCall('get', '/internship/applications/' + internshipId, '')
            .then(({ applications, duration }) => {
                this.setState({ applications, ques2: `Are you avaiable for ${duration} months, starting immediately? If not, what is the time period you are avaiable for and the earliest date you can start this internhsip on?` })
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

                    <center>
                        <div className="impButtons">

                            {/* Downloading Application Data */}
                            <ExcelFile element={<button className="mailAppl ui small button" onClick={this.donwloadApplications}>Download Application Data</button>}>
                                <ExcelSheet data={this.donwloadApplications()} name="Applications">
                                    <ExcelColumn label="Name" value="name" />
                                    <ExcelColumn label="Roll no." value="rollNo" />
                                    <ExcelColumn label="Department" value="dept" />
                                    <ExcelColumn label="Year" value="year" />
                                    <ExcelColumn label="Email" value="email" />
                                    <ExcelColumn label={this.state.ques1} value="a1" />
                                    <ExcelColumn label={this.state.ques2} value="a2" />
                                    <ExcelColumn label="Profile link" value={(c) => 'https://kjsce-connect-frontend.herokuapp.com/profile/' + c.email.split('@')[0]} />
                                </ExcelSheet>
                            </ExcelFile>

                            {/* Sending Email */}
                            <button className="mailAppl ui small button" onClick={this.getAllEmails} >Mail Applicants</button>
                            <SendEmail show={this.state.show} onHide={this.handleClose} emails={this.state.emails} userId={this.props.currentUser.user._id} internshipId={this.props.match.params.id}></SendEmail>

                            {/* Message ALL Applicants */}
                            <button className="mailAppl ui small button" onClick={this.handleMessaging}>Message Applicants</button>
                            <SendMessage show={this.state.show2} onHide={this.handleClose2} emails={this.state.emails} emailObj={this.state.emailObj} userId={this.props.currentUser.user._id}></SendMessage>



                        </div>
                    </center>
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
                                            <button className='ui button' onClick={() => this.handleShowSingle(app.applicantId.email)}>
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

                    </div>
                </div>

                <PageFooter></PageFooter>
            </div>
        )
    }
}

export default Applications