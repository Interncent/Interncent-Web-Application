import React from "react";
import Navbar from "../containers/Global/Navbar";
import PageFooter from "../containers/Global/PageFooter";
import { apiCall } from "../services/api";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import NoPost from "../images/NoPost";
import {
  updateLikeActivity,
  updateUnLikeActivity,
  updateCommentActivity,
} from "../store/actions/user";
import { connect } from "react-redux";
import Moment from "react-moment";
import { Spinner } from 'react-bootstrap'

import { InView } from "react-intersection-observer";
import Loading from "../images/Loading";

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isMobile: false };
    this.checkResolution = this.checkResolution.bind(this);
  }

  checkResolution(e) {
    if (document.documentElement.offsetWidth < 900 && !this.state.isMobile)
      this.setState({ isMobile: true });
    else if (document.documentElement.offsetWidth > 900 && this.state.isMobile)
      this.setState({ isMobile: false });
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    if (document.documentElement.offsetWidth < 900)
      this.setState({ isMobile: true });
    else this.setState({ isMobile: false });
    window.addEventListener("resize", this.checkResolution);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.checkResolution);
  }

  render() {
    return (
      <div className="wrapper" style={{ background: '#f5f5f5' }} id="community" >
        <Navbar
          isMobile={this.state.isMobile}
          {...this.props}
          onPage="community"
        />
        <ScrollTopButton />
        <Feed
          isMobile={this.state.isMobile}
          currentUser={this.props.currentUser}
          history={this.props.history}
          updateLikeActivity={this.props.updateLikeActivity}
          updateUnLikeActivity={this.props.updateUnLikeActivity}
          updateCommentActivity={this.props.updateCommentActivity}
        />
        <PageFooter />
      </div>
    );
  }
}

class ScrollTopButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      styles: { display: "none" },
    };
    this.visible = false;
    this.scrollHandler = this.scrollHandler.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  scrollHandler() {
    if (window.pageYOffset > document.documentElement.clientHeight / 2) {
      if (!this.state.visible) this.setState({ visible: true });
    } else {
      if (this.state.visible) this.setState({ visible: false });
    }
  }

  resizeHandler() {
    if (this.isThrottled === undefined) this.isThrottled = false;
    if (this.isQueueEmpty === undefined) this.isQueueEmpty = true;

    if (!this.isThrottled) {
      this.isThrottled = true;
      this.setState({
        styles: {
          position: "fixed",
          top: "4.4rem",
          display: `${this.state.visible ? "block" : "none"}`,
        },
      });
      setTimeout(() => {
        this.isThrottled = false;
        if (!this.isQueueEmpty) this.resizeHandler();
      }, 100);
    } else {
      if (this.isQueueEmpty) this.isQueueEmpty = false;
    }
  }

  scrollToTop(e) {
    e.preventDefault();
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    document.addEventListener("scroll", this.scrollHandler);
    window.addEventListener("resize", this.resizeHandler);
  }
  componentWillUnmount() {
    document.removeEventListener("scroll", this.scrollHandler);
    window.removeEventListener("resize", this.resizeHandler);
  }

  render() {
    if (!document.querySelector(".feed-wrapper"))
      this.styles = { display: "none" };
    else
      this.styles = {
        position: "fixed",
        top: "4.4rem",
        left: `${document.querySelector(".feed-wrapper").getBoundingClientRect().left -
          60
          }px`,
        display: `${this.state.visible ? "block" : "none"}`,
      };

    return (
      <div id="scrollTopButton" style={this.styles}>
        <div href="#" onClick={this.scrollToTop}>
          <i className="far fa-caret-square-up"></i>
        </div>
      </div>
    );
  }
}

class PostCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      text: '',
      selectedFile: null,
      status: ''
    };

    this.handleSubmit = (e) => {
      e.preventDefault();
      this.setState({ status: 'uploading' })
      const fd = new FormData(e.target);
      //fd.append('content',this.removeTags(this.textarea.current.innerHTML))
      for (var entry of fd.entries()) {
        console.log(entry);
      }
      apiCall('post', '/community/posts/create', fd)
        .then(async (post) => {
          this.setState({ status: '', selectedFile: null })
          return this.props.history.push('/post/' + post._id)
        }).catch((err) => {
          console.log(err);
        });
    };
    //   this.removeTags=(str)=> {
    //     if ((str===null) || (str===''))
    //     return '';
    //     else
    //     str = str.toString();
    //     return str.replace( /(<([^>]+)>)/ig, '');
    //  }
    this.handleClose = (e) => {
      this.setState({ show: false });
    };
    this.handleShow = (e) => {
      this.setState({ show: true });
    };
    this.fileValidaion = e => {
      this.setState({ selectedFile: e.target.files[0] })
    }
    // this.textarea = React.createRef();
  }
  render() {
    return (
      <div className="posting-area">
        <div onClick={this.handleShow} className="posting-text">
          start post
        </div>
        <div className="posting-but">
          <div className="posting-but1" onClick="">
            <i className="material-icons">insert_photo</i>Photo
          </div>
          <div className="posting-but2" onClick="">
            <i className="material-icons">videocam</i>Video
          </div>
        </div>
        <Modal show={this.state.show} onHide={this.handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create a post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleSubmit} encType='multipart/form-data'>
              <div className="ui form">
                <div className="field">
                  <label>About post</label>
                  <textarea
                    maxlength="200"
                    rows="2"
                    required
                    placeholder="What do you want to talk about?"
                    name="content"
                  ></textarea>
                  {/* <div ref={this.textarea}
                    onInput={this.changed} dangerouslySetInnerHTML={{__html:this.state.text}} className="posttextarea" contentEditable={true}></div> */}
                </div>
                <div className="field">
                  <label>Media Upload</label>
                  <input onChange={this.fileValidaion} type="file" name="file"></input>
                </div>
                <input type="hidden" name="author" value={this.props.user._id} />

                <div className="submit confirmdiv">
                  {this.state.status === "uploading" ?
                    <button className="ui button confirm" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <Spinner animation="border" variant="warning" className="mr-2" ></Spinner>
                      Uploading
                    </button>
                    :
                    <button className="medium ui button confirm">Post</button>
                  }
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div >
    );
  }
}

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.POSTS_LIMIT = 5
    this.state = {
      posts: [],
      start: true,
      thereismore: false,
      getnewposts: () => {
          apiCall("get", "/community/posts/nextAll/"+this.state.posts[this.state.posts.length - 1]._id, {params:{limit:this.POSTS_LIMIT}})
            .then((posts) => {
              let li = this.state.posts
              console.log(posts)

              return this.setState({
                ...this.state,
                posts: li.concat(posts),
                thereismore: (posts.length === this.POSTS_LIMIT),
                start: false,
              });
            })
            .catch((err) => {
              console.log(err);
              // return this.setState({ ...this.state });
            });
      },
      trending: [],
    };
  }

  componentWillMount() {
    apiCall("get", "/community/posts/getAll", {params:{limit:this.POSTS_LIMIT}})
      .then((data) => {
        this.setState({ posts: data.posts,thereismore: (data.posts.length === this.POSTS_LIMIT), trending: data.trending, start: false });
      })
      .catch((e) => {
        console.log("error");
        this.setState({ start: false });
      });
  }
  // componentDidMount(e) {
  //   if (document.documentElement.scrollTop === document.documentElement.scrollHeight) {
  //     console.log('Start Dynamic Loading')
  //   }
  // }

  render() {
    return (
      <div id="feed">
        <div className="content-wrapper feed-wrapper">
          <PostWall
            history={this.props.history}
            isprofile={false}
            postcreate={true}
            loggedin={this.props.currentUser}
            currentUser={null}
            {...this.state}
            updateLikeActivity={this.props.updateLikeActivity}
            updateUnLikeActivity={this.props.updateUnLikeActivity}
            updateCommentActivity={this.props.updateCommentActivity}
          />
          <div className="right-side">
            <div className="controls">
              <h3>Trending Hashtags</h3><hr></hr>
              {this.state.trending.map((val, i) => {
                return <Link to={"/hashtag/" + val.name} className="notblue">{i !== 0 && <hr></hr>}<h5><p>{(i + 1) + '.  '}</p>{'#' + val.name}</h5><p>{val.length + ' posts'}</p></Link>
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class PostWall extends React.Component {
  getPostById(id) {
    if (!this.props.posts[id]) return;
    return (
      <Post
        isprofile={this.props.isprofile}
        id={id}
        key={id}
        userprofile={this.props.currentUser}
        loggedin={this.props.loggedin}
        options={this.props.posts[id]}
        updateLikeActivity={this.props.updateLikeActivity}
        updateUnLikeActivity={this.props.updateUnLikeActivity}
        updateCommentActivity={this.props.updateCommentActivity}
      />
    );
  }

  renderAll() {
    let elem = [];
    for (let key in this.props.posts) {
      elem.push(this.getPostById(key));
    }
    if (!elem.length) {
      if (this.props.start) elem.push(<div></div>);
      else elem.push(<NoPost></NoPost>);
    }
    return elem;
  }

  render() {
    let content;
    content = this.renderAll();
    console.log(this.props.start)
    return (
      <div className="post-wall">
        {this.props.postcreate && (
          <PostCreate
            history={this.props.history}
            user={this.props.loggedin.user}
          />
        )}
        {content}
        {this.props.thereismore && <InView onChange={(iv,e)=>{if (iv) this.props.getnewposts()}}>
                {({ inView, ref, entry }) => (
                <div ref={ref}><Loading className="loading-wheel" /></div>
                )}
                </InView>
              }
      </div >
    );
  }
}

export class Post extends React.Component {
  constructor(props) {
    super(props);
    let options = props.options;
    // console.log(options.comments)
    this.state = {
      commentsExpanded: false,
      likes: options.likedBy.length,
      isLiked: options.likedBy.includes(props.loggedin.user._id),
      comments: options.comments,
      imageLoaded: false,
    };
    this.id = options._id;
    this.content = options.content;
    if (!props.isprofile) {
      this.authordata = { ...options.author }
    } else {
      this.authordata = { ...this.props.userprofile }
    }
    this.img = options.image;
    this.likeHandler = this.likeHandler.bind(this);
    this.addCommentHandler = this.addCommentHandler.bind(this);

    this.showComments = this.showComments.bind(this);
    this.hideComment = this.hideComment.bind(this);
    this.addCommentDecorator = this.addCommentDecorator.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.itstag = false
    this.tag = ''
  }
  handleImageLoad(e) {
    this.setState({ imageLoaded: true });
  }

  get commentsCount() {
    return this.state.comments.length;
  }
  likeHandler(e) {
    e.preventDefault();
    let button = e.target.closest(".likes");
    let lik = this.state.likes;
    if (!this.state.isLiked) {
      apiCall("post", "/community/posts/like/" + this.id, {
        id: this.props.loggedin.user._id,
      })
        .then((date) => {
          console.log(date);
          button.classList.toggle("liked");
          lik++;
          this.setState({
            ...this.state,
            isLiked: !this.state.isLiked,
            likes: lik,
          });
          var activity = {
            created: date,
            post: { ...this.props.options, author: this.authordata },
          };
          console.log(this.props.userprofile, activity);
          this.props.updateLikeActivity(activity);
        })
        .catch((e) => console.log(e));
    } else {
      apiCall("put", "/community/posts/like/" + this.id, {
        id: this.props.loggedin.user._id,
      })
        .then((data) => {
          button.classList.toggle("liked");
          lik--;
          this.setState({
            ...this.state,
            isLiked: !this.state.isLiked,
            likes: lik,
          });
          this.props.updateUnLikeActivity(this.props.options._id);
        })
        .catch((e) => console.log(e));
    }
  }

  addCommentHandler(e) {
    e.preventDefault();
    let form = e.target;
    let commentText = form.text.value.trim();
    if (!commentText.length) {
      form.text.value = "";
      return;
    }
    apiCall("post", "/community/posts/comments/" + this.id, {
      id: this.props.loggedin.user._id,
      text: commentText,
    }).then((comment) => {
      var newComment = {
        _id: comment._id,
        created: comment.created,
        author: {
          fname: this.props.loggedin.user.fname,
          lname: this.props.loggedin.user.lname,
          photo: this.props.loggedin.user.photo,
          email: this.props.loggedin.user.email,
        },
        text: commentText,
      };
      var activity = {
        created: newComment.created,
        post: { ...this.props.options, author: this.authordata }
      };
      this.props.updateCommentActivity(activity);
      this.state.comments.push(newComment);
      form.text.value = "";
      this.setState({ ...this.state, commentsExpanded: true });
    });
  }

  showComments(e) {
    e.preventDefault();
    this.setState({ ...this.state, commentsExpanded: true });
  }
  hideComment(e) {
    e.preventDefault();
    this.setState({ ...this.state, commentsExpanded: false });
  }

  addCommentDecorator(e) {
    e.preventDefault();
    this.showComments(e);
    this.addCommentHandler(e);
    // this.scrollToBottom();
  }

  render() {
    // console.log(this.content)
    this.tag = ''
    this.itstag = false
    return (
      <div className="post" id={this.id}>
        <div className="post-wrapper">
          <UserInfo
            userAvatar={this.authordata.photo}
            date={this.props.options.created}
            email={this.authordata.email}
            username={this.authordata.fname + ' ' + this.authordata.lname}
          />
          <div className="post-content">
            <p>{this.content.split('').map((c) => {
              if (c === '#' && !this.itstag) {
                this.itstag = true
                this.tag = '#'
              }
              else if (this.itstag) {
                if (!c.match(/^[A-Za-z0-9]$/)) {
                  this.itstag = false
                  let tag = this.tag
                  this.tag = ''
                  return <Link to={'/hashtag/' + tag.slice(1, tag.length)}>{tag + ' '}</Link>
                }
                else {
                  this.tag += c
                }
              }
              else {
                return c
              }
            })}{this.itstag && <Link to={'/hashtag/' + this.tag.slice(1, this.tag.length)}>{this.tag}</Link>}</p>
            {this.img !== undefined && (
              <img onLoad={this.handleImageLoad} src={this.img} alt=""></img>
            )}

          </div>
          <PostInfo
            likes={this.state.likes}
            commentsCount={this.commentsCount}
            likeHandler={this.likeHandler}
            isLiked={this.state.isLiked}
            showComments={this.showComments}
            idpost={this.id}
          />

          <Comments
            messageEnd={this.messagesEnd}
            comments={this.state.comments}
            isExpanded={this.state.commentsExpanded}
            hideComment={this.hideComment}
          />
          <CommentInput
            loggedin={this.props.loggedin.user}
            addCommentHandler={this.addCommentDecorator}
          />
        </div>
      </div>
    );
  }
}

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.commentEnd = {};
  }
  componentDidUpdate() {
    if (this.commentEnd) {
      this.commentEnd.scrollTop = this.commentEnd.scrollHeight;
    }
  }
  render() {
    if (!this.props.comments.length || !this.props.isExpanded)
      return <div className="empty-comments"></div>;

    let commentsArr = this.props.comments.map((val, i) => {
      return <Comment data={val}></Comment>;
    });

    let hideButton = (
      <div className="hide-comments-button">
        <div onClick={this.props.hideComment}>Hide comments</div>
      </div>
    );

    return (
      <div className="comments-container">
        {this.props.isExpanded ? hideButton : ""}
        <div
          className="comments-wrapper ui threaded comments"
          ref={(el) => {
            this.commentEnd = el;
          }}
        >
          {commentsArr}
        </div>
      </div>
    );
  }
}

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isliked: false,
      data: props.data,
    };
  }
  handleLike(e) {
    // console.log(e);
  }
  render() {
    let val = this.state.data;
    console.log(val)
    return (
      <div className="comment">
        <img alt="" src={val.author.photo} className="avatar-pro" />
        <div className="content">
          <Link
            to={"/profile/" + val.author.email.split("@")[0]}
            className="author"
          >
            {val.author.fname + " " + val.author.lname}
          </Link>
          <div className="metadata">
            <span className="date"> <Moment fromNow>{val.created}</Moment> </span>
          </div>
          <div className="text">{val.text}</div>
          <div className="actions">
            <button onClick={this.handleLike} className="reply">
              Like
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class UserInfo extends React.Component {
  render() {
    return (
      <div className="user-info">
        <div className="user-avatar">
          <img src={this.props.userAvatar} alt="author"></img>
        </div>

        <div className="user-data">
          <Link to={"/profile/" + this.props.email.split("@")[0]}>
            <div className="username">{this.props.username}</div>
          </Link>

          <div className="post-date">
            <Moment fromNow>{this.props.date}</Moment>
          </div>
        </div>
      </div>
    );
  }
}

class PostInfo extends React.Component {
  render() {
    let likeIconStyle = this.props.isLiked ? "fas" : "far";
    return (
      <div className="post-info">
        <div className="likes" onClick={this.props.likeHandler}>
          <span>
            <div className="icon">
              <i className={`${likeIconStyle} fa-heart`}></i>
            </div>
            <div className="count">{this.props.likes}</div>
          </span>
        </div>
        <div className="comments" onClick={this.props.showComments}>
          <span>
            <div className="icon">
              <i className="far fa-comment-alt"></i>
            </div>
            <div className="count">{this.props.commentsCount}</div>
          </span>
        </div>
        <div className="views">
          <span>
            <div className="icon">
              <Link style={{ color: '#604d92' }} to={"/post/" + this.props.idpost}><i className="fas fa-share"></i></Link>
            </div>
          </span>
        </div>
      </div>
    );
  }
}

class CommentInput extends React.Component {
  render() {
    return (
      <div className="comment-input">
        <div className="user-avatar">
          <img src={this.props.loggedin.photo} alt="user avatar"></img>
        </div>
        <form onSubmit={this.props.addCommentHandler}>
          <input
            name="text"
            type="text"
            maxLength="200"
            placeholder="Write you comment here"
          ></input>
          <button className="submit-button" type="submit"></button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}


export default connect(mapStateToProps, { updateLikeActivity, updateUnLikeActivity, updateCommentActivity })(Application);
