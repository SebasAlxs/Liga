import { Router } from "express";
import { handler as createHandler } from "./src/CRUD/CreateHeadquarters";
import { handler as getHandler } from "./src/CRUD/GetHeadquarters";
import { handler as updateHandler } from "./src/CRUD/UpdateHeadquarters";
import { handler as deleteHandler } from "./src/CRUD/DeleteHeadquarters";

const router = Router();

router.post("/", createHandler);
router.get("/", getHandler);
router.put("/:id", updateHandler);
router.delete("/:id", deleteHandler);

export default router;
