import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import { useLocation, useNavigate } from "react-router-dom";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const language = queryParams.get("language");
  const category = queryParams.get("category");
  const subcategory = queryParams.get("subcategory");
  const name = queryParams.get("name");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/questions`,
          { params: { language, category, subcategory } }
        );

        const shuffledQuestions = response.data.map((question) => {
          const allAnswers = [
            ...question.incorrect_answers,
            question.correct_answer,
          ];
          const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
          const letterMapping = ["A", "B", "C", "D"];
          const answerObjects = shuffledAnswers.map((ans, index) => ({
            letter: letterMapping[index],
            text: ans,
          }));
          return { ...question, answerObjects };
        });

        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (language) {
      fetchQuestions();
    }
  }, [language, category, subcategory]);

  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(Date.now());
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (quizFinished || questions.length === 0) return;

    const timer =
      countdown > 0 &&
      setInterval(() => setCountdown((prev) => prev - 1), 1000);

    if (countdown === 0) {
      clearInterval(timer);
      finishQuiz();
    }
    return () => clearInterval(timer);
  }, [countdown, quizFinished, score, navigate, questions.length]);

  const handleAnswer = (selectedLetter) => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswerObj = currentQuestion.answerObjects.find(
      (ansObj) => ansObj.letter === selectedLetter
    );
    const correct = selectedAnswerObj.text === currentQuestion.correct_answer;
    const timeTaken = (Date.now() - startTime) / 1000;
    let points = correct ? 10 : -3;
    if (correct) {
      if (timeTaken <= 5) points += 5;
      else if (timeTaken <= 10) points += 3;
    }

    setScore((prevScore) => {
      const newScore = prevScore + points;
      localStorage.setItem("quizScore", newScore);
      return newScore;
    });

    setFeedbackMessage(
      correct
        ? language === "en"
          ? `✅ Correct! +${points} points`
          : `✅ Correcto! +${points} puntos`
        : language === "en"
        ? `❌ Wrong! -3 points`
        : `❌ Error! -3 puntos`
    );

    setTimeout(() => setFeedbackMessage(""), 2000);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setStartTime(Date.now());
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    localStorage.setItem("quizScore", score);

    if (name) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/score`, { name, score })
        .then((response) => {
          console.log(response.data);
          // Navigate to the results page once the score is submitted
          navigate("/quiz-results");
        })
        .catch((error) => console.error("Error saving score:", error));
    } else {
      navigate("/quiz-results"); // Navigate immediately if no name
    }
  };
  return (
    <div className="main">
      <img
        src="/leftArrow.svg"
        alt="leftArrow"
        className="leftArrow"
        onClick={() => navigate("/")}
      />
      <h1>{language === "en" ? "Quiz Time!" : "¡A jugar!"}</h1>
      <h2 className={`countdown ${countdown <= 10 ? "low-time" : ""}`}>
        {language === "en" ? "Time Remaining:" : "Te quedan:"}{" "}
        <span>{countdown}</span> s
      </h2>
      <h2 className={`score ${score < 0 ? "negative" : ""}`}>
        {language === "en" ? "Score:" : "Puntos:"} {score}
      </h2>

      {feedbackMessage && (
        <div className="feedback-message">{feedbackMessage}</div>
      )}

      {questions.length > 0 && !quizFinished && (
        <QuestionCard
          question={questions[currentQuestionIndex].question}
          answers={questions[currentQuestionIndex].answerObjects}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
};

export default QuizPage;
