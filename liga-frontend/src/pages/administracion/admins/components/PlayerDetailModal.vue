<template>
  <q-dialog v-model="show" transition-show="scale" transition-hide="scale">
    <q-card class="player-detail-card" style="min-width: 350px; border-radius: 24px;">
      <q-card-section class="bg-green-8 text-white q-pa-lg text-center relative-position">
        <q-btn icon="close" flat round dense v-close-popup class="absolute-top-right q-ma-sm" color="white" />

        <q-avatar size="120px" class="bg-white shadow-3 q-mb-md">
          <img v-if="player?.picture"
            :src="player.picture.startsWith('http') ? player.picture : `data:image/png;base64,${player.picture}`"
            alt="foto" />
          <q-icon v-else name="person" color="grey-3" size="64px" />
          <q-badge color="amber-9" floating class="text-weight-bolder text-h6 shadow-1"
            style="padding: 4px 8px; border-radius: 8px;">
            #{{ player?.number }}
          </q-badge>
        </q-avatar>

        <div class="text-h4 text-weight-bolder">{{ player?.firstName }} {{ player?.lastName }}</div>
        <div class="row justify-center q-gutter-x-md q-mt-xs">
          <div class="text-subtitle1 text-green-2 text-uppercase letter-spacing-2">
            {{ player?.position || 'Jugador' }}
          </div>
          <q-badge :color="player?.isLocal ? 'blue-8' : 'orange-9'" :label="player?.isLocal ? 'Local' : 'Foráneo'"
            class="q-px-sm" />
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div v-if="loadingDetails" class="flex flex-center q-pa-xl">
          <q-spinner-tail color="green-8" size="3em" />
        </div>
        <div v-else class="row q-col-gutter-md">
          <!-- Identity Info -->
          <div class="col-12">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="info-box shadow-1">
                  <q-icon name="badge" color="grey-7" size="20px" />
                  <div>
                    <div class="text-caption text-grey-6 uppercase">Cédula</div>
                    <div class="text-subtitle2 text-weight-bold">{{ player?.dni || 'N/A' }}</div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="info-box shadow-1">
                  <q-icon name="cake" color="grey-7" size="20px" />
                  <div>
                    <div class="text-caption text-grey-6 uppercase">Edad</div>
                    <div class="text-subtitle2 text-weight-bold">{{ formattedAge }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Section -->
          <div class="col-12 q-mt-sm">
            <div class="text-overline text-grey-7 q-mb-xs">Estadísticas de Temporada</div>
            <div class="row q-col-gutter-sm">
              <div class="col-4">
                <div class="stat-card goals">
                  <q-icon name="sports_soccer" size="32px" />
                  <div class="text-h5 text-weight-bolder">{{ player?.stats?.goals || 0 }}</div>
                  <div class="text-caption uppercase">Goles</div>
                </div>
              </div>
              <div class="col-4">
                <div class="stat-card yellow">
                  <q-icon name="style" size="32px" />
                  <div class="text-h5 text-weight-bolder">{{ player?.stats?.yellowCards || 0 }}</div>
                  <div class="text-caption uppercase">Amarillas</div>
                </div>
              </div>
              <div class="col-4">
                <div class="stat-card red">
                  <q-icon name="style" size="32px" />
                  <div class="text-h5 text-weight-bolder">{{ player?.stats?.redCards || 0 }}</div>
                  <div class="text-caption uppercase">Rojas</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 q-mt-lg">
            <div class="row items-center q-gutter-md justify-center">
              <q-btn outline color="blue-8" icon="edit" label="Editar" rounded @click="$emit('edit', player)"
                class="q-px-lg" />
              <q-btn flat color="red-8" icon="delete" label="Eliminar" rounded @click="$emit('delete', player)"
                class="q-px-lg" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { api } from 'boot/axios'

const props = defineProps({
  modelValue: Boolean,
  player: Object
})

const emit = defineEmits(['update:modelValue', 'edit', 'delete'])

const loadingDetails = ref(false)
const fullPlayer = ref(null)

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const player = computed(() => fullPlayer.value || props.player)

const formattedAge = computed(() => {
  if (!player.value?.birthDate) return 'N/A'
  const birthDate = new Date(player.value.birthDate)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return `${age} años`
})

watch(() => props.modelValue, async (isOpen) => {
  if (isOpen && props.player?.id) {
    try {
      loadingDetails.value = true
      const res = await api.get(`/api/players/${props.player.id}`)
      fullPlayer.value = res.data.data || res.data
    } catch (error) {
      console.error('Error fetching player details:', error)
    } finally {
      loadingDetails.value = false
    }
  } else if (!isOpen) {
    fullPlayer.value = null
  }
})
</script>

<style scoped>
.player-detail-card {
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15) !important;
}

.detail-item {
  display: flex;
  align-items: center;
}

.letter-spacing-2 {
  letter-spacing: 2px;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.uppercase {
  text-transform: uppercase;
}

.info-box {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #eee;
}

.stat-card {
  text-align: center;
  padding: 16px 8px;
  border-radius: 16px;
  color: white;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: scale(1.05);
}

.stat-card.goals {
  background: linear-gradient(135deg, #2e7d32, #43a047);
}

.stat-card.yellow {
  background: linear-gradient(135deg, #fbc02d, #fdd835);
  color: #333;
}

.stat-card.red {
  background: linear-gradient(135deg, #c62828, #e53935);
}
</style>
