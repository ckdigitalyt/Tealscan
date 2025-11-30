export interface OverlapAlert {
  category: string;
  fundNames: string[];
  count: number;
  riskLevel: 'high' | 'medium' | 'low';
  message: string;
}

const fundCategories: Record<string, string[]> = {
  'Large Cap': ['Large Cap', 'Bluechip', 'Sensex', 'Nifty 50'],
  'Mid Cap': ['Mid Cap', 'Midcap', 'Emerging'],
  'Small Cap': ['Small Cap', 'Smallcap', 'Small'],
  'Multi Cap': ['Multi Cap', 'Multicap', 'Diversified', 'Balanced'],
  'Value': ['Value', 'Dividend'],
  'Growth': ['Growth', 'Aggressive'],
  'Equity Linked Saving': ['ELSS', 'Tax'],
  'Debt': ['Debt', 'Income', 'Bond', 'Liquid', 'Overnight', 'Ultra Short'],
  'Gold': ['Gold', 'GoldSavings'],
};

function getFundCategory(fundName: string): string {
  const upper = fundName.toUpperCase();
  
  for (const [category, keywords] of Object.entries(fundCategories)) {
    if (keywords.some(keyword => upper.includes(keyword.toUpperCase()))) {
      return category;
    }
  }
  
  return 'Other';
}

export function detectOverlaps(funds: Array<{ name: string; planType: string }>): OverlapAlert[] {
  const categoryMap: Record<string, string[]> = {};
  
  // Group funds by category
  funds.forEach(fund => {
    const category = getFundCategory(fund.name);
    if (!categoryMap[category]) {
      categoryMap[category] = [];
    }
    categoryMap[category].push(fund.name);
  });
  
  // Find overlaps
  const overlaps: OverlapAlert[] = [];
  
  for (const [category, fundNames] of Object.entries(categoryMap)) {
    if (fundNames.length > 1) {
      const riskLevel = fundNames.length > 3 ? 'high' : fundNames.length > 2 ? 'medium' : 'low';
      
      overlaps.push({
        category,
        fundNames,
        count: fundNames.length,
        riskLevel,
        message: `You own ${fundNames.length} ${category} funds. You might be paying multiple fees for overlapping holdings.`,
      });
    }
  }
  
  return overlaps.filter(o => o.riskLevel === 'high' || o.riskLevel === 'medium');
}

export function calculateConcentrationScore(overlaps: OverlapAlert[]): number {
  // Score from 0-100 (0 = no concentration risk, 100 = severe concentration)
  const baseScore = overlaps.reduce((score, overlap) => {
    const riskMultiplier = overlap.riskLevel === 'high' ? 3 : overlap.riskLevel === 'medium' ? 2 : 1;
    return score + (overlap.count * riskMultiplier * 10);
  }, 0);
  
  return Math.min(100, baseScore);
}
