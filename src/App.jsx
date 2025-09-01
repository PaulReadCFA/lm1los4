import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from "recharts";

function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-5 border border-gray-100 ${className}`}>
      <h2 className="font-serif text-xl text-slate-800 mb-3">{title}</h2>
      <div className="font-sans text-sm text-black/80">{children}</div>
    </div>
  );
}

function safeParseFloat(value, fallback = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

export default function AnnualizedReturnsCalculator() {
  const [totalReturn, setTotalReturn] = useState(15);
  const [periods, setPeriods] = useState(12);
  const [periodType, setPeriodType] = useState("monthly");

  // Input validation
  const validateInputs = () => {
    const errors = [];
    
    if (totalReturn < -99.99 || totalReturn > 10000) {
      errors.push("Total Return must be between -99.99% and 10,000%");
    }
    if (periods <= 0 || periods > 1000) {
      errors.push("Number of periods must be between 1 and 1,000");
    }
    if (totalReturn <= -100) {
      errors.push("Total Return cannot be -100% or lower (complete loss)");
    }
    
    return errors;
  };

  const inputErrors = validateInputs();

  // Calculations using useMemo for performance
  const calculations = useMemo(() => {
    if (inputErrors.length > 0) return null;

    const returnDecimal = totalReturn / 100;
    const frequencyMap = { daily: 365, weekly: 52, monthly: 12, yearly: 1 };
    const freq = frequencyMap[periodType];

    // Handle edge cases
    if (1 + returnDecimal <= 0) {
      return {
        annualizedReturn: NaN,
        logReturn: NaN,
        annualizedLogReturn: NaN,
        isValidLog: false,
        isValidAnnualized: false
      };
    }

    const annualizedReturn = Math.pow(1 + returnDecimal, freq / periods) - 1;
    const logReturn = Math.log(1 + returnDecimal);
    const annualizedLogReturn = logReturn * (freq / periods);

    return {
      annualizedReturn,
      logReturn,
      annualizedLogReturn,
      isValidLog: !isNaN(logReturn) && isFinite(logReturn),
      isValidAnnualized: !isNaN(annualizedReturn) && isFinite(annualizedReturn),
      frequencyDescription: `${freq} periods per year`
    };
  }, [totalReturn, periods, periodType, inputErrors]);

  const chartData = useMemo(() => {
    if (!calculations || inputErrors.length > 0) return [];
    
    const data = [];
    
    if (calculations.isValidAnnualized) {
      data.push({
        name: "Annualized Return",
        shortName: "Annualized",
        value: calculations.annualizedReturn * 100,
        description: "Compound annual growth rate equivalent"
      });
    }
    
    if (calculations.isValidLog) {
      data.push({
        name: "Annualized Log Return", 
        shortName: "Log Return",
        value: calculations.annualizedLogReturn * 100,
        description: "Continuously compounded annual return"
      });
    }
    
    return data;
  }, [calculations, inputErrors]);

  const updateTotalReturn = (value) => {
    setTotalReturn(safeParseFloat(value));
  };

  const updatePeriods = (value) => {
    setPeriods(safeParseFloat(value, 1));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: payload[0].color }}>
            {`Value: ${payload[0].value.toFixed(3)}%`}
          </p>
          <p className="text-xs text-gray-600 mt-1">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4">
        <Card title="Annualized & Log Returns Calculator" className="w-full">
          
          {/* Input Section */}
          <div className="mb-6">
            <h3 className="font-serif text-lg text-slate-700 mb-4">Input Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <label className="flex flex-col" htmlFor="total-return-input">
                Total Return Since Inception (%) <span className="text-gray-500 text-xs">(-99.99 to 10,000)</span>
                <input
                  id="total-return-input"
                  type="number"
                  min="-99.99"
                  max="10000"
                  step="0.01"
                  value={totalReturn}
                  onChange={e => updateTotalReturn(e.target.value)}
                  className="mt-1 rounded-lg border px-3 py-2"
                  aria-describedby="total-return-help"
                />
                <span id="total-return-help" className="sr-only">
                  Enter total cumulative return percentage since inception
                </span>
              </label>

              <label className="flex flex-col" htmlFor="periods-input">
                Time Since Inception (# of periods) <span className="text-gray-500 text-xs">(1 to 1,000)</span>
                <input
                  id="periods-input"
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  value={periods}
                  onChange={e => updatePeriods(e.target.value)}
                  className="mt-1 rounded-lg border px-3 py-2"
                  aria-describedby="periods-help"
                />
                <span id="periods-help" className="sr-only">
                  Enter number of time periods since inception
                </span>
              </label>

              <label className="flex flex-col" htmlFor="period-type-select">
                Period Type <span className="text-gray-500 text-xs">(frequency basis)</span>
                <select
                  id="period-type-select"
                  value={periodType}
                  onChange={e => setPeriodType(e.target.value)}
                  className="mt-1 rounded-lg border px-3 py-2"
                  aria-describedby="period-type-help"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <span id="period-type-help" className="sr-only">
                  Select the frequency of periods for annualization
                </span>
              </label>
            </div>
          </div>

          {/* Error Messages */}
          {inputErrors.length > 0 && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <div className="text-red-800 text-sm">
                <strong>Input Errors:</strong>
                <ul className="mt-1 list-disc list-inside">
                  {inputErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Results and Charts */}
          {calculations && (
            <>
              {/* Key Results Summary */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-serif text-lg text-slate-700 mb-3">Calculation Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="mb-2">
                      <strong>Annualized Return:</strong> {
                        calculations.isValidAnnualized 
                          ? `${(calculations.annualizedReturn * 100).toFixed(3)}%` 
                          : 'Invalid calculation'
                      }
                    </p>
                    <p className="text-xs text-gray-600">
                      Equivalent compound annual growth rate
                    </p>
                  </div>
                  <div>
                    <p className="mb-2">
                      <strong>Annualized Log Return:</strong> {
                        calculations.isValidLog 
                          ? `${(calculations.annualizedLogReturn * 100).toFixed(3)}%` 
                          : 'Invalid calculation'
                      }
                    </p>
                    <p className="text-xs text-gray-600">
                      Continuously compounded annual return
                    </p>
                  </div>
                </div>
                {calculations.frequencyDescription && (
                  <p className="text-xs text-gray-600 mt-2">
                    Basis: {calculations.frequencyDescription}
                  </p>
                )}
              </div>

              {/* Visual Comparison Chart */}
              {chartData.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-serif text-lg text-slate-700 mb-2">Visual Comparison</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 40, right: 30, left: 30, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="shortName"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                        />
                        <YAxis 
                          label={{ value: 'Annual Return (%)', angle: -90, position: 'insideLeft' }}
                          tickFormatter={(value) => value.toFixed(1)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
                        <Bar 
                          dataKey="value" 
                          radius={[4, 4, 0, 0]}
                          name="Return"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value >= 0 ? "#000000" : "#dc2626"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Black bars indicate positive returns, red bars indicate negative returns.
                    Log returns are typically lower than arithmetic annualized returns for positive performance.
                  </p>
                </div>
              )}

              {/* Calculation Details */}
              {calculations.isValidAnnualized && calculations.isValidLog && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-serif text-lg text-slate-700 mb-3">Technical Details</h3>
                  <div className="text-sm space-y-2">
                    <p>
                      <strong>Annualized Return Formula:</strong> 
                      {` (1 + ${totalReturn}%)^(${periodType === 'daily' ? '365' : periodType === 'weekly' ? '52' : periodType === 'monthly' ? '12' : '1'}/${periods}) - 1`}
                    </p>
                    <p>
                      <strong>Log Return:</strong> 
                      {` ln(1 + ${totalReturn}%) = ${(calculations.logReturn).toFixed(4)}`}
                    </p>
                    <p>
                      <strong>Annualized Log Return:</strong>
                      {` ${(calculations.logReturn).toFixed(4)} × (${periodType === 'daily' ? '365' : periodType === 'weekly' ? '52' : periodType === 'monthly' ? '12' : '1'}/${periods})`}
                    </p>
                    <p className="text-xs text-gray-600 mt-3">
                      <strong>Difference:</strong> Log returns assume continuous compounding and are additive across time periods, 
                      while arithmetic returns assume discrete compounding and must be chained multiplicatively.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Educational Note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Annualized vs. Log Returns:</strong> Annualized returns show the equivalent compound 
              annual growth rate, while log returns represent continuously compounded rates. Log returns 
              are mathematically convenient for portfolio analysis as they are additive and approximately 
              normal for small return periods. For large positive returns, annualized returns will typically 
              exceed log returns due to compounding effects.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}