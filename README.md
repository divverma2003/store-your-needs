# Store Your Needs

A full-stack modern e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring comprehensive shopping functionality, secure payments, and professional admin analytics.

## Features

### Core E-commerce Functionality

- **Product catalog** with category-based browsing
- **Shopping cart** with persistent storage
- **Secure checkout** with Stripe integration
- **Order management** and tracking
- **User authentication** with email verification
- **Responsive design** for desktop and mobile

### Enhanced Features

- **Email Verification System**

  - SMTP integration with professional email templates
  - Crypto-generated verification tokens
  - Professional gradient email designs
  - Rate limiting and security measures

- **Advanced Cart Management**

  - Product quantity controls
  - Real-time cart updates with Zustand
  - Cart persistence across sessions
  - Product removal with confirmation dialogs

- **Payment Processing**

  - Stripe checkout integration
  - Order confirmation emails
  - Purchase success/cancel pages
  - Secure payment handling

- **Admin Dashboard**

  - Product management (CRUD operations)
  - Sales analytics with interactive charts
  - User management
  - Coupon creation and management
  - Daily sales data visualization

- **Professional Email Templates**
  - Modern gradient designs
  - Email verification templates
  - Order confirmation with product images
  - Consistent brand theming

### Authentication & Security

- **JWT-based authentication**
- **Email verification requirement**
- **Protected routes** for authenticated and verified users
- **Admin role-based access control**
- **Secure password hashing** with bcryptjs
- **Redis session management**

### Enhanced UI/UX

- **Tailwind CSS** with custom gradients
- **Framer Motion** animations
- **React Hot Toast** notifications
- **Loading states** and error handling
- **Professional product cards**
- **Interactive analytics charts** with Recharts
- **Modern glass-morphism effects**

## Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart library for analytics
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications
- **Vite** - Fast build tool

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Stripe** - Payment processing
- **Cloudinary** - Image storage and optimization
- **Nodemailer** - Email sending service
- **Redis** - Session management and caching
- **Cookie Parser** - Cookie handling middleware
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud)
- **Redis** (local or cloud)
- **Stripe account** (for payment processing)
- **Cloudinary account** (for image uploads)
- **Gmail account** (for email verification)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/divverma2003/store-your-needs.git
cd store-your-needs
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

REDIS_URL=your_redis_connection_string
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start the Application

**Backend** (Terminal 1):

```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):

```bash
cd frontend
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## Environment Variables

### Backend (.env)

| Variable                      | Description                          |
| ----------------------------- | ------------------------------------ |
| `MONGODB_URI`                 | MongoDB connection string            |
| `ACCESS_TOKEN_SECRET`         | Secret key for Access tokens         |
| `REFRESH_TOKEN_SECRET`        | Secret key for refresh tokens        |
| `NODE_ENV`                    | Environment (development/production) |
| `PORT`                        | Server port (default: 5000)          |
| `CLIENT_URL`                  | Frontend URL for CORS                |
| `CLOUDINARY_CLOUD_NAME`       | Cloudinary cloud name                |
| `CLOUDINARY_API_KEY`          | Cloudinary API key                   |
| `CLOUDINARY_API_SECRET`       | Cloudinary API secret                |
| `STRIPE_SECRET_KEY`           | Stripe secret key                    |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key               |
| `EMAIL_USER`                  | Gmail address for sending emails     |
| `EMAIL_PASS`                  | Gmail app password                   |
| `REDIS_URL`                   | Redis connection string              |

## Key Features Explained

### E-commerce Functionality

- **Product Management**: Full CRUD operations for products with image uploads
- **Category Browsing**: Organized product categories for easy navigation
- **Shopping Cart**: Persistent cart with real-time updates and quantity controls
- **Secure Checkout**: Stripe-powered payment processing with order confirmation

### Admin Dashboard

- **Analytics**: Interactive charts showing daily sales trends and key metrics
- **Product Management**: Add, edit, and delete products with image management
- **Order Tracking**: Monitor all orders and sales data
- **User Management**: View registered users and analytics

### Professional Email System

- **Verification Emails**: Modern gradient designs with professional styling
- **Order Confirmations**: Rich emails with product images and order details
- **Consistent Branding**: Emerald green theme across all communications
- **Responsive Templates**: Mobile-friendly email designs

### Payment & Security

- **Stripe Integration**: Secure payment processing with webhook support
- **Order Management**: Complete order lifecycle from cart to confirmation
- **Email Verification**: Required verification before shopping access
- **Admin Protection**: Role-based access control for admin features

### Real-time Features

- **Cart Updates**: Instant cart synchronization across browser tabs
- **Analytics**: Live sales data with interactive visualizations
- **Notifications**: Real-time feedback for user actions
- **State Management**: Efficient Zustand stores for app state

## Project Structure

```
store-your-needs/
├── backend/
│   ├── controllers/     # Route handlers and business logic
│   ├── middleware/      # Authentication and validation
│   ├── models/          # Database schemas
│   ├── routes/          # API route definitions
│   ├── lib/             # Utilities and configurations
│   └── seeds/           # Database seeding scripts
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main application pages
│   │   ├── stores/      # Zustand state management
│   │   └── lib/         # Frontend utilities
│   └── public/          # Static assets
└── README.md
```

## Credits

**Developer**: Divya Verma - Full-stack development of the complete e-commerce platform

**Features Implemented**:

- Complete MERN stack e-commerce solution
- Stripe payment integration with webhook handling
- Professional email template system
- Advanced admin analytics dashboard
- Real-time cart management with Zustand
- Comprehensive authentication and authorization
- Modern UI with Tailwind CSS and Framer Motion
- Cloud-based image management with Cloudinary
