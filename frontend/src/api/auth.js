import client from "./client";

export const login = (email, password) =>
  client.post("/api/auth/login", { email, password });

export const getMe = () => client.get("/api/auth/me");

export const updatePassword = (current_password, new_password, confirm_password) =>
  client.put("/api/auth/change-password", {
    current_password,
    new_password,
    confirm_password,
  });
