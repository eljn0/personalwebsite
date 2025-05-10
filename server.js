const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('.'));

// Helper function to read current data
async function readData() {
    try {
        const data = await fs.readFile('data.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { stocks: [] };
    }
}

// Helper function to write data
async function writeData(data) {
    await fs.writeFile('data.json', JSON.stringify(data, null, 2));
}

// Update stock endpoint
app.put('/stocks/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { quantity, price, date, type = 'buy' } = req.body;
        
        if (!quantity || !price || !date) {
            return res.status(400).json({ 
                error: 'Missing required fields: quantity, price, and date are required' 
            });
        }

        const data = await readData();
        const stockIndex = data.stocks.findIndex(s => s.symbol === symbol);

        if (stockIndex === -1) {
            // New stock
            data.stocks.push({
                symbol,
                quantity: Number(quantity),
                averagePrice: Number(price),
                totalValue: Number(quantity) * Number(price),
                transactions: [{
                    type,
                    quantity: Number(quantity),
                    price: Number(price),
                    date,
                    total: Number(quantity) * Number(price)
                }]
            });
        } else {
            // Existing stock
            const stock = data.stocks[stockIndex];
            const newQuantity = type === 'buy' 
                ? stock.quantity + Number(quantity)
                : stock.quantity - Number(quantity);

            if (newQuantity < 0) {
                return res.status(400).json({ 
                    error: 'Insufficient quantity for sell transaction' 
                });
            }

            // Calculate new average price for buy transactions
            if (type === 'buy') {
                const totalCost = (stock.averagePrice * stock.quantity) + (Number(price) * Number(quantity));
                stock.averagePrice = totalCost / newQuantity;
            }

            stock.quantity = newQuantity;
            stock.totalValue = stock.quantity * stock.averagePrice;
            
            // Add transaction to history
            stock.transactions = stock.transactions || [];
            stock.transactions.push({
                type,
                quantity: Number(quantity),
                price: Number(price),
                date,
                total: Number(quantity) * Number(price)
            });
        }

        await writeData(data);
        res.json({ 
            success: true, 
            stock: data.stocks.find(s => s.symbol === symbol)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all stocks
app.get('/stocks', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.stocks || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific stock
app.get('/stocks/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const data = await readData();
        const stock = data.stocks.find(s => s.symbol === symbol);
        
        if (!stock) {
            return res.status(404).json({ error: 'Stock not found' });
        }
        
        res.json(stock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 