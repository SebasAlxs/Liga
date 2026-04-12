<template>
  <div class="page-container p-6">

    <!-- ══ TOP BAR ══════════════════════════════════════════════ -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-white font-display">Vocalía</h1>
        <p class="text-obsidian-400 text-sm mt-0.5">Control de partido en tiempo real.</p>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <!-- Phase stepper (Vocal/Admin only) -->
        <div v-if="v.activeMatch.value && auth.isLoggedIn.value" class="flex items-center gap-1">
          <template v-for="(ph, i) in phases" :key="ph.id">
            <button
              @click="v.phase.value = ph.id"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border',
                v.phase.value === ph.id
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : phaseReached(ph.id)
                    ? 'border-white/10 text-obsidian-300 hover:border-white/20'
                    : 'border-white/5 text-obsidian-600 cursor-default'
              ]"
            >
              <span :class="[
                'w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black flex-shrink-0',
                v.phase.value === ph.id ? 'bg-emerald-500 text-obsidian-950' : phaseReached(ph.id) ? 'bg-white/10 text-white' : 'bg-white/5 text-obsidian-600'
              ]">{{ i + 1 }}</span>
              <span class="hidden sm:inline">{{ ph.label }}</span>
            </button>
            <div v-if="i < phases.length - 1" :class="`w-4 h-px flex-shrink-0 ${phaseReached(phases[i+1]?.id) ? 'bg-emerald-500/40' : 'bg-white/8'}`"></div>
          </template>
        </div>

        <!-- Match selector -->
        <select v-model="selectedId" @change="onMatchSelect"
          class="bg-obsidian-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 text-sm font-medium min-w-[250px]">
          <option value="" disabled>Seleccionar partido...</option>
          <optgroup v-for="grp in matchGroups" :key="grp.status" :label="grp.label">
            <option v-for="m in grp.matches" :key="m.id" :value="m.id">
              {{ teamName(m.homeTeamId) }} vs {{ teamName(m.awayTeamId) }} — {{ fmtDate(m.matchDate) }}
            </option>
          </optgroup>
        </select>

        <!-- Auth Actions -->
        <div v-if="auth.isLoggedIn.value" class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-[10px] font-black text-emerald-400 font-display tracking-widest uppercase">{{ auth.user.value?.role }}</span>
          </div>
          <button @click="auth.logout()" class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-obsidian-950 transition-all border border-rose-500/20 shadow-lg shadow-rose-500/10">
            <Icon name="lucide:log-out" class="w-5 h-5" />
          </button>
        </div>
        <button v-else @click="navigateTo('/login')" class="btn-premium px-6 py-2.5 text-[10px] uppercase tracking-widest border-white/10 hover:border-emerald-500/50">
          <Icon name="lucide:lock" class="w-4 h-4 mr-2" />
          Acceso Oficial
        </button>
      </div>
    </div>

    <!-- No match -->
    <div v-if="!v.activeMatch.value" class="glass rounded-3xl border border-white/5 p-20 text-center">
      <Icon name="lucide:clipboard-list" class="w-16 h-16 text-obsidian-700 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-white mb-2">Selecciona un partido</h3>
      <p class="text-obsidian-400 text-sm">Elige un partido para comenzar la gestión vocal.</p>
    </div>

    <!-- ════════════════════════════════════════════════════════ -->
    <!-- FASE 1: CHECK-IN                                        -->
    <!-- ════════════════════════════════════════════════════════ -->
    <template v-else-if="v.phase.value === 'checkin'">
      <!-- Header Fase 1 -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-sm font-black flex-shrink-0">1</div>
          <div>
            <h2 class="font-bold text-white">Verificación de Nómina</h2>
            <p class="text-xs text-obsidian-400">Confirma la asistencia de cada jugador.</p>
          </div>
        </div>
        <!-- Check-in counters + action -->
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <div class="checkin-counter">
              <span class="text-white font-black">{{ v.homeLineup.value.filter(l => l.checkedIn).length }}</span>
              <span class="text-obsidian-500">/{{ v.homeLineup.value.length }}</span>
              <span class="text-xs text-obsidian-500 ml-1 hidden sm:inline">{{ homeTeam?.name }}</span>
            </div>
            <span class="text-obsidian-700">·</span>
            <div class="checkin-counter">
              <span class="text-white font-black">{{ v.awayLineup.value.filter(l => l.checkedIn).length }}</span>
              <span class="text-obsidian-500">/{{ v.awayLineup.value.length }}</span>
              <span class="text-xs text-obsidian-500 ml-1 hidden sm:inline">{{ awayTeam?.name }}</span>
            </div>
          </div>
            <button v-if="auth.isLoggedIn.value" @click="goToFormation" :disabled="v.checkedInPlayers.value.length < 2"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 whitespace-nowrap"
              style="background: linear-gradient(to right, #10b981, #14b8a6); color: #0a1a14; box-shadow: 0 4px 16px rgba(16,185,129,0.2)">
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
              Ir a Formación
            </button>
        </div>
      </div>

      <!-- Arbitration Panel (Phase 1) -->
      <div class="glass rounded-[2rem] border border-white/8 mb-6 overflow-hidden shadow-2xl">
        <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div class="flex items-center gap-2">
            <Icon name="lucide:user-check" class="w-4 h-4 text-purple-400" />
            <h3 class="text-xs font-black text-white uppercase tracking-widest italic">Arbitraje</h3>
          </div>
          <button
            v-if="v.activeMatch.value?.refereeId"
            @click="v.saveArbitration({ refereeId: null, assistant1Id: null, assistant2Id: null })"
            class="text-[10px] text-rose-400/60 hover:text-rose-400 font-bold"
          >
            Limpiar
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-obsidian-500 uppercase tracking-widest px-1">Árbitro Central</label>
              <select
                :value="v.activeMatch.value?.refereeId"
                @change="e => v.saveArbitration({ refereeId: (e.target.value && e.target.value !== 'null') ? e.target.value : null })"
                class="field-input text-xs"
              >
                <option :value="null">Seleccionar Árbitro</option>
                <option v-for="r in v.referees.value" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-obsidian-500 uppercase tracking-widest px-1">Asistente 1</label>
              <select
                :value="v.activeMatch.value?.assistant1Id"
                @change="e => v.saveArbitration({ assistant1Id: (e.target.value && e.target.value !== 'null') ? e.target.value : null })"
                class="field-input text-xs"
              >
                <option :value="null">Sin asignar</option>
                <option v-for="r in v.referees.value" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-obsidian-500 uppercase tracking-widest px-1">Asistente 2</label>
              <select
                :value="v.activeMatch.value?.assistant2Id"
                @change="e => v.saveArbitration({ assistant2Id: (e.target.value && e.target.value !== 'null') ? e.target.value : null })"
                class="field-input text-xs"
              >
                <option :value="null">Sin asignar</option>
                <option v-for="r in v.referees.value" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Two columns: home | away -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="side in checkinSides" :key="side.id" class="glass rounded-3xl border border-white/5 overflow-hidden">

          <!-- Panel header -->
          <div class="px-5 py-4 border-b border-white/5 flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl overflow-hidden bg-obsidian-800 border border-white/10 flex-shrink-0 flex items-center justify-center">
              <img v-if="side.team?.logo" :src="side.team.logo" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:shield" class="w-5 h-5 text-obsidian-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-white truncate">{{ side.team?.name ?? '—' }}</p>
              <p class="text-xs text-obsidian-500">
                {{ side.lineup.filter(l => l.checkedIn).length }} confirmados &middot; {{ side.lineup.length }} en nómina
              </p>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="v.loadingLineup.value" class="p-8 flex justify-center">
            <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>

          <!-- Player rows -->
          <div v-else class="p-4 space-y-2 max-h-[520px] overflow-y-auto custom-scroll">
            <p v-if="!side.players.length" class="text-center text-sm text-obsidian-600 py-8">
              Sin jugadores registrados en este equipo.
            </p>

            <div
              v-for="p in side.players"
              :key="p.id"
              :class="[
                'flex items-center gap-3 p-3 rounded-xl border transition-all',
                v.lineupForPlayer(p.id)?.checkedIn ? 'bg-emerald-500/5 border-emerald-500/20'
                : v.suspendedPlayerIds.value.includes(p.id) ? 'bg-rose-500/5 border-rose-500/15 opacity-70'
                : 'border-white/5 hover:border-white/10'
              ]"
            >
              <!-- Photo -->
              <div class="w-11 h-11 rounded-xl overflow-hidden bg-obsidian-800 border border-white/10 flex-shrink-0 flex items-center justify-center">
                <img
                  v-if="p.picture"
                  :src="p.picture.startsWith('data:') ? p.picture : `data:image/jpeg;base64,${p.picture}`"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-sm font-black text-obsidian-500 select-none">
                  {{ (p.firstName?.[0] ?? '') + (p.lastName?.[0] ?? '') }}
                </span>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="font-bold text-white text-sm truncate">
                  {{ p.firstName }} {{ p.lastName }}
                  <span v-if="p.number" class="text-obsidian-600 font-normal">&nbsp;#{{ p.number }}</span>
                </p>
                <p class="text-xs mt-0.5"
                  :class="v.suspendedPlayerIds.value.includes(p.id) ? 'text-rose-400'
                    : v.lineupForPlayer(p.id)?.checkedIn ? 'text-emerald-400'
                    : v.lineupForPlayer(p.id) ? 'text-obsidian-500'
                    : 'text-obsidian-700'">
                  {{ v.suspendedPlayerIds.value.includes(p.id) ? '🚫 Suspendido'
                    : v.lineupForPlayer(p.id)?.checkedIn ? '✅ Confirmado'
                    : v.lineupForPlayer(p.id) ? '⏳ Pendiente de ingreso'
                    : 'No en nómina' }}
                </p>
              </div>

              <!-- Not in lineup: Add (Admin/Vocal only) -->
              <button
                v-if="!v.lineupForPlayer(p.id) && auth.isLoggedIn.value"
                @click="doStartVerification(p, side.teamId)"
                :disabled="v.suspendedPlayerIds.value.includes(p.id) || addingPlayerId === p.id"
                class="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              >
                <Icon v-if="addingPlayerId === p.id" name="lucide:loader-2" class="w-3 h-3 animate-spin" />
                <Icon v-else name="lucide:plus" class="w-3 h-3" />
                Verificar
              </button>

              <!-- In lineup: check-in or remove -->
              <div v-else-if="v.lineupForPlayer(p.id) && auth.isLoggedIn.value" class="flex gap-1.5 flex-shrink-0">
                <button
                  @click="doToggleCheckIn(v.lineupForPlayer(p.id).id, v.lineupForPlayer(p.id).checkedIn)"
                  :disabled="checkingInId === v.lineupForPlayer(p.id).id"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 active:scale-95',
                    v.lineupForPlayer(p.id).checkedIn
                      ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                      : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                  ]"
                >
                  <Icon v-if="checkingInId === v.lineupForPlayer(p.id).id" name="lucide:loader-2" class="w-3 h-3 animate-spin" />
                  <Icon v-else :name="v.lineupForPlayer(p.id).checkedIn ? 'lucide:x-circle' : 'lucide:check-circle'" class="w-3 h-3" />
                  {{ v.lineupForPlayer(p.id).checkedIn ? 'Negar' : 'Permitir entrada' }}
                </button>
                <button
                  @click="v.removeFromLineup(v.lineupForPlayer(p.id).id)"
                  class="p-1.5 rounded-lg border border-rose-500/20 text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <Icon name="lucide:trash-2" class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ════════════════════════════════════════════════════════ -->
    <!-- FASE 2: FORMACIÓN                                       -->
    <!-- ════════════════════════════════════════════════════════ -->
    <template v-else-if="v.phase.value === 'formation'">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 text-sm font-black">2</div>
          <div>
            <h2 class="font-bold text-white">Armado de Formación</h2>
            <p class="text-xs text-obsidian-400">Asigna titulares y suplentes para cada equipo.</p>
          </div>
        </div>
        <button v-if="auth.isLoggedIn.value" @click="doStartMatch"
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
          style="background: linear-gradient(to right, #10b981, #14b8a6); color: #0a1a14; box-shadow: 0 4px 16px rgba(16,185,129,0.2)">
          <Icon name="lucide:play" class="w-4 h-4" />
          Iniciar Partido
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Home bench -->
        <BenchPanel title="Suplentes" :items="v.homeSubstitutes.value" :team="homeTeam" side="home"
          @makeStarter="(item) => handleMakeStarter(item)" />

        <!-- Field -->
        <div class="lg:col-span-3">
          <SoccerField
            :homeStarters="v.homeStarters.value"
            :awayStarters="v.awayStarters.value"
            :homeTeam="homeTeam"
            :awayTeam="awayTeam"
            :interactive="auth.isLoggedIn.value"
            :statsMap="playerStatsMap"
            @makeSubstitute="(lid) => v.setLineupStatus(lid, 'SUBSTITUTE')"
          />
        </div>

        <!-- Away bench -->
        <BenchPanel title="Suplentes" :items="v.awaySubstitutes.value" :team="awayTeam" side="away"
          @makeStarter="(item) => handleMakeStarter(item)" />
      </div>
    </template>

    <!-- ════════════════════════════════════════════════════════ -->
    <!-- FASE 3: EN VIVO                                         -->
    <!-- ════════════════════════════════════════════════════════ -->
    <template v-else-if="v.phase.value === 'live'">
      <!-- Arbitration Panel (Phase 3) -->
      <div class="glass rounded-[2rem] border border-white/8 mb-6 overflow-hidden shadow-2xl">
        <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div class="flex items-center gap-2">
            <Icon name="lucide:user-check" class="w-4 h-4 text-purple-400" />
            <h3 class="text-xs font-black text-white uppercase tracking-widest italic">Arbitraje</h3>
          </div>
          <button
            v-if="auth.isAdmin.value && v.activeMatch.value?.refereeId"
            @click="v.saveArbitration({ refereeId: null, assistant1Id: null, assistant2Id: null })"
            class="text-[10px] text-rose-400/60 hover:text-rose-400 font-bold"
          >
            Limpiar
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-obsidian-500 uppercase tracking-widest px-1">Árbitro Central</label>
              <select
                :disabled="!auth.isAdmin.value"
                :value="v.activeMatch.value?.refereeId"
                @change="e => v.saveArbitration({ refereeId: (e.target.value && e.target.value !== 'null') ? e.target.value : null })"
                class="field-input text-xs disabled:opacity-50"
              >
                <option :value="null">Seleccionar Árbitro</option>
                <option v-for="r in v.referees.value" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-obsidian-500 uppercase tracking-widest px-1">Asistente 1</label>
              <select
                :disabled="!auth.isAdmin.value"
                :value="v.activeMatch.value?.assistant1Id"
                @change="e => v.saveArbitration({ assistant1Id: (e.target.value && e.target.value !== 'null') ? e.target.value : null })"
                class="field-input text-xs disabled:opacity-50"
              >
                <option :value="null">Sin asignar</option>
                <option v-for="r in v.referees.value" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-obsidian-500 uppercase tracking-widest px-1">Asistente 2</label>
              <select
                :disabled="!auth.isAdmin.value"
                :value="v.activeMatch.value?.assistant2Id"
                @change="e => v.saveArbitration({ assistant2Id: (e.target.value && e.target.value !== 'null') ? e.target.value : null })"
                class="field-input text-xs disabled:opacity-50"
              >
                <option :value="null">Sin asignar</option>
                <option v-for="r in v.referees.value" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Scoreboard -->
      <div class="glass rounded-[2rem] border border-white/8 mb-6 overflow-hidden shadow-2xl relative">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0"></div>
        <div class="p-4 sm:p-5 flex items-center justify-between gap-2 sm:gap-4 relative">
          <TeamScoreBlock :team="homeTeam" :logo="homeTeam?.logo" :isMobile="isMobile" align="right" />
          
          <div class="flex-shrink-0 text-center px-2">
            <div class="flex items-center gap-2 sm:gap-3">
              <span class="text-3xl sm:text-5xl font-black text-white font-mono tabular-nums tracking-tighter">{{ v.activeMatch.value.homeScore ?? 0 }}</span>
              <span class="text-xl sm:text-3xl text-obsidian-600 font-black">:</span>
              <span class="text-3xl sm:text-5xl font-black text-white font-mono tabular-nums tracking-tighter">{{ v.activeMatch.value.awayScore ?? 0 }}</span>
            </div>
            <div class="flex items-center justify-center gap-2 mt-2 bg-obsidian-950/50 rounded-full px-3 py-1 border border-emerald-500/20">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs sm:text-sm font-black text-emerald-400 tabular-nums font-mono">{{ v.matchMinuteFormatted.value }}</span>
            </div>
          </div>

          <TeamScoreBlock :team="awayTeam" :logo="awayTeam?.logo" :isMobile="isMobile" align="left" />
        </div>
      </div>

      <!-- Match Controller Actions -->
      <div v-if="auth.isLoggedIn.value && v.activeMatch.value?.status !== 'FINISHED'" class="flex flex-wrap items-center justify-center gap-3 mb-6">
        <button v-if="!v.activeMatch.value?.firstHalfEndedAt" @click="doEndFirstHalf"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-yellow-500/30 text-yellow-500 text-xs font-black hover:bg-yellow-500/10 transition-all uppercase tracking-widest bg-yellow-500/5">
          <Icon name="lucide:pause" class="w-4 h-4" /> Medio Tiempo
        </button>
        
        <button v-if="v.activeMatch.value?.firstHalfEndedAt && !v.activeMatch.value?.secondHalfStartedAt" @click="doStartSecondHalf"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-blue-500/30 text-blue-400 text-xs font-black hover:bg-blue-500/10 transition-all uppercase tracking-widest bg-blue-500/5">
          <Icon name="lucide:play" class="w-4 h-4" /> Iniciar 2do Tiempo
        </button>

        <button v-if="v.activeMatch.value?.secondHalfStartedAt" @click="doFinishMatch"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 text-xs font-black hover:bg-rose-500/10 transition-all uppercase tracking-widest bg-rose-500/5">
          <Icon name="lucide:flag-off" class="w-4 h-4" /> Finalizar Partido
        </button>
      </div>

      <!-- Live grid: field + timeline -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <!-- Field + benches -->
        <div class="xl:col-span-2 space-y-6">
          <div :class="{ 'perspective-field px-4 pb-8': isMobile }">
            <SoccerField
              :homeStarters="v.homeActiveLineup.value"
              :awayStarters="v.awayActiveLineup.value"
              :homeTeam="homeTeam"
              :awayTeam="awayTeam"
              :activePlayerId="activePlayer?.id"
               :isMobile="isMobile"
              :clickable="auth.isLoggedIn.value"
              :statsMap="playerStatsMap"
              @playerClick="onPlayerClick"
            />
          </div>

          <!-- Bench row (Desktop: Grid / Mobile: Horizontal Scroll) -->
          <div :class="isMobile ? 'space-y-4 px-2' : 'grid grid-cols-2 gap-4'">
            <div class="glass rounded-3xl border border-white/5 p-4 sm:p-5 relative overflow-hidden group">
              <div class="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
              <p class="text-[10px] sm:text-xs font-black text-obsidian-500 mb-3 sm:mb-4 uppercase tracking-[0.15em] flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                Suplentes — {{ homeTeam?.name }}
              </p>
              <div :class="isMobile ? 'flex overflow-x-auto gap-3 no-scrollbar pb-2 mx-[-4px] px-1' : 'flex flex-wrap gap-2'">
                <MiniPlayerToken
                  v-for="s in v.homeSubstitutes.value" :key="s.id"
                  :item="s"
                  :isMobile="isMobile"
                  :isActive="activePlayer?.lineupId === s.id"
                  :statsMap="playerStatsMap"
                  @click="onPlayerClick(s)"
                />
              </div>
            </div>
            <div class="glass rounded-3xl border border-white/5 p-4 sm:p-5 relative overflow-hidden group">
              <div class="absolute -top-4 -right-4 w-12 h-12 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all"></div>
              <p class="text-[10px] sm:text-xs font-black text-obsidian-500 mb-3 sm:mb-4 uppercase tracking-[0.15em] flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-blue-500"></span>
                Suplentes — {{ awayTeam?.name }}
              </p>
              <div :class="isMobile ? 'flex overflow-x-auto gap-3 no-scrollbar pb-2 mx-[-4px] px-1' : 'flex flex-wrap gap-2'">
                <MiniPlayerToken
                  v-for="s in v.awaySubstitutes.value" :key="s.id"
                  :item="s"
                  :isMobile="isMobile"
                  :isActive="activePlayer?.lineupId === s.id"
                  :statsMap="playerStatsMap"
                  @click="onPlayerClick(s)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline + event form -->
        <div class="space-y-4">
          <!-- Notification -->
          <Transition name="fade">
            <div v-if="eventNotif" :class="`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border ${eventNotif.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`">
              <Icon :name="eventNotif.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-4 h-4" />
              {{ eventNotif.message }}
            </div>
          </Transition>

          <!-- Active player panel (Only for Officials) -->
          <Transition :name="isMobile ? 'sheet' : 'slide-up'">
            <div v-if="activePlayer && auth.isLoggedIn.value" 
               :class="[
                 'glass border-emerald-500/20 shadow-2xl',
                 isMobile 
                   ? 'fixed bottom-0 left-0 right-0 z-50 rounded-t-[2.5rem] border-t p-6 pb-safe' 
                   : 'rounded-2xl border p-5'
               ]"
            >
              <!-- Handle for Bottom Sheet -->
              <div v-if="isMobile" class="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6"></div>

              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-2xl overflow-hidden bg-obsidian-800 border border-white/10 flex-shrink-0">
                  <img v-if="activePlayer.player?.photo"
                    :src="activePlayer.player.photo.startsWith('data:') ? activePlayer.player.photo : `data:image/jpeg;base64,${activePlayer.player.photo}`"
                    class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <Icon name="lucide:user" class="w-6 h-6 text-obsidian-600" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xl font-black text-white truncate leading-tight">{{ playerName(activePlayer) }}</p>
                  <p class="text-xs font-bold text-emerald-500 uppercase tracking-widest truncate">{{ teamName(activePlayer.teamId) }}</p>
                </div>
                <button @click="activePlayer = null" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-obsidian-400 hover:text-white transition-colors">
                  <Icon name="lucide:x" class="w-5 h-5" />
                </button>
              </div>

              <!-- Event type buttons -->
              <div v-if="activePlayerOnField" class="grid grid-cols-5 gap-2 mb-6">
                <button v-for="ev in eventTypes" :key="ev.value"
                  @click="eventForm.type = ev.value"
                  :class="[
                    'flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border text-[10px] font-bold transition-all active:scale-90',
                    eventForm.type === ev.value ? ev.activeClass + ' bg-white/5 scale-105 shadow-lg' : 'border-white/5 text-obsidian-600'
                  ]"
                >
                  <span class="text-2xl">{{ ev.emoji }}</span>
                  <span class="leading-tight text-center">{{ ev.label }}</span>
                </button>
              </div>

              <!-- OR: Direct entry for bench players -->
              <div v-else class="mb-6">
                <div v-if="(activePlayer.teamId === v.activeMatch.value.homeTeamId && v.homeActiveLineup.value.length < v.MAX_PLAYERS) || (activePlayer.teamId === v.activeMatch.value.awayTeamId && v.awayActiveLineup.value.length < v.MAX_PLAYERS)"
                  class="flex flex-col items-center p-6 rounded-[2rem] border-2 border-emerald-500/20 bg-emerald-500/5 group text-center">
                  <Icon name="lucide:user-plus" class="w-10 h-10 text-emerald-400 mb-3 group-hover:scale-110 transition-all" />
                  <p class="text-sm font-bold text-white mb-1">Ingreso Directo</p>
                  <p class="text-[10px] text-obsidian-400 text-center mb-4 italic uppercase tracking-widest">Completar Plantilla</p>
                  <button 
                    @click="() => { eventForm.type = 'PLAYER_ENTRY'; submitEvent() }"
                    class="btn-premium btn-emerald w-full py-4 text-[10px] uppercase tracking-widest font-black"
                  >
                    Hacer Ingresar a Cancha
                  </button>
                </div>
                <div v-else class="p-8 rounded-[2rem] border-2 border-white/5 bg-white/2 text-center">
                  <Icon name="lucide:users" class="w-10 h-10 text-obsidian-700 mb-3 mx-auto" />
                  <p class="text-xs font-bold text-obsidian-400">Plantilla Completa</p>
                  <p class="text-[10px] text-obsidian-600 mt-1 uppercase tracking-tighter italic font-bold">Máximo {{ v.MAX_PLAYERS }} por equipo</p>
                </div>
              </div>

              <!-- Related player for substitution -->
              <div v-if="eventForm.type === 'SUBSTITUTION'" class="mb-4 animate-fade-in">
                <label class="field-label">Jugador que entra</label>
                <div class="relative">
                  <select v-model="eventForm.relatedPlayerId" class="field-input appearance-none">
                    <option value="">Seleccionar relevo...</option>
                    <option v-for="s in subsByTeam(activePlayer.teamId)" :key="s.playerId" :value="s.playerId">
                      {{ playerName(s) }} {{ s.isVerified ? '' : '(⏳ No Verificado)' }}
                    </option>
                  </select>
                  <Icon name="lucide:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 text-obsidian-500 pointer-events-none" />
                </div>
              </div>

              <!-- Minute with quick-select -->
              <div class="mb-6">
                <label class="field-label">Minuto del evento</label>
                <div class="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                  <button v-for="m in [15, 30, 45, 60, 75, 90]" :key="m"
                    type="button"
                    @click="eventForm.minute = m"
                    :class="[
                      'flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black border transition-all',
                      eventForm.minute === m
                        ? 'bg-emerald-500 text-obsidian-950 border-emerald-500'
                        : 'border-white/10 text-obsidian-400'
                    ]"
                  >
                    {{ m }}'
                  </button>
                </div>
                <input v-model.number="eventForm.minute" type="number" min="1" max="120" class="field-input" placeholder="O escribe el minuto manual..." />
              </div>

              <button v-if="activePlayerOnField" @click="submitEvent" :disabled="eventLoading || !eventForm.type"
                class="btn-premium btn-emerald w-full py-4 text-sm uppercase tracking-[0.2em]"
              >
                <Icon v-if="eventLoading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                <template v-else>
                  <Icon name="lucide:zap" class="w-4 h-4" />
                  Registrar Acción
                </template>
              </button>
            </div>
          </Transition>

          <!-- No player selected hint / Viewer Mode Info -->
          <div v-if="!activePlayer || !auth.isLoggedIn.value" class="rounded-2xl border border-dashed border-white/10 p-5 text-center" style="background: rgba(10,14,20,0.3)">
            <div class="w-12 h-12 rounded-full bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Icon :name="auth.isLoggedIn.value ? 'lucide:hand-metal' : 'lucide:monitor-play'" class="w-6 h-6 text-emerald-600" />
            </div>
            <p class="text-sm font-semibold text-white mb-1">
              {{ auth.isLoggedIn.value ? 'Selecciona un jugador' : 'Modo Espectador' }}
            </p>
            <p class="text-xs text-obsidian-500">
              {{ auth.isLoggedIn.value ? 'Haz click en cualquier ficha del campo para registrar acciones.' : 'Estás viendo el partido en tiempo real. Los controles de oficial están restringidos.' }}
            </p>
          </div>

          <!-- Events timeline -->
          <div class="glass rounded-2xl border border-white/5">
            <div class="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <Icon name="lucide:activity" class="w-4 h-4 text-blue-400" />Timeline
              </h3>
              <span class="text-xs text-obsidian-500">{{ v.events.value.length }} eventos</span>
            </div>
            <div class="p-3 space-y-1 max-h-64 overflow-y-auto custom-scroll">
              <div v-if="!v.events.value.length" class="py-6 text-center text-xs text-obsidian-600 flex flex-col items-center gap-2">
                <Icon name="lucide:clipboard" class="w-6 h-6 text-obsidian-700" />
                Sin eventos aún
              </div>
              <div v-for="ev in v.events.value" :key="ev.id"
                :class="[
                  'group flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-lg hover:bg-white/3 transition-all border-l-2',
                  eventBorderColor(ev.type)
                ]">
                <span class="text-xs font-mono text-obsidian-600 w-7 text-right flex-shrink-0">{{ ev.minute ? ev.minute+"'" : '—' }}</span>
                <span class="text-base flex-shrink-0">{{ emoji(ev.type) }}</span>
                <div class="flex-1 min-w-0">
                  <p v-if="ev.type === 'SUBSTITUTION'" class="text-[11px] font-bold text-white leading-tight">
                    <span class="text-emerald-400">Entra: {{ playerNameById(ev.relatedPlayerId) }}</span>
                    <br/>
                    <span class="text-obsidian-500 font-medium">Sale: {{ playerNameById(ev.playerId) }}</span>
                  </p>
                  <p v-else class="text-xs font-semibold text-white truncate">{{ playerNameById(ev.playerId) }}</p>
                  <p class="text-[10px] truncate leading-none mt-1" :class="ev.teamId === v.activeMatch.value?.homeTeamId ? 'text-emerald-600' : 'text-blue-600'">{{ teamName(ev.teamId) }}</p>
                </div>
                <button @click="v.deleteEvent(ev.id)" class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-obsidian-700 hover:text-rose-400 transition-all">
                  <Icon name="lucide:x" class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- ════════════════════════════════════════════════════════ -->
    <!-- MODAL DE VERIFICACIÓN                                    -->
    <!-- ════════════════════════════════════════════════════════ -->
    <Transition :name="isMobile ? 'sheet' : 'fade'">
      <div v-if="showVerifyModal" 
        :class="[
          'fixed inset-0 z-50 flex p-4',
          isMobile ? 'items-end bg-obsidian-950/60' : 'items-center justify-center bg-obsidian-950/80 backdrop-blur-md'
        ]"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0" @click="showVerifyModal = false"></div>

        <!-- Modal content -->
        <div 
          :class="[
            'relative glass w-full border border-white/10 overflow-hidden shadow-2xl transition-all',
            isMobile ? 'rounded-t-[2.5rem] p-6 pb-safe border-b-0 translate-y-0' : 'max-w-lg rounded-[2.5rem] p-8'
          ]"
        >
          <!-- Handle for Bottom Sheet -->
          <div v-if="isMobile" class="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6"></div>

          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 :class="[isMobile ? 'text-xl' : 'text-2xl', 'font-black text-white italic tracking-tight uppercase']">Verificar Jugador</h3>
              <p class="text-obsidian-400 text-xs mt-1">Valida la identidad antes del ingreso.</p>
            </div>
            <button @click="showVerifyModal = false" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-obsidian-400">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="space-y-6">
            <div :class="['flex gap-6 items-start', isMobile ? 'flex-col items-center' : 'flex-row']">
              <!-- Big Photo -->
              <div class="relative group">
                <div :class="[isMobile ? 'w-36 h-36' : 'w-44 h-44', 'rounded-3xl overflow-hidden bg-obsidian-900 border-4 border-white/5 shadow-2xl transition-transform group-hover:scale-[1.02]']">
                  <img
                    v-if="verifyingData?.player?.picture"
                    :src="verifyingData.player.picture.startsWith('data:') ? verifyingData.player.picture : `data:image/jpeg;base64,${verifyingData.player.picture}`"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-obsidian-800 to-obsidian-900">
                    <Icon name="lucide:user" class="w-16 h-16 text-obsidian-700" />
                  </div>
                </div>
                <!-- Number Badge -->
                <div v-if="verifyingData?.player?.number" class="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-emerald-500 text-obsidian-950 flex items-center justify-center text-lg font-black shadow-lg border-4 border-obsidian-950">
                  {{ verifyingData.player.number }}
                </div>
              </div>

              <!-- Info -->
              <div :class="['flex-1 space-y-4 w-full', isMobile ? 'text-center' : 'text-left']">
                <div>
                  <p :class="[isMobile ? 'text-2xl' : 'text-3xl', 'font-black text-white leading-tight']">
                    {{ verifyingData?.player?.firstName }}<br/>
                    {{ verifyingData?.player?.lastName }}
                  </p>
                  <p class="text-[10px] font-black text-emerald-500 uppercase tracking-wider mt-1">{{ teamName(verifyingData?.teamId) }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                  <div>
                    <p class="text-[9px] uppercase font-bold text-obsidian-500 tracking-wider">Cédula / DNI</p>
                    <p class="text-white text-sm font-bold">{{ verifyingData?.player?.dni || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-[9px] uppercase font-bold text-obsidian-500 tracking-wider">Edad</p>
                    <p class="text-white text-sm font-bold">{{ getAge(verifyingData?.player?.birthDate) || '—' }} años</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <!-- Footer Buttons -->
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="showVerifyModal = false"
                class="px-6 py-4 rounded-2xl font-bold text-obsidian-400 hover:text-white hover:bg-white/5 transition-all text-xs uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button
                @click="doConfirmEntry"
                class="btn-premium btn-emerald w-full py-4 text-xs uppercase tracking-widest"
              >
                <Icon name="lucide:check-circle" class="w-4 h-4" />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </Transition>

  </div>
</template>

<script setup>
// ── Stores & composable ────────────────────────────────────────
const teamStore = useTeamStore()
const playerStore = usePlayerStore()
const v = useVocalia()
const auth = useAuth()

// Handle public view (Phase 3 only)
watchEffect(() => {
  if (!auth.isLoggedIn.value && v.phase.value !== 'live') {
    v.phase.value = 'live'
  }
})

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

// ── Local state ────────────────────────────────────────────────
const selectedId = ref('')
const activePlayer = ref(null)
const eventLoading = ref(false)
const eventNotif = ref(null)
const eventForm = ref({ type: 'GOAL', minute: null, relatedPlayerId: '' })
const addingPlayerId = ref(null)    // shows spinner while adding
const checkingInId = ref(null)      // shows spinner while toggling check-in
const isVerifyingForSubstitution = ref(false)

// Verification modal state
const showVerifyModal = ref(false)
const verifyingData = ref(null)    // { player, teamId }

// ── Phase definitions ──────────────────────────────────────────
const phases = [
  { id: 'checkin', label: '① Nómina' },
  { id: 'formation', label: '② Formación' },
  { id: 'live', label: '③ En vivo' },
]

const eventTypes = [
  { value: 'GOAL', label: 'Gol', emoji: '⚽', activeClass: 'border-emerald-500/50 text-emerald-400' },
  { value: 'ASSIST', label: 'Asistencia', emoji: '🎯', activeClass: 'border-blue-500/50 text-blue-400' },
  { value: 'YELLOW_CARD', label: 'Amarilla', emoji: '🟨', activeClass: 'border-yellow-500/50 text-yellow-300' },
  { value: 'RED_CARD', label: 'Roja', emoji: '🟥', activeClass: 'border-rose-500/50 text-rose-400' },
  { value: 'SUBSTITUTION', label: 'Cambio', emoji: '🔄', activeClass: 'border-purple-500/50 text-purple-400' },
]

// ── Computed data ──────────────────────────────────────────────
const homeTeam = computed(() => teamStore.teams.find(t => t.id === v.activeMatch.value?.homeTeamId))
const awayTeam = computed(() => teamStore.teams.find(t => t.id === v.activeMatch.value?.awayTeamId))
const homePlayers = computed(() => playerStore.players.filter(p => p.teamId === v.activeMatch.value?.homeTeamId))
const awayPlayers = computed(() => playerStore.players.filter(p => p.teamId === v.activeMatch.value?.awayTeamId))

const onFieldIds = computed(() => [...v.homeActiveLineup.value, ...v.awayActiveLineup.value].map(p => p.playerId))
const activePlayerOnField = computed(() => activePlayer.value && onFieldIds.value.includes(activePlayer.value.id))

const matchGroups = computed(() => [
  { status: 'IN_PROGRESS', label: '🟢 En juego', matches: v.matches.value.filter(m => m.status === 'IN_PROGRESS') },
  { status: 'SCHEDULED', label: '🔵 Programados', matches: v.matches.value.filter(m => m.status === 'SCHEDULED') },
  { status: 'FINISHED', label: '⚫ Finalizados', matches: v.matches.value.filter(m => m.status === 'FINISHED') },
].filter(g => g.matches.length > 0))

// checkinSides: data object for Phase 1 panels
const checkinSides = computed(() => [
  {
    id: 'home',
    teamId: v.activeMatch.value?.homeTeamId,
    team: homeTeam.value,
    players: homePlayers.value,
    lineup: v.homeLineup.value,
    statsMap: playerStatsMap.value,
  },
  {
    id: 'away',
    teamId: v.activeMatch.value?.awayTeamId,
    team: awayTeam.value,
    players: awayPlayers.value,
    lineup: v.awayLineup.value,
    statsMap: playerStatsMap.value,
  },
])

const playerStatsMap = computed(() => {
  const map = {}
  v.events.value.forEach(ev => {
    const pid = ev.playerId
    if (!pid) return
    if (!map[pid]) map[pid] = { GOAL: 0, YELLOW_CARD: 0, RED_CARD: 0 }
    if (ev.type === 'GOAL') map[pid].GOAL++
    if (ev.type === 'YELLOW_CARD') map[pid].YELLOW_CARD++
    if (ev.type === 'RED_CARD') map[pid].RED_CARD++
  })
  return map
})

// ── Helpers ────────────────────────────────────────────────────
function teamName(id) { return teamStore.teams.find(t => t.id === id)?.name ?? '—' }
function fmtDate(iso) { return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }
function playerName(item) {
  const p = item.player
  if (!p) return item.playerId
  return `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim()
}
function playerNameById(playerId) {
  const p = playerStore.players.find(p => p.id === playerId)
  return p ? `${p.firstName} ${p.lastName}` : playerId
}
function emoji(type) { return { GOAL: '⚽', ASSIST: '🎯', YELLOW_CARD: '🟨', RED_CARD: '🟥', SUBSTITUTION: '🔄', PLAYER_ENTRY: '➕' }[type] ?? '•' }
function subsByTeam(teamId) { return v[teamId === v.activeMatch.value?.homeTeamId ? 'homeSubstitutes' : 'awaySubstitutes'].value }
// helper for template: find lineup row for a player
function lineupFor(lineup, playerId) { return lineup.find(l => l.playerId === playerId) }

function getAge(birthDate) {
  if (!birthDate) return null
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// ── Lifecycle ──────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([teamStore.fetchTeams(), playerStore.fetchPlayers()])
  await v.loadMatches()
  if (v.selectedMatchId.value) selectedId.value = v.selectedMatchId.value
})

// ── Handlers ───────────────────────────────────────────────────
async function onMatchSelect() {
  activePlayer.value = null
  await v.selectMatch(selectedId.value)
}

function goToFormation() {
  v.phase.value = 'formation'
}

// Verification Flow
function doStartVerification(player, teamId) {
  verifyingData.value = { player, teamId }
  showVerifyModal.value = true
}

async function handleMakeStarter(item) {
  if (item.isVerified) {
    await v.setLineupStatus(item.id, 'STARTER')
  } else {
    // Force verification before they can start
    doStartVerification(item.player, item.teamId)
  }
}

async function doConfirmEntry() {
  if (!verifyingData.value) return
  const { player, teamId } = verifyingData.value
  
  addingPlayerId.value = player.id
  showVerifyModal.value = false
  
  try {
    // If we are in Live phase, they MUST be added as SUBSTITUTE, not STARTER
    // The formal substitution event will then move them to the field.
    const targetStatus = v.phase.value === 'live' ? 'SUBSTITUTE' : 'STARTER'
    
    await v.addToLineup(player.id, teamId, true, targetStatus)
    notify(`Ingreso confirmado: ${player.firstName} ${player.lastName} (${targetStatus})`)

    // AUTO-RESUME SUBMISSION if we were verifying for a substitution
    if (isVerifyingForSubstitution.value) {
      isVerifyingForSubstitution.value = false
      setTimeout(() => submitEvent(), 500) // Small delay to let states update
    }
  } catch (err) {
    console.error('Entry confirmation failed:', err)
    notify('Error al confirmar ingreso', 'error')
  } finally {
    addingPlayerId.value = null
    verifyingData.value = null
  }
}

// Direct async handlers for Phase 1 (no emit() chain - direct calls)
async function doAddToLineup(playerId, teamId) {
  // This is kept for compatibility or direct adding if needed, 
  // but standard flow now uses doStartVerification
  if (addingPlayerId.value) return
  addingPlayerId.value = playerId
  try {
    await v.addToLineup(playerId, teamId)
  } catch (err) {
    console.error('Add to lineup failed:', err)
  } finally {
    addingPlayerId.value = null
  }
}

async function doToggleCheckIn(lineupId, current) {
  checkingInId.value = lineupId
  try {
    await v.toggleCheckIn(lineupId, current)
  } finally {
    checkingInId.value = null
  }
}

// Stepper: tracks which phases have been reached
const reachedPhases = ref(new Set(['checkin']))
watch(() => v.phase.value, (ph) => reachedPhases.value.add(ph))
function phaseReached(id) { return reachedPhases.value.has(id) }

function eventBorderColor(type) {
  return {
    GOAL:         'border-emerald-500',
    ASSIST:       'border-blue-500',
    YELLOW_CARD:  'border-yellow-400',
    RED_CARD:     'border-rose-500',
    SUBSTITUTION: 'border-purple-500',
    PLAYER_ENTRY: 'border-emerald-400',
  }[type] ?? 'border-white/10'
}

async function doStartMatch() {
  if (!v.matchCanStart.value) {
    const msg = !v.homeReady.value && !v.awayReady.value 
      ? `Ambos equipos necesitan al menos ${v.MIN_PLAYERS} jugadores.`
      : !v.homeReady.value ? `Faltan titulares en ${homeTeam.value?.name} (Min. ${v.MIN_PLAYERS})`
      : `Faltan titulares en ${awayTeam.value?.name} (Min. ${v.MIN_PLAYERS})`
    notify(msg, 'error')
    return
  }
  try { await v.startMatch() }
  catch (err) { console.error(err) }
}

async function doEndFirstHalf() {
  if (!confirm('¿Pausar e ir a Descanso?')) return
  await v.endFirstHalf()
}

async function doStartSecondHalf() {
  if (!confirm('¿Iniciar el 2do Tiempo?')) return
  await v.startSecondHalf()
}

async function doFinishMatch() {
  if (!confirm('¿Finalizar el partido?')) return
  await v.finishMatch()
}

function onPlayerClick(lineupItem) {
  activePlayer.value = activePlayer.value?.lineupId === lineupItem.id ? null : { ...lineupItem.player, lineupId: lineupItem.id, teamId: lineupItem.teamId, player: lineupItem.player }
  eventForm.value = { type: 'GOAL', minute: v.matchMinute.value > 0 ? v.matchMinute.value : null, relatedPlayerId: '' }
}

function notify(msg, type = 'success') {
  eventNotif.value = { message: msg, type }
  setTimeout(() => eventNotif.value = null, 3000)
}

async function submitEvent() {
  if (!activePlayer.value || !eventForm.value.type) return

  // Strict check: if substitution, newcomer must be verified
  if (eventForm.value.type === 'SUBSTITUTION' && eventForm.value.relatedPlayerId) {
    const subs = subsByTeam(activePlayer.value.teamId)
    const sub = subs.find(s => s.playerId === eventForm.value.relatedPlayerId)
    console.log('[VOCALIA] Substitution check:', { sub, eventForm: eventForm.value })
    if (sub && !sub.isVerified) {
      notify('El jugador debe ser verificado antes del cambio', 'warning')
      isVerifyingForSubstitution.value = true
      doStartVerification(sub.player, activePlayer.value.teamId)
      return
    }
  }

  const payload = {
    playerId: activePlayer.value.lineupId ? v.lineup.value.find(l => l.id === activePlayer.value.lineupId)?.playerId ?? activePlayer.value.id : activePlayer.value.id,
    teamId: activePlayer.value.teamId,
    type: eventForm.value.type,
    ...(eventForm.value.minute && { minute: eventForm.value.minute }),
    ...(eventForm.value.relatedPlayerId && { relatedPlayerId: eventForm.value.relatedPlayerId }),
  }
  
  console.log('[VOCALIA] Submitting event:', payload)
  eventLoading.value = true
  try {
    await v.addEvent(payload)
    notify(`${emoji(eventForm.value.type)} Evento registrado`)
    eventForm.value = { type: eventForm.value.type, minute: null, relatedPlayerId: '' }
  } catch (err) {
    console.error('[VOCALIA] Event submission FAILED:', err)
    notify(err.data?.message || err.message || 'Error', 'error')
  } finally {
    eventLoading.value = false
  }
}

// ─────────────────────────────────────────────────────────────
// INLINE CHILD COMPONENTS
// ─────────────────────────────────────────────────────────────

// EventIndicators (New)
const EventIndicators = defineComponent({
  name: 'EventIndicators',
  props: { stats: Object },
  setup(props) {
    return () => {
      if (!props.stats) return null
      const { GOAL, YELLOW_CARD, RED_CARD } = props.stats
      const indicators = []
      
      if (GOAL > 0) {
        const balls = Math.min(GOAL, 3)
        for (let i = 0; i < balls; i++) {
          indicators.push(h('span', { class: 'text-[10px]' }, '⚽'))
        }
        if (GOAL > 3) {
          indicators.push(h('span', { class: 'text-[10px] font-black text-emerald-400 ml-0.5' }, `+${GOAL - 3}`))
        }
      }
      
      for (let i = 0; i < YELLOW_CARD; i++) {
        indicators.push(h('span', { class: 'text-[10px]' }, '🟨'))
      }
      for (let i = 0; i < RED_CARD; i++) {
        indicators.push(h('span', { class: 'text-[10px]' }, '🟥'))
      }
      
      if (indicators.length === 0) return null
      return h('div', { class: 'flex items-center gap-1 mt-0.5' }, indicators)
    }
  }
})

// TeamCheckinPanel
const TeamCheckinPanel = defineComponent({
  name: 'TeamCheckinPanel',
  props: { team: Object, teamId: String, teamPlayers: Array, lineup: Array, suspendedIds: Array, loading: Boolean, statsMap: Object },
  emits: ['add', 'remove', 'toggleCheckin'],
  setup(props, { emit }) {
    const addingId = ref(null)
    const inLineupIds = computed(() => (props.lineup || []).map(l => l.playerId))
    function lineupFor(pid) { return (props.lineup || []).find(l => l.playerId === pid) }
    function isSuspended(pid) { return (props.suspendedIds || []).includes(pid) }

    async function add(pid) {
      addingId.value = pid
      try { await emit('add', pid) } finally { addingId.value = null }
    }

    return () => h('div', { class: 'glass rounded-3xl border border-white/5 overflow-hidden' }, [
      // Header
      h('div', { class: 'px-5 py-4 border-b border-white/5 flex items-center gap-3' }, [
        props.team?.logo ? h('img', { src: props.team.logo, class: 'w-8 h-8 rounded-lg object-cover border border-white/10' }) : null,
        h('div', {}, [
          h('p', { class: 'font-bold text-white' }, props.team?.name ?? '—'),
          h('p', { class: 'text-xs text-obsidian-500' }, `${(props.lineup || []).filter(l => l.checkedIn).length} confirmados`),
        ]),
      ]),
      // Player list
      h('div', { class: 'p-4 space-y-2 max-h-[480px] overflow-y-auto' }, [
        ...(props.teamPlayers || []).map(p => {
          const lu = lineupFor(p.id)
          const suspended = isSuspended(p.id)
          const stats = props.statsMap?.[p.id]
          
          return h('div', {
            key: p.id,
            class: `flex items-center gap-3 p-3 rounded-xl border transition-all ${lu?.checkedIn ? 'bg-emerald-500/5 border-emerald-500/20' : suspended ? 'bg-rose-500/5 border-rose-500/15 opacity-60' : 'border-white/5 hover:border-white/10'}`,
          }, [
            // Photo
            h('div', { class: 'w-10 h-10 rounded-xl overflow-hidden bg-obsidian-800 border border-white/10 flex-shrink-0 flex items-center justify-center relative' }, [
              p.photo
                ? h('img', { src: p.photo.startsWith('data:') ? p.photo : `data:image/jpeg;base64,${p.photo}`, class: 'w-full h-full object-cover' })
                : h(resolveComponent('Icon'), { name: 'lucide:user', class: 'w-5 h-5 text-obsidian-600' }),
              // Quick status badge
              lu?.checkedIn ? h('div', { class: 'absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-obsidian-900 flex items-center justify-center' }, h(resolveComponent('Icon'), { name: 'lucide:check', class: 'w-2 h-2 text-white' })) : null
            ]),
            // Info
            h('div', { class: 'flex-1 min-w-0' }, [
              h('p', { class: 'font-bold text-white text-sm truncate' }, `${p.firstName} ${p.lastName}`),
              stats 
                ? h(EventIndicators, { stats })
                : h('p', { class: 'text-xs text-obsidian-500' }, suspended ? '🚫 Suspendido' : lu ? (lu.checkedIn ? '✅ Confirmado' : '⏳ Sin confirmar') : 'No en nómina'),
            ]),
            // Actions
            !lu
              ? h('button', {
                  onClick: () => !suspended && add(p.id),
                  disabled: suspended || addingId.value === p.id,
                  class: `px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${suspended ? 'opacity-30 cursor-not-allowed border-white/5 text-obsidian-600' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`,
                }, '+Agregar')
              : h('div', { class: 'flex gap-1.5' }, [
                  h('button', {
                    onClick: () => emit('toggleCheckin', lu.id, lu.checkedIn),
                    class: `px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${lu.checkedIn ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10' : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'}`,
                  }, lu.checkedIn ? 'Negar' : 'Permitir entrada'),
                  h('button', {
                    onClick: () => emit('remove', lu.id),
                    class: 'p-1.5 rounded-lg border border-rose-500/20 text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all',
                  }, h(resolveComponent('Icon'), { name: 'lucide:x', class: 'w-3 h-3' })),
                ]),
          ])
        }),
        (props.teamPlayers || []).length === 0
          ? h('p', { class: 'text-center text-sm text-obsidian-600 py-4' }, 'Sin jugadores en este equipo')
          : null,
      ]),
    ])
  }
})

// BenchPanel
const BenchPanel = defineComponent({
  name: 'BenchPanel',
  props: { title: String, items: Array, team: Object, side: String },
  emits: ['makeStarter'],
  setup(props, { emit }) {
    return () => h('div', { class: 'glass rounded-2xl border border-white/5 p-4' }, [
      h('p', { class: 'text-xs font-bold text-obsidian-500 mb-3 uppercase tracking-widest' }, props.title),
      h('p', { class: 'text-xs text-white font-semibold mb-3 truncate' }, props.team?.name),
      h('div', { class: 'space-y-2 max-h-[500px] overflow-y-auto' }, [
        ...(props.items || []).map(item =>
          h('div', {
            key: item.playerId,
            class: `flex items-center gap-2 p-2 rounded-xl bg-white/2 border ${item.isVerified ? 'border-white/5' : 'border-yellow-500/10'} hover:border-white/10 transition-all`,
          }, [
            h('div', { class: 'w-8 h-8 rounded-lg overflow-hidden bg-obsidian-800 border border-white/10 flex-shrink-0 flex items-center justify-center relative' }, [
              item.player?.photo
                ? h('img', { src: item.player.photo.startsWith('data:') ? item.player.photo : `data:image/jpeg;base64,${item.player.photo}`, class: 'w-full h-full object-cover' })
                : h(resolveComponent('Icon'), { name: 'lucide:user', class: 'w-4 h-4 text-obsidian-600' }),
              !item.isVerified ? h('div', { class: 'absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-obsidian-900' }) : null
            ]),
            h('div', { class: 'flex-1 min-w-0' }, [
              h('p', { class: `text-xs font-bold ${item.isVerified ? 'text-white' : 'text-obsidian-400'} truncate` }, item.player ? `${item.player.firstName} ${item.player.lastName}` : '—'),
              !item.isVerified ? h('p', { class: 'text-[9px] text-yellow-500/70 font-bold uppercase' }, '⏳ Verificar') : null
            ]),
            h('button', {
              onClick: () => emit('makeStarter', item),
              class: `p-1.5 rounded-lg border transition-all ${item.isVerified ? 'border-purple-500/20 text-purple-400/60 hover:text-purple-400 hover:bg-purple-500/10' : 'border-yellow-500/20 text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-500/10'}`,
              title: item.isVerified ? 'Hacer titular' : 'Verificar y poner',
            }, h(resolveComponent('Icon'), { name: item.isVerified ? 'lucide:arrow-right-circle' : 'lucide:user-check', class: 'w-3.5 h-3.5' })),
          ])
        ),
        !(props.items || []).length ? h('p', { class: 'text-center text-xs text-obsidian-600 py-4' }, 'Sin suplentes') : null,
      ]),
    ])
  }
})

// SoccerField
const SoccerField = defineComponent({
  name: 'SoccerField',
  props: {
    homeStarters: Array, awayStarters: Array,
    homeTeam: Object, awayTeam: Object,
    interactive: Boolean, clickable: Boolean,
    activePlayerId: String, isMobile: Boolean,
    statsMap: Object
  },
  emits: ['makeSubstitute', 'playerClick'],
  setup(props, { emit }) {
    function positions(count, yPct) {
      const xs = []
      for (let i = 0; i < count; i++) xs.push(((i + 1) / (count + 1)) * 100)
      return xs.map((x, i) => ({ x, y: yPct }))
    }

    function distributeTeam(starters, isHome) {
      if (!starters?.length) return []
      const zones = isHome
        ? [{ y: 88, label: 'GK' }, { y: 70, label: 'DEF' }, { y: 52, label: 'MID' }, { y: 34, label: 'FWD' }]
        : [{ y: 12, label: 'GK' }, { y: 30, label: 'DEF' }, { y: 48, label: 'MID' }, { y: 66, label: 'FWD' }]

      const gk = starters.slice(0, 1)
      const rest = starters.slice(1)
      const def = rest.slice(0, Math.ceil(rest.length * 0.4))
      const mid = rest.slice(def.length, def.length + Math.ceil(rest.length * 0.35))
      const fwd = rest.slice(def.length + mid.length)

      const rows = [gk, def, mid, fwd]
      const result = []
      rows.forEach((group, ri) => {
        const y = zones[ri].y
        group.forEach((item, i) => {
          const x = ((i + 1) / (group.length + 1)) * 100
          result.push({ ...item, fieldX: x, fieldY: y })
        })
      })
      return result
    }

    return () => {
      const homePositioned = distributeTeam(props.homeStarters, true)
      const awayPositioned = distributeTeam(props.awayStarters, false)
      const allPositioned = [...homePositioned, ...awayPositioned]
      const tokenSize = props.isMobile ? '3.2rem' : '2.5rem'

      return h('div', { 
        class: 'relative w-full rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl', 
        style: `aspect-ratio: ${props.isMobile ? '4/5' : '2/3'}; background: #081208` 
      }, [
        // Field background
        h('div', {
          class: 'absolute inset-0',
          style: `
            background: linear-gradient(180deg, #1a4a0e 0%, #1d5410 25%, #1a4a0e 50%, #1d5410 75%, #1a4a0e 100%);
            border-radius: 1rem;
          `
        }),
        // Field markings
        h('div', { style: 'position:absolute;inset:0;pointer-events:none' }, [
          // Outer border
          h('div', { style: 'position:absolute;top:4%;left:6%;right:6%;bottom:4%;border:2px solid rgba(255,255,255,0.25);border-radius:4px' }),
          // Center line
          h('div', { style: 'position:absolute;top:50%;left:6%;right:6%;height:2px;background:rgba(255,255,255,0.2);transform:translateY(-50%)' }),
          // Center circle
          h('div', { style: 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:18%;padding-top:12%;border:2px solid rgba(255,255,255,0.2);border-radius:50%' }),
          // Center dot
          h('div', { style: 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;background:rgba(255,255,255,0.4);border-radius:50%' }),
          // Home penalty area
          h('div', { style: 'position:absolute;bottom:4%;left:25%;right:25%;height:18%;border:2px solid rgba(255,255,255,0.2);border-top-left-radius:2px;border-top-right-radius:2px;border-bottom:none' }),
          // Away penalty area
          h('div', { style: 'position:absolute;top:4%;left:25%;right:25%;height:18%;border:2px solid rgba(255,255,255,0.2);border-bottom-left-radius:2px;border-bottom-right-radius:2px;border-top:none' }),
          // Home goal
          h('div', { style: 'position:absolute;bottom:3.5%;left:39%;right:39%;height:3%;border:2px solid rgba(255,255,255,0.3);border-bottom:none;border-radius:2px 2px 0 0;background:rgba(255,255,255,0.05)' }),
          // Away goal
          h('div', { style: 'position:absolute;top:3.5%;left:39%;right:39%;height:3%;border:2px solid rgba(255,255,255,0.3);border-top:none;border-radius:0 0 2px 2px;background:rgba(255,255,255,0.05)' }),
        ]),
        // Players
        ...allPositioned.map(item => {
          const isHome = props.homeStarters?.some(h => h.id === item.id)
          const isActive = props.activePlayerId === item.id || props.activePlayerId === item.playerId
          return h('div', {
            key: item.id,
            onClick: () => props.clickable ? emit('playerClick', item) : props.interactive ? emit('makeSubstitute', item.id) : null,
            class: `player-token ${props.clickable || props.interactive ? 'cursor-pointer' : ''}`,
            style: `position:absolute;left:${item.fieldX}%;top:${item.fieldY}%;transform:translate(-50%,-50%);z-index:10`,
            title: props.interactive ? 'Click para hacer suplente' : '',
          }, [
            h('div', {
              style: `
                width: ${tokenSize}; height: ${tokenSize};
                border-radius: 50%;
                border: 2px solid ${isActive ? '#10b981' : isHome ? 'rgba(16,185,129,0.5)' : 'rgba(59,130,246,0.5)'};
                overflow: hidden;
                background: ${isHome ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)'};
                box-shadow: 0 0 ${isActive ? '15px #10b981' : '8px rgba(0,0,0,0.6)'};
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex; align-items: center; justify-content: center;
                backdrop-filter: blur(4px);
              `
            }, [
              item.player?.photo
                ? h('img', { src: item.player.photo.startsWith('data:') ? item.player.photo : `data:image/jpeg;base64,${item.player.photo}`, style: 'width:100%;height:100%;object-fit:cover' })
                : h('span', { style: `font-size:${props.isMobile ? '0.8rem' : '0.6rem'};font-weight:900;color:${isHome ? '#34d399' : '#60a5fa'}` },
                    item.player ? `${item.player.firstName?.[0] ?? ''}${item.player.lastName?.[0] ?? ''}` : '?')
            ]),
            // Name label
            h('div', {
              style: `
                position:absolute; top:100%; left:50%; transform:translateX(-50%);
                margin-top:2px;
                display: flex; flex-direction: column; align-items: center;
              `
            }, [
              h('div', {
                style: `
                  white-space:nowrap;
                  font-size:0.55rem; font-weight:800;
                  color:white; text-shadow:0 1px 3px rgba(0,0,0,0.9);
                  background:rgba(0,0,0,0.6); border-radius:4px; padding:1px 4px;
                `
              }, item.player ? item.player.firstName || '' : ''),
              // Event indicators on field
              props.statsMap?.[item.playerId] 
                ? h(EventIndicators, { stats: props.statsMap[item.playerId] })
                : null
            ]),
          ])
        }),
      ])
    }
  }
})

// MiniPlayerToken
const MiniPlayerToken = defineComponent({
  name: 'MiniPlayerToken',
  props: { item: Object, isActive: Boolean, statsMap: Object },
  emits: ['click'],
  setup(props, { emit }) {
    return () => h('button', {
      onClick: () => emit('click', props.item),
      class: `flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all cursor-pointer ${props.isActive ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/5 hover:border-white/15'}`,
      style: 'min-width: 52px',
    }, [
      h('div', { style: 'width:2rem;height:2rem;border-radius:50%;overflow:hidden;border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;background:rgba(10,14,20,0.6)' },
        props.item.player?.photo
          ? [h('img', { src: props.item.player.photo.startsWith('data:') ? props.item.player.photo : `data:image/jpeg;base64,${props.item.player.photo}`, style: 'width:100%;height:100%;object-fit:cover' })]
          : [h('span', { style: 'font-size:0.55rem;font-weight:900;color:rgba(148,163,184,0.7)' },
              props.item.player ? `${props.item.player.firstName?.[0] ?? ''}${props.item.player.lastName?.[0] ?? ''}` : '?')]
      ),
      h('span', { style: 'font-size:0.55rem;font-weight:700;color:rgba(148,163,184,0.7);white-space:nowrap;max-width:52px;overflow:hidden;text-overflow:ellipsis' },
        props.item.player?.firstName ?? ''),
      props.statsMap?.[props.item.playerId] 
        ? h(EventIndicators, { stats: props.statsMap[props.item.playerId] })
        : null
    ])
  }
})

// TeamScoreBlock
const TeamScoreBlock = defineComponent({
  name: 'TeamScoreBlock',
  props: { team: Object, logo: String, align: String, isMobile: Boolean },
  setup(props) {
    return () => h('div', {
      class: 'flex-1 flex items-center gap-2 sm:gap-3 min-w-0',
      style: props.align === 'right' ? 'justify-content:flex-end;text-align:right;flex-direction:row-reverse' : '',
    }, [
      h('div', { 
        class: `rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center bg-obsidian-900/80 shadow-inner group transition-transform active:scale-90`,
        style: `width:${props.isMobile ? '2.5rem' : '3.5rem'};height:${props.isMobile ? '2.5rem' : '3.5rem'}`
      },
        props.logo
          ? [h('img', { src: props.logo, style: 'width:100%;height:100%;object-fit:cover' })]
          : [h(resolveComponent('Icon'), { name: 'lucide:shield', class: `${props.isMobile ? 'w-5 h-5' : 'w-7 h-7'} text-obsidian-700` })]
      ),
      h('div', { class: 'min-w-0 flex-1' }, [
        h('p', { class: `font-black text-white ${props.isMobile ? 'text-[10px]' : 'text-base'} uppercase tracking-tight truncate` }, props.team?.name ?? '—'),
        props.isMobile ? null : h('p', { class: 'text-[9px] text-obsidian-500 font-bold uppercase tracking-widest' }, 'Equipo')
      ]),
    ])
  }
})
</script>

<style scoped>
.glass {
  background: rgba(14, 20, 27, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.player-token {
  transition: transform 0.15s ease;
}
.player-token:hover {
  transform: translate(-50%, -50%) scale(1.15) !important;
}

.field-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(148, 163, 184, 0.55);
  margin-bottom: 0.5rem;
}

.field-input {
  width: 100%;
  background: rgba(10, 14, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.5rem 0.875rem;
  color: white;
  outline: none;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}
.field-input:focus { border-color: #10b981; }
.field-input option { background: #0a0e14; }

.checkin-counter {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.625rem;
  background: rgba(10, 14, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.8rem;
  gap: 1px;
}
.custom-scroll::-webkit-scrollbar { width: 3px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 4px; }

.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-8px); }

.slide-up-enter-active { transition: all 0.25s ease; }
.slide-up-leave-active { transition: all 0.15s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(12px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-8px); }

/* Bottom Sheet Animation */
.sheet-enter-active, .sheet-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.sheet-enter-from { transform: translateY(100%); }
.sheet-leave-to { transform: translateY(100%); }

.pb-safe { padding-bottom: calc(env(safe-area-inset-bottom, 0) + 5rem); }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
