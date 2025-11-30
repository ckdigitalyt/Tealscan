"use client";

import { ScanResponse } from "@/types";
import DashboardTabs from "./DashboardTabs";

interface DashboardProps {
  data: ScanResponse;
}

export default function Dashboard({ data }: DashboardProps) {
  return <DashboardTabs data={data} />;
}
