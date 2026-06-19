import client from "./client";

export const submitQuizRegistration = (data) =>
  client.post("/api/quiz-registrations", data);
