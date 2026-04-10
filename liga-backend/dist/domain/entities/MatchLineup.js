"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchLineup = exports.LineupStatus = void 0;
var LineupStatus;
(function (LineupStatus) {
    LineupStatus["STARTER"] = "STARTER";
    LineupStatus["SUBSTITUTE"] = "SUBSTITUTE";
})(LineupStatus || (exports.LineupStatus = LineupStatus = {}));
class MatchLineup {
    constructor(id, matchId, playerId, teamId, status = LineupStatus.SUBSTITUTE, checkedIn = false, number) {
        this.id = id;
        this.matchId = matchId;
        this.playerId = playerId;
        this.teamId = teamId;
        this.status = status;
        this.checkedIn = checkedIn;
        this.number = number;
    }
}
exports.MatchLineup = MatchLineup;
