import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const UsernamePrompt = ({ onUsernameSet }) => {
  const [userNameInput, setUserNameInput] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleSubmitName = () => {
    if (userNameInput.trim()) {
      localStorage.setItem("playerName", userNameInput);
      onUsernameSet(userNameInput); // Update the username in the parent component
      navigate("/home"); // Redirect to Home page
    }
  };

  return (
    <div className="main">
      <img className="logoMono" src="mono.ico" alt="monoLogo" />
      <h2>{language === "en" ? "What's your name?" : "¿Cómo te llamas?"}</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder={language === "en" ? "Your name" : "Tu nombre"}
          value={userNameInput}
          onChange={(e) => setUserNameInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmitName()}
        />
      </div>
      {userNameInput.trim() && (
        <button className="checkmark" onClick={handleSubmitName}>
          {language === "en" ? "Send" : "Enviar"}
        </button>
      )}
    </div>
  );
};

export default UsernamePrompt;
