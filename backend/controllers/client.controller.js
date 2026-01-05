import Client from "../models/client.model.js";

export const createClient = async (req, res) => {
  try {
    const {clientName, businessName, email, phone, whatsapp, country, onboardedDate} = req.body;

    if (!clientName || !businessName || !email || !phone || !country || !onboardedDate) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    const client = await Client.create({clientName, businessName, email, phone, whatsapp, country, onboardedDate, createdBy: req.user._id});

    return res.status(201).json({
      success: true,
      message: "Client onboarded successfully",
      client
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .populate("createdBy", "name email")
      .sort({ onboardedDate: -1 });

    return res.status(200).json({
      success: true,
      count: clients.length,
      clients
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};