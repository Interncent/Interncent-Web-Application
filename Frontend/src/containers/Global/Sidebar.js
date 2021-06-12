import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: this.props.isMobile,
            user: this.props.currentUser.user,
            isAuthenticated: this.props.currentUser.isAuthenticated,
        }
        // this.toggleSidebar = (e) => {
        //     this.setState({ isOpen: !this.state.isOpen });
        //     e.target.style.width = window.getComputedStyle(e.target).width === this.state.isOpen ? '0px' : '300px';
        // }
    }
    render() {
        var style = this.props.isOpen ? { width: '300px' } : { width: '0px' };
        console.log(this.props.isOpen);
        return (
            <div id="mySidebar" className="sidebar" style={style}>
                <div id="scrollableSide">
                    {this.state.isAuthenticated &&
                        <div className="sidebar-header">
                            <Link to={"/profile/" + this.state.user.email.split('@')[0]}>
                                <div className="user-pic">
                                    <img className="img-responsive img-rounded" src={this.state.user.photo} alt="User" />
                                </div>
                            </Link>
                            <div className="user-info">
                                <Link to={"/profile/" + this.state.user.email.split('@')[0]}>
                                    <div>{this.state.user.fname} {this.state.user.lname}</div>
                                    <div>{this.state.user.role}</div>
                                    <div className="user-status">
                                        <i className="fa fa-circle"></i>
                                    Online
                                </div>
                                </Link>
                            </div>
                        </div>
                    }
                    <div className="sidebar-menu">
                        <Link to="/home" className="mains">
                            <i className="fas fa-home ic"></i>
                                Home
                        <span className="sr-only">(current)</span>
                        </Link>


                        <Link to="/community" className="mains">
                            <i className="fas fa-users ic">
                            </i>
                        Community
                        </Link>
                        <Link className="mains" to="/messaging">
                            <i className="fas fa-envelope ic">
                            </i>Messaging
                        </Link>
                        {this.state.isAuthenticated &&
                            <Link to="/bookmarks" className="mains">
                                <i className="fas fa-bookmark ic">
                                    <span className="badge badge-info">{this.state.user.bookmarks.length}</span>
                                </i>
                            Bookmarks
                            </Link>
                        }


                        <Link className="mains" to='/aboutUs'>
                            <i className="fas fa-user-tie ic"></i>

                            About Us
                        </Link>

                        <Link className="mains" to='/contactUs'>
                            <i className="far fas fa-address-book ic"></i>
                            Contact Us
                        </Link>
                        <Link className="mains" onClick={this.props.logout}>
                            <i className="fas fa-sign-out-alt ic"></i>
                            Logout
                        </Link>
                    </div>
                </div>
            </div>

        )
    }
}
export default connect(() => { return {} }, {})(Sidebar);
