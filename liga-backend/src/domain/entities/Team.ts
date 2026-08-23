import { DomainError } from "../exceptions/DomainError";
export class Team {
  constructor(public readonly id: string,
    public name: string,
    public logo: string,
    public foundedYear: number,
    public championshipsWon?: number,
    public categoryId?: string,
    public tournamentId?: string,
    public points: number = 0,
    public matchesPlayed: number = 0,
    public matchesWon: number = 0,
    public matchesDrawn: number = 0,
    public matchesLost: number = 0,
    public goalsFor: number = 0,
    public goalsAgainst: number = 0,
    public goalDifference: number = 0,
        public createdAt?: Date,
        public updatedAt?: Date) {
    this.validate();
  }

  private validate() {
    if (!this.name || this.name.length < 3) {
      throw new DomainError("Team name must be at least 3 characters long");
    }
    if (this.foundedYear > new Date().getFullYear()) {
      throw new DomainError("Founded year cannot be in the future");
    }
  }

  updateName(newName: string) {
    this.name = newName;
    this.validate();
  }
}
