import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "http://localhost:8080/api/v1/users";

// sabai student/user haru fetch garna ko lagi. role diyo vane tyo role ko matra aauxa
export const getAllStudents = async (role?: string) => {
  const response = await axiosInstance.get(BASE_URL, { params: role ? { role } : {} });
  return response.data;
};

// id ko basis ma euta student fetch garna ko lagi
export const getStudentById = async (id: string) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};

// student ko info update garna ko lagi
export const updateStudent = async (id: string, studentData: any) => {
  const response = await axiosInstance.put(`${BASE_URL}/${id}`, studentData);
  return response.data;
};

// student delete garna ko lagi
export const deleteStudent = async (id: string) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
  return response.data;
};