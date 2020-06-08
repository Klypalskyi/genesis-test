const { BadRequest } = require('../helpers/api_error');

exports.checkForId = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    next(new BadRequest("Missing the required id parameter"))
  } else next()
}