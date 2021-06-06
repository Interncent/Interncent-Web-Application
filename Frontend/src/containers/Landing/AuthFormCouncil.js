import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { apiCallAuth } from '../../services/api'

class CouncilSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: '',
            lname: '',
            email: '',
            password: '',
            role: 'Council'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleChange(e) {
        return this.setState({ [e.target.name]: e.target.value })
    }
    handleSubmit(e) {
        e.preventDefault();
        const data = this.state;
        console.log(data)
        apiCallAuth('post', '/api/auth/signup', data)
            .then(async (response) => {
                console.log(response)
                await this.props.onVerify();
            }).catch((err) => {
                console.log(err);
                return err;
            });
    }
    render() {
        const { fname, email, password } = this.state;
        return (
            <form className="ui form authForm" onSubmit={this.handleSubmit}>
                <div className="heading">
                    <i className="fas fa-users mr-2"></i>Council Signup
                </div>
                <div className="field">
                    <label>Council Name</label>
                    <input required type="text" name="fname" placeholder="Name of your Council" value={fname} onChange={this.handleChange} />
                </div>
                <div className="field">
                    <label>Somaiya Email</label>
                    <div className="ui left icon input">
                        <input required type="email" name="email" placeholder="Somaiya Email" value={email} onChange={this.handleChange} pattern="^[a-zA-Z0-9._%+-]+@somaiya\.edu$" />
                        <i className="envelope icon"></i>
                    </div>
                </div>
                <div className="field">
                    <label>Password</label>
                    <div className="ui left icon input">
                        <input type="password" name="password" placeholder="Password" onChange={this.handleChange} value={password} />
                        <i className="lock icon"></i>
                    </div>
                </div>
                <div className="submit">
                    <button className="big ui button">
                        Register
                    </button>
                </div>

            </form>
        )
    }
}
export default CouncilSignup;