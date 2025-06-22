const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const axios = require("axios");
const { mean, median, mode } = require("ml-stat/array");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');


const upload = multer({ dest: "uploads/" });

const TOGETHER_API_KEY = "89bc6da6976c1a09de0ea2d0fffe15ba9581767a82072432a62601ef48b1f2fd"; 
// Helper: check if column values are numeric


const isNumeric = (arr) => arr.every((val) => val === "" || !isNaN(val));

router.post("/clean-analyze", upload.single("csvFile"), async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const rawData = results;
        const columns = Object.keys(rawData[0] || {});

        // Clean nulls using mean/median/mode
        columns.forEach((col) => {
          const colValues = rawData.map((row) => row[col]);
          const validValues = colValues.filter((v) => v !== "");

          if (isNumeric(validValues)) {
            const numericVals = validValues.map(Number);
            const avg = mean(numericVals);
            const med = median(numericVals);
            const fillValue = Math.abs(avg - med) > 1 ? med : avg;

            rawData.forEach((row) => {
              if (row[col] === "") {
                row[col] = fillValue;
              } else {
                row[col] = Number(row[col]);
              }
            });
          } else {
            const fillValue = mode(validValues);
            rawData.forEach((row) => {
              if (row[col] === "") {
                row[col] = fillValue;
              }
            });
          }
        });

        // Remove duplicates
        const unique = rawData.filter(
          (v, i, a) => a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) === i
        );

        // Numeric column stats
        const sample = unique[0];
        const numericColumns = Object.keys(sample).filter((key) =>
          !isNaN(parseFloat(sample[key]))
        );

        const chartData = numericColumns.map((col) => {
          const values = unique.map((row) => parseFloat(row[col])).filter((v) => !isNaN(v));
          return {
            label: col,
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
          };
        });

        // LLM Prompt
        const prompt = `Analyze this dataset (first 5 rows). Give statistical insights, trends, and key points:\n\n${JSON.stringify(unique.slice(0, 5))}`;

        const response = await axios.post(
          "https://api.together.xyz/v1/chat/completions",
          {
            model: "mistralai/Mistral-7B-Instruct-v0.1",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${TOGETHER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const llmOutput = response.data.choices[0].message.content;

        res.json({
          cleanedData: unique,
          numericStats: chartData,
          insights: llmOutput,
        });
      } catch (err) {
        console.error("Error in Together API:", err.message);
        res.status(500).json({ error: "Error analyzing data." });
      } finally {
        // Always delete uploaded file
        fs.unlinkSync(req.file.path);
      }
    });
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const csv = require("csv-parser");
// const fs = require("fs");
// const axios = require("axios");
// const { mean, median, mode } = require("ml-stat/array");
// const { DecisionTreeClassifier } = require("ml-cart");

// const upload = multer({ dest: "uploads/" });
// const TOGETHER_API_KEY = "89bc6da6976c1a09de0ea2d0fffe15ba9581767a82072432a62601ef48b1f2fd"; // Keep in .env in real app

// // Helper
// const isNumeric = (arr) => arr.every((val) => val === "" || !isNaN(val));

// router.post("/clean-analyze", upload.single("csvFile"), async (req, res) => {
//   const results = [];

//   fs.createReadStream(req.file.path)
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", async () => {
//       try {
//         const rawData = results;
//         const columns = Object.keys(rawData[0] || {});

//         // Data Cleaning
//         columns.forEach((col) => {
//           const colValues = rawData.map((row) => row[col]);
//           const validValues = colValues.filter((v) => v !== "");

//           if (isNumeric(validValues)) {
//             const numericVals = validValues.map(Number);
//             const avg = mean(numericVals);
//             const med = median(numericVals);
//             const fillValue = Math.abs(avg - med) > 1 ? med : avg;

//             rawData.forEach((row) => {
//               if (row[col] === "") row[col] = fillValue;
//               else row[col] = Number(row[col]);
//             });
//           } else {
//             const fillValue = mode(validValues);
//             rawData.forEach((row) => {
//               if (row[col] === "") row[col] = fillValue;
//             });
//           }
//         });

//         // Remove duplicates
//         const unique = rawData.filter(
//           (v, i, a) => a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) === i
//         );

//         // Identify numeric columns
//         const sample = unique[0];
//         const numericColumns = Object.keys(sample).filter((key) =>
//           !isNaN(parseFloat(sample[key]))
//         );

//         // Determine target and features
//         const targetCol = columns[columns.length - 1];
//         const featureCols = columns.filter((c) => c !== targetCol && isNumeric(unique.map(row => row[c])));

//         // Prepare data for feature importance
//         const X = unique.map(row => featureCols.map(col => parseFloat(row[col])));
//         const y = unique.map(row => row[targetCol]);

//         let topFeature = featureCols[0];
//         if (featureCols.length > 1 && new Set(y).size > 1) {
//           // Use decision tree to determine feature importance
//           const clf = new DecisionTreeClassifier({ gainFunction: 'gini', maxDepth: 5, minNumSamples: 3 });
//           clf.train(X, y);
//           const importances = clf.featureImportances();

//           const maxIndex = importances.indexOf(Math.max(...importances));
//           topFeature = featureCols[maxIndex];
//         }

//         // Get stats of top feature
//         const topFeatureValues = unique.map(row => parseFloat(row[topFeature])).filter(v => !isNaN(v));
//         const topChartData = {
//           label: topFeature,
//           avg: mean(topFeatureValues),
//           min: Math.min(...topFeatureValues),
//           max: Math.max(...topFeatureValues),
//         };

//         // LLM Analysis
//         const prompt = `Analyze this dataset (first 5 rows). Give statistical insights, trends, and key points:\n\n${JSON.stringify(unique.slice(0, 5))}`;
//         const response = await axios.post(
//           "https://api.together.xyz/v1/chat/completions",
//           {
//             model: "mistralai/Mistral-7B-Instruct-v0.1",
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.7,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${TOGETHER_API_KEY}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const llmOutput = response.data.choices[0].message.content;

//         res.json({
//           cleanedData: unique,
//           numericStats: [topChartData], // Only send the selected feature
//           insights: llmOutput,
//         });
//       } catch (err) {
//         console.error("Error in Together API:", err.message);
//         res.status(500).json({ error: "Error analyzing data." });
//       } finally {
//         fs.unlinkSync(req.file.path);
//       }
//     });
// });

// module.exports = router;
