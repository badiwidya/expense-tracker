const isEmail = require("../utils/validateEmail");
const { successRes, errorRes } = require("../utils/response");

function validateInput(req, res, next) {
  const { nama_depan, nama_belakang, username, email, password } = req.body;
  if (req.path === "/register") {
    if (
      !nama_depan?.trim() ||
      !nama_belakang?.trim() ||
      !username?.trim() ||
      !isEmail(email) ||
      !password?.trim()
    ) {
      return errorRes(res, 400, "Data tidak boleh kosong.");
    }
  } else if (req.path === "/login") {
    if (!username || !password) {
      return errorRes(res, 400, "Data tidak boleh kosong.");
    }
  }
  next();
};

module.exports = validateInput;
