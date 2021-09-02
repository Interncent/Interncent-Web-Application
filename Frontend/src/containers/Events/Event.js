import React from "react";
import { Link } from "react-router-dom";

function Event(props) {
    return (
        <div className="card" onClick={()=>props.history.push(`/event/${props._id}`)}>
            <div className="image">

                <img src={props.photo} alt="event" />
            </div>
            <div className="content">
                <div className="header">{props.title}</div>
                <div className="meta">
                    <Link>{props.organiser.fname}</Link>
                </div>
                <div className="description">
                    {props.description.substring(100)}...<Link>Read More</Link>
                </div>
            </div>
            <div className="extra content">
                <span className="right floated">
                    Joined in 2013
                </span>
                <span>
                    <i className="user icon"></i>
                    {props.registrations.length} Registered
                </span>
            </div>
        </div>
    )
}


export default Event
