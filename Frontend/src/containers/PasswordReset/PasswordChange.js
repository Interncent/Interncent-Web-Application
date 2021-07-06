import React, { Component } from "react"
import { apiCall, apiCallAuth } from "../../services/api"

class PasswordChange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password: "",
            message: "",
            confirmPassword: ""
        }

        this.handleSubmit = (e) => {
            e.preventDefault()
            if (this.state.password === this.state.confirmPassword) {
                apiCallAuth('put', '/api/auth/passwordReset/reset/' + this.props.match.params.token, { password: this.state.password })
                    .then((result) => {
                        this.setState({ message: `Password Reset Successfull. Try logging in with the new password.` })
                        this.props.history.push('/')
                    }).catch((err) => {
                        this.setState({ message: err.response.data.error.messag })
                        console.log(err)
                    });
            } else {
                this.setState({ message: 'Password does not match.' })
            }
        }

        this.handleChange = (e) => {
            this.setState({ [e.target.name]: e.target.value })
        }
    }
    componentDidMount() {
        apiCallAuth('get', '/api/auth/passwordReset/checkToken/' + this.props.match.params.token, '')
            .then((result) => {
                console.log(result)
            }).catch((err) => {
                console.log(err)
                this.props.history.push('/')
            });
    }
    render() {
        return (
            <div id="passwordResetEmail">
                <div className="card login-form">
                    <div className="card-body">
                        <h3 className="card-title text-center">Password Reset</h3>

                        <div className="card-text">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <input type="password" name="password" className="form-control" placeholder="Enter New Password" onChange={this.handleChange} />
                                </div>

                                <div className="form-group">
                                    <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm New Password" onChange={this.handleChange} />
                                </div>

                                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                            </form>
                        </div>
                        {(this.state.message !== "") &&
                            <div className="alert alert-danger" role="alert" style={{marginTop:"7px"}}>
                                {this.state.message}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default PasswordChange