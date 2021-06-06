import React from 'react'
import './chat.css'
import Navbar from '../Global/Navbar'
import socketClient from "socket.io-client";
const SERVER = "http://localhost:3001";
var socketstore = null;

class ChatApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      messages: [],
      message: '',
      interactions: [
        {
          otherUser: {
            fname: 'Ujjwal',
            lname: 'Mathur',
            photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'
          }
        },
        {
          otherUser: {
            fname: 'Vedant',
            lname: 'Nagani',
            photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'
          }
        }
      ],
      socket: null,
      searchQuery: ''
    };
    this.escapeRegex = (text) => {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    this.handleQueryChange = (e) => {
      this.setState({ searchQuery: e.target.value });
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.configureSocket = async () => {
      var socket = socketClient(SERVER, { transport: ['websocket'] });
      console.log("started socket");
      socket.on("yo", () => {
        console.log("connected to server");
      });
      socket.on('new-messr', m => {
        console.log(m)
        let tilln = this.state.messages
        tilln.push(m)
        this.setState({ messages: tilln })
      })
      socket.on('get-rmess', m => {
        this.setState({ messages: m.messages, contacts: [m.counsellor, m.advisee] })
        console.log(m)
      })
      socket.emit("join-room", this.props.match.params.id)
      socketstore = socket
      //this.setState({ socket })
      //socket.close()
    };
  }
  async componentDidMount() {
    console.log('Hello World');
    await this.configureSocket();
  }


  render() {
    return (
      <div id="chat">
        <Navbar user={this.props.user} logout={this.props.logout}></Navbar>

        <div className="app">
          <div className="contact-list">
            <h1 className="title" style={{ margin: '8px 12px' }}>Conversations</h1>
            <div className="searchPeople">
              <div class="ui icon input" style={{ margin: '8px 12px', width: '90%' }}>
                <input type="text" placeholder="Search People" onChange={this.handleQueryChange} />
                <i class="search icon"></i>
              </div>
            </div>
            <div>
              <ContactList interactions={this.state.interactions} searchQuery={this.state.searchQuery} />
            </div>
          </div>
          <div className="messages">
            <div className="messages-history">
              <MessagesHistory uid={this.props.uid} items={this.state.messages} />
            </div>
            <form className="messages-inputs" onSubmit={this.handleSubmit}>
              <input type="text" placeholder="Send a message" onChange={this.handleQueryChange} value={this.state.searchQuery} />
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

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.message.length) {
      return;
    }
    const newItem = {
      text: this.state.message,
      author: this.props.uid
    };
    socketstore.emit('room-message', { message: newItem, rid: this.props.match.params.id })
    this.setState({ message: '' });
  }
}

class MessagesHistory extends React.Component {

  render() {
    return [].concat(this.props.items).reverse().map(item => {
      return (
        <div className={"message " + (item.author._id === this.props.uid ? "me" : "")} key={item.id}>
          <div className="message-body">
            <h5 style={{ margin: "0px" }}>{item.author.name}</h5>
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
    console.log(filterdInteractions)
    console.log(this.props.searchQuery)
    return (
      <ul>
        {filterdInteractions.map(interaction => (
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <img className="otherUserPhoto" src={interaction.otherUser.photo} alt='user'></img>
            <div className="otherUserName">{interaction.otherUser.fname + ' ' + interaction.otherUser.lname}</div>
          </li>
        ))}
      </ul>
    )
  }
}
export default ChatApp;


