import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Homepage from '../compenents/Homepage'
import Landing from '../compenents/Landing';
import { connect } from 'react-redux';
import { updateRefresh, logout, setAuthorizationHeader, authUser, setCurrentUser } from '../store/actions/auth'
import IntershipDetail from './InternshipDetails/InternshipDetails'
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
import { internshipApply } from '../store/actions/user'
import Messaging from '../containers/chat/Messaging'
import ContactList from '../containers/chat/ConversationList'

class Main extends React.Component {
    async componentWillMount() {
        if ((localStorage.jwtToken)) {
            console.log('Token is there')
            var email = '';
            try {
                email = await jwtDecode(localStorage.jwtToken)['email'].split('@')[0];
                console.log(email);
                await setAuthorizationHeader(localStorage.jwtToken);
                this.props.updateRefresh(email);

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
                    <Route exact path="/community" render={props => <Community {...props} currentUser={currentUser} />} />
                    <Route exact path="/post/:id" render={props => <Post key={props.match.params.id} {...props} currentUser={currentUser} />} />
                    <Route exact path="/hashtag/:id" render={props => <Hashtag key={props.match.params.id} {...props} currentUser={currentUser} />} />
                    <Route exact path="/verify-email/:token" render={props => <EmailVerificaton {...props} />} />
                    <Route exact path="/profile/:id" render={props => <Profile key={props.match.params.id} {...props} currentUser={currentUser} />} />
                    <Route exact path="/bookmarks" render={props => <Bookmarks {...props} currentUser={currentUser} />} />
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

export default withRouter(connect(mapStateToProps, { authUser, setCurrentUser, updateRefresh, logout, internshipApply })(Main));
