import React, { Component } from "react";
import { apiCall } from "../services/api";
export const MContext = React.createContext();

export class MyProvider extends Component {
  INTERSHIPS_LIMIT=12
  state = {
    query: "",
    list: [],
    start: true,
    home: true,
    external: true,
    thereismore: false,
    value: {
      min: 0,
      max: 12,
    },
    skills: [],
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
    apiCall("post", "/internship/search/filter", obj)
      .then((internships) => {
        return this.setState({ ...this.state, list: internships });
      })
      .catch((e) => console.log(e));
  }
  showAll() {
    let url = "/internship/search/all";
    apiCall("get", url, {params:{limit:this.INTERSHIPS_LIMIT}})
      .then((internships) => {
        return this.setState({
          ...this.state,
          list: internships,
          thereismore: (internships.length === this.INTERSHIPS_LIMIT),
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
            // console.log("visible" + this.state.list[this.state.list.length - 1]._id)
            let url = "/internship/search/nextall/" + this.state.list[this.state.list.length - 1]._id;
            apiCall("get", url, {params:{limit:this.INTERSHIPS_LIMIT}})
              .then((internships) => {
                let li = this.state.list

                return this.setState({
                  ...this.state,
                  list: li.concat(internships),
                  thereismore: (internships.length === this.INTERSHIPS_LIMIT),
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
