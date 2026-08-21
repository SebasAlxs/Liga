import { handler as getAllLeagueRuleItems } from "./CRUD/GetAllLeagueRuleItems";
import { handler as createLeagueRuleItem } from "./CRUD/CreateLeagueRuleItem";
import { handler as updateLeagueRuleItem } from "./CRUD/UpdateLeagueRuleItem";
import { handler as deleteLeagueRuleItem } from "./CRUD/DeleteLeagueRuleItem";

export const LeagueRuleItemHandlers = {
    getAllLeagueRuleItems,
    createLeagueRuleItem,
    updateLeagueRuleItem,
    deleteLeagueRuleItem,
};
