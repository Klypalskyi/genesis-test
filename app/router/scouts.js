const express = require('express');
const router = express.Router();
const { 
  getAllScouts,
  getScout,
  createScout,
  updateScout,
  deleteScout } = require('../controllers/scouts');
const { checkForId } = require('../middlewares/checkId');


/**
 * @swagger
 * /scouts:
 *   get:
 *     description: Scouts list
 *     tags:
 *       - Scouts
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Scouts list
 *         schema:
 *           $ref: '#/definitions/Success-arr'
 *       500:
 *         description: Can't get Scouts list
 */
router.get('/', getAllScouts);

/**
 * @swagger
 * /scouts/{id}:
 *   get:
 *     description: Info about the Scout
 *     tags:
 *       - Scouts
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
 *         description: Info about the Scout
 *         schema:
 *           $ref: '#/definitions/Success-obj'
 *       404:
 *         description: There is no scout with such id
 */
router.get('/:id', checkForId, getScout);

/**
 * @swagger
 * /scouts:
 *   post:
 *     description: Create a new Scout
 *     tags:
 *       - Scouts
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *         $ref: '#/definitions/Create-Scout'
 *     responses:
 *       200:
 *         description: amount
 *         schema:
 *           $ref: '#/definitions/Success'
 *       400:
 *         description: Error for create
 */
router.post('/', createScout);

/**
 * @swagger
 * /scouts/{id}:
 *   patch:
 *     description: Update info about the Scout
 *     tags:
 *       - Scouts
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
 *       required: true
 *       schema:
 *         $ref: '#/definitions/Create-Scout'
 *     responses:
 *       200:
 *         description: amount
 *         schema:
 *           $ref: '#/definitions/Success'
 *       400:
 *         description: Error for update
 */
router.patch('/:id', checkForId, updateScout);

/**
 * @swagger
 * /scouts/{id}:
 *   delete:
 *     description: Delete the Scout
 *     tags:
 *       - Scouts
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
 *         description: Delete the Scout
 *         schema:
 *           $ref: '#/definitions/Success'
 *       404:
 *         description: There is no scout with such id
 */
router.delete('/:id', checkForId, deleteScout);

module.exports = router;