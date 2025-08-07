import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

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

  const chartData = [
    { name: "Annualized Return", value: annualizedReturn * 100 },
    { name: "Log Return", value: annualizedLogReturn * 100 },
  ];

  return (
    <div className="p-6 grid gap-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-serif text-blue-900">Annualized & Log Returns</h1>

      {/* Inputs */}
      <div className="border rounded-2xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Total Return Since Inception (%)</label>
            <input
              type="number"
              className="input w-full border rounded p-2"
              value={totalReturn}
              onChange={(e) => setTotalReturn(+e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Time Since Inception (# of periods)</label>
            <input
              type="number"
              className="input w-full border rounded p-2"
              value={periods}
              onChange={(e) => setPeriods(+e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Period Type</label>
            <select
              className="input w-full border rounded p-2"
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Output Numbers */}
      <div className="border rounded-2xl shadow p-4 text-lg">
        <p>
          <strong>Annualized Return:</strong> {(annualizedReturn * 100).toFixed(2)}%
        </p>
        <p>
          <strong>Annualized Log Return:</strong> {(annualizedLogReturn * 100).toFixed(2)}%
        </p>
      </div>

      {/* Bar Chart */}
      <div className="border rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Visual Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip />
            <Bar dataKey="value" fill="#00528C" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="value" position="top" formatter={(val) => `${val.toFixed(2)}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
