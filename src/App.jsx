import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import QuizResults from "./pages/QuizResults";
import "./App.css";
import { LanguageProvider } from "./contexts/LanguageContext";
import CustomPage from "./pages/CustomPage";
import LanguageToggler from "./components/LanguageToggler";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Router>
        <LanguageProvider>
          <LanguageToggler />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz-results" element={<QuizResults />} />
            <Route path="/custom" element={<CustomPage />} />
          </Routes>
          <Footer />
        </LanguageProvider>
      </Router>
    </>
  );
}

export default App;
