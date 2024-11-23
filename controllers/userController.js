const pool = require("../config/dbConfig");
const { successRes, errorRes } = require("../utils/response");
const { hashPassword, verifyPass } = require("../utils/hashPassword");
const { generateToken, verifyToken } = require("../utils/auth");

async function loginUsers(req, res, next) {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return errorRes(res, 400, "Username atau password salah.");
    }
    const decryptPass = await verifyPass(password, result.rows[0].password);
    if (!decryptPass) {
      return errorRes(res, 400, "Username atau password salah.");
    }
    const token = generateToken(
      result.rows[0].id,
      username,
      result.rows[0].roles,
      "access"
    );
    const refreshToken = generateToken(
      result.rows[0].id,
      username,
      result.rows[0].roles,
      "refresh"
    );
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return successRes(res, 200, "Login berhasil.", { token });
  } catch (err) {
    next(err);
  }
}

async function registerUsers(req, res, next) {
  const { nama_depan, nama_belakang, username, email, password } = req.body;
  try {
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (checkUser.rows.length > 0) {
      return errorRes(res, 409, "Username sudah ada.");
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
      return errorRes(res, 400, "Registrasi gagal.");
    }
    return successRes(res, 201, "Registrasi berhasil.", result.rows);
  } catch (err) {
    next(err);
  }
}

function logoutUsers(req, res) {
  res.clearCookie("refresh_token", {
    httpOnly: true,
  });
  return successRes(res, 200, "Logout berhasil", null);
}

function refreshUsers(req, res) {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) {
    return errorRes(res, 401, "Refresh token not found.");
  }
  try {
    const user = verifyToken(refresh_token, "refresh");

    const newRefreshToken = generateToken(
      user.id,
      user.username,
      user.role,
      "refresh"
    );
    const newAccessToken = generateToken(
      user.id,
      user.username,
      user.role,
      "access"
    );

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return successRes(res, 200, "Token berhasil diperbaharui.", {
      newAccessToken,
    });
  } catch (err) {
    return errorRes(res, 403, "Invalid refresh token.");
  }
}

module.exports = { loginUsers, registerUsers, logoutUsers, refreshUsers };
