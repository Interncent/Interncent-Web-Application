import React, { Component } from 'react'
import { apiCall } from '../services/api'
import Navbar from '../containers/Global/Navbar'
import PageFooter from '../containers/Global/PageFooter'
import EventsList from '../containers/Events/EventsList'
import { MyProvider } from '../services/EventsProvider'
import { Carousel } from 'react-bootstrap'


class Events extends Component {
    constructor(props) {
        super(props)
        this.state = {
            events: {},
            start: true
        }
    }

    componentDidMount() {
        apiCall('get', '/events', '')
            .then((events) => {
                this.setState({ events })
            }).catch((err) => {
                console.log(err)
            });
    }
    render() {
        return (
            <div id="eventsCouncils">
                <div className="carousel-home">
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block"
                                src="https://d8it4huxumps7.cloudfront.net/uploads/images/60d09656e1b9b_1.png?d=1920x418"
                                alt="First slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block"
                                src="https://d8it4huxumps7.cloudfront.net/uploads/images/60d09656e1b9b_1.png?d=1920x418"
                                alt="Second slide"
                            />

                            {/* <Carousel.Caption>
                            <h3>Second slide</h3>
                            <p>second sub title</p>
                        </Carousel.Caption> */}
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block"
                                src="https://d8it4huxumps7.cloudfront.net/uploads/images/60d09656e1b9b_1.png?d=1920x418"
                                alt="Third slide"
                            />
                        </Carousel.Item>
                    </Carousel>
                </div>
                <MyProvider>
                    <Navbar history={this.props.history} onPage="events"></Navbar>
                    <EventsList></EventsList>
                    <PageFooter></PageFooter>
                </MyProvider>
            </div>
        )
    }
}

export default Events