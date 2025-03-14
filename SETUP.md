# BOSAN Website Setup Guide

This document provides detailed instructions for setting up and running the Body of Senior Advocates of Nigeria (BOSAN) website project.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm (v7 or higher)
- PostgreSQL (v14 or higher) - optional, for production use

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/bosan-website.git
   cd bosan-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=5000
SESSION_SECRET=your_session_secret_here

# For Production Database (optional)
DATABASE_URL=postgresql://username:password@localhost:5432/bosan_db
```

## Development

### Starting the Development Server

Run the following command to start the development server:

```bash
npm run dev
```

This will start both the backend Express server and the frontend Vite development server.

### Access the Application

- Frontend: http://localhost:5000
- API: http://localhost:5000/api

## Switching to a PostgreSQL Database

By default, the application uses an in-memory storage implementation for development. To use PostgreSQL:

1. Update the `DATABASE_URL` in your `.env` file

2. Modify `server/index.ts` to use the database storage implementation:
   ```typescript
   // Import the database storage implementation
   import { DatabaseStorage } from './storage';
   
   // Use DatabaseStorage instead of MemStorage
   const storage = new DatabaseStorage();
   ```

3. Run the database migrations:
   ```bash
   npm run drizzle:migrate
   ```

## Production Deployment

### Building for Production

```bash
npm run build
```

This will create optimized production builds for both frontend and backend.

### Running in Production

```bash
npm start
```

## Authentication

The default admin user credentials for development are:

- Username: `admin`
- Password: `adminpassword`

For security reasons, change these credentials before deploying to production.

## Admin Access

To access the admin panel, log in with an admin account and navigate to:

```
http://localhost:5000/admin/members
```

## Payment Integration

The application supports payment integration with Nigerian payment providers. To configure:

1. Obtain API keys from your payment provider (Paystack or Flutterwave recommended)
2. Add the API keys to your `.env` file:
   ```
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   ```
3. Update payment configuration in `server/payments.ts` if necessary

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify PostgreSQL is running
   - Check DATABASE_URL is correct
   - Ensure database user has proper permissions

2. **Missing Dependencies**:
   - Run `npm install` to install all dependencies

3. **Port Already in Use**:
   - Change the PORT in .env file
   - Kill the process using the port: `npx kill-port 5000`

## Project Structure

### Key Files and Directories

- `client/src/App.tsx`: Main frontend application component
- `client/src/pages/`: Frontend page components
- `client/src/components/`: Reusable UI components
- `server/index.ts`: Express server entry point
- `server/routes.ts`: API route definitions
- `server/auth.ts`: Authentication logic
- `server/storage.ts`: Data storage implementation
- `shared/schema.ts`: Shared types and database schema

## Contributing

1. Create a new branch for each feature or fix
2. Write tests for new functionality
3. Ensure all tests pass before submitting a pull request
4. Follow the existing code style and conventions

## Support

For any issues or questions, please contact the development team.

---

This documentation is confidential and proprietary to the Body of Senior Advocates of Nigeria.