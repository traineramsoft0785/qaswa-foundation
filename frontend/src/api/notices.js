import client from "./client";

export const getActiveNotices = () => client.get("/api/notices");
export const getAllNotices = () => client.get("/api/notices/admin/all");
export const getNotice = (id) => client.get(`/api/notices/${id}`);
export const createNotice = (data) => client.post("/api/notices", data);
export const updateNotice = (id, data) => client.put(`/api/notices/${id}`, data);
export const deleteNotice = (id) => client.delete(`/api/notices/${id}`);
