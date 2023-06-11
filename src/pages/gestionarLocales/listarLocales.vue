<template>
  <div>
    <div class="q-pa-md">
      <div class="row justify-end q-my-md">
        <q-btn
          label="Agregar Local"
          color="primary"
          @click="openAgregarLocal()"
        />
      </div>

      <q-table
        title="Locales"
        :rows="listaLocales"
        :columns="columns"
        row-key="name"
        :loading="listaLocales.length == 0"
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
                @click="openDetalleLocales(props)"
              />
              <q-btn
                dense
                round
                color="secondary"
                icon="edit"
                class="q-mr-sm"
              />
              <q-btn
                dense
                round
                color="accent"
                icon="delete"
                @click="deleteLocal(props.row)"
              />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-photos="props">
          <q-td :props="props">
            <q-icon
              name="done"
              size="md"
              color="primary"
              v-if="
                props.row.secondaryPhotos &&
                props.row.secondaryPhotos.length > 0
              "
            />
            <q-icon name="error" size="md" color="accent" v-else />
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import gestionarLocalesService from "src/services/api/gestionarLocales";
import agregarLocalModal from "./agregarLocalModal.vue";
import verModalLocal from "pages/gestionarLocales/verLocalModal";
import { useQuasar } from "quasar";
import { ref } from "vue";

const listaLocales = ref([]);
const $q = useQuasar();

const getData = () => {
  gestionarLocalesService
    .getAll()
    .then((res) => (listaLocales.value = res.data));
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
    name: "distrito",
    align: "center",
    label: "Distrito",
    field: "district",
    sortable: true,
  },
  {
    name: "photos",
    align: "center",
    label: "Tiene Fotos",
    field: "photos",
  },
  {
    name: "actions",
    align: "center",
    label: "Acciones",
    field: "actions",
  },
];

getData();

function openDetalleLocales(informacionLocal) {
  $q.dialog({
    component: verModalLocal,
    componentProps: {
      informacionLocal: informacionLocal.row,
      primeraImagen: informacionLocal.row.secondaryPhotos
        ? informacionLocal.row.secondaryPhotos[0]
        : [],
    },
  });
}

function deleteLocal(informacionLocal) {
  $q.dialog({
    title: "Eliminar Local",
    message: `Desea eliminar local ${informacionLocal.name}?`,
    cancel: true,
    color: "accent",
  })
    .onOk(() => {
      gestionarLocalesService.deleteById(informacionLocal.id).then((res) => {
        const index = listaLocales.value.findIndex(
          ({ id }) => res.data.id == id
        );
        listaLocales.value.splice(index, 1);
      });
    })
    .onCancel(() => {
      // console.log('Cancel')
    });
}

function openAgregarLocal() {
  $q.dialog({
    component: agregarLocalModal,
  }).onOk((eventTypeData) => {
    listaLocales.value.push(eventTypeData);
  });
}
</script>

<style lang="scss" scoped></style>
