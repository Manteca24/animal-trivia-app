import React from "react";

const QuestionCard = ({
  question,
  answers,
  onAnswer,
  selectedAnswer,
  correctAnswer, // received correctAnswer from QuizPage
}) => {
  return (
    <div className="question-card">
      <h3 className="question-text">{question}</h3>
      <div className="answers">
        {answers.map((ansObj) => {
          let buttonClass = "answer-button";

          if (selectedAnswer) {
            // Compare the selected answer with the correct answer
            buttonClass +=
              selectedAnswer === ansObj.text
                ? selectedAnswer === correctAnswer
                  ? "-correct"
                  : "-incorrect"
                : "";
          }
          console.log(buttonClass);

          return (
            <button
              key={ansObj.letter}
              className={buttonClass}
              onClick={() => onAnswer(ansObj.letter)}
            >
              {ansObj.letter}. {ansObj.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
