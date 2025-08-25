## Overview

This document describes the API endpoints for the Timeline Communication App. The API follows RESTful conventions and returns JSON responses.

### Base URL
```
Production: https://api.timeline-app.com/v1
Staging: https://staging-api.timeline-app.com/v1
Development: http://localhost:3001/api/v1
```

### Authentication
All API requests require authentication using Bearer tokens:
```
Authorization: Bearer <your-token>
```

## Events API

### GET /events
Retrieve all events with optional filtering.

**Query Parameters:**
- `priority`: Filter by priority (urgent, high, medium, low)
- `status`: Filter by status
- `from`: Filter by sender (Contractor, NHAI)
- `date_start`: Start date filter (YYYY-MM-DD)
- `date_end`: End date filter (YYYY-MM-DD)
- `search`: Search in subject and description
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "from": "Contractor",
      "to": "NHAI",
      "date": "2024-01-15",
      "letterNo": "ABC/LET/001",
      "subject": "Award of contract and LOA issuance",
      "description": "...",
      "assignee": "Project Manager - John Doe",
      "attachments": ["file1.pdf"],
      "priority": "high",
      "contractDeadline": "2024-01-20",
      "isOverdue": false
    }
  ],
  "success": true,
  "message": "Events retrieved successfully",
  "timestamp": "2024-01-20T10:00:00Z",
  "metadata": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### POST /events
Create a new event.

**Request Body:**
```json
{
  "from": "Contractor",
  "to": "NHAI",
  "date": "2024-01-15",
  "letterNo": "ABC/LET/001",
  "subject": "Event subject",
  "description": "Event description",
  "assignee": "John Doe",
  "priority": "high",
  "contractDeadline": "2024-01-20"
}
```

### PUT /events/:id
Update an existing event.

### DELETE /events/:id
Delete an event.

## Analytics API

### GET /analytics/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "data": {
    "totalEvents": 100,
    "contractorEvents": 60,
    "nhaiEvents": 40,
    "urgentEvents": 5,
    "overdueEvents": 8,
    "completedEvents": 75,
    "averageResponseTime": 2.5,
    "trendsData": [...]
  },
  "success": true,
  "message": "Dashboard analytics retrieved successfully"
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-20T10:00:00Z",
  "details": "Additional error details"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated requests

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```
