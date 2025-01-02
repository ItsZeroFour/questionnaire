import express from "express";
import {
  authUser,
  getUsersByDiscipline,
  loginUser,
  registerUser,
  verifyCode,
} from "../controllers/AuthControllers.js";
import checkAuth from "../utils/checkAuth.js";
import passport from "passport";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyCode", verifyCode);
router.post("/login", loginUser);
router.get("/me", checkAuth, authUser);
router.get("/get-students", checkAuth, getUsersByDiscipline);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

export default router;
