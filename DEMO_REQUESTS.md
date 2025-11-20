# Demo Requests System

## Overview

The demo requests system captures and persists demo scheduling requests from users who interact with the OnKlinic AI agent in the landing page chat.

## Architecture

### Storage
- **Backend**: Netlify Blobs
- **Namespace**: `ok_demo_requests` (configurable via `DEMO_REQUESTS_NAMESPACE` env var)
- **File**: `demos.json` (JSON array of demo request objects)

### Data Structure

Each demo request contains:

```typescript
{
  id: string;              // UUID generated on creation
  createdAt: string;       // ISO 8601 timestamp
  source: string;          // Always "landing-chat"
  name: string;            // User's name
  email: string;           // User's email
  role: string;            // User's professional role
  team_size: number;       // Number of clinicians
  timezone: string;        // User's timezone
  preferred_slots: string[]; // Array of preferred time slots
  notes: string;           // Additional notes from user
  locale?: string;         // Language preference ("en" or "es")
}
```

## Flow

1. **User Interaction**: User chats with OnKlinic agent and expresses interest in a demo
2. **Data Collection**: Agent collects all required information (name, email, role, team size, timezone, slots, notes)
3. **Language Detection**: Agent detects user's language and includes it as locale
4. **Tool Execution**: Agent calls `scheduleDemo` tool with collected data
5. **Persistence**: Request is saved to Netlify Blobs via `saveDemoRequest()`
6. **Confirmation**: User receives confirmation message in their language

## Files

### Core Implementation
- `netlify/lib/okhowtoStore.ts`: Data persistence layer
  - `saveDemoRequest()`: Saves new demo request to Blobs
  - `getAllDemoRequests()`: Retrieves all demo requests
  - Type definitions: `DemoRequest`

### Agent Integration
- `src/agents/onklinicAgent.ts`: AI agent with scheduleDemo tool
  - Imports `saveDemoRequest` from okhowtoStore
  - Handles language detection
  - Provides bilingual confirmation messages
  - Graceful error handling

### API Endpoint
- `netlify/functions/demo-requests.ts`: GET endpoint to fetch all demo requests
  - Route: `/.netlify/functions/demo-requests`
  - Returns JSON with demos array and count
  - Sorted by most recent first

## Usage

### Accessing Demo Requests

**Via API:**
```bash
GET /.netlify/functions/demo-requests
```

**Response:**
```json
{
  "demos": [
    {
      "id": "uuid-here",
      "createdAt": "2025-11-20T12:00:00.000Z",
      "source": "landing-chat",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "Clinical Director",
      "team_size": 5,
      "timezone": "America/New_York",
      "preferred_slots": ["Monday 2-4pm", "Wednesday 10am-12pm"],
      "notes": "Interested in team rollout",
      "locale": "en"
    }
  ],
  "count": 1
}
```

### Environment Variables

Optional configuration:
- `DEMO_REQUESTS_NAMESPACE`: Blob storage namespace (default: `ok_demo_requests`)

## Security

- All demo request handling happens server-side in Netlify Functions
- No client-side exposure of blob storage keys
- CORS headers properly configured
- No PHI or sensitive clinical data is stored

## Error Handling

The system includes graceful error handling:
- If blob storage fails, user still receives confirmation message
- Error is logged server-side for debugging
- User is informed to contact team directly if no response within 24h

## Future Enhancements

Potential improvements:
- Email notification to team when new demo request arrives
- Admin UI to view and manage demo requests
- Status field (pending, scheduled, completed)
- Integration with calendar scheduling tool
- Export to CSV functionality
