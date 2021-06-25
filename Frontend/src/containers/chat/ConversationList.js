import React from 'react'
import './chat.css'
import Navbar from '../Global/Navbar'
import socketClient from "socket.io-client";
import { Link } from 'react-router-dom';
import { apiCall } from '../../services/api'
import MessagesSVG from '../../images/MessagesSVG'

const SERVER = "http://localhost:3002";
var socketstore = null;

class ChatApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            interactions: [],
            searchQuery: '',
        };

        this.handleQueryChange = (e) => {
            this.setState({ searchQuery: e.target.value });
        }


    }
    async componentDidMount() {
        apiCall('put', '/message/interactions', { uid: this.props.currentUser.user._id })
            .then((result) => {
                var socket = socketClient(SERVER, { transport: ['websocket'] });

                socket.on("yo", () => {
                    console.log("connected to server");
                    socket.emit("statusonline", { uid: this.props.currentUser.user._id })
                });
                socket.on("newinteraction",(inter)=>{
                    let intercopy=this.state.interactions
                    intercopy.unshift(inter)
                    this.setState({ ...this.state ,interactions: intercopy})
                })
                socket.on('new-messr', async m => {
                    var interactionsCopy=this.state.interactions
                    // Online Ordering
                    if (m.conversationId !== this.state.interactions[0].conversation._id) { // if latest interaction is not at top
                    var interaction = this.state.interactions.findIndex(i => i.conversation._id === m.conversationId)
                    //   console.log(interaction)
                    interactionsCopy = this.state.interactions.slice()
                    interaction = interactionsCopy.splice(interaction, 1)
                    await interactionsCopy.unshift(interaction[0])
                    //   console.log(interactionsCopy)
                    }
                    var i
                    for (i = 0; i < this.state.interactions.length; i++) {
                    if (this.state.interactions[i].conversation._id === m.conversationId) {
                        this.state.interactions[i].unreadmessages += 1
                        break
                    }
                    }
                    this.setState({ ...this.state ,interactions: interactionsCopy})
                    }
                )
                    // sorting interaction and joining socket 
                    var i
                    for (i = 0; i < result.length; i++) {
                    if (result[i].conversation._id == this.props.match.params.id) continue
                    socket.emit("join-room-justsocket", { rid: result[i].conversation._id, uid: this.props.currentUser.user._id })
                    }
                    result.sort(function (a, b) {
                    return new Date(b.conversation.updatedAt) - new Date(a.conversation.updatedAt);
                    });

                socketstore = socket
                this.setState({socket, interactions: result })
            }).catch((err) => {
                console.log(err)
            });
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
                            <ContactList interactions={this.state.interactions} searchQuery={this.state.searchQuery} />
                        </div>
                    </div>
                    <div className="messages">

                        <MessagesSVG></MessagesSVG>

                    </div>
                </div>
            </div>
        );
    }


}


class ContactList extends React.Component {
    render() {
        var filterdInteractions = this.props.searchQuery === "" ? this.props.interactions : this.props.interactions.filter(i => (i.otherUser.fname + ' ' + i.otherUser.lname).toLowerCase().includes(this.props.searchQuery.toLowerCase()))

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




