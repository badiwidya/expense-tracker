const bcrypt = require("bcrypt");

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(password, salt);
    return hashedPass;
  } catch (err) {
    console.log("Terjadi kesalahan saat meng-hash password");
  }
}

async function verifyPass(password, hashedPass) {
  try {
    const isValid = await bcrypt.compare(password, hashedPass);
    return isValid;
  } catch (err) {
    console.log("Terjadi kesalahan saat meng-verify password");
    return new Error(err);
  }
}

module.exports = { hashPassword, verifyPass };
