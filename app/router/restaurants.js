const express = require('express');
const router = express.Router();
const { 
  getAllRests,
  getRest,
  createRest,
  updateRest,
  deleteRest } = require('../controllers/restaurants');
const { checkForId } = require('../middlewares/checkId');

/**
 * @swagger
 * /restaurants:
 *   get:
 *     description: Restaurants list
 *     tags:
 *       - Restaurants
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Restaurants list
 *         schema:
 *           $ref: '#/definitions/Success-arr'
 *       500:
 *         description: Can't get Restaurants list
 */
router.get('/', getAllRests);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     description: Info about the Restaurant
 *     tags:
 *       - Restaurants
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
 *         description: Info about the Restaurant
 *         schema:
 *           $ref: '#/definitions/Success-obj'
 *       404:
 *         description: There is no restaurant with such id
 */
router.get('/:id', checkForId, getRest);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     description: Create a new Restaurant
 *     tags:
 *       - Restaurants
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       description: "Location is array for [Lat, Lng] coordinates"
 *       required: true
 *       schema:
 *         $ref: '#/definitions/Create-Rest'
 *     responses:
 *       200:
 *         description: amount
 *         schema:
 *           $ref: '#/definitions/Success'
 *       400:
 *         description: Error for create
 */
router.post('/', createRest);

/**
 * @swagger
 * /restaurants/{id}:
 *   patch:
 *     description: Update info about the Restaurant
 *     tags:
 *       - Restaurants
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
 *         $ref: '#/definitions/Create-Rest'
 *     responses:
 *       200:
 *         description: amount
 *         schema:
 *           $ref: '#/definitions/Success'
 *       400:
 *         description: Error for update
 */
router.patch('/:id', checkForId, updateRest);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     description: Delete the Restaurant
 *     tags:
 *       - Restaurants
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
 *         description: Delete the Restaurant
 *         schema:
 *           $ref: '#/definitions/Success'
 *       404:
 *         description: There is no restaurant with such id
 */
router.delete('/:id', checkForId, deleteRest);

module.exports = router;