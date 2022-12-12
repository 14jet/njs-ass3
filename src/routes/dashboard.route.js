const express = require("express");
const router = express.Router();

// controllers
const dashboardControllers = require("../controllers/dashboard.controller");

// routes
router.get("/", dashboardControllers.getDashboard);

module.exports = router;
