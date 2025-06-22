// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
// import Lottie from 'lottie-react';
// import aiAnimation from '../animations/ai.json'; // your animation file here

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
     {/* <Lottie animationData={aiAnimation} loop={true} className="ai-animation" /> */}
      <nav className="navbar">
        <h2 className="logo">TaskXpert</h2>
        <div className="nav-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </nav>

      <div className="hero">
        <h1>Automate Your Tasks with Intelligence</h1>
        <p>Your AI-powered assistant for emails, scraping, and productivity.</p>
        <button className="cta" onClick={() => navigate("/register")}>
          Get Started
        </button>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} TaskXpert. All rights reserved.</p>
        {/* <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </div> */}
      </footer>
    </div>
  );
};

export default Home;



