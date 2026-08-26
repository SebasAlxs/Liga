
import { handler as createRuleItem } from "./CRUD/CreateRuleItem";
import { handler as updateRuleItem } from "./CRUD/UpdateRuleItem";
import { handler as deleteRuleItem } from "./CRUD/DeleteRuleItem";
import { handler as getTournamentRuleItems } from "./CRUD/GetTournamentRuleItems";

export const RuleItemHandlers = {
    createRuleItem,
    updateRuleItem,
    deleteRuleItem,
    getTournamentRuleItems,
};
