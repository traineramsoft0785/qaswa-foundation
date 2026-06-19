import client from "./client";

export const submitDonation = (data) => client.post("/api/donations", data);
export const getDonations = (status) =>
  client.get("/api/donations", { params: status ? { status } : {} });
export const getDonation = (id) => client.get(`/api/donations/${id}`);
export const updateDonationStatus = (id, status) =>
  client.put(`/api/donations/${id}/status`, { status });
