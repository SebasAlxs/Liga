"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = exports.MatchStatus = void 0;
var MatchStatus;
(function (MatchStatus) {
    MatchStatus["SCHEDULED"] = "SCHEDULED";
    MatchStatus["IN_PROGRESS"] = "IN_PROGRESS";
    MatchStatus["FINISHED"] = "FINISHED";
    MatchStatus["CANCELLED"] = "CANCELLED";
})(MatchStatus || (exports.MatchStatus = MatchStatus = {}));
class Match {
    constructor(id, homeTeamId, awayTeamId, homeScore, awayScore, matchDate, tournamentId, categoryId, status = MatchStatus.SCHEDULED) {
        this.id = id;
        this.homeTeamId = homeTeamId;
        this.awayTeamId = awayTeamId;
        this.homeScore = homeScore;
        this.awayScore = awayScore;
        this.matchDate = matchDate;
        this.tournamentId = tournamentId;
        this.categoryId = categoryId;
        this.status = status;
        this.validate();
    }
    validate() {
        if (this.homeTeamId === this.awayTeamId) {
            throw new Error("A team cannot play against itself");
        }
        if ((this.homeScore !== null && this.homeScore < 0) || (this.awayScore !== null && this.awayScore < 0)) {
            throw new Error("Scores cannot be negative");
        }
    }
}
exports.Match = Match;
