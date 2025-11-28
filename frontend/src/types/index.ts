export interface FundData {
  name: string;
  category: string;
  value: number;
  invested: number;
  plan_type: string;
  xirr: number | null;
  xirr_status: string;
  rating: string;
  annual_commission_loss: number;
  amc: string;
  folio: string;
}

export interface ScanResponse {
  net_worth: number;
  total_invested: number;
  total_gain: number;
  total_gain_percent: number;
  total_commission_loss: number;
  portfolio_health_score: number;
  funds_count: number;
  direct_funds_count: number;
  regular_funds_count: number;
  asset_allocation: {
    Equity: number;
    Debt: number;
    Gold: number;
  };
  funds: FundData[];
}

export interface UploadState {
  isLoading: boolean;
  error: string | null;
  data: ScanResponse | null;
}
