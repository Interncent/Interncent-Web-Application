import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Homepage from '../compenents/Homepage'
import Landing from '../compenents/Landing';
import { connect } from 'react-redux';
import { updateRefresh, logout, setAuthorizationHeader, authUser, setCurrentUser } from '../store/actions/auth'
import IntershipDetail from './InternshipDetails/InternshipDetails'
import SingleApplication from './InternshipDetails/SingleApplication'
import Applications from './InternshipDetails/Applications'
import Community from '../compenents/Community'
import NotFound from '../images/NotFound'
import EmailVerificaton from '../containers/Utils/EmailVerification';
import Profile from '../compenents/Profile';
import Post from './Community/Post'
import Hashtag from './Community/Hashtag'
import Bookmarks from '../compenents/Bookmarks'
import Chat from '../containers/chat/Chat'
import '../index2.css'
import jwtDecode from 'jwt-decode'
import { internshipApply, updateResumeDetails } from '../store/actions/user'
import Messaging from '../containers/chat/Messaging'
import ContactList from '../containers/chat/ConversationList'
import ResumeBuilder from './Profile/ResumeBuilder';

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.componentCleanup = this.componentCleanup.bind(this);
    }
    async componentWillMount() {
        window.addEventListener('beforeunload', this.componentCleanup);
        if ((localStorage.jwtToken)) {
            console.log('Token is there')
            var id = '';
            try {
                id = await jwtDecode(localStorage.jwtToken)['_id']
                await setAuthorizationHeader(localStorage.jwtToken);
                this.props.updateRefresh(id)
            } catch (err) {
                console.log(err);
                await this.props.logout();
                this.props.history.push('/');
            }
        } else {
            this.props.history.push('/');
        }
        if (!localStorage.isAuthenticated) {
            setAuthorizationHeader(false);
            this.props.history.push('/');
        }
        console.log("main mounted");
    }

    async componentCleanup() {
        try {
            var id = await jwtDecode(localStorage.jwtToken)['_id']
            console.log(id, this.props.currentUser.user._id)

            if (this.props.currentUser.user._id !== id) {
                setAuthorizationHeader(false);
                localStorage.clear()
                this.props.history.push('/');
            }
        } catch (error) {
            console.log(error);
            await this.props.logout();
            this.props.history.push('/');
        }
    }

    async componentWillUnmount() {
        this.componentCleanup();
        window.removeEventListener('beforeunload', this.componentCleanup); // remove the event handler for normal unmounting
    }
    render() {
        const currentUser = this.props.currentUser;
        if (!currentUser.user._id && localStorage.getItem('isAuthenticated') !== 'false' && JSON.parse(localStorage.getItem('isAuthenticated')) !== null) {
            return <div></div>
        }

        return (
            <div>
                <Switch>
                    <Route exact path="/" render={props => <Landing {...props} isAuthenticated={currentUser.isAuthenticated} />} />
                    <Route exact path="/home" render={props => <Homepage {...props} currentUser={currentUser} />} />
                    <Route exact path="/messaging" render={props => <ContactList {...props} currentUser={currentUser} />} />
                    <Route exact path="/messaging/:id" render={props => <Chat {...props} currentUser={currentUser} key={props.match.params.id} />} />
                    <Route exact path="/createchat/:id" render={props => <Messaging {...props} currentUser={currentUser} key={props.match.params.id} />} />
                    <Route exact path="/internship/applications/:id" render={props => <Applications key={props.match.params.id} {...props} currentUser={currentUser} />} />
                    <Route exact path="/internship/:id" render={props => <IntershipDetail internshipApply={this.props.internshipApply} key={props.match.params.id} {...props} currentUser={currentUser} />} />
                    <Route exact path="/viewapplication/:id" render={props => <SingleApplication key={props.match.params.id} {...props} currentUser={currentUser} />} />

                    <Route exact path="/community" render={props => <Community {...props} currentUser={currentUser} />} />
                    <Route exact path="/post/:id" render={props => <Post key={props.match.params.id} {...props} currentUser={currentUser} />} />
                    <Route exact path="/hashtag/:id" render={props => <Hashtag key={props.match.params.id} {...props} currentUser={currentUser} />} />
                    <Route exact path="/verify-email/:token" render={props => <EmailVerificaton {...props} />} />
                    <Route exact path="/profile/:id" render={props => <Profile key={props.match.params.id} {...props} currentUser={currentUser} />} />
                    <Route exact path="/bookmarks" render={props => <Bookmarks {...props} currentUser={currentUser} />} />
                    <Route exact path="/resume" render={props => <ResumeBuilder {...props} user={currentUser.user} updateResumeDetails={this.props.updateResumeDetails} />} />

                    <Route path="*" render={props => <NotFound {...props} />} />
                </Switch>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    }
}

export default withRouter(connect(mapStateToProps, { authUser, setCurrentUser, updateRefresh, logout, internshipApply, updateResumeDetails })(Main));
