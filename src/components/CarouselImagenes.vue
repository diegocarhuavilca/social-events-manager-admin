<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <div class="q-pa-md">
        <q-carousel
          v-model="slide"
          swipeable
          animated
          control-color="white"
          navigation
          arrows
        >
          <q-carousel-slide
            :name="photo"
            class="column no-wrap flex-center"
            v-for="photo in listaPhotos"
            :key="photo"
          >
            <q-img :src="photo"></q-img>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
const props = defineProps({
  listaPhotos: Array,
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const slide = ref(props.listaPhotos[0]);
</script>

<style lang="scss" scoped></style>
