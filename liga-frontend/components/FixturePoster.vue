<template>
  <div class="poster-container" id="fixture-poster-capture" ref="posterRef">
    <!-- Background Elements -->
    <div class="bg-stars"></div>
    <div class="bg-lights"></div>

    <!-- Header -->
    <div class="header">
      <div class="championship-label">CAMPEONATO</div>
      <div class="tournament-name">{{ tournamentName }}</div>
      
      <div class="divider">
        <Icon name="lucide:zap" class="zap-icon left" />
        <div class="divider-text">LIGA OFICIAL</div>
        <Icon name="lucide:zap" class="zap-icon right" />
      </div>

      <div class="round-title">{{ roundLabel }}</div>
      
      <div class="date-badge">
        <Icon name="lucide:calendar" class="w-5 h-5" />
        {{ dateLabel }}
      </div>
    </div>

    <!-- Matches -->
    <div class="matches-list">
      <div v-for="(match, index) in matches" :key="index" class="match-card">
        
        <!-- Optional Match Subtitle -->
        <div v-if="match.subtitle" class="match-subtitle">{{ match.subtitle }}</div>
        
        <div class="match-content">
          <!-- Home Team -->
          <div class="team home">
            <div class="team-logo-wrapper">
              <img v-if="match.homeTeamLogo" :src="match.homeTeamLogo" class="team-logo" />
              <div v-else class="team-logo-placeholder">
                <Icon name="lucide:shield" class="w-10 h-10 text-slate-400" />
              </div>
            </div>
            <div class="team-name">{{ match.homeTeamName }}</div>
          </div>

          <!-- VS -->
          <div class="vs-container">
            <div class="vs-text">VS</div>
          </div>

          <!-- Away Team -->
          <div class="team away">
            <div class="team-name text-right">{{ match.awayTeamName }}</div>
            <div class="team-logo-wrapper">
              <img v-if="match.awayTeamLogo" :src="match.awayTeamLogo" class="team-logo" />
              <div v-else class="team-logo-placeholder">
                <Icon name="lucide:shield" class="w-10 h-10 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Match Time -->
        <div class="match-time">
          <Icon name="lucide:clock" class="w-4 h-4 text-amber-400" />
          HORA: {{ match.time }}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-slogan">¡APOYA A TU EQUIPO Y VIVE LA PASIÓN DEL FÚTBOL!</div>
      <div class="footer-sub">DEPORTE — SALUD — VIDA</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  tournamentName: { type: String, required: true },
  roundLabel: { type: String, required: true },
  dateLabel: { type: String, required: true },
  matches: { type: Array, required: true }
})

const posterRef = ref(null)

defineExpose({
  getPosterElement: () => posterRef.value
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:ital,wght@0,700;0,900;1,800&display=swap');

/* Base Container */
.poster-container {
  width: 1080px; /* High resolution for sharing */
  min-height: 1920px; /* Vertical poster aspect ratio */
  background: #050b14;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 60px 40px;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  color: white;
  z-index: 1;
}

/* Backgrounds */
.bg-stars {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(white 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.1;
  z-index: -2;
}

.bg-lights {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 10% 20%, rgba(30, 64, 175, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(202, 138, 4, 0.3) 0%, transparent 40%);
  z-index: -1;
  mix-blend-mode: screen;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 60px;
}

.championship-label {
  font-family: 'Bebas Neue', cursive;
  font-size: 3rem;
  letter-spacing: 0.2em;
  color: #fbbf24; /* amber-400 */
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  margin-bottom: -10px;
}

.tournament-name {
  font-family: 'Bebas Neue', cursive;
  font-size: 6rem;
  line-height: 1;
  color: #fcd34d;
  text-shadow: 
    3px 3px 0 #b45309,
    -1px -1px 0 #fef3c7,
    0px 10px 15px rgba(0,0,0,0.8);
  margin-bottom: 20px;
  background: linear-gradient(to bottom, #fef3c7, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.divider-text {
  font-size: 1.5rem;
  font-weight: 900;
  font-style: italic;
  background: white;
  color: black;
  padding: 5px 30px;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
}

.zap-icon {
  color: #fbbf24;
  width: 40px;
  height: 40px;
}

.round-title {
  font-family: 'Bebas Neue', cursive;
  font-size: 7rem;
  line-height: 1;
  color: white;
  text-shadow: 0 5px 15px rgba(0,0,0,0.8);
  margin-bottom: 20px;
}

.date-badge {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  background: #fbbf24;
  color: black;
  font-size: 1.5rem;
  font-weight: 900;
  padding: 10px 40px;
  border-radius: 10px;
  text-transform: uppercase;
}

/* Matches */
.matches-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1;
}

.match-card {
  background: rgba(0, 0, 0, 0.6);
  border: 3px solid #fbbf24;
  border-radius: 20px;
  padding: 20px;
  position: relative;
  box-shadow: inset 0 0 20px rgba(251, 191, 36, 0.1), 0 10px 30px rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
}

.match-subtitle {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: #fbbf24;
  color: black;
  font-weight: 900;
  font-size: 1.2rem;
  padding: 5px 20px;
  clip-path: polygon(5% 0, 95% 0, 100% 100%, 0 100%);
  text-transform: uppercase;
}

.match-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
}

.team {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;
}

.team.away {
  justify-content: flex-end;
}

.team-logo-wrapper {
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 20px rgba(255,255,255,0.2);
}

.team-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.team-logo-placeholder {
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-name {
  font-size: 2.2rem;
  font-family: 'Bebas Neue', cursive;
  letter-spacing: 0.05em;
  max-width: 250px;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

.vs-container {
  padding: 0 40px;
}

.vs-text {
  font-family: 'Bebas Neue', cursive;
  font-size: 5rem;
  color: white;
  text-shadow: 0 0 20px rgba(255,255,255,0.5);
}

.match-time {
  text-align: center;
  color: #fbbf24;
  font-size: 1.5rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

/* Footer */
.footer {
  text-align: center;
  margin-top: auto;
  padding-top: 60px;
}

.footer-slogan {
  font-size: 2.5rem;
  font-weight: 900;
  font-style: italic;
  color: white;
  text-shadow: 2px 2px 5px black;
  margin-bottom: 10px;
}

.footer-sub {
  font-size: 1.5rem;
  color: #fbbf24;
  letter-spacing: 0.2em;
}
</style>
