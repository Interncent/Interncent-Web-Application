import React, { Component } from 'react'

class Quiz extends Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: [
                {
                    ques: "Why should you be hired for this role?",
                    type: "Subjective",
                },
                {
                    ques: `Are you available for ${this.props.duration ? this.props.duration : "_"} month(s), starting immediately? If not, what is the time period you are available for and the earliest date you can start this internship on?`,
                    type: "Subjective",
                }
            ],

            currentQues: "",
            currentOptions: "",
            currentAnswer: ""
        }

        this.addQuestion = (type) => {
            var questions = this.state.questions
            if (questions[questions.length - 1].ques === "") {
                return false
            }
            if (type === "Subjective") {
                questions.push({ ques: "", type: "Subjective" })
            } else {
                questions.push({ ques: "", type: "MCQ", correctAns: null, points: null, options: [" ", " ", " ", " "] })
            }
            this.setState({ questions })
        }
    }
    render() {
        return (
            <div id="quiz">
                <h2>Questions</h2>
                <div className="allQuestions">
                    {this.state.questions.map((question, i) =>
                        question.type === "Subjective" ?
                            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="singleQuestion" >
                                    <span style={{ display: 'inline' }}>{i + 1}.</span><div contentEditable className="ques"> {question.ques}</div>
                                </div>
                                <span><i className="fa fa-trash ml-2" style={{ cursor: "pointer" }}></i></span>
                            </div>
                            :
                            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="singleQuestion" >
                                    <span style={{ display: 'inline' }}>{i + 1}.</span><div contentEditable className="ques"> {question.ques}</div>
                                    <div className="mcqOptions">
                                        <div className="singleOption"></div>
                                        <div className="singleOption"></div>
                                        <div className="singleOption"></div>
                                        <div className="singleOption"></div>
                                    </div>
                                </div>
                                <span><i className="fa fa-trash ml-2" style={{ cursor: "pointer" }}></i></span>
                            </div>


                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <button className="ui button" onClick={() => this.addQuestion("Subjective")}>+Subjective</button>
                    <button className="ui button" onClick={() => this.addQuestion("MCQ")}>+MCQ</button>
                    <br></br>
                    <button className="ui button mt-5" onClick={() => this.props.changeDisplay("Form")}>Back to Form</button>


                </div>

            </div>
        )
    }
}

export default Quiz