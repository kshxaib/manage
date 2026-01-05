import express from "express";
import { createProject, getAllProjectsAdmin, getProjectsByClient, getSingleProjectAdmin, getMyProjects, getSingleProjectDeveloper, addDeveloperToProject, removeDeveloperFromProject } from "../controllers/project.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ADMIN
router.post("/", isAuthenticated, isAdmin, createProject);
router.get("/admin", isAuthenticated, isAdmin, getAllProjectsAdmin);
router.get("/admin/client/:clientId", isAuthenticated, isAdmin, getProjectsByClient);
router.get("/admin/:projectId", isAuthenticated, isAdmin, getSingleProjectAdmin);
router.post("/:projectId/developers", isAuthenticated, isAdmin, addDeveloperToProject);
router.delete("/:projectId/developers/:developerId", isAuthenticated, isAdmin, removeDeveloperFromProject);

//DEVELOPER
router.get("/my", isAuthenticated, getMyProjects);
router.get("/my/:projectId", isAuthenticated, getSingleProjectDeveloper);

export default router;
