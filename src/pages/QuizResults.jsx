import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";

const QuizResults = () => {
  const [score, setScore] = useState(0);
  const [topPlayers, setTopPlayers] = useState([]);
  const [rank, setRank] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const savedScore = localStorage.getItem("quizScore");
    if (savedScore) {
      setScore(Number(savedScore));
    }

    const fetchTopPlayers = async () => {
      try {
        setTimeout(async () => {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/score/top-scores`
          );
          setTopPlayers(response.data.slice(0, 5));

          const userRank = response.data.findIndex(
            (player) => player.highest_score === Number(savedScore)
          );

          if (userRank !== -1 && userRank < 5) {
            setRank(userRank + 1);
          }
        }, 1000);
      } catch (error) {
        console.error("Error fetching top players:", error);
      }
    };

    if (savedScore) {
      fetchTopPlayers();
    }
  }, []);

  // Navigate to the home page
  const goToHome = () => {
    navigate("/");
  };

  const playAgain = () => {
    const playerName = localStorage.getItem("playerName");
    if (playerName) {
      navigate(`/quiz?name=${playerName}&language=es`);
    } else {
      navigate("/"); // If no name found, navigate to home page
    }
  };

  return (
    <div className="main">
      <div className="home-repeat-icons">
        <img
          src="/home.svg"
          alt="home"
          className="homeIcon"
          onClick={goToHome}
        />
        <img
          src="/repetir.svg"
          alt="repetir"
          className="playAgain"
          onClick={playAgain} // Play again with the same name
        />
      </div>
      <h1>{language === "en" ? "Quiz Results" : "Resultados"}</h1>
      <h2 className={`score ${score < 0 ? "negative" : ""}`}>
        {language === "en" ? `${score} points` : `${score} puntos`}
      </h2>

      {rank && (
        <div className="celebration">
          {rank === 1 ? (
            <span>🥇</span>
          ) : rank === 2 ? (
            <span>🥈</span>
          ) : rank === 3 ? (
            <span>🥉</span>
          ) : (
            <span>🎉</span>
          )}
          <h3>
            {language === "en"
              ? `Congratulations! You're ranked #${rank} on the leaderboard!`
              : `¡Felicidades! ¡Estás en el puesto #${rank} del ranking!`}
          </h3>
        </div>
      )}
    </div>
  );
};

export default QuizResults;
