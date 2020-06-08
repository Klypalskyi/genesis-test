const { InternalServerError, BadRequest, NotFound } = require('../helpers/api_error');
const { getRouteTime } = require('../helpers/getRouteTime');
const query = require('../db/queries');
const config = require('../config');
const { clients } = config.get('TABLE_NAMES');
const { clientColumns } = config.get('TABLE_COLUMNS');

exports.getAllClients = async (req, res, next) => {
  try {
    const result = await query.select(clients);
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error(error.message || error);
    next(new InternalServerError('Can\'t get clients'));
  }
};

exports.getClient = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await query.selectById(clients, id);
    if (result.length === 0) {
      throw new NotFound('There is no client with such id');
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

exports.createClient = async (req, res, next) => {
  const { name, familyname, location } = req.body;
  const [lat, lng] = location;
  const origin = { lat, lng };
  try {
    const { address } = await getRouteTime(origin, origin);
    const data = [name, familyname, lat, lng, address]
    await query.insert(clients, clientColumns, data);
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error);
    next(new BadRequest(JSON.stringify(error.message || error)));
  }
};

exports.updateClient = async (req, res, next) => {
  const { id } = req.params;
  const { name, familyname, location } = req.body;
  const [lat, lng] = location;
  const origin = { lat, lng };

  try {
    const { address } = await getRouteTime(origin, origin);
    const rows = await query.selectById(clients, id);
    const oldData = rows[0];
    const newName = name || oldData.name;
    const newFamilyName = familyname || oldData.familyname;
    const newLat = lat || oldData.locationlat;
    const newLng = lng || oldData.locationlng;
    const data = [newName, newFamilyName, newLat, newLng, address];
    await query.update(clients, clientColumns, id, data);
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error);
    next(new NotFound(JSON.stringify(error.message || error)));
  }
};

exports.deleteClient = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rowCount = await query.delete(clients, id);
    if (rowCount === 0) {
      throw new NotFound('There is no client with such id');
    }
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error)
    next(error);
  }
};
