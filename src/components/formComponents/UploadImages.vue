<template>
  <div>
    <q-uploader
      class=""
      @added="addImage"
      @removed="removeImage"
      :color="color"
      :multiple="multiple"
      hide-upload-btn
      :label="label"
      style="width: 100%"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  multiple: {
    type: Boolean,
    default: () => false,
  },
  label: String,
  color: String,
});

const emits = defineEmits(["updateFotos"]);

const listMultipleFotos = ref([]);

const addImage = (event) => {
  if (props.multiple) {
    if (event.length == 1) {
      listMultipleFotos.value.push(event[0]);
    } else if (event.length > 1 && listMultipleFotos.value.length == 0) {
      listMultipleFotos.value = event;
    } else if (event.length > 1 && listMultipleFotos.value.length != 0) {
      event.forEach((value) => {
        listMultipleFotos.value.push(value);
      });
    }
    emits("updateFotos", listMultipleFotos.value);
  } else {
    emits("updateFotos", event[0]);
  }
};

const removeImage = (event) => {
  if (props.multiple) {
    let indexImage = listMultipleFotos.value.findIndex(
      ({ __key }) => __key == event[0].__key
    );
    console.log(indexImage);
    listMultipleFotos.value.splice(indexImage, 1);
    emits("updateFotos", listMultipleFotos.value);
  } else {
    emits("updateFotos", null);
  }
};
</script>

<style lang="scss" scoped></style>
