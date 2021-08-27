import React, { Component } from "react";
import { apiCall } from "./api";
export const MContext = React.createContext(); //exporting context object

export class MyProvider extends Component {
    state = {
        query: "",
        list: [],
        // start: true,
        // external: true,
        thereismore: false,
        // value: {
        //     min: 0,
        //     max: 12,
        // },
    };
    componentDidMount() {
        this.showAll();
    }

    dofilter() {
        var skillArray = [];
        this.state.skills.forEach((skill) => {
            skillArray.push(skill["text"]);
        });
        let type = [];
        if (this.state.home) type.push("Work from Home");
        if (this.state.external) type.push("External");
        let obj = {
            type: type,
            min: this.state.value.min,
            max: this.state.value.max,
            skills: skillArray,
            query: this.state.query,
        };
        apiCall("post", "/events/filter", obj)
            .then((internships) => {
                return this.setState({ ...this.state, list: internships });
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
            <MContext.Provider
                value={{
                    // changeskills: (e) => {
                    //     this.setState({ ...this.state, skills: e });
                    // },
                    // valchange: (v) => {
                    //     this.setState({ ...this.state, value: v.value });
                    // },
                    state: this.state,
                    // toggleHome: (e) => {
                    //     this.setState({ ...this.state, home: !this.state.home });
                    // },
                    // toggleExternal: (e) => {
                    //     this.setState({ ...this.state, external: !this.state.external });
                    // },
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
                            home: true,
                            external: true,
                            value: {
                                min: 0,
                                max: 12,
                            },
                            skills: [],
                        });
                        this.dofilter()
                    },
                    filter: () => {
                        this.dofilter()
                    },
                }}
            >
                {this.props.children}
            </MContext.Provider>
        );
    }
}
