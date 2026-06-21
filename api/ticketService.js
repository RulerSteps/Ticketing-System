import axiosClient from "./axiosClient";

const ticketService = {
  creer: (formData) =>
    axiosClient.post("/tickets", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  lister: (filtres = {}) => axiosClient.get("/tickets", { params: filtres }),

  detail: (id) => axiosClient.get(`/tickets/${id}`),

  modifier: (id, data) => axiosClient.put(`/tickets/${id}`, data),

  listerCommentaires: (id) => axiosClient.get(`/tickets/${id}/commentaires`),
  ajouterCommentaire: (id, contenu) =>
    axiosClient.post(`/tickets/${id}/commentaires`, { contenu }),

  historique: (id) => axiosClient.get(`/tickets/${id}/historique`),
};

export default ticketService;