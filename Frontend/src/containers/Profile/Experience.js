import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from 'react-redux'
import { updateExperiences, deleteExperiences, editExperience } from '../../store/actions/user'
import NoExperience from '../../images/NoExperience'

class Experience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      editingexp: null,
      show: false,
    };
    this.handleshow1 = () => {
      this.setState({ show: true, editing: false });
    };
    this.handleshow2 = (e) => {
      this.setState({ show: true, editing: true, editingexp: e });
    };
    this.handleclose = () => {
      this.setState({ show: false, editingexp: null });
    };
    this.handleexpsub = (data) => {
      if (this.state.editing) {
        data._id = this.state.editingexp._id;
        this.props
          .editExperience({ experience: data })
          .then(() => {
            console.log("experience edited");
            this.handleclose();
          })
          .catch((err) => err);

      } else {
        this.props.updateExperiences(data, this.props.user._id).then(
          () => {
            console.log('Experience Added')
            this.setState({ show: false })
          }
        ).catch((err) => err)
      }
    };
    this.deleteexp = () => {
      console.log("aya")
      this.props
        .deleteExperiences(this.state.editingexp._id, this.props.user._id)
        .then(() => {
          console.log("delted");
          this.handleclose();
        })
        .catch((e) => console.log(e));
    };
  }
  render() {
    return (
      <div id="experience">
        {this.props.owner && <button onClick={this.handleshow1} className="experience-add ui button ">Add + </button>}
        <div style={{ overflowY: 'auto', maxHeight: '800px' }}>
          {this.props.user.experiences.map((e, i) => {
            return (
              <div className="experience-ele">
                <h4>{e.title}</h4>
                <sub>{e.type}</sub>{this.props.owner && (
                  <span
                    className="deleteproj"
                    onClick={() => this.handleshow2(e)}
                  >
                    <i className="fa fa-edit"></i>
                  </span>
                )}
                <p>
                  <span style={{ display: 'block' }}>{e.company}</span>
                  {new Date(e.startdate).toDateString() + '-' + (e.enddate === null ? "Present" : new Date(e.enddate).toDateString())}
                  <br></br>
                  <h6>
                    {e.description}
                  </h6>
                </p>
                {/* <hr className="short br-lighter"></hr> */}
              </div>)
          })}{this.props.user.experiences.length === 0 && <NoExperience></NoExperience>}
        </div>
        <Modal size="lg" show={this.state.show} onHide={this.handleclose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{this.state.editing ? 'Edit Experience Details' : 'Fill Experience Details'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ExperienceForm {...this.props}
              deleteit={this.deleteexp}
              editing={this.state.editing}
              editingexp={this.state.editingexp}
              onexpsub={this.handleexpsub}></ExperienceForm>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}


class ExperienceForm extends Component {
  constructor(props) {
    super(props);
    if (props.editing) {
      let getdate = (yourDate) => {
        yourDate = new Date(yourDate)
        let offset = yourDate.getTimezoneOffset()
        yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000))
        return yourDate.toISOString().split('T')[0]
      }
      this.state = {
        title: props.editingexp.title,
        type: props.editingexp.type,
        company: props.editingexp.company,
        startdate: getdate(props.editingexp.startdate),
        enddate: props.editingexp.enddate ? getdate(props.editingexp.enddate) : null,
        description: props.editingexp.description,
      };
    } else {
      this.state = {
        title: "",
        type: "",
        company: "",
        startdate: "",
        enddate: null,
        description: "",
      };
    }

    this.handleSubmit = (e) => {
      e.preventDefault()
      props.onexpsub(this.state);
    }
    this.handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value })
    }
    this.handleenddate = (e) => {
      if (this.state.enddate === null) {
        this.setState({ enddate: false })

      }
      else {
        this.setState({ enddate: null })
      }
    }
  }
  render() {
    const {
      title,
      type,
      company,
      startdate,
      enddate,
      description,
    } = this.state;
    return (
      <form onSubmit={this.handleSubmit} id="internshipForm">
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
              placeholder="eg. Retail sales manager"
            ></input>
          </div>
          <div className="field">
            <label>Type</label>
            <select
              required
              className="ui fluid dropdown"
              name="type"
              onChange={this.handleChange}
              value={type}
            >
              <option value="">None</option>
              <option value="job">Job</option>
              <option value="internship">Internship</option>
              <option value="research">Research</option>
              <option value="member">Member</option>
            </select>
          </div>
          <div className="field">
            <label>Company/Team</label>
            <input
              name="company"
              maxLength="30"
              required
              value={company}
              onChange={this.handleChange}
              type="text"
              placeholder="eg. Microsoft"
            ></input>
          </div>
          <div className="field">
            <label for="checkid" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <input style={{marginRight:'3px'}} id="checkid" type="checkbox" defaultChecked={true} onClick={this.handleenddate}></input>Currently Working
            </label>

          </div>
          <div className="two fields">
            <div className="field">
              <label>Start date</label>
              <input
                required
                type="Date"
                name="startdate"
                value={startdate}
                onChange={this.handleChange}
              ></input>
            </div>
            {this.state.enddate !== null &&
              <div className="field">
                <label>End date</label>
                <input
                  required
                  type="Date"
                  name="enddate"
                  value={enddate}
                  onChange={this.handleChange}
                ></input>
              </div>}
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              maxlength="200"
              rows="2"
              placeholder="eg. was assigned to tech team"
              name="description"
              value={description}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="submit confirmdiv">
            <button className="medium ui button confirm">
              {this.props.editing ? "EDIT" : "ADD"}
            </button>
            {this.props.editing && (
              <button
                type="button"
                className="medium ui button red"
                onClick={this.props.deleteit}
              >
                DELETE
              </button>
            )}
          </div>
        </div>
      </form>
    );
  }
}

export default connect(() => { }, { updateExperiences, deleteExperiences, editExperience })(Experience);

