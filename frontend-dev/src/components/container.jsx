import React, { useState } from 'react';
export const Currency = () => {
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("PKR");
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
  const handleSubmit = async () => {
    if (!amount || isNaN(amount)) {
      setError("Please enter a valid amount");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, amount: parseFloat(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      if (data.convertedAmount !== undefined) {
        setConverted(data.convertedAmount.toFixed(2));
      } else {
        setError("Conversion failed. Try again.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md'>
        <h1 className='text-3xl font-semibold mb-6'>Currency Converter</h1>

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
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>
      </div>
    </div>
  );
};
