import React from 'react'
import './chat.css'
import Navbar from '../Global/Navbar'
import { Link } from 'react-router-dom';
import { apiCall } from '../../services/api'
import MessagesSVG from '../../images/MessagesSVG'


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
                this.setState({ interactions: result })
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
                    <Link to={'/messaging/' + interaction.conversation} style={{ color: 'white' }} >
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




