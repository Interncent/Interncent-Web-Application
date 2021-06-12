import React, { Component } from "react";
import { Link } from 'react-router-dom';

class InternshipList extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.dateFormat = this.dateFormat.bind(this)
  }
  dateFormat() {
    let apply = new Date(this.props.applyBy);
    return apply.toDateString();
  }
  render() {
    return (
      <Link to={"/internship/" + this.props._id}>
        <div className="template" >
          <div className="top">
            <img src={this.props.faculty.photo} alt="pfp" className="avatar-pro"></img>
            <div className="author">{this.props.faculty.fname} {this.props.faculty.lname}</div>
          </div>
          <hr className='topHr' />
          <div className="container">
            <h4 className="title">{this.props.title}</h4>
            <div className="closedpack">
              <p><i className="fa fa-home mr-1"></i>  {this.props.type}</p>
              <p><i className="fa fa-clock mr-1"></i>  {this.props.duration} months</p>
              <p><i className="fa fa-hourglass mr-2"></i>Apply by {this.dateFormat()}</p>
            </div>
          </div>
        </div>
      </Link >
    );
  }
}

export default InternshipList;
