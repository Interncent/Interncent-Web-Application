import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import { MContextEvents } from "../../services/EventsProvider";

class FilterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: [
                { text: "Competetion" },
                { text: "Workshop" },
                { text: "Culture & Entertainment" },
                { text: "Seminar" },
                { text: "Webinar" },
                { text: "Social Work" },
            ],
            error: ''
        };
        this.multiselectRef = React.createRef();
    }
    render() {
        return (
            <MContextEvents.Consumer>
                {(context) => (
                    <div className="filterForm">
                        <label className="labelFilter">By Category</label>
                        <Multiselect
                            onSelect={(e) => context.changeCategory(e)}
                            onRemove={(e) => context.changeCategory(e)}
                            options={this.state.category} // Options to display in the dropdown
                            selectedValues={context.state.category} // Preselected value to persist in dropdown
                            displayValue="text" // Property name to display in the dropdown options
                            ref={this.multiselectRef}
                        />
                        <div className="button-holder">
                            <button type="button" className="btn btn-default" onClick={() => {
                                context.reset()
                                this.props.onHide()
                            }}>
                                Reset
                            </button>
                            <button type="button" className="btn btn-default" onClick={async (e) => {
                                if (context.state.category.length === 0) {
                                    return await this.setState({ error: 'Select atleast one type.' })
                                } else {
                                    await this.setState({ error: '' })
                                    context.filter()
                                    this.props.onHide();
                                }
                            }}>
                                Apply Filters
                            </button>
                        </div>
                        <p style={{ color: 'red' }}>{this.state.error}</p>
                    </div>
                )}
            </MContextEvents.Consumer>
        );
    }
}

export default FilterForm;
