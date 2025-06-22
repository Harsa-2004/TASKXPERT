// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [username, setUsername] = useState("User");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);

    // Fetch history from backend (placeholder)
    const dummyHistory = [
      { task: "Email Sent", status: "Success", time: "2025-04-10 10:30 AM" },
      { task: "Web Scraping", status: "Failed", time: "2025-04-09 04:21 PM" },
    ];
    setHistory(dummyHistory);
  }, []);

  // useEffect(() => {
  //   const storedEmail = localStorage.getItem("email");
  //   const storedName = localStorage.getItem("username");
  //   if (storedName) setUsername(storedName);
  
  //   if (storedEmail) {
  //     fetch(`http://localhost:5000/api/history/${storedEmail}`)
  //       .then((res) => res.json())
  //       .then((data) => setHistory(data))
  //       .catch((err) => console.error("Error fetching history:", err));
  //   }
  // }, []);
  

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>TaskXpert Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="welcome-box">
        <h2>Welcome, {username} 👋🏻 </h2>
        <p>What task do you want to automate today?</p>
      </section>

      <section className="features-grid">
        <div className="feature-card" onClick={() => navigate("/email")}>
          <h3>Email Generation</h3>
          <p>Compose and send AI-generated emails.</p>
        </div>

        <div className="feature-card" onClick={() => navigate("/scrape")}>
          <h3>Web Scraping</h3>
          <p>Scrape websites and convert data to CSV.</p>
        </div>
        <div className="feature-card" onClick={() => navigate("/clean-analyze")}>
          <h3>Data Cleaner and Analyzer</h3>
          <p>Clean the CSV file and tell the key statistics and trends.</p>
        </div>
      </section>

      <section className="history-section">
        <h3>Task History</h3>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{item.task}</td>
                <td className={item.status.toLowerCase()}>{item.status}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
