import client from "./client";

export const getActiveTrustees = () => client.get("/api/trustees");
export const getAllTrustees = () => client.get("/api/trustees/admin/all");
export const createTrustee = (data) => client.post("/api/trustees", data);
export const updateTrustee = (id, data) => client.put(`/api/trustees/${id}`, data);
export const deleteTrustee = (id) => client.delete(`/api/trustees/${id}`);
