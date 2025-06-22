

import React, { useState } from 'react';
import "../styles/scraper.css";

const WebScraping = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState([]);

  const handleScrape = async () => {
    try {
      const response = await fetch('http://localhost:5000/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      if (result.success) {
        setData(result.data);
        downloadCSV(result.data);
      } else {
        alert('Scraping failed: ' + result.message);
      }
    } catch (error) {
      console.error('Scraping failed:', error);
      alert('Error scraping the site.');
    }
  };

  const downloadCSV = (data) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Title,Link', ...data.map(d => `"${d.title}","${d.link}"`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'scraped_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="web-scraper-container">
      <h2>Web Scraper</h2>
      <input
        type="text"
        placeholder="Enter URL to scrape"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <br />
      <button onClick={handleScrape}>Scrape</button>

      {data.length > 0 && (
        <div className="scraped-results">
          <h3>Scraped Results</h3>
          <ul>
            {data.map((item, idx) => (
              <li key={idx}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WebScraping;
