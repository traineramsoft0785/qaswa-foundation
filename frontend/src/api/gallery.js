import client from "./client";

export const getGallery = (category) =>
  client.get("/api/gallery", { params: category ? { category } : {} });
export const getCategories = () => client.get("/api/gallery/categories");
export const createGalleryItem = (data) => client.post("/api/gallery", data);
export const updateGalleryItem = (id, data) => client.put(`/api/gallery/${id}`, data);
export const deleteGalleryItem = (id) => client.delete(`/api/gallery/${id}`);
