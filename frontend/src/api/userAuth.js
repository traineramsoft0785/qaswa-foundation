import userClient from "./userClient";

export const userRegister = (data) =>
  userClient.post("/api/user/auth/register", data);

export const userLogin = (email, password) =>
  userClient.post("/api/user/auth/login", { email, password });

export const getUserMe = () => userClient.get("/api/user/auth/me");

export const updateUserProfile = (data) =>
  userClient.put("/api/user/auth/profile", data);

export const changeUserPassword = (data) =>
  userClient.put("/api/user/auth/change-password", data);
