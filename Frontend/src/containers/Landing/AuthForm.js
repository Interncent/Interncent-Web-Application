import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { apiCallAuth } from '../../services/api'


class AuthForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: '',
            lname: '',
            email: '',
            dept: '',
            year: '',
            rollNo: '',
            password: '',
            facultyId: '',
            role: this.props.role
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(e) {
        return this.setState({ [e.target.name]: e.target.value })
    }
    handleSubmit(e) {
        e.preventDefault();
        const { fname, lname, email, dept, year, rollNo, password, role, facultyId } = this.state;
        var data = {};
        if (this.state.role === 'Student') {
            data = {
                fname, lname, email, dept, year, rollNo, password, role
            }
        } else {
            data = {
                fname, lname, email, dept, year, facultyId, password, role
            }
        }
        console.log(data);
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
        const { fname, lname, email, dept, year, rollNo, password, facultyId } = this.state;
        const { heading, role } = this.props;
        const className = role === "Student" ? "two fields" : "field";
        return (

            <form className="ui form authForm" onSubmit={this.handleSubmit}>
                <div className="heading">
                    {role === "Student" && <i className=" mr-2 fas fa-user-graduate"></i>}
                    {role === "Faculty" && <i className="mr-2 fas fa-user-tie"></i>}
                    {heading}
                </div>

                <div className="field">
                    <label>Name</label>
                    <div className="two fields">
                        <div className="field">
                            <input required type="text" name="fname" placeholder="First Name" value={fname} onChange={this.handleChange} />
                        </div>
                        <div className="field">
                            <input required type="text" name="lname" placeholder="Last Name" value={lname} onChange={this.handleChange} />
                        </div>
                    </div>
                </div>
                <div className="field">
                    <div className="two fields">
                        <div className="twelve wide field">
                            <label>Somaiya Email</label>
                            <div className="ui left icon input">
                                <input required type="email" name="email" autoComplete="email" placeholder="Somaiya Email" value={email} onChange={this.handleChange} pattern="^[a-zA-Z0-9._%+-]+@somaiya\.edu$" />
                                <i className="envelope icon"></i>
                            </div>
                        </div>
                        {role === "Faculty" &&
                            <div className="four wide field">
                                <label>Faculty ID</label>
                                <div className="ui left icon input">
                                    <input required type="text" name="facultyId" placeholder="Faculty ID" value={facultyId} onChange={this.handleChange} pattern="[0-9]{7}" />
                                    <i className="ui id card icon"></i>
                                </div>
                            </div>
                        }
                        {role === "Student" &&
                            <div className="four wide field">
                                <label>Roll No.</label>
                                <div className="ui left icon input">
                                    <input required type="text" name="rollNo" autoComplete="off" placeholder="Roll No." value={rollNo} onChange={this.handleChange} pattern="[0-9]{7}" />
                                    <i className="ui id card icon"></i>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className={className}>
                    <div className="field">
                        <label>Department</label>
                        <select className="ui fluid" name="dept" onChange={this.handleChange} value={dept} required>
                            <option value="">Department</option>
                            <option value="cs">Computer Science</option>
                            <option value="it">Information Technology</option>
                            <option value="mech">Mechanical</option>
                            <option value="extc">
                                Electronics and Telecommunication
                      </option>
                            <option value="etrx">Electronics</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {role === "Student" &&
                        <div className="field">
                            <label>Year</label>
                            <select className="ui fluid" name="year" onChange={this.handleChange} value={year}>
                                <option value="">Year</option>
                                <option value="1">FY</option>
                                <option value="2">SY</option>
                                <option value="3">TY</option>
                                <option value="4">LY</option>
                            </select>
                        </div>
                    }
                </div>
                <div className="field">
                    <label>Password</label>
                    <div className="ui left icon input">
                        <input type="password" name="password" autoComplete="current-password" placeholder="Password" onChange={this.handleChange} value={password} />
                        <i className="lock icon"></i>
                    </div>
                </div>
                <div>
                    <Link className="login" onClick={this.props.already}>Already have an account? Login</Link>
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




export default AuthForm;