const express = require("express");

const { login, me } = require("../controllers/authController");
const { authenticateAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticateAdmin, me);

module.exports = router;
