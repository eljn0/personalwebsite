const fs = require("fs").promises;
const path = require("path");

const dataPath = path.join(process.cwd(), "data.json");

/**
 * Read data from the data.json file
 * @returns {Promise<Object>} The data object
 */
async function readData() {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return default structure
    return {
      investments: [],
      lastUpdated: new Date().toISOString(),
      version: "1.0",
    };
  }
}

/**
 * Write data to the data.json file
 * @param {Object} data - The data to write
 * @returns {Promise<void>}
 */
async function writeData(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

module.exports = {
  readData,
  writeData,
};
