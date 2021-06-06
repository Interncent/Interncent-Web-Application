import React, { Component } from "react";
import Navbar from "../Global/Navbar";
import PageFooter from "../Global/PageFooter";
import { apiCall } from "../../services/api";
import Loading from "../../images/Loading";
import { PostWall } from "../../compenents/Community";
import {
  updateLikeActivity,
  updateUnLikeActivity,
  updateCommentActivity,
} from "../../store/actions/user";
import { connect } from "react-redux";

class PostMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      start: true,
    }
  }
  componentDidMount() {
    document.documentElement.scrollTop = '0';
    apiCall("get", '/community/posts/getAllWithHashtag/' + this.props.match.params.id, "")
      .then((data) => {
        this.setState({ posts: data, start: false });
      })
      .catch((e) => {
        console.log("error")
        this.setState({ start: false });
      });
  }
  render() {
    return (
      <div id="postalone">
        <Navbar
          onPage="community"
          history={this.props.history}
        />
        <div id="heightforfooter">
          <div style={{ textAlign: 'center', paddingTop: '20px',paddingBottom:'30px' }}>
            <h1>Posts with Hashtag <span style={{ color: '#4183c4' }}>#{this.props.match.params.id} </span></h1>
          </div>
          {this.state.data !== null ?
            <PostWall
              history={this.props.history}
              isprofile={false}
              start={this.state.start}
              postcreate={false}
              posts={this.state.posts}
              loggedin={this.props.currentUser}
              currentUser={null}
              updateLikeActivity={this.props.updateLikeActivity}
              updateUnLikeActivity={this.props.updateUnLikeActivity}
              updateCommentActivity={this.props.updateCommentActivity}
            /> : <div className="loading-anime">
              <Loading className="loading-wheel" />
            </div>
          }</div>
        <PageFooter />
      </div>
    );
  }
}

export default connect(() => { }, {
  updateLikeActivity,
  updateUnLikeActivity,
  updateCommentActivity,
})(PostMain);