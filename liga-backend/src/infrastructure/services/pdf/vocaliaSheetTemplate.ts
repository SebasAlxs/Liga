import { VocaliaSheetResponse, VocaliaSheetLineupPlayer, VocaliaSheetTeam } from "../../../adapters/http/dto/VocaliaSheetResponse";

const EVENT_LABELS: Record<string, string> = {
    GOAL: "Gol",
    ASSIST: "Asistencia",
    YELLOW_CARD: "Tarjeta Amarilla",
    RED_CARD: "Tarjeta Roja",
    SUBSTITUTION: "Sustitución",
    PLAYER_ENTRY: "Ingreso"
};

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function formatDate(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleString("es-EC", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function playerRow(p: VocaliaSheetLineupPlayer): string {
    return `
        <tr>
            <td>${p.number ?? "-"}</td>
            <td>${escapeHtml(`${p.firstName} ${p.lastName}`.trim())}</td>
            <td>${p.dni ? escapeHtml(p.dni) : "-"}</td>
            <td>${p.checkedIn ? "Sí" : "No"}</td>
        </tr>`;
}

function teamLineupSection(team: VocaliaSheetTeam): string {
    return `
        <div class="team-lineup">
            <h3>${escapeHtml(team.name)}</h3>
            <p class="subtitle">Titulares</p>
            <table>
                <thead><tr><th>#</th><th>Jugador</th><th>Cédula</th><th>Check-in</th></tr></thead>
                <tbody>${team.starters.length ? team.starters.map(playerRow).join("") : `<tr><td colspan="4" class="empty">Sin titulares registrados</td></tr>`}</tbody>
            </table>
            <p class="subtitle">Suplentes</p>
            <table>
                <thead><tr><th>#</th><th>Jugador</th><th>Cédula</th><th>Check-in</th></tr></thead>
                <tbody>${team.substitutes.length ? team.substitutes.map(playerRow).join("") : `<tr><td colspan="4" class="empty">Sin suplentes registrados</td></tr>`}</tbody>
            </table>
        </div>`;
}

export function renderVocaliaSheetHtml(data: VocaliaSheetResponse): string {
    const eventsRows = data.events.length
        ? data.events.map(e => {
            const teamName = e.teamId === data.homeTeam.id ? data.homeTeam.name : data.awayTeam.name;
            return `
                <tr>
                    <td>${e.minute !== undefined ? `${e.minute}'` : "-"}</td>
                    <td>${EVENT_LABELS[e.type] || e.type}</td>
                    <td>${escapeHtml(teamName)}</td>
                    <td>${escapeHtml(e.playerName)}</td>
                    <td>${e.relatedPlayerName ? escapeHtml(e.relatedPlayerName) : "-"}</td>
                </tr>`;
        }).join("")
        : `<tr><td colspan="5" class="empty">Sin eventos registrados</td></tr>`;

    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Hoja de Vocalía</title>
<style>
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 10px; margin: 0; padding: 0; display: flex; flex-direction: column; }
    h1 { font-size: 16px; margin: 0 0 4px; }
    h2 { font-size: 12px; margin: 14px 0 6px; border-bottom: 2px solid #1a1a1a; padding-bottom: 3px; }
    h3 { font-size: 11px; margin: 0 0 4px; }
    .subtitle { font-size: 9px; font-weight: bold; text-transform: uppercase; color: #555; margin: 6px 0 3px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1a1a1a; padding-bottom: 8px; }
    .header .meta { text-align: right; font-size: 9px; color: #444; }
    .score { text-align: center; margin: 10px 0; }
    .score .teams { font-size: 14px; font-weight: bold; }
    .score .result { font-size: 22px; font-weight: bold; margin-top: 2px; }
    .referees { display: flex; gap: 24px; margin-top: 6px; font-size: 10px; }
    .referees div { flex: 1; }
    .referees strong { display: block; font-size: 8px; text-transform: uppercase; color: #555; margin-bottom: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
    th, td { border: 1px solid #ccc; padding: 2px 5px; text-align: left; font-size: 9px; }
    th { background: #f0f0f0; text-transform: uppercase; font-size: 8px; }
    td.empty { text-align: center; color: #888; font-style: italic; }
    .lineups { display: flex; gap: 20px; }
    .team-lineup { flex: 1; }
    .signatures { display: flex; gap: 20px; margin-top: auto; padding-top: 24px; page-break-inside: avoid; }
    .signature-box { flex: 1; text-align: center; }
    .signature-line { border-top: 1px solid #1a1a1a; margin-top: 24px; padding-top: 4px; font-size: 8px; text-transform: uppercase; color: #555; }
</style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Hoja de Vocalía</h1>
            <p>${escapeHtml(data.tournamentName || "Torneo")} ${data.categoryName ? `— ${escapeHtml(data.categoryName)}` : ""}</p>
        </div>
        <div class="meta">
            <div>Fecha del partido: ${formatDate(data.matchDate)}</div>
            <div>Generado: ${formatDate(data.generatedAt)}</div>
        </div>
    </div>

    <div class="score">
        <div class="teams">${escapeHtml(data.homeTeam.name)} vs ${escapeHtml(data.awayTeam.name)}</div>
        <div class="result">${data.homeScore ?? 0} - ${data.awayScore ?? 0}</div>
    </div>

    <div class="referees">
        <div><strong>Árbitro Central</strong>${data.referee ? escapeHtml(data.referee.name) : "Sin asignar"}</div>
        <div><strong>Asistente 1</strong>${data.assistant1 ? escapeHtml(data.assistant1.name) : "Sin asignar"}</div>
        <div><strong>Asistente 2</strong>${data.assistant2 ? escapeHtml(data.assistant2.name) : "Sin asignar"}</div>
    </div>

    <h2>Nómina</h2>
    <div class="lineups">
        ${teamLineupSection(data.homeTeam)}
        ${teamLineupSection(data.awayTeam)}
    </div>

    <h2>Eventos del Partido</h2>
    <table>
        <thead><tr><th>Min.</th><th>Evento</th><th>Equipo</th><th>Jugador</th><th>Relacionado</th></tr></thead>
        <tbody>${eventsRows}</tbody>
    </table>

    <h2>Firmas</h2>
    <div class="signatures">
        <div class="signature-box"><div class="signature-line">Vocal de Mesa</div></div>
        <div class="signature-box"><div class="signature-line">Árbitro Central</div></div>
        <div class="signature-box"><div class="signature-line">Delegado ${escapeHtml(data.homeTeam.name)}</div></div>
        <div class="signature-box"><div class="signature-line">Delegado ${escapeHtml(data.awayTeam.name)}</div></div>
    </div>
</body>
</html>`;
}
