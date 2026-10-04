import { Router } from "express";
import {
  createStore,
  createUser,
  dashboard,
  getUser,
  listStores,
  listUsers,
} from "../controllers/adminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", asyncHandler(dashboard));
router.get("/users", asyncHandler(listUsers));
router.get("/users/:id", asyncHandler(getUser));
router.post("/users", asyncHandler(createUser));
router.get("/stores", asyncHandler(listStores));
router.post("/stores", asyncHandler(createStore));

export default router;
