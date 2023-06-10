<template>
  <q-dialog full-width>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ informacionEvento.name }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row justify-around">
          <div class="col-8">
            {{ informacionEvento.description }}
          </div>
          <div class="col-2">
            <img :src="informacionEvento.icon" alt="" width="300" />
          </div>
        </div>
      </q-card-section>

      <q-card-section
        v-if="informacionEvento.photos && informacionEvento.photos.length > 0"
      >
        <div class="text-h6">Fotografias</div>
        <div class="q-pa-md">
          <div class="row">
            <div class="col-6">
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
                height="300px"
              >
                <q-carousel-slide
                  :name="photo"
                  class="column no-wrap flex-center"
                  v-for="photo in informacionEvento.photos"
                  :key="photo"
                >
                  <img :src="photo" alt="" style="object-fit: cover" />
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
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>

      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, computed, ref, watch } from "vue";
const props = defineProps({
  informacionEvento: Object,
  primeraImagen: String,
});

const slide = ref(props.primeraImagen);

const loading = computed(() => !props.informacionEvento);
const fullscreen = ref(false);
</script>

<style lang="scss" scoped></style>
