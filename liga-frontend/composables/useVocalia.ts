import { $api } from '~/composables/useApi'

export type VocaliaPhase = 'checkin' | 'formation' | 'live'

export function useVocalia() {
  const teamStore = useTeamStore()
  const playerStore = usePlayerStore()

  // ── Core state ─────────────────────────────────────────
  const phase = ref<VocaliaPhase>('checkin')
  const selectedMatchId = ref('')
  const matches = ref<any[]>([])
  const lineup = ref<any[]>([])

  // Auto-load data when match changes
  watch(selectedMatchId, (newId) => {
    if (newId) {
      loadLineup()
      loadSuspensions()
      const m = matches.value.find(m => m.id === newId)
      if (m?.status === 'IN_PROGRESS' || m?.status === 'FINISHED') {
        loadEvents()
      }
    }
  })

  // ── Timer State ────────────────────────────────────────
  const matchMinute = ref(0)
  const matchMinuteFormatted = ref("00:00")
  let timerInterval: any = null

  function updateTimer() {
    const m = activeMatch.value
    if (!m) {
      matchMinute.value = 0
      matchMinuteFormatted.value = "00:00"
      return
    }

    if (m.status === 'FINISHED') {
      matchMinuteFormatted.value = "Finalizado"
      return
    }

    if (m.firstHalfStartedAt && !m.firstHalfEndedAt) {
      // 1er Tiempo en curso
      const diffMs = new Date().getTime() - new Date(m.firstHalfStartedAt).getTime()
      let diffSecs = Math.floor(diffMs / 1000)
      if (diffSecs < 0) diffSecs = 0
      
      const mins = Math.floor(diffSecs / 60)
      const secs = diffSecs % 60
      matchMinute.value = mins === 0 ? 1 : mins + 1 // Para el backend 1, 2, etc.

      if (mins >= 45) {
        matchMinuteFormatted.value = `45'+ ${mins - 45}`
      } else {
        matchMinuteFormatted.value = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }
    } else if (m.firstHalfEndedAt && !m.secondHalfStartedAt) {
      // Medio Tiempo
      matchMinute.value = 45
      matchMinuteFormatted.value = "MD"
    } else if (m.secondHalfStartedAt) {
      // 2do Tiempo en curso
      const diffMs = new Date().getTime() - new Date(m.secondHalfStartedAt).getTime()
      let diffSecs = Math.floor(diffMs / 1000)
      if (diffSecs < 0) diffSecs = 0

      const mins = 45 + Math.floor(diffSecs / 60)
      const secs = diffSecs % 60
      matchMinute.value = mins + 1

      if (mins >= 90) {
        matchMinuteFormatted.value = `90'+ ${mins - 90}`
      } else {
        matchMinuteFormatted.value = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }
    } else {
       matchMinute.value = 0
       matchMinuteFormatted.value = "00:00"
    }
  }

  onMounted(() => {
    timerInterval = setInterval(updateTimer, 1000)
  })

  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
  })

  const events = ref<any[]>([])
  const suspensions = ref<any[]>([])
  const referees = ref<any[]>([])
  const loadingLineup = ref(false)
  const loadingEvents = ref(false)
  const loadingReferees = ref(false)

  // ── Helpers ───────────────────────────────────────────
  const activeMatch = computed(() => matches.value.find(m => m.id === selectedMatchId.value))

  const hydrateLineupItem = (item: any) => {
    const player = playerStore.players.find(p => p.id === item.playerId)
    return { ...item, id: item._id || item.id, player }
  }

  const homeLineup = computed(() => lineup.value.filter(l => l.teamId === activeMatch.value?.homeTeamId))
  const awayLineup = computed(() => lineup.value.filter(l => l.teamId === activeMatch.value?.awayTeamId))
  const homeStarters = computed(() => homeLineup.value.filter(l => l.status === 'STARTER'))
  const awayStarters = computed(() => awayLineup.value.filter(l => l.status === 'STARTER'))

  // ── Rules & Constraints ───────────────────────────────
  const MIN_PLAYERS = 2
  const MAX_PLAYERS = 4
  const homeReady = computed(() => homeActiveLineup.value.length >= MIN_PLAYERS)
  const awayReady = computed(() => awayActiveLineup.value.length >= MIN_PLAYERS)
  const matchCanStart = computed(() => homeReady.value && awayReady.value)

  const homeActiveLineup = computed(() => {
    let current = [...homeStarters.value]
    const teamId = activeMatch.value?.homeTeamId
    if (!teamId) return []
    const relevantEvents = events.value
      .filter(ev => (ev.type === 'SUBSTITUTION' || ev.type === 'PLAYER_ENTRY') && ev.teamId === teamId)
      .sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0))

    relevantEvents.forEach(ev => {
      if (ev.type === 'SUBSTITUTION') {
        current = current.filter(p => (p.playerId || p.id) !== ev.playerId)
        const newcomer = playerStore.players.find(p => p.id === ev.relatedPlayerId)
        if (newcomer) {
          current.push({
            id: `sub-${ev.id}`,
            playerId: newcomer.id,
            teamId: ev.teamId,
            status: 'STARTER',
            checkedIn: true,
            player: newcomer
          })
        }
      } else if (ev.type === 'PLAYER_ENTRY') {
        const newcomer = playerStore.players.find(p => p.id === ev.playerId)
        if (newcomer && !current.some(p => p.playerId === newcomer.id)) {
          current.push({
            id: `entry-${ev.id}`,
            playerId: newcomer.id,
            teamId: ev.teamId,
            status: 'STARTER',
            checkedIn: true,
            player: newcomer
          })
        }
      }
    })
    return current
  })

  const awayActiveLineup = computed(() => {
    let current = [...awayStarters.value]
    const teamId = activeMatch.value?.awayTeamId
    if (!teamId) return []
    const relevantEvents = events.value
      .filter(ev => (ev.type === 'SUBSTITUTION' || ev.type === 'PLAYER_ENTRY') && ev.teamId === teamId)
      .sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0))

    relevantEvents.forEach(ev => {
      if (ev.type === 'SUBSTITUTION') {
        current = current.filter(p => (p.playerId || p.id) !== ev.playerId)
        const newcomer = playerStore.players.find(p => p.id === ev.relatedPlayerId)
        if (newcomer) {
          current.push({
            id: `sub-${ev.id}`,
            playerId: newcomer.id,
            teamId: ev.teamId,
            status: 'STARTER',
            checkedIn: true,
            player: newcomer
          })
        }
      } else if (ev.type === 'PLAYER_ENTRY') {
        const newcomer = playerStore.players.find(p => p.id === ev.playerId)
        if (newcomer && !current.some(p => p.playerId === newcomer.id)) {
          current.push({
            id: `entry-${ev.id}`,
            playerId: newcomer.id,
            teamId: ev.teamId,
            status: 'STARTER',
            checkedIn: true,
            player: newcomer
          })
        }
      }
    })
    return current
  })

  const homeSubstitutes = computed(() => {
    const teamId = activeMatch.value?.homeTeamId
    if (!teamId) return []
    const onField = homeActiveLineup.value.map(s => s.playerId)
    return playerStore.players
      .filter(p => p.teamId === teamId && !onField.includes(p.id))
      .map(p => {
        const item = lineup.value.find(l => l.playerId === p.id)
        return {
          id: item?.id || null,
          playerId: p.id,
          teamId,
          player: p,
          status: item?.status || 'SUBSTITUTE',
          checkedIn: item?.checkedIn || false,
          isVerified: !!item?.checkedIn
        }
      })
  })

  const awaySubstitutes = computed(() => {
    const teamId = activeMatch.value?.awayTeamId
    if (!teamId) return []
    const onField = awayActiveLineup.value.map(s => s.playerId)
    return playerStore.players
      .filter(p => p.teamId === teamId && !onField.includes(p.id))
      .map(p => {
        const item = lineup.value.find(l => l.playerId === p.id)
        return {
          id: item?.id || null,
          playerId: p.id,
          teamId,
          player: p,
          status: item?.status || 'SUBSTITUTE',
          checkedIn: item?.checkedIn || false,
          isVerified: !!item?.checkedIn
        }
      })
  })

  const suspendedPlayerIds = computed(() =>
    suspensions.value.filter((s: any) => s.status === 'ACTIVE').map((s: any) => s.playerId)
  )
  const checkedInPlayers = computed(() => lineup.value.filter(l => l.checkedIn))

  const lineupForPlayer = (playerId: string) => lineup.value.find(l => l.playerId === playerId)

  // ── Data loading (usando $fetch / $api, NO useFetch) ──
  async function loadMatches() {
    try {
      const res: any = await $api('/matches')
      matches.value = (res?.data || []).map((m: any) => ({ ...m, id: m._id || m.id }))
      const live = matches.value.find(m => m.status === 'IN_PROGRESS')
      if (live) selectedMatchId.value = live.id
    } catch (e) { console.error('loadMatches:', e) }
  }

  async function loadLineup() {
    if (!selectedMatchId.value) return
    loadingLineup.value = true
    try {
      const res: any = await $api(`/match-lineups/${selectedMatchId.value}`)
      lineup.value = (res?.data || []).map(hydrateLineupItem)
    } catch (e) { console.error('loadLineup:', e) }
    finally { loadingLineup.value = false }
  }

  async function loadEvents() {
    if (!selectedMatchId.value) return
    loadingEvents.value = true
    try {
      const res: any = await $api(`/match-events/${selectedMatchId.value}`)
      events.value = (res?.data || []).sort((a: any, b: any) => (b.minute ?? 0) - (a.minute ?? 0))
    } catch (e) { console.error('loadEvents:', e) }
    finally { loadingEvents.value = false }
  }

  async function loadSuspensions() {
    try {
      const res: any = await $api('/suspensions')
      suspensions.value = res?.data || []
    } catch (e) { console.error('loadSuspensions:', e) }
  }

  async function loadReferees() {
    loadingReferees.value = true
    try {
      const res: any = await $api('/referees')
      referees.value = res?.data || []
    } catch (e) { console.error('loadReferees:', e) }
    finally { loadingReferees.value = false }
  }

  async function refreshMatches() {
    try {
      const res: any = await $api('/matches')
      matches.value = (res?.data || []).map((m: any) => ({ ...m, id: m._id || m.id }))
    } catch (e) { console.error('refreshMatches:', e) }
  }

  async function selectMatch(id: string) {
    selectedMatchId.value = id
    lineup.value = []
    events.value = []
    const m = matches.value.find(m => m.id === id)
    if (m?.status === 'IN_PROGRESS' || m?.status === 'FINISHED') {
      phase.value = 'live'
    } else {
      phase.value = 'checkin'
    }
    await Promise.all([loadLineup(), loadSuspensions(), loadReferees()])
    if (phase.value === 'live') await loadEvents()
  }

  // ── Lineup CRUD ────────────────────────────────────────
  async function addToLineup(playerId: string, teamId: string, checkedIn: boolean = false, status: 'STARTER' | 'SUBSTITUTE' = 'STARTER') {
    if (!selectedMatchId.value) return
    await $api('/match-lineups', {
      method: 'POST',
      body: { 
        matchId: selectedMatchId.value, 
        playerId, 
        teamId, 
        status,
        checkedIn
      }
    })
    await loadLineup()
  }

  async function removeFromLineup(lineupId: string) {
    await $api(`/match-lineups/${lineupId}`, { method: 'DELETE' })
    await loadLineup()
  }

  async function toggleCheckIn(lineupId: string, current: boolean) {
    await $api(`/match-lineups/${lineupId}`, { method: 'PUT', body: { checkedIn: !current } })
    await loadLineup()
  }

  async function setLineupStatus(lineupId: string, status: 'STARTER' | 'SUBSTITUTE') {
    await $api(`/match-lineups/${lineupId}`, { method: 'PUT', body: { status } })
    await loadLineup()
  }

  // ── Match status / Arbitration ─────────────────────────
  async function saveArbitration(payload: { refereeId?: string, assistant1Id?: string, assistant2Id?: string, fourthRefereeId?: string }) {
    if (!selectedMatchId.value) return
    await $api(`/matches/${selectedMatchId.value}`, { method: 'PUT', body: payload })
    await refreshMatches()
  }

  async function startMatch() {
    if (!selectedMatchId.value) return
    const now = new Date().toISOString()
    await $api(`/matches/${selectedMatchId.value}`, { method: 'PUT', body: { status: 'IN_PROGRESS', firstHalfStartedAt: now } })
    await refreshMatches()
    phase.value = 'live'
    await loadEvents()
    updateTimer()
  }

  async function endFirstHalf() {
    if (!selectedMatchId.value) return
    const now = new Date().toISOString()
    await $api(`/matches/${selectedMatchId.value}`, { method: 'PUT', body: { firstHalfEndedAt: now } })
    await refreshMatches()
    updateTimer()
  }

  async function startSecondHalf() {
    if (!selectedMatchId.value) return
    const now = new Date().toISOString()
    await $api(`/matches/${selectedMatchId.value}`, { method: 'PUT', body: { secondHalfStartedAt: now } })
    await refreshMatches()
    updateTimer()
  }

  async function finishMatch() {
    await $api(`/matches/${selectedMatchId.value}`, { method: 'PUT', body: { status: 'FINISHED' } })
    await refreshMatches()
    updateTimer()
  }

  // ── Events ─────────────────────────────────────────────
  async function addEvent(payload: any) {
    const match = activeMatch.value
    const body = { ...payload, matchId: selectedMatchId.value, tournamentId: match?.tournamentId }
    console.log('[useVocalia] addEvent Calling API with:', body)
    try {
      await $api('/match-events', {
        method: 'POST',
        body
      })
      console.log('[useVocalia] addEvent Success. Reloading data...')
      await Promise.all([loadEvents(), loadSuspensions(), refreshMatches()])
    } catch (e) {
      console.error('[useVocalia] addEvent API ERROR:', e)
      throw e
    }
  }

  async function deleteEvent(eventId: string) {
    await $api(`/match-events/${eventId}`, { method: 'DELETE' })
    await loadEvents()
  }

  return {
    phase, selectedMatchId, matches, lineup, events, suspensions, referees,
    loadingLineup, loadingEvents, loadingReferees,
    activeMatch,
    homeLineup, awayLineup, homeStarters, homeActiveLineup, awayActiveLineup, homeSubstitutes, awayStarters, awaySubstitutes,
    suspendedPlayerIds, checkedInPlayers,
    homeReady, awayReady, matchCanStart, MIN_PLAYERS, MAX_PLAYERS,
    matchMinute, matchMinuteFormatted,
    loadMatches, loadLineup, loadEvents, loadSuspensions, loadReferees, selectMatch,
    addToLineup, removeFromLineup, toggleCheckIn, setLineupStatus,
    saveArbitration, startMatch, endFirstHalf, startSecondHalf, finishMatch, addEvent, deleteEvent,
    lineupForPlayer,
  }
}
