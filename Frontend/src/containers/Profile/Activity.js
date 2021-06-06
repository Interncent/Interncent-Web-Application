import React, { Component } from "react";
import { Link } from "react-router-dom";
import NoActivity from '../../images/NoActivity'
import Moment from 'react-moment';

class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: []
        }

    }
    async componentWillMount() {
        console.log(this.props.posts)
        var activity = [];
        const { liked, commented } = this.props.user;
        var likedIndex = liked.length - 1;
        var commentedIndex = commented.length - 1;
        liked.forEach(p => {
            p.created = new Date(p.created);
            p.type = 'Liked';
        })
        commented.forEach(p => {
            p.created = new Date(p.created);
            p.type = 'Commented';
        })
        console.log(liked, commented);

        while (likedIndex > -1 && commentedIndex > -1) {
            if (liked[likedIndex].created >= commented[commentedIndex].created) {
                activity.push(liked[likedIndex]);
                likedIndex--;
            }
            else if (liked[likedIndex].created < commented[commentedIndex].created) {
                activity.push(commented[commentedIndex]);
                commentedIndex--;
            }
        }
        if (commentedIndex > -1) {
            commented.splice(commentedIndex + 1, commented.length)
            activity = activity.concat(commented);
        } else if (likedIndex > -1) {
            liked.splice(likedIndex + 1, liked.length);
            activity = activity.concat(liked);
        }
        await this.setState({ activity });
    }

    render() {
        console.log(this.props.activity);
        var person = "";
        if (this.props.owner) {
            person = "You"
        } else {
            person = `${this.props.user.fname} ${this.props.user.lname}`
        }
        if (this.state.activity.length === 0)
            return (
                <div id="experience">
                    <NoActivity></NoActivity>
                </div>
            )
        else {
            return (
                <div id="experience">
                    <div className="ui feed" style={{ marginTop: '10px' }}>
                        {this.state.activity.map(act =>
                            <div className="event">
                                <div className="label" >
                                    {act.post.image !== undefined ?
                                        <img src={act.post.image} alt="" style={{ width: '43px', height: '43px', borderRadius: '3px', objectFit:'cover' }} /> :
                                        act.type === "Liked" ? <i className="fas fa-thumbs-up" style={{ fontSize: '40px', marginLeft: '1px' }} ></i> : <i className="fa fa-comment" style={{ fontSize: '40px', marginLeft: '1px' }}></i>
                                    }
                                </div>
                                <div className="content">
                                    <div className="date">
                                        <Moment fromNow>{act.created.toString()}</Moment>
                                    </div>
                                    {act.type === "Liked" ?
                                        <div className="summary">
                                            {person} liked <Link to={'/profile/' + act.post.author.email.split('@')[0]}>{act.post.author.fname} {act.post.author.lname}'s</Link> <Link to={'/post/' + act.post._id}>Post</Link>.
                                        </div>
                                        :
                                        <div className="summary">
                                            {person} commnented on <Link to={'/profile/' + act.post.author.email.split('@')[0]}>{act.post.author.fname} {act.post.author.lname}'s</Link> <Link to={'/post/' + act.post._id}>Post</Link>.
                                        </div>
                                    }
                                    <hr className="short br-lighter"></hr>
                                </div>
                            </div>

                        )}

                    </div>
                </div>
            )
        }
    }
}

export default Activity;