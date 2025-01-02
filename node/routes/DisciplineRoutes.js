import express from "express";
import {
  addAdminToDiscipline,
  addMembersToDiscipline,
  createDiscipline,
  createTest,
  getDisciplineTest,
  getTest,
  userDisciplines,
} from "../controllers/DisciplineControllers.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

router.post("/create-discipline", checkAuth, createDiscipline);
router.post("/add-admin", checkAuth, addAdminToDiscipline);
router.post("/add-member", checkAuth, addMembersToDiscipline);
router.get("/get-discuplines", checkAuth, userDisciplines);
router.post("/create-test", checkAuth, createTest);
router.get("/get-tests", checkAuth, getDisciplineTest);
router.get("/get-test/:id", checkAuth, getTest);

export default router;
