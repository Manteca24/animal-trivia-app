import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import QuizResults from "./pages/QuizResults";
import CustomPage from "./pages/CustomPage";
import LanguageToggler from "./components/LanguageToggler";
import Footer from "./components/Footer";
import UsernamePrompt from "./components/UsernamePrompt";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("playerName");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <Router>
      <LanguageProvider>
        <LanguageToggler />
        <Routes>
          {/* If no username, show UsernamePrompt at `/`, otherwise redirect to `/home` */}
          <Route
            path="/"
            element={
              username ? (
                <Navigate to="/home" />
              ) : (
                <UsernamePrompt onUsernameSet={setUsername} />
              )
            }
          />
          <Route path="/home" element={<HomePage username={username} />} />
          <Route path="/quiz" element={<QuizPage username={username} />} />
          <Route
            path="/quiz-results"
            element={<QuizResults username={username} />}
          />
          <Route path="/custom" element={<CustomPage username={username} />} />
        </Routes>
        <Footer />
      </LanguageProvider>
    </Router>
  );
}

export default App;
