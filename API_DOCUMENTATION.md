# API Documentation

This document provides detailed information about the CSPM API endpoints, request/response formats, and usage examples.

## Base URL

```
http://localhost:5000
```

## Authentication

Most endpoints require authentication. Include the JWT token in one of two ways:

### Method 1: Authorization Header
```http
Authorization: Bearer <access_token>
```

### Method 2: Cookie
The API automatically sends and reads `accessToken` cookie after login.

## Common Response Format

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "data": { /* response data */ },
    "pagination": { /* pagination info if applicable */ }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error description",
    "error": "Detailed error message"
}
```

## Pagination

Endpoints that return lists support pagination via query parameters:

```
?page=1&limit=10
```

Response includes pagination metadata:
```json
{
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 50,
        "itemsPerPage": 10,
        "hasNextPage": true,
        "hasPreviousPage": false
    }
}
```

## API Endpoints

### Authentication & Authorization

#### POST /api/auth/login
Authenticate a user and receive access tokens.

**Request:**
```json
{
    "email": "user@example.com",
    "password": "password123",
    "rememberMe": false
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": "user_id",
            "email": "user@example.com",
            "name": {
                "first": "John",
                "last": "Doe"
            },
            "roles": ["role_id"]
        },
        "accessToken": "jwt_token"
    }
}
```

**Cookies Set:**
- `accessToken`: Valid for 1 hour
- `refreshToken`: Valid for 7 days (if rememberMe is true)

#### POST /api/auth/logout
Logout user and revoke tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "success": true,
    "message": "Logout successful"
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request:**
Refresh token should be in cookie or body:
```json
{
    "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "accessToken": "new_access_token"
    }
}
```

#### SAML Endpoints

- `GET /api/auth/saml/login` - Initiate SAML login
- `POST /api/auth/saml/callback` - SAML callback handler
- `GET /api/auth/saml/metadata` - SAML metadata endpoint

---

### Assets

#### GET /api/assets
Retrieve list of assets with filtering and pagination.

**Authentication:** Required

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `resourceType` (string): Filter by resource type
- `environment` (string): Filter by environment (production, staging, development, test)
- `region` (string): Filter by cloud region

**Request:**
```http
GET /api/assets?page=1&limit=10&environment=production&region=us-east-1
```

**Response:**
```json
{
    "success": true,
    "message": "Assets Fetched Successfully",
    "data": [
        {
            "_id": "asset_id",
            "tenantId": "tenant_id",
            "name": "Web Server 01",
            "resourceId": "i-1234567890abcdef0",
            "resourceType": "EC2Instance",
            "provider": "aws",
            "region": "us-east-1",
            "environment": "production",
            "healthStatus": "healthy",
            "lifecycleState": "active",
            "tags": {
                "Name": "WebServer",
                "Environment": "Production"
            },
            "lastScannedAt": "2025-11-13T00:00:00.000Z",
            "createdAt": "2025-10-01T00:00:00.000Z",
            "updatedAt": "2025-11-13T00:00:00.000Z"
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 50,
        "itemsPerPage": 10
    }
}
```

**Response Headers:**
- `Cache-Control`: `private, max-age=300, stale-while-revalidate=120`
- `ETag`: Content hash for caching
- `Vary`: `Cookie`

**Status Codes:**
- `200 OK`: Success
- `304 Not Modified`: Content not changed (ETag match)
- `401 Unauthorized`: Authentication required
- `500 Internal Server Error`: Server error

---

### Vulnerabilities

#### GET /api/vulnerabilities
Retrieve vulnerabilities with filtering.

**Authentication:** Required

**Query Parameters:**
- `page`, `limit`: Pagination
- `severity` (string): Filter by severity (low, medium, high, critical)
- `status` (string): Filter by status (open, in_progress, resolved, ignored)
- `assetId` (string): Filter by specific asset

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "vuln_id",
            "tenantId": "tenant_id",
            "assetId": "asset_id",
            "source": "inspector",
            "title": "CVE-2023-12345: Remote Code Execution",
            "description": "Critical vulnerability in package XYZ",
            "cveId": "CVE-2023-12345",
            "severity": "critical",
            "status": "open",
            "detectedAt": "2025-11-13T00:00:00.000Z",
            "lastUpdatedAt": "2025-11-13T00:00:00.000Z",
            "remediation": {
                "steps": ["Update to version 2.0.0", "Restart service"],
                "automated": false
            },
            "metadata": {
                "package": "vulnerable-lib",
                "version": "1.0.0"
            }
        }
    ],
    "pagination": { /* pagination info */ }
}
```

---

### Threats

#### GET /api/threats
Retrieve threat findings.

**Authentication:** Required

**Query Parameters:**
- `page`, `limit`: Pagination
- `severity` (string): Filter by severity
- `status` (string): Filter by status (active, investigating, resolved, false_positive)
- `source` (string): Filter by source (guardduty, security_hub, cloudwatch, external_feed, manual)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "threat_id",
            "tenantId": "tenant_id",
            "assetId": "asset_id",
            "source": "guardduty",
            "title": "Suspicious API Activity",
            "description": "Unusual API calls detected from unknown IP",
            "severity": "high",
            "category": "intrusion",
            "type": "UnauthorizedAccess:IAMUser",
            "status": "investigating",
            "confidence": 95,
            "region": "us-east-1",
            "detectedAt": "2025-11-13T00:00:00.000Z",
            "remediation": {
                "steps": ["Investigate IP address", "Review IAM permissions"],
                "automated": false
            }
        }
    ],
    "pagination": { /* pagination info */ }
}
```

---

### Compliance

#### GET /api/compliance
Retrieve compliance control status.

**Authentication:** Required

**Query Parameters:**
- `page`, `limit`: Pagination
- `framework` (string): Filter by framework (CIS, PCI-DSS, ISO27001, HIPAA, SOC2, Custom)
- `status` (string): Filter by status (compliant, non_compliant, not_applicable, unknown)
- `severity` (string): Filter by severity

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "compliance_id",
            "tenantId": "tenant_id",
            "framework": "CIS",
            "controlId": "2.1.1",
            "controlTitle": "Ensure MFA is enabled for all IAM users",
            "description": "Multi-factor authentication adds an extra layer of security",
            "status": "non_compliant",
            "severity": "high",
            "resourceIds": ["asset_id_1", "asset_id_2"],
            "lastCheckedAt": "2025-11-13T00:00:00.000Z",
            "remediationSteps": [
                "Enable MFA for all users",
                "Verify MFA devices are registered"
            ]
        }
    ],
    "pagination": { /* pagination info */ }
}
```

---

### Policies

#### GET /api/policies
Retrieve security policies.

**Authentication:** Required

**Query Parameters:**
- `page`, `limit`: Pagination
- `category` (string): Filter by category (IAM, SCP, SecurityHub, ConfigRule, Custom)
- `complianceStatus` (string): Filter by compliance status
- `enforcementStatus` (string): Filter by enforcement status

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "policy_id",
            "tenantId": "tenant_id",
            "name": "Enforce S3 Bucket Encryption",
            "description": "All S3 buckets must have encryption enabled",
            "category": "ConfigRule",
            "type": "json",
            "document": { /* policy JSON */ },
            "version": 2,
            "validationStatus": "valid",
            "complianceStatus": "compliant",
            "enforcementStatus": "enforced",
            "createdBy": "user_id",
            "lastEvaluatedAt": "2025-11-13T00:00:00.000Z"
        }
    ],
    "pagination": { /* pagination info */ }
}
```

#### POST /api/policies
Create a new policy.

**Authentication:** Required

**Request:**
```json
{
    "name": "New Security Policy",
    "description": "Policy description",
    "category": "Custom",
    "type": "json",
    "document": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": ["s3:GetObject"],
                "Resource": ["arn:aws:s3:::bucket/*"]
            }
        ]
    }
}
```

---

### SecOps

#### GET /api/secops
Retrieve code security issues from CI/CD pipelines.

**Authentication:** Required

**Query Parameters:**
- `page`, `limit`: Pagination
- `project` (string): Filter by project name
- `repository` (string): Filter by repository
- `severity` (string): Filter by severity
- `status` (string): Filter by status (open, resolved)
- `reportType` (string): Filter by type (bug, vulnerability, code_smell)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "secops_id",
            "tenantId": "tenant_id",
            "project": "auth-service",
            "repository": "github.com/org/auth-service",
            "branch": "main",
            "commitId": "abc123",
            "tool": "sonarqube",
            "reportType": "vulnerability",
            "ruleId": "squid:S2076",
            "ruleName": "OS Command injection",
            "severity": "high",
            "status": "open",
            "issueKey": "SONAR-123",
            "filePath": "src/utils.js",
            "line": 45,
            "introducedAt": "2025-11-13T00:00:00.000Z",
            "tags": ["security", "injection"],
            "owner": "secops-team"
        }
    ],
    "pagination": { /* pagination info */ }
}
```

---

### Reports

#### GET /api/reports
Retrieve generated reports.

**Authentication:** Required

**Query Parameters:**
- `page`, `limit`: Pagination
- `type` (string): Filter by report type (security_posture, compliance, vulnerability, custom, audit)
- `status` (string): Filter by status (completed, pending, failed)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "report_id",
            "tenantId": "tenant_id",
            "title": "Monthly Security Posture Report",
            "description": "Comprehensive security assessment for November 2025",
            "type": "security_posture",
            "format": "pdf",
            "generatedBy": "user_id",
            "generatedAt": "2025-11-13T00:00:00.000Z",
            "status": "completed",
            "fileUrl": "https://storage.example.com/reports/report_id.pdf",
            "dataSummary": {
                "totalAssets": 150,
                "criticalVulnerabilities": 5,
                "openThreats": 12,
                "complianceScore": 92
            }
        }
    ],
    "pagination": { /* pagination info */ }
}
```

#### POST /api/reports
Generate a new report.

**Authentication:** Required

**Request:**
```json
{
    "title": "Weekly Compliance Report",
    "description": "Compliance status across all frameworks",
    "type": "compliance",
    "format": "pdf",
    "scheduled": false
}
```

---

### Tenants

#### GET /api/tenants
Retrieve tenant information (admin only).

**Authentication:** Required (Admin)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "tenant_id",
            "name": "Acme Corporation",
            "description": "Enterprise customer",
            "status": "active",
            "plan": "enterprise",
            "contactEmail": "admin@acme.com",
            "region": "us-east-1",
            "settings": {
                "branding": {
                    "themeColor": "#5F9C45"
                },
                "security": {
                    "ssoEnabled": true
                }
            }
        }
    ]
}
```

#### POST /api/tenants
Create a new tenant (super admin only).

---

### Users

#### GET /api/users
Retrieve users list.

**Authentication:** Required

**Query Parameters:**
- `page`, `limit`: Pagination
- `status` (string): Filter by status (active, inactive, pending, suspended)
- `role` (string): Filter by role

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "user_id",
            "email": "user@example.com",
            "name": {
                "first": "John",
                "last": "Doe"
            },
            "roles": ["role_id"],
            "status": "active",
            "lastLogin": "2025-11-13T00:00:00.000Z",
            "preferences": {
                "theme": "dark",
                "notifications": true,
                "language": "en"
            }
        }
    ],
    "pagination": { /* pagination info */ }
}
```

---

### Notifications

#### GET /api/notifications
Retrieve notifications for current user.

**Authentication:** Required

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "notification_id",
            "userId": "user_id",
            "tenantId": "tenant_id",
            "type": "security_alert",
            "title": "Critical Vulnerability Detected",
            "message": "A critical vulnerability was found in asset XYZ",
            "severity": "critical",
            "read": false,
            "createdAt": "2025-11-13T00:00:00.000Z"
        }
    ]
}
```

#### PATCH /api/notifications/:id/read
Mark notification as read.

---

### Test / Health Check

#### GET /test
API health check endpoint (no authentication required).

**Response:**
```json
{
    "status": "ok",
    "message": "API is running",
    "timestamp": "2025-11-13T05:00:00.000Z"
}
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 304 | Not Modified - Resource not modified (cache valid) |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

---

## Rate Limiting

Currently, the API does not implement rate limiting. This should be added for production deployments.

---

## Caching

The API implements HTTP caching for performance:

- **ETag**: Content-based cache validation
- **Cache-Control**: Private caching with 5-minute max-age
- **Vary**: Cache varies by Cookie header

Clients should:
1. Store the `ETag` from responses
2. Send `If-None-Match` header with ETag on subsequent requests
3. Handle `304 Not Modified` responses by using cached data

---

## Best Practices

### Authentication
- Always include the access token in requests
- Refresh token before expiration
- Handle 401 responses by redirecting to login

### Pagination
- Use reasonable page sizes (10-50 items)
- Don't fetch all items at once
- Implement proper pagination UI

### Error Handling
- Always check the `success` field in responses
- Display user-friendly error messages
- Log errors for debugging

### Performance
- Use filters to reduce data transfer
- Implement proper caching strategies
- Cache responses based on ETag headers

---

## Sample cURL Commands

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Get Assets
```bash
curl -X GET "http://localhost:5000/api/assets?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Vulnerabilities
```bash
curl -X GET "http://localhost:5000/api/vulnerabilities?severity=critical&status=open" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Health Check
```bash
curl -X GET http://localhost:5000/test
```

---

## WebSocket Support

Currently, the API does not support WebSocket connections. Real-time updates are handled through polling. Consider implementing WebSocket support for:
- Real-time threat alerts
- Live compliance status updates
- Notification delivery

---

## GraphQL Support

The API currently uses REST architecture. GraphQL support could be added to allow:
- Flexible queries
- Reduced over-fetching
- Better type safety

---

## Versioning

API versioning is not currently implemented. Future versions should use URL-based versioning:
- `/api/v1/assets`
- `/api/v2/assets`

---

For more information, see the main [README.md](README.md) file.
