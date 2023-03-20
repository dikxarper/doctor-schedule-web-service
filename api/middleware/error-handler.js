const errorHandlerMiddleware = async (e, req, res, next) => {
  console.log(e)
  return res.status(500).json({ msg: "Something went wrong, please try again" })
}

export { errorHandlerMiddleware as errorMiddleware }
