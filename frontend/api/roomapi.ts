import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "http://localhost:8080/api/v1/rooms";

export const getAllRooms = async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
};

export const getRoomById = async (id: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const createRoom = async (roomData: any) => {
    const response = await axiosInstance.post(BASE_URL, roomData);
    return response.data;
}

export const updateRoom = async (id: string, roomData: any) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, roomData);
    return response.data;
}

export const deleteRoom = async (id: string) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
}