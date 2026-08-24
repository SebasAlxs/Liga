<template>
  <div class="page-container p-4 sm:p-8 min-h-screen text-content">
    <!-- ── PUBLIC VIEW ───────────────────────────────── -->
    <div v-if="!authStore.isLoggedIn" class="max-w-7xl mx-auto py-4">
      
      <!-- Top Branding -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div class="inline-flex items-center gap-3 mb-4 px-3 py-1.5 bg-emerald-50 rounded-full text-primary border border-emerald-100 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-primary shadow-sm animate-pulse"></span>
            <span class="text-xs font-bold uppercase tracking-widest">Temporada en Curso</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold text-content tracking-tight leading-tight drop-shadow-sm">
            La Liga <span class="text-primary">Oficial</span><br/>
            <span class="text-2xl text-content-muted font-normal tracking-wide">El portal del fútbol</span>
          </h1>
        </div>
        <div class="text-left md:text-right">
          <p class="text-sm font-semibold text-content-muted mb-1">{{ todayDate }}</p>
          <p class="text-primary text-sm flex items-center gap-2 md:justify-end font-bold">
            <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-sm"></span> En curso
          </p>
        </div>
      </div>

      <div v-if="pageLoading" class="py-32 flex flex-col items-center justify-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin mb-4" />
        <p class="text-content-muted text-sm font-medium">Sincronizando datos...</p>
      </div>

      <!-- BENTO GRID LAYOUT -->
      <div v-else class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        
        <!-- PARTIDO DESTACADO (Hero Box) -->
        <div class="md:col-span-12 lg:col-span-8 group relative z-10">
          <h2 class="text-base font-bold text-content mb-4 flex items-center gap-2 tracking-widest uppercase">
            <Icon name="lucide:flame" class="text-primary w-5 h-5" />
            Partido Destacado
          </h2>
          <div class="relative bg-surface/80 backdrop-blur-3xl rounded-[2rem] border border-border shadow-xl p-8 sm:p-12 hover:shadow-2xl hover:border-primary/50 transition-all duration-500 overflow-hidden">
            <!-- Volumetric Light Orb -->
            <div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none group-hover:bg-primary/20 transition-colors duration-500"></div>

            <div v-if="featuredMatch" class="relative z-10">
            
            <div class="flex flex-col sm:flex-row items-center justify-between gap-8">
              <!-- Home -->
              <div class="flex flex-col items-center text-center w-full sm:w-1/3">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mb-6 drop-shadow-xl relative">
                  <div class="absolute inset-0 bg-surface-hover/50 rounded-full blur-xl"></div>
                  <img v-if="teamLogo(featuredMatch.homeTeamId)" :src="teamLogo(featuredMatch.homeTeamId)" class="w-full h-full object-contain relative z-10" />
                  <div v-else class="w-full h-full rounded-full bg-background flex items-center justify-center border border-border relative z-10"><Icon name="lucide:shield" class="w-12 h-12 text-slate-300" /></div>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-content leading-tight">{{ teamName(featuredMatch.homeTeamId) }}</h3>
              </div>

              <!-- Score -->
              <div class="flex flex-col items-center w-full sm:w-1/3 shrink-0">
                <div v-if="featuredMatch.status === 'IN_PROGRESS' || featuredMatch.status === 'FINISHED'" class="flex items-center gap-6">
                  <span class="text-7xl sm:text-9xl font-display text-content tabular-nums drop-shadow-sm">{{ featuredMatch.homeScore ?? 0 }}</span>
                  <span class="text-4xl text-primary/50 font-light">-</span>
                  <span class="text-7xl sm:text-9xl font-display text-content tabular-nums drop-shadow-sm">{{ featuredMatch.awayScore ?? 0 }}</span>
                </div>
                <div v-else class="text-center">
                  <div class="text-6xl sm:text-8xl font-display text-content tabular-nums tracking-tight drop-shadow-sm">
                    {{ formatTime(featuredMatch.matchDate) }}
                  </div>
                  <div class="text-base font-medium text-primary mt-4 tracking-widest uppercase">{{ formatDateShort(featuredMatch.matchDate) }}</div>
                </div>
                
                <div v-if="featuredMatch.status === 'IN_PROGRESS'" class="mt-8">
                  <NuxtLink :to="`/matches/${featuredMatch.id}`" 
                    class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-content font-bold text-sm hover:bg-primary transition-colors shadow-lg shadow-emerald-600/20">
                    <Icon name="lucide:play" class="w-4 h-4 fill-current" />
                    Seguir Partido
                  </NuxtLink>
                </div>
              </div>

              <!-- Away -->
              <div class="flex flex-col items-center text-center w-full sm:w-1/3">
                <div class="w-24 h-24 sm:w-32 sm:h-32 mb-6 drop-shadow-xl relative">
                  <div class="absolute inset-0 bg-surface-hover/50 rounded-full blur-xl"></div>
                  <img v-if="teamLogo(featuredMatch.awayTeamId)" :src="teamLogo(featuredMatch.awayTeamId)" class="w-full h-full object-contain relative z-10" />
                  <div v-else class="w-full h-full rounded-full bg-background flex items-center justify-center border border-border relative z-10"><Icon name="lucide:shield" class="w-12 h-12 text-slate-300" /></div>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-content leading-tight">{{ teamName(featuredMatch.awayTeamId) }}</h3>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12 text-content-muted">No hay partidos destacados en este momento.</div>
          </div>
        </div>

        <!-- POSICIONES MINI -->
        <div class="md:col-span-6 lg:col-span-4 bg-surface/80 backdrop-blur-3xl rounded-[2rem] border border-border shadow-xl p-6 sm:p-8 flex flex-col hover:border-primary/50 transition-all duration-300">
          <div class="flex items-center justify-between mb-8">
             <h3 class="text-base font-bold text-content flex items-center gap-2 tracking-widest uppercase">
               <Icon name="lucide:list" class="text-emerald-400 w-5 h-5" /> Posiciones
             </h3>
             <NuxtLink to="/standings" class="text-emerald-400 hover:text-emerald-300 text-sm font-bold uppercase tracking-widest">Completa</NuxtLink>
          </div>
          
          <div class="flex-1">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest w-8">#</th>
                  <th class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest">Club</th>
                  <th class="pb-4 text-xs font-bold text-content-muted uppercase tracking-widest text-right w-10">PJ</th>
                  <th class="pb-4 text-xs font-bold text-primary uppercase tracking-widest text-right">PTS</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-for="(team, index) in topTeams" :key="team.id" class="border-b border-border hover:bg-background/80 transition-colors cursor-pointer" @click="$router.push(`/teams/${team.id}`)">
                  <td class="py-4 text-content-muted font-bold" :class="index < 3 ? 'text-primary font-display text-xl' : ''">{{ index + 1 }}</td>
                  <td class="py-4">
                    <div class="flex items-center gap-3">
                      <img v-if="team.logo" :src="team.logo" class="w-8 h-8 object-contain drop-shadow-md"/>
                      <div v-else class="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border"><Icon name="lucide:shield" class="w-4 h-4 text-slate-300" /></div>
                      <span class="font-bold text-content text-base">{{ team.name }}</span>
                    </div>
                  </td>
                  <td class="py-4 text-content-muted text-right font-medium">{{ team.stats?.played || 0 }}</td>
                  <td class="py-4 font-display text-2xl text-primary text-right">{{ team.points || 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ÚLTIMOS RESULTADOS -->
        <div class="md:col-span-6 lg:col-span-8">
          <div class="flex items-center justify-between mb-4">
             <h2 class="text-base font-bold text-content tracking-widest uppercase">Últimos Resultados</h2>
             <NuxtLink to="/matches" class="text-sm font-bold tracking-widest uppercase text-primary flex items-center gap-1 hover:text-emerald-700">
               Ver todos <Icon name="lucide:arrow-right" class="w-4 h-4"/>
             </NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="match in recentMatches" :key="match.id" 
              class="bg-surface/80 backdrop-blur-md rounded-2xl border border-border shadow-md p-5 hover:bg-surface hover:border-primary/50 transition-all cursor-pointer group" @click="$router.push('/matches')">
              <div class="text-[10px] font-bold text-content-muted mb-4 flex justify-between uppercase tracking-widest">
                <span>{{ formatDateShort(match.matchDate) }}</span>
                <span class="text-primary">Final</span>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img v-if="teamLogo(match.homeTeamId)" :src="teamLogo(match.homeTeamId)" class="w-8 h-8 object-contain drop-shadow-md"/>
                    <div v-else class="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border"><Icon name="lucide:shield" class="w-4 h-4 text-slate-300" /></div>
                    <span class="text-base font-bold text-content group-hover:text-content transition-colors">{{ teamName(match.homeTeamId) }}</span>
                  </div>
                  <span class="text-3xl font-display text-content">{{ match.homeScore ?? 0 }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img v-if="teamLogo(match.awayTeamId)" :src="teamLogo(match.awayTeamId)" class="w-8 h-8 object-contain drop-shadow-md"/>
                    <div v-else class="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border"><Icon name="lucide:shield" class="w-4 h-4 text-slate-300" /></div>
                    <span class="text-base font-bold text-content group-hover:text-content transition-colors">{{ teamName(match.awayTeamId) }}</span>
                  </div>
                  <span class="text-3xl font-display text-content">{{ match.awayScore ?? 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- GOLEADORES -->
        <div class="md:col-span-12 lg:col-span-4 bg-surface/80 backdrop-blur-3xl rounded-[2rem] border border-border shadow-xl p-6 sm:p-8 hover:border-primary/50 transition-all duration-300">
          <h3 class="text-base font-bold text-content mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Icon name="lucide:crosshair" class="text-primary w-5 h-5" /> Goleadores
          </h3>
          <div class="space-y-2">
            <NuxtLink v-for="(player, index) in topScorers" :key="player.id" :to="`/players/${player.id}`"
              class="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-background/80 transition-colors group">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border overflow-hidden">
                  <img v-if="player.picture" :src="player.picture" class="w-full h-full object-cover" />
                  <Icon v-else name="lucide:user" class="w-5 h-5 text-content-muted group-hover:text-content-muted transition-colors" />
                </div>
                <div>
                  <h4 class="font-bold text-content text-sm group-hover:text-primary transition-colors">{{ player.firstName }} {{ player.lastName }}</h4>
                  <p class="text-xs font-medium text-content-muted">{{ teamName(player.teamId) }}</p>
                </div>
              </div>
              <div class="text-3xl font-display text-primary">
                {{ player.stats?.goals || 0 }}
              </div>
            </NuxtLink>
            <div v-if="topScorers.length === 0" class="text-content-muted text-sm py-4 text-center">No hay datos disponibles</div>
          </div>
        </div>
        
      </div>
    </div>

    <!-- ── LOGGED IN VIEW ────────────────────────────────── -->
    <div v-else class="max-w-7xl mx-auto py-8">
      
      <!-- ==============================================
           VISTA DIRIGENTE
           ============================================== -->
      <template v-if="authStore.isDirigente">
        <!-- Cabecera de Equipo -->
        <div class="mb-10 flex flex-col md:flex-row items-center md:items-end gap-6 bg-surface/80 p-8 rounded-[2rem] border border-border shadow-lg relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none"></div>
          
          <div class="w-24 h-24 rounded-2xl bg-background border border-border shadow-md flex items-center justify-center p-2 shrink-0 z-10">
            <img v-if="myTeam?.logo" :src="myTeam.logo" class="w-full h-full object-contain" />
            <Icon v-else name="lucide:shield" class="w-10 h-10 text-slate-300" />
          </div>
          <div class="text-center md:text-left z-10">
            <h1 class="text-3xl font-bold text-content mb-1">
              {{ myTeam?.name || 'Tu Equipo' }}
            </h1>
            <p class="text-content-muted text-sm uppercase tracking-widest font-bold">
              Hola, <span class="text-primary">{{ authStore.user?.email?.split('@')[0] }}</span>
            </p>
          </div>
          
          <div class="md:ml-auto flex gap-4 text-center mt-4 md:mt-0 z-10">
             <div class="bg-background px-6 py-3 rounded-2xl border border-border shadow-sm">
               <div class="text-3xl font-display text-primary">{{ myTeam?.points || 0 }}</div>
               <div class="text-[10px] uppercase tracking-widest font-bold text-content-muted mt-1">Puntos</div>
             </div>
             <div class="bg-background px-6 py-3 rounded-2xl border border-border shadow-sm">
               <div class="text-3xl font-display text-content">{{ myTeam?.matchesPlayed || 0 }}</div>
               <div class="text-[10px] uppercase tracking-widest font-bold text-content-muted mt-1">Partidos</div>
             </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          <!-- Próximo Partido (Col span 7) -->
          <div class="lg:col-span-7 bg-surface rounded-[2rem] border border-border shadow-md p-8 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none group-hover:bg-primary/20 transition-colors"></div>
            
            <div class="flex items-center justify-between mb-8 z-10 relative">
              <h2 class="text-base font-bold text-content uppercase tracking-widest flex items-center gap-2">
                <Icon name="lucide:calendar-check" class="text-primary w-5 h-5" />
                Tu Próximo Encuentro
              </h2>
            </div>
            
            <div v-if="myNextMatch" class="relative z-10">
              <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
                <!-- Home -->
                <div class="flex flex-col items-center text-center w-full sm:w-1/3">
                  <div class="w-20 h-20 mb-4 drop-shadow-md">
                    <img v-if="teamLogo(myNextMatch.homeTeamId)" :src="teamLogo(myNextMatch.homeTeamId)" class="w-full h-full object-contain" />
                    <div v-else class="w-full h-full rounded-full bg-background flex items-center justify-center border border-border"><Icon name="lucide:shield" class="w-8 h-8 text-slate-300" /></div>
                  </div>
                  <h3 class="text-lg font-bold text-content leading-tight">{{ teamName(myNextMatch.homeTeamId) }}</h3>
                </div>

                <!-- Score / Date -->
                <div class="flex flex-col items-center w-full sm:w-1/3 shrink-0">
                  <div v-if="myNextMatch.status === 'IN_PROGRESS' || myNextMatch.status === 'FINISHED'" class="flex items-center gap-4">
                    <span class="text-5xl font-display text-content tabular-nums">{{ myNextMatch.homeScore ?? 0 }}</span>
                    <span class="text-2xl text-primary/50 font-light">-</span>
                    <span class="text-5xl font-display text-content tabular-nums">{{ myNextMatch.awayScore ?? 0 }}</span>
                  </div>
                  <div v-else class="text-center">
                    <div class="text-4xl font-display text-content tabular-nums tracking-tight">
                      {{ formatTime(myNextMatch.matchDate) }}
                    </div>
                    <div class="text-xs font-bold text-primary mt-2 tracking-widest uppercase">{{ formatDateShort(myNextMatch.matchDate) }}</div>
                  </div>
                  <div class="mt-4">
                     <span class="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">{{ statusText(myNextMatch.status) }}</span>
                  </div>
                </div>

                <!-- Away -->
                <div class="flex flex-col items-center text-center w-full sm:w-1/3">
                  <div class="w-20 h-20 mb-4 drop-shadow-md">
                    <img v-if="teamLogo(myNextMatch.awayTeamId)" :src="teamLogo(myNextMatch.awayTeamId)" class="w-full h-full object-contain" />
                    <div v-else class="w-full h-full rounded-full bg-background flex items-center justify-center border border-border"><Icon name="lucide:shield" class="w-8 h-8 text-slate-300" /></div>
                  </div>
                  <h3 class="text-lg font-bold text-content leading-tight">{{ teamName(myNextMatch.awayTeamId) }}</h3>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-content-muted text-sm font-medium">
              No tienes partidos programados.
            </div>
          </div>

          <!-- Alertas Rojas (Col span 5) -->
          <div class="lg:col-span-5 flex flex-col gap-6">
            <!-- Suspendidos -->
            <div class="bg-surface rounded-[2rem] border border-red-200/50 shadow-md p-6 relative overflow-hidden h-full">
              <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
              
              <h2 class="text-sm font-bold text-red-600 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Icon name="lucide:alert-octagon" class="w-4 h-4" />
                No Juegan (Suspendidos)
              </h2>
              <div class="space-y-3">
                <div v-for="p in suspendedPlayers" :key="p.id" class="flex items-center justify-between bg-red-50/50 p-3 rounded-xl border border-red-100">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-background flex items-center justify-center overflow-hidden border border-red-200">
                      <img v-if="p.picture" :src="p.picture" class="w-full h-full object-cover" />
                      <Icon v-else name="lucide:user" class="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h4 class="font-bold text-content text-sm">{{ p.firstName }} {{ p.lastName }}</h4>
                      <p class="text-[10px] text-red-500 font-bold uppercase tracking-widest">{{ p.stats?.redCards > 0 ? 'Roja Directa' : 'Acumulación' }}</p>
                    </div>
                  </div>
                </div>
                <div v-if="!suspendedPlayers.length" class="text-emerald-600 text-sm font-medium bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <Icon name="lucide:check-circle" class="w-4 h-4" /> Plantilla limpia
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <!-- Rendimiento (Col span 4) -->
          <div class="lg:col-span-4 bg-surface rounded-[2rem] border border-border shadow-md p-6">
            <h2 class="text-sm font-bold text-content uppercase tracking-widest flex items-center gap-2 mb-6">
              <Icon name="lucide:trending-up" class="w-4 h-4 text-primary" />
              Rendimiento
            </h2>
            
            <div class="mb-6">
              <h3 class="text-xs text-content-muted font-bold uppercase tracking-widest mb-3">Racha (Últimos 5)</h3>
              <div class="flex items-center gap-2">
                <div v-for="(m, i) in recentForm" :key="i" 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  :class="m.color">
                  {{ m.result }}
                </div>
                <div v-if="!recentForm.length" class="text-sm text-content-muted">Sin partidos previos</div>
              </div>
            </div>

            <div>
              <h3 class="text-xs text-content-muted font-bold uppercase tracking-widest mb-3">Riesgo (En Capilla)</h3>
              <div class="space-y-2">
                <div v-for="p in atRiskPlayers" :key="p.id" class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-amber-400"></div>
                  <span class="text-sm font-medium text-content">{{ p.firstName }} {{ p.lastName }}</span>
                </div>
                <div v-if="!atRiskPlayers.length" class="text-sm text-content-muted">Nadie en riesgo</div>
              </div>
            </div>
          </div>

          <!-- Obligaciones (Col span 4) -->
          <div class="lg:col-span-4 bg-surface rounded-[2rem] border border-border shadow-md p-6">
            <h2 class="text-sm font-bold text-content uppercase tracking-widest flex items-center gap-2 mb-6">
              <Icon name="lucide:receipt" class="w-4 h-4 text-primary" />
              Obligaciones
            </h2>
            
            <div class="bg-background rounded-xl p-4 border border-border mb-4">
              <div class="text-[10px] text-content-muted font-bold uppercase tracking-widest mb-1">Deuda Total</div>
              <div class="text-3xl font-display text-red-500">${{ totalDebt.toFixed(2) }}</div>
            </div>
            
            <h3 class="text-xs text-content-muted font-bold uppercase tracking-widest mb-3">Multas Recientes</h3>
            <div class="space-y-3">
              <div v-for="fine in recentFines" :key="fine.id" class="flex items-center justify-between p-3 rounded-xl border border-border" :class="fine.status === 'PAID' ? 'bg-emerald-50/50' : 'bg-red-50/50'">
                <div>
                  <h4 class="font-bold text-content text-sm">{{ fine.reason }}</h4>
                  <p class="text-[10px] uppercase font-bold tracking-widest" :class="fine.status === 'PAID' ? 'text-emerald-500' : 'text-red-500'">{{ fine.status === 'PAID' ? 'Pagada' : (fine.status === 'PENDING_VERIFICATION' ? 'En Verificación' : 'Pendiente') }}</p>
                </div>
                <div class="font-bold font-display" :class="fine.status === 'PAID' ? 'text-emerald-600' : 'text-red-600'">${{ fine.amount.toFixed(2) }}</div>
              </div>
              
              <div v-if="!recentFines.length" class="text-sm text-content-muted flex items-center gap-2">
                <Icon name="lucide:check-circle" class="w-4 h-4 text-emerald-500" />
                Al día, sin multas.
              </div>
            </div>
          </div>

          <!-- Accesos Rápidos (Col span 4) -->
          <div class="lg:col-span-4 bg-surface rounded-[2rem] border border-border shadow-md p-6">
            <h2 class="text-sm font-bold text-content uppercase tracking-widest flex items-center gap-2 mb-6">
              <Icon name="lucide:zap" class="text-primary w-5 h-5" />
              Accesos Rápidos
            </h2>
            <div class="space-y-3">
              <NuxtLink v-for="mod in myQuickModules" :key="mod.label" :to="mod.link"
                class="p-4 rounded-xl bg-background hover:bg-emerald-50 transition-colors flex items-center gap-4 border border-border hover:border-emerald-100 group">
                <div class="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-border shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                  <Icon :name="mod.icon" class="text-primary text-lg" />
                </div>
                <div>
                  <h3 class="font-bold text-content text-sm group-hover:text-emerald-700 transition-colors">{{ mod.label }}</h3>
                  <p class="text-[10px] text-content-muted tracking-wide">{{ mod.desc }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <!-- ==============================================
           VISTA ADMIN / SUPERADMIN
           ============================================== -->
      <template v-else>
        <!-- Welcome Section -->
        <div class="mb-10">
          <h1 class="text-3xl font-bold text-content mb-2">
            Hola de nuevo, <span class="text-primary">{{ authStore.user?.email?.split('@')[0] || 'Admin' }}</span>
          </h1>
          <p class="text-content-muted">Resumen administrativo de la liga.</p>
        </div>

        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div v-for="kpi in kpis" :key="kpi.label" 
            class="bg-surface p-6 sm:p-8 rounded-[2rem] border border-border shadow-md flex flex-col gap-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            <div class="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border text-primary shrink-0">
              <Icon :name="kpi.icon" class="text-2xl" />
            </div>
            <div>
              <h3 class="text-4xl font-display text-content tracking-wider">
                <span v-if="dashboardStore.loading" class="inline-block w-8 h-8 rounded bg-surface-hover animate-pulse"></span>
                <span v-else>{{ dashboardStore.stats[kpi.key] }}</span>
              </h3>
              <p class="text-[10px] font-bold text-content-muted mt-2 uppercase tracking-widest">{{ kpi.label }}</p>
            </div>
          </div>
        </div>

        <!-- Main Modules Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Quick Management -->
          <div class="lg:col-span-2 bg-surface rounded-[2rem] border border-border shadow-md p-8">
            <div class="mb-8 flex items-center justify-between">
              <h2 class="text-base font-bold text-content uppercase tracking-widest flex items-center gap-2">
                <Icon name="lucide:zap" class="text-primary w-5 h-5" />
                Accesos Rápidos
              </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NuxtLink v-for="mod in quickModules" :key="mod.label" :to="mod.link"
                class="p-6 rounded-[1.5rem] bg-background hover:bg-emerald-50 transition-colors flex items-start gap-4 border border-border hover:border-emerald-100 group">
                <div class="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border shadow-sm group-hover:scale-110 transition-transform shrink-0">
                  <Icon :name="mod.icon" class="text-primary text-xl" />
                </div>
                <div>
                  <h3 class="font-bold text-content text-sm mb-1 group-hover:text-emerald-700 transition-colors">{{ mod.label }}</h3>
                  <p class="text-xs text-content-muted">{{ mod.desc }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- System Status -->
          <div class="bg-surface rounded-[2rem] border border-border shadow-md p-8">
            <h2 class="text-base font-bold text-content flex items-center gap-2 mb-8 uppercase tracking-widest">
              <Icon name="lucide:activity" class="text-primary w-5 h-5" />
              Estado del Sistema
            </h2>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-content-muted uppercase tracking-widest">Base de Datos</span>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-primary shadow-sm animate-pulse"></span>
                  <span class="text-xs font-bold text-content uppercase tracking-widest">Online</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-content-muted uppercase tracking-widest">API Backend</span>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-primary"></span>
                  <span class="text-xs font-bold text-content uppercase tracking-widest">Conectado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

    </div>

  </div>
</template>

<script setup>
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

const matchStore = useMatchStore()
const teamStore = useTeamStore()
const playerStore = usePlayerStore()
const tournamentStore = useTournamentStore()
const fineStore = useFineStore()

const pageLoading = ref(true)

// Public Dashboard Computed
const featuredMatch = computed(() => {
  const inProgress = matchStore.matches.find(m => m.status === 'IN_PROGRESS')
  if (inProgress) return inProgress
  
  const scheduledList = matchStore.matches.filter(m => m.status === 'SCHEDULED')
  if (scheduledList.length) {
    // Return earliest scheduled
    return scheduledList.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())[0]
  }
  return null
})

const recentMatches = computed(() => {
  return matchStore.matches
    .filter(m => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
    .slice(0, 4)
})

const topTeams = computed(() => {
  return [...teamStore.teams]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 5)
})

const topScorers = computed(() => {
  return [...playerStore.players]
    .filter(p => p.stats?.goals > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals)
    .slice(0, 5)
})

// Helpers
const todayDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

function teamName(id) {
  const t = teamStore.teams.find(x => x.id === id)
  return t ? t.name : 'Unknown'
}

function teamLogo(id) {
  const t = teamStore.teams.find(x => x.id === id)
  return t ? t.logo : null
}

function formatTime(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

function statusText(status) {
  const map = { SCHEDULED: 'Programado', IN_PROGRESS: 'En Vivo', FINISHED: 'Finalizado', CANCELLED: 'Suspendido' }
  return map[status] || status
}

// Admin Dashboard Data
const kpis = [
  { label: 'Sedes', icon: 'lucide:map-pin', key: 'venues', color: 'from-emerald-400 to-emerald-600' },
  { label: 'Torneos', icon: 'lucide:trophy', key: 'tournaments', color: 'from-blue-400 to-blue-600' },
  { label: 'Equipos', icon: 'lucide:shield', key: 'teams', color: 'from-purple-400 to-purple-600' },
  { label: 'Jugadores', icon: 'lucide:users', key: 'players', color: 'from-orange-400 to-orange-600' },
]

const quickModules = [
  { label: 'Hojas de Vocalía', icon: 'lucide:clipboard-list', desc: 'Gestionar planillas en vivo', link: '/vocalia' },
  { label: 'Programación', icon: 'lucide:calendar-clock', desc: 'Asignar horarios y canchas', link: '/matches' },
  { label: 'Opciones', desc: 'Ajustes del sistema', icon: 'lucide:settings', link: '/settings' },
  { label: 'Estadísticas', icon: 'lucide:bar-chart-3', desc: 'Goleadores y posiciones', link: '/standings' },
]

// Dirigente Dashboard Computed
const myTeam = computed(() => teamStore.teams[0] || null)

const myNextMatch = computed(() => {
  const inProgress = matchStore.matches.find(m => m.status === 'IN_PROGRESS')
  if (inProgress) return inProgress
  
  const scheduledList = matchStore.matches.filter(m => m.status === 'SCHEDULED')
  if (scheduledList.length) {
    return scheduledList.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())[0]
  }
  
  // Si no hay futuros, el último jugado
  const lastPlayed = matchStore.matches.filter(m => m.status === 'FINISHED')
  if (lastPlayed.length) {
    return lastPlayed.sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())[0]
  }
  return null
})

const maxYellowCardsForSuspension = computed(() => {
  if (!myTeam.value || !myTeam.value.tournamentId) return 2 // Default fallback
  const myTournament = tournamentStore.tournaments.find(t => t.id === myTeam.value.tournamentId)
  return myTournament?.maxYellowCardsForSuspension ?? 2
})

const suspendedPlayers = computed(() => {
  return playerStore.players.filter(p => (p.stats?.redCards || 0) > 0 || (p.stats?.yellowCards || 0) >= maxYellowCardsForSuspension.value)
})

const atRiskPlayers = computed(() => {
  return playerStore.players.filter(p => (p.stats?.yellowCards || 0) === maxYellowCardsForSuspension.value - 1 && (p.stats?.redCards || 0) === 0)
})

const recentForm = computed(() => {
  if (!myTeam.value) return []
  const teamId = myTeam.value.id
  
  const finished = matchStore.matches
    .filter(m => m.status === 'FINISHED' && (m.homeTeamId === teamId || m.awayTeamId === teamId))
    .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
    .slice(0, 5)
    .reverse()
    
  return finished.map(m => {
    const isHome = m.homeTeamId === teamId
    const myScore = isHome ? (m.homeScore || 0) : (m.awayScore || 0)
    const theirScore = isHome ? (m.awayScore || 0) : (m.homeScore || 0)
    
    if (myScore > theirScore) return { result: 'V', color: 'bg-emerald-500' }
    if (myScore < theirScore) return { result: 'D', color: 'bg-red-500' }
    return { result: 'E', color: 'bg-slate-400' }
  })
})

const totalDebt = computed(() => {
  return fineStore.fines
    .filter(f => f.status === 'PENDING' || f.status === 'PENDING_VERIFICATION')
    .reduce((sum, f) => sum + f.amount, 0)
})

const recentFines = computed(() => {
  return [...fineStore.fines]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 3)
})

const myTopScorer = computed(() => {
  return [...playerStore.players]
    .filter(p => p.stats?.goals > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals)[0] || null
})

const myQuickModules = [
  { label: 'Mi Plantilla', icon: 'lucide:users', desc: 'Inscribir o editar jugadores', link: '/players' },
  { label: 'Datos del Club', icon: 'lucide:shield', desc: 'Actualizar logo e info', link: '/teams' },
  { label: 'Calendario', icon: 'lucide:calendar', desc: 'Ver próximos partidos', link: '/matches' },
  { label: 'Obligaciones', icon: 'lucide:receipt', desc: 'Abonar multas o deudas', link: '/' },
]

onMounted(async () => {
  pageLoading.value = true
  if (authStore.isLoggedIn) {
     if (authStore.isSuperAdmin || authStore.isAdmin) {
       await dashboardStore.fetchSummary()
     } else {
       // Dirigente y Vocal
       await Promise.all([
         matchStore.fetchMatches(),
         teamStore.fetchTeams(),
         playerStore.fetchPlayers(),
         tournamentStore.fetchTournaments(),
         fineStore.fetchFines()
       ])
     }
  } else {
     await Promise.all([
       matchStore.fetchMatches(),
       teamStore.fetchTeams(),
       playerStore.fetchPlayers()
     ])
  }
  pageLoading.value = false
})
</script>
