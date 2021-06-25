import React, { Component } from 'react'
import { PDFExport } from '@progress/kendo-react-pdf'
import Navbar from '../Global/Navbar'
import PageFooter from '../Global/PageFooter'


class ResumeBuilder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user,
            address: "",
            email: "",
            phoneNumber: "",
            careerObjectives: "",
            futureProspects: "",
            educationDetails: {
                graduation: {
                    college: "",
                    startYear: "",
                    endYear: "",
                    degree: "",
                    stream: "",
                    performance: ""
                },
                twelth: {
                    school: "",
                    yearOfCompletion: "",
                    board: "",
                    stream: "",
                    performance: ""
                },
                tenth: {
                    school: "",
                    yearOfCompletion: "",
                    board: "",
                    performance: ""
                }
            }
        }
        this.exportPDF = () => {
            this.application.save();
        }
        this.handleGradChange = (e) => {
            var educationDetails = this.state.educationDetails
            var graduation = this.state.educationDetails.graduation
            graduation[e.target.name] = e.target.value
            educationDetails.graduation = graduation
            this.setState({ educationDetails })
        }

        this.handleTwelthChange = (e) => {
            var educationDetails = this.state.educationDetails
            var twelth = this.state.educationDetails.twelth
            twelth[e.target.name] = e.target.value
            educationDetails.twelth = twelth
            this.setState({ educationDetails })
        }

        this.handleTenthChange = (e) => {
            var educationDetails = this.state.educationDetails
            var tenth = this.state.educationDetails.tenth
            tenth[e.target.name] = e.target.value
            educationDetails.tenth = tenth
            this.setState({ educationDetails })
        }

        this.handleChange = (e) => {
            this.setState({ [e.target.name]: e.target.value });
        }

        this.handleSubmit = (e) => {
            e.preventDefault()
            var formDetails = { ...this.state, user: null }
            this.props.updateResumeDetails(this.props.user._id, formDetails)
                .then((result) => {
                    this.exportPDF()
                }).catch((err) => {
                    console.log(err)
                });
        }
    }
    componentDidMount() {
        if (this.props.user.resumeDetails) {
            this.setState({
                address: this.props.user.resumeDetails.address,
                email: this.props.user.resumeDetails.email,
                phoneNumber: this.props.user.resumeDetails.phoneNumber,
                careerObjectives: this.props.user.resumeDetails.careerObjectives,
                futureProspects: this.props.user.resumeDetails.futureProspects,
                educationDetails: this.props.user.resumeDetails.educationDetails
            })
        }
    }
    render() {
        const { twelth, tenth, graduation } = this.state.educationDetails
        return (
            <div id="resumeBuilder">
                <Navbar history={this.props.history}></Navbar>
                <form className="ui form" onSubmit={this.handleSubmit} style={{ marginTop: '80px' }}>

                    {/* Graduation */}
                    <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>Graduation Details</h3>
                    <div className="field">
                        <label>College</label>
                        <input
                            name="college"
                            maxLength="100"
                            required
                            value={this.state.educationDetails.graduation.college}
                            onChange={this.handleGradChange}
                            type="text"
                        ></input>
                    </div>

                    <div className="two fields">
                        <div className="field">
                            <label>Start Year</label>
                            <input
                                name="startYear"
                                maxLength="100"
                                required
                                onChange={this.handleGradChange}
                                value={this.state.educationDetails.graduation.startYear}
                                type="text"
                            ></input>
                        </div>
                        <div className="field">
                            <label>End Year</label>
                            <input
                                name="endYear"
                                maxLength="100"
                                required
                                value={this.state.educationDetails.graduation.endYear}
                                onChange={this.handleGradChange}
                                type="text"
                            ></input>
                        </div>
                    </div>

                    <div className="two fields">
                        <div className="field">
                            <label>Degree</label>
                            <input
                                name="degree"
                                maxLength="100"
                                required
                                onChange={this.handleGradChange}
                                type="text"
                                value={this.state.educationDetails.graduation.degree}
                                placeholder="Eg. B.Tech"
                            ></input>
                        </div>
                        <div className="field">
                            <label>Stream</label>
                            <input
                                name="stream"
                                maxLength="100"
                                required
                                onChange={this.handleGradChange}
                                type="text"
                                value={this.state.educationDetails.graduation.stream}
                                placeholder="Eg. Information Technology"

                            ></input>
                        </div>
                    </div>

                    <div className="field">
                        <label>Performance (in CGPA)</label>
                        <input
                            name="performance"
                            maxLength="100"
                            required
                            onChange={this.handleGradChange}
                            type="text"
                            value={this.state.educationDetails.graduation.performance}
                            placeholder="Eg. 9/10"

                        ></input>
                    </div>

                    {/* Senior Secondary */}
                    <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>Senior Scondary(XII) Details</h3>

                    <div className="two fields">
                        <div className="field">
                            <label>School</label>
                            <input
                                name="school"
                                maxLength="100"
                                required
                                onChange={this.handleTwelthChange}
                                type="text"
                                value={this.state.educationDetails.twelth.school}
                            ></input>
                        </div>
                        <div className="field">
                            <label>Year of Completion</label>
                            <input
                                name="yearOfCompletion"
                                maxLength="100"
                                required
                                onChange={this.handleTwelthChange}
                                type="text"
                                value={this.state.educationDetails.twelth.yearOfCompletion}
                            ></input>
                        </div>

                    </div>

                    <div className="two fields">
                        <div className="field">
                            <label>Board</label>
                            <input
                                name="board"
                                maxLength="100"
                                required
                                onChange={this.handleTwelthChange}
                                type="text"
                                placeholder="Eg. CBSE"
                                value={this.state.educationDetails.twelth.board}
                            ></input>
                        </div>
                        <div className="field">
                            <label>Stream</label>
                            <input
                                name="stream"
                                maxLength="100"
                                required
                                onChange={this.handleTwelthChange}
                                type="text"
                                placeholder="Eg. Science"
                                value={this.state.educationDetails.twelth.stream}
                            ></input>
                        </div>
                    </div>
                    <div className="field">
                        <label>Performance (in %)</label>
                        <input
                            name="performance"
                            maxLength="100"
                            required
                            onChange={this.handleTwelthChange}
                            type="text"
                            placeholder="Eg. 90%"
                            value={this.state.educationDetails.twelth.performance}
                        ></input>
                    </div>

                    {/*Secondary */}
                    <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>Scondary(X) Details</h3>

                    <div className="two fields">
                        <div className="field">
                            <label>School</label>
                            <input
                                name="school"
                                maxLength="100"
                                required
                                onChange={this.handleTenthChange}
                                type="text"
                                value={this.state.educationDetails.tenth.school}
                            ></input>
                        </div>
                        <div className="field">
                            <label>Year of Completion</label>
                            <input
                                name="yearOfCompletion"
                                maxLength="100"
                                required
                                onChange={this.handleTenthChange}
                                type="text"
                                value={this.state.educationDetails.tenth.yearOfCompletion}
                            ></input>
                        </div>

                    </div>


                    <div className="two fields">
                        <div className="field">
                            <label>Board</label>
                            <input
                                name="board"
                                maxLength="100"
                                required
                                onChange={this.handleTenthChange}
                                type="text"
                                placeholder="Eg. CBSE"
                                value={this.state.educationDetails.tenth.board}
                            ></input>
                        </div>
                        <div className="field">
                            <label>Performance (in %)</label>
                            <input
                                name="performance"
                                maxLength="100"
                                required
                                onChange={this.handleTenthChange}
                                type="text"
                                placeholder="Eg. 90%"
                                value={this.state.educationDetails.tenth.performance}
                            ></input>
                        </div>
                    </div>

                    <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>Personal Details</h3>

                    {/* Address */}
                    <div className="field">
                        <label>Address (with City, State, Country and Pincode)</label>
                        <textarea
                            rows={3}
                            name="address"
                            maxLength="200"
                            value={this.state.address}
                            required
                            onChange={this.handleChange}
                        ></textarea>
                    </div>
                    <div className="two fields">
                        {/*Email*/}
                        <div className="field">
                            <label>Personal Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={this.state.email}

                                onChange={this.handleChange}
                            ></input>
                        </div>

                        {/* Phone Number */}
                        <div className="field">
                            <label>Phone Number (with Country Code)</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                required
                                onChange={this.handleChange}
                                value={this.state.phoneNumber}

                            ></input>
                        </div>
                    </div>

                    <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>Optional</h3>

                    {/* Career Objectives*/}
                    <div className="field">
                        <label>Career Objectives</label>
                        <textarea
                            rows={3}
                            name="careerObjectives"
                            maxLength="200"
                            onChange={this.handleChange}
                            value={this.state.careerObjectives}

                        ></textarea>
                    </div>

                    {/* Furure Proespects */}
                    <div className="field">
                        <label>Future Prospects</label>
                        <textarea
                            rows={3}
                            name="futureProspects"
                            maxLength="200"
                            onChange={this.handleChange}
                            value={this.state.futureProspects}

                        ></textarea>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button className="ui button blue" style={{ margin: '0 auto' }} >Create Resume</button>
                    </div>

                </form>

                <h1 style={{ textDecoration: 'underline' }}>Preview (May differ from the Actual PDF)</h1>
                <div style={{ maxWidth: '1000px', width: '95%', margin: '0 auto', border: '2px solid black' }}>
                    <PDFExport paperSize={'Letter'}
                        fileName={this.props.user.fname + " " + this.props.user.lname}
                        title=""
                        subject=""
                        keywords=""
                        ref={(r) => this.application = r}>
                        <div style={{ padding: '10px', fontSize: '14px' }} >
                            <div className="headerResume">
                                <div className="name">{this.props.user.fname + " " + this.props.user.lname}</div>
                                <small className="address" style={{ maxWidth: '140px', wordBreak: 'break-word' }}>
                                    <div>{this.state.address}</div>
                                    <div>
                                        Phone Number – {this.state.phoneNumber}, Email id – {this.state.email}
                                    </div>
                                </small>
                            </div>

                            <div className="experience">
                                <div className="resumeTopic">Experience</div>
                                {this.props.user.experiences.map((e) => {
                                    return (
                                        <div className="experience-ele">
                                            <h5>{`${e.title} (${e.type})`}</h5>
                                            <p>
                                                <span style={{ display: 'block' }}>{e.company}</span>
                                                {new Date(e.startdate).toDateString() + '-' + (e.enddate === null ? "Present" : new Date(e.enddate).toDateString())}
                                                <br></br>
                                                <div style={{ margin: '0px' }}>
                                                    {e.description}
                                                </div>
                                            </p>
                                            {/* <hr className="short br-lighter"></hr> */}
                                        </div>)
                                })}
                            </div>


                            <div className="education">
                                <div className="resumeTopic">Education</div>
                                <div style={{ paddingLeft: '5px' }}>
                                    <div className="graduation" style={{ paddingBottom: "5px" }}>
                                        <h5>{graduation.degree + ", " + graduation.stream}</h5>
                                        <div>{graduation.college}</div>
                                        <div>{graduation.startYear + " - " + graduation.endYear}</div>
                                        <div>CGPA: {graduation.performance}/10</div>
                                    </div>
                                    <small></small>
                                    <div className="twelth" style={{ paddingBottom: "5px" }}>
                                        <h5>{"Senior Secondary (XII), " + twelth.stream}</h5>
                                        <div>{twelth.school + ", " + twelth.board}</div>
                                        <div>Year of Completion: {twelth.yearOfCompletion}</div>
                                        <div>Percentage: {twelth.performance}%</div>
                                    </div>
                                    <small></small>
                                    <div className="tenth">
                                        <h5>Secondary (X)</h5>
                                        <div>{tenth.school + ", " + tenth.board}</div>
                                        <div>Year of Completion: {tenth.yearOfCompletion}</div>
                                        <div>Percentage: {tenth.performance}%</div>
                                    </div>
                                </div>
                            </div>
                            <div className="projects">
                                <div className="resumeTopic">Projects</div>
                                {this.props.user.projects.map((e) => {
                                    return (
                                        <div className="experience-ele project-ele">
                                            <h5>
                                                {e.title}
                                            </h5>
                                            <div>
                                                {new Date(e.startdate).toDateString() +
                                                    "-" +
                                                    (e.enddate === null
                                                        ? "Present"
                                                        : new Date(e.enddate).toDateString())}
                                                <br></br>
                                                <div style={{ margin: '0px' }}>{e.description}</div>
                                                <a href={e.link} target="_blank" rel="noreferrer">
                                                    See Project
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="skills">
                                <div className="resumeTopic">Skills</div>
                                <div style={{ paddingLeft: '5px' }}>
                                    {this.props.user.skills.join(', ')}
                                </div>
                            </div>

                            <div className="achievements">
                                <div className="resumeTopic">Achievements</div>

                                {this.props.user.achievements.map((e) => {
                                    return (
                                        <div className="experience-ele">
                                            <h5>{e.title}</h5>
                                            <div>Award/Prize : {e.reward}</div>
                                            <div>
                                                Date : {new Date(e.date).toDateString()}
                                                <br></br>
                                                <div style={{ margin: '0px' }}>
                                                    {e.description}
                                                </div>
                                            </div>
                                            {e.link &&
                                                <div style={{ display: 'inline-block' }}>
                                                    <a href={e.link} target="_blank" rel="noreferrer">
                                                        See Achievement
                                                    </a>
                                                </div>
                                            }
                                        </div>)
                                })}
                            </div>
                            {this.state.careerObjectives &&
                                <div className="careerObjectives">
                                    <div className="resumeTopic">Career Objectives</div>
                                    <div style={{ paddingLeft: '5px' }}>
                                        {this.state.careerObjectives}
                                    </div>
                                </div>
                            }

                            {this.state.futureProspects &&
                                <div className="futureProspects">
                                    <div className="resumeTopic">Future Prospects</div>
                                    <div style={{ paddingLeft: '5px' }}>
                                        {this.state.futureProspects}
                                    </div>
                                </div>
                            }
                        </div>
                    </PDFExport >
                </div>
            </div>

        )
    }
}

export default ResumeBuilder