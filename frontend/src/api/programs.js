import client from "./client";

export const getActivePrograms = () => client.get("/api/programs");
export const getAllPrograms = () => client.get("/api/programs/admin/all");
export const getProgram = (id) => client.get(`/api/programs/${id}`);
export const createProgram = (data) => client.post("/api/programs", data);
export const updateProgram = (id, data) => client.put(`/api/programs/${id}`, data);
export const deleteProgram = (id) => client.delete(`/api/programs/${id}`);
