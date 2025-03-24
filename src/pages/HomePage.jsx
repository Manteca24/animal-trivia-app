import React from "react";
import IntroCard from "../components/IntroCard";

const HomePage = ({ username }) => {
  return (
    <div className="main">
      <IntroCard username={username} />
    </div>
  );
};

export default HomePage;
