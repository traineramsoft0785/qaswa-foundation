import axios from "axios";
import userClient from "./userClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const publicClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getActiveQuizzes = () => publicClient.get("/api/quizzes/");

export const getQuiz = (id) => publicClient.get(`/api/quizzes/${id}`);

export const enrollInQuiz = (quizId) =>
  userClient.post("/api/enrollments/", { quiz_id: quizId });

export const getMyEnrollments = () => userClient.get("/api/enrollments/my");

export const downloadAdmitCard = (enrollmentId) =>
  userClient.get(`/api/enrollments/${enrollmentId}/admit-card`, {
    responseType: "blob",
  });
