import React, { Component } from "react";
import { apiCall } from "../services/api";
export const MContext = React.createContext(); //exporting context object
export class MyProvider extends Component {
  state = {
    query: "",
    list: [],
    start: true,
    home: true,
    external: true,
    value: {
      min: 0,
      max: 12,
    },
    skills: [],
  };
  componentDidMount() {
    this.showAll();
  }
  dofilter(){
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
          reset:async () => {
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
