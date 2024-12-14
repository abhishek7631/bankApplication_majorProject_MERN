import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import CSS for styling

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-heading">Welcome to Bank Application</h1>
      <div className="button-container">
        <button
          className="btn btn-primary home-button"
          onClick={() => navigate("/register")}
        >
          Registration
        </button>
        <button
          className="btn btn-success home-button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;
