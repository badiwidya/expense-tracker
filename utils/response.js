function successRes(res, statusCode = 200, message = "Success", data) {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
}
function errorRes(res, statusCode = 500, message = "An error occured") {
  res.status(statusCode).json({
    status: "error",
    message,
  });
}

module.exports = { successRes, errorRes };