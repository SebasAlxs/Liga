<template>
  <q-item
    clickable
    tag="a"
    :href="isExternal ? props.link : undefined"
    :to="isExternal ? undefined : { name: props.link }"
    exact
    active-class="active-link"
    class="sidebar-item q-mx-md q-mb-sm"
  >
    <q-item-section
      v-if="props.icon"
      avatar
      class="sidebar-icon"
      style="min-width: 40px; padding-right: 12px"
    >
      <q-icon :name="props.icon" size="24px" class="transition-base icon-color" />
    </q-item-section>

    <q-item-section>
      <q-item-label
        class="text-subtitle2 text-weight-bold transition-base label-color"
      >
        {{ props.title }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: '',
  },

  link: {
    type: String,
    default: '#',
  },

  icon: {
    type: String,
    default: '',
  },
})

const route = useRoute()

const isExternal = computed(() => {
  return props.link.startsWith('http')
})
</script>

<style scoped>
.sidebar-item {
  border-radius: 12px;
  padding: 10px 16px;
  color: #64748b; /* Slate 500 */
}

.sidebar-item:hover {
  background-color: #f1f5f9; /* Slate 100 */
  color: #0f172a; /* Slate 900 */
}

.icon-color {
  color: #94a3b8; /* Slate 400 */
}

.label-color {
  color: #64748b; /* Slate 500 */
}

.sidebar-item:hover .icon-color,
.sidebar-item:hover .label-color {
  color: #0f172a;
}

.active-link {
  background-color: #ecfdf5 !important; /* Emerald 50 */
  color: #10b981 !important; /* Emerald 500 */
}

.active-link .icon-color,
.active-link .label-color {
  color: #10b981 !important;
}
</style>
