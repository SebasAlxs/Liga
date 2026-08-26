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
  const events = ref<any[]>([])
  const suspensions = ref<any[]>([])
  const fines = ref<any[]>([])
  const referees = ref<any[]>([])
  
  const loadingLineup = ref(false)
  const loadingEvents = ref(false)
  const loadingReferees = ref(false)
  
  const isProcessingAction = ref(false)
  const timeOffset = ref(0)

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

    const tStore = useTournamentStore()
    const tournament = tStore.tournaments.find(t => t.id === m.tournamentId)
    const halfDuration = tournament?.matchHalfDurationMinutes ?? 45
    const fullDuration = halfDuration * 2

    if (m.firstHalfStartedAt && !m.firstHalfEndedAt) {
      const diffMs = (new Date().getTime() + timeOffset.value) - new Date(m.firstHalfStartedAt).getTime()
      let diffSecs = Math.floor(diffMs / 1000)
      if (diffSecs < 0) diffSecs = 0
      const mins = Math.floor(diffSecs / 60)
      const secs = diffSecs % 60
      matchMinute.value = mins === 0 ? 1 : mins + 1
      matchMinuteFormatted.value = mins >= halfDuration ? `${halfDuration}'+ ${mins - halfDuration}` : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else if (m.firstHalfEndedAt && !m.secondHalfStartedAt) {
      matchMinute.value = halfDuration
      matchMinuteFormatted.value = "MD"
    } else if (m.secondHalfStartedAt) {
      const diffMs = (new Date().getTime() + timeOffset.value) - new Date(m.secondHalfStartedAt).getTime()
      let diffSecs = Math.floor(diffMs / 1000)
      if (diffSecs < 0) diffSecs = 0
      const mins = halfDuration + Math.floor(diffSecs / 60)
      const secs = diffSecs % 60
      matchMinute.value = mins + 1
      matchMinuteFormatted.value = mins >= fullDuration ? `${fullDuration}'+ ${mins - fullDuration}` : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
       matchMinute.value = 0
       matchMinuteFormatted.value = "00:00"
    }
  }

  let pollInterval: any = null

  onMounted(async () => {
    try {
      const res: any = await $api('/server-time')
      if (res?.now) {
        timeOffset.value = new Date(res.now).getTime() - new Date().getTime()
      }
    } catch (e) {}

    timerInterval = setInterval(updateTimer, 1000)

    pollInterval = setInterval(async () => {
      if (phase.value === 'live' && selectedMatchId.value && !isProcessingAction.value) {
        await Promise.all([loadMatchById(selectedMatchId.value), loadEvents()])
      }
    }, 3000)
  })
  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
    if (pollInterval) clearInterval(pollInterval)
  })

  // ── Helpers & Computed ──────────────────────────────────
  const activeMatch = computed(() => matches.value.find(m => m.id === selectedMatchId.value))

  function teamName(id: string) { return teamStore.teams.find(t => t.id === id)?.name || '' }
  function teamLogo(id: string) { return teamStore.teams.find(t => t.id === id)?.logo || '' }

  const hydrateLineupItem = (item: any) => {
    const player = playerStore.players.find(p => p.id === item.playerId)
    return { ...item, id: item._id || item.id, player }
  }

  const homeLineup = computed(() => lineup.value.filter(l => l.teamId === activeMatch.value?.homeTeamId))
  const awayLineup = computed(() => lineup.value.filter(l => l.teamId === activeMatch.value?.awayTeamId))
  const homeStarters = computed(() => homeLineup.value.filter(l => l.status === 'STARTER'))
  const awayStarters = computed(() => awayLineup.value.filter(l => l.status === 'STARTER'))

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
            id: `sub-${ev.id}`, playerId: newcomer.id, teamId: ev.teamId, status: 'STARTER', checkedIn: true, player: newcomer
          })
        }
      } else if (ev.type === 'PLAYER_ENTRY') {
        const newcomer = playerStore.players.find(p => p.id === ev.playerId)
        if (newcomer && !current.some(p => p.playerId === newcomer.id)) {
          current.push({
            id: `entry-${ev.id}`, playerId: newcomer.id, teamId: ev.teamId, status: 'STARTER', checkedIn: true, player: newcomer
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
            id: `sub-${ev.id}`, playerId: newcomer.id, teamId: ev.teamId, status: 'STARTER', checkedIn: true, player: newcomer
          })
        }
      } else if (ev.type === 'PLAYER_ENTRY') {
        const newcomer = playerStore.players.find(p => p.id === ev.playerId)
        if (newcomer && !current.some(p => p.playerId === newcomer.id)) {
          current.push({
            id: `entry-${ev.id}`, playerId: newcomer.id, teamId: ev.teamId, status: 'STARTER', checkedIn: true, player: newcomer
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
    return playerStore.players.filter(p => p.teamId === teamId && !onField.includes(p.id)).map(p => {
      const item = lineup.value.find(l => l.playerId === p.id)
      return { id: item?.id || null, playerId: p.id, teamId, player: p, status: item?.status || 'SUBSTITUTE', checkedIn: item?.checkedIn || false, isVerified: !!item?.checkedIn }
    })
  })

  const awaySubstitutes = computed(() => {
    const teamId = activeMatch.value?.awayTeamId
    if (!teamId) return []
    const onField = awayActiveLineup.value.map(s => s.playerId)
    return playerStore.players.filter(p => p.teamId === teamId && !onField.includes(p.id)).map(p => {
      const item = lineup.value.find(l => l.playerId === p.id)
      return { id: item?.id || null, playerId: p.id, teamId, player: p, status: item?.status || 'SUBSTITUTE', checkedIn: item?.checkedIn || false, isVerified: !!item?.checkedIn }
    })
  })

  const suspendedPlayerIds = computed(() => suspensions.value.filter((s: any) => s.status === 'ACTIVE').map((s: any) => s.playerId))
  const suspensionForPlayer = (playerId: string) => suspensions.value.find((s: any) => s.playerId === playerId && s.status === 'ACTIVE')
  
  const finesForPlayer = (playerId: string) => fines.value.filter((f: any) => f.playerId === playerId && (f.status === 'PENDING' || f.status === 'PENDING_VERIFICATION'))
  const hasPendingFines = (playerId: string) => finesForPlayer(playerId).length > 0
  const isPlayerBlockedByFines = (playerId: string) => {
    if (!activeMatch.value) return false
    const tStore = useTournamentStore()
    const t = tStore.tournaments.find(t => t.id === activeMatch.value?.tournamentId)
    if (!t?.blockPlayerWithPendingFines) return false
    return hasPendingFines(playerId)
  }

  const redCardedPlayerIds = computed(() => events.value.filter(e => e.type === 'RED_CARD').map(e => e.playerId))
  const checkedInPlayers = computed(() => lineup.value.filter(l => l.checkedIn))
  const lineupForPlayer = (playerId: string) => lineup.value.find(l => l.playerId === playerId)

  const MIN_PLAYERS = computed(() => {
    if (!activeMatch.value) return 7
    const tStore = useTournamentStore()
    const t = tStore.tournaments.find(t => t.id === activeMatch.value?.tournamentId)
    return t?.minPlayersToStartMatch ?? 7
  })
  
  const MAX_PLAYERS = computed(() => {
    if (!activeMatch.value) return 11
    const tStore = useTournamentStore()
    const t = tStore.tournaments.find(t => t.id === activeMatch.value?.tournamentId)
    return t?.maxPlayersOnField ?? 11
  })

  const MAX_FOREIGN_PLAYERS = computed(() => {
    if (!activeMatch.value) return 4
    const tStore = useTournamentStore()
    const t = tStore.tournaments.find(t => t.id === activeMatch.value?.tournamentId)
    return t?.maxForeignPlayersOnField ?? 4
  })

  const homeReady = computed(() => homeActiveLineup.value.length >= MIN_PLAYERS.value)
  const awayReady = computed(() => awayActiveLineup.value.length >= MIN_PLAYERS.value)

  const homeForeignCount = computed(() => homeActiveLineup.value.filter(s => s.player?.isLocal === false).length)
  const awayForeignCount = computed(() => awayActiveLineup.value.filter(s => s.player?.isLocal === false).length)

  const homeValid = computed(() => homeReady.value && homeActiveLineup.value.length <= MAX_PLAYERS.value && homeForeignCount.value <= MAX_FOREIGN_PLAYERS.value)
  const awayValid = computed(() => awayReady.value && awayActiveLineup.value.length <= MAX_PLAYERS.value && awayForeignCount.value <= MAX_FOREIGN_PLAYERS.value)

  const matchCanStart = computed(() => homeValid.value && awayValid.value)

  // ── Data loading ──────────────────────────────────────
  async function loadMatches() {
    try {
      const res: any = await $api('/matches')
      matches.value = (res?.data || []).map((m: any) => ({ ...m, id: m._id || m.id }))
      const live = matches.value.find(m => m.status === 'IN_PROGRESS')
      if (live && !selectedMatchId.value) selectedMatchId.value = live.id
    } catch (e) { console.error('loadMatches:', e) }
  }

  async function loadMatchById(id: string) {
    try {
      const res: any = await $api(`/matches/${id}`)
      if (res?.data) {
        const m = { ...res.data, id: res.data._id || res.data.id }
        const idx = matches.value.findIndex(x => x.id === id)
        if (idx !== -1) matches.value[idx] = m
        else matches.value.push(m)
        return m
      }
    } catch (e) { console.error('loadMatchById:', e) }
    return null
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

  async function loadFines() {
    try {
      const res: any = await $api('/fines')
      fines.value = res?.data || []
    } catch (e) { console.error('loadFines:', e) }
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
    let m = matches.value.find(m => m.id === id)
    if (!m) m = await loadMatchById(id)

    if (m?.status === 'IN_PROGRESS' || m?.status === 'FINISHED') phase.value = 'live'
    else phase.value = 'checkin'
    
    await Promise.all([loadLineup(), loadSuspensions(), loadFines(), loadReferees()])
    if (phase.value === 'live') await loadEvents()
  }

  // ── Actions ───────────────────────────────────────────
  async function addToLineup(playerId: string, teamId: string, checkedIn: boolean = false, status: 'STARTER' | 'SUBSTITUTE' = 'STARTER') {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      if (!selectedMatchId.value) return
      await $api('/match-lineups', { method: 'POST', body: { matchId: selectedMatchId.value, playerId, teamId, status, checkedIn } })
      await loadLineup()
    } finally { isProcessingAction.value = false }
  }

  async function removeFromLineup(lineupId: string) {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      await $api(`/match-lineups/${lineupId}`, { method: 'DELETE' })
      await loadLineup()
    } finally { isProcessingAction.value = false }
  }

  async function toggleCheckIn(lineupId: string, current: boolean) {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      await $api(`/match-lineups/${lineupId}`, { method: 'PUT', body: { checkedIn: !current } })
      await loadLineup()
    } finally { isProcessingAction.value = false }
  }

  async function setLineupStatus(lineupId: string, status: 'STARTER' | 'SUBSTITUTE') {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      await $api(`/match-lineups/${lineupId}`, { method: 'PUT', body: { status } })
      await loadLineup()
    } finally { isProcessingAction.value = false }
  }

  async function saveArbitration(payload: any) {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      if (!selectedMatchId.value) return
      await $api(`/matches/${selectedMatchId.value}`, { method: 'PUT', body: payload })
      await refreshMatches()
    } finally { isProcessingAction.value = false }
  }

  async function startMatch() {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      if (!selectedMatchId.value) return
      const now = new Date().toISOString()
      await $api(`/matches/${selectedMatchId.value}`, { method: 'PUT', body: { status: 'IN_PROGRESS', firstHalfStartedAt: now } })
      await refreshMatches()
      phase.value = 'live'
      await loadEvents()
      updateTimer()
    } finally { isProcessingAction.value = false }
  }

  async function endFirstHalf() {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      if (!selectedMatchId.value) return
      const now = new Date().toISOString()
      await $api(`/matches/${selectedMatchId.value}`, { method: 'PUT', body: { firstHalfEndedAt: now } })
      await refreshMatches()
      updateTimer()
    } finally { isProcessingAction.value = false }
  }

  async function startSecondHalf() {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      if (!selectedMatchId.value) return
      const now = new Date().toISOString()
      await $api(`/matches/${selectedMatchId.value}`, { method: 'PUT', body: { secondHalfStartedAt: now } })
      await refreshMatches()
      updateTimer()
    } finally { isProcessingAction.value = false }
  }

  async function finishMatch() {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      await $api(`/matches/${selectedMatchId.value}`, { method: 'PUT', body: { status: 'FINISHED' } })
      await refreshMatches()
      updateTimer()
    } finally { isProcessingAction.value = false }
  }

  async function applyWalkover(teamAbsentId: string) {
    if (isProcessingAction.value) return
    if (!activeMatch.value) return
    isProcessingAction.value = true
    try {
      await $api(`/matches/${activeMatch.value.id}/walkover`, {
        method: 'POST',
        body: { teamAbsentId }
      })
      await refreshMatches()
      updateTimer()
    } finally { isProcessingAction.value = false }
  }

  const downloadingSheet = ref(false)

  async function downloadVocaliaSheetPdf() {
    if (downloadingSheet.value || !selectedMatchId.value) return
    downloadingSheet.value = true
    try {
      const blob: any = await $api(`/matches/${selectedMatchId.value}/vocalia-sheet/pdf`, { responseType: 'blob' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `hoja-vocalia-${selectedMatchId.value}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download vocalia sheet PDF:', err)
    } finally {
      downloadingSheet.value = false
    }
  }

  async function addEvent(payload: any) {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      const match = activeMatch.value
      const body = { ...payload, matchId: selectedMatchId.value, tournamentId: match?.tournamentId }
      await $api('/match-events', { method: 'POST', body })
      await Promise.all([loadEvents(), loadSuspensions(), refreshMatches()])
    } finally { isProcessingAction.value = false }
  }

  async function deleteEvent(eventId: string) {
    if (isProcessingAction.value) return
    isProcessingAction.value = true
    try {
      await $api(`/match-events/${eventId}`, { method: 'DELETE' })
      await loadEvents()
    } finally { isProcessingAction.value = false }
  }

  return {
    phase, selectedMatchId, matches, lineup, events, suspensions, fines, referees,
    loadingLineup, loadingEvents, loadingReferees, isProcessingAction,
    activeMatch,
    homeLineup, awayLineup, homeStarters, homeActiveLineup, awayActiveLineup, homeSubstitutes, awayStarters, awaySubstitutes,
    suspendedPlayerIds, checkedInPlayers, redCardedPlayerIds,
    homeReady, awayReady, homeValid, awayValid, homeForeignCount, awayForeignCount, matchCanStart, MIN_PLAYERS, MAX_PLAYERS, MAX_FOREIGN_PLAYERS,
    matchMinute, matchMinuteFormatted,
    teamName, teamLogo,
    loadMatches, loadMatchById, loadLineup, loadEvents, loadSuspensions, loadFines, loadReferees, selectMatch,
    addToLineup, removeFromLineup, toggleCheckIn, setLineupStatus,
    saveArbitration, startMatch, endFirstHalf, startSecondHalf, finishMatch, applyWalkover, addEvent, deleteEvent,
    lineupForPlayer, suspensionForPlayer, finesForPlayer, hasPendingFines, isPlayerBlockedByFines,
    downloadingSheet, downloadVocaliaSheetPdf,
  }
}
