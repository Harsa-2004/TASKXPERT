// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmailAutomation from "./pages/EmailAutomation";
import WebScraping from "./pages/WebScraping";
import DataCleaner from "./pages/DataCleaner";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/email" element={<EmailAutomation />} />
        <Route path="/scrape" element={<WebScraping />} />
        <Route path="/clean-analyze" element={<DataCleaner />} />

      </Routes>
    </Router>
  );
}

export default App;
