import React, { Component } from "react";
import { Nav } from "react-bootstrap";
// import { Link } from 'react-router-dom';
import { PostWall } from "../../compenents/Community";
// import { apiCall } from "../../services/api";
import Experience from "./Experience";
import Project from "./Project";
import Event from "./Event";
import Achievement from "./Achievement";
import { Link } from 'react-router-dom'
import InternshipOffered from './InternshipOffered'
import NoApplication from '../../images/NoApplication';
import Activity from './Activity';
import { connect } from 'react-redux'
import {
  updateRecruited, updateLikeActivity,
  updateUnLikeActivity,
  updateCommentActivity,
} from '../../store/actions/user';


class Basic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ["Faculty", "Student", "Alumni"].includes(this.props.user.role) ? "experiences" : "events",
      activity: [],
      applications: []
    };
    this.handleSwitch = this.handleSwitch.bind(this);
  }



  handleSwitch(e) {
    if (e.target.name === 'posts' && this.props.owner) this.props.updateposts();
    return this.setState({ content: e.target.name });
  }
  render() {
    let display;
    switch (this.state.content) {
      case "events":
        display = <Event owner={this.props.owner} user={this.props.user} />;
        break;
      case "experiences":
        display = (
          <Experience owner={this.props.owner} user={this.props.user} />
        );
        break;
      case "projects":
        display = <Project owner={this.props.owner} user={this.props.user} />;
        break;
      case "application":
        display = (
          <div id="experience">
            {this.props.user.applications.reverse().map((e, i) => {
              return (
                <div className="experience-ele">
                  <h4>{e.internshipId.title}</h4>
                  <sub>{e.internshipId.category}</sub>
                  <span className="deleteproj"><span className="badge badge-success">{e.state}</span></span>
                  <p>
                    <span>{'Duration : ' + e.internshipId.duration + ' months'}</span><br></br>
                    <h6>{e.internshipId.description}</h6>
                    <Link to={"/internship/" + e.internshipId._id}>
                      See Internship
                    </Link>
                    {this.props.owner && 
                    <div style={{ float: "right", margin:'5px' }}>
                      <a target='_blank' rel='noreferrer' href={'/viewapplication/' + e._id}>View Application</a>
                    </div>}
                  </p>
                </div>
              );
            })}
            {this.props.user.applications.length === 0 && <NoApplication></NoApplication>}
          </div>
        );
        break;
      case "internshipoffered":
        display = (<InternshipOffered owner={this.props.owner}
          user={this.props.user} updateRecruited={this.props.updateRecruited}></InternshipOffered>)
        break;
      case "achievement":
        display = (
          <Achievement
            owner={this.props.owner}
            user={this.props.user}
          ></Achievement>
        );
        break;
      case "posts":
        display = (
          <PostWall
            start={this.props.start}
            posts={this.props.posts}
            history={this.props.history}
            isprofile={true}
            postcreate={this.props.owner}
            currentUser={this.props.user}
            loggedin={{ user: this.props.loggedin }}
            updateLikeActivity={this.props.updateLikeActivity}
            updateUnLikeActivity={this.props.updateUnLikeActivity}
            updateCommentActivity={this.props.updateCommentActivity}
          />
        );
        break;
      case "activity":
        display = <Activity owner={this.props.owner} user={this.props.user} />
        break;
      default:
        break;
    }
    return (
      <div className="col-md-8">
        <div className="tab-block">
          <Nav variant="tabs">
            <Nav.Item>
              {["Faculty", "Student", "Alumni"].includes(
                this.props.user.role
              ) ? (
                <Nav.Link
                  active={this.state.content === "experiences" ? true : false}
                  name="experiences"
                  to="#experiences"
                  onClick={this.handleSwitch}
                >
                  Experiences
                </Nav.Link>
              ) : (
                <Nav.Link
                  active={this.state.content === "events" ? true : false}
                  name="events"
                  to="#events"
                  onClick={this.handleSwitch}
                >
                  Events
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.content === "achievement" ? true : false}
                name="achievement"
                to="#achievement"
                onClick={this.handleSwitch}
              >
                Achievements
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                active={this.state.content === "projects" ? true : false}
                name="projects"
                to="#projects"
                onClick={this.handleSwitch}
              >
                Projects
              </Nav.Link>
            </Nav.Item>
            {this.props.user.role === "Student" ? <Nav.Item>
              <Nav.Link
                active={this.state.content === "application" ? true : false}
                name="application"
                to="#application"
                onClick={this.handleSwitch}
              >
                Applications
              </Nav.Link>
            </Nav.Item> : <Nav.Item>
              <Nav.Link
                active={this.state.content === "internshipoffered" ? true : false}
                name="internshipoffered"
                to="#internshipoffered"
                onClick={this.handleSwitch}
              >
                Internship Offered
              </Nav.Link>
            </Nav.Item>}
            <Nav.Item>
              <Nav.Link name="posts" to="#posts" onClick={this.handleSwitch} active={this.state.content === "posts" ? true : false} >
                Posts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={this.state.content === "activity" ? true : false}
                name="activity"
                to="#activity"
                onClick={this.handleSwitch}
              >
                Activity
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="tab-content p30">
            <div id="tab1" className="tab-pane active">
              {display}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(() => { }, {
  updateRecruited, updateLikeActivity,
  updateUnLikeActivity,
  updateCommentActivity,
})(Basic);
