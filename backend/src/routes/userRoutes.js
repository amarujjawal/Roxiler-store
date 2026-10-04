import { Router } from "express";
import { changePassword } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.patch("/password", authenticate, asyncHandler(changePassword));

export default router;
