/**
 * @swagger
 *
 * definitions:
 *  Create-Client:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          required: true
 *        familyname:
 *          type: string
 *          required: true
 *        location:
 *          type: array
 *          required: true
 *          minItems: 2
 *          maxItems: 2
 *          items:
 *            type: number
 *
 */