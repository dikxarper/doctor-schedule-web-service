const notFound = (req, res) => res.status(404).send("Route Doesn't Exist")

export { notFound as notFoundMiddleware }
