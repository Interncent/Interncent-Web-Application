import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import { apiCall } from "../../services/api";
import { connect } from "react-redux";
import {
  internshipCreate,
  internshipDelete,
  internshipedit,
} from "../../store/actions/user";
import Quiz from './Quiz'
class Intershipform extends Component {
  constructor(props) {
    super(props);
    if (props.editing) {
      let getdate = (yourDate) => {
        yourDate = new Date(yourDate)
        let offset = yourDate.getTimezoneOffset()
        yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000))
        return yourDate.toISOString().split('T')[0]
      }
      this.state = { ...props.predata };
      this.state.skillData = [
        { text: "Python" },
        { text: "Node.Js" },
        { text: "Django" },
        { text: "Javascript" },
        { text: "C++" },
        { text: "React Native" },
      ];
      // to fix date , type , skills
      this.state.applyBy = getdate(this.state.applyBy)
      let array = []
      this.state.skillsRequired.forEach((e) => {
        array.push({ text: e })
      })
      this.state.skillsRequired = array

    } else {
      this.state = {
        title: "",
        skillsRequired: [],
        duration: "",
        applyBy: "",
        numberOpenings: "",
        otherRequirements: "",
        department: "",
        type: "Work from Home",
        description: "",
        perks: "",
        whoCanApply: "",
        faculty: {
          _id: this.props.currentUser.user._id,
          fname: this.props.currentUser.user.fname,
          lname: this.props.currentUser.user.lname,
          photo: this.props.currentUser.user.photo,
          email: this.props.currentUser.user.email,
        },
        skillData: [
          { text: "Python" },
          { text: "Node.js" },
          { text: "Django" },
          { text: "Javascript" },
          { text: "C++" },
          { text: "React Native" },
        ],
        category: "",
        display: "Form"
      };
    }
    this.delete = () => {
      this.props
        .internshipDelete(this.state._id, this.props.currentUser.user._id)
        .then(() => {
          console.log("Deleted");
          return this.props.history.push("/home");
        })
        .catch((err) => console.log(err));
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSkills = this.handleSkills.bind(this);
    this.multiselectRef = React.createRef();

    this.changeDisplay = (display) => {
      this.setState({ display })
    }
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSkills() {
    const skillInput = document.querySelector(".searchBox");
    var query = skillInput.value;
    console.log(query);
    apiCall("get", "/internship/skillSuggestion/" + query, "")
      .then(async (data) => {
        console.log(data);
        await this.setState({ skillData: data });
      })
      .catch((err) => console.log(err));
  }
  async handleSubmit(e) {
    console.log(this.state);
    e.preventDefault();
    var skills = this.multiselectRef.current.getSelectedItems();
    var skillArray = [];
    skills.forEach((skill) => {
      skillArray.push(skill.text);
    });
    //await this.setState({ skillsRequired: skillArray, skillData: [] });
    this.state.skillsRequired = skillArray
    if (this.props.editing) {
      this.props
        .internshipedit(this.state, this.props.currentUser.user._id)
        .then((id) => {
          console.log("edited");
          this.props.edited(this.state)
        })
        .catch((err) => console.log(err));
    } else {
      this.props
        .internshipCreate({ ...this.state, display: null })
        .then((id) => {
          console.log("Created");
          return this.props.history.push("/internship/" + id);
        })
        .catch((err) => console.log(err));
    }
    console.log(this.state);
  }


  render() {
    const {
      title,
      type,
      duration,
      applyBy,
      numberOpenings,
      otherRequirements,
      department,
      description,
      perks,
      whoCanApply,
      category,
      display
    } = this.state;
    if (display === "Form") {
      return (

        <form onSubmit={this.handleSubmit} id="internshipForm">
          <div className="ui form">
            <div className="ui form">
              <div className="field">
                <label>Title</label>
                <input
                  name="title"
                  maxLength="30"
                  required
                  value={title}
                  onChange={this.handleChange}
                  type="text"
                  placeholder="eg. Frontend with React"
                ></input>
              </div>
            </div>
            <div className="two fields">
              <div className="field">
                <label>Department</label>
                <select
                  name="department"
                  required
                  value={department}
                  onChange={this.handleChange}
                >
                  <option value="">Department</option>
                  <option value="it">IT</option>
                  <option value="cs">Comps</option>
                  <option value="extc">EXTC</option>
                  <option value="etrx">ETRX</option>
                  <option value="mech">Mech</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              <div className="field">
                <label>Apply By</label>
                <input
                  required
                  type="Date"
                  name="applyBy"
                  value={applyBy}
                  onChange={this.handleChange}
                ></input>
              </div>
            </div>
            <div className="two fields">
              <div className="field">
                <label>Duration (in months)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  required
                  name="duration"
                  value={duration}
                  placeholder="eg. 1"
                  onChange={this.handleChange}
                ></input>
              </div>
              <div className="field">
                <label>Number of opening</label>
                <input
                  type="number"
                  min="1"
                  required
                  name="numberOpenings"
                  placeholder="eg. 2"
                  value={numberOpenings}
                  onChange={this.handleChange}
                ></input>
              </div>
            </div>
            <div className="two fields">
              <div className="field">
                <label>Type</label>

                <span className="mr-4">
                  <input
                    type="radio"
                    id="wfh"
                    onChange={this.handleChange}
                    name="type"
                    value="Work from Home"
                    checked={type === "Work from Home"}
                    className="mr-2"
                  />
                  <label for="wfh">Work from Home</label>
                </span>
                <span>
                  <input
                    type="radio"
                    id="ext"
                    onChange={this.handleChange}
                    name="type"
                    checked={type === "External"}
                    value="External"
                    className="mr-2"
                  />
                  <label for="ext">External</label>
                </span>
              </div>

              <div className="field">
                <label>Category</label>
                <select
                  name="category"
                  required
                  value={category}
                  onChange={this.handleChange}
                >
                  <option value="">Category</option>
                  <option value="Internship">Internship</option>
                  <option value="Research">Research</option>
                  <option value="Recruitment">Recruitment</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="skillsRequired">Skills Required</label>
            <Multiselect
              options={this.state.skillData} // Options to display in the dropdown
              selectedValues={this.state.skillsRequired} // Preselected value to persist in dropdown
              displayValue="text" // Property name to display in the dropdown options
              onSearch={this.handleSkills}
              ref={this.multiselectRef}
              placeholder="Search and Select Skills"
            />
          </div>

          <div className="ui form" style={{ marginTop: '10px' }}>
            <div className="field">
              <label>Who can Apply</label>
              <textarea
                maxlength="200"
                rows="2"
                required
                placeholder="eg. Only those candidates can apply who have relevant skills and interests and are available for duration of 3 months"
                name="whoCanApply"
                value={whoCanApply}
                onChange={this.handleChange}
              ></textarea>
            </div>
            <div className="field">
              <label>About Internship</label>
              <textarea
                maxlength="200"
                minLength="50"
                rows="2"
                required
                placeholder="eg. Do daily assigned task and fix issues in github"
                name="description"
                value={description}
                onChange={this.handleChange}
              ></textarea>
            </div>
            <div className="field">
              <label>Other Requirements</label>
              <textarea
                maxlength="200"
                rows="2"
                required
                placeholder="eg. Should have communication and leadership skills"
                name="otherRequirements"
                value={otherRequirements}
                onChange={this.handleChange}
              ></textarea>
            </div>
            <div className="field">
              <label>Perks</label>
              <textarea
                maxlength="100"
                rows="2"
                required
                name="perks"
                placeholder="eg. Certificate,Letter of recommendation,Flexible work hours "
                value={perks}
                onChange={this.handleChange}
              ></textarea>
            </div>

            <div className="field">
              <label>Questions</label>
              <div>
                1. Why should you be hired for this role? <br />
                2. Are you avai for {duration ? duration : "_"} month(s), starting immediately? If not, what is the time period you are available for and the earliest date you can start this internship on?
              </div>
              <button type="button" className="ui button tiny" onClick={(() => this.changeDisplay("Questions"))}>Add Questions</button>
            </div>
            <div className="submit">
              {this.props.editing && (
                <button
                  type="button"
                  className="big ui button red"
                  onClick={this.delete}
                >
                  DELETE
                </button>
              )}
              <button className="big ui button">
                {this.props.editing ? "EDIT" : "SUBMIT"}
              </button>
            </div>


          </div>
        </form>
      );
    } else {
      return <Quiz duration={duration} changeDisplay={this.changeDisplay}></Quiz>
    }
  }
}
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps, {
  internshipCreate,
  internshipDelete,
  internshipedit,
})(Intershipform);
