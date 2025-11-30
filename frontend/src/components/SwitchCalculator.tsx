"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

interface SwitchCalculatorProps {
  portfolioValue: number;
  regularFundsCount: number;
}

export default function SwitchCalculator({ portfolioValue, regularFundsCount }: SwitchCalculatorProps) {
  const [yearsHeld, setYearsHeld] = useState(5);
  
  // Calculations
  const annualExpenseSavings = portfolioValue * 0.01; // 1% annual fee difference
  const totalSavingsOverYears = annualExpenseSavings * yearsHeld;
  
  // Assume 10% LTCG tax on gains
  const estimatedGain = portfolioValue * 0.20; // Assume 20% overall gain
  const taxCost = estimatedGain * 0.10; // 10% LTCG tax
  
  // Verdict logic
  const breakeven = taxCost > 0 ? taxCost / annualExpenseSavings : 0;
  const shouldSwitch = breakeven < 2;
  const verdict = shouldSwitch 
    ? `✅ Consider Switching. Breakeven in ${breakeven.toFixed(1)} years.`
    : `❌ Hold! Tax hit outweighs savings.`;
  
  const verdictColor = shouldSwitch ? "text-neon-green" : "text-neon-orange";
  const verdictBg = shouldSwitch ? "bg-neon-green/10 border-neon-green/30" : "bg-neon-orange/10 border-neon-orange/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card rounded-2xl p-8 border border-white/10"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">The Switch Reality Check</h3>
        <p className="text-gray-300 text-sm">
          See if switching from Regular to Direct plans makes financial sense after taxes.
        </p>
      </div>

      {/* Years slider */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-200 mb-3">
          Years Held: <span className="text-neon-green font-bold">{yearsHeld} years</span>
        </label>
        <input
          type="range"
          min="1"
          max="30"
          value={yearsHeld}
          onChange={(e) => setYearsHeld(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1 year</span>
          <span>30 years</span>
        </div>
      </div>

      {/* Calculations display */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* Expense Savings */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card rounded-xl p-4 border border-neon-green/30 bg-neon-green/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-neon-green" />
            <p className="text-xs font-medium text-gray-300">Annual Savings</p>
          </div>
          <p className="text-2xl font-bold text-neon-green">
            ₹{(annualExpenseSavings / 100000).toFixed(1)}L
          </p>
          <p className="text-xs text-gray-400 mt-1">at 1% fee difference</p>
        </motion.div>

        {/* Total Savings Over Period */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card rounded-xl p-4 border border-neon-green/30 bg-neon-green/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-neon-green" />
            <p className="text-xs font-medium text-gray-300">{yearsHeld}yr Savings</p>
          </div>
          <p className="text-2xl font-bold text-neon-green">
            ₹{(totalSavingsOverYears / 100000).toFixed(1)}L
          </p>
        </motion.div>

        {/* Tax Cost */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass-card rounded-xl p-4 border border-neon-orange/30 bg-neon-orange/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-neon-orange" />
            <p className="text-xs font-medium text-gray-300">Tax Cost (Est.)</p>
          </div>
          <p className="text-2xl font-bold text-neon-orange">
            ₹{(taxCost / 100000).toFixed(1)}L
          </p>
          <p className="text-xs text-gray-400 mt-1">on ~10% LTCG</p>
        </motion.div>
      </div>

      {/* Verdict */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`rounded-xl p-5 border-2 ${verdictBg} flex items-start gap-4`}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {shouldSwitch ? (
            <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-neon-orange flex-shrink-0 mt-0.5" />
          )}
        </motion.div>
        <div>
          <p className={`font-bold text-lg mb-1 ${verdictColor}`}>{verdict}</p>
          <p className="text-sm text-gray-300">
            {shouldSwitch
              ? `After accounting for taxes, you'll save ₹${((totalSavingsOverYears - taxCost) / 100000).toFixed(1)}L net over ${yearsHeld} years.`
              : `The tax hit of ₹${(taxCost / 100000).toFixed(1)}L would take ${breakeven.toFixed(1)} years of fee savings to recover.`}
          </p>
        </div>
      </motion.div>

      <p className="text-xs text-gray-500 mt-4">
        💡 *Estimates: Assumes 10% LTCG tax, 20% portfolio gain, and 1% annual fee difference. Consult a tax professional for accuracy.
      </p>
    </motion.div>
  );
}
