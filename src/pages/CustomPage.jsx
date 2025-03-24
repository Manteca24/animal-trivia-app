import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomPage = () => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [language]); // Re-fetch categories when language changes

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/categories?lang=${language}`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      const selectedCategoryData = categories.find(
        (category) => category.category === selectedCategory
      );
      if (selectedCategoryData) {
        setSubcategories(selectedCategoryData.subcategories);
        setSelectedSubcategory(""); // Reset subcategory when category changes
      }
    } else {
      setSubcategories([]); // Reset subcategories when no category is selected
    }
  }, [selectedCategory, categories]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  const handleStartCustomQuiz = () => {
    navigate(
      `/quiz?language=${language}&category=${selectedCategory}&subcategory=${selectedSubcategory}&difficulty=${selectedDifficulty}`
    );
  };

  return (
    <div className="main">
      <img
        src="/leftArrow.svg"
        alt="leftArrow"
        className="leftArrow"
        onClick={() => navigate("/")}
      />
      <h1>{language === "en" ? "Set Up" : "Configuración"}</h1>

      {/* Category selector */}
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">
          {language === "en" ? "Select Category" : "Seleccionar Categoría"}
        </option>
        {categories.map((category) => (
          <option key={category.category} value={category.category}>
            {category.category}
          </option>
        ))}
      </select>

      {/* Subcategory selector */}
      {selectedCategory && (
        <select
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          disabled={!subcategories.length}
        >
          <option value="">
            {language === "en"
              ? "Select Subcategory"
              : "Seleccionar Subcategoría"}
          </option>
          {subcategories.map((subcategory, index) => (
            <option key={index} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>
      )}

      {/* Difficulty selector */}
      <select value={selectedDifficulty} onChange={handleDifficultyChange}>
        <option value="">
          {language === "en" ? "Select Difficulty" : "Seleccionar Dificultad"}
        </option>
        <option value="easy">{language === "en" ? "Easy" : "Fácil"}</option>
        <option value="medium">{language === "en" ? "Medium" : "Media"}</option>
        <option value="hard">{language === "en" ? "Hard" : "Difícil"}</option>
      </select>

      {/* Start Quiz button */}
      <button onClick={handleStartCustomQuiz}>
        {language === "en" ? "Start Custom Quiz" : "Iniciar Quiz Personalizado"}
      </button>
    </div>
  );
};

export default CustomPage;
