import client from "./client";

export const getPageContent = (page) => client.get(`/api/site-content/${page}`);
export const updateSectionContent = (page, sectionKey, data) =>
  client.put(`/api/site-content/${page}/${sectionKey}`, { data });
