import express from "express";
const router = express.Router();
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} from "../Controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

// making routes here
router.route("/registercompany").post(isAuthenticated, registerCompany);
router.route("/getcompany").get(isAuthenticated, getCompany);
router.route("/getcompany/:id").get(getCompanyById);
router.route("/update/:id").put(isAuthenticated, updateCompany); // we want only an autharized user can update his profile so we are making middleware here

export default router;
