import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    clientName: {
      type: String,
      required: true,
      trim: true
    },

    businessName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    whatsapp: {
      type: String,
      trim: true
    },

    country: {
      type: String,
      required: true,
      trim: true
    },

    onboardedDate: {
      type: Date,
      required: true 
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
},{ timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;