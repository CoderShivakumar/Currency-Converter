// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000;

// Currency rates API (base: USD)
const API_URL = "https://open.er-api.com/v6/latest/USD";

// Middleware
app.use(cors());           // Enables CORS for all origins — good for frontend requests
app.use(express.json());   // Parses incoming JSON bodies

// POST route for currency conversion
app.post("/convert", async (req, res) => {
  const { amount, from, to } = req.body;

  // Validate request body
  if (!amount || !from || !to) {
    return res.status(400).json({ error: "Please provide amount, from, and to in request body." });
  }

  try {
    const response = await axios.get(API_URL);
    const rates = response.data.rates;

    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();

    // Check if currencies are supported
    if (!rates[fromUpper]) {
      return res.status(400).json({ error: `Currency code '${fromUpper}' not supported.` });
    }
    if (!rates[toUpper]) {
      return res.status(400).json({ error: `Currency code '${toUpper}' not supported.` });
    }

    // Convert amount
    const amountNum = parseFloat(amount);
    const amountInUSD = amountNum / rates[fromUpper];
    const converted = amountInUSD * rates[toUpper];

    // Respond with result
    res.json({
      amount: amountNum,
      from: fromUpper,
      to: toUpper,
      convertedAmount: converted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch rates or convert currency." });
  }
});

// Simple GET route to check backend health
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Start server
app.listen(port, () => {
  console.log(`Currency converter API running at http://localhost:${port}`);
});
