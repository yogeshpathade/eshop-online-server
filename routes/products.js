const passport = require('passport');
const express = require('express');
const Product = require('../models/product');
const notifyEmitter = require('../events/eventEmitter.js');

const router = express.Router();

/**
 * @swagger
 *
 *
 * definitions:
 *   Product:
 *     type: object
 *     required:
 *       - brand
 *       - sizeRange
 *       - price
 *       - batchId
 *       - manufacturingYear
 *     properties:
 *       brand:
 *         type: string
 *       sizeRange:
 *         type: string
 *       price:
 *         type: string
 *       batchId:
 *         type: number
 *       manufacturingYear:
 *         type: string
 *   SuccessResponse:
 *     type: object
 *     required:
 *       - status
 *     properties:
 *       status:
 *         type: string
 */

/**
 * @swagger
 * /product:
 *   get:
 *     description: Returns all the products
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Product'
 *       500:
 *         description: Internal Server Error
 */
router.get('/product', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const productList = await Product.find();
        res.status(200).send({ products: productList });
    } catch (err) {
        res.status(500).send({ status: 'failed', message: 'Internal Server error.' });
    }
});

/**
 * @swagger
 * /product/:id:
 *   get:
 *     description: Returns product by product id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/Product'
 *       500:
 *         description: Internal Server Error
 */
router.get('/product/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).send(product);
    } catch (err) {
        res.status(500).send({ status: 'failed', message: 'Internal Server error.' });
    }
});

/**
 * @swagger
 * /product:
 *   post:
 *     description: Create a new Product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: productRequest
 *         description: Product object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses:
 *       201:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/SuccessResponse'
 *       500:
 *         description: Internal Server Error
 */
router.post('/product', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const newProduct = new Product({
            brand: req.body.brand,
            sizeRange: req.body.sizeRange,
            price: req.body.price,
            batchId: req.body.batchId,
            stock: req.body.stock,
            manufacturingYear: req.body.manufacturingYear,
        });
        await newProduct.save();
        res.status(201).send({ status: 'success' });
    } catch (err) {
        if (err.code && err.code === 11000) {
            res.status(400).send({ status: 'failed', message: 'product already exists.' });
        } else {
            res.status(500).send({ status: 'failed', message: 'Internal Server error.' });
        }
    }
});

/**
 * @swagger
 * /product:
 *   put:
 *     description: Update product metadata. The API notifies all the stores
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: productRequest
 *         description: Product object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses:
 *       201:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/SuccessResponse'
 *       500:
 *         description: Internal Server Error
 */
router.put('/product', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const newProduct = new Product({
            _id: req.body.id,
            brand: req.body.brand,
            sizeRange: req.body.sizeRange,
            price: req.body.price,
            batchId: req.body.batchId,
            stock: req.body.stock,
            manufacturingYear: req.body.manufacturingYear,
        });
        await Product.findOneAndUpdate({ brand: req.body.brand }, newProduct, {});

        // Send notification to all the stores for the product update.
        notifyEmitter.emit('notify', newProduct);

        res.status(201).send({ status: 'success' });
    } catch (err) {
        if (err.code && err.code === 11000) {
            res.status(400).send({ status: 'failed', message: 'product already exists.' });
        } else {
            console.log(err);
            res.status(500).send({ status: 'failed', message: 'Internal Server error.' });
        }
    }
});

module.exports = router;
