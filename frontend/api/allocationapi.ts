import axiosInstance from "@/lib/axiosInstance";

const BASE_URL = "http://localhost:8080/api/v1/allocations";

export const getAllAllocations = async () => {
    const response = await axiosInstance.get(BASE_URL);
    return response.data;
};

export const getAllocationByStudent = async (studentId: string) => {
  const response = await axiosInstance.get(`${BASE_URL}/student/${studentId}`);
  return response.data;
};

export const getAllocationById = async (id: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
}

export const createAllocation = async (allocationData: any) => {
    const response = await axiosInstance.post(BASE_URL, allocationData);
    return response.data;
}

export const updateAllocation = async (id: string, allocationData: any) => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, allocationData);
    return response.data;
}

export const deleteAllocation = async (id: string) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
}

export const getAvailableBeds = async (roomId: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/available-beds/${roomId}`);
    return response.data;
}

export const getAllocationsByRoom = async (roomId: string) => {
    const response = await axiosInstance.get(`${BASE_URL}/room/${roomId}`);
    return response.data;
}