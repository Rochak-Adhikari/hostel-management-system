import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/room-change-requests";

export const getAllRoomChangeRequests = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

export const getRoomChangeRequestsByStudent = async (studentId: string) => {
    const response = await axios.get(`${BASE_URL}/student/${studentId}`);
    return response.data;
};

export const createRoomChangeRequest = async (data: any) => {
    const response = await axios.post(BASE_URL, data);
    return response.data;
};

export const updateRoomChangeRequest = async (id: string, data: any) => {
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteRoomChangeRequest = async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
};
