import express from "express";
import { createClient, getAllClients, updateClient } from "../controllers/client.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post("/", isAuthenticated, isAdmin, createClient);
router.get("/", isAuthenticated, isAdmin, getAllClients);
router.put("/:id", isAuthenticated, isAdmin, updateClient);

export default router
