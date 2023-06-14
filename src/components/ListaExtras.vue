<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-pa-md">
      <div class="text-h5">Seleccion de extras</div>
      <q-card-section>
        <q-list>
          <q-item v-for="extra in listaExtrasAux" :key="extra">
            <q-item-section side top>
              <q-checkbox v-model="extra.selected" />
            </q-item-section>
            <q-item-section avatar>
              <q-avatar>
                <img :src="extra.mainPhoto" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1"> {{ extra.name }}</q-item-label>
              <q-item-label caption>
                {{ extra.description }}
              </q-item-label>
            </q-item-section>
            <q-item-section v-if="extra.secondaryPhotos">
              <q-btn
                label="ver fotos"
                @click="abrirPhotos(extra.secondaryPhotos)"
              ></q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Aceptar" @click="confirmDialog()"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import CarouselImagenes from "./CarouselImagenes.vue";
import { useQuasar } from "quasar";
import { ref } from "vue";

const $q = useQuasar();

const props = defineProps({
  listaExtras: Array,
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const listaExtrasAux = ref(
  [...props.listaExtras].map((v) => ({ ...v, selected: false }))
);

const confirmDialog = () => {
  const lista = listaExtrasAux.value
    .filter(({ selected }) => selected)
    .map(({ id }) => id);
  onDialogOK(lista);
};

function abrirPhotos(listaFoto) {
  $q.dialog({
    component: CarouselImagenes,
    componentProps: {
      listaPhotos: listaFoto,
    },
  });
}
</script>

<style lang="scss" scoped></style>
