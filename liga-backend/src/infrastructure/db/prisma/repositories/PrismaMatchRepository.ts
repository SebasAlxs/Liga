import { MatchStatus as PrismaMatchStatus } from "@prisma/client";
import prisma from "../PrismaClient";
import { Match, MatchStatus } from "../../../../domain/entities/Match";
import { MatchRepository } from "../../../../domain/repositories/MatchRepository";
import { PaginatedResult, PaginationParams } from "../../../../domain/repositories/Pagination";

export class PrismaMatchRepository implements MatchRepository {
    private prisma = prisma;

    async create(match: Match): Promise<Match> {
        const created = await this.prisma.match.create({
            data: {
                id: match.id,
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
            },
            include: {
                primaryReferee: true,
                assistant1: true,
                assistant2: true,
                fourthReferee: true
            }
        });

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
            created.updatedAt
        );
    }

    async findById(id: string): Promise<Match | null> {
        const match = await this.prisma.match.findUnique({ 
            where: { id },
            include: {
                primaryReferee: true,
                assistant1: true,
                assistant2: true,
                fourthReferee: true
            }
        });
        if (!match) return null;
        return new Match(
            match.id,
            match.homeTeamId,
            match.awayTeamId,
            match.homeScore,
            match.awayScore,
            match.matchDate,
            match.tournamentId,
            match.categoryId,
            match.status as MatchStatus,
            match.refereeId,
            match.assistant1Id,
            match.assistant2Id,
            match.fourthRefereeId,
            match.primaryReferee,
            match.assistant1,
            match.assistant2,
            match.fourthReferee,
            match.firstHalfStartedAt,
            match.firstHalfEndedAt,
            match.secondHalfStartedAt,
            match.createdAt,
            match.updatedAt
        );
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
                    fourthReferee: true
                }
            }),
            this.prisma.match.count({ where }),
        ]);
        return {
            items: matches.map(
                (m) => new Match(
                    m.id,
                    m.homeTeamId,
                    m.awayTeamId,
                    m.homeScore,
                    m.awayScore,
                    m.matchDate,
                    m.tournamentId,
                    m.categoryId,
                    m.status as MatchStatus,
                    m.refereeId,
                    m.assistant1Id,
                    m.assistant2Id,
                    m.fourthRefereeId,
                    m.primaryReferee,
                    m.assistant1,
                    m.assistant2,
                    m.fourthReferee,
                    m.firstHalfStartedAt,
                    m.firstHalfEndedAt,
                    m.secondHalfStartedAt,
                    m.createdAt,
                    m.updatedAt
                )
            ),
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
                createdAt: true,
                updatedAt: true,
            },
        });
        return matches.map(
            (m) => new Match(
                m.id,
                m.homeTeamId,
                m.awayTeamId,
                m.homeScore,
                m.awayScore,
                m.matchDate,
                m.tournamentId,
                m.categoryId,
                m.status as MatchStatus,
                null, null, null, null, undefined, undefined, undefined, undefined, null, null, null,
                m.createdAt,
                m.updatedAt
            )
        );
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
            },
            include: {
                primaryReferee: true,
                assistant1: true,
                assistant2: true,
                fourthReferee: true
            }
        });
        return new Match(
            updated.id,
            updated.homeTeamId,
            updated.awayTeamId,
            updated.homeScore,
            updated.awayScore,
            updated.matchDate,
            updated.tournamentId,
            updated.categoryId,
            updated.status as MatchStatus,
            updated.refereeId,
            updated.assistant1Id,
            updated.assistant2Id,
            updated.fourthRefereeId,
            updated.primaryReferee || undefined,
            updated.assistant1 || undefined,
            updated.assistant2 || undefined,
            updated.fourthReferee || undefined,
            updated.firstHalfStartedAt,
            updated.firstHalfEndedAt,
            updated.secondHalfStartedAt,
            updated.createdAt,
            updated.updatedAt
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.match.delete({ where: { id } });
    }
}