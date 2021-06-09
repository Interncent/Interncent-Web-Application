import React, { Component } from 'react';
import { apiCall } from '../../services/api'

class Messaging extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        if (this.props.currentUser.user._id === this.props.match.params.id) {
            return this.props.history.push('/messaging')
        }
        apiCall('put', '/message/new/' + this.props.match.params.id, { uid: this.props.currentUser.user._id })
            .then((data) => {
                return this.props.history.push('/messaging/' + data.convId)
            }).catch((err) => {
                console.log(err)
            });
    }
    render() {
        return (
            <center><h1>Loading Messages....</h1></center>
        )
    }
}
export default Messaging