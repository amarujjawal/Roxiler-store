import { Router } from "express";
import { listStoresForUser, upsertRating } from "../controllers/ratingController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate, authorize("USER"));

router.get("/stores", asyncHandler(listStoresForUser));
router.post("/stores/:storeId/rating", asyncHandler(upsertRating));

export default router;
