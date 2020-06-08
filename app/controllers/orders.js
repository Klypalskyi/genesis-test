// TODO: check if this restaurant is available for delivery for creation an order
const moment = require('moment');
const { InternalServerError, BadRequest, NotFound } = require('../helpers/api_error');
const query = require('../db/queries');
const config = require('../config');
const { orders, rests, scouts, clients } = config.get('TABLE_NAMES');
const { orderColumnsCreate } = config.get('TABLE_COLUMNS');

exports.getAllOrders = async (req, res, next) => {
  try {
    const result = await query.select(orders);
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error(error.message || error);
    next(new InternalServerError('Can\'t get orders'));
  }
};

exports.getAllActiveOrders = async (req, res, next) => {
  try {
    const result = await query.selectActiveOrders(orders);
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error(error.message || error);
    next(new InternalServerError('Can\'t get orders'));
  }
};

exports.getOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await query.selectById(orders, id);
    if (result.length === 0) {
      throw new NotFound('There is no order with such id');
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

exports.createOrder = async (req, res, next) => {
  const { client, scout, rest, amount } = req.body;
  try {
    const data = [+client, +scout, +rest, +amount.toFixed(2)];
    await query.insert(orders, orderColumnsCreate, data);
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error);
    next(new BadRequest(error.message || error));
  }
};

exports.closeOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await query.selectById(orders, id);
    if (result.length === 0) {
      throw new NotFound('There is no order with such id');
    } else {
      await query.endOrder(orders, clients, scouts, rests, id);
      res.json({
        status: "success"
      })
    }
  } catch (error) {
    console.error(error.message || error)
    next(error.message || error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rowCount = await query.delete(orders, id);
    if (rowCount === 0) {
      throw new NotFound('There is no order with such id');
    }
    res.json({
      status: 'success',
    });
  } catch (error) {
    console.error(error.message || error)
    next(error);
  }
};
