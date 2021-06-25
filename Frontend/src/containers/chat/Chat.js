import React from 'react'
import './chat.css'
import Navbar from '../Global/Navbar'
import socketClient from "socket.io-client";
import { Link } from 'react-router-dom';
import parse from 'html-react-parser'

const SERVER = "http://localhost:3002";
var socketstore = null;



class ChatApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      messages: [],
      message: '',
      image: null,
      interactions: [],
      socket: null,
      searchQuery: '',
      otherUser: {
        fname: 'Loading....',
        lname: '',
        photo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
      },
      typing: false,
      start: true
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
        socket.emit("statusonline", { uid: this.props.currentUser.user._id })
      });
      socket.on("newinteraction", (inter) => {
        let intercopy = this.state.interactions
        intercopy.unshift(inter)
        console.log(intercopy)
        this.setState({ ...this.state, interactions: intercopy })
      })
      socket.on('new-messr', async m => { // need to set isread message true by sending event fix this
        var interactionsCopy = this.state.interactions
        // Online Ordering
        if (m.conversationId !== this.state.interactions[0].conversation._id) {
          console.log('True******')
          var interaction = this.state.interactions.findIndex(i => i.conversation._id === m.conversationId)
          console.log(interaction)
          interactionsCopy = this.state.interactions.slice()
          // if (interaction === -1) {
          //   // var interactionsCopy = this.state.interactions.slice()
          //   // interactionsCopy.push()
          // }
          interaction = interactionsCopy.splice(interaction, 1)
          await interactionsCopy.unshift(interaction[0])
          console.log(interactionsCopy)


          // this.setState({ interactions: interactionsCopy })
        }

        if (m.conversationId === this.props.match.params.id) {
          if (m.author == this.state.otherUser._id) {
            socket.emit('seen-message', { mid: m._id, rid: this.props.match.params.id })
            m.author = this.state.otherUser
          }
          else {
            m.author = this.props.currentUser.user
          }
          let tilln = this.state.messages
          tilln.push(m)
          this.setState({ messages: tilln, interactions: interactionsCopy })
        }
        else {
          var i
          for (i = 0; i < this.state.interactions.length; i++) {
            if (this.state.interactions[i].conversation._id === m.conversationId) {
              this.state.interactions[i].unreadmessages += 1
              break
            }
          }
          this.setState({ ...this.state, interactions: interactionsCopy })
        }
      })


      socket.on('message-is-seen', mid => {
        console.log('Seen message')
        let mess = this.state.messages.slice().map((m) => {
          if (m._id === mid) {
            m.isRead = true
          }
          return m
        })
        this.setState({ messages: mess })
      })

      socket.on('get-rmess', ({ conv, interactions, otherUser }) => {
        console.log(interactions)
        var i
        for (i = 0; i < interactions.length; i++) {
          if (interactions[i].conversation._id == this.props.match.params.id) continue
          socket.emit("join-room-justsocket", { rid: interactions[i].conversation._id, uid: this.props.currentUser.user._id })
        }
        interactions.sort(function (a, b) {
          return new Date(b.conversation.updatedAt) - new Date(a.conversation.updatedAt);
        });
        console.log(interactions)
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
    this.state.socket.emit("disconnectchat", this.props.match.params.id, this.props.currentUser.user._id)
  }

  render() {
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
              <ContactList start={this.state.start} user={this.props.currentUser.user._id} interactions={this.state.interactions} searchQuery={this.state.searchQuery} />
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
      author: this.props.currentUser.user._id,
      type: 'text'
    };
    socketstore.emit('room-message', { message: newItem, rid: this.props.match.params.id, otherUser: this.state.otherUser._id, uid: this.props.currentUser.user._id })
    this.setState({ message: '' });
  }

  handleSubmitImage(e) {
    e.preventDefault();
    if (!this.state.image) {
      return;
    }
    const newItem = {
      text: this.state.message,
      author: this.props.currentUser.user._id,
      type: 'text'
    };
    socketstore.emit('room-message', { message: newItem, rid: this.props.match.params.id, otherUser: this.state.otherUser._id, uid: this.props.currentUser.user._id })
    this.setState({ message: '' });
  }
}

function MessagesHistory(props) {
  const parser = parse

  return [].concat(props.messages).reverse().map(item => {
    return (
      <div className={"message " + (item.author._id === props.uid ? "me" : "")} key={item.id}>
        <div className="message-body">
          <h5 style={{ margin: "0px" }}>{item.author.fname + " " + item.author.lname} {item.isRead ? "Read" : ""}</h5>
          <div>{parser(item.text)}</div>
        </div>
      </div>
    )
  });

}



class ContactList extends React.Component {
  render() {
    var filterdInteractions = this.props.searchQuery === "" ? this.props.interactions : this.props.interactions.filter(i => (i.otherUser.fname + ' ' + i.otherUser.lname).toLowerCase().includes(this.props.searchQuery.toLowerCase()))

    console.log(filterdInteractions)
    return (
      <ul>
        {filterdInteractions.map(interaction => (
          <Link to={'/messaging/' + interaction.conversation._id} style={{ color: 'white' }} >
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <img className="otherUserPhoto" src={interaction.otherUser.photo} alt='user'></img>
              <div className="otherUserName">{interaction.otherUser.fname + ' ' + interaction.otherUser.lname}{interaction.unreadmessages > 0 && <span class="badge badge-danger">{interaction.unreadmessages}</span>}</div>
            </li>
          </Link>
        ))}
      </ul>
    )
  }
}
export default ChatApp;


