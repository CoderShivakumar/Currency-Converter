import React, { useState, useEffect } from 'react';

export const Currency = () => {
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("PKR");
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState({});

  const currencyNames = {
    USD: "United States Dollar",
    EUR: "Euro",
    INR: "Indian Rupee",
    PKR: "Pakistani Rupee",
    GBP: "British Pound",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    JPY: "Japanese Yen",
    CNY: "Chinese Yuan",
    AED: "United Arab Emirates Dirham",
  };
  const currencyCodes = Object.keys(currencyNames);

  // Fetch exchange rates once on component mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        if (data && data.rates) {
          setRates(data.rates);
        } else {
          throw new Error("Failed to fetch exchange rates");
        }
      } catch (err) {
        setError("Error fetching currency rates.");
      }
    };
    fetchRates();
  }, []);

  const handleSubmit = () => {
    setError(null);
    if (!amount || isNaN(amount)) {
      setError("Please enter a valid amount");
      return;
    }
    if (!rates[from] || !rates[to]) {
      setError("Currency not supported");
      return;
    }

    setLoading(true);
    const amountNum = parseFloat(amount);
    const amountInUSD = amountNum / rates[from];
    const result = amountInUSD * rates[to];
    setConverted(result.toFixed(2));
    setLoading(false);
  };

  return (
    <div className='h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-semibold mb-6 text-center'>Currency Converter</h1>

        <div className='flex flex-col gap-4 text-start'>
          <label>From Currency</label>
          <select
            className='border h-10 rounded px-2'
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            {currencyCodes.map(code => (
              <option key={code} value={code}>
                {currencyNames[code]} ({code})
              </option>
            ))}
          </select>

          <label>Amount</label>
          <input
            type='number'
            className='h-10 border rounded px-2'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>To Currency</label>
          <select
            className='border h-10 rounded px-2'
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            {currencyCodes.map(code => (
              <option key={code} value={code}>
                {currencyNames[code]} ({code})
              </option>
            ))}
          </select>

          <label>Converted Amount</label>
          <input
            type='text'
            className='h-10 border rounded px-2 bg-gray-100'
            value={converted}
            readOnly
            placeholder="Result will appear here"
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            className='bg-blue-600 text-white p-3 rounded-xl text-lg mt-4'
            onClick={handleSubmit}
            disabled={loading || !Object.keys(rates).length}
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>
      </div>
    </div>
  );
};
