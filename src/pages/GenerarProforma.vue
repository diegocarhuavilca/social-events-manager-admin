<template>
  <div class="q-pa-md">
    {{ proforma }}
    <q-stepper v-model="step" ref="stepper" contracted color="primary" animated>
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
      >
        <div class="row">
          <div class="col-4">
            <q-input
              outlined
              label="Nombre del evento"
              v-model="proforma.nombre"
            />
          </div>
          <div class="col-4">
            <q-input
              outlined
              label="Cantidad de personas"
              type="number"
              v-model="proforma.cantidadPersonas"
            />
          </div>
          <div class="col-4">
            <q-input
              v-model="proforma.fecha"
              filled
              mask="date"
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="proforma.fecha">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div class="text-h5">Selecciona el tipo de Evento</div>
        <div class="row">
          <div
            class="col-3 q-pa-md"
            v-for="tipoEvento in listaTipoEvento"
            :key="tipoEvento.id"
          >
            <q-card>
              <div
                v-ripple
                class="my-box cursor-pointer q-hoverable"
                @click="seleccionarEvento(tipoEvento.id)"
              >
                <q-icon
                  name="check"
                  size="lg"
                  color="primary"
                  class="absolute-top-right q-ma-sm z-top"
                  v-if="tipoEvento.selected"
                ></q-icon>

                <q-img
                  :src="tipoEvento.icon"
                  ratio="1"
                  height="300px"
                  fit="contain"
                />

                <q-card-section>
                  <div class="text-h6">{{ tipoEvento.name }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  {{ tipoEvento.description }}
                </q-card-section>
              </div>

              <q-card-actions align="right" v-if="tipoEvento.photos.length > 0">
                <q-btn
                  flat
                  outline
                  color="primary"
                  label="Ver fotos"
                  @click="abrirPhotos(tipoEvento.photos)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div class="text-h5">Selecciona el local</div>
        <div class="row">
          <div
            class="col-3 q-pa-md"
            v-for="tipoEvento in listaLocales"
            :key="tipoEvento.id"
          >
            <q-card>
              <div
                v-ripple
                class="my-box cursor-pointer q-hoverable"
                @click="seleccionarLocal(tipoEvento.id)"
              >
                <q-icon
                  name="check"
                  size="lg"
                  color="primary"
                  class="absolute-top-right q-ma-sm z-top"
                  v-if="tipoEvento.selected"
                ></q-icon>
                <q-img
                  :src="tipoEvento.mainPhoto"
                  ratio="1"
                  height="300px"
                  fit="contain"
                />

                <q-card-section>
                  <div class="text-h6">{{ tipoEvento.name }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  {{ tipoEvento.description }}
                </q-card-section>
              </div>

              <q-card-actions align="right" v-if="tipoEvento.extras.length > 0">
                <q-btn
                  flat
                  outline
                  color="primary"
                  label="Extras"
                  @click="vetExtras(tipoEvento.extras)"
                />
                <q-btn
                  flat
                  outline
                  color="primary"
                  label="Ver fotos"
                  @click="abrirPhotos(tipoEvento.secondaryPhotos)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-step>

      <q-step :name="3" title="Create an ad" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="$refs.stepper.next()"
            color="primary"
            :label="step === 3 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import gestionarTipoEventos from "src/services/api/gestionarTipoEventosServices";
import gestionarLocales from "src/services/api/gestionarLocales";
import CarouselImagenes from "src/components/CarouselImagenes.vue";
import ListaExtras from "src/components/ListaExtras.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

const listaTipoEvento = ref([]);
const listaLocales = ref([]);

const proforma = reactive({
  nombre: null,
  cantidadPersonas: null,
  fecha: new Date(),
  tipoEvento: null,
  tipoLocal: null,
  extrasLocal: null,
});

gestionarTipoEventos.getAll().then((res) => {
  let aux = [];
  res.data.forEach((value) => {
    aux.push({ ...value, selected: false });
  });
  listaTipoEvento.value = aux;
});

gestionarLocales.getAll().then((res) => {
  let aux = [];
  res.data.forEach((value) => {
    aux.push({ ...value, selected: false });
  });
  listaLocales.value = aux;
});

function abrirPhotos(listaFoto) {
  $q.dialog({
    component: CarouselImagenes,
    componentProps: {
      listaPhotos: listaFoto,
    },
  });
}

const vetExtras = (listaExtras) => {
  $q.dialog({
    component: ListaExtras,
    componentProps: {
      listaExtras: listaExtras,
    },
  }).onOk((event) => {
    proforma.extrasLocal = event;
  });
};

const seleccionarEvento = (idEvento) => {
  listaTipoEvento.value.map((value) => {
    value.selected = false;
  });
  const indexEvento = listaTipoEvento.value.findIndex(
    ({ id }) => id == idEvento
  );
  proforma.tipoEvento = listaTipoEvento.value[indexEvento].id;
  listaTipoEvento.value[indexEvento].selected = true;
};

const seleccionarLocal = (idLocal) => {
  listaLocales.value.map((value) => {
    value.selected = false;
  });
  const indexEvento = listaLocales.value.findIndex(({ id }) => id == idLocal);
  proforma.tipoLocal = listaLocales.value[indexEvento].id;
  listaLocales.value[indexEvento].selected = true;
};

const step = ref(1);
</script>

<style lang="scss" scoped></style>
