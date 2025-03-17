import express from "express";
const router = express.Router();

import isAuthenticated from "../middlewares/isAuthenticated";
import {
  applyJob,
  getApplicants,
  getappliedjobs,
  updatestatus,
} from "../controllers/application.controller";

router.route("/applyjob/:id").get(isAuthenticated, applyJob);
router.route("/getappliedjobs").get(isAuthenticated, getappliedjobs);
router.route("/:id/getapplicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updatestatus);
