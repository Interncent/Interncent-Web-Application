import React, { Component } from 'react'
import { loginUser } from '../../store/actions/auth'
import { connect } from 'react-redux';

// import { Link } from 'react-router-dom'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        return this.setState({ [e.target.name]: e.target.value })
    }
    async handleSubmit(e) {
        e.preventDefault();
        this.props.loginUser(this.state)
            .then((result) => {
                console.log('Logged In')
                return this.props.history.push('/home');
            }).catch((err) => {
                console.log(err.message);
                return err;
            });
    }
    render() {
        const { password, email } = this.state;
        return (
            <div className="loginForm">
                <form className="ui form" onSubmit={this.handleSubmit}>
                    <div className="heading">Login</div>
                    <div className="field">
                        <label>Somaiya Email</label>
                        <div className="ui left icon input">
                            <input required type="email" name="email" autoComplete="email" placeholder="abcd@somaiya.edu" value={email} onChange={this.handleChange} pattern="^[a-zA-Z0-9._%+-]+@somaiya\.edu$"/>
                            <i className="envelope icon"></i>
                        </div>
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <div className="ui left icon input">
                            <input required type="password" name="password" autoComplete="current-password" placeholder="Password" onChange={this.handleChange} value={password} />
                            <i className="lock icon"></i>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button className="big ui button" >
                            Login
                        </button>
                    </div>

                </form>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    }
}

export default connect(mapStateToProps, { loginUser })(Login);
