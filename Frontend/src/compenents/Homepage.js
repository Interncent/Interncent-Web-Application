import React from 'react';
// import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel'
import InternshipList from '../containers/Homepage/IntershipList';
import Navbar from '../containers/Global/Navbar'
import PageFooter from '../containers/Global/PageFooter'
import { InternshipCreate } from '../containers/Global/Utilities'
import { MyProvider } from '../services/Provider'
import { FilterInternships } from '../containers/Global/Utilities'



const Homepage = (props) => {
    return (
        <div className='homePage'>
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
                <Navbar history={props.history} onPage="home" ></Navbar>
                <FilterInternships />
                <InternshipList bookmarks={props.currentUser.user.bookmarks} />
            </MyProvider>
            { (["Faculty", "Alumni", "Council"].includes(props.currentUser.user.role)) && <InternshipCreate  {...props} />}
            <PageFooter />

        </div>
    );
}

export default Homepage;