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
      expectedEndDate,
      projectDescription,
      deploymentLinks,
      paymentSnapshot: {
        totalCost,
        amountPaid: amountPaid || 0
      },
      createdBy: req.user._id
    });

    res.status(201).json({ 
      success: true, 
      message: "Project created successfully", 
      project 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
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
      return res.status(403).json({ message: "Project is locked" });
    }

    const developer = await User.findById(developerId);
    if (!developer || developer.role === "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "Invalid developer"
      });
    }

    const alreadyAssigned = project.assignedDevelopers.some(
      (d) => d.developer.toString() === developerId
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

    res.status(200).json({
      success: true,
      message: `${developer.name} added to project successfully`,
      project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
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
      return res.status(403).json({ message: "Project is locked" });
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

    res.status(200).json({
      success: true,
      message: `${developer.name} removed from project successfully`,
      project
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

export const updateProjectProgress = async (req, res) => {
  const { projectId } = req.params;
  const { status, amountPaid, closureNotes, outcome } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project){
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.isLocked) {
      return res.status(403).json({ message: "Project is locked" });
    }

    if (status) project.status = status;
    if (closureNotes) project.closureNotes = closureNotes;
    if (outcome) project.outcome = outcome;

    if (amountPaid) {
      project.paymentSnapshot.amountPaid += amountPaid;
    }

    await project.save();
    return res.json({ success: true, project });
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
      .populate("client", "businessName")
      .populate("assignedDevelopers.developer", "name email phone");

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
      .populate("client", "businessName")
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
      .populate("client", "businessName")
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
      .populate("client", "businessName")
      .populate("assignedDevelopers.developer", "name phone");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
