import React, { Component } from "react";
import { apiCall } from "./api";
export const MContextEvents = React.createContext(); //exporting context object

export class MyProvider extends Component {
    state = {
        query: "",
        list: [],
        thereismore: false,
        category: [
            { text: "Competetion" },
            { text: "Workshop" },
            { text: "Culture & Entertainment" },
            { text: "Seminar" },
            { text: "Webinar" },
            { text: "Social Work" },
        ],
        start: true
    };
    componentDidMount() {
        this.showAll();
    }

    dofilter() {
        var categoryArray = [];
        this.state.category.forEach((category) => {
            categoryArray.push(category["text"]);
        });
        let obj = {
            category: categoryArray,
            query: this.state.query,
        };
        apiCall("post", "/events/filter", obj)
            .then((events) => {
                return this.setState({ ...this.state, list: events });
            })
            .catch((e) => console.log(e));
    }

    showAll() {
        let url = "/events/getall";
        apiCall("get", url, "")
            .then((events) => {
                return this.setState({
                    ...this.state,
                    list: events,
                    thereismore: (events.length === 16),
                    start: false,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    render() {
        return (
            <MContextEvents.Provider
                value={{
                    changeCategory: (e) => {
                        this.setState({ ...this.state, category: e });
                    },
                    state: this.state,
                    setMessage: (value) =>
                        this.setState({
                            ...this.state,
                            query: value,
                        }),
                    // getnewevents: () => {
                    //     console.log("visible" + this.state.list[this.state.list.length - 1]._id)
                    //     let url = "/internship/search/nextall/" + this.state.list[this.state.list.length - 1]._id;
                    //     apiCall("get", url, "")
                    //         .then((internships) => {
                    //             let li = this.state.list

                    //             return this.setState({
                    //                 ...this.state,
                    //                 list: li.concat(internships),
                    //                 thereismore: (internships.length === 16),
                    //                 start: false,
                    //             });
                    //         })
                    //         .catch((err) => {
                    //             console.log(err);
                    //             // return this.setState({ ...this.state });
                    //         });
                    // },
                    reset: async () => {
                        await this.setState({
                            category: [
                                { text: "Competetion" },
                                { text: "Workshop" },
                                { text: "Culture & Entertainment" },
                                { text: "Seminar" },
                                { text: "Webinar" },
                                { text: "Social Work" },
                            ]
                        });
                        this.dofilter()
                    },
                    filter: () => {
                        this.dofilter()
                    },
                }}
            >
                {this.props.children}
            </MContextEvents.Provider>
        );
    }
}
