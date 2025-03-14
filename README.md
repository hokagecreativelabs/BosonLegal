# BOSAN - Body of Senior Advocates of Nigeria Website

This is the official repository for the Body of Senior Advocates of Nigeria (BOSAN) website. The platform provides public information about BOSAN, a member dashboard, and payment integration for BOSAN members.

## Overview

The BOSAN website is a comprehensive web platform built to serve the Body of Senior Advocates of Nigeria. It features a public-facing website with information about the organization, events, members, and resources. Additionally, it includes a member dashboard for registered users and an admin panel for content management.

## Key Features

- **Public Information**: About BOSAN, events, member directory, and contact information
- **Authentication**: Secure login and registration for BOSAN members
- **Member Dashboard**: Profile management, payment history, and resources access
- **Payment Integration**: Member dues and event registration payments
- **Admin Panel**: Comprehensive content management for administrators
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Drizzle ORM)
- **Authentication**: Passport.js with local strategy
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/              # Source code
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
├── server/               # Backend Express application
│   ├── auth.ts           # Authentication setup
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage implementation
│   └── vite.ts           # Vite configuration for the server
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema and types
└── public/               # Static assets
```

## Admin Features

The admin panel is accessible to users with admin privileges and includes the following modules:

1. **Members Management**: Add, edit, and delete members
2. **Events Management**: Create and manage events
3. **Resources Management**: Upload and manage legal documents and resources
4. **Announcements**: Publish announcements for members
5. **Messages**: View and respond to contact form submissions
6. **Payments**: Track and manage member payments
7. **Uploads**: Upload media files for the website

## Getting Started

See [SETUP.md](./SETUP.md) for detailed setup and installation instructions.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For inquiries about this project, please contact the Body of Senior Advocates of Nigeria.