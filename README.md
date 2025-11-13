# CSPM API (Cloud Security Posture Management API)

A comprehensive Node.js RESTful API for Cloud Security Posture Management (CSPM) that provides enterprise-grade security monitoring, compliance management, vulnerability tracking, and threat detection across multi-cloud environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data Models](#data-models)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Configuration](#configuration)
- [Development](#development)
- [Sample Data](#sample-data)
- [Security Features](#security-features)

## 🎯 Overview

CSPM API is a backend service designed to help organizations maintain security posture and compliance across their cloud infrastructure. It provides:

- **Multi-tenant architecture** - Support for multiple organizations/tenants with isolated data
- **Cloud provider integration** - AWS, Azure, GCP, and on-premises support
- **Comprehensive security monitoring** - Assets, vulnerabilities, threats, and compliance tracking
- **Policy management** - Define and enforce security policies across infrastructure
- **SecOps integration** - Track code-level security issues from CI/CD pipelines
- **RBAC (Role-Based Access Control)** - Fine-grained permission management
- **Audit logging** - Complete audit trail of all operations
- **Reporting** - Generate security posture and compliance reports

## ✨ Features

### Core Security Features
- **Asset Management**: Track and monitor cloud resources across multiple providers
- **Vulnerability Management**: Detect, track, and remediate security vulnerabilities
- **Threat Detection**: Real-time threat monitoring and investigation
- **Compliance Management**: Support for CIS, PCI-DSS, ISO27001, HIPAA, SOC2, and custom frameworks
- **Policy Enforcement**: Define IAM, SCP, Security Hub, and Config rules
- **SecOps Integration**: Track bugs, vulnerabilities, and code smells from development tools

### Enterprise Features
- **Multi-tenancy**: Complete tenant isolation with shared infrastructure
- **Role-Based Access Control**: Granular permissions and role management
- **SSO/SAML Integration**: Enterprise authentication support
- **Audit Logging**: Comprehensive logging of all security-relevant actions
- **Notification System**: Configurable alerts and notifications
- **Report Generation**: Automated security and compliance reporting
- **Session Management**: Secure token-based authentication with refresh tokens

### Cloud Provider Support
- AWS (Amazon Web Services)
- Azure (Microsoft Azure)
- GCP (Google Cloud Platform)
- On-premises infrastructure

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Client Applications                 │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              Express.js REST API Layer              │
│    (Routes, Middleware, Authentication)             │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              Controller Layer                        │
│    (Request handling, validation, response)         │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              Service Layer                           │
│    (Business logic, transactions, caching)          │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              Data Layer (MongoDB)                    │
│    (Models, schemas, indexes)                       │
└─────────────────────────────────────────────────────┘
```

### Key Components

- **Routes**: Define API endpoints and map to controllers
- **Controllers**: Handle HTTP requests, input validation, and response formatting
- **Services**: Contain business logic, data access, and external integrations
- **Models**: Define MongoDB schemas and data structure
- **Middleware**: Authentication, authorization, pagination, error handling
- **Utils**: Helper functions for JWT, caching, cookies, etc.

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: Node.js (ES6+ modules)
- **Framework**: Express.js 5.x
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) + SAML SSO

### Key Dependencies
- **express**: Web application framework
- **mongoose**: MongoDB object modeling
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **passport-saml**: SAML 2.0 authentication
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment configuration
- **morgan**: HTTP request logging
- **cookie-parser**: Cookie handling

### Development Tools
- **nodemon**: Development auto-reload
- **eslint**: Code linting with security plugins
- **prettier**: Code formatting
- **csv-parser**: Sample data import

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (v6+)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anupyadav27/CSPM-API.git
   cd CSPM-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_IN_USE=mongodb
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=cspm
   
   # Server Configuration
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   
   # JWT Configuration
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-here
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   
   # SAML Configuration (optional)
   SAML_ENTRY_POINT=https://your-idp.com/sso
   SAML_ISSUER=cspm-api
   SAML_CALLBACK_URL=http://localhost:5000/api/auth/saml/callback
   ```

4. **Start the server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

The API will be available at `http://localhost:5000`

### Verify Installation

Test the API with a simple health check:
```bash
curl http://localhost:5000/test
```

## 📁 Project Structure

```
CSPM-API/
├── src/
│   ├── config/              # Configuration files
│   │   └── mongodb.js       # MongoDB connection setup
│   ├── controllers/         # Request handlers
│   │   ├── assetController.js
│   │   ├── authController.js
│   │   ├── complianceController.js
│   │   ├── notificationController.js
│   │   ├── policyController.js
│   │   ├── reportController.js
│   │   ├── samlController.js
│   │   ├── secOpsController.js
│   │   ├── tenantController.js
│   │   ├── testController.js
│   │   ├── threatController.js
│   │   ├── userController.js
│   │   └── vulnerabilityController.js
│   ├── middleware/          # Express middleware
│   │   ├── authMiddleware.js    # JWT authentication
│   │   └── paginate.js          # Pagination middleware
│   ├── models/              # Mongoose data models
│   │   ├── asset.js
│   │   ├── auditlog.js
│   │   ├── cloudConnector.js
│   │   ├── compliance.js
│   │   ├── notification.js
│   │   ├── notificationSettings.js
│   │   ├── permission.js
│   │   ├── platformSettings.js
│   │   ├── policy.js
│   │   ├── report.js
│   │   ├── role.js
│   │   ├── secOps.js
│   │   ├── systemSettings.js
│   │   ├── tenant.js
│   │   ├── tenantUser.js
│   │   ├── threat.js
│   │   ├── user.js
│   │   ├── userSession.js
│   │   └── vulnerability.js
│   ├── routes/              # API route definitions
│   │   ├── assetRoutes.js
│   │   ├── authRoutes.js
│   │   ├── complianceRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── policyRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── samlRoutes.js
│   │   ├── secOpsRoutes.js
│   │   ├── tenantRoutes.js
│   │   ├── testRoutes.js
│   │   ├── threatRoutes.js
│   │   ├── userRoutes.js
│   │   └── vulnerabilityRoutes.js
│   ├── services/            # Business logic layer
│   │   ├── assetServices.js
│   │   ├── auditLogServices.js
│   │   ├── authServices.js
│   │   ├── cacheServices.js
│   │   ├── cookieServices.js
│   │   ├── notificationServices.js
│   │   ├── policyServices.js
│   │   ├── rbacServices.js
│   │   ├── reportServices.js
│   │   ├── secOpsServices.js
│   │   ├── tenantServices.js
│   │   ├── threatServices.js
│   │   ├── transactionControl.js
│   │   └── userServices.js
│   ├── utils/               # Utility functions
│   │   └── jwt.js
│   ├── app.js               # Express app configuration
│   └── server.js            # Server entry point
├── sample-data/             # Sample CSV data for testing
│   ├── compliance.csv
│   ├── secops.csv
│   ├── threats.csv
│   └── vulnerabilities.csv
├── .gitignore
├── .prettierrc              # Prettier configuration
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies and scripts
└── README.md
```

## 📊 Data Models

### Core Entities

#### User
- Email, password (hashed), SSO integration
- Roles and permissions
- Login history and preferences
- Status tracking (active, inactive, pending, suspended)

#### Tenant
- Multi-tenant organization management
- Plan-based access (free, standard, enterprise)
- Branding and security settings
- Cloud integrations (AWS, Slack, SIEM)
- Billing information

#### Asset
- Cloud resources across AWS, Azure, GCP, on-prem
- Resource type, provider, region
- Health status and lifecycle state
- Tags, environment (prod, staging, dev, test)
- Metrics and metadata

#### Vulnerability
- CVE tracking and severity classification
- Asset associations
- Detection source (Inspector, custom scanner, manual)
- Status workflow (open, in_progress, resolved, ignored)
- Remediation steps and automation

#### Threat
- Security threat detection and tracking
- Sources: GuardDuty, Security Hub, CloudWatch, external feeds
- Severity levels and confidence scores
- Status tracking (active, investigating, resolved, false_positive)
- Remediation workflows

#### Compliance
- Framework support: CIS, PCI-DSS, ISO27001, HIPAA, SOC2, Custom
- Control mapping and status
- Evidence collection and remediation tracking
- Resource associations

#### Policy
- IAM, SCP, Security Hub, Config rules
- Version control and change tracking
- Validation and compliance status
- Enforcement tracking and logs

#### SecOps
- Development pipeline security issues
- Tool integration (Semgrep, SonarQube, ESLint)
- Bug, vulnerability, and code smell tracking
- Project and repository association

#### Report
- Security posture and compliance reports
- Multiple formats (PDF, CSV, JSON, XLSX)
- Scheduled generation and distribution
- Historical tracking

### Supporting Entities

- **Role**: RBAC role definitions with permissions
- **Permission**: Granular access control
- **TenantUser**: User-tenant-role associations
- **AuditLog**: Complete audit trail
- **UserSession**: Token-based session management
- **Notification**: Alert and notification system
- **SystemSettings**: Global configuration
- **CloudConnector**: Cloud provider integrations

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login (JWT)
- `POST /logout` - User logout
- `POST /refresh` - Refresh access token
- `POST /saml/*` - SAML SSO endpoints

### Tenants (`/api/tenants`)
- Tenant management and configuration
- Multi-tenant isolation

### Users (`/api/users`)
- User CRUD operations
- Role assignment
- Profile management

### Assets (`/api/assets`)
- `GET /assets` - List assets with filtering and pagination
- Asset discovery and tracking
- Health status monitoring

### Vulnerabilities (`/api/vulnerabilities`)
- Vulnerability tracking and management
- CVE database integration
- Remediation workflows

### Threats (`/api/threats`)
- Threat detection and monitoring
- Investigation workflows
- False positive handling

### Compliance (`/api/compliance`)
- Framework-based compliance checking
- Control status tracking
- Evidence management

### Policies (`/api/policies`)
- Policy creation and management
- Version control
- Enforcement tracking

### SecOps (`/api/secops`)
- CI/CD security integration
- Code-level issue tracking
- Pipeline security metrics

### Reports (`/api/reports`)
- Report generation
- Scheduled reports
- Export in multiple formats

### Notifications (`/api/notifications`)
- Alert configuration
- Notification delivery
- Preference management

### Test (`/test`)
- Health check endpoint
- API status verification

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login**: User provides credentials → JWT access token + refresh token
2. **Request**: Client includes access token in Authorization header or cookie
3. **Validation**: Middleware validates token and session
4. **Refresh**: Use refresh token to obtain new access token when expired

### Authorization (RBAC)

The system implements comprehensive Role-Based Access Control:

- **Roles**: Defined sets of permissions (admin, user, auditor, etc.)
- **Permissions**: Feature-action pairs (e.g., `assets:read`, `policies:write`)
- **Tenant Context**: Permissions are evaluated per tenant
- **Audit Trail**: All authorization decisions are logged

### Security Features

- Password hashing with bcryptjs
- JWT token validation
- Session management and revocation
- SAML SSO support for enterprise authentication
- Cookie-based and header-based token transmission

## ⚙️ Configuration

### Environment Variables

Key configuration options in `.env`:

- **DB_IN_USE**: Database type (currently supports `mongodb`)
- **MONGODB_URI**: MongoDB connection string
- **MONGODB_DB_NAME**: Database name
- **PORT**: Server port (default: 5000)
- **FRONTEND_URL**: Frontend application URL for CORS
- **JWT_SECRET**: Secret key for JWT signing
- **JWT_REFRESH_SECRET**: Secret key for refresh tokens

### MongoDB Configuration

The application connects to MongoDB on startup. Connection settings are in `src/config/mongodb.js`.

### CORS Configuration

CORS is configured to allow requests from the frontend URL specified in the environment variables.

## 🔧 Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Code Quality

The project uses:
- **ESLint**: Code linting with security, import, and promise plugins
- **Prettier**: Consistent code formatting
- **Security plugins**: Detect security vulnerabilities in code

### ESLint Configuration

Configured with:
- ES6+ module support
- Security vulnerability detection
- Import ordering rules
- Promise best practices
- Prettier integration

### Development Best Practices

1. Use ES6+ features and module syntax
2. Follow the established project structure
3. Implement proper error handling
4. Add JSDoc comments for complex functions
5. Use transactions for multi-document operations
6. Log all security-relevant actions
7. Validate input at controller level
8. Keep business logic in service layer

## 📦 Sample Data

The `sample-data/` directory contains CSV files with sample data for testing:

- **compliance.csv**: Sample compliance controls and status
- **secops.csv**: Sample code security issues from CI/CD
- **threats.csv**: Sample threat findings
- **vulnerabilities.csv**: Sample vulnerability data

These can be imported for testing and demonstration purposes.

## 🔒 Security Features

### Built-in Security

- **Authentication**: JWT-based with refresh tokens
- **Password Security**: Bcrypt hashing
- **Session Management**: Token-based with expiration
- **CORS Protection**: Configurable origin validation
- **Input Validation**: Request validation at controller level
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Prevention**: Input sanitization
- **Audit Logging**: Comprehensive logging of security events

### Security Best Practices

The codebase follows security best practices:
- No hardcoded secrets
- Environment-based configuration
- Secure password hashing
- Token-based authentication
- Session expiration and refresh
- Role-based access control
- Audit trail for all operations

### Code Security

ESLint security plugins detect:
- Eval usage
- Non-literal file system operations
- Unsafe regex patterns
- Other common vulnerabilities

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests as needed
5. Run linting and formatting
6. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify MongoDB is running
   - Check MONGODB_URI in .env
   - Ensure network connectivity

2. **Authentication Errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate session existence

3. **Port Already in Use**
   - Change PORT in .env
   - Kill process using the port

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Note**: This is a backend API service. A separate frontend application is required for the user interface. The API is designed to be consumed by web applications, mobile apps, or other services requiring cloud security posture management capabilities.
