import { api } from "../../boot/axios";

const baseURL = "/party-room";

const gestionarLocales = {
  getAll: () => {
    return api.get(baseURL);
  },
  create: (informacionLocal) => {
    return api.post(baseURL, informacionLocal);
  },
  deleteById: (idLocal) => {
    return api.delete(baseURL.concat(`/${idLocal}`));
  },
  createExtra: (idLocal, informacionExtra) => {
    return api.post(baseURL.concat("/", idLocal, "/extras"), informacionExtra);
  },
};

export default gestionarLocales;
