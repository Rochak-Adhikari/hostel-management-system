import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "http://localhost:8080/api/v1/leave-requests";

export const getAllLeaveRequests = async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
};

export const getLeaveRequestsByStudent = async (studentId: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/student/${studentId}`);
    return response.data;
};

export const createLeaveRequest = async (data: any) => {
    const response = await axiosInstance.post(BASE_URL, data);
    return response.data;
};

export const updateLeaveRequest = async (id: string, data: any) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteLeaveRequest = async (id: string) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
};
