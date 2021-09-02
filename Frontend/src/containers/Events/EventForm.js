import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import { apiCall } from "../../services/api";
import { connect } from "react-redux";
import {
    addEvent,
    deleteEvent,
    editEvent,
} from "../../store/actions/user";
// import Quiz from './Quiz'
class EventForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            college: "",
            venue: "",
            startTime: "",
            endTime: "",
            date: "",
            category: "",
            link: "",
            photo: "",
            description: "",
            applyBy: "",
            display: "Form"
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)

    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleFileChange(e) {
        if (e.target.files && e.target.files[0]) {
            console.log("")
        }
    }

    // async handleSubmit(e) {
    //     console.log(this.state);
    //     e.preventDefault();
    //     var skills = this.multiselectRef.current.getSelectedItems();
    //     var skillArray = [];
    //     skills.forEach((skill) => {
    //         skillArray.push(skill.text);
    //     });
    //     //await this.setState({ skillsRequired: skillArray, skillData: [] });
    //     this.state.skillsRequired = skillArray
    //     if (this.props.editing) {
    //         this.props
    //             .editEvent(this.state, this.props.currentUser.user._id)
    //             .then((id) => {
    //                 console.log("edited");
    //                 this.props.edited(this.state)
    //             })
    //             .catch((err) => console.log(err));
    //     } else {
    //         this.props
    //             .addEvent({ ...this.state, display: null })
    //             .then((id) => {
    //                 console.log("Created");
    //                 return this.props.history.push("/internship/" + id);
    //             })
    //             .catch((err) => console.log(err));
    //     }
    //     console.log(this.state);
    // }


    render() {
        const {
            title,
            venue,
            startTime,
            endTime,
            date,
            category,
            link,
            photo,
            description,
            applyBy,
            display
        } = this.state;
        if (display === "Form") {
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
                                placeholder="eg. Flutter Workshop"
                            ></input>
                        </div>
                        <div className="two fields">
                            <div className="field">
                                <label>Category</label>
                                <select
                                    name="category"
                                    required
                                    value={category}
                                    onChange={this.handleChange}
                                >
                                    <option value="">Category</option>
                                    <option value="Competetion">Competetion</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Culture & Entertainment">Culture & Entertainment</option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Webinar">Webinar</option>
                                    <option value="Social Work">Social Work</option>
                                </select>
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
                                    placeholder="eg. Mumbai"
                                ></input>
                            </div>
                        </div>
                        <div className="two fields">
                            <div className="field">
                                <label>Start Time</label>
                                <input
                                    required
                                    type="text"
                                    name="startTime"
                                    value={startTime}
                                    onChange={this.handleChange}
                                    placeholder="eg. 4:00 PM"
                                ></input>
                            </div>
                            <div className="field">
                                <label>End Time</label>
                                <input
                                    required
                                    type="text"
                                    name="endTime"
                                    value={endTime}
                                    onChange={this.handleChange}
                                    placeholder="eg. 6:00 PM"

                                ></input>
                            </div>
                        </div>

                        <div className="two fields">
                            <div className="field">
                                <label>Event Date</label>
                                <input
                                    name="date"
                                    required
                                    value={date}
                                    onChange={this.handleChange}
                                    type="date"
                                ></input>
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

                        <div className="field">
                            <label>Description</label>
                            <textarea
                                name="description"
                                required
                                value={description}
                                onChange={this.handleChange}
                                type="text"
                                maxLength="400"
                                minLength="300"
                            ></textarea>
                        </div>

                        <div className="field">
                            <label>Link</label>
                            <input
                                name="link"
                                maxLength="30"
                                required
                                value={link}
                                onChange={this.handleChange}
                                type="url"
                            ></input>
                        </div>

                        <div className="field">
                            <label>Photo</label>
                            <input
                                name="photo"
                                maxLength="30"
                                required
                                value={photo}
                                onChange={this.handleFileChange}
                                type="file"
                            ></input>
                        </div>
                    </div>
                    <div style={{textAlign:'center'}} >
                        <button className="ui large button">
                            SUBMIT
                        </button>
                    </div>

                </form >
            );
        } else {
            //   return <Quiz duration={duration} changeDisplay={this.changeDisplay}></Quiz>
            console.log("Quiz")
        }
    }
}
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
    };
}

export default connect(mapStateToProps, {
    addEvent,
    deleteEvent,
    editEvent,
})(EventForm);
