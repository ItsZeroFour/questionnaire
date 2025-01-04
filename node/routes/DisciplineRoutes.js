import express from "express";
import {
  addAdminToDiscipline,
  addMembersToDiscipline,
  createDiscipline,
  createTest,
  deleteTest,
  getAllDisciplineTests,
  getDisciplineTest,
  getMembers,
  getTest,
  userDisciplines,
  removeMembersToDiscipline,
} from "../controllers/DisciplineControllers.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

router.post("/create-discipline", checkAuth, createDiscipline);
router.post("/add-admin", checkAuth, addAdminToDiscipline);
router.post("/add-member", checkAuth, addMembersToDiscipline);
router.post("/remove-member", checkAuth, removeMembersToDiscipline);
router.get("/get-discuplines", checkAuth, userDisciplines);
router.post("/create-test", checkAuth, createTest);
router.get("/get-tests/:disciplineId", checkAuth, getDisciplineTest);
router.get("/get-test/:id", checkAuth, getTest);
router.get("/get-all-tests/:disciplineId", checkAuth, getAllDisciplineTests);
router.delete("/delete-test/:testId", checkAuth, deleteTest);
router.get("/get-members/:disciplineId", checkAuth, getMembers);

export default router;
