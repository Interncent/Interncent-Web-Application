import React from 'react'
import './chat.css'
import Navbar from '../Global/Navbar'
import socketClient from "socket.io-client";
import { Link } from 'react-router-dom';
const SERVER = "http://localhost:3002";
var socketstore = null;


class ChatApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      messages: [],
      message: '',
      interactions: [],
      socket: null,
      searchQuery: '',
      otherUser: {
        fname: 'Loading....',
        lname: '',
        photo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
      },
      typing: false
    };
    this.escapeRegex = (text) => {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    this.handleQueryChange = (e) => {
      this.setState({ searchQuery: e.target.value });
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartTyping = this.handleStartTyping.bind(this)
    this.handleStopTyping = this.handleStopTyping.bind(this)

    this.configureSocket = async () => {
      var socket = socketClient(SERVER, { transport: ['websocket'] });

      socket.on("yo", () => {
        console.log("connected to server");
      });

      socket.on('new-messr', m => {
        if (m.conversationId==this.props.match.params.id){
        console.log(m)
        let tilln = this.state.messages
        tilln.push(m)
        this.setState({ messages: tilln })
        }
        else{
          // add unread messages
        }
      })

      socket.on('get-rmess', ({ conv, interactions, otherUser }) => {
        this.setState({ messages: conv.messages, interactions, otherUser })
      })

      socket.on('wrong-user', () => {
        console.log('Wrong User')
        return this.props.history.push('/messaging/')
      })

      socket.on('show-typing', () => {
        this.setState({ typing: true })
      })

      socket.on('show-not-typing', () => {
        setTimeout(() => {
          this.setState({ typing: false })
        }, 2500)
      })

      socket.emit("join-room", { rid: this.props.match.params.id, uid: this.props.currentUser.user._id })
      socketstore = socket
      this.setState({ socket })
    };
  }
  async componentDidMount() {
    await this.configureSocket()
  }

  componentWillUnmount() {
    this.state.socket.emit("disconnectchat",this.props.match.params.id,this.props.currentUser.user._id)
  }

  render() {
    console.log(this.state.otherUser)
    return (
      <div id="chat">
        <Navbar history={this.props.history} onPage='messaging'></Navbar>

        <div className="app">
          <div className="contact-list">
            <h1 className="title" style={{ margin: '8px 12px' }}>Conversations</h1>
            <div className="searchPeople">
              <div className="ui icon input" style={{ margin: '8px 12px', width: '90%' }}>
                <input type="text" placeholder="Search People" onChange={this.handleQueryChange} />
                <i className="search icon"></i>
              </div>
            </div>
            <div>
              <ContactList interactions={this.state.interactions} searchQuery={this.state.searchQuery} />
            </div>
          </div>
          <div className="messages">
            <div className="otherUserDetails">
              <img src={this.state.otherUser.photo} alt='otheruser'></img>
              <div>{this.state.otherUser.fname + " " + this.state.otherUser.lname}
                <br />
                {
                  this.state.typing && <small>Typing...</small>
                }
              </div>
            </div>
            <div className="messages-history">
              <MessagesHistory uid={this.props.currentUser.user._id} messages={this.state.messages} />
            </div>
            <form className="messages-inputs" onSubmit={this.handleSubmit}>
              <input type="text" placeholder="Send a message" onChange={this.handleChange} value={this.state.message} onKeyDown={this.handleStartTyping} onKeyUp={this.handleStopTyping} />
              <button><i className="material-icons">send</i></button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ message: e.target.value });
  }

  handleStartTyping(e) {
    socketstore.emit('typing', this.props.match.params.id)
  }
  handleStopTyping(e) {
    socketstore.emit('not-typing', this.props.match.params.id)
  }
  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.message.length) {
      return;
    }
    const newItem = {
      text: this.state.message,
      author: this.props.currentUser.user._id
    };
    socketstore.emit('room-message', { message: newItem, rid: this.props.match.params.id, otherUser: this.state.otherUser._id, uid: this.props.currentUser.user._id })
    this.setState({ message: '' });
  }
}

class MessagesHistory extends React.Component {

  render() {
    return [].concat(this.props.messages).reverse().map(item => {
      return (
        <div className={"message " + (item.author._id === this.props.uid ? "me" : "")} key={item.id}>
          <div className="message-body">
            <h5 style={{ margin: "0px" }}>{item.author.fname + " " + item.author.lname}</h5>
            {item.text}
          </div>
        </div>
      )
    });
  }
}

class ContactList extends React.Component {
  render() {
    var filterdInteractions = this.props.searchQuery === "" ? this.props.interactions : this.props.interactions.filter(i => (i.otherUser.fname + ' ' + i.otherUser.lname).toLowerCase().includes(this.props.searchQuery.toLowerCase()))
    return (
      <ul>
        {filterdInteractions.map(interaction => (
          <Link to={'/messaging/' + interaction.conversation} style={{ color: 'white' }} >
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <img className="otherUserPhoto" src={interaction.otherUser.photo} alt='user'></img>
              <div className="otherUserName">{interaction.otherUser.fname + ' ' + interaction.otherUser.lname}{interaction.unreadmessages>0 && <span class="badge badge-danger">{interaction.unreadmessages}</span>}</div>
            </li>
          </Link>
        ))}
      </ul>
    )
  }
}
export default ChatApp;


