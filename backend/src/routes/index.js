const express = require("express");
const { getHealth } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");
const documentRoutes = require("./documentRoutes");

const router = express.Router();

router.get("/health", getHealth);
router.use("/auth", authRoutes);
router.use("/docs", documentRoutes);

module.exports = router;
