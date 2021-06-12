import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { addEvent, editEvent, deleteEvent } from "../../store/actions/user";
import NoEvents from '../../images/NoEvents'

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      editingevent: null,
      show: false,
    };
    this.handleshow1 = () => {
      this.setState({ show: true, editing: false });
    };
    this.handleshow2 = (e) => {
      this.setState({ show: true, editing: true, editingevent: e });
    };
    this.handleclose = () => {
      this.setState({ show: false, editingevent: null });
    };
    this.handleAddEvent = (data) => {
      if (this.state.editing) {
        data._id = this.state.editingevent._id;
        this.props
          .editEvent({ event: data })
          .then(() => {
            console.log("event edited");
            this.handleclose();
          })
          .catch((err) => err);
      } else {
        console.log(data);
        this.props
          .addEvent(data, this.props.user._id)
          .then(() => {
            console.log("Event Added");
            this.handleclose();
          })
          .catch((err) => err);
      }
    };
    this.deleteevent = () => {
      this.props
        .deleteEvent(this.state.editingevent._id, this.props.user._id)
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
            className="experience-add ui button"
          >
            Add +{" "}
          </button>
        )}
        <div style={{ overflowY: "auto", maxHeight: "800px" }}>
          {this.props.user.events.map((e, i) => {
            return (
              <div className="experience-ele events-ele">
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
                <div>
                  <span>Venue : {e.venue}</span>
                </div>
                <div>
                  <span>
                    Timings : {e.startTime} - {e.endTime}
                  </span>
                </div>
                <div>Description : {e.description}</div>
                <div>
                  <a href={e.link} target="_blank" rel="noreferrer">
                    Other Details
                  </a>
                </div>
              </div>
            );
          })}{this.props.user.events.length === 0 && <NoEvents></NoEvents>}
        </div>
        <Modal
          size="lg"
          show={this.state.show}
          onHide={this.handleclose}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {this.state.editing ? "EDIT Event Details" : "Fill Event Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EventForm
              {...this.props}
              deleteit={this.deleteevent}
              editing={this.state.editing}
              editingevent={this.state.editingevent}
              onAddEvent={this.handleAddEvent}
            ></EventForm>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

class EventForm extends Component {
  constructor(props) {
    super(props);
    if (props.editing) {
      let getdate = (yourDate) => {
        yourDate = new Date(yourDate);
        let offset = yourDate.getTimezoneOffset();
        yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);
        return yourDate.toISOString().split("T")[0];
      };
      this.state = {
        title: props.editingevent.title,
        venue: props.editingevent.venue,
        startTime: props.editingevent.startTime,
        endTime: props.editingevent.endTime,
        date: getdate(props.editingevent.date),
        description: props.editingevent.description,
        link: props.editingevent.link,
      };
    } else {
      this.state = {
        title: "",
        venue: "",
        startTime: "",
        endTime: "",
        date: {},
        description: "",
        link: "",
      };
    }

    this.handleSubmit = async (e) => {
      e.preventDefault();
      props.onAddEvent({ ...this.state });
    };
    this.handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
    };
    this.formatAMPM = (date) => {
      date = new Date(date);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    };
  }
  render() {
    const {
      title,
      venue,
      startTime,
      endTime,
      date,
      description,
      link,
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
              placeholder="Eg. Internship Expo"
            ></input>
          </div>
          <div className="field">
            <label>Venue</label>
            <input
              name="venue"
              maxLength="30"
              required
              value={venue}
              onChange={this.handleChange}
              type="text"
              placeholder="Building, Area/Locality, City, State "
            ></input>
          </div>
          <div className="two fields">
            <div className="field">
              <label>Start Time (24Hr)</label>
              <input
                name="startTime"
                required
                value={startTime}
                onChange={this.handleChange}
                type="time"
                placeholder="Start Time"
              ></input>
            </div>
            <div className="field">
              <label>End Time (24Hr)</label>
              <input
                name="endTime"
                required
                value={endTime}
                onChange={this.handleChange}
                type="time"
                placeholder="End Time"
              ></input>
            </div>
          </div>
          <div className="field">
            <label>Date</label>
            <input
              name="date"
              required
              value={date}
              onChange={this.handleChange}
              type="date"
            ></input>
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
          <div className="field">
            <label>Description</label>
            <textarea
              maxlength="200"
              rows="2"
              placeholder="Other Details about the Event"
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

export default connect(() => {return {} }, { addEvent, editEvent, deleteEvent })(Event);
