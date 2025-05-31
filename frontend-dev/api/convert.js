import axios from "axios";

const API_URL = "https://open.er-api.com/v6/latest/USD";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, use POST." });
  }

  const { amount, from, to } = req.body;

  if (!amount || !from || !to) {
    return res.status(400).json({ error: "Please provide amount, from, and to in request body." });
  }

  try {
    const response = await axios.get(API_URL);
    const rates = response.data.rates;

    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();

    if (!rates[fromUpper]) {
      return res.status(400).json({ error: `Currency code '${fromUpper}' not supported.` });
    }
    if (!rates[toUpper]) {
      return res.status(400).json({ error: `Currency code '${toUpper}' not supported.` });
    }

    const amountNum = parseFloat(amount);
    const amountInUSD = amountNum / rates[fromUpper];
    const converted = amountInUSD * rates[toUpper];

    res.status(200).json({
      amount: amountNum,
      from: fromUpper,
      to: toUpper,
      convertedAmount: converted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch rates or convert currency." });
  }
}
