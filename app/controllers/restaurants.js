const { InternalServerError, BadRequest, NotFound } = require('../helpers/api_error');
const { getRouteTime } = require('../helpers/getRouteTime');
const query = require('../db/queries');
const config = require('../config');
const { rests } = config.get('TABLE_NAMES');
const { restColumns } = config.get('TABLE_COLUMNS');

exports.getAllRests = async (req, res, next) => {
  try {
    const result = await query.select(rests);
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error(error.message || error);
    next(new InternalServerError('Can\'t get restaurants'));
  }
};

exports.getRest = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await query.selectById(rests, id);
    if (result.length === 0) {
      throw new NotFound('There is no restaurant with such id');
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

exports.createRest = async (req, res, next) => {
  const { name, location } = req.body;
  const [lat, lng] = location;
  const origin = { lat, lng };
  try {
    const { address } = await getRouteTime(origin, origin);
    const data = [name, lat, lng, address]
    await query.insert(rests, restColumns, data);
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error);
    next(new BadRequest(JSON.stringify(error.message || error)));
  }
};

exports.updateRest = async (req, res, next) => {
  const { id } = req.params;
  const { name, location } = req.body;
  const [lat, lng] = location;
  const origin = { lat, lng };

  try {
    const { address } = await getRouteTime(origin, origin);
    const rows = await query.selectById(rests, id);
    const oldData = rows[0];
    const newName = name || oldData.name;
    const newLat = lat || oldData.locationlat;
    const newLng = lng || oldData.locationlng;
    const data = [newName, newLat, newLng, address];
    await query.update(rests, restColumns, id, data);
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error);
    next(new NotFound(JSON.stringify(error.message || error)));
  }
};

exports.deleteRest = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rowCount = await query.delete(rests,id);
    if (rowCount === 0) {
      throw new NotFound('There is no restaurant with such id');
    }
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error)
    next(error);
  }
};
