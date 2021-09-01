import React, { Component } from "react";
import Navbar from "../Global/Navbar";
import PageFooter from "../Global/PageFooter";
import { apiCall } from "../../services/api"
import NotFoundSVG from "../../images/NotFound.js"
import Loading from "../../images/Loading"
import Modal from "react-bootstrap/Modal";
import { Link } from 'react-router-dom';


class InternshipDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exists: false,
            start: true,
            details: {},
            user: this.props.currentUser.user,
            registered: false,
            owner: false,
            show2: false,
            show3: false,
            role: "",
            error: '',
            passed: false
        };
        this.contentDisplay = this.contentDisplay.bind(this);
        this.handleClose2 = () => this.setState({ show2: false });
        this.handleShow2 = () => this.setState({ show2: true });
        this.handleClose3 = () => this.setState({ show3: false });
        this.handleShow3 = () => this.setState({ show3: true });
        this.handleApply = this.handleApply.bind(this);
        this.edited = (i) => {
            this.setState({ details: i, show3: false })
        }
    }



    componentWillMount() {
        document.documentElement.scrollTop = '0';
        return apiCall('get', '/events/specific/' + this.props.match.params.id, '')
            .then(async (data) => {
                console.log(data)
                if (Object.keys(data).length !== 0) {
                    if (this.state.user.eventRegistrations && this.state.user.eventRegistrations.findIndex(reg => reg === this.props.match.params.id) !== -1) {
                        await this.setState({ registered: true })
                    }
                    if (new Date(data.applyBy) < new Date()) {
                        await this.setState({ passed: true });
                    }
                    if (this.state.user.email === data.organiser.email) {
                        this.setState({ owner: true })
                    }
                    await this.setState({ details: data, exists: true, start: false });

                    console.log(this.state);

                    return
                } else {
                    await this.setState({ exists: false, start: false })
                }

            }

            ).catch(
                (e) => {
                    console.log(e)
                    this.setState({ exist: false, start: false })
                }
            )

    }

    // For Applying in a Internship
    handleApply(e) {
        e.preventDefault();
        console.log('Apply ma aaay');
        const applicantId = this.state.user._id;
        const internshipId = this.state.details._id;
        const applyBody = { answers: [this.state.ans1, this.state.ans2], applicantId, internshipId };
        console.log(applyBody);
        this.props.internshipApply(applyBody, this.state.details.faculty)
            .then(async () => {
                await this.setState({ registered: true });
            })
            .catch(err => console.log(err))
    }

    contentDisplay(exists, start) {
        if (start) {
            return (
                <div className="loading-anime">
                    <Loading className="loading-wheel" />
                </div>
            )
        }
        if (exists) {
            return (
                <div id="internshipdetail">
                    <div className="container">
                        <div className="row">
                            <div className="col-12" id="mainDetails">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="internshipTitle">
                                            <h1>{this.state.details.title}</h1>
                                            <div className="floatingclass"><div>
                                                <div className="category">{this.state.details.category}</div>
                                                {this.owner && (
                                                    <span
                                                        className="deleteproj"
                                                        onClick={this.handleShow3}
                                                    >
                                                        <i className="fa fa-edit"></i>
                                                    </span>
                                                )}</div></div>
                                        </div>
                                        <div className="provider">
                                            <img
                                                src={this.state.details.organiser.photo}
                                                alt="pfp"
                                                className="avatar-pro"
                                            ></img>
                                            <Link className="author" to={"/profile/" + this.state.details.organiser.email.split('@')[0]}>
                                                {this.state.details.organiser.fname} {this.state.details.organiser.lname}
                                            </Link>
                                        </div>
                                        <br></br>
                                        <div id="iconinfo" className="flex-container">
                                            <div className="flex-item">
                                                <h4>
                                                    <i className="fa fa-clock mr-1"></i>Duration
                                                </h4><p>{this.state.details.duration} months</p>
                                            </div>
                                            <div className="flex-item">
                                                <h4>
                                                    <i className="fa fa-home mr-1"></i>Type
                                                </h4><p> {this.state.details.type}</p>
                                            </div>

                                            <div className="flex-item"><h4>
                                                <i className="fa fa-hourglass mr-2"></i>Apply by
                                            </h4><p>{(new Date(this.state.details.applyBy)).toDateString()}</p></div>
                                        </div><hr></hr>
                                        <h3>About the Event</h3>
                                        <p>{this.state.details.description}</p>

                                        <h3>Prizes</h3>
                                        <p>{this.state.details.perks}</p>


                                        <h3>
                                            {this.state.owner &&
                                                <div>
                                                    <Link className="mailAppl ui small button" to={'/internship/applications/' + this.state.details._id}>Download Registration Data</Link>
                                                </div>
                                            }
                                        </h3>

                                        {this.state.user.role === "Faculty" && (!this.state.owner) &&
                                            <div>
                                                {!this.state.registered && !this.state.passed &&
                                                    <div>
                                                        <div className="applynow">
                                                            <button type="button" className="btn btn-lg btn-default" onClick={this.handleShow2}>
                                                                Register
                                                            </button>
                                                        </div>
                                                        <Modal show={this.state.show2} onHide={this.handleClose2} centered backdrop="static">
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Registration Form</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <form id="applyForm" className="ui form" onSubmit={this.handleApply}>
                                                                    <div className="field">
                                                                        <label>Full Name</label>
                                                                        <input name="name" type="text" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="field">
                                                                        <label>College</label>
                                                                        <input name="college" type="text" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="field">
                                                                        <label>College</label>
                                                                        <input type="text" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <button className="ui small button" >
                                                                            Register
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            </Modal.Body>
                                                        </Modal>
                                                    </div>
                                                }
                                                {this.state.registered && !this.state.passed &&
                                                    <div className="applynow">
                                                        <button type="button" className="btn btn-lg btn-default" disabled="true">
                                                            Registered
                                                        </button>
                                                    </div>
                                                }
                                                {
                                                    this.state.passed &&
                                                    <div className="applynow">
                                                        <button type="button" className="btn btn-lg btn-default" disabled="true">
                                                            Event Expired
                                                        </button>
                                                    </div>
                                                }



                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <Modal size="lg" show={this.state.show3} onHide={this.handleClose3} backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>Edit internship Details</Modal.Title>
                        </Modal.Header>
                        {/* <Modal.Body><Internshipform edited={this.edited} predata={this.state.details} editing={true} {...this.props}></Internshipform></Modal.Body> */}
                    </Modal>
                </div >
            )
        } else if (exists === false) {
            return (
                <NotFoundSVG />

            )
        }
    }



    render() {
        const { exists, start } = this.state;
        return (
            <div>
                <Navbar history={this.props.history} onPage="internshipDetails"></Navbar>
                {this.contentDisplay(exists, start)}
                <PageFooter />
            </div>
        );
    }
}

export default InternshipDetail