# FoodShare

A food sharing platform built with MongoDB, Express, and Node.js.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd food_sharing_system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/foodshare
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reload
- `npm test`: Run tests

## Project Structure

```
food_sharing_system/
├── src/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── middleware/
├── tests/
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Deployment

This project is deployment-friendly and can be deployed to various platforms like Heroku, DigitalOcean, or AWS. Make sure to:

1. Set up the environment variables in your deployment platform
2. Configure your MongoDB connection string for production
3. Set NODE_ENV to 'production'
4. Use a process manager like PM2 in production

## License

MIT