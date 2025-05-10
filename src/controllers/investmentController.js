const { readData, writeData } = require("../utils/data");

/**
 * Get public investment data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getPublicData(req, res) {
  try {
    const data = await readData();
    // Only send public data
    const publicData = {
      investments: data.investments,
      lastUpdated: data.lastUpdated,
      version: data.version,
    };
    res.json(publicData);
  } catch (error) {
    res.status(500).json({ error: "Failed to read data" });
  }
}

/**
 * Update investment data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateData(req, res) {
  try {
    const data = req.body;
    await writeData(data);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save data" });
  }
}

module.exports = {
  getPublicData,
  updateData,
};
