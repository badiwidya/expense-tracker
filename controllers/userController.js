const pool = require("../config/dbConfig");
const { successRes, errorRes } = require("../utils/response");
const { hashPassword, verifyPass } = require("../utils/hashPassword");

async function loginUsers(req, res) {}

async function registerUsers(req, res) {
  const { nama_depan, nama_belakang, username, email, password } = req.body;
  try {
    const checkUser = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    if (checkUser.rows.length > 0) {
        return errorRes(res, 409, "Username sudah ada");
    }
    const hashedPass = await hashPassword(password);
    const query =
      "INSERT INTO users (first_name, last_name, username, password, email) VALUES ($1, $2, $3, $4, $5) RETURNING id";
    const result = await pool.query(query, [
      nama_depan,
      nama_belakang,
      username,
      hashedPass,
      email,
    ]);
    if (result.rows.length === 0) {
      return errorRes(res, 400, "Kesalahan terjadi saat memasukkan data");
    }
    return successRes(res, 201, "Registrasi berhasil", result.rows);
  } catch (err) {
    return errorRes(res, 500, "Internal server error");
  }
}

module.exports = { loginUsers, registerUsers };
