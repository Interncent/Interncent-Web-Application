import React, { Component } from "react";
import Event from "./Event";
import { MContextEvents } from "../../services/EventsProvider";
import Loading from "../../images/Loading";
import NoResults from "../../images/NoResults";


// import { InView } from "react-intersection-observer";

class EventsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            start: true,
            query: "",
        };

    }

    componentDidMount() {
        document.documentElement.scrollTop = '0';
    }

    render() {
        return (
            <MContextEvents.Consumer>
                {(context) => {
                    if (context.state.list.length !== 0) {
                        return (
                            <div id="eventsList">
                                <div className="ui link cards">
                                    {context.state.list.map((event) => {
                                        return (
                                            <Event
                                                key={event._id}
                                                {...event}
                                            ></Event>
                                        );
                                    })}
                                </div>
                                {/* {context.state.thereismore && <InView onChange={(iv, e) => { if (iv) context.getnewinternships() }}>
                                        {({ inView, ref, entry }) => (
                                            <div ref={ref}><Loading className="loading-wheel" /></div>
                                        )}
                                    </InView>
                                    } */}
                            </div>
                        );
                    } else if (context.state.start) {
                        return (
                            <div className="loading-anime">
                                <Loading className="loading-wheel" />
                            </div>
                        );

                    }

                    else {
                        return <NoResults></NoResults>;
                    }
                }}
            </MContextEvents.Consumer>
        );
    }
}
Event.contextType = MContextEvents;
export default EventsList;
