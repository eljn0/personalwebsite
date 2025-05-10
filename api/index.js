const express = require("express");
const {
  getPublicData,
  updateData,
} = require("../src/controllers/investmentController");
const { checkAuth } = require("../src/middleware/auth");

const router = express.Router();

/**
 * @swagger
 * /api/data:
 *   get:
 *     summary: Get public investment data
 *     description: Returns the list of public investment information
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get("/data", getPublicData);

/**
 * @swagger
 * /api/data:
 *   put:
 *     summary: Update investment data
 *     description: Updates the investment data (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/data", checkAuth, updateData);

module.exports = router;
