import { Router } from "express";
import {
  changePassword,
  deleteAccount,
  updateProfile,
} from "../controllers/settings.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

router.put("/profile", updateProfile);
router.put("/password", changePassword);
router.delete("/account", deleteAccount);

export default router;
