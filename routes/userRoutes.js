const express = require("express");
const router = express.Router();
const validateInput = require("../middlewares/validateInput");
const { loginUsers, registerUsers, logoutUsers, refreshUsers } = require("../controllers/userController");


router.post("/login", validateInput, loginUsers);
router.post("/register", validateInput, registerUsers);
router.post("/refresh", refreshUsers);
router.post('/logout', logoutUsers);

module.exports = router;
