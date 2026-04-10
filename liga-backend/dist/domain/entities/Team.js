"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
class Team {
    constructor(id, name, logo, foundedYear, championshipsWon, categoryId, tournamentId, points = 0, matchesPlayed = 0, matchesWon = 0, matchesDrawn = 0, matchesLost = 0, goalsFor = 0, goalsAgainst = 0, goalDifference = 0) {
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.foundedYear = foundedYear;
        this.championshipsWon = championshipsWon;
        this.categoryId = categoryId;
        this.tournamentId = tournamentId;
        this.points = points;
        this.matchesPlayed = matchesPlayed;
        this.matchesWon = matchesWon;
        this.matchesDrawn = matchesDrawn;
        this.matchesLost = matchesLost;
        this.goalsFor = goalsFor;
        this.goalsAgainst = goalsAgainst;
        this.goalDifference = goalDifference;
        this.validate();
    }
    validate() {
        if (!this.name || this.name.length < 3) {
            throw new Error("Team name must be at least 3 characters long");
        }
        if (this.foundedYear > new Date().getFullYear()) {
            throw new Error("Founded year cannot be in the future");
        }
    }
    updateName(newName) {
        this.name = newName;
        this.validate();
    }
}
exports.Team = Team;
