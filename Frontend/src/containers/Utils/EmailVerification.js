import React, { Component } from 'react'
import { connect } from 'react-redux';
import { authUser } from '../../store/actions/auth'


class Emailverification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVerified: false,
            emailToken: this.props.match.params.token,
            status: 'Your Email is Being Verified ...'
        }
    }
    componentWillMount() {
        console.log(this.state.emailToken)
        this.props.authUser(this.state.emailToken)
            .then(async () => {
                await this.setState({
                    status: 'Email Verification Completed. Redirecting to KJSCE Connect.'
                });
                this.props.history.push('/home')

            })
            .catch(async err => {
                await this.setState({ status: 'Email Verification Failed. Relaod the page or try to signup again.' || err.message });
            })
    }
    render() {
        const content = this.state.status;
        return (
            <div className="emailVerification container" >
                <h1>{content}</h1>
            </div >
        )

    }
}
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps, { authUser })(Emailverification);

