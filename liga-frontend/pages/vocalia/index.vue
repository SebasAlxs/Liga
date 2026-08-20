<template>
  <div class="page-container p-6">

    <!-- ══ TOP BAR ══════════════════════════════════════════════ -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-content font-display">Vocalía</h1>
        <p class="text-content-muted text-sm mt-0.5">Control de partido en tiempo real.</p>
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
                    ? 'border-border text-content-muted hover:border-border'
                    : 'border-border text-content-muted cursor-default'
              ]"
            >
              <span :class="[
                'w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black flex-shrink-0',
                v.phase.value === ph.id ? 'bg-emerald-500 text-obsidian-950' : phaseReached(ph.id) ? 'bg-surface-hover text-content' : 'bg-surface-hover text-content-muted'
              ]">{{ i + 1 }}</span>
              <span class="hidden sm:inline">{{ ph.label }}</span>
            </button>
            <div v-if="i < phases.length - 1" :class="`w-4 h-px flex-shrink-0 ${phaseReached(phases[i+1]?.id) ? 'bg-emerald-500/40' : 'bg-surface-hover'}`"></div>
          </template>
        </div>

        <!-- Match selector -->
        <select v-model="selectedId" @change="onMatchSelect"
          class="bg-surface border border-border rounded-xl px-4 py-2.5 text-content focus:outline-none focus:border-emerald-500/50 text-sm font-medium min-w-[250px]">
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
        <button v-else @click="navigateTo('/login')" class="btn-premium px-6 py-2.5 text-[10px] uppercase tracking-widest border-border hover:border-emerald-500/50">
          <Icon name="lucide:lock" class="w-4 h-4 mr-2" />
          Acceso Oficial
        </button>
      </div>
    </div>

    <!-- No match -->
    <div v-if="!v.activeMatch.value" class="glass rounded-3xl border border-border p-20 text-center">
      <Icon name="lucide:clipboard-list" class="w-16 h-16 text-content-muted mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-content mb-2">Selecciona un partido</h3>
      <p class="text-content-muted text-sm">Elige un partido para comenzar la gestión vocal.</p>
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
            <h2 class="font-bold text-content">Verificación de Nómina</h2>
            <p class="text-xs text-content-muted">Confirma la asistencia de cada jugador.</p>
          </div>
        </div>
        <!-- Check-in counters + action -->
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <div class="checkin-counter">
              <span class="text-content font-black">{{ v.homeLineup.value.filter(l => l.checkedIn).length }}</span>
              <span class="text-content-muted">/{{ v.homeLineup.value.length }}</span>
              <span class="text-xs text-content-muted ml-1 hidden sm:inline">{{ homeTeam?.name }}</span>
            </div>
            <span class="text-content-muted">·</span>
            <div class="checkin-counter">
              <span class="text-content font-black">{{ v.awayLineup.value.filter(l => l.checkedIn).length }}</span>
              <span class="text-content-muted">/{{ v.awayLineup.value.length }}</span>
              <span class="text-xs text-content-muted ml-1 hidden sm:inline">{{ awayTeam?.name }}</span>
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
      <div class="glass rounded-[2rem] border border-border mb-6 overflow-hidden shadow-2xl">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between bg-background">
          <div class="flex items-center gap-2">
            <Icon name="lucide:user-check" class="w-4 h-4 text-purple-400" />
            <h3 class="text-xs font-black text-content uppercase tracking-widest italic">Arbitraje</h3>
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
              <label class="text-[9px] font-black text-content-muted uppercase tracking-widest px-1">Árbitro Central</label>
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
              <label class="text-[9px] font-black text-content-muted uppercase tracking-widest px-1">Asistente 1</label>
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
              <label class="text-[9px] font-black text-content-muted uppercase tracking-widest px-1">Asistente 2</label>
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
        <div v-for="side in checkinSides" :key="side.id" class="glass rounded-3xl border border-border overflow-hidden">

          <!-- Panel header -->
          <div class="px-5 py-4 border-b border-border flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl overflow-hidden bg-background border border-border flex-shrink-0 flex items-center justify-center">
              <img v-if="side.team?.logo" :src="side.team.logo" class="w-full h-full object-cover" />
              <Icon v-else name="lucide:shield" class="w-5 h-5 text-content-muted" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-content truncate">{{ side.team?.name ?? '—' }}</p>
              <p class="text-xs text-content-muted">
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
            <p v-if="!side.players.length" class="text-center text-sm text-content-muted py-8">
              Sin jugadores registrados en este equipo.
            </p>

            <div
              v-for="p in side.players"
              :key="p.id"
              :class="[
                'flex items-center gap-3 p-3 rounded-xl border transition-all',
                v.lineupForPlayer(p.id)?.checkedIn ? 'bg-emerald-500/5 border-emerald-500/20'
                : v.suspendedPlayerIds.value.includes(p.id) ? 'bg-rose-500/5 border-rose-500/15 opacity-70'
                : 'border-border hover:border-border'
              ]"
            >
              <!-- Photo -->
              <div class="w-11 h-11 rounded-xl overflow-hidden bg-background border border-border flex-shrink-0 flex items-center justify-center">
                <img
                  v-if="p.picture"
                  :src="p.picture.startsWith('data:') ? p.picture : `data:image/jpeg;base64,${p.picture}`"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-sm font-black text-content-muted select-none">
                  {{ (p.firstName?.[0] ?? '') + (p.lastName?.[0] ?? '') }}
                </span>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="font-bold text-content text-sm truncate">
                  {{ p.firstName }} {{ p.lastName }}
                  <span v-if="p.number" class="text-content-muted font-normal">&nbsp;#{{ p.number }}</span>
                </p>
                <p class="text-xs mt-0.5"
                  :class="v.suspendedPlayerIds.value.includes(p.id) ? 'text-rose-400'
                    : v.lineupForPlayer(p.id)?.checkedIn ? 'text-emerald-400'
                    : v.lineupForPlayer(p.id) ? 'text-content-muted'
                    : 'text-content-muted'">
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
                  :disabled="checkingInId === v.lineupForPlayer(p.id).id || v.suspendedPlayerIds.value.includes(p.id)"
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
            <h2 class="font-bold text-content">Armado de Formación</h2>
            <p class="text-xs text-content-muted">Asigna titulares y suplentes para cada equipo.</p>
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
            :home-starters="v.homeStarters.value"
            :away-starters="v.awayStarters.value"
            :interactive="auth.isLoggedIn.value"
            :stats-map="playerStatsMap"
            @make-substitute="(lid) => v.setLineupStatus(lid.id, 'SUBSTITUTE')"
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
      <div class="glass rounded-[2rem] border border-border mb-6 overflow-hidden shadow-2xl">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between bg-background">
          <div class="flex items-center gap-2">
            <Icon name="lucide:user-check" class="w-4 h-4 text-purple-400" />
            <h3 class="text-xs font-black text-content uppercase tracking-widest italic">Arbitraje</h3>
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
              <label class="text-[9px] font-black text-content-muted uppercase tracking-widest px-1">Árbitro Central</label>
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
              <label class="text-[9px] font-black text-content-muted uppercase tracking-widest px-1">Asistente 1</label>
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
              <label class="text-[9px] font-black text-content-muted uppercase tracking-widest px-1">Asistente 2</label>
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
      <MatchScoreboard 
        class="mb-6"
        :match="v.activeMatch.value" 
        :minute-formatted="v.matchMinuteFormatted.value" 
      />

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
              :home-starters="v.homeActiveLineup.value"
              :away-starters="v.awayActiveLineup.value"
              :active-player-id="activePlayer?.id"
              :is-mobile="isMobile"
              :clickable="auth.isLoggedIn.value"
              :stats-map="playerStatsMap"
              :red-carded-ids="v.redCardedPlayerIds.value"
              @player-click="onPlayerClick"
            />
          </div>

          <!-- Bench row (Desktop: Grid / Mobile: Horizontal Scroll) -->
          <div :class="isMobile ? 'space-y-4 px-2' : 'grid grid-cols-2 gap-4'">
            <div class="glass rounded-3xl border border-border p-4 sm:p-5 relative overflow-hidden group">
              <div class="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
              <p class="text-[10px] sm:text-xs font-black text-content-muted mb-3 sm:mb-4 uppercase tracking-[0.15em] flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                Suplentes — {{ homeTeam?.name }}
              </p>
              <div :class="isMobile ? 'flex overflow-x-auto gap-3 no-scrollbar pb-2 mx-[-4px] px-1' : 'flex flex-wrap gap-2'">
                <PlayerToken
                  v-for="s in v.homeSubstitutes.value" :key="s.id"
                  :player="s.player"
                  :size="'sm'"
                  :is-active="activePlayer?.lineupId === s.id"
                  :class="{ 'opacity-50 grayscale pointer-events-none': v.redCardedPlayerIds.value.includes(s.playerId) }"
                  :stats="playerStatsMap[s.playerId]"
                  @click="onPlayerClick(s)"
                />
              </div>
            </div>
            <div class="glass rounded-3xl border border-border p-4 sm:p-5 relative overflow-hidden group">
              <div class="absolute -top-4 -right-4 w-12 h-12 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all"></div>
              <p class="text-[10px] sm:text-xs font-black text-content-muted mb-3 sm:mb-4 uppercase tracking-[0.15em] flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-blue-500"></span>
                Suplentes — {{ awayTeam?.name }}
              </p>
              <div :class="isMobile ? 'flex overflow-x-auto gap-3 no-scrollbar pb-2 mx-[-4px] px-1' : 'flex flex-wrap gap-2'">
                <PlayerToken
                  v-for="s in v.awaySubstitutes.value" :key="s.id"
                  :player="s.player"
                  :size="'sm'"
                  :is-active="activePlayer?.lineupId === s.id"
                  :class="{ 'opacity-50 grayscale pointer-events-none': v.redCardedPlayerIds.value.includes(s.playerId) }"
                  :stats="playerStatsMap[s.playerId]"
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

          <!-- No player selected hint / Viewer Mode Info -->
          <div v-if="!activePlayer || !auth.isLoggedIn.value" class="rounded-2xl border border-dashed border-border p-5 text-center bg-background">
            <div class="w-12 h-12 rounded-full bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Icon :name="auth.isLoggedIn.value ? 'lucide:hand-metal' : 'lucide:monitor-play'" class="w-6 h-6 text-emerald-600" />
            </div>
            <p class="text-sm font-semibold text-content mb-1">
              {{ auth.isLoggedIn.value ? 'Selecciona un jugador' : 'Modo Espectador' }}
            </p>
            <p class="text-xs text-content-muted">
              {{ auth.isLoggedIn.value ? 'Haz click en cualquier ficha del campo para registrar acciones.' : 'Estás viendo el partido en tiempo real. Los controles de oficial están restringidos.' }}
            </p>
          </div>

          <!-- Events timeline -->
          <div class="glass rounded-2xl border border-border">
            <div class="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 class="text-sm font-bold text-content flex items-center gap-2">
                <Icon name="lucide:activity" class="w-4 h-4 text-blue-400" />Timeline
              </h3>
              <span class="text-xs text-content-muted">{{ v.events.value.length }} eventos</span>
            </div>
            <div class="p-3 space-y-1 max-h-64 overflow-y-auto custom-scroll">
              <div v-if="!v.events.value.length" class="py-6 text-center text-xs text-content-muted flex flex-col items-center gap-2">
                <Icon name="lucide:clipboard" class="w-6 h-6 text-content-muted" />
                Sin eventos aún
              </div>
              <div v-for="ev in v.events.value" :key="ev.id"
                :class="[
                  'group flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-lg hover:bg-surface-hover transition-all border-l-2',
                  eventBorderColor(ev.type)
                ]">
                <span class="text-xs font-mono text-content-muted w-7 text-right flex-shrink-0">{{ ev.minute ? ev.minute+"'" : '—' }}</span>
                <span class="text-base flex-shrink-0">{{ emoji(ev.type) }}</span>
                <div class="flex-1 min-w-0">
                  <p v-if="ev.type === 'SUBSTITUTION'" class="text-[11px] font-bold text-content leading-tight">
                    <span class="text-emerald-400">Entra: {{ playerNameById(ev.relatedPlayerId) }}</span>
                    <br/>
                    <span class="text-content-muted font-medium">Sale: {{ playerNameById(ev.playerId) }}</span>
                  </p>
                  <p v-else class="text-xs font-semibold text-content truncate">{{ playerNameById(ev.playerId) }}</p>
                  <p class="text-[10px] truncate leading-none mt-1" :class="ev.teamId === v.activeMatch.value?.homeTeamId ? 'text-emerald-600' : 'text-blue-600'">{{ teamName(ev.teamId) }}</p>
                </div>
                <button @click="v.deleteEvent(ev.id)" class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-content-muted hover:text-rose-400 transition-all">
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
          isMobile ? 'items-end bg-obsidian-950/50' : 'items-center justify-center bg-obsidian-950/70 backdrop-blur-md'
        ]"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0" @click="showVerifyModal = false"></div>

        <!-- Modal content -->
        <div 
          :class="[
            'relative glass w-full border border-border overflow-hidden shadow-2xl transition-all',
            isMobile ? 'rounded-t-[2.5rem] p-6 pb-safe border-b-0 translate-y-0' : 'max-w-lg rounded-[2.5rem] p-8'
          ]"
        >
          <!-- Handle for Bottom Sheet -->
          <div v-if="isMobile" class="w-12 h-1.5 bg-surface-hover rounded-full mx-auto mb-6"></div>

          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 :class="[isMobile ? 'text-xl' : 'text-2xl', 'font-black text-content italic tracking-tight uppercase']">Verificar Jugador</h3>
              <p class="text-content-muted text-xs mt-1">Valida la identidad antes del ingreso.</p>
            </div>
            <button @click="showVerifyModal = false" class="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-content-muted">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="space-y-6">
            <div :class="['flex gap-6 items-start', isMobile ? 'flex-col items-center' : 'flex-row']">
              <!-- Big Photo -->
              <div class="relative group">
                <div :class="[isMobile ? 'w-36 h-36' : 'w-44 h-44', 'rounded-3xl overflow-hidden bg-background border-4 border-border shadow-2xl transition-transform group-hover:scale-[1.02]']">
                  <img
                    v-if="verifyingData?.player?.picture"
                    :src="verifyingData.player.picture.startsWith('data:') ? verifyingData.player.picture : `data:image/jpeg;base64,${verifyingData.player.picture}`"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-surface-hover">
                    <Icon name="lucide:user" class="w-16 h-16 text-content-muted" />
                  </div>
                </div>
                <!-- Number Badge -->
                <div v-if="verifyingData?.player?.number" class="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-emerald-500 text-obsidian-950 flex items-center justify-center text-lg font-black shadow-lg border-4 border-surface">
                  {{ verifyingData.player.number }}
                </div>
              </div>

              <!-- Info -->
              <div :class="['flex-1 space-y-4 w-full', isMobile ? 'text-center' : 'text-left']">
                <div>
                  <p :class="[isMobile ? 'text-2xl' : 'text-3xl', 'font-black text-content leading-tight']">
                    {{ verifyingData?.player?.firstName }}<br/>
                    {{ verifyingData?.player?.lastName }}
                  </p>
                  <p class="text-[10px] font-black text-emerald-500 uppercase tracking-wider mt-1">{{ teamName(verifyingData?.teamId) }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4 py-4 border-y border-border">
                  <div>
                    <p class="text-[9px] uppercase font-bold text-content-muted tracking-wider">Cédula / DNI</p>
                    <p class="text-content text-sm font-bold">{{ verifyingData?.player?.dni || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-[9px] uppercase font-bold text-content-muted tracking-wider">Edad</p>
                    <p class="text-content text-sm font-bold">{{ getAge(verifyingData?.player?.birthDate) || '—' }} años</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <!-- Footer Buttons -->
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="showVerifyModal = false"
                class="px-6 py-4 rounded-2xl font-bold text-content-muted hover:text-content hover:bg-surface-hover transition-all text-xs uppercase tracking-widest"
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

      <!-- MODAL DE ACCIONES (ACTION DRAWER) -->
    <Transition :name="isMobile ? 'sheet' : 'fade'">
      <div v-if="activePlayer && auth.isLoggedIn.value" 
        :class="[
          'fixed inset-0 z-[100] flex',
          isMobile ? 'items-end' : 'items-center justify-center p-4'
        ]"
      >
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" @click="activePlayer = null"></div>

        <div 
          :class="[
            'relative glass w-full border border-primary/30 shadow-2xl transition-all overflow-y-auto max-h-[90vh] custom-scroll',
            isMobile ? 'rounded-t-[2.5rem] p-6 pb-safe border-b-0' : 'max-w-md rounded-[2.5rem] p-8'
          ]"
        >
          <!-- Handle for Bottom Sheet -->
          <div v-if="isMobile" class="w-12 h-1.5 bg-surface-hover rounded-full mx-auto mb-6"></div>

          <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 rounded-2xl overflow-hidden bg-surface-hover border border-border/10 flex-shrink-0">
              <img v-if="activePlayer.player?.picture"
                :src="activePlayer.player.picture"
                class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="lucide:user" class="w-6 h-6 text-content-muted" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xl font-black text-content truncate leading-tight">{{ playerName(activePlayer) }}</p>
              <p class="text-xs font-bold text-primary uppercase tracking-widest truncate">{{ teamName(activePlayer.teamId) }}</p>
            </div>
            <button @click="activePlayer = null" class="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-content-muted hover:text-content transition-colors">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Event type buttons -->
          <div v-if="activePlayerOnField" class="grid grid-cols-5 gap-2 mb-6">
            <button v-for="ev in eventTypes" :key="ev.value"
              @click="eventForm.type = ev.value"
              :class="[
                'flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border text-[10px] font-bold transition-all active:scale-90',
                eventForm.type === ev.value ? ev.activeClass + ' bg-background scale-105 shadow-lg' : 'border-border text-content-muted'
              ]"
            >
              <span class="text-2xl">{{ ev.emoji }}</span>
              <span class="leading-tight text-center">{{ ev.label }}</span>
            </button>
          </div>

          <!-- OR: Direct entry for bench players -->
          <div v-else class="mb-6">
            <div v-if="(activePlayer.teamId === v.activeMatch.value.homeTeamId && v.homeActiveLineup.value.length < v.MAX_PLAYERS) || (activePlayer.teamId === v.activeMatch.value.awayTeamId && v.awayActiveLineup.value.length < v.MAX_PLAYERS)"
              class="flex flex-col items-center p-6 rounded-[2rem] border-2 border-primary/20 bg-primary/5 group text-center">
              <Icon name="lucide:user-plus" class="w-10 h-10 text-emerald-400 mb-3 group-hover:scale-110 transition-all" />
              <p class="text-sm font-bold text-content mb-1">Ingreso Directo</p>
              <p class="text-[10px] text-content-muted text-center mb-4 italic uppercase tracking-widest">Completar Plantilla</p>
              <button 
                @click="() => { eventForm.type = 'PLAYER_ENTRY'; submitEvent() }"
                :disabled="v.isProcessingAction.value"
                class="btn-premium btn-emerald w-full py-4 text-[10px] uppercase tracking-widest font-black disabled:opacity-50 disabled:pointer-events-none"
              >
                Hacer Ingresar a Cancha
              </button>
            </div>
            <div v-else class="p-8 rounded-[2rem] border-2 border-border bg-background text-center">
              <Icon name="lucide:users" class="w-10 h-10 text-content-muted mb-3 mx-auto" />
              <p class="text-xs font-bold text-content-muted">Plantilla Completa</p>
              <p class="text-[10px] text-content-muted mt-1 uppercase tracking-tighter italic font-bold">Máximo {{ v.MAX_PLAYERS }} por equipo</p>
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
              <Icon name="lucide:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
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
                    ? 'bg-primary text-obsidian-950 border-primary'
                    : 'border-border/10 text-content-muted'
                ]"
              >
                {{ m }}'
              </button>
            </div>
            <input v-model.number="eventForm.minute" type="number" min="1" max="120" class="field-input" placeholder="O escribe el minuto manual..." />
          </div>

          <button v-if="activePlayerOnField" @click="submitEvent" :disabled="eventLoading || !eventForm.type || v.isProcessingAction.value"
            class="btn-premium btn-emerald w-full py-4 text-sm uppercase tracking-[0.2em] disabled:opacity-50 disabled:pointer-events-none"
          >
            <Icon v-if="eventLoading || v.isProcessingAction.value" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <template v-else>
              <Icon name="lucide:zap" class="w-4 h-4" />
              Registrar Acción
            </template>
          </button>
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
  }[type] ?? 'border-border'
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

</script>

<style scoped>
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
  color: rgb(var(--color-text-muted));
  margin-bottom: 0.5rem;
}

.field-input {
  width: 100%;
  background: rgb(var(--color-background));
  border: 1px solid rgb(var(--color-border));
  border-radius: 0.75rem;
  padding: 0.5rem 0.875rem;
  color: rgb(var(--color-text));
  outline: none;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}
.field-input:focus { border-color: #10b981; }
.field-input option { background: rgb(var(--color-surface)); color: rgb(var(--color-text)); }

.checkin-counter {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.625rem;
  background: rgb(var(--color-background));
  border: 1px solid rgb(var(--color-border));
  font-size: 0.8rem;
  gap: 1px;
}
.custom-scroll::-webkit-scrollbar { width: 3px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgb(var(--color-border)); border-radius: 4px; }

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
