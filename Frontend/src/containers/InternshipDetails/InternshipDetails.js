import React, { Component } from "react";
import Navbar from "../Global/Navbar";
import PageFooter from "../Global/PageFooter";
import RecommInternship from "./RecommInternship"
import { apiCall } from "../../services/api"
import NotFoundSVG from "../../images/NotFound.js"
import Loading from "../../images/Loading"
import Modal from "react-bootstrap/Modal";
import Internshipform from '../Homepage/Internshipform'
import { Link } from 'react-router-dom';




class InternshipDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exists: false,
      start: true,
      details: {},
      recommlist: [],
      user: this.props.currentUser.user,
      applied: false,
      owner: false,
      show2: false,
      show3: false,
      role: "Student",
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
    return apiCall('get', '/internship/details/' + this.props.match.params.id, '')
      .then(
        async (data) => {
          console.log(data)
          if (Object.keys(data).length !== 0) {
            apiCall('get', '/internship/search/skills?skills=' + data["skillsRequired"].join(',') + '&id=' + this.props.match.params.id)
              .then(
                async (recomm) => {
                  if (data.applicants.findIndex(app => app._id === this.state.user._id) !== -1) {
                    await this.setState({ applied: true })
                  }
                  if (new Date(data.applyBy) < new Date()) {
                    await this.setState({ passed: true });
                  }
                  if (this.state.user._id === data.faculty._id) {
                    this.setState({ owner: true })
                  }
                  await this.setState({ details: data, recommlist: recomm, exists: true, start: false });

                  console.log(this.state);
                }).catch(
                  (e) => this.setState({ exist: false, start: false })
                )
            return
          } else {
            await this.setState({ exists: false, start: false })
          }

        }

      ).catch(
        (e) => {
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
        await this.setState({ applied: true });
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
              <div className="col-lg-8 col-12" id="mainDetails">
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
                        src={this.state.details.faculty.photo}
                        alt="pfp"
                        className="avatar-pro"
                      ></img>
                      <Link className="author" to={"/profile/" + this.state.details.faculty.email.split('@')[0]}>
                        {this.state.details.faculty.fname} {this.state.details.faculty.lname}
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
                    <h3>About Internship</h3>
                    <p>{this.state.details.description}</p>
                    <h3>Who can Apply</h3>
                    <p>{this.state.details.whoCanApply}</p>
                    <h3>Other Requirement</h3>
                    <p>{this.state.details.otherRequirements}</p>
                    <h3>Skills Required</h3>
                    <div>
                      {this.state.details.skillsRequired.map((skill, ind) => {
                        return (
                          <div id={ind} className="tagsskill">
                            {skill}
                          </div>
                        );
                      })}
                    </div>
                    <h3>Perks</h3>
                    <p>{this.state.details.perks}</p>
                    <h3> Number of Opening</h3>
                    <p>{this.state.details.numberOpenings}</p>

                    <h3>
                      Applicants
                      {this.state.owner &&
                        <div>
                          <Link className="mailAppl ui small button" to={'/internship/applications/' + this.state.details._id}>View Applications</Link>
                        </div>
                      }
                    </h3>
                    <span className="appliList">
                      {
                        this.state.details.applicants.map(app =>
                          <span className="applicant">
                            <img src={app.photo} alt=""></img>
                            <span className="name">{app.fname} {app.lname}</span>
                          </span>
                        )}
                    </span>
                    {this.state.user.role === "Student" && (this.state.details.faculty._id !== this.state.user._id) &&
                      <div>
                        {!this.state.applied && !this.state.passed &&
                          <div>
                            <div className="applynow">
                              <button type="button" className="btn btn-lg btn-default" onClick={this.handleShow2}>
                                Apply Now
                              </button>
                            </div>
                            <Modal show={this.state.show2} onHide={this.handleClose2} centered backdrop="static">
                              <Modal.Header closeButton>
                                <Modal.Title>Application</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <form id="applyForm" className="ui form" onSubmit={this.handleApply}>
                                  <div className="field">
                                    <label>{this.state.ques1}</label>
                                    <textarea
                                      maxlength="200"
                                      rows="3"
                                      required
                                      name="ans1"
                                      value={this.state.ans1}
                                      onChange={this.handleChange}
                                    ></textarea>
                                  </div>
                                  <div className="field">
                                    <label>{this.state.ques2}</label>
                                    <textarea
                                      maxlength="200"
                                      rows="2"
                                      required
                                      name="ans2"
                                      value={this.state.ans2}
                                      onChange={this.handleChange}
                                    ></textarea>
                                  </div>
                                  <div style={{ textAlign: 'center' }}>
                                    <button className="ui small button" >
                                      Apply Now
                                    </button>
                                  </div>
                                </form>
                              </Modal.Body>
                            </Modal>
                          </div>
                        }
                        {this.state.applied && !this.state.passed &&
                          <div className="applynow">
                            <button type="button" className="btn btn-lg btn-default" disabled="true">
                              Applied
                          </button>
                          </div>
                        }
                        {
                          this.state.passed &&
                          <div className="applynow">
                            <button type="button" className="btn btn-lg btn-default" disabled="true">
                              Internship Expired
                            </button>
                          </div>
                        }



                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-12 recommendations">
                <div className="card recomm">
                  <h3>Recommendations</h3>
                  <hr></hr>
                  <div className="scroll">
                    {this.state.recommlist.map((int, ind) => {
                      return <RecommInternship {...int}></RecommInternship>
                    })}
                  </div>

                </div>

              </div>
            </div>
          </div>
          <Modal size="lg" show={this.state.show3} onHide={this.handleClose3} backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Edit internship Details</Modal.Title>
            </Modal.Header>
            <Modal.Body><Internshipform edited={this.edited} predata={this.state.details} editing={true} {...this.props}></Internshipform></Modal.Body>
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