import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { updateProjects, deleteProjects,editProjects } from "../../store/actions/user";
import NoProject from '../../images/NoProject'

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      editingproj: null,
      show: false,
    };
    this.handleshow1 = () => {
      this.setState({ show: true, editing: false });
    };
    this.handleshow2 = (e) => {
      this.setState({ show: true, editing: true, editingproj: e });
    };
    this.handleclose = () => {
      this.setState({ show: false, editingproj: null });
    };
    this.handleexpsub = (data) => {
      console.log("aya")
      if (this.state.editing) {
        data._id=this.state.editingproj._id;
        this.props
          .editProjects({project:data})
          .then(() => {
            console.log("Project edited");
            this.handleclose();
          })
          .catch((err) => err);
        
      } else {
        this.props
          .updateProjects(data, this.props.user._id)
          .then(() => {
            console.log("Project Added");
            this.handleclose();
          })
          .catch((err) => err);
      }
    };
    this.deleteproj = () => {
      this.props
        .deleteProjects(this.state.editingproj._id, this.props.user._id)
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
        {this.props.owner && (
          <button
            onClick={this.handleshow1}
            className="experience-add ui button "
          >
            Add +{" "}
          </button>
        )}
        <div style={{ overflowY: "auto", maxHeight: "800px" }}>
          {this.props.user.projects.map((e, i) => {
            return (
              <div className="experience-ele project-ele">
                <h4>
                  {e.title}
                  {this.props.owner && (
                    <span
                      className="deleteproj"
                      onClick={() => this.handleshow2(e)}
                    >
                      <i className="fa fa-edit"></i>
                    </span>
                  )}
                </h4>
                <p>
                  {new Date(e.startdate).toDateString() +
                    "-" +
                    (e.enddate === null
                      ? "Present"
                      : new Date(e.enddate).toDateString())}
                  <br></br>
                  <h6>{e.description}</h6>
                  <a href={e.link} target="_blank" rel="noreferrer">
                    see project
                  </a>
                </p>
              </div>
            );
          })}{this.props.user.projects.length===0 && <NoProject></NoProject>}
        </div>
        <Modal
          size="lg"
          show={this.state.show}
          onHide={this.handleclose}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.editing?'Edit Project Details':'Fill Project Details'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ProjectForm
              {...this.props}
              deleteit={this.deleteproj}
              editing={this.state.editing}
              editingproj={this.state.editingproj}
              onexpsub={this.handleexpsub}
            ></ProjectForm>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

class ProjectForm extends Component {
  constructor(props) {
    super(props);
    if (props.editing) {
      let getdate = (yourDate)=>{
        yourDate=new Date(yourDate)
        let offset = yourDate.getTimezoneOffset()
        yourDate = new Date(yourDate.getTime() - (offset*60*1000))
        return yourDate.toISOString().split('T')[0]
      }
      this.state = {
        title: props.editingproj.title,
        startdate: getdate(props.editingproj.startdate),
        enddate: props.editingproj.enddate?getdate(props.editingproj.enddate):null,
        description: props.editingproj.description,
        link: props.editingproj.link,
      };
    } else {
      this.state = {
        title: "",
        startdate: "",
        enddate: null,
        description: "",
        link: "",
      };
    }
    this.handleSubmit = (e) => {
      e.preventDefault();
      props.onexpsub(this.state);
    };
    this.handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    };
    this.handleenddate = (e) => {
      if (this.state.enddate === null) {
        this.setState({ enddate: false });
      } else {
        this.setState({ enddate: null });
      }
    };
  }
  render() {
    const { title, startdate, enddate, description, link } = this.state;
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
              placeholder="eg. Builded Sudoku Solver"
            ></input>
          </div>
          <div className="field">
            <input
              type="checkbox"
              defaultChecked={true}
              onClick={this.handleenddate}
            ></input>
            currently working
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
            {this.state.enddate !== null && (
              <div className="field">
                <label>End date</label>
                <input
                  required
                  type="Date"
                  name="enddate"
                  value={enddate}
                  onChange={this.handleChange}
                ></input>
              </div>
            )}
          </div>
          <div className="field">
            <label>description</label>
            <textarea
              maxlength="200"
              rows="2"
              placeholder="eg. used python and back tracking algorithm"
              name="description"
              value={description}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="field">
            <label>Link</label>
            <input
              name="link"
              required
              value={link}
              onChange={this.handleChange}
              type="url"
              placeholder="eg. https://github.com/Vedan..."
            ></input>
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

export default connect(() => {return {}}, { updateProjects, editProjects,deleteProjects })(Project);
