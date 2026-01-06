import express from "express";
import { createProject, getAllProjectsAdmin, getProjectsByClient, getSingleProjectAdmin, getMyProjects, getSingleProjectDeveloper, addDeveloperToProject, removeDeveloperFromProject, updateDeploymentLinks, addProjectDocument, updateProjectProgress, toggleProjectLock, updateProjectHosting, updateProjectInfo } from "../controllers/project.controller.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ADMIN
router.post("/", isAuthenticated, isAdmin, createProject);
router.get("/admin", isAuthenticated, isAdmin, getAllProjectsAdmin);
router.get("/admin/client/:clientId", isAuthenticated, isAdmin, getProjectsByClient);
router.get("/admin/:projectId", isAuthenticated, isAdmin, getSingleProjectAdmin);
router.patch("/:projectId", isAuthenticated, isAdmin, updateProjectInfo);

router.post("/:projectId/developers", isAuthenticated, isAdmin, addDeveloperToProject);
router.delete("/:projectId/developers/:developerId", isAuthenticated, isAdmin, removeDeveloperFromProject);

router.post("/:projectId/documents", isAuthenticated, isAdmin, addProjectDocument);
router.patch("/:projectId/progress", isAuthenticated, isAdmin, updateProjectProgress);

router.patch("/:projectId/deployment-links", isAuthenticated, isAdmin, updateDeploymentLinks);
router.patch("/:projectId/toggle-lock", isAuthenticated, isAdmin, toggleProjectLock);
router.patch("/:projectId/hosting", isAuthenticated, isAdmin, updateProjectHosting);
//DEVELOPER
router.get("/my", isAuthenticated, getMyProjects);
router.get("/my/:projectId", isAuthenticated, getSingleProjectDeveloper);

export default router;
