# Personal Wealth Tracker

A simple web application to track personal investments and portfolio.

## Project Structure

```
.
├── api/               # API routes
├── public/            # Static assets (HTML, CSS, images)
├── src/               # Server source code
│   ├── controllers/   # Controller functions for API routes
│   ├── middleware/    # Middleware functions
│   └── utils/         # Utility functions
├── index.js           # Main server entry point
├── data.json          # Data storage file
├── vercel.json        # Vercel deployment configuration
└── package.json       # Project dependencies
```

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The server will be available at http://localhost:3000

### Routes

- `/` - Home page
- `/tracker` - Personal Wealth Tracker application
- `/admin` - Admin interface (requires authentication)

### Production Deployment

This project is set up for deployment on Vercel.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel
```

## API Endpoints

### GET /api/data

- Returns public investment data
- No authentication required

### PUT /api/data

- Updates investment data
- Requires authentication token in the Authorization header
