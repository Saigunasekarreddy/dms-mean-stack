const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    mongoose.set("strictQuery", true);
    const tlsInsecure = process.env.MONGO_TLS_INSECURE === "true";

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      tls: true,
      ...(tlsInsecure ? { tlsAllowInvalidCertificates: true } : {}),
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
