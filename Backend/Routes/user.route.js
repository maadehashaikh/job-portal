import express from "express";
const router = express.Router();
import {
  login,
  logout,
  register,
  updateProfile,
} from "../Controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
// making routes here
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").put(isAuthenticated, updateProfile); // we want only an autharized user can update his profile so we are making middleware here

export default router;
