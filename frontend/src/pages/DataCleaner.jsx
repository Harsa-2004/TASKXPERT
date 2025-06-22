// import React, { useState } from 'react';
// import '../styles/dataCleaner.css';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

// ChartJS.register(BarElement, CategoryScale, LinearScale);

// const DataCleaner = () => {
//   const [file, setFile] = useState(null);
//   const [cleanedData, setCleanedData] = useState([]);
//   const [insights, setInsights] = useState('');
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [analyzed, setAnalyzed] = useState(false);

//   const handleUpload = async () => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('csvFile', file);

//     try {
//       const res = await fetch('http://localhost:5000/api/clean-analyze', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await res.json();
//       setCleanedData(data.cleanedData);
//       setInsights(data.insights);
//       setChartData(data.numericStats); // Receive chartData from backend
//       setAnalyzed(true);
//     } catch (err) {
//       alert('Something went wrong!');
//     } 
//     finally {
//       setLoading(false);
//     }
//   };

//   const downloadCSV = () => {
//     const headers = Object.keys(cleanedData[0]).join(',');
//     const rows = cleanedData.map(obj => Object.values(obj).join(',')).join('\n');
//     const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'cleaned_data.csv';
//     a.click();
//   };

//   return (
//     <div className={`data-cleaner-container ${analyzed ? 'data-cleaner-analyzed' : 'data-cleaner-initial'}`}>
//       <h2> Data Cleaner & Analyzer</h2>

//       <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={handleUpload} disabled={!file || loading}>
//         {loading ? 'Processing...' : 'Upload & Analyze'}
//       </button>

//       {insights && (
//         <div className="insights">
//           <h3>🔍 LLM Insights</h3>
//           <p>{insights}</p>
//         </div>
//       )}

//       {/* Show one chart only for most suitable column */}
//       {chartData.length > 0 && (
//         <div className="charts">
//           <h3>📈 Top Feature for Target Column</h3>
//           <p><strong> Most Important Feature Name:</strong> {chartData[0].label}</p>
//           <Bar
//             data={{
//               labels: ['Min', 'Avg', 'Max'],
//               datasets: [{
//                 label: chartData[0].label,
//                 data: [chartData[0].min, chartData[0].avg, chartData[0].max],
//                 backgroundColor: ['#8e24aa', '#5e35b1', '#1e88e5']
//               }]
//             }}
//             options={{ responsive: true }}
//           />
//         </div>
//       )}

//       {cleanedData.length > 0 && (
//         <div className="download-section">
//           <h3>📁 Cleaned Data</h3>
//           <button onClick={downloadCSV}>Download CSV</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DataCleaner;


import React, { useState } from 'react';
import '../styles/dataCleaner.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../assets/animation.json';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const DataCleaner = () => {
  const [file, setFile] = useState(null);
  const [cleanedData, setCleanedData] = useState([]);
  const [insights, setInsights] = useState('');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const res = await fetch('http://localhost:5000/api/clean-analyze', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setCleanedData(data.cleanedData);
      setInsights(data.insights);
      setChartData(data.numericStats);
      setAnalyzed(true);
    } catch (err) {
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = Object.keys(cleanedData[0]).join(',');
    const rows = cleanedData.map(obj => Object.values(obj).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_data.csv';
    a.click();
  };

  return (
    <div className="data-cleaner-wrapper">
      <div className="left-panel">
        <Player
          autoplay
          loop
          src={animationData}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
      <div className="data-cleaner-container">
        <h2>Data Cleaner & Analyzer</h2>

        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} disabled={!file || loading}>
          {loading ? 'Processing...' : 'Upload & Analyze'}
        </button>

        {insights && (
          <div className="insights">
            <h3>🔍 LLM Insights</h3>
            <p>{insights}</p>
          </div>
        )}

        {chartData.length > 0 && (
          <div className="charts">
            <h3>📈 Top Feature for Target Column</h3>
            <p><strong>Most Important Feature Name:</strong> {chartData[0].label}</p>
            <Bar
              data={{
                labels: ['Min', 'Avg', 'Max'],
                datasets: [{
                  label: chartData[0].label,
                  data: [chartData[0].min, chartData[0].avg, chartData[0].max],
                  backgroundColor: ['#8e24aa', '#5e35b1', '#1e88e5']
                }]
              }}
              options={{ responsive: true }}
            />
          </div>
        )}

        {cleanedData.length > 0 && (
          <div className="download-section">
            <h3>📁 Cleaned Data</h3>
            <button onClick={downloadCSV}>Download CSV</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCleaner;
