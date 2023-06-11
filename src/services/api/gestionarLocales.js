import { api } from "../../boot/axios";

const baseURL = "/party-room";

const gestionarLocales = {
  getAll: () => {
    return api.get(baseURL);
  },
  deleteById: (idLocal) => {
    return api.delete(baseURL.concat(`/${idLocal}`));
  },
};

export default gestionarLocales;
