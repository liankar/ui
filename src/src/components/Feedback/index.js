import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import Snooze from '../Snooze'
import PostFeedback from '../PostFeedback'
import $ from 'jquery'
import _ from 'the-lodash'
import cx from 'classnames'
import './styles.scss'


class Feedback extends BaseComponent {
    constructor(props) {
        super(props)

        this.registerService({ kind: 'misc' })

        this.state = {
            userAnswers: { },
            missingAnswers: {},
            isSubmitAllowed: true,
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleMultiselect = this.handleMultiselect.bind(this)
        this.setClicked = this.setClicked.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    checkAnswers() {
        let missingAnswers = {};

        let isQuestionsAnswered = true
        this.props.request.questions.forEach(question => {
            if (!question.optional) {
                const answerInfo = this.state.userAnswers[question.id];
                if (!answerInfo || !answerInfo.hasValue) {
                    missingAnswers[question.id] = true;
                    isQuestionsAnswered = false;
                }
            }
            return
        })
        this.setState({
            isSubmitAllowed: isQuestionsAnswered,
            missingAnswers: missingAnswers
        })
        return isQuestionsAnswered
    }

    handleSubmit() {
        const checkResult = this.checkAnswers();
        if (checkResult) {

            const answers = _.values(this.state.userAnswers)
                .filter(x => x.hasValue)
                .map(x => ({
                    id: x.id,
                    value: x.value
                }));

            const data = {
                id: this.props.request.id,
                kind: this.props.request.kind,
                answers: answers
            }

            this.service.submitFeedback(data, () => {
                this.sharedState.set('popup_window', {
                    title: 'Post Feedback',
                    content: <PostFeedback />
                })
            })
        }
    }

    handleInputChange(e) {
        const userAnswers = this.state.userAnswers;
        let value = e.target.value;
        let hasValue = false;
        if (_.isNotNullOrUndefined(value))
        {
            if (value.length > 0)
            {
                hasValue = true;
            }
        }

        userAnswers[e.target.name] = {
            id: e.target.name,
            value: value,
            hasValue: hasValue
        }

        this.setState({
            userAnswers: userAnswers
        })
    }

    handleMultiselect(e) {
        e.target.classList.toggle('clicked')

        const userAnswers = this.state.userAnswers;
        let userAnswer = userAnswers[e.target.name];
        if (!userAnswer) {
            userAnswer = {
                id: e.target.name,
                hasValue: false,
                options: {}
            }
            userAnswers[e.target.name] = userAnswer;
        }

        if (e.target.value in userAnswer.options) {
            delete userAnswer.options[e.target.value];
        } else {
            userAnswer.options[e.target.value] = true;
        }

        userAnswer.value =
            _.keys(userAnswer.options);
        userAnswer.hasValue = (userAnswer.value.length > 0);

        this.setState({
            userAnswers: userAnswers
        })
    }

    setClicked(e) {
        $(`.user-single-select .${e.target.name}`).removeClass('clicked')
        e.target.classList.add('clicked')
    }

    renderQuestion (question) {
        switch (question.kind) {
            case 'input':
                return (
                    <div className="user-input">
                        <label className={cx("input-question",
                                            {'non-optional': !question.optional},
                                            {'missing-answer': this.state.missingAnswers[question.id]})}>
                            {question.text}
                        </label>
                        <textarea
                            type="text"
                            placeholder="Type here..."
                            name={question.id}
                            onChange={this.handleInputChange}
                        ></textarea>
                    </div>
                )
            case 'rate':
                return (
                    <div className="user-rate">
                        <label className={cx("rate-question",
                                          {'non-optional': !question.optional},
                                          {'missing-answer': this.state.missingAnswers[question.id]})}>{question.text}</label>
                        <div
                            role="group"
                            className="rate-stars"
                            onChange={this.handleInputChange}
                        >
                            {[5, 4, 3, 2, 1].map(val => (
                                <input
                                    type="radio"
                                    id={`star${val}`}
                                    key={val}
                                    name={question.id}
                                    value={val}
                            />
                            ))}
                        </div>
                    </div>
                )
            case 'single-select':
                return (
                    <div className="user-single-select">
                        <label className={cx("select-question",
                                          {'non-optional': !question.optional},
                                          {'missing-answer': this.state.missingAnswers[question.id]})}>
                            {question.text}
                        </label>
                        <div role="group" className="select-buttons">
                            {question.options.map((option, index) => {
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        name={question.id}
                                        className={question.id}
                                        onClick={this.handleInputChange}
                                        onFocus={this.setClicked}
                                        value={option}
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )
            case 'multi-select':
                return (
                    <div className="user-select">
                        <label className={cx("select-question",
                                          {'non-optional': !question.optional},
                                          {'missing-answer': this.state.missingAnswers[question.id]})}>
                            {question.text}
                        </label>
                        <div role="group" multiple className="select-buttons">
                            {question.options.map((option, index) => {
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        name={question.id}
                                        onClick={this.handleMultiselect}
                                        value={option}
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )
        }
    }

    render() {
        const { questions } = this.props.request
        const { isSubmitAllowed } = this.state

        return (
            <div className="separate-container">
                <div className="feedback-header">
                    <h3 className="heading-text">Give us your feedback</h3>
                </div>
                <div className="feedback-info">
                    {questions.map((question, index) =>
                        <div className="feedback-question" key={index}>
                            {
                                this.renderQuestion(question)
                            }
                        </div>
                    )}

                    {!isSubmitAllowed && <div className="submit-error">
                        We need your feedback on required (*) fields.
                    </div>}

                    <button
                        className="feedback-submit button success"
                        onClick={this.handleSubmit}
                        type="submit"
                    >
                        Submit Feedback
                    </button>
                </div>
                <Snooze id={this.props.request.id} kind={this.props.request.kind} />
            </div>
        )
    }
}

export default Feedback
