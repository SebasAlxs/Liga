
import { handler as createStage } from "./CRUD/CreateStage";
import { handler as updateStage } from "./CRUD/UpdateStage";
import { handler as deleteStage } from "./CRUD/DeleteStage";
import { handler as getTournamentStages } from "./CRUD/GetTournamentStages";

export const StageHandlers = {
    createStage,
    updateStage,
    deleteStage,
    getTournamentStages,
};
