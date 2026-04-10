<template>
  <q-page class="bg-dark text-white q-pa-md">
    <div class="row items-start q-col-gutter-md">
      <q-card
        v-for="item in items"
        :key="item.id"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-3 bg-grey-9 text-white"
        flat
        bordered
      >
        <q-img :src="item.image" :alt="item.title" class="rounded-borders">
          <div class="absolute-top-left q-pa-sm text-caption text-grey-3">
            <q-avatar size="24px">
              <img :src="item.avatar" alt="author" />
            </q-avatar>
            {{ item.author }}
          </div>
        </q-img>

        <q-card-section>
          <div class="text-h6">{{ item.title }}</div>
          <div class="text-subtitle2 text-grey-5">{{ item.subtitle }}</div>
        </q-card-section>

        <q-separator dark />

        <q-card-section class="row justify-between items-center">
          <div class="text-caption text-grey-5">Price</div>
          <div class="text-bold">{{ item.price }} ETH</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat color="primary" label="View" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useLogs } from './composables/useLogs'

const { items } = useLogs()
</script>

<style scoped>
.q-card {
  transition: transform 0.2s ease;
}
.q-card:hover {
  transform: scale(1.03);
}
.rounded-borders {
  border-radius: 16px;
}
</style>
