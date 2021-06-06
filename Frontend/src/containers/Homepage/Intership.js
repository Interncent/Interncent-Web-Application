import React, { Component } from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { addBookmark, deleteBookmark } from '../../store/actions/user'

class Internship extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarked: this.props.bookmarked,
      style: this.props.bookmarked ? { color: '#ffca3d' } : { color: '#000000' }
    }
    this.dateFormat = this.dateFormat.bind(this);
    this.bookmark = this.bookmark.bind(this);
  }
  dateFormat() {
    let apply = new Date(this.props.applyBy);
    return apply.toDateString();
  }
  bookmark(e) {
    if (this.state.bookmarked) {
      console.log(this.props._id, this.props.currentUser.user._id)
      this.props.deleteBookmark(this.props._id, this.props.currentUser.user._id)
        .then(async () => {
          console.log('bookmark removed');
          await this.setState({ bookmarked: false, style: { color: '#000000' } });
        }).catch((err) => {
          console.log(err);
        });

    } else {
      this.props.addBookmark(this.props._id, this.props.currentUser.user._id)
        .then(async () => {
          console.log('bookmark added');
          await this.setState({ bookmarked: true, style: { color: '#ffca3d' } })
        }).catch((err) => {
          console.log(err);
        });
    }
  }
  render() {
    const id = '/internship/' + this.props._id;
    return (
      <div className="col-xl-3 col-lg-4 col-sm-6">
        <div className="card">
          <div className="template">
            <div className="top">
              <img src={this.props.faculty.photo} alt="pfp" className="avatar-pro"></img>
              <Link className="author" to={"/profile/" + this.props.faculty.email.split('@')[0]}>{this.props.faculty.fname} {this.props.faculty.lname}</Link>
            </div>
            <hr className='topHr' />
            <div className="container">
              <h4 className="title">{this.props.title}</h4>
              <p className="description">{this.props.description.length>53?this.props.description.slice(0,50) + '...':this.props.description}</p>

              <div className="extraDetails">
                {
                  <p>{this.props.type === "Work from Home" ? <i className="fas fa-home"></i> : <i className="fas fa-briefcase"></i>} {this.props.type}</p>
                }
                <p><i className="fa fa-clock mr-1"></i>  {this.props.duration} months</p>
                <p><i className="fa fa-hourglass mr-2"></i>Apply by {this.dateFormat()}</p>
              </div>
            </div>
            <hr></hr>
            <div id="tags-skill" >
              {this.props.skillsRequired.map((skill) => {
                return <span><Badge variant="primary">{skill}</Badge>   </span>;
              })}
            </div>
            <hr></hr>
            <div className="bottom">
              <button
                type="button"
                className="btn btn-default btn-circle btn-md"
                style={this.state.style}
                onClick={this.bookmark}
              >
                <i className="fa fa-bookmark"></i>
              </button>
              <Link className="btn" to={id}>
                More Info
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default withRouter(connect(mapStateToProps, { addBookmark, deleteBookmark })(Internship));
