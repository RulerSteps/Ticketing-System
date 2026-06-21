import axiosClient from "./axiosClient";

const userService = {
  getProfil: () => axiosClient.get("/profil"),
  modifierProfil: (data) => axiosClient.put("/profil", data),
  changerMotDePasse: (data) => axiosClient.put("/profil/mot-de-passe", data),
};

export default userService;