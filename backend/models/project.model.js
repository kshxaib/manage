import mongoose from "mongoose";

const developerAssignmentSchema = new mongoose.Schema({
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  role: {
    type: String,
    enum: ["FRONTEND", "BACKEND", "FULLSTACK", "MOBILE", "DESIGNER"],
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const paymentSnapshotSchema = new mongoose.Schema({
  totalCost: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  pendingAmount: {
    type: Number
  }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "COSTING",
      "AGREEMENT",
      "INVOICE",
      "FIGMA",
      "GITHUB",
      "DRIVE",
      "OTHER"
    ],
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },

  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },

  projectType: {
    type: String,
    enum: ["WEBSITE", "APP", "BOTH"],
    required: true
  },

  techStack: {
    type: String, 
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  expectedEndDate: Date,

  status: {
    type: String,
    enum: ["PLANNING", "DEVELOPMENT", "REVIEW", "LIVE", "ON_HOLD"],
    default: "PLANNING"
  },

  outcome: {
    type: String,
    enum: ["COMPLETED", "CANCELLED_BY_CLIENT"],
    default: null
  },

  closureNotes: {
    type: String,
    trim: true
  },

  paymentSnapshot: paymentSnapshotSchema,

  assignedDevelopers: [developerAssignmentSchema],

  documents: [documentSchema],

  projectDescription: {
    type: String,
    trim: true
  },

  deploymentLinks: {
    type: [String] // web URL OR app store links
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

projectSchema.pre("save", function (next) {
  if (this.paymentSnapshot) {
    this.paymentSnapshot.pendingAmount =
      this.paymentSnapshot.totalCost - this.paymentSnapshot.amountPaid;
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
