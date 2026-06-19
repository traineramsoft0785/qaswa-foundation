import client from "./client";

export const submitContact = (data) => client.post("/api/contacts", data);
export const getContacts = (unreadOnly) =>
  client.get("/api/contacts", { params: unreadOnly ? { unread_only: true } : {} });
export const getContact = (id) => client.get(`/api/contacts/${id}`);
export const markContactRead = (id) => client.put(`/api/contacts/${id}/read`);
export const deleteContact = (id) => client.delete(`/api/contacts/${id}`);
