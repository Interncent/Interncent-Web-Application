import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { Multiselect } from "multiselect-react-dropdown";
import { apiCall } from "../../services/api";
import { connect } from 'react-redux'
import { updateinfo, updateSkills,deleteCertificate, updateCertificates } from '../../store/actions/user';




class MoreInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      certform: {
        title: "",
        provider: "",
        date: new Date(),
        link: "",
      },
      skills: [
        { text: "Python" },
        { text: "Node.js" },
        { text: "Django" },
        { text: "Javascript" },
        { text: "C++" },
        { text: "React Native" },
      ],
      info: {
        // Student
        year: props.user.year,
        dept: props.user.dept,
        rollNo: props.user.rollNo,
        // Faculty
        facultyId: props.user.facultyId,
        position: props.user.position,
        // Alumni
        passedOut: props.user.passedOut,
        workingAt: props.user.workingAt,
      },
      show1: false,
      show2: false,
      show3: false,
      preskills: []
    };

    this.multiselectRef = React.createRef();
    this.handleSkills = this.handleSkills.bind(this);
    this.multiselectRef = React.createRef();

    this.handleClose1 = () => this.setState({ show1: false });
    this.handleShow1 = () => {
      let temp = this.props.user.skills
      this.state.preskills = []
      let i = 0;
      for (i = 0; i < temp.length; i++) {
        this.state.preskills.push({
          text: temp[i],
        });
      }
      this.setState({ show1: true, preskills: this.state.preskills });

    }

    this.handleskillssubmit = this.handleskillssubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleClose2 = () => this.setState({ show2: false });
    this.handleShow2 = () => this.setState({ show2: true });

    this.handleClose3 = () => this.setState({ show3: false });
    this.handleShow3 = () => this.setState({ show3: true });

    this.handlesubinfo = async (e) => {
      e.preventDefault();
      var user = {};
      if (props.user.role === "Student") {
        user = {
          year: this.state.info.year,
          rollNo: this.state.info.rollNo,
          dept: this.state.info.dept,
        }
      } else if (props.user.role === "Faculty") {
        user = {
          dept: this.state.info.dept,
          position: this.state.info.position
        }
      } else {
        user = {
          passedOut: this.state.info.passedOut,
          workingAt: this.state.info.workingAt,
          position: this.state.info.position
        }
      }
      const data = {
        id: props.user._id,
        user
      }
      props.updateinfo(data).then(() => this.handleClose3())
    }
    this.handleChange1 = (e) => {
      let t = this.state.info
      t[e.target.name] = e.target.value;
      this.setState({ info: t });
    }
    this.addcert = (cert) => {
      cert.date = new Date(cert.date);
      this.props.updateCertificates(cert, this.props.user._id).then(
        () => {
          console.log('Certificate Added')
          this.setState({
            certform: { title: "", provider: "", link: "", date: new Date() },
            show2: false,
          });
        }
      ).catch((err) => err)
    }
    this.deletecert = (id) => {
      this.props
        .deleteCertificate(id, this.props.user._id)
        .then(() => {
          console.log("delted");
          this.setState({})
        })
        .catch((e) => console.log(e));
    };
    this.changeskill = (s) => {
      console.log("aya")
      this.props.updateSkills(s, this.props.user._id).then(
        () => {
          console.log('Skills Added')
          this.setState({ show1: false });
        }
      ).catch((err) => console.log(err))
    }
  }

  handleskillssubmit(e) {
    var skills = this.multiselectRef.current.getSelectedItems();
    console.log(skills);
    var skillArray = [];
    skills.forEach((skill) => {
      skillArray.push(skill.text);
    });
    this.changeskill(skillArray);

  }
  handleSubmit(e) {
    e.preventDefault();
    this.addcert(this.state.certform);

  }

  async handleSkills() {
    await this.setState({ error: "" });
    const skillInput = document.querySelector(".searchBox");
    var query = skillInput.value;
    apiCall("get", "/internship/skillSuggestion/" + query, "")
      .then((data) => {
        this.setState({ skills: data });
      })
      .catch((err) => console.log(err));
  }
  handleChange(e) {
    let temp = this.state.certform;
    temp[e.target.name] = e.target.value;
    this.setState({ certform: temp });
  }

  render() {
    const { title, provider, date, link } = this.state.certform;
    const { rollNo, year, workingAt, passedOut, dept, position } = this.state.info;
    return (
      <div className="col-md-4">
        <div className="panel">
          <div className="panel-heading">
            <span className="panel-icon">
              <i className="fa fa-star" />
            </span>
            <span className="panel-title">Info</span>
            {this.props.isowner && (
              <span onClick={this.handleShow3} className="add">
                <i className="fas fa-edit"></i>
              </span>
            )}
          </div>
          <div className="panel-body pn">
            <table className="table mbn tc-icon-1 tc-med-2 tc-bold-last">

              {(this.props.user.role === "Faculty" || this.props.user.role === "Student") &&
                <tr>
                  <td>Department</td>
                  <td style={{ textTransform: "uppercase" }}>
                    {this.props.user.dept}
                  </td>
                </tr>
              }

              {this.props.user.role === "Student" &&
                <tbody>
                  <tr>
                    <td>Year</td>
                    <td>{this.props.user.year}</td>
                  </tr>
                  <tr>
                    <td>Roll number</td>
                    <td>{this.props.user.rollNo}</td>
                  </tr>
                </tbody>
              }
              {
                this.props.user.role === "Faculty" &&
                <tr>
                  <td>Designation</td>
                  <td>{this.props.user.position}</td>
                </tr>
              }
              {this.props.user.role === 'Alumni' &&
                <tbody>
                  <tr>
                    <td>Year of Graduation</td>
                    <td>{this.props.user.passedOut}</td>
                  </tr>
                  <tr>
                    <td>Working At</td>
                    <td>{this.props.user.workingAt}</td>
                  </tr>
                  <tr>
                    <td>Position at Company</td>
                    <td>{this.props.user.position}</td>
                  </tr>
                </tbody>
              }
            </table>
          </div>
          <Modal show={this.state.show3} onHide={this.handleClose3} centered>
            <Modal.Header closeButton>
              <Modal.Title>Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.handlesubinfo}>
                <div className="ui form">
                  {
                    (this.props.user.role === "Student" || this.props.user.role === "Faculty") &&
                    <div className="field">
                      <label>Deparment</label>
                      <select
                        className="ui fluid dropdown"
                        name="dept"
                        onChange={this.handleChange1}
                        value={dept}
                        required
                      >
                        <option value="">Department</option>
                        <option value="cs">Computer Science</option>
                        <option value="it">Information Technology</option>
                        <option value="mech">Mechanical</option>
                        <option value="extc">
                          Electronics and Telecommunication
                        </option>
                        <option value="etrx">Electronics</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  }
                  {this.props.user.role === "Faculty" &&
                    <div className="field">
                      <label>Designation</label>
                      <div className="ui left icon input">
                        <input
                          required
                          type="text"
                          name="position"
                          placeholder="Eg. Lab Assistant"
                          value={position}
                          onChange={this.handleChange1}
                        />
                        <i className="ui id badge icon"></i>
                      </div>
                    </div>
                  }
                  {this.props.user.role === "Student" &&
                    <div>
                      <div className="field">
                        <label>Year</label>
                        <select
                          className="ui fluid dropdown"
                          name="year"
                          onChange={this.handleChange1}
                          value={year}
                        >
                          <option value="">Year</option>
                          <option value="1">FY</option>
                          <option value="2">SY</option>
                          <option value="3">TY</option>
                          <option value="4">LY</option>
                        </select>
                      </div>

                      <div className="field">
                        <label>Roll No.</label>
                        <div className="ui left icon input">
                          <input
                            required
                            type="text"
                            name="rollNo"
                            placeholder="Roll No."
                            value={rollNo}
                            onChange={this.handleChange1}
                            pattern="[0-9]{7}"
                          />
                          <i className="ui id card icon"></i>
                        </div>
                      </div>
                    </div>
                  }
                  {
                    this.props.user.role === "Alumni" &&
                    <div>
                      <div className="field">
                        <label>Year of Passing Out</label>
                        <div className="ui left icon input">
                          <input
                            required
                            type="text"
                            name="passedOut"
                            placeholder="Year"
                            value={passedOut}
                            onChange={this.handleChange1}
                            pattern="[0-9]{4}"
                          />
                          <i className="ui graduation cap icon"></i>
                        </div>
                      </div>
                      <div className="field">
                        <label>Working At</label>
                        <div className="ui left icon input">
                          <input
                            required
                            type="text"
                            name="workingAt"
                            placeholder="Eg. Microsoft"
                            value={workingAt}
                            onChange={this.handleChange1}
                          />
                          <i className="ui building icon"></i>
                        </div>
                      </div>
                      <div className="field">
                        <label>Position</label>
                        <div className="ui left icon input">
                          <input
                            required
                            type="text"
                            name="position"
                            placeholder="Eg. Hr, Software Engineer"
                            value={position}
                            onChange={this.handleChange1}
                          />
                          <i className="ui id card icon"></i>
                        </div>
                      </div>
                    </div>
                  }
                  <div className="submit confirmdiv">
                    <button className="medium ui button confirm">
                      CONFIRM
                    </button>
                  </div>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        </div>
        <div className="panel">
          <div className="panel-heading">
            <span className="panel-icon">
              <i className="fa fa-trophy" />
            </span>
            <span className="panel-title">Skills</span>
            {this.props.isowner && (
              <span onClick={this.handleShow1} className="add">
                <i className="far fa-edit"></i>
              </span>
            )}
          </div>
          <div className="panel-body pb5">
            {this.props.user.skills.map((s) => (
              <div className="tagsskill">{s}</div>
            ))}
          </div>
          <Modal show={this.state.show1} onHide={this.handleClose1} centered>
            <Modal.Header closeButton>
              <Modal.Title>Skills</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Multiselect
                options={this.state.skills}
                selectedValues={this.state.preskills}
                displayValue="text"
                onSearch={this.handleSkills}
                ref={this.multiselectRef}
              />
              <div className="confirmdiv">
                <button
                  onClick={this.handleskillssubmit}
                  className="confirm medium ui button"
                >
                  CONFIRM
                </button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
        <div className="panel" id="certificates">
          <div className="panel-heading">
            <span className="panel-icon">
              <i className="fa fa-pencil" />
            </span>
            <span className="panel-title">Certificates</span>
            {this.props.isowner && (
              <span className="add" onClick={this.handleShow2}>
                <i className="far fa-plus-square"></i>
              </span>
            )}
          </div>
          <div className="panel-body pb5">
            {
              this.props.user.certificates.map((s) => (
                <div>
                  <h4>{s.title}{this.props.isowner && (
                    <span
                      className="deletecert"
                      onClick={() =>this.deletecert(s._id) }
                    >
                      <i className="fa fa-trash"></i>
                    </span>)}</h4>
                  <p>
                    <img className="providerimg mr-2" src={'https://www.google.com/s2/favicons?sz=20&domain_url=' + s.link.replace('http://', '').replace('https://', '').split(/[/?#]/)[0]} alt="logo"></img>{s.provider}
                    <br></br>
                  Issued {new Date(s.date).toDateString()}
                    <br></br>
                    <a href={s.link} target="_blank" rel="noreferrer">
                      see creditential
                  </a>
                  </p>
                  <hr className="short br-lighter"></hr>
                </div>
              ))}
          </div>
        </div>
        <Modal
          show={this.state.show2}
          onHide={this.handleClose2}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Certificate</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleSubmit}>
              <div className="ui form">
                <div className="field">
                  <label>Title</label>
                  <input
                    name="title"
                    maxLength="30"
                    required
                    val={title}
                    onChange={this.handleChange}
                    type="text"
                    placeholder="eg. Completed Course on Java"
                  ></input>
                </div>
                <div className="field">
                  <label>Provider</label>
                  <input
                    name="provider"
                    maxLength="30"
                    required
                    val={provider}
                    onChange={this.handleChange}
                    type="text"
                    placeholder="eg. Udemy"
                  ></input>
                </div>
                <div className="field">
                  <label>Issued on</label>
                  <input
                    required
                    type="Date"
                    name="date"
                    val={date}
                    onChange={this.handleChange}
                  ></input>
                </div>
                <div className="field">
                  <label>Link</label>
                  <input
                    name="link"
                    maxLength="100"
                    required
                    val={link}
                    onChange={this.handleChange}
                    type="text"
                    placeholder="eg. https://www.udemy.com/certificate/UC-fb6...."
                  ></input>
                </div>

                <div className="submit confirmdiv">
                  <button className="medium ui button confirm">ADD</button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div >
    );
  }
}

export default connect(() => {return {} }, { updateinfo, updateSkills,deleteCertificate, updateCertificates })(MoreInfo);
