// Comprehensive calculations for portfolio analysis

export interface FundMetrics {
  xirr: number | null;
  gain: number;
  gainPercent: number;
  estimatedAnnualCommission: number;
  estimatedSavingsVsRegular: number;
  healthRating: string;
}

export function calculateFundMetrics(
  currentValue: number,
  investedAmount: number,
  planType: string,
  years: number = 1
): FundMetrics {
  // Calculate simple XIRR approximation
  const gain = currentValue - investedAmount;
  const gainPercent = investedAmount > 0 ? (gain / investedAmount) * 100 : 0;
  const xirr = investedAmount > 0 ? gainPercent / Math.max(1, years) : null;

  // Commission estimation (Direct plans save ~0.5-1% annually vs Regular)
  const estimatedAnnualCommission = planType === 'Regular' ? currentValue * 0.01 : 0;
  
  // 20-year savings estimation: Current Value * (1.01^20 - 1)
  const estimatedSavingsVsRegular = planType === 'Direct' 
    ? currentValue * (Math.pow(1.01, 20) - 1)
    : 0;

  // Health rating based on XIRR
  let healthRating = 'High Expense Ratio Flag';
  if (xirr !== null) {
    if (xirr > 20) {
      healthRating = 'In-Form';
    } else if (xirr >= 12) {
      healthRating = 'On-Track';
    } else if (xirr >= 0) {
      healthRating = 'Off-Track';
    } else {
      healthRating = 'High Expense Ratio Flag';
    }
  }

  return {
    xirr: xirr ? parseFloat(xirr.toFixed(2)) : null,
    gain,
    gainPercent: parseFloat(gainPercent.toFixed(2)),
    estimatedAnnualCommission,
    estimatedSavingsVsRegular,
    healthRating,
  };
}

export function calculatePortfolioMetrics(
  funds: Array<{
    currentValue: number;
    investedAmount: number;
    planType: string;
  }>
) {
  const totalValue = funds.reduce((sum, f) => sum + f.currentValue, 0);
  const totalInvested = funds.reduce((sum, f) => sum + f.investedAmount, 0);
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  
  const directFunds = funds.filter(f => f.planType === 'Direct').length;
  const regularFunds = funds.filter(f => f.planType === 'Regular').length;
  
  // Commission loss if all were in Regular plans
  const totalAnnualCommission = funds.reduce((sum, f) => {
    return sum + (f.planType === 'Regular' ? f.currentValue * 0.01 : 0);
  }, 0);

  // Portfolio health score (0-100)
  const healthScore = Math.min(100, Math.max(0, 50 + (totalGainPercent / 2)));

  return {
    totalValue,
    totalInvested,
    totalGain,
    totalGainPercent: parseFloat(totalGainPercent.toFixed(2)),
    totalAnnualCommission,
    directFunds,
    regularFunds,
    healthScore: Math.round(healthScore),
  };
}

export function assetClassification(fundName: string): 'Equity' | 'Debt' | 'Gold' | 'Hybrid' {
  const name = fundName.toUpperCase();
  
  if (name.includes('GOLD') || name.includes('GOLDSAVINGS')) {
    return 'Gold';
  }
  if (name.includes('DEBT') || name.includes('INCOME') || name.includes('BOND') || name.includes('LIQUID')) {
    return 'Debt';
  }
  if (name.includes('HYBRID') || name.includes('BALANCED') || name.includes('MULTI')) {
    return 'Hybrid';
  }
  
  // Default to Equity
  return 'Equity';
}
