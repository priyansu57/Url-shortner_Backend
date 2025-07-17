import express from "express";
import { register, login, Check_me, logout } from "../controller/userauth.controller.js";
import { isAuthenticated } from "../Userchecker.js";
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/me",isAuthenticated, Check_me);
router.post("/logout",logout);

export default router;