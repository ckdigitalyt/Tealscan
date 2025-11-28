"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface AssetChartProps {
  allocation: {
    Equity: number;
    Debt: number;
    Gold: number;
  };
}

const COLORS = {
  Equity: "#0F766E",
  Debt: "#3B82F6",
  Gold: "#F59E0B",
};

export default function AssetChart({ allocation }: AssetChartProps) {
  const data = [
    { name: "Equity", value: allocation.Equity, color: COLORS.Equity },
    { name: "Debt", value: allocation.Debt, color: COLORS.Debt },
    { name: "Gold", value: allocation.Gold, color: COLORS.Gold },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        No allocation data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Allocation"]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "8px 12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-slate-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
