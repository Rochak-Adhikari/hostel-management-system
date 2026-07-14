import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/allocations";

export const getAllAllocations = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

export const getAllocationByStudent = async (studentId: string) => {
  const response = await axios.get(`${BASE_URL}/student/${studentId}`);
  return response.data;
};

export const getAllocationById = async (id: string) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const createAllocation = async (allocationData: any) => {
    const response = await axios.post(BASE_URL, allocationData);
    return response.data;
}

export const updateAllocation = async (id: string, allocationData: any) => {
    const response = await axios.put(`${BASE_URL}/${id}`, allocationData);
    return response.data;
}

export const deleteAllocation = async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
}

export const getAvailableBeds = async (roomId: string) => {
    const response = await axios.get(`${BASE_URL}/available-beds/${roomId}`);
    return response.data;
}