import React from 'react'
import { apiCall } from '../services/api'
import amazon from '../images/amazon.jpg'
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
                            src="https://cdn.vox-cdn.com/thumbor/48r488WD4DA-161DPQ3z1sqlJdo=/0x0:3000x2000/1200x800/filters:focal(1260x760:1740x1240)/cdn.vox-cdn.com/uploads/chorus_image/image/59964229/acastro_180329_1777_amazon_0001.0.jpg"
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block"
                            src="https://cdn.vox-cdn.com/thumbor/48r488WD4DA-161DPQ3z1sqlJdo=/0x0:3000x2000/1200x800/filters:focal(1260x760:1740x1240)/cdn.vox-cdn.com/uploads/chorus_image/image/59964229/acastro_180329_1777_amazon_0001.0.jpg"
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
                            src="https://cdn.vox-cdn.com/thumbor/48r488WD4DA-161DPQ3z1sqlJdo=/0x0:3000x2000/1200x800/filters:focal(1260x760:1740x1240)/cdn.vox-cdn.com/uploads/chorus_image/image/59964229/acastro_180329_1777_amazon_0001.0.jpg"
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
            {"Council"=== props.currentUser.user.role && <EventCreate {...props} />}
            <PageFooter></PageFooter>

        </div>
    )
}

export default Events