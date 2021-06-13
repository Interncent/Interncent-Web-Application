import React, { Component } from 'react'
import { apiCall } from '../services/api'
import Internship from '../containers/Homepage/Intership'
import Navbar from '../containers/Global/Navbar'
import PageFooter from '../containers/Global/PageFooter'
import Loading from '../images/Loading'
import NoBookmarks from '../images/NoBookmarks'

class Bookmarks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookmarks: [],
            start: true,
            searchedBookmarks: []
        }
        this.getQueryandFilter = async (query) => {
            if (query === "") {
                this.setState({ searchedBookmarks: [] });
            }
            const temp = this.state.bookmarks.filter(b => b.title.toUpperCase().includes(query.toUpperCase()));
            await this.setState({ searchedBookmarks: temp });
        }
       
    }
    componentDidMount() {
        document.documentElement.scrollTop = 0;
        apiCall('get', '/internship/bookmarks/' + this.props.currentUser.user._id, '')
            .then(async bookmarks => {
                this.setState({ bookmarks, start: false });

            })
            .catch(err => {
                console.log(err);
            })
    }
    render() {
        const content = this.state.searchedBookmarks.length === 0 ? this.state.bookmarks : this.state.searchedBookmarks;
        return (
            <div>
                <Navbar history={this.props.history} onPage="bookmarks" getQuery={this.getQueryandFilter}></Navbar>
                {this.state.start &&
                    <div className="loading-anime">
                        <Loading className="loading-wheel" />
                    </div>
                }
                {this.state.bookmarks.length === 0 &&
                    <NoBookmarks />
                }
                {
                    (!this.state.start && this.state.bookmarks.length !== 0) &&
                    <div id="bookmarks">
                        <div className="row">
                            {
                                content.map((internship) => {
                                    return (
                                        <Internship
                                            userId={this.props.currentUser.user._id}
                                            key={internship._id}
                                            {...internship}
                                            bookmarked={true}
                                        ></Internship>
                                    );
                                })}
                        </div>
                    </div>
                }
                <PageFooter />
            </div >

        )
    }
}



export default Bookmarks