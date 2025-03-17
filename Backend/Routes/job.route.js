import express from "express";
const router = express.Router();
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  postjob,
  getAllJobs,
  getJobsByID,
  jobsCreatedByAdmin,
} from "../controllers/job.controller.js";

router.route("/postjob").post(isAuthenticated, postjob);
router.route("/getalljobs").get(isAuthenticated, getAllJobs);
router.route("/getjob/:id").get(isAuthenticated, getJobsByID);
router.route("/getadminjobs").get(isAuthenticated, jobsCreatedByAdmin);

export default router;
 