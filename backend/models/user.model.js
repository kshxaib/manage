import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: [
            "ADMIN",
            "BACKEND_DEV_WEB",
            "FRONTEND_DEV_WEB",
            "MOBILE_DEV_EXPO",
            "UI_UX_DESIGNER"
        ],
        default: "FRONTEND_DEV_WEB"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    ]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
