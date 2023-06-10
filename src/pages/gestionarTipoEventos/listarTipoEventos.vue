<template>
  <div>
    <div class="q-pa-md">
      <div class="row justify-end q-my-md">
        <q-btn
          label="Agregar Tipo de Evento"
          color="primary"
          @click="openAgregarEvento()"
        />
      </div>

      <q-table
        title="Tipo de Eventos"
        :rows="listaTipoEventos"
        :columns="columns"
        row-key="name"
        :loading="listaTipoEventos.length == 0"
        rows-per-page-label="10"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div>
              <q-btn
                dense
                round
                color="primary"
                icon="visibility"
                class="q-mr-sm"
                @click="openVisualizarDetalle(props)"
              />
              <q-btn
                dense
                round
                color="secondary"
                icon="edit"
                class="q-mr-sm"
                @click="openActualizarEvento(props)"
              />
              <q-btn
                dense
                round
                color="accent"
                icon="delete"
                @click="deleteEventType(props.row)"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-icon="props">
          <q-td :props="props">
            <img
              :src="props.row.icon"
              alt=""
              width="50"
              height="50"
              v-if="props.row.icon"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-photos="props">
          <q-td :props="props">
            <q-icon
              name="done"
              size="md"
              color="primary"
              v-if="props.row.photos && props.row.photos.length > 0"
            />
            <q-icon name="error" size="md" color="accent" v-else />
          </q-td>
        </template>
        <template v-slot:body-cell-videos="props">
          <q-td :props="props">
            <q-icon
              name="done"
              size="md"
              color="primary"
              v-if="props.row.videos && props.row.videos.length > 0"
            />
            <q-icon name="error" size="md" color="accent" v-else />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>

  <q-dialog v-model="actualizarEvento" full-width>
    <q-card>
      <q-card-section>
        <div class="text-h6">Actualizar Evento</div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-between">
          <div class="col-5">
            <q-input
              outlined
              v-model="informacionEvento.name"
              label="Nombre Evento"
            />
            <div class="q-mt-md">
              <div class="text-h6">Descripcion</div>
              <div class="row">
                <div class="col">
                  <div>
                    <q-input
                      v-model="informacionEvento.description"
                      outlined
                      type="textarea"
                      autogrow
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="text-h5">Icono</div>
            <div
              v-if="informacionEvento.icon"
              class="text-center relative-position"
            >
              <q-btn
                icon="close"
                round
                class="absolute-top-right q-mr-lg"
                color="negative"
              />
              <q-img :src="informacionEvento.icon" :ratio="1" width="50%" />
            </div>

            <q-uploader
              v-else
              hide-upload-btn
              label="Icono del tipo de Evento"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Actualizar"
            color="primary"
            v-close-popup
            @click="actualizarEventoData(informacionEvento)"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import GestionarTipoEventosServices from "../../services/api/gestionarTipoEventosServices";
import ModalVerEventos from "./modalVerEventos.vue";
import AgregarTipoEventoModal from "./AgregarTipoEventosModal.vue";
import { useQuasar } from "quasar";
import { ref, reactive } from "vue";

const listaTipoEventos = ref([]);

const visualizarDetalle = ref(false);
const informacionEvento = ref({});

const actualizarEvento = ref(false);

const nuevoTipoEvento = reactive({
  name: null,
  description: null,
});

const addFile = async (event) => {
  nuevoTipoEvento.icon = event[0];
  console.log(event);
};

const columns = [
  {
    name: "id",
    required: true,
    label: "Id",
    align: "left",
    field: "id",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre",
    field: "name",
    sortable: true,
  },
  {
    name: "icon",
    align: "center",
    label: "Icono",
    field: "icon",
  },
  {
    name: "photos",
    align: "center",
    label: "Tiene Fotos",
    field: "photos",
  },
  {
    name: "videos",
    align: "center",
    label: "Tiene Videos",
    field: "videos",
  },
  {
    name: "actions",
    align: "center",
    label: "Acciones",
    field: "actions",
  },
];

const getData = () => {
  GestionarTipoEventosServices.getAll().then(
    (res) => (listaTipoEventos.value = res.data)
  );
};

const deleteEventType = (idEvent) => {
  $q.dialog({
    title: "Eliminar Evento",
    message: `Desea eliminar el tipo de evento ${idEvent.name}?`,
    cancel: true,
    color: "accent",
  })
    .onOk(() => {
      GestionarTipoEventosServices.deleteEventType(idEvent.id).then((res) => {
        const index = listaTipoEventos.value.findIndex(
          ({ id }) => res.data.id == id
        );
        listaTipoEventos.value.splice(index, 1);
      });
    })
    .onCancel(() => {
      // console.log('Cancel')
    });
};

const slide = ref("null");

const $q = useQuasar();

const openVisualizarDetalle = (propEvento) => {
  informacionEvento.value = { ...propEvento.row };
  $q.dialog({
    component: ModalVerEventos,
    componentProps: {
      informacionEvento: informacionEvento.value,
      primeraImagen: informacionEvento.value.photos[0],
    },
  });
};

const openAgregarEvento = () => {
  $q.dialog({
    component: AgregarTipoEventoModal,
  }).onOk((eventTypeData) => {
    listaTipoEventos.value.push(eventTypeData);
  });
};

const openActualizarEvento = (propEvento) => {
  actualizarEvento.value = true;
  informacionEvento.value = { ...propEvento.row };
  fetch("https://i.imgur.com/gDJ1JhL.jpeg")
    .then((response) => response.blob())
    .then((blob) => {
      informacionEvento.value.iconBlob = blob;
      console.log(blob);
      // const url = URL.createObjectURL(blob);
      // console.log(URL.createObjectURL(informacionEvento.value.icon), blob);
    });
};

const actualizarEventoData = (informacionEvento) => {
  console.log(informacionEvento);
};

const agregarTipoEvento = (informacionEvento) => {
  console.log(informacionEvento);
  const formAgregarTipoEvento = new FormData();
  formAgregarTipoEvento.append("name", informacionEvento.name);
  formAgregarTipoEvento.append("description", informacionEvento.description);
  formAgregarTipoEvento.append("icon", informacionEvento.icon);
  formAgregarTipoEvento.append("icon", informacionEvento.icon);
  formAgregarTipoEvento.append("photos", informacionEvento.icon);
  formAgregarTipoEvento.append("videos", informacionEvento.icon);

  console.log(formAgregarTipoEvento);
  GestionarTipoEventosServices.addEventType(formAgregarTipoEvento).then(
    (res) => {
      listaTipoEventos.value.push(res.data);
    }
  );
};

getData();
</script>

<style lang="scss" scoped></style>
