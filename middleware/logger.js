const logger = (req, res, next) => {
  console.log(
    `Logging route: ${req.url}`,
    new Date().toISOString()
  )
  next()
}
module.exports = {
  logger,
}