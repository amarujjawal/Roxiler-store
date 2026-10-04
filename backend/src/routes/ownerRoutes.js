import { Router } from "express";
import { ownerDashboard } from "../controllers/storeController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate, authorize("OWNER"));

router.get("/dashboard", asyncHandler(ownerDashboard));

export default router;
