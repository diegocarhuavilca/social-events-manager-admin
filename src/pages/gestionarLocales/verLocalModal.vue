<template>
  <q-dialog full-width>
    <q-card>
      <q-card-section>
        <div class="row justify-between">
          <div class="text-h6">Informacion del local</div>
          <div>
            <q-toggle
              v-model="activo"
              color="green"
              :label="activo ? 'Local Activo' : 'Local Inactivo'"
              left-label
            />
            <q-btn icon="close" flat color="primary" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section style="max-height: 80vh" class="scroll" v-if="infoLocal">
        <q-form>
          <div class="row justify-end">
            <q-btn
              flat
              icon="edit"
              color="primary"
              v-if="!modificarActivo"
              @click="modificarActivo = true"
            ></q-btn>
            <q-btn
              flat
              icon="check"
              color="positive"
              v-else
              @click="modificarActivo = true"
            ></q-btn>
          </div>
          <div class="row">
            <div class="col q-pr-md">
              <q-input
                filled
                v-model="infoLocal.name"
                label="Nombre del local"
                :disable="!modificarActivo"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'El campo es obligatorio',
                ]"
              />
            </div>
            <div class="col q-pr-md">
              <q-input
                filled
                v-model="infoLocal.address"
                :disable="!modificarActivo"
                label="Direccion del local"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'El campo es obligatorio',
                ]"
              />
            </div>
            <div class="col">
              <q-input
                filled
                v-model="infoLocal.district"
                :disable="!modificarActivo"
                label="Distrito del local"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'El campo es obligatorio',
                ]"
              />
            </div>
          </div>

          <div class="row">
            <div class="col"></div>
          </div>

          <q-input
            v-model="infoLocal.description"
            filled
            label="Descripcion del local"
            :disable="!modificarActivo"
            type="textarea"
            autogrow
            :rules="[
              (val) => (val && val.length > 0) || 'El campo es obligatorio',
            ]"
          />
          <div class="row">
            <div class="col q-pr-md"></div>
            <div class="col"></div>
          </div>
          <div class="row">
            <div class="col q-pr-md">
              <p class="text-h6" style="font-size: 14px">Imagen Principal</p>
              <div class="text-center">
                <q-img
                  :src="infoLocal.mainPhoto"
                  alt=""
                  fit="contain"
                  width="70%"
                />
              </div>
            </div>
            <div class="col">
              <template
                v-if="
                  infoLocal.secondaryPhotos &&
                  infoLocal.secondaryPhotos.length > 0
                "
              >
                <p class="text-h6" style="font-size: 14px">
                  Imagenes Secundarias
                </p>
                <q-carousel
                  v-model="slide"
                  v-model:fullscreen="fullscreen"
                  transition-prev="scale"
                  transition-next="scale"
                  swipeable
                  animated
                  control-color="primary"
                  navigation
                  padding
                >
                  <q-carousel-slide
                    :name="photo"
                    class="column no-wrap flex-center"
                    v-for="photo in informacionLocal.secondaryPhotos"
                    :key="photo"
                  >
                    <q-img :src="photo" alt="" fit="contain" width="70%" />
                  </q-carousel-slide>
                  <template v-slot:control>
                    <q-carousel-control
                      position="bottom-right"
                      :offset="[18, 18]"
                    >
                      <q-btn
                        push
                        round
                        dense
                        color="white"
                        text-color="primary"
                        :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                        @click="fullscreen = !fullscreen"
                      />
                    </q-carousel-control>
                  </template>
                </q-carousel>
              </template>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-table
                flat
                bordered
                title="Extras"
                :rows="infoLocal.extras"
                :columns="columns"
                row-key="name"
              >
                <template v-slot:top>
                  <div class="text-h6">Extras del Local</div>
                  <q-space />
                  <q-btn
                    color="primary"
                    :disable="loading"
                    label="Agregar Extra"
                    @click="agregarExtra"
                  />
                </template>
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
                        color="accent"
                        icon="delete"
                        @click="deleteEventType(props.row)"
                      />
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-mainPhoto="props">
                  <q-td :props="props">
                    <q-icon
                      name="done"
                      size="md"
                      color="primary"
                      v-if="props.row.mainPhoto"
                    />
                    <q-icon name="error" size="md" color="accent" v-else />
                  </q-td>
                </template>
                <template v-slot:body-cell-secondaryPhotos="props">
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
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Cancelar" outline color="primary" />
        <q-btn
          label="Modificar"
          color="primary"
          v-if="!modificarActivo"
          @click="modificarActivo = true"
        />
        <q-btn
          label="Confimar"
          color="primary"
          v-if="modificarActivo"
          @click="modificarActivo = true"
        />
      </q-card-actions>

      <!--

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>

      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading> -->
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, computed, ref, reactive } from "vue";
import { useQuasar } from "quasar";
import agregarExtraLocal from "./agregarExtraLocal.vue";

const $q = useQuasar();
const props = defineProps({
  informacionLocal: Object,
  primeraImagen: String,
});

const slide = ref(props.primeraImagen);

const activo = ref(false);

const modificarActivo = ref(false);

const infoLocal = reactive({ ...props.informacionLocal });

const loading = computed(() => !props.informacionLocal);
const fullscreen = ref(false);

const columns = [
  {
    name: "name",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "description",
    label: "Descripcion",
    field: "description",
    align: "left",
  },
  {
    name: "mainPhoto",
    label: "Foto Principal",
    field: "mainPhoto",
    align: "center",
  },
  {
    name: "secondaryPhotos",
    label: "Fotos Secundarias",
    field: "secondaryPhotos",
    align: "center",
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
    align: "center",
  },
];

function getSelectedString() {
  return selected.value.length === 0
    ? ""
    : `${selected.value.length} record${
        selected.value.length > 1 ? "s" : ""
      } selected of ${rows.length}`;
}

function agregarExtra() {
  console.log(props.informacionLocal);
  $q.dialog({
    component: agregarExtraLocal,
    componentProps: {
      informacionViaje: props.informacionLocal,
    },
  }).onOk((extraData) => {
    infoLocal.extras.push(extraData);
  });
}
</script>

<style lang="scss" scoped></style>
