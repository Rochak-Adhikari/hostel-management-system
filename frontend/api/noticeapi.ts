import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "http://localhost:8080/api/v1/notices";

export const getAllNotices = async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
};

export const getNoticeById = async (id: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const createNotice = async (noticeData: any) => {
    const response = await axiosInstance.post(BASE_URL, noticeData);
    return response.data;
};

export const updateNotice = async (id: string, noticeData: any) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, noticeData);
    return response.data;
};

export const deleteNotice = async (id: string) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
};
