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

function dataRes(
  res,
  statusCode = 200,
  data,
  message = "Success",
  page = 1,
  limit = 10
) {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
    page: page,
    limit: limit,
  });
}

module.exports = { successRes, errorRes, dataRes };
