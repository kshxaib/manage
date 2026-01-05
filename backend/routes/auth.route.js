import express from "express";
import { createUser, getAllUsers, login, logout, toggleDeveloperStatus } from "../controllers/auth.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

// Admin Routes
router.post("/register", isAuthenticated, isAdmin, createUser);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.put("/toggle-status/:userId", isAuthenticated, isAdmin, toggleDeveloperStatus);

export default router;
