const { InternalServerError, BadRequest, NotFound } = require('../helpers/api_error');
const query = require('../db/queries');
const config = require('../config');
const { scouts } = config.get('TABLE_NAMES');
const { scoutColumnsCreate } = config.get('TABLE_COLUMNS');

exports.getAllScouts = async (req, res, next) => {
  try {
    const result = await query.select(scouts);
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error(error.message || error);
    next(new InternalServerError('Can\'t get scouts'));
  }
};

exports.getScout = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await query.selectById(scouts, id);
    if (result.length === 0) {
      throw new NotFound('There is no scout with such id');
    }
    res.json({
      status: 'success',
      data: result[0]
    });
  } catch (error) {
    console.error(error.message || error);
    next(error);
  }
};

exports.createScout = async (req, res, next) => {
  const { name } = req.body;
  try {
    const data = [name]
    await query.insert(scouts, scoutColumnsCreate, data);
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error);
    next(new BadRequest(JSON.stringify(error.message || error)));
  }
};

exports.updateScout = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const rows = await query.selectById(scouts, id);
    const oldData = rows[0];
    const newName = name || oldData.name;
    const data = [newName];
    await query.update(scouts, scoutColumnsCreate, id, data);
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error);
    next(new NotFound(JSON.stringify(error.message || error)));
  }
};

exports.deleteScout = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rowCount = await query.delete(scouts, id);
    if (rowCount === 0) {
      throw new NotFound('There is no scout with such id');
    }
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error)
    next(error);
  }
};
