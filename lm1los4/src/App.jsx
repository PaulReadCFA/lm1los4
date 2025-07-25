import { useState } from "react";

export default function App() {
  const [totalReturn, setTotalReturn] = useState(15);
  const [periods, setPeriods] = useState(12);
  const [periodType, setPeriodType] = useState("monthly");

  const returnDecimal = totalReturn / 100;
  const frequencyMap = { daily: 365, weekly: 52, monthly: 12, yearly: 1 };
  const freq = frequencyMap[periodType];

  const annualizedReturn = Math.pow(1 + returnDecimal, freq / periods) - 1;
  const logReturn = Math.log(1 + returnDecimal);
  const annualizedLogReturn = logReturn * (freq / periods);

  return (
    <div className="p-6 grid gap-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-serif text-blue-900">Annualized & Log Returns</h1>
      <div className="border rounded-2xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label>Total Return Since Inception (%)</label>
            <input type="number" className="input" value={totalReturn} onChange={e => setTotalReturn(+e.target.value)} />
          </div>
          <div>
            <label>Time Since Inception (# of periods)</label>
            <input type="number" className="input" value={periods} onChange={e => setPeriods(+e.target.value)} />
          </div>
          <div>
            <label>Period Type</label>
            <select className="input" value={periodType} onChange={e => setPeriodType(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>
      <div className="border rounded-2xl shadow p-4 text-lg">
        <p>Annualized DAILY Return: {(annualizedReturn * 100).toFixed(2)}%</p>
        <p>Annualized Continuously Compounded Return: {(annualizedLogReturn * 100).toFixed(2)}%</p>
      </div>
    </div>
  );
}
