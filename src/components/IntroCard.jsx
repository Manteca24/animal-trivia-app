import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const IntroCard = () => {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [topPlayers, setTopPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/score/top-scores`
        );
        setTopPlayers(response.data.slice(0, 5)); // Only get top 5 players
      } catch (error) {
        console.error("Error fetching top players:", error);
      }
    };

    fetchTopPlayers();
  }, []);

  const handleNameChange = (e) => {
    setUserNameInput(e.target.value);
  };

  const handleSubmitName = () => {
    if (userNameInput.trim()) {
      setName(userNameInput);
      localStorage.setItem("playerName", userNameInput); // Save the name to localStorage
      setUserNameInput("");
    }
  };

  const handleStartQuiz = () => {
    if (name) {
      navigate(`/quiz?name=${name}&language=${language}`);
    }
  };

  const handleNavigateToCustomPage = () => {
    navigate("/custom");
  };

  return (
    <div className="intro-card">
      <h1>{language === "en" ? "Animal Quiz" : "Reto Animal"}</h1>

      {!name && (
        <h2>{language === "en" ? "What's your name?" : "¿Cómo te llamas?"}</h2>
      )}

      {!name ? (
        <div className="input-container">
          <input
            type="text"
            placeholder={language === "en" ? "Your name" : "Tu nombre"}
            value={userNameInput}
            onChange={handleNameChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmitName();
            }}
          />
          {userNameInput.trim() && (
            <span className="checkmark" onClick={handleSubmitName}>
              {language === "en" ? "Send" : "Enviar"}
            </span>
          )}
        </div>
      ) : (
        <h2 className="helloName">
          {language === "en" ? `Hello, ${name}!` : `¡Hola, ${name}!`}
        </h2>
      )}

      <button onClick={handleStartQuiz} disabled={!name}>
        {language === "en" ? "Play to Score" : "Jugar para puntuar"}
      </button>

      {!name && (
        <p className="warning-text">
          {language === "en"
            ? "Enter a name to play to score"
            : "Ingresa un nombre para jugar puntuando"}
        </p>
      )}

      <div className="leaderboard">
        <h2>🏆 Top 5</h2>
        <ul>
          {topPlayers.length > 0 ? (
            topPlayers.map((player, index) => (
              <li key={index}>
                {index + 1}. {player.name} - {player.highest_score} pts
              </li>
            ))
          ) : (
            <p>No scores yet!</p>
          )}
        </ul>
      </div>

      <button className="customGameButton" onClick={handleNavigateToCustomPage}>
        {language === "en" ? "Play for fun" : "Juego libre"}
      </button>
    </div>
  );
};

export default IntroCard;
