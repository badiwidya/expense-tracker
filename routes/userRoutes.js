const express = require("express");
const router = express.Router();
const validateInput = require("../middlewares/validateInput");
const { loginUsers, registerUsers } = require("../controllers/userController");


router.post("/login", validateInput, loginUsers);
router.post("/register", validateInput, registerUsers);


module.exports = router;
