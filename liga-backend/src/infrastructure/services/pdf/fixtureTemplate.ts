import { FixturePdfResponse } from "../../../adapters/http/dto/FixturePdfResponse";

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

function roundSection(round: number, matches: { homeTeam: string; awayTeam: string }[]): string {
    const rows = matches.map(m => `
        <tr>
            <td>${escapeHtml(m.homeTeam)}</td>
            <td class="vs">vs</td>
            <td>${escapeHtml(m.awayTeam)}</td>
        </tr>`).join("");

    return `
        <div class="round">
            <h2>Fecha ${round}</h2>
            <table>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}

export function renderFixtureHtml(data: FixturePdfResponse): string {
    const roundsHtml = data.rounds.map(r => roundSection(r.round, r.matches)).join("");

    return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Fixture</title>
<style>
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; font-size: 11px; margin: 0; padding: 0; }
    h1 { font-size: 18px; margin: 0 0 4px; }
    h2 { font-size: 12px; margin: 0 0 6px; border-bottom: 2px solid #1a1a1a; padding-bottom: 3px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1a1a1a; padding-bottom: 8px; margin-bottom: 12px; }
    .header .meta { text-align: right; font-size: 9px; color: #444; }
    .round { margin-bottom: 14px; page-break-inside: avoid; }
    table { width: 100%; border-collapse: collapse; }
    td { border: 1px solid #ccc; padding: 4px 8px; font-size: 11px; }
    td.vs { text-align: center; width: 30px; color: #888; font-weight: bold; }
</style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Fixture</h1>
            <p>${escapeHtml(data.tournamentName)} — ${escapeHtml(data.categoryName)}</p>
        </div>
        <div class="meta">
            <div>Generado: ${formatDate(data.generatedAt)}</div>
        </div>
    </div>

    ${roundsHtml}
</body>
</html>`;
}
