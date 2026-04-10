import { handler as createTeam } from "./CRUD/CreateTeam";
import { handler as deleteTeam } from "./CRUD/DeleteTeam";
import { handler as getAllTeams } from "./CRUD/GetAllTeams";
import { handler as getStandings } from "./CRUD/GetStandings";
import { handler as getTeam } from "./CRUD/GetTeam";
import { handler as updateTeam } from "./CRUD/UpdateTeam";

export const TeamHandlers = {
    createTeam,
    deleteTeam,
    getAllTeams,
    getStandings,
    getTeam,
    updateTeam
};
