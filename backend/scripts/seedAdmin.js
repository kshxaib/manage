import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";


const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_DB_URI) {
      console.error("❌ MONGO_DB_URI is not defined");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_DB_URI);

    const adminEmail = process.env.ADMIN_EMAIL;

    const existingAdmin = await User.findOne({
      email: adminEmail,
      role: "ADMIN"
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
      name: process.env.ADMIN_NAME,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true
    });

    console.log("🚀 Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed admin", error);
    process.exit(1);
  }
};

seedAdmin();