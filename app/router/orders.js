const express = require('express');
const router = express.Router();
const { 
  getAllOrders,
  getOrder,
  createOrder,
  closeOrder,
  deleteOrder } = require('../controllers/orders');
const { checkForId } = require('../middlewares/checkId');

/**
 * @swagger
 * /orders:
 *   get:
 *     description: Orders list
 *     tags:
 *       - Orders
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Orders list
 *         schema:
 *           $ref: '#/definitions/Success-arr'
 *       500:
 *         description: Can't get Orders list
 */
router.get('/', getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     description: Info about the Order
 *     tags:
 *       - Orders
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         value: "1"
 *     responses:
 *       200:
 *         description: Info about the Order
 *         schema:
 *           $ref: '#/definitions/Success-obj'
 *       404:
 *         description: There is no order with such id
 */
router.get('/:id', checkForId, getOrder);

/**
 * @swagger
 * /orders:
 *   post:
 *     description: Create a new Order
 *     tags:
 *       - Orders
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *         $ref: '#/definitions/Create-Order'
 *     responses:
 *       200:
 *         description: amount
 *         schema:
 *           $ref: '#/definitions/Success'
 *       400:
 *         description: Error for create
 */
router.post('/', createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     description: Update info about the Order
 *     tags:
 *       - Orders
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       type: string
 *       value: "1"
 *     - in: body
 *       name: body
 *       description: "Location is array for [Lat, Lng] coordinates"
 *       required: true
 *       schema:
 *         $ref: '#/definitions/Create-Order'
 *     responses:
 *       200:
 *         description: amount
 *         schema:
 *           $ref: '#/definitions/Success'
 *       400:
 *         description: Error for update
 */
router.patch('/:id', checkForId, closeOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     description: Delete the Order
 *     tags:
 *       - Orders
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         value: "1"
 *     responses:
 *       200:
 *         description: Delete the Order
 *         schema:
 *           $ref: '#/definitions/Success'
 *       404:
 *         description: There is no order with such id
 */
router.delete('/:id', checkForId, deleteOrder);

module.exports = router;