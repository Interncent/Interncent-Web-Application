import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../../services/api'

class UserSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggested: []
        };
        this.filterFunction = (e) => {
            e.preventDefault();
            console.log("filter ma aaya");
            var filter;
            filter = e.target.value;

            if (filter === "") {
                return this.setState({ suggested: [] });
            }
            apiCall("get", "/suggestUsers/" + filter, "")
                .then(async (users) => {
                    console.log(users);
                    await this.setState({ suggested: users });
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        this.linkFunc = (id, email) => {
            if (this.props.onPage === 'messaging')
                return `/createchat/${id}`
            else
                return `/profile/${email.split('@')[0]}`
        }
    }

    render() {

        return (
            <div id="userSearch">
                <div className="dropdown">
                    <div id="myDropdown" className="dropdown-content">
                        <input
                            type="search"
                            placeholder="Search Users"
                            className="form-control mr-sm-2"
                            value={this.state.inputValue}
                            onChange={this.filterFunction}
                        />
                        <div className="suggestedResults">
                            {this.state.suggested.map((user) => (
                                <Link to={this.linkFunc(user._id, user.email)}
                                    className="suggested"
                                >
                                    <img src={user.photo} alt="user"></img>
                                    <span>
                                        {user.fname} {user.lname}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserSearch
