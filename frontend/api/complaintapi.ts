import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/complaints";

export const getAllComplaints = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

export const getComplaintById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const getComplaintsByStudent = async (studentId: string) => {
    const response = await axios.get(`${BASE_URL}/student/${studentId}`);
    return response.data;
};

export const createComplaint = async (complaintData: any) => {
    const response = await axios.post(BASE_URL, complaintData);
    return response.data;
};

export const updateComplaint = async (id: string, complaintData: any) => {
    const response = await axios.put(`${BASE_URL}/${id}`, complaintData);
    return response.data;
};

export const deleteComplaint = async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
};
