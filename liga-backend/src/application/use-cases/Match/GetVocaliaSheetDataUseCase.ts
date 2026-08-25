import { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { MatchLineupRepository } from "../../../domain/repositories/MatchLineupRepository";
import { MatchEventRepository } from "../../../domain/repositories/MatchEventRepository";
import { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { TournamentRepository } from "../../../domain/repositories/TournamentRepository";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";
import { MatchStatus } from "../../../domain/entities/Match";
import { LineupStatus } from "../../../domain/entities/MatchLineup";
import { Player } from "../../../domain/entities/Player";
import { NotFoundError } from "../../../domain/exceptions/NotFoundError";
import { DomainError } from "../../../domain/exceptions/DomainError";
import { VocaliaSheetResponse, VocaliaSheetTeam, VocaliaSheetEvent } from "../../../adapters/http/dto/VocaliaSheetResponse";

export class GetVocaliaSheetDataUseCase {
    constructor(
        private matchRepository: MatchRepository,
        private matchLineupRepository: MatchLineupRepository,
        private matchEventRepository: MatchEventRepository,
        private playerRepository: PlayerRepository,
        private teamRepository: TeamRepository,
        private tournamentRepository: TournamentRepository,
        private categoryRepository: CategoryRepository
    ) { }

    async execute(matchId: string): Promise<VocaliaSheetResponse> {
        const match = await this.matchRepository.findById(matchId);
        if (!match) throw new NotFoundError("Partido no encontrado");
        if (match.status !== MatchStatus.FINISHED) {
            throw new DomainError("La hoja de vocalía solo puede descargarse cuando el partido ha finalizado.");
        }

        const [homeTeam, awayTeam, lineup, events, tournament, category] = await Promise.all([
            this.teamRepository.findById(match.homeTeamId),
            this.teamRepository.findById(match.awayTeamId),
            this.matchLineupRepository.findByMatch(matchId),
            this.matchEventRepository.findByMatch(matchId),
            this.tournamentRepository.findById(match.tournamentId),
            this.categoryRepository.findById(match.categoryId)
        ]);

        const playerIds = Array.from(new Set([
            ...lineup.map(l => l.playerId),
            ...events.map(e => e.playerId),
            ...events.filter(e => e.relatedPlayerId).map(e => e.relatedPlayerId as string)
        ]));
        const players = await Promise.all(playerIds.map(id => this.playerRepository.findById(id)));
        const playerMap = new Map<string, Player>();
        players.forEach(p => { if (p) playerMap.set(p.id, p); });

        const buildTeamSheet = (teamId: string, teamName: string, teamLogo?: string): VocaliaSheetTeam => {
            const teamLineup = lineup.filter(l => l.teamId === teamId);
            const toEntry = (l: typeof teamLineup[number]) => {
                const player = playerMap.get(l.playerId);
                return {
                    playerId: l.playerId,
                    firstName: player?.firstName || "Desconocido",
                    lastName: player?.lastName || "",
                    number: l.number ?? player?.number ?? null,
                    dni: player?.dni,
                    status: l.status,
                    checkedIn: l.checkedIn
                };
            };
            return {
                id: teamId,
                name: teamName,
                logo: teamLogo,
                starters: teamLineup.filter(l => l.status === LineupStatus.STARTER).map(toEntry),
                substitutes: teamLineup.filter(l => l.status === LineupStatus.SUBSTITUTE).map(toEntry)
            };
        };

        const sheetEvents: VocaliaSheetEvent[] = events
            .slice()
            .sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0))
            .map(e => {
                const player = playerMap.get(e.playerId);
                const relatedPlayer = e.relatedPlayerId ? playerMap.get(e.relatedPlayerId) : undefined;
                return {
                    minute: e.minute,
                    type: e.type,
                    teamId: e.teamId,
                    playerName: player ? `${player.firstName} ${player.lastName}` : "Desconocido",
                    relatedPlayerName: relatedPlayer ? `${relatedPlayer.firstName} ${relatedPlayer.lastName}` : undefined
                };
            });

        return {
            matchId: match.id,
            matchDate: match.matchDate.toISOString(),
            status: match.status,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            tournamentName: tournament?.name,
            categoryName: category?.name,
            homeTeam: buildTeamSheet(match.homeTeamId, homeTeam?.name || "Equipo Local", homeTeam?.logo),
            awayTeam: buildTeamSheet(match.awayTeamId, awayTeam?.name || "Equipo Visitante", awayTeam?.logo),
            referee: match.primaryReferee ? { name: match.primaryReferee.name } : null,
            assistant1: match.assistant1 ? { name: match.assistant1.name } : null,
            assistant2: match.assistant2 ? { name: match.assistant2.name } : null,
            events: sheetEvents,
            generatedAt: new Date().toISOString()
        };
    }
}
