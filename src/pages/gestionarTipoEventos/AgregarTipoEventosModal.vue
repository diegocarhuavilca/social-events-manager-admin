<template>
  <q-dialog full-width ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Agregar Tipo Evento</div>
      </q-card-section>

      <q-form @submit="agregarTipoEvento" greedy>
        <q-card-section>
          <div class="row justify-between">
            <div class="col-6 q-pa-md">
              <q-input
                outlined
                v-model="informacionNuevoTipoEvento.name"
                label="Nombre Evento"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              />
            </div>
            <div class="col-6 q-pa-md">
              <UploadImages
                @updateFotos="handlerIcono"
                label="Icono del Tipo Evento"
                :color="colorsUploader.icon"
              />
            </div>
            <div class="col-6 q-pa-md">
              <UploadImages
                @updateFotos="handlerFotos"
                multiple
                label="Fotos del Tipo Evento"
                :color="colorsUploader.photos"
              />
            </div>
          </div>
          <div class="q-mt-md">
            <div class="text-h6">Descripcion</div>
            <div class="row">
              <div class="col">
                <div>
                  <q-input
                    v-model="informacionNuevoTipoEvento.description"
                    outlined
                    type="textarea"
                    autogrow
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'El campo es obligatorio',
                    ]"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="secondary" v-close-popup />
          <q-btn flat label="Agregar" color="primary" type="submit" />
        </q-card-actions>
      </q-form>

      <q-card-section> </q-card-section>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import UploadImages from "src/components/formComponents/UploadImages.vue";
import GestionarTipoEventosServices from "src/services/api/gestionarTipoEventosServices";
import { useDialogPluginComponent } from "quasar";

const $q = useQuasar();
const loading = ref(false);

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const informacionNuevoTipoEvento = reactive({
  name: null,
  description: null,
  icon: null,
  photos: null,
  videos: null,
});

const colorsUploader = reactive({
  icon: "primary",
  photos: "primary",
});

const handlerFotos = (event) => {
  colorsUploader.photos = "primary";
  informacionNuevoTipoEvento.photos = event;
};

const handlerIcono = (event) => {
  colorsUploader.icon = "primary";
  informacionNuevoTipoEvento.icon = event;
};

const agregarTipoEvento = async () => {
  if (!informacionNuevoTipoEvento.icon) {
    colorsUploader.icon = "negative";
    $q.notify({
      color: "negative",
      position: "top-right",
      message: "Es necesario la imagen del icono",
      icon: "error",
    });
  }
  if (
    !informacionNuevoTipoEvento.photos ||
    informacionNuevoTipoEvento.photos.length == 0
  ) {
    colorsUploader.photos = "negative";
    $q.notify({
      color: "negative",
      position: "top-right",
      message: "Es necesario las fotos del tipo Evento",
      icon: "error",
    });
    return;
  }
  loading.value = true;
  const formAgregarTipoEvento = new FormData();
  formAgregarTipoEvento.append("name", informacionNuevoTipoEvento.name);
  formAgregarTipoEvento.append(
    "description",
    informacionNuevoTipoEvento.description
  );
  formAgregarTipoEvento.append("icon", informacionNuevoTipoEvento.icon);
  informacionNuevoTipoEvento.photos.forEach((element) => {
    formAgregarTipoEvento.append("photos", element);
  });
  formAgregarTipoEvento.append("videos", informacionNuevoTipoEvento.icon);

  GestionarTipoEventosServices.addEventType(formAgregarTipoEvento)
    .then((res) => {
      $q.notify({
        color: "positive",
        position: "top-right",
        message: "Tipo de Evento Agregado",
        icon: "check",
      });
      onDialogOK(res.data);
    })
    .catch((err) => {
      console.log(err, formAgregarTipoEvento);
    })
    .finally(() => (loading.value = false));
};
</script>

<style lang="scss" scoped>
.q-uploader {
  width: 90%;
  margin: auto;
}
</style>
