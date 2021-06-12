import React, { Component } from 'react'
import Navbar from '../Global/Navbar'
import PageFooter from '../Global/PageFooter'
import { apiCall } from '../../services/api'

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
                console.log(applications)
            }).catch((err) => {
                console.log(err)
            });
    }
    render() {
        return (
            <div id="applications">
                <Navbar onPage='applications' history={this.props.history}></Navbar>
                <div>
                    <center><h1>Applicants</h1></center>
                    <div className='applications'>
                        {this.state.applications.map(app => {
                            return (
                                <div className="singleApplication">
                                    <img src={app.applicantId.photo} alt='applicant'></img>
                                    <div>{app.applicantId.fname + " " + app.applicantId.lname}</div>
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