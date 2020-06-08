const express = require('express');
const router = express.Router();
const { 
  getAllClients,
  getClient,
  createClient,
  updateClient,
  deleteClient } = require('../controllers/clients');
const { checkForId } = require('../middlewares/checkId');

/**
 * @swagger
 * /clients:
 *   get:
 *     description: Clients list
 *     tags:
 *       - Clients
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Clients list
 *         schema:
 *           $ref: '#/definitions/Success-arr'
 *       500:
 *         description: Can't get Clients list
 */
router.get('/', getAllClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     description: Info about the Client
 *     tags:
 *       - Clients
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
 *         description: Info about the Client
 *         schema:
 *           $ref: '#/definitions/Success-obj'
 *       404:
 *         description: There is no restaurant with such id
 */
router.get('/:id', checkForId, getClient);

/**
 * @swagger
 * /clients:
 *   post:
 *     description: Create a new Client
 *     tags:
 *       - Clients
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       description: "Location is array for [Lat, Lng] coordinates"
 *       required: true
 *       schema:
 *         $ref: '#/definitions/Create-Client'
 *     responses:
 *       200:
 *         description: amount
 *         schema:
 *           $ref: '#/definitions/Success'
 *       400:
 *         description: Error for create
 */
router.post('/', createClient);

/**
 * @swagger
 * /clients/{id}:
 *   patch:
 *     description: Update info about the Client
 *     tags:
 *       - Clients
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
 *         $ref: '#/definitions/Create-Client'
 *     responses:
 *       200:
 *         description: amount
 *         schema:
 *           $ref: '#/definitions/Success'
 *       400:
 *         description: Error for update
 */
router.patch('/:id', checkForId, updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     description: Delete the Client
 *     tags:
 *       - Clients
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
 *         description: Delete the Client
 *         schema:
 *           $ref: '#/definitions/Success'
 *       404:
 *         description: There is no client with such id
 */
router.delete('/:id', checkForId, deleteClient);

module.exports = router;