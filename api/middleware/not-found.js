const notFound = (req, res) =>
  res.status(404).send("<h1>Route Doesn't Exist</h1>")

export { notFound as notFoundMiddleware }
