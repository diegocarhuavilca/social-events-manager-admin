<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">Agregar Extra Local</div>
      </q-card-section>
      <q-form greedy @submit="agregarExtra">
        <q-card-section>
          <q-input
            outlined
            v-model="formExtraLocal.name"
            label="Nombre"
            dense
            class="q-mb-md"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            outlined
            v-model="formExtraLocal.description"
            label="Descripcion"
            type="textarea"
            autogrow
            dense
            class="q-mb-md"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <div class="q-mb-md">
            <p class="text-weight-bold">Foto Principal</p>
            <UploadImages
              @updateFotos="handlerPrincial"
              label="Foto Principal"
              :color="colorsUploader.mainPhoto"
            />
          </div>
          <div>
            <p class="text-weight-bold">Foto Secundarias</p>
            <UploadImages
              @updateFotos="handlerSecundarios"
              multiple
              label="Fotos Secundarias"
              :color="colorsUploader.secondaryPhotos"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" type="submit">Agregar</q-btn>
        </q-card-actions>
      </q-form>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading> </q-card
  ></q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import UploadImages from "src/components/formComponents/UploadImages.vue";
import gestionarLocales from "src/services/api/gestionarLocales";
import { reactive, ref, defineProps } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const props = defineProps({
  informacionViaje: Object,
});

const loading = ref(false);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const formExtraLocal = reactive({
  name: null,
  description: null,
  secondaryPhotos: null,
  mainPhoto: null,
});

const colorsUploader = reactive({
  mainPhoto: "primary",
  secondaryPhotos: "primary",
});

function handlerSecundarios($event) {
  colorsUploader.secondaryPhotos = "primary";
  formExtraLocal.secondaryPhotos = $event;
}

function handlerPrincial($event) {
  colorsUploader.mainPhoto = "primary";
  formExtraLocal.mainPhoto = $event;
}

function agregarExtra() {
  if (!formExtraLocal.mainPhoto) {
    colorsUploader.mainPhoto = "negative";
    $q.notify({
      color: "negative",
      position: "top-right",
      message: "Es necesario la imagen del icono",
      icon: "error",
    });
  }
  if (
    !formExtraLocal.secondaryPhotos ||
    formExtraLocal.secondaryPhotos.length == 0
  ) {
    colorsUploader.secondaryPhotos = "negative";
    $q.notify({
      color: "negative",
      position: "top-right",
      message: "Es necesario las fotos del tipo Evento",
      icon: "error",
    });
    return;
  }
  loading.value = true;
  const formAgregarExtraLocal = new FormData();
  formAgregarExtraLocal.append("name", formExtraLocal.name);
  formAgregarExtraLocal.append("description", formExtraLocal.description);
  formAgregarExtraLocal.append("mainPhoto", formExtraLocal.mainPhoto);
  formExtraLocal.secondaryPhotos.forEach((element) => {
    formAgregarExtraLocal.append("secondaryPhotos", element);
  });

  gestionarLocales
    .createExtra(props.informacionViaje.id, formAgregarExtraLocal)
    .then((res) => {
      $q.notify({
        color: "positive",
        position: "top-right",
        message: "Extra Local Agregado",
        icon: "check",
      });
      onDialogOK(res.data);
    });
}
</script>
