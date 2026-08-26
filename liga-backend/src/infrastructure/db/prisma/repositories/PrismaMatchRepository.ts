import { MatchStatus as PrismaMatchStatus } from "@prisma/client";
import prisma from "../PrismaClient";
import { Match, MatchStatus } from "../../../../domain/entities/Match";
import { MatchRepository } from "../../../../domain/repositories/MatchRepository";
import { PaginatedResult, PaginationParams } from "../../../../domain/repositories/Pagination";

export class PrismaMatchRepository implements MatchRepository {
    private prisma = prisma;

    private mapToEntity(created: any): Match {
        return new Match(
            created.id,
            created.homeTeamId,
            created.awayTeamId,
            created.homeScore,
            created.awayScore,
            created.matchDate,
            created.tournamentId,
            created.categoryId,
            created.status as MatchStatus,
            created.refereeId,
            created.assistant1Id,
            created.assistant2Id,
            created.fourthRefereeId,
            created.primaryReferee || undefined,
            created.assistant1 || undefined,
            created.assistant2 || undefined,
            created.fourthReferee || undefined,
            created.firstHalfStartedAt,
            created.firstHalfEndedAt,
            created.secondHalfStartedAt,
            created.createdAt,
            created.updatedAt,
            created.round,
            created.stageId,
            created.stage || undefined
        );
    }

    async create(match: Match): Promise<Match> {
        const created = await this.prisma.match.create({
            data: {
                id: match.id,
                homeTeamId: match.homeTeamId,
                awayTeamId: match.awayTeamId,
                homeScore: match.homeScore ?? undefined,
                awayScore: match.awayScore ?? undefined,
                matchDate: match.matchDate,
                round: match.round ?? undefined,
                tournamentId: match.tournamentId,
                categoryId: match.categoryId,
                status: match.status as PrismaMatchStatus,
                firstHalfStartedAt: match.firstHalfStartedAt,
                firstHalfEndedAt: match.firstHalfEndedAt,
                secondHalfStartedAt: match.secondHalfStartedAt,
                refereeId: match.refereeId,
                assistant1Id: match.assistant1Id,
                assistant2Id: match.assistant2Id,
                fourthRefereeId: match.fourthRefereeId,
                stageId: match.stageId ?? undefined,
            },
            include: {
                primaryReferee: true,
                assistant1: true,
                assistant2: true,
                fourthReferee: true,
                stage: true
            }
        });

        return this.mapToEntity(created);
    }

    async createMany(matches: Match[]): Promise<Match[]> {
        const created = await this.prisma.$transaction(
            matches.map((match) =>
                this.prisma.match.create({
                    data: {
                        id: match.id,
                        homeTeamId: match.homeTeamId,
                        awayTeamId: match.awayTeamId,
                        homeScore: match.homeScore ?? undefined,
                        awayScore: match.awayScore ?? undefined,
                        matchDate: match.matchDate,
                        round: match.round ?? undefined,
                        tournamentId: match.tournamentId,
                        categoryId: match.categoryId,
                        status: match.status as PrismaMatchStatus,
                        stageId: match.stageId ?? undefined,
                    }
                })
            )
        );

        return created.map((m) => this.mapToEntity(m));
    }

    async findByTournamentAndCategory(tournamentId: string, categoryId: string, stageId?: string): Promise<Match[]> {
        const matches = await this.prisma.match.findMany({
            where: { tournamentId, categoryId, ...(stageId ? { stageId } : {}) },
            orderBy: [{ round: "asc" }, { matchDate: "asc" }]
        });
        return matches.map((m) => this.mapToEntity(m));
    }

    async findById(id: string): Promise<Match | null> {
        const match = await this.prisma.match.findUnique({ 
            where: { id },
            include: {
                primaryReferee: true,
                assistant1: true,
                assistant2: true,
                fourthReferee: true,
                stage: true
            }
        });
        if (!match) return null;
        return this.mapToEntity(match);
    }

    async findAll(pagination?: PaginationParams, filters?: { managerId?: string }): Promise<PaginatedResult<Match>> {
        const where = filters?.managerId ? { 
            OR: [
                { homeTeam: { managerId: filters.managerId } },
                { awayTeam: { managerId: filters.managerId } }
            ]
        } : {};
        const [matches, total] = await Promise.all([
            this.prisma.match.findMany({
                where,
                skip: pagination?.skip,
                take: pagination?.take,
                orderBy: { matchDate: "desc" },
                include: {
                    primaryReferee: true,
                    assistant1: true,
                    assistant2: true,
                    fourthReferee: true,
                    stage: true
                }
            }),
            this.prisma.match.count({ where }),
        ]);
        return {
            items: matches.map((m) => this.mapToEntity(m)),
            total,
        };
    }

    async findFinishedByTeam(teamId: string): Promise<Match[]> {
        const matches = await this.prisma.match.findMany({
            where: {
                status: "FINISHED",
                OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
            },
            select: {
                id: true,
                homeTeamId: true,
                awayTeamId: true,
                homeScore: true,
                awayScore: true,
                matchDate: true,
                tournamentId: true,
                categoryId: true,
                status: true,
                stageId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return matches.map((m) => this.mapToEntity(m));
    }

    async update(match: Match): Promise<Match> {
        const updated = await this.prisma.match.update({
            where: { id: match.id },
            data: {
                homeTeamId: match.homeTeamId,
                awayTeamId: match.awayTeamId,
                homeScore: match.homeScore ?? undefined,
                awayScore: match.awayScore ?? undefined,
                matchDate: match.matchDate,
                tournamentId: match.tournamentId,
                categoryId: match.categoryId,
                status: match.status as PrismaMatchStatus,
                firstHalfStartedAt: match.firstHalfStartedAt,
                firstHalfEndedAt: match.firstHalfEndedAt,
                secondHalfStartedAt: match.secondHalfStartedAt,
                refereeId: match.refereeId,
                assistant1Id: match.assistant1Id,
                assistant2Id: match.assistant2Id,
                fourthRefereeId: match.fourthRefereeId,
                stageId: match.stageId ?? undefined,
            },
            include: {
                primaryReferee: true,
                assistant1: true,
                assistant2: true,
                fourthReferee: true,
                stage: true
            }
        });
        return this.mapToEntity(updated);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.match.delete({ where: { id } });
    }
}