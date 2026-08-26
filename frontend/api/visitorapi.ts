import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "http://localhost:8080/api/v1/visitors";

export const getAllVisitors = async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
};

export const getVisitorById = async (id: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const getVisitorsByStudent = async (studentId: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/student/${studentId}`);
    return response.data;
};

export const createVisitor = async (visitorData: any) => {
    const response = await axiosInstance.post(BASE_URL, visitorData);
    return response.data;
};

export const updateVisitor = async (id: string, visitorData: any) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, visitorData);
    return response.data;
};

export const deleteVisitor = async (id: string) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
};
