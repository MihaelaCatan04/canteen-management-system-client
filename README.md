# Canteen Management System - Frontend

A modern React-based web application for managing canteen orders, payments, and user accounts.

## Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Role-Based Access Control (RBAC)**: Different permissions for students, staff, and admins
- **Email Verification**: Two-factor authentication via email
- **Multi-Factor Authentication (MFA)**: Optional TOTP-based MFA
- **Order Management**: Browse menus, place orders, view order history
- **Digital Wallet**: Top-up balance via Stripe integration
- **Transaction History**: Track all wallet transactions
- **Microsoft SSO**: Single sign-on with Microsoft accounts
- **Password Recovery**: Secure password reset flow
- **Real-time Health Checks**: API availability monitoring
- **Error Boundaries**: Graceful error handling

## Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 7.2.4
- **UI Library**: Ant Design 5.27.3
- **Routing**: React Router DOM 7.8.2
- **HTTP Client**: Axios 1.11.0
- **Payments**: Stripe React SDK
- **Testing**: Vitest + React Testing Library
- **Date/Time**: Luxon 3.7.2
- **Icons**: Font Awesome 7.0.1

## Prerequisites

- **Node.js**: 18.x or 20.x (LTS recommended)
- **npm**: 9.x or higher
- **Backend API**: Running on `http://localhost:8000` (or configured URL)
- **Git**: For version control

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd canteen-management-system-client/canteen-management-system-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
# Copy the example file
cp .env.example .env.local

```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# API Configuration (REQUIRED)
VITE_API_BASE_URL=http://localhost:8000

# Stripe Configuration (Required for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# Microsoft OAuth (Required for Microsoft SSO)
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id

# Application Configuration
VITE_APP_NAME=Canteen Management System
VITE_APP_ENV=development
```

### Environment Files

- `.env.example` - Template with all variables 

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

## Testing

### Run Tests

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run coverage
```

### Test Coverage

Current test coverage:
- Error pages (Page404, Page403)
- Authentication components (RequireAuth)
- API configuration (API_ENDPOINTS)
- Error boundaries (ErrorBoundary)
- Health check service (HealthCheckService)

## Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Docker Deployment

### Build Docker Image

```bash
docker build -t canteen-frontend .
```

### Run Container

```bash
docker run -p 8080:8080 -e VITE_API_BASE_URL=http://backend:8000 canteen-frontend
```

### Docker Compose

```bash
docker-compose up -d
```

The application will be available at `http://localhost:8080`

## Project Structure

```
canteen-management-system-client/
├── src/
│   ├── api/                    # API configuration and axios setup
│   │   ├── axios.jsx          # Axios instances with interceptors
│   │   └── API_ENDPOINTS.jsx  # API endpoint definitions
│   ├── components/            # Reusable React components
│   │   ├── LandingPage/       # Landing page components
│   │   ├── MainPage/          # Main app components
│   │   └── ...
│   ├── context/               # React context providers
│   │   └── AuthProvider.jsx  # Authentication context
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js         # Authentication hook
│   │   ├── useAxiosPrivate.js # Axios with auth hook
│   │   └── useTokenRefresh.js # Token refresh hook
│   ├── layouts/               # Page layouts
│   ├── pages/                 # Page components
│   │   ├── LandingPage/       # Login/signup pages
│   │   ├── MainPage/          # Main application
│   │   ├── Page404/           # 404 error page
│   │   ├── Page403/           # 403 forbidden page
│   │   └── ...
│   ├── services/              # Business logic services
│   │   ├── AuthService.jsx    # Authentication service
│   │   ├── HttpService.jsx    # HTTP service wrapper
│   │   └── ...
│   ├── test/                  # Test configuration
│   │   └── setup.js           # Vitest setup
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── .github/
│   └── workflows/
│       ├── ci.yml             # Continuous integration workflow
│       └── cd.yml             # Continuous deployment workflow
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose setup
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── vitest.config.js           # Vitest test configuration
└── README.md                  # This file
```

## Security Features

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT-based authentication with HTTP-only cookies
   - Automatic token refresh mechanism
   - Role-Based Access Control (RBAC)
   - Protected routes with `RequireAuth` component

2. **Email Verification**
   - Required email verification for new accounts
   - Protected routes for unverified users
   - Resend verification email functionality

3. **Multi-Factor Authentication (MFA)**
   - TOTP-based two-factor authentication
   - QR code generation for authenticator apps
   - Backup recovery codes

4. **Input Validation**
   - Client-side validation on all forms
   - Email format validation
   - Password strength requirements

5. **Security Headers & HTTPS**
   - CORS configuration
   - Secure cookie settings (httpOnly, SameSite)

6. **Error Handling**
   - No sensitive data in error messages
   - Meaningful user-friendly error pages

7. **Environment Configuration**
   - No hardcoded secrets
   - Environment-based configuration
   - Separate dev/prod settings

### Risk Mitigation

- **XSS Protection**: React's built-in escaping + Content Security Policy
- **CSRF Protection**: SameSite cookies + CORS configuration
- **Session Security**: HTTP-only cookies prevent JS access
- **Rate Limiting**: Backend implements rate limiting (client respects 429 responses)

## CI/CD Pipeline

### GitHub Actions Workflows

The project includes automated CI/CD pipelines:

#### Continuous Integration (ci.yml)
1. **Runs on**: Push to `main`, `develop`, or `feature/*` branches, and pull requests
2. **Build Matrix**: Tests on Node.js 18.x and 20.x
3. **Pipeline Steps**:
   - Checkout code
   - Setup Node.js with caching
   - Install dependencies (`npm ci`)
   - Run linter (`npm run lint`)
   - **Run tests** (`npm run test:run`) - **Build fails if tests fail** ✅
   - Build application (`npm run build`)
   - Upload production artifacts
   - Run security audit

#### Continuous Deployment (cd.yml)
- Automated deployment pipeline for production releases

## License

This project is for academic purposes as part of a university assignment.

---
