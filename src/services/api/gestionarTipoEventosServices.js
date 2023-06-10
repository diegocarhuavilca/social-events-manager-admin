import { api } from "../../boot/axios";

const baseURL = "/social-event-type";

const gestionarTipoEventos = {
  getAll: () => {
    return api.get(baseURL);
  },
  deleteEventType: (idEventType) => {
    return api.delete(baseURL + "/" + idEventType);
  },
  addEventType: (informacionEvento) => {
    return api.post(baseURL, informacionEvento);
  },
};

export default gestionarTipoEventos;
