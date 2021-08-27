import React, { Component } from "react";
import { apiCall } from "../services/api";
export const MContext = React.createContext(); //exporting context object

export class MyProvider extends Component {
  state = {
    query: "",
    // observer:null,
    list: [],
    start: true,
    home: true,
    external: true,
    thereismore: false,
    // onseennew:React.createRef(),
    value: {
      min: 0,
      max: 12,
    },
    skills: [],
  };
  componentDidMount() {

    // this.state.observer = new IntersectionObserver(this.getnewinternships, { root: null, rootMargin: "0px", threshold:1.0})
    // if (this.state.onseennew.current) this.state.observer.observe(this.state.onseennew.current)
    this.showAll();
  }
  // componentWillUnmount() {
  //   if(this.state.onseennew.current) this.state.observer.unobserve(this.state.onseennew.current)
  // }
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
    apiCall("post", "/internship/search/filter", obj)
      .then((internships) => {
        return this.setState({ ...this.state, list: internships });
      })
      .catch((e) => console.log(e));
  }
  showAll() {
    let url = "/internship/search/all";
    apiCall("get", url, "")
      .then((internships) => {
        return this.setState({
          ...this.state,
          list: internships,
          thereismore: (internships.length === 16),
          start: false,
        });
      })
      .catch((err) => {
        console.log(err);
        // return this.setState({ ...this.state });
      });
  }
  render() {
    return (
      <MContext.Provider
        value={{
          changeskills: (e) => {
            this.setState({ ...this.state, skills: e });
          },
          valchange: (v) => {
            this.setState({ ...this.state, value: v.value });
          },
          state: this.state,
          toggleHome: (e) => {
            this.setState({ ...this.state, home: !this.state.home });
          },
          toggleExternal: (e) => {
            this.setState({ ...this.state, external: !this.state.external });
          },
          setMessage: (value) =>
            this.setState({
              ...this.state,
              query: value,
            }),
          getnewinternships: () => {
            console.log("visible" + this.state.list[this.state.list.length - 1]._id)
            let url = "/internship/search/nextall/" + this.state.list[this.state.list.length - 1]._id;
            apiCall("get", url, "")
              .then((internships) => {
                let li = this.state.list

                return this.setState({
                  ...this.state,
                  list: li.concat(internships),
                  thereismore: (internships.length === 16),
                  start: false,
                });
              })
              .catch((err) => {
                console.log(err);
                // return this.setState({ ...this.state });
              });
          },
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
