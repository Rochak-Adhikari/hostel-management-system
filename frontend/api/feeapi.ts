import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "http://localhost:8080/api/v1/fees";

// Sabai fee records fetch garna ko lagi (Admin ko lagi)
export const getAllFees = async () => {
  const response = await axiosInstance.get(BASE_URL);
  return response.data;
};

// Student ko id ko basis ma tesko sabai fee records fetch garna ko lagi
export const getFeesByStudent = async (studentId: string) => {
  const response = await axiosInstance.get(`${BASE_URL}/student/${studentId}`);
  return response.data;
};

// Single fee record fetch garna ko lagi
export const getFeeById = async (id: string) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};

// Naya fee record create garna ko lagi (Admin ko lagi)
export const createFee = async (feeData: any) => {
  const response = await axiosInstance.post(BASE_URL, feeData);
  return response.data;
};

// Fee status athawa payment detail update garna ko lagi (Admin ko lagi)
export const updateFee = async (id: string, feeData: any) => {
  const response = await axiosInstance.put(`${BASE_URL}/${id}`, feeData);
  return response.data;
};

// Fee record delete garna ko lagi (Admin ko lagi)
export const deleteFee = async (id: string) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
  return response.data;
};
