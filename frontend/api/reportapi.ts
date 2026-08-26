import { axiosInstance } from "@/lib/axiosInstance";

// Report summary fetch garne backend function
export const getReportSummary = async () => {
  const response = await axiosInstance.get("http://localhost:8080/api/v1/reports/summary");
  return response.data;
};
