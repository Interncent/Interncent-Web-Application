import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from 'react-redux'
import { updateAchievement, deleteAchievement, editAchievement } from '../../store/actions/user'
import NoAchievement from '../../images/NoAchievement'

class Achievement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      editingachm: null,
      show: false,
    };
    this.handleshow1 = () => {
      this.setState({ show: true, editing: false });
    };
    this.handleshow2 = (e) => {
      this.setState({ show: true, editing: true, editingachm: e });
    };
    this.handleclose = () => {
      this.setState({ show: false, editingachm: null });
    };
    this.handleexpsub = (data) => {
      if (this.state.editing) {
        data._id = this.state.editingachm._id;
        this.props
          .editAchievement({ achievement: data })
          .then(() => {
            console.log("achievement edited");
            this.handleclose();
          })
          .catch((err) => err);

      } else {
        this.props.updateAchievement(data, this.props.user._id).then(
          () => {
            console.log('achievement Added')
            this.setState({ show: false })
          }
        ).catch((err) => err)
      }
    };
    this.deleteexp = () => {
      console.log("aya")
      this.props
        .deleteAchievement(this.state.editingachm._id, this.props.user._id)
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
          {this.props.user.achievements.map((e, i) => {
            return (
              <div className="experience-ele">
                <h4>{e.title}</h4>
                {this.props.owner && (
                  <span
                    className="deleteproj"
                    onClick={() => this.handleshow2(e)}
                  >
                    <i className="fa fa-edit"></i>
                  </span>
                )}
                <h5>Award/Prize : {e.reward}</h5>
                <div>
                  Date : {new Date(e.date).toDateString()}
                  <br></br>
                  <h6>
                    {e.description}
                  </h6>
                </div>
                {e.link &&
                  <div>
                    <a href={e.link} target="_blank" rel="noreferrer">
                      see achievement
                    </a>
                  </div>
                }
              </div>)
          })}{this.props.user.achievements.length === 0 && <NoAchievement></NoAchievement>}
        </div>
        <Modal size="lg" show={this.state.show} onHide={this.handleclose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{this.state.editing ? 'Edit Achivement Details' : 'Fill Achivement Details'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Achievementform {...this.props}
              deleteit={this.deleteexp}
              editing={this.state.editing}
              editingachm={this.state.editingachm}
              onexpsub={this.handleexpsub}></Achievementform>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}


class Achievementform extends Component {
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
        title: props.editingachm.title,
        reward: props.editingachm.reward,
        date: getdate(props.editingachm.date),
        description: props.editingachm.description,
        link: props.editingachm.link,
      };
    } else {
      this.state = {
        title: "",
        reward: "",
        date: "",
        description: "",
        link: ''
      };
    }

    this.handleSubmit = (e) => {
      e.preventDefault()
      props.onexpsub(this.state);
    }
    this.handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value })
    }
  }
  render() {
    const {
      title,
      reward,
      date,
      description,
      link
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
              placeholder="eg. Won hackathon"
            ></input>
          </div>
          <div className="field">
            <label>Award/Prize</label>
            <input
              name="reward"
              maxLength="100"
              value={reward}
              onChange={this.handleChange}
              type="text"
              placeholder="eg. 10k Rupees"
            ></input>
          </div>
          <div className="two fields">
            <div className="field">
              <label>Date</label>
              <input
                required
                type="Date"
                name="date"
                value={date}
                onChange={this.handleChange}
              ></input>
            </div>
          </div>
          <div className="field">
            <label>description</label>
            <textarea
              maxlength="200"
              rows="2"
              placeholder="eg. was assigned to tech team"
              name="description"
              value={description}
              onChange={this.handleChange}
            ></textarea>
          </div>
          <div className="field">
            <label>Link</label>
            <input
              name="link"
              value={link}
              onChange={this.handleChange}
              type="url"
              placeholder="eg. https://hackit.com/hackath..."
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

export default connect(() => {return {} }, { updateAchievement, deleteAchievement, editAchievement })(Achievement);