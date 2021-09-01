import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import { apiCall } from "../../services/api";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import { MContext } from "../../services/Provider";

class FilterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skills: [
                { text: "Python" },
                { text: "Node.Js" },
                { text: "Django" },
                { text: "Javascript" },
                { text: "C++" },
                { text: "React Native" },
            ],
            category: [
                { text: "Internship" },
                { text: "Research" },
                { text: "Recruitment" },
                { text: "Volunteer" }
            ],

            error: ''
        };
        this.handleSkills = this.handleSkills.bind(this);
        this.multiselectRef = React.createRef();
    }
    async handleSkills() {
        await this.setState({ error: '' })
        const skillInput = document.querySelector(".searchBox");
        var query = skillInput.value;
        console.log(query);
        apiCall("get", "/internship/skillSuggestion/" + query, "")
            .then((data) => {
                console.log(data);
                this.setState({ skills: data });
            })
            .catch((err) => console.log(err));
    }
    render() {
        return (
            <MContext.Consumer>
                {(context) => (
                    <div className="filterForm">
                        <label className="labelFilter">By Category</label>
                        <Multiselect
                            onSelect={(e) => context.changeCategory(e)}
                            onRemove={(e) => context.changeCategory(e)}
                            options={this.state.category} // Options to display in the dropdown
                            selectedValues={context.state.category} // Preselected value to persist in dropdown
                            displayValue="text" // Property name to display in the dropdown options
                            onSearch={this.handleSkills}
                            ref={this.multiselectRef}
                        />

                        <label className="labelFilter">By Skills</label>
                        <Multiselect
                            onSelect={(e) => context.changeskills(e)}
                            onRemove={(e) => context.changeskills(e)}
                            options={this.state.skills} // Options to display in the dropdown
                            selectedValues={context.state.skills} // Preselected value to persist in dropdown
                            displayValue="text" // Property name to display in the dropdown options
                            ref={this.multiselectRef}
                        />
                        <div className="intType">
                            <label className="labelFilter">Type</label>
                            <div className="checkbox">
                                <input type="checkbox" value="Work From Home" checked={context.state.home} onChange={context.toggleHome} />
                                <label>Work From Home</label>
                            </div>
                            <div className="checkbox">
                                <input type="checkbox" value="External" checked={context.state.external} onChange={context.toggleExternal} />
                                <label>External</label>
                            </div>
                        </div>
                        <label className="labelFilter">Duration (in Months)</label>
                        <InputRange
                            draggableTrack
                            maxValue={12}
                            minValue={1}
                            onChange={value => context.valchange({ value: value })}
                            // onChangeComplete={value => console.log(value)}
                            value={context.state.value} />


                        <label className="labelFilter">Stipend (in Rs)</label>
                        <InputRange
                            maxValue={50000}
                            minValue={0}
                            onChange={value => context.stipendValChnage({ value })}
                            value={context.state.stipendValue} />
                        <div className="button-holder">
                            <button type="button" className="btn btn-default" onClick={() => {
                                context.reset()
                                this.props.onHide()
                            }}>
                                Reset
                            </button>
                            <button type="button" className="btn btn-default" onClick={async (e) => {
                                if (context.state.home === false && context.state.external === false) {
                                    return await this.setState({ error: 'Select atleast one type.' })
                                } else {
                                    await this.setState({ error: '' })
                                    context.filter("filter")
                                    this.props.onHide();
                                }
                            }}>
                                Apply Filters
                            </button>
                        </div>
                        <p style={{ color: 'red' }}>{this.state.error}</p>
                    </div>
                )}
            </MContext.Consumer>
        );
    }
}

export default FilterForm;
