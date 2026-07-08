import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/rooms";

export const getAllRooms = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};



export const getRoomById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const createRoom = async (roomData: any) => {
    const response = await axios.post(BASE_URL, roomData);
    return response.data;
}

export const updateRoom = async (id: string, roomData: any) => {
    const response = await axios.put(`${BASE_URL}/${id}`, roomData);
    return response.data;
}

export const deleteRoom = async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
}