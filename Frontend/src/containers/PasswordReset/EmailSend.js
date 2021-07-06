import React, { Component } from "react"
import { apiCallAuth } from "../../services/api"

class PasswordResetEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            disable: false,
            message: ""
        }
        this.handleSubmit = (e) => {
            e.preventDefault()
            apiCallAuth('put', '/api/auth/passwordReset/verification', { email: this.state.email })
                .then((result) => {
                    this.setState({ disable: true, message: "" })
                }).catch((err) => {
                    this.setState({ message: err.response.data.error.message })
                });
        }

        this.handleChange = (e) => {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    render() {
        return (
            <div id="passwordResetEmail">
                <div className="card login-form">
                    <div className="card-body">
                        <h3 className="card-title text-center">Reset password</h3>

                        <div className="card-text">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label for="exampleInputEmail1">Enter your email address and we will send you a link to reset your password.</label>
                                    <input readOnly={this.state.disable} type="email" name="email" className="form-control" placeholder="Enter your email address" onChange={this.handleChange} />
                                </div>

                                <button disabled={this.state.disable} type="submit" className="btn btn-primary btn-block">Send password reset email</button>
                            </form>
                        </div>
                        {(this.state.message !== "") &&
                            <div className="alert alert-danger" role="alert" style={{ marginTop: "7px" }}>
                                {this.state.message}
                            </div>
                        }
                        {
                            this.state.disable &&
                            <div className="alert alert-success" role="alert" style={{ marginTop: "7px" }}>
                                An Email has been sent to this Address
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default PasswordResetEmail