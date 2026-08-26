import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "http://localhost:8080/api/v1/complaints";

export const getAllComplaints = async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
};

export const getComplaintById = async (id: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const getComplaintsByStudent = async (studentId: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/student/${studentId}`);
    return response.data;
};

export const createComplaint = async (complaintData: any) => {
    const response = await axiosInstance.post(BASE_URL, complaintData);
    return response.data;
};

export const updateComplaint = async (id: string, complaintData: any) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, complaintData);
    return response.data;
};

export const deleteComplaint = async (id: string) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
};
