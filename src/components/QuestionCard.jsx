import React from "react";

const QuestionCard = ({ question, answers, onAnswer }) => {
  return (
    <div className="question-card">
      <h3 className="question-text">{question}</h3>
      <div className="answers">
        {answers.map((ansObj) => (
          <button
            key={ansObj.letter}
            className="answer-button"
            onClick={() => onAnswer(ansObj.letter)}
          >
            {ansObj.letter}. {ansObj.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
