const express = require('express');
const healthController = require('../controllers/health');
const apiController = require('../controllers/api');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Service health endpoints
 *   - name: API
 *     description: Hello, location and temperature endpoints
 */

// Health endpoint

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /api/hello:
 *   get:
 *     tags: [API]
 *     summary: Return a simple Hello World message
 *     responses:
 *       200:
 *         description: Hello response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World
 */
router.get('/api/hello', apiController.hello.bind(apiController));

/**
 * @swagger
 * /api/location:
 *   get:
 *     tags: [API]
 *     summary: Return an approximate location for the client
 *     description: Uses a placeholder IP-based implementation when no external geo service is configured.
 *     responses:
 *       200:
 *         description: Location response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [city, region, country]
 *               properties:
 *                 city:
 *                   type: string
 *                   example: Localhost
 *                 region:
 *                   type: string
 *                   example: Local
 *                 country:
 *                   type: string
 *                   example: Local
 */
router.get('/api/location', apiController.location.bind(apiController));

/**
 * @swagger
 * /api/temperature:
 *   get:
 *     tags: [API]
 *     summary: Return a temperature value for the client
 *     description: Uses a placeholder deterministic computation (mock) so previews work without external weather APIs.
 *     responses:
 *       200:
 *         description: Temperature response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [temperature, units]
 *               properties:
 *                 temperature:
 *                   type: number
 *                   example: 22
 *                 units:
 *                   type: string
 *                   example: C
 */
router.get('/api/temperature', apiController.temperature.bind(apiController));

module.exports = router;
