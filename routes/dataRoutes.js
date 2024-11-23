const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/authValidate");
const {
  getUsers,
  usersExpenseSum,
  getTransactions,
  getCategories,
} = require("../controllers/getDataController");
const {
  editTransactions,
  createTransactions,
  deleteTransactions,
  createCategories,
} = require("../controllers/editDataController");

router.get("/users", authenticate, authorize("admin"), getUsers);
router.get("/expenses", authenticate, getTransactions);
router.get(
  "/users/expenses",
  authenticate,
  authorize("admin"),
  usersExpenseSum
);
router.delete("/expenses/:id", authenticate, deleteTransactions);
router.patch("/expenses/:id", authenticate, editTransactions);
router.post("/expenses", authenticate, createTransactions);
router.get("/categories", authenticate, getCategories);
router.post("/categories", authenticate, authorize("admin"), createCategories);

module.exports = router;
