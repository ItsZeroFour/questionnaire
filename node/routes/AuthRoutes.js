import express from "express";
import {
  authUser,
  registerUser,
  verifyCode,
} from "../controllers/AuthControllers.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyCode", verifyCode);
router.get("/me", checkAuth, authUser);

export default router;
