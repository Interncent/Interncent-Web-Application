import React, { Component } from "react";
import Internship from "./Intership";
import { MContext } from "../../services/Provider";
import Loading from "../../images/Loading";
import NoResults from "../../images/NoResults";

class InternshipList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      internships: [],
      start: true,
      query: "",
    };
  }
  componentDidMount(){
    document.documentElement.scrollTop = '0';
  }
  render() {
    return (
      <div className="homeSection">
        <MContext.Consumer>
          {(context) => {
            if (context.state.list.length !== 0) {
              return (
                <div id="intershiplist">
                  <div className="row">
                    {context.state.list.map((internship) => {
                      return (
                        <Internship
                          key={internship._id}
                          {...internship}
                          bookmarked={this.props.bookmarks.includes(internship._id)}
                        ></Internship>
                      );
                    })}
                  </div>
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
        </MContext.Consumer>
      </div>
    );
  }
}
Internship.contextType = MContext;
export default InternshipList;
