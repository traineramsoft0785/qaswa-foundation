import client from "./client";

export const uploadFile = (bucket, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return client.post(`/api/upload/image/${bucket}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteFile = (bucket, filename) =>
  client.delete(`/api/upload/image/${bucket}/${filename}`);
