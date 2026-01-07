import Project from "../models/project.model.js";
import User from "../models/user.model.js";

// admin 
export const createProject = async (req, res) => {
  try {
    const { projectName, client, projectType, techStack, startDate, expectedEndDate, projectDescription, deploymentLinks, totalCost, amountPaid } = req.body;

    if (!projectName || !client || !projectType || !techStack || !startDate || !totalCost) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const project = await Project.create({
      projectName,
      client,
      projectType,
      techStack,
      startDate,
      expectedEndDate: expectedEndDate || null,
      projectDescription,
      deploymentLinks,
      paymentSnapshot: {
        totalCost,
        amountPaid: amountPaid || 0
      },
      createdBy: req.user._id
    });

    const populatedProject = await Project.findById(project._id)
      .populate("client", "clientName businessName");

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: populatedProject
    });
  } catch (err) {
    console.error("Project Creation Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error"
    });
  }
};

export const addDeveloperToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { developerId, role } = req.body;

    if (!developerId || !role) {
      return res.status(400).json({
        success: false,
        message: "Developer ID and role are required"
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.isLocked) {
      return res.status(403).json({ success: false, message: "Project is locked" });
    }

    const developer = await User.findById(developerId);
    if (!developer || developer.role === "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "Invalid developer"
      });
    }

    const alreadyAssigned = project.assignedDevelopers.some(
      (d) => {
        const id = d.developer._id ? d.developer._id : d.developer;
        return id.toString() === developerId;
      }
    );

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Developer already assigned to this project"
      });
    }

    project.assignedDevelopers.push({
      developer: developerId,
      role
    });

    await project.save();

    developer.projects.push(project._id);
    await developer.save();

    const populatedProject = await Project.findById(projectId)
      .populate("client", "clientName businessName")
      .populate("assignedDevelopers.developer", "name email");

    res.status(200).json({
      success: true,
      message: `${developer.name} added to project successfully`,
      project: populatedProject
    });
  } catch (error) {
    console.error("Error in addDeveloperToProject:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};

export const removeDeveloperFromProject = async (req, res) => {
  try {
    const { projectId, developerId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.isLocked) {
      return res.status(403).json({ success: false, message: "Project is locked" });
    }

    const beforeCount = project.assignedDevelopers.length;

    project.assignedDevelopers = project.assignedDevelopers.filter(
      (d) => d.developer.toString() !== developerId
    );

    if (beforeCount === project.assignedDevelopers.length) {
      return res.status(404).json({
        success: false,
        message: "Developer not assigned to this project"
      });
    }

    await project.save();

    await User.findByIdAndUpdate(developerId, {
      $pull: { projects: project._id }
    });

    const populatedProject = await Project.findById(projectId)
      .populate("client", "clientName businessName")
      .populate("assignedDevelopers.developer", "name email");

    res.status(200).json({
      success: true,
      message: "Developer removed from project successfully",
      project: populatedProject
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const addProjectDocument = async (req, res) => {
  const { projectId } = req.params;
  const { type, title, link } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.isLocked) {
      return res.status(403).json({ message: "Project is locked" });
    }

    project.documents.push({
      type,
      title,
      link,
      addedBy: req.user._id
    });

    await project.save();
    return res.json({ success: true, message: "Document added successfully", documents: project.documents });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const recordPayment = async (req, res) => {
  const { projectId } = req.params;
  const { amountPaid } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.isLocked) {
      return res.status(403).json({ message: "Project is locked. Cannot record payments." });
    }

    if (amountPaid) {
      const remainingBalance = project.paymentSnapshot.totalCost - project.paymentSnapshot.amountPaid;
      if (amountPaid > remainingBalance) {
        return res.status(400).json({
          success: false,
          message: `Amount exceeds the outstanding balance (₹${remainingBalance.toLocaleString()})`
        });
      }
      project.paymentSnapshot.amountPaid += amountPaid;
    }

    await project.save();

    const populatedProject = await Project.findById(projectId)
      .populate("client", "clientName businessName")
      .populate("assignedDevelopers.developer", "name email phone");

    return res.json({ success: true, message: "Payment recorded", project: populatedProject });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateClosureNotes = async (req, res) => {
  const { projectId } = req.params;
  const { closureNotes } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (closureNotes) project.closureNotes = closureNotes;

    await project.save();

    const populatedProject = await Project.findById(projectId)
      .populate("client", "clientName businessName")
      .populate("assignedDevelopers.developer", "name email phone");

    return res.json({ success: true, message: "Closure notes updated", project: populatedProject });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateDeploymentLinks = async (req, res) => {
  const { projectId } = req.params;
  const { deploymentLinks } = req.body;

  if (!Array.isArray(deploymentLinks)) {
    return res.status(400).json({
      success: false,
      message: "deploymentLinks must be an array"
    });
  }

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (project.isLocked) {
      return res.status(403).json({ message: "Project is locked" });
    }

    project.deploymentLinks = deploymentLinks;

    await project.save();

    return res.json({
      success: true,
      message: "Deployment links updated successfully",
      deploymentLinks: project.deploymentLinks
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateProjectHosting = async (req, res) => {
  const { projectId } = req.params;
  const { backendHosting, database, domainName } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (project.isLocked) {
      return res.status(403).json({
        success: false,
        message: "Project is locked"
      });
    }

    if (backendHosting !== undefined) {
      project.hosting.backendHosting = backendHosting;
    }

    if (database !== undefined) {
      project.hosting.database = database;
    }

    if (domainName !== undefined) {
      project.hosting.domainName = domainName;
    }

    await project.save();

    return res.json({
      success: true,
      message: "Hosting details updated successfully",
      hosting: project.hosting
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateProjectInfo = async (req, res) => {
  const { projectId } = req.params;
  const { projectName, projectType, status, techStack, startDate, expectedEndDate, projectDescription } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.isLocked) {
      return res.status(403).json({ success: false, message: "Project is locked" });
    }

    if (projectName) project.projectName = projectName;
    if (projectType) project.projectType = projectType;
    if (status) project.status = status;
    if (techStack) project.techStack = techStack;
    if (startDate) project.startDate = startDate;
    if (expectedEndDate !== undefined) project.expectedEndDate = expectedEndDate;
    if (projectDescription !== undefined) project.projectDescription = projectDescription;

    await project.save();

    const populatedProject = await Project.findById(projectId)
      .populate("client", "clientName businessName")
      .populate("assignedDevelopers.developer", "name email phone");

    return res.json({ success: true, message: "Project information updated successfully", project: populatedProject });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const toggleProjectLock = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    project.isLocked = !project.isLocked;

    await project.save();

    return res.json({
      success: true,
      message: `Project ${project.isLocked ? "locked" : "unlocked"} successfully`,
      isLocked: project.isLocked
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "clientName businessName")
      .populate("assignedDevelopers.developer", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProjectsByClient = async (req, res) => {
  const { clientId } = req.params;
  try {
    const projects = await Project.find({ client: clientId })
      .populate("assignedDevelopers.developer", "name email");

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getSingleProjectAdmin = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId)
      .populate("client", "clientName businessName")
      .populate("assignedDevelopers.developer", "name email phone");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// developer
export const getMyProjects = async (req, res) => {

  try {
    const projects = await Project.find({
      "assignedDevelopers.developer": req.user._id
    })
      .select("-paymentSnapshot -closureNotes")
      .populate("client", "clientName businessName")
      .populate("assignedDevelopers.developer", "name phone");

    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getSingleProjectDeveloper = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findOne({
      _id: projectId,
      "assignedDevelopers.developer": req.user._id
    })
      .select("-paymentSnapshot -closureNotes")
      .populate("client", "clientName businessName")
      .populate("assignedDevelopers.developer", "name phone");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
