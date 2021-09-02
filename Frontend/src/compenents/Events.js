import React from 'react'
import { apiCall } from '../services/api'
import Navbar from '../containers/Global/Navbar'
import PageFooter from '../containers/Global/PageFooter'
import EventsList from '../containers/Events/EventsList'
import { MyProvider } from '../services/EventsProvider'
import { Carousel } from 'react-bootstrap'
import { FilterEvents } from '../containers/Global/Utilities'
import { EventCreate } from '../containers/Global/Utilities'




function Events(props) {
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
                <Navbar history={props.history} onPage="events"></Navbar>
                <FilterEvents></FilterEvents>
                <EventsList history={props.history} ></EventsList>
            </MyProvider>
            {"Faculty"=== props.currentUser.user.role && <EventCreate {...props} />}
            <PageFooter></PageFooter>

        </div>
    )
}

export default Events