const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require('../models/user');
const config = require('../config/config');

/**
 * @swagger
 * /user/authenticate:
 *   post:
 *     description: User login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userRequest
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/UserLoggedInResponse'
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Authentication failed. User not found.
 *       500:
 *         description: Internal Server Error
 */

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
router.post('/user/authenticate', async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });

        if (!user) {
            res.status(404).send({ status: 'failed', message: 'Authentication failed. User not found.' });
        } else {
            // console.log(user);
            // Check if password matches
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    // Create token if the password matched and no error was thrown
                    const jwTtoken = jwt.sign({ app: 'eshop', emailId: user.emailId }, config.secret, {
                        expiresIn: 300,
                    });
                    res.json({ status: 'success', token: jwTtoken });
                } else {
                    console.log(err);
                    res.status(401).send({ status: 'failed', message: 'Authentication failed.' });
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'failed', message: 'Internal Server error.' });
    }
});

/**
 * @swagger
 *
 *
 * definitions:
 *   NewUser:
 *     type: object
 *     required:
 *       - emailId
 *       - password
 *     properties:
 *       emailId:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *   SuccessResponse:
 *     type: object
 *     required:
 *       - status
 *     properties:
 *       status:
 *         type: string
 *   UserLoggedInResponse:
 *     allOf:
 *       - $ref: '#/definitions/SuccessResponse'
 *       - required:
 *         - token
 *       - properties:
 *         id:
 *           type: string
 */

/**
 * @swagger
 * /user:
 *   post:
 *     description: User signup
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userRequest
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     responses:
 *       201:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/SuccessResponse'
 *       500:
 *         description: Internal Server Error
 */
router.post('/user', async (req, res) => {
    try {
        const newUser = new User({ emailId: req.body.emailId, password: req.body.password });
        await newUser.save();
        res.status(201).send({ status: 'success' });
    } catch (err) {
        if (err.code && err.code === 11000) {
            res.status(400).send({ status: 'failed', message: 'user already exists.' });
        } else {
            res.status(500).send({ status: 'failed', message: 'Internal Server error.' });
        }
    }
});

module.exports = router;
