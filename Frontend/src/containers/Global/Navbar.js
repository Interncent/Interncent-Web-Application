import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import logo from '../../images/logo2.png';
import { MContext } from '../../services/Provider'
import { connect } from 'react-redux';
import { logout } from '../../store/actions/auth'
import UserSearch from '../Search/UserSearch'
import Sidebar from './Sidebar'

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            isAuthenticated: this.props.currentUser.isAuthenticated,
            showDropdown: false,
            isOpen: false
        }

        this.showDropdown = this.showDropdown.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.toggleParent = this.toggleParent.bind(this);
    }


    async toggleSidebar(e) {
        console.log("Toggle hora hai", this.state.isOpen);
        await this.setState({ isOpen: !this.state.isOpen });
        e.target.classList.toggle('change');
    }
    toggleParent(e) {
        e.target.parentElement.classList.toggle('change');
    }
    async logout(e) {
        e.preventDefault();
        await this.setState({ isAuthenticated: false });
        await this.props.logout();
        this.props.history.push('/');

    }
    showDropdown() {
        this.setState({ showDropdown: !this.state.showDropdown })
    }

    render() {
        const rightContent = () => {
            if (this.state.isAuthenticated === true) {
                return (
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item userProfile">
                            <img className="avatar-pro" src={this.props.currentUser.user.photo} alt="user-profile" />
                            <Link to={'/profile/' + this.props.currentUser.user.email.split('@')[0]} className="nav-link username">{this.props.currentUser.user.fname} {this.props.currentUser.user.lname}
                            </Link>
                            <i className="fa" onClick={this.showDropdown} >&#xf0d7;</i>
                            {
                                this.state.showDropdown &&
                                <div className="profile-dropdown" aria-labelledby="dropdownMenuButton" >
                                    <Link className="dropdown-item" to={'/profile/' + this.props.currentUser.user.email.split('@')[0]}>My Profile</Link>
                                    <Link className="dropdown-item" to="">Account</Link>
                                    <Link className="dropdown-item" to="" onClick={this.logout}>Logout</Link>
                                </div>
                            }

                        </li>
                    </ul>
                )
            } else {
                return (
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/#signup">
                                <i className="fas fa-user-plus mr-1"></i>Signup</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/#"><i className="fas fa-sign-in-alt mr-1"></i>Signin</Link>
                        </li>
                    </ul>
                )
            }
        }
        return (
            <div>
                <nav className="navbar navbar-expand-lg fixed-top bg-white blur shadow-lg">
                    <div className="container">
                        <Link className="navbar-brand" to="/home">
                            <img src={logo} alt="logo" className="logo" />
                        </Link>

                        <button className="openbtn" style={{ margin: '30px 12px' }} type="button" data-toggle="collapse">
                            <div className="container" onClick={this.toggleSidebar}>
                                <div className="bar1" onClick={this.toggleParent}></div>
                                <div className="bar2" onClick={this.toggleParent}></div>
                                <div className="bar3" onClick={this.toggleParent}></div>
                            </div>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">

                            <div className="form-inline my-2 my-lg-0">
                                {this.props.onPage === "home" &&
                                    <MContext.Consumer>
                                        {
                                            context => (
                                                <div><input onKeyUp={e => { if (e.which === 13) { context.filter() } }} onChange={(e) => context.setMessage(e.target.value)} className="form-control mr-sm-2" type="search" placeholder="Search Internships" aria-label="Search" name="internshipSerach" />
                                                </div>)
                                        }
                                    </MContext.Consumer>
                                }
                                {["community", 'profile'].includes(this.props.onPage) &&
                                    <UserSearch />
                                }
                                {
                                    this.props.onPage === "bookmarks" &&
                                    <input onChange={(e) => (this.props.getQuery(e.target.value))} type="search" placeholder="Search from Bookmarks" className="form-control mr-sm-2"></input>
                                }

                                {
                                    this.props.onPage === "messaging" &&
                                    <UserSearch onPage="messaging" />
                                }
                                {
                                    this.props.onPage === "applications" &&
                                    <input onChange={(e) => (this.props.getQuery(e.target.value))} type="search" placeholder="Search Applicants" className="form-control mr-sm-2"></input>
                                }

                                {this.props.onPage === "events" &&
                                    <MContext.Consumer>
                                        {
                                            context => (
                                                <div><input onKeyUp={e => { if (e.which === 13) { context.filter() } }} onChange={(e) => context.setMessage(e.target.value)} className="form-control mr-sm-2" type="search" placeholder="Search Events" aria-label="Search" name="internshipSerach" />
                                                </div>
                                            )
                                        }
                                    </MContext.Consumer>
                                }
                            </div>
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <Link className="nav-link" to="/home">
                                        <i className="fas fa-home mr-1"></i>Home <span className="sr-only" to="">(current)</span></Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/community">
                                        <i className="fas fa-users mr-1"></i>Community</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/messaging"><i className="fas fa-envelope mr-1"></i>Messaging</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/bookmarks"><i className="fas fa-bookmark mr-1"></i>Bookmarks</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/events"><i className="fas fa-calendar-day mr-1"></i>Events</Link>
                                </li>
                            </ul>

                            {rightContent()}

                        </div>
                    </div>
                </nav>
                <Sidebar isOpen={this.state.isOpen} currentUser={this.props.currentUser} logo={logo} logout={this.logout} />
            </div>
        )
    }

}
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    }
}



export default connect(mapStateToProps, { logout })(Navbar);