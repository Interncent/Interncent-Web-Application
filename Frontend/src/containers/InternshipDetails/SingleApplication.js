import React, { Component } from 'react'
import Navbar from '../Global/Navbar'
import PageFooter from '../Global/PageFooter'
import { apiCall } from '../../services/api'
import Loading from "../../images/Loading"
import { Link } from 'react-router-dom'
import { PDFExport } from '@progress/kendo-react-pdf';


class SingleApplication extends Component {
    constructor(props) {
        super(props)
        this.state = {
            application: {},
            start: true
        }

        this.exportPDF = () => {
            this.application.save();
        }
    }

    componentWillMount() {
        const applicationId = this.props.match.params.id
        console.log(applicationId)
        apiCall('get', '/internship/viewapplication/' + applicationId, '')
            .then((application) => {
                console.log(application)
                this.setState({ application, start: false })
            }).catch((err) => {
                console.log(err)
            });
    }
    render() {
        if (this.state.start) {
            return (
                <div className="loading-anime">
                    <Loading className="loading-wheel" />
                </div>
            )
        }
        return (
            <div style={{ height: '600px' }}>
                <Navbar history={this.props.history}></Navbar>
                <center><h1 style={{ marginTop: '80px' }}>{this.state.application.applicantId.fname + " " + this.state.application.applicantId.lname}'s Application</h1></center>
                <PDFExport paperSize={'Letter'}
                    fileName={this.state.application.internshipId.faculty.fname + " " + this.state.application.internshipId.faculty.lname}
                    title=""
                    subject=""
                    keywords=""
                    ref={(r) => this.application = r}>


                    <div id="singleApplication">
                        <div className="singleApplication">
                            <h3><u>Internship Details:</u></h3>
                            <strong>Posted By :</strong>
                            <div className='header'>
                                <img src={this.state.application.internshipId.faculty.photo} alt='applicant'></img>
                                <div style={{ fontWeight: '600' }}>{this.state.application.internshipId.faculty.fname + " " + this.state.application.internshipId.faculty.lname}</div>
                                <div className='apllicationBtns'>
                                    <button className='ui button' style={{ marginLeft: '5px' }}>
                                        <Link style={{ color: 'black' }} to={"/profile/" + this.state.application.internshipId.faculty.email.split('@')[0]}>Profile</Link>
                                    </button>
                                    <button className='ui button'>
                                        <a href={'/createchat/' + this.state.application.internshipId.faculty._id} style={{ color: 'black' }} target="_blank" rel="noreferrer" >Message</a>
                                    </button>

                                </div>
                            </div>

                            <div>
                                <strong>Internship: </strong> {this.state.application.internshipId.title}
                                <Link to={'/internship/' + this.state.application.internshipId._id}><i class="fas fa-external-link-alt ml-2"></i></Link>
                            </div>



                            <h3><u>Applicant Details:</u></h3>
                            <div className='header'>

                                <img src={this.state.application.applicantId.photo} alt='applicant'></img>
                                <div style={{ fontWeight: '600' }}>{this.state.application.applicantId.fname + " " + this.state.application.applicantId.lname}</div>
                                <div className='apllicationBtns'>
                                    <button className='ui button' style={{ marginLeft: '5px' }}>
                                        <a style={{ color: 'black' }} href={this.state.application.applicantId.resume} target="_blank" rel="noreferrer">Resume</a>
                                    </button>
                                    <button className='ui button' style={{ marginLeft: '5px' }}>
                                        <Link style={{ color: 'black' }} to={"/profile/" + this.state.application.applicantId.email.split('@')[0]}>Profile</Link>
                                    </button>
                                    <button className='ui button'>
                                        <a href={'/createchat/' + this.state.application.applicantId._id} style={{ color: 'black' }} target="_blank" rel="noreferrer" >Message</a>
                                    </button>

                                </div>

                            </div>

                            <div>
                                <strong>Applied On: </strong> {new Date(this.state.application.appliedOn).toDateString()}
                            </div>

                            <h3><u>Questionaire:</u></h3>
                            <div className='questions'>
                                <strong>Q1.Why should you be hired for this role?</strong>
                                <div><b>Ans. </b> {this.state.application.answers[0]}</div>

                                <br></br>

                                <strong>Q2.Are you avaiable for {this.state.application.internshipId.duration} month(s), starting immediately? If not, what is the time period you are avaiable for and the earliest date you can start this internhsip on?</strong>
                                <div><b>Ans. </b> {this.state.application.answers[1]}</div>
                            </div>
                        </div>

                    </div>
                </PDFExport>
                <center><button className="ui button red" style={{ marginTop: '10px' }} onClick={this.exportPDF} >Download Application</button></center>

                <PageFooter></PageFooter>

                {/* PDF Exporter */}


            </div >
        )
    }
}

export default SingleApplication