import React, { Component } from 'react'
import Navbar from '../Global/Navbar'
import PageFooter from '../Global/PageFooter'
import { apiCall } from '../../services/api'
import { Link } from 'react-router-dom'

class Applications extends Component {
    constructor(props) {
        super(props)
        this.state = {
            applications: []
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
        return (
            <div id="applications">
                <Navbar onPage='applications' history={this.props.history}></Navbar>
                <div style={{ marginTop: '80px' }}>
                    <center><h1 >Applications</h1></center>
                    <div className='applications'>
                        {this.state.applications.map(app => {
                            return (
                                <div className="singleApplication">
                                    <img src={app.applicantId.photo} alt='applicant'></img>
                                    <div ><Link style={{ fontWeight: '600' }} to={"/profile/" + app.applicantId.email.split('@')[0]}>{app.applicantId.fname + " " + app.applicantId.lname}</Link></div>
                                    <div className='apllicationBtns'>
                                        <button className='ui button'>
                                            <a href={'/createchat/' + app.applicantId._id} style={{ color: 'black' }} target="_blank" rel="noreferrer" >Message</a>
                                        </button>
                                        <button className='ui button' style={{ marginLeft: '5px' }}>
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