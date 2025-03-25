import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const IntroCard = ({ username }) => {
  const { language } = useLanguage();
  const [name, setName] = useState(username || "");
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get stored name from localStorage, if it exists
    const storedName = localStorage.getItem("playerName");
    if (!storedName) {
      navigate("/"); // Redirect to UsernamePrompt if there's no stored name
    } else {
      setName(storedName);
    }

    // Fetch leaderboard data
    const fetchTopPlayers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/score/top-scores`
        );
        setTopPlayers(response.data.slice(0, 5)); // Only top 5 players
      } catch (error) {
        console.error("Error fetching top players:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, [navigate]);

  const handleStartQuiz = () => {
    // Start quiz with the current name
    if (name) {
      navigate(`/quiz?name=${name}&language=${language}`);
    }
  };

  const handleForgetName = () => {
    // Clear the name from localStorage and reset the state
    localStorage.removeItem("playerName");
    setName(""); // Clear the state (UI will update)
    navigate("/"); // Redirect to UsernamePrompt page
    window.location.reload();
  };

  const handleChangeName = () => {
    // Let the user input a new name
    const newName = prompt(
      language === "en" ? "Enter your new name:" : "Introduce tu nuevo nombre:"
    );
    if (newName && newName.trim() !== "") {
      localStorage.setItem("playerName", newName);
      setName(newName); // Update state with the new name
    }
  };

  return (
    <div className="home">
      <h1>{language === "en" ? "Animal Quiz" : "Reto Animal"}</h1>
      <div className="jugarDiv">
        {name && (
          <h2 className="helloName">
            {language === "en" ? `Hello, ${name}!` : `¡Hola, ${name}!`}
            <img
              src="/borrar.svg"
              alt="Forget Name"
              className="nameActionIcon"
              onClick={handleForgetName}
            />
            <img
              src="/lapiz.svg"
              alt="Change Name"
              className="nameActionIcon"
              onClick={handleChangeName}
            />
          </h2>
        )}
        <div className="jugarButtonDiv">
          {/* <img className="mono1" src="/mono2.png" alt="mono2" /> */}
          <button className="buttonPlay" onClick={handleStartQuiz}>
            {language === "en" ? "Play" : "Jugar"}
          </button>
          {/* <img className="mono2" src="/mono2.png" alt="mono2" /> */}
        </div>
      </div>

      <div className="leaderboard">
        <h2>🏆 Top 5</h2>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <ul>
            {topPlayers.length > 0 ? (
              topPlayers.map((player, index) => (
                <li key={index}>
                  {index + 1}. {player.name} - {player.highest_score} pts
                </li>
              ))
            ) : (
              <p>
                {language === "en" ? "No scores yet :-(" : "Nadie jugó :-("}
              </p>
            )}
          </ul>
        )}
      </div>

      <div className="practiseDiv">
        <button
          className="customGameButton"
          onClick={() => navigate("/custom")}
        >
          {language === "en" ? "Practise" : "Practicar"}
        </button>
        <img src="/mono2.png" alt="mono2" />
      </div>
    </div>
  );
};

export default IntroCard;
