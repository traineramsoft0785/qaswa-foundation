import client from "./client";

export const getAllQuizzes = () => client.get("/api/quizzes/admin/all");

export const createQuiz = (data) => client.post("/api/quizzes/", data);

export const updateQuiz = (id, data) => client.put(`/api/quizzes/${id}`, data);

export const deleteQuiz = (id) => client.delete(`/api/quizzes/${id}`);

export const getQuizEnrollments = (quizId) =>
  client.get(`/api/quizzes/${quizId}/enrollments`);
