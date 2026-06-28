import client from "./client";

export const getActiveAdvisors = () => client.get("/api/advisors");
export const getAllAdvisors = () => client.get("/api/advisors/admin/all");
export const createAdvisor = (data) => client.post("/api/advisors", data);
export const updateAdvisor = (id, data) => client.put(`/api/advisors/${id}`, data);
export const deleteAdvisor = (id) => client.delete(`/api/advisors/${id}`);
