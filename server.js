const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Helper function to read data.json
async function readData() {
    try {
        const data = await fs.readFile('data.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid, return default structure
        return {
            investments: [],
            lastUpdated: new Date().toISOString(),
            version: "1.0"
        };
    }
}

// Helper function to write data.json
async function writeData(data) {
    await fs.writeFile('data.json', JSON.stringify(data, null, 2));
}

// Authentication middleware
function checkAuth(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    // Verify token here if needed
    next();
}

// Public routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'personalwealthtracker.html'));
});

// Protected admin routes
app.get('/admin', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Public API endpoints
app.get('/api/data', async (req, res) => {
    try {
        const data = await readData();
        // Only send public data
        const publicData = {
            investments: data.investments.map(inv => ({
                name: inv.name,
                type: inv.type,
                currentValue: inv.currentValue,
                currentPrice: inv.currentPrice
            })),
            lastUpdated: data.lastUpdated,
            version: data.version
        };
        res.json(publicData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// Protected API endpoints
app.put('/api/data', checkAuth, async (req, res) => {
    try {
        const data = req.body;
        await writeData(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Main portfolio page: http://localhost:${PORT}`);
}); 