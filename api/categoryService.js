import axiosClient from "./axiosClient";

const categoryService = {
  lister: () => axiosClient.get("/categories"),
};

export default categoryService;