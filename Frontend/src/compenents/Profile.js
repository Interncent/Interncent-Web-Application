import React, { Component } from "react";
import Navbar from "../containers/Global/Navbar";
import PageFooter from "../containers/Global/PageFooter";
import { apiCall } from "../services/api";
import Basic from "../containers/Profile/Basicinfo";
import Moreinfo from "../containers/Profile/Moreinfo";
import MoreInfoCouncil from '../containers/Profile/MoreInfoCouncil'
import UserActivity from "../containers/Profile/UserActivity";
import Loading from "../images/Loading";
import NotFound from "../images/NotFound"


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        skills: [],
        posts: [],
        applications: [],
      },
      owner: false,
      start: true,
      startpost: true,
      nof: false,
      profileId: this.props.match.params.id
    };
    this.updateposts = () => {
      // if (this.state.user.posts.length > 0) {
        // if (typeof this.state.user.posts[0] === 'string' || this.state.user.posts[0] instanceof String){
        apiCall("get", "/getUsersPosts/" + this.props.currentUser.user._id, '').then((li) => {
          this.state.user.posts = li.posts
          console.log(li.posts)
          this.setState({ ...this.state, startpost: false })
        })
          .catch((e) => console.log(e))
        this.state.user.posts = []
        this.setState({ ...this.state ,startpost: true})
        // }
        // else{
        //   // already have data no need to api call again
        // }
      // } else {
      //   this.setState({ startpost: false })
      // }

    }
  }

  async componentDidMount() {
    document.documentElement.scrollTop = 0;
    if (this.props.currentUser.user.email.split('@')[0] === this.state.profileId) {
      let i = 0;
      let temp = this.props.currentUser.user
      for (i = 0; i < temp.certificates.length; i++) {
        temp.certificates[i].date = new Date(temp.certificates[i].date)
      }

      this.setState({ user: temp, owner: true, start: false });


    }
    else {
      apiCall("get", "/userForProfile/" + this.props.match.params.id, "")
        .then(async (data) => {
          console.log(data);
          let i = 0;
          for (i = 0; i < data.certificates.length; i++) {
            data.certificates[i].date = new Date(data.certificates[i].date)
          }
          await this.setState({
            user: data,
            start: false,
            startpost: false
          });
        })
        .catch(async (err) => {
          console.log(err);
          await this.setState({
            start: false,
            nof: true
          });
        });
    }
  }
  render() {
    if (this.state.start) {
      return (
        <div id="profile">
          <Navbar history={this.props.history} />
          <div className="loading-anime">
            <Loading className="loading-wheel" />
          </div>
          <PageFooter />
        </div>
      );
    } else if (this.state.nof) {
      return (
        <div id="profile">
          <Navbar history={this.props.history} onPage="profile" />
          <NotFound></NotFound>
          <PageFooter />
        </div>
      )
    }
    else {
      return (
        <div id="profile">
          <link
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
            rel="stylesheet"
          ></link>
          <Navbar history={this.props.history} onPage="profile" />
          <section id="content" className="container">
            <Basic user={this.state.user} owner={this.state.owner} />
            <div className="row">
              {this.state.user.role === "Council" &&
                <MoreInfoCouncil owner={this.state.owner} user={this.state.user} />
              }
              {this.state.user.role !== "Council" &&
                <Moreinfo
                  isowner={this.state.owner}
                  user={this.state.user}
                />
              }
              <UserActivity owner={this.state.owner} history={this.props.history} start={this.state.startpost} updateposts={this.updateposts} posts={this.state.user.posts} user={this.state.owner ? this.props.currentUser.user : this.state.user} loggedin={this.props.currentUser.user} />
            </div>
          </section>
          <PageFooter />
        </div>
      );
    }
  }
}

export default Profile;
