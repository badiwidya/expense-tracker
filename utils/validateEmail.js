function isEmail(email) {
  if (!email || email.trim() === "") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

module.exports = isEmail;
