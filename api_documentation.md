# DevPath AI — API Documentation (Updated)

This file documents the current backend implementation (v3.0.0 - Stateful Edition). It lists endpoints, request/response shapes, authentication system, database integration, concurrency/limits, AI behaviors, GitHub interactions, TypeScript interfaces, sample requests, and frontend guidance. Use it as the single source of truth for building the frontend.

Repository base: `c:/Users/bhide/Dev/devpath-ai/devpath-ai-backend`

## How to run locally

- Start the FastAPI server (PowerShell):

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Default base URL: `http://localhost:8000`

## Environment / secrets

- The backend uses Pydantic Settings (`app/config.py`) to load environment variables from a `.env` file.
- Required environment variables:
  - `GEMINI_API_KEY` — Gemini (Generative AI) API key for AI-powered analysis.
  - `GITHUB_CLIENT_ID` — GitHub OAuth application client ID.
  - `GITHUB_CLIENT_SECRET` — GitHub OAuth application client secret.
  - `DATABASE_URL` — Database connection string (PostgreSQL or SQLite).
  - `SECRET_KEY` — Secret key for JWT token signing and encryption (minimum 32 characters).

Example `.env` for PostgreSQL:

```
GEMINI_API_KEY=your-gemini-api-key-here
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/devpath_db
SECRET_KEY=your-random-secret-key-min-32-chars
```

Example `.env` for SQLite (development only):

```
GEMINI_API_KEY=your-gemini-api-key-here
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
DATABASE_URL=sqlite+aiosqlite:///./devpath.db
SECRET_KEY=your-random-secret-key-min-32-chars
```

Security note: Protect these secrets on the server. Never expose them to the frontend. The SECRET_KEY is used for encrypting GitHub tokens in the database and signing JWT tokens.

## CORS and Middleware

The backend includes:

1. **CORS Middleware** — Configured to allow cross-origin requests from the frontend.

   - Default allowed origins: `http://localhost:3000`, `http://localhost:5173`, `http://localhost:8000`
   - Override via environment variable: `ALLOWED_ORIGINS="http://localhost:3000,https://app.example.com"`
   - Credentials allowed: Yes
   - Methods: All (`*`)
   - Headers: All (`*`)

2. **HTTP Timing Middleware** — Automatically measures and logs request processing time.
   - Adds `X-Process-Time` response header (in seconds, e.g., `"0.234"`)
   - Logs each request: `[HTTP] METHOD /path -> STATUS (TIME)`
   - Useful for frontend performance monitoring and debugging

## Authentication System (NEW in v3.0.0)

The backend now implements a complete stateful authentication system with database persistence:

### Two-Token System

1. **GitHub OAuth Token** — Used to access GitHub API on behalf of the user

   - Obtained via GitHub OAuth flow
   - Encrypted and stored in the database
   - Never exposed to frontend after initial login

2. **Application JWT Token** — Used to authenticate requests to the backend
   - Issued by the backend after successful GitHub OAuth
   - Short-lived (7 days by default)
   - Must be included in `Authorization: Bearer <JWT_TOKEN>` header
   - Contains user ID in the payload

### Authentication Flow (Complete)

1. Frontend redirects user to GitHub OAuth URL
2. User authorizes the application on GitHub
3. GitHub redirects back with authorization code
4. Frontend calls `GET /auth/github/callback?code=<code>`
5. Backend exchanges code for GitHub access token
6. Backend fetches user profile from GitHub API
7. Backend creates/updates user in database with encrypted GitHub token
8. Backend returns JWT token to frontend
9. Frontend stores JWT token and uses it for all subsequent requests

### Protected Endpoints

The following endpoints now require authentication (JWT token in Authorization header):

- `POST /analyze` — Full GitHub profile analysis (renamed from /full-analysis)
- `POST /generate-track` — Career track generation
- `POST /market-match` — Job market gap analysis
- `GET /reports/` — Get user's analysis history
- `GET /reports/{report_id}` — Get specific analysis report
- `DELETE /reports/{report_id}` — Delete specific analysis report

### Public Endpoints (No Authentication Required)

- `GET /` — Welcome message
- `GET /health` — Health check
- `GET /health/ready` — Readiness check
- `GET /auth/github/callback` — OAuth callback (returns JWT token)

## Global runtime behavior and limits

- REPO_PROCESSING_LIMIT = 30 — endpoints that scan repos will only process the top 30 repositories returned by GitHub to avoid runaway work.
- COMMIT_FETCH_LIMIT = 100 — how many commits to fetch per repo when analyzing commit history.
- Gemini concurrency: the backend uses an asyncio.Semaphore (size 10) around costly Gemini calls to avoid overloading the AI API.
- GitHub tree calls may return truncated trees; the code has a fallback to try `main` then `master` branches.

## Complete Endpoint Reference (v3.0.0)

### 1) GET /

- Purpose: Health/welcome message.
- Auth: None.
- Response: 200 OK

Example:

```json
{ "message": "Welcome to DevPath AI v3. The stateful oracle is ready." }
```

### 2) GET /health

- Purpose: Liveness health check for load balancers.
- Auth: None.
- Response: 200 OK

Example:

```json
{
  "status": "healthy",
  "version": "3.0.0"
}
```

### 3) GET /health/ready

- Purpose: Readiness health check (validates service dependencies).
- Auth: None.
- Response: 200 OK if all services are operational, 503 Service Unavailable otherwise.

Example success:

```json
{
  "status": "ready",
  "services": {
    "database": "connected",
    "gemini": "configured"
  }
}
```

### 4) GET /auth/github/callback

- Purpose: OAuth callback endpoint to exchange a GitHub authorization code for application JWT token.
- Auth: None (public endpoint).
- Query parameter: `code` (required) — the authorization code from GitHub OAuth flow.
- Response: 200 OK with JWT token, or 400 Bad Request on error.

Complete workflow:

1. Backend exchanges code for GitHub access token
2. Backend fetches user profile from GitHub
3. Backend checks if user exists in database (by github_id)
4. If new user: creates user record with encrypted GitHub token
5. If existing user: updates encrypted GitHub token
6. Backend generates JWT token containing user ID
7. Returns JWT token to frontend

Example request:

```
GET /auth/github/callback?code=abc123xyz
```

Example success response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

Example error response (400):

```json
{
  "detail": "Failed to exchange code for GitHub token"
}
```

Notes:

- The returned `access_token` is the application JWT token (NOT the GitHub token).
- This JWT token must be stored securely by the frontend.
- Use this JWT token in the Authorization header for all protected endpoints.
- The GitHub token is encrypted and stored in the database, never exposed to the frontend.
- JWT token expires after 7 days by default.

### 5) POST /analyze

IMPORTANT: This endpoint was renamed from `/full-analysis` to `/analyze` in v3.0.0.

- Purpose: Full, comprehensive analysis of a user's GitHub presence with automatic database persistence.
- Auth: Required. Header: `Authorization: Bearer <JWT_TOKEN>` (application JWT, NOT GitHub token).
- Rate limit: 5 requests per hour per IP address.
- Response model: `FullReport` (defined in `app/schemas.py`).

What happens when you call this endpoint:

1. Backend validates JWT token and retrieves user from database
2. Backend decrypts user's GitHub token from database
3. Backend performs complete GitHub analysis (repos, commits, skills, etc.)
4. Backend saves analysis results to database (auto-prunes to keep last 3 reports)
5. Backend returns full analysis report
6. Report is retrievable later via `/reports/{report_id}` endpoint

Behavior and pipeline (step-by-step):

- Validate Authorization header format (must start with `Bearer `). Returns 400 if invalid.
- Call GitHub's `/user/repos` with `per_page=100` and `sort=pushed` to list repositories.
- Process up to `REPO_PROCESSING_LIMIT` repos concurrently. For each repo:
  - Fetch README (raw) via GitHub API; generate a one-sentence summary using Gemini (with rate-limiting semaphore).
  - Fetch `requirements.txt` and `package.json` (raw when present) and parse using `parser_service` to extract recognized skills from `KNOWN_SKILLS`.
  - Build a `RepoReport` with `name`, `skills` and `ai_summary`.
- Aggregate `skill_constellation` across repos.
- Fetch commit messages (up to `COMMIT_FETCH_LIMIT`) from up to 10 repositories and feed into Gemini to determine `developer_archetype`.
- Identify 1–3 `flagship_projects` via Gemini from the `RepoReport` list.
- For flagships, the backend fetches the repo's file tree (recursive) and picks a candidate source file (largest `.py`, `.ts`, `.js`) as a representative code sample. The sample is trimmed and sent to Gemini to create an `ai_code_quality_summary`.
- Gemini is also used to produce `suggested_paths` (career paths) and `suggested_projects` (3 new project ideas) for the developer; these are included on the returned `FullReport`.

Possible responses and status codes:

- 200 OK — returns `FullReport` JSON and saves to database.
- 401 Unauthorized — missing or invalid JWT token.
- 404 Not Found — no repos returned from GitHub (user has no repos or GitHub token is expired).
- 429 Too Many Requests — rate limit exceeded (5 per hour).
- 500 Internal Server Error — decryption failure, GitHub API error, or unexpected server error.

Notes on long-running work:

- `/analyze` can be CPU/IO-heavy and may take 30-60 seconds (or more) depending on the number of repos and Gemini latency.
- The frontend should present a progress indicator with status messages.
- Consider implementing a loading state with estimated time remaining.
- The analysis result is automatically saved to the database and can be retrieved later without re-running the analysis.
- Users can view their analysis history via the `/reports/` endpoint.

### 6) POST /generate-track

- Purpose: Produce a structured, multi-step career track (learning_step, bridge_project, capstone_project) tailored to the user's current skills and a target domain.
- Auth: Required. Header: `Authorization: Bearer <JWT_TOKEN>`.
- Rate limit: 10 requests per hour per IP address.
- Request body (CareerTrackRequest):

```json
{
  "current_skills": ["fastapi", "postgres"],
  "target_domain": "frontend development with React"
}
```

Input validation:

- `current_skills`: Must have 1-50 items, each skill must be less than 100 characters
- `target_domain`: Must be 3-200 characters

Possible responses:

- 200 OK — returns `CareerTrack` object
- 401 Unauthorized — missing or invalid JWT token
- 422 Unprocessable Entity — validation error (invalid input)
- 429 Too Many Requests — rate limit exceeded (10 per hour)

Response: `CareerTrack` object with `target_domain`, `learning_step`, `bridge_project`, and `capstone_project`.

### 7) POST /market-match

- Purpose: Compare a user's skills against an ideal job profile and produce a Gap Analysis.
- Auth: Required. Header: `Authorization: Bearer <JWT_TOKEN>`.
- Rate limit: 20 requests per hour per IP address.
- Request body (MarketMatchRequest):

```json
{
  "user_skills": ["fastapi", "pydantic", "docker"],
  "job_title": "Senior Python Backend Developer"
}
```

Input validation:

- `user_skills`: Must have 1-50 items, each skill must be less than 100 characters
- `job_title`: Must be 3-150 characters

Possible responses:

- 200 OK — returns `GapAnalysis` object
- 401 Unauthorized — missing or invalid JWT token
- 404 Not Found — job title not found in server's job profiles
- 422 Unprocessable Entity — validation error (invalid input)
- 429 Too Many Requests — rate limit exceeded (20 per hour)

Response: `GapAnalysis` object with `matching_skills`, `missing_skills`, and `summary_paragraph`.

Notes:

- The endpoint will return 404 if the supplied `job_title` is not present in the server's `IDEAL_JOB_PROFILES` mapping.
- Available job titles (20 total, case-sensitive):
  1. Data Engineer
  2. ML Engineer
  3. Senior React Developer
  4. Senior Python Backend Developer
  5. DevOps Engineer
  6. Generative AI Specialist
  7. Cloud Solutions Architect
  8. Security Engineer
  9. Mobile App Developer
  10. AI Product Engineer
  11. Data Scientist
  12. Full Stack Engineer
  13. Site Reliability Engineer (SRE)
  14. AI Infrastructure Engineer
  15. Data Platform Engineer
  16. Blockchain Developer
  17. Computer Vision Engineer
  18. AI Prompt Engineer
  19. Automation Engineer
  20. Embedded Systems Engineer

### 8) GET /reports/

- Purpose: Retrieve the authenticated user's analysis history (list of all saved reports).
- Auth: Required. Header: `Authorization: Bearer <JWT_TOKEN>`.
- Response: Array of `ReportHistoryItem` objects, sorted by most recent first.

Example request:

```
GET /reports/
Authorization: Bearer <JWT_TOKEN>
```

Example response:

```json
[
  {
    "id": 123,
    "created_at": "2025-11-09T10:30:00Z"
  },
  {
    "id": 122,
    "created_at": "2025-11-08T15:20:00Z"
  },
  {
    "id": 121,
    "created_at": "2025-11-07T09:45:00Z"
  }
]
```

Notes:

- Returns up to 3 most recent reports (older reports are auto-pruned).
- Each item contains the report ID and creation timestamp.
- Use the report ID to fetch the full report data via `GET /reports/{report_id}`.

### 9) GET /reports/{report_id}

- Purpose: Retrieve the full data for a specific saved analysis report.
- Auth: Required. Header: `Authorization: Bearer <JWT_TOKEN>`.
- Path parameter: `report_id` (integer) — the ID of the report to retrieve.
- Response: Full `FullReport` object with all analysis data.

Security:

- Users can only access their own reports.
- Attempting to access another user's report returns 403 Forbidden.
- Non-existent report IDs return 404 Not Found.

Example request:

```
GET /reports/123
Authorization: Bearer <JWT_TOKEN>
```

Example response: Same structure as `FullReport` from `/analyze` endpoint.

Possible responses:

- 200 OK — returns `FullReport` object
- 401 Unauthorized — missing or invalid JWT token
- 403 Forbidden — report belongs to another user
- 404 Not Found — report does not exist

### 10) DELETE /reports/{report_id}

- Purpose: Delete a specific saved analysis report.
- Auth: Required. Header: `Authorization: Bearer <JWT_TOKEN>`.
- Path parameter: `report_id` (integer) — the ID of the report to delete.
- Response: 204 No Content on success.

Security:

- Users can only delete their own reports.
- Attempting to delete another user's report returns 403 Forbidden.
- Deleting a non-existent report returns 204 (idempotent operation).

Example request:

```
DELETE /reports/123
Authorization: Bearer <JWT_TOKEN>
```

Possible responses:

- 204 No Content — report successfully deleted
- 401 Unauthorized — missing or invalid JWT token
- 403 Forbidden — report belongs to another user

---

## Models / Schemas (current)

Source of truth: `app/schemas.py`.

Key models and fields (TypeScript equivalents shown below):

- Token (OAuth response)

  - access_token: string
  - token_type: string (default: "bearer")

- User (database model, not exposed in API responses)

  - id: integer
  - github_id: integer
  - email: string (optional)
  - encrypted_github_token: string (never exposed)
  - created_at: datetime

- RepoReport

  - name: string
  - skills: string[]
  - ai_summary: string

- GeneratedProject

  - title: string
  - description: string
  - features: string[]
  - suggested_stack: string[]

- SuggestedPath

  - path_name: string
  - description: string
  - skills_to_develop: string[]

- FullReport (extends DeveloperDNAReport)

  - skill_constellation: string[]
  - developer_archetype: string
  - project_hubs: RepoReport[]
  - flagship_projects: RepoReport[]
  - ai_code_quality_summary: string
  - suggested_paths: SuggestedPath[]
  - suggested_projects: GeneratedProject[]

- ReportHistoryItem

  - id: integer
  - created_at: string (ISO 8601 datetime)

- CareerTrack / CareerTrackRequest

  - CareerTrackRequest: { current_skills: string[], target_domain: string }
  - CareerTrack: { target_domain, learning_step: { title, description }, bridge_project, capstone_project }

- MarketMatchRequest / GapAnalysis
  - MarketMatchRequest: { user_skills: string[], job_title: string }
  - GapAnalysis: { matching_skills: string[], missing_skills: string[], summary_paragraph: string }

## TypeScript interfaces (copy/paste)

```ts
// Authentication
export interface Token {
  access_token: string;
  token_type: string;
}

// Core analysis models
export interface RepoReport {
  name: string;
  skills: string[];
  ai_summary: string;
}

export interface GeneratedProject {
  title: string;
  description: string;
  features: string[];
  suggested_stack: string[];
}

export interface SuggestedPath {
  path_name: string;
  description: string;
  skills_to_develop: string[];
}

export interface FullReport {
  skill_constellation: string[];
  developer_archetype: string;
  project_hubs: RepoReport[];
  flagship_projects: RepoReport[];
  ai_code_quality_summary: string;
  suggested_paths: SuggestedPath[];
  suggested_projects: GeneratedProject[];
}

// Report history
export interface ReportHistoryItem {
  id: number;
  created_at: string; // ISO 8601 datetime string
}

// Career track
export interface CareerTrackRequest {
  current_skills: string[];
  target_domain: string;
}

export interface CareerTrack {
  target_domain: string;
  learning_step: {
    title: string;
    description: string;
  };
  bridge_project: GeneratedProject;
  capstone_project: GeneratedProject;
}

// Market match
export interface MarketMatchRequest {
  user_skills: string[];
  job_title: string;
}

export interface GapAnalysis {
  matching_skills: string[];
  missing_skills: string[];
  summary_paragraph: string;
}
```

## GitHub-related helper endpoints and behaviors (internal services)

- `github_service.get_user_repos(token)` — returns `/user/repos` JSON (per_page=100, sorted by pushed).
- `github_service.get_repo_readme_content(token, full_name)` — returns README raw text or `None` if not present.
- `github_service.get_repo_dependency_file_content(token, full_name, filename)` — fetches arbitrary file content (used for `requirements.txt`, `package.json`, or arbitrary source file paths).
- `github_service.get_repo_commits(token, full_name, limit)` — returns a list of recent commit messages (first line only) for archetype analysis.
- `github_service.get_repo_tree(token, full_name, branch='main')` — fetches the recursive git tree; falls back to `master` if `main` not found; prints a warning if GitHub truncates the tree.
- `github_service.get_source_code_sample(token, full_name, file_path)` — wrapper to read a file's raw content.

Implementation notes:

- `get_repo_tree` may return a truncated tree for very large repositories; code handles this by printing a warning and continuing. The frontend should assume code sample availability is heuristic.
- When selecting a code sample, the backend prefers the largest `.py`, `.ts`, or `.js` file as a heuristic for meaningful code.

## AI (Gemini) features and new endpoints in `gemini_service`

The Gemini integration has grown considerably. Key capabilities used by the backend:

- get_summary_from_readme(readme_content) — one-sentence summary for a repo README.
- get_developer_archetype(commit_messages) — classifies developer as `Builder`, `Refiner`, or `Maintainer` based on commit message patterns.
- get_flagship_projects(repo_reports) — returns 1–3 repo names considered 'flagship'.
- get_code_quality_summary(code_samples) — analyzes selected source file samples and summarizes code quality.
- get_suggested_paths(full_report_json) — returns 3 suggested career paths (Structured JSON -> SuggestedPath[]).
- get_suggested_projects(full_report_json) — returns 3 brand-new project ideas (Structured JSON -> GeneratedProject[]).
- get_career_track(current_skills, target_domain) — used by `/generate-track` to produce a CareerTrack object.
- get_gap_analysis(user_skills, job_title, ideal_profile) — used by `/market-match` to generate a GapAnalysis JSON.

Robustness measures in the AI layer:

- The service configures the Gemini client with the server-side `GEMINI_API_KEY`.
- A `_extract_json` helper attempts to safely extract JSON from the model output (handles code fences and stray text). If parsing fails, the backend logs the issue and returns a safe fallback (empty arrays or default error objects).
- `generate_content_async` is used for non-blocking calls; the backend wraps critical calls in a Semaphore to throttle concurrent Gemini requests.

## Sample requests (curl and JS/TS)

Replace `{{API_BASE}}` with `http://localhost:8000`.
Replace `{{JWT_TOKEN}}` with the JWT token received from `/auth/github/callback`.

### 1) OAuth callback (GET /auth/github/callback)

```bash
curl -X GET "{{API_BASE}}/auth/github/callback?code=abc123xyz"
```

Response contains the JWT token to use in subsequent requests.

### 2) Full analysis (POST /analyze)

IMPORTANT: Endpoint renamed from /full-analysis to /analyze in v3.0.0.

```bash
curl -X POST "{{API_BASE}}/analyze" \
  -H "Authorization: Bearer {{JWT_TOKEN}}" \
  -H "Accept: application/json"
```

### 3) Get report history (GET /reports/)

```bash
curl -X GET "{{API_BASE}}/reports/" \
  -H "Authorization: Bearer {{JWT_TOKEN}}"
```

### 4) Get specific report (GET /reports/{report_id})

```bash
curl -X GET "{{API_BASE}}/reports/123" \
  -H "Authorization: Bearer {{JWT_TOKEN}}"
```

### 5) Delete report (DELETE /reports/{report_id})

```bash
curl -X DELETE "{{API_BASE}}/reports/123" \
  -H "Authorization: Bearer {{JWT_TOKEN}}"
```

### 6) Generate career track (POST /generate-track)

```bash
curl -X POST "{{API_BASE}}/generate-track" \
  -H "Authorization: Bearer {{JWT_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"current_skills":["fastapi","postgres"],"target_domain":"frontend with React"}'
```

### 7) Market match (POST /market-match)

```bash
curl -X POST "{{API_BASE}}/market-match" \
  -H "Authorization: Bearer {{JWT_TOKEN}}" \
  -H "Content-Type: application/json" \
  -d '{"user_skills":["fastapi","docker"], "job_title":"Senior Python Backend Developer"}'
```

### 8) JS/TypeScript helper (updated for v3.0.0)

```ts
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

// Store JWT token (use secure storage in production)
let jwtToken: string | null = null;

export function setAuthToken(token: string) {
  jwtToken = token;
  // In production, store in httpOnly cookie or secure storage
  localStorage.setItem("jwt_token", token);
}

export function getAuthToken(): string | null {
  if (!jwtToken) {
    jwtToken = localStorage.getItem("jwt_token");
  }
  return jwtToken;
}

export function clearAuthToken() {
  jwtToken = null;
  localStorage.removeItem("jwt_token");
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) || {}),
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "omit",
    headers,
    ...options,
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Token expired or invalid - clear token and redirect to login
      clearAuthToken();
      throw new Error("Authentication required. Please log in again.");
    }
    const text = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }

  // Handle 204 No Content responses
  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

// Example: OAuth callback
// const response = await apiFetch<Token>('/auth/github/callback?code=abc123');
// setAuthToken(response.access_token);

// Example: full analysis (renamed endpoint)
// const report = await apiFetch<FullReport>('/analyze', { method: 'POST' });

// Example: get report history
// const history = await apiFetch<ReportHistoryItem[]>('/reports/');

// Example: get specific report
// const report = await apiFetch<FullReport>('/reports/123');

// Example: delete report
// await apiFetch('/reports/123', { method: 'DELETE' });

// Example: generate career track
// const track = await apiFetch<CareerTrack>('/generate-track', {
//   method: 'POST',
//   body: JSON.stringify({ current_skills: ['python', 'fastapi'], target_domain: 'machine learning' })
// });

// Example: market match
// const gap = await apiFetch<GapAnalysis>('/market-match', {
//   method: 'POST',
//   body: JSON.stringify({ user_skills: ['python', 'docker'], job_title: 'Senior Python Backend Developer' })
// });
```

## Frontend integration notes & UX suggestions

### Complete OAuth and Authentication Flow (v3.0.0)

1. **Initial login redirect**

   - Redirect users to GitHub OAuth authorize URL: `https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=repo,user`
   - Recommended scopes: `repo` (for private repos), `user` (for profile data)

2. **Handle OAuth callback**

   - GitHub redirects back to your app with a `code` query parameter
   - Call `GET /auth/github/callback?code=<code>` from your backend
   - Backend returns JWT token in response

3. **Store JWT token securely**

   - Store in httpOnly cookie (most secure) or localStorage (acceptable for development)
   - Never store in regular cookies accessible to JavaScript
   - Token expires after 7 days

4. **Use JWT token for all protected endpoints**

   - Include `Authorization: Bearer <JWT_TOKEN>` header in all requests
   - The backend handles GitHub token decryption automatically
   - You never need to manage the GitHub token directly

5. **Handle token expiration**
   - When receiving 401 Unauthorized, clear stored token
   - Redirect user back to login flow
   - Display message: "Your session has expired. Please log in again."

### New Feature: Report History and Persistence

The backend now automatically saves all analysis results. Frontend should implement:

**Dashboard view with report history:**

- Call `GET /reports/` on user login to show analysis history
- Display list of past analyses with timestamps
- Show "View Report" button for each historical report
- Limit: 3 most recent reports (older reports auto-deleted)

**Report detail view:**

- When user clicks a historical report, call `GET /reports/{report_id}`
- Load the saved report without re-running expensive analysis
- Add "Delete Report" button that calls `DELETE /reports/{report_id}`
- Add "Run New Analysis" button that calls `POST /analyze`

**New analysis flow:**

- Add prominent "Analyze My GitHub" button
- Show loading state: "Analyzing your GitHub profile... This may take 30-60 seconds"
- Call `POST /analyze` endpoint
- Display progress messages: "Fetching repositories...", "Analyzing code quality...", "Generating insights..."
- On completion, save report ID and redirect to report view
- Update report history list automatically

### Performance and UX

**Analysis timing:**

- `/analyze` endpoint is CPU/IO-heavy (30-60 seconds typical)
- Show progress indicator with estimated time
- Display status messages during analysis
- Consider adding "Cancel" functionality (not yet implemented in backend)
- Show `X-Process-Time` header value for actual processing time

**Rate limiting feedback:**

- When receiving 429 status, extract retry-after information
- Display message: "Rate limit exceeded. Please try again in X minutes."
- Show countdown timer until rate limit resets
- Consider caching results to reduce API calls

**Skill display:**

- `skill_constellation` is curated from `KNOWN_SKILLS` (60+ technologies)
- Show recognized skills with badges/chips
- Add manual skill input for technologies not auto-detected
- Consider skill categories: Languages, Frameworks, Tools, Cloud, DevOps

**AI-generated content:**

- For `suggested_projects` and `suggested_paths`, add "Regenerate" button
- Show confidence indicators if available
- Add "Save to favorites" functionality
- Allow users to mark suggestions as "completed" or "in progress"

**Code quality display:**

- Show flagship projects in prominent cards
- Display code quality summary in expandable panels
- Add syntax highlighting for code samples
- Include "View on GitHub" links to original repos

### Database and Persistence Notes for Frontend

**User session persistence:**

- User data persists across sessions (stored in PostgreSQL)
- GitHub tokens are encrypted and never exposed
- JWT tokens expire after 7 days but user data remains
- On token expiry, user just needs to re-authenticate (no data loss)

**Report management:**

- Users can have up to 3 saved reports
- Oldest reports are automatically deleted when limit exceeded
- Reports include full analysis data (can be MB in size)
- Consider pagination if expanding report limit in future

**Security considerations:**

- Never log or display GitHub tokens in UI
- Always use HTTPS in production
- Implement CSRF protection if using cookies
- Validate JWT token on every protected request

### CORS configuration

- Backend configured to accept requests from common dev ports by default
- For production, set `ALLOWED_ORIGINS` environment variable to your frontend domain(s)
- Example: `ALLOWED_ORIGINS="https://app.devpath.ai,https://www.devpath.ai"`
- Credentials enabled (supports cookies if needed)

## Error mapping (recommended user-facing messages)

### Authentication errors

- 401 Unauthorized — "Your session has expired. Please log in again."
  - Action: Clear stored JWT token and redirect to login
  - Common causes: Expired token, invalid token, missing Authorization header

### Client errors

- 400 Bad Request — "Invalid request format. Please check your input and try again."
  - Common causes: Malformed JSON, missing required fields
- 403 Forbidden — "You don't have permission to access this resource."
  - Common causes: Attempting to access another user's report
- 404 Not Found — Context-specific messages:
  - `/analyze` endpoint: "No GitHub repositories found. Make sure your GitHub account has public repositories or grant appropriate permissions."
  - `/reports/{id}` endpoint: "Report not found. It may have been deleted or doesn't exist."
  - `/market-match` endpoint: "Job title not recognized. Please select from the available job titles list."
- 422 Unprocessable Entity — "Invalid input. Please check your data and try again."
  - Common causes: Validation errors (skills list too long, invalid characters, etc.)
  - Display the specific validation error from response body

### Rate limiting

- 429 Too Many Requests — "You've made too many requests. Please wait X minutes before trying again."
  - Include countdown timer
  - Show different messages based on endpoint:
    - `/analyze`: "Analysis limit reached (5 per hour)"
    - `/generate-track`: "Career track generation limit reached (10 per hour)"
    - `/market-match`: "Market match limit reached (20 per hour)"

### Server errors

- 500 Internal Server Error — "Something went wrong on our end. Please try again later."
  - Common causes: Database connection failure, GitHub API error, Gemini API error
  - Action: Show retry button, log error details for debugging
- 503 Service Unavailable — "The service is temporarily unavailable. Please try again in a few moments."
  - Common causes: Database maintenance, service restart
  - Action: Show retry button with exponential backoff

## Observability & debugging notes for frontend devs

- The backend prints helpful logs when fetching from GitHub and when selecting source files. If you run locally, watch the uvicorn console for debug information that can help map UI states to backend progress.
- Every HTTP request is logged with format: `[HTTP] METHOD /path -> STATUS (TIME)` — useful for tracking slow endpoints.
- The `X-Process-Time` header on every response shows server-side processing time in seconds (e.g., `"1.234"`).

## Production-Ready Features

### Completed Production Features

- ✅ **CORS middleware** with configurable origins via `ALLOWED_ORIGINS` env var
- ✅ **HTTP timing middleware** with `X-Process-Time` header for performance monitoring
- ✅ **Security headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS
- ✅ **GitHub OAuth callback** endpoint for token exchange
- ✅ **Rate limiting** on expensive endpoints:
  - `/full-analysis`: 5 requests/hour per IP
  - `/generate-track`: 10 requests/hour per IP
  - `/market-match`: 20 requests/hour per IP
- ✅ **Health check endpoints**: `/health` (liveness) and `/health/ready` (readiness)
- ✅ **Structured logging** with Python logging module (replaces all print statements)
- ✅ **Global exception handler** with sanitized error messages for production
- ✅ **Input validation** with length limits to prevent abuse
- ✅ **Production Docker setup** with multi-stage build, non-root user, and health checks
- ✅ **Gunicorn + Uvicorn workers** for production performance

### Recommended Future Improvements

- Add a lightweight `POST /token-check` endpoint that validates GitHub token and returns scopes
- Convert `/full-analysis` to asynchronous job pattern (Redis + RQ/Celery) with job ID and polling
- Add streaming or WebSocket endpoint for incremental `RepoReport` updates during analysis
- Implement response caching for repeated requests (Redis-based)
- Add Prometheus metrics endpoint for monitoring integration

## Production Deployment Notes

### Environment Configuration

Production deployments should set:

```env
# Required
GEMINI_API_KEY=<your-key>
GITHUB_CLIENT_ID=<your-id>
GITHUB_CLIENT_SECRET=<your-secret>

# Production settings
ALLOWED_ORIGINS=https://your-production-frontend.com
LOG_LEVEL=INFO
MAX_WORKERS=4
```

### Rate Limiting

Rate limits are enforced per IP address. Clients exceeding limits will receive:

```json
{
  "detail": "Rate limit exceeded: 5 per 1 hour"
}
```

HTTP Status: `429 Too Many Requests`

### Security Considerations

1. All secrets must be stored in secure secret managers (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault)
2. The `ALLOWED_ORIGINS` environment variable should be set to your exact production frontend URL(s)
3. Always use HTTPS in production
4. Health check endpoints (`/health`, `/health/ready`) are public and do not require authentication
5. OAuth callback endpoint validates responses from GitHub before returning tokens

### Monitoring

The backend exposes several monitoring points:

- `X-Process-Time` header on all responses (seconds)
- Structured logs in JSON format for aggregation
- Health check endpoints for load balancer integration
- HTTP access logs via Gunicorn

Recommended monitoring setup:

- Set up alerts for error rates > 5%
- Monitor `/full-analysis` response times (expected: 30-60s)
- Track rate limit violations
- Monitor health check failures

### Docker Deployment

Docker support has been removed in v3.0.0. For containerized deployments, create your own Dockerfile based on the application structure.

## Database Schema and Architecture (NEW in v3.0.0)

### Database Tables

**users table:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  github_id INTEGER UNIQUE NOT NULL,
  email VARCHAR,
  encrypted_github_token VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_users_email ON users(email);
```

**reports table:**

```sql
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_data JSON NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_created_at ON reports(created_at);
```

### Security Implementation

**Token encryption:**

- GitHub OAuth tokens are encrypted using Fernet symmetric encryption
- Encryption key derived from SECRET_KEY environment variable using SHA-256
- Encrypted tokens stored in database, never exposed to frontend
- Decryption occurs server-side only when needed for GitHub API calls

**JWT tokens:**

- Application uses its own JWT tokens for authentication
- JWT signed with HS256 algorithm using SECRET_KEY
- Token payload contains user ID (sub field)
- Token expires after 7 days (configurable)
- Token verified on every protected endpoint request

**Password-less authentication:**

- No passwords stored (OAuth-only authentication)
- User identity verified via GitHub
- GitHub tokens encrypted at rest
- Zero-knowledge architecture: backend never sees plaintext GitHub tokens after initial OAuth

### Database Migrations

The application uses Alembic for database migrations. To initialize the database:

```bash
# Install alembic if not already installed
pip install alembic

# Initialize alembic (first time only)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head
```

For development with SQLite, the database file will be created automatically on first run.

### Data Retention Policy

**User data:**

- User records persist indefinitely
- Users can request account deletion (not yet implemented in API)
- Deleting a user cascades to delete all associated reports

**Report data:**

- Maximum 3 reports per user
- Older reports automatically deleted when limit exceeded
- Reports contain full analysis data (JSON format, can be 1-5 MB per report)
- No automatic expiration of reports

**Recommended future enhancements:**

- Add user account deletion endpoint
- Implement report expiration (e.g., delete reports older than 90 days)
- Add data export functionality (GDPR compliance)
- Implement soft deletes with audit trail

### Backup and Recovery

**Database backup recommendations:**

- PostgreSQL: Use pg_dump for regular backups
- Implement point-in-time recovery (PITR)
- Store backups in separate geographic location
- Test restoration procedures regularly

**Disaster recovery:**

- User records can be recreated via OAuth (GitHub is source of truth)
- Reports cannot be recreated (contain AI-generated analysis)
- Critical data: encrypted GitHub tokens (enable re-analysis without re-auth)

### Performance Considerations

**Database queries:**

- User lookup by github_id: O(1) with index
- Report history query: O(log n) with created_at index
- Report by ID: O(1) with primary key

**Optimization strategies:**

- Connection pooling configured in SQLAlchemy
- Async database operations (no blocking)
- JSON storage for flexible report schema
- Consider PostgreSQL JSONB for better query performance on report_data

**Scaling recommendations:**

- Use read replicas for report history queries
- Implement caching layer (Redis) for frequently accessed reports
- Consider sharding by user_id for horizontal scaling
- Monitor slow queries and add indexes as needed

## API Versioning Strategy

Current version: v3.0.0

**Breaking changes from v2.x.x:**

- `/full-analysis` renamed to `/analyze`
- All main endpoints now require JWT authentication
- Authentication flow completely changed (GitHub token no longer passed directly)
- New `/reports/` endpoints for report history management

**Deprecation policy:**

- Major version changes may include breaking changes
- Minor version changes are backward compatible
- Patch version changes are bug fixes only

**Future API versions:**

- Consider `/v3/analyze` style versioning for coexistence
- Maintain old endpoints for 6 months after deprecation announcement
- Provide migration guides for breaking changes

## Complete Frontend Implementation Guide

### Required Frontend Features for v3.0.0

#### 1. Authentication Pages

**Login Page:**

- Display "Sign in with GitHub" button
- Redirect to: `https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=repo,user&redirect_uri=YOUR_CALLBACK_URL`
- Handle loading state during redirect

**OAuth Callback Page:**

- Extract `code` parameter from URL query string
- Call `GET /auth/github/callback?code=<code>`
- Store returned JWT token securely
- Redirect to dashboard on success
- Handle errors (display message, retry option)

**Token Management:**

- Implement token storage (localStorage or httpOnly cookie)
- Add token refresh logic (redirect to login on 401)
- Clear token on logout
- Validate token presence before rendering protected routes

#### 2. Dashboard / Home Page

**Layout:**

- Navigation bar with user profile (fetch from stored JWT)
- "Run New Analysis" prominent button
- Report history section
- Quick actions: Career Track, Market Match

**Report History Widget:**

- Call `GET /reports/` on page load
- Display list of up to 3 saved reports
- Show: report date, "View" button, "Delete" button
- Empty state: "No analysis reports yet. Run your first analysis!"
- Loading state: skeleton cards
- Error state: retry button

**New Analysis Button:**

- Large, prominent CTA
- Show rate limit warning if near limit
- Redirect to analysis page on click

#### 3. Analysis Page (POST /analyze)

**Pre-analysis State:**

- Show explanation: "We'll analyze your GitHub profile..."
- Display what will be analyzed: repos, commits, code quality
- Estimated time: 30-60 seconds
- "Start Analysis" button

**During Analysis:**

- Progress indicator (animated spinner or progress bar)
- Status messages (simulated):
  - "Connecting to GitHub..." (0-5s)
  - "Fetching your repositories..." (5-15s)
  - "Analyzing code quality..." (15-35s)
  - "Generating career insights..." (35-50s)
  - "Finalizing report..." (50-60s)
- "This may take up to 60 seconds" message
- Cancel button (optional, not yet supported by backend)

**Post-analysis:**

- Redirect to Report View page
- Update report history list
- Show success message

**Error Handling:**

- 401: Redirect to login
- 404: "No repositories found" with GitHub link
- 429: Show rate limit message with countdown
- 500: "Analysis failed" with retry button

#### 4. Report View Page (GET /reports/{id})

**Report Sections to Display:**

1. **Overview Card:**

   - Developer archetype (e.g., "Builder", "Refiner", "Maintainer")
   - Total skills count
   - Total repositories analyzed
   - Report generation date

2. **Skills Constellation:**

   - Display as tag cloud or skill badges
   - Group by category (Languages, Frameworks, Tools)
   - Make skills clickable for filtering
   - Add manual skill entry option

3. **Project Hubs:**

   - Grid or list of all analyzed repositories
   - Each card shows: name, skills, AI summary
   - Link to GitHub repo
   - Filter/search functionality

4. **Flagship Projects:**

   - Highlighted section for top 1-3 projects
   - Larger cards with more details
   - Display code quality summary
   - Expandable code sample viewer

5. **Code Quality Summary:**

   - Display AI-generated quality assessment
   - Syntax-highlighted code samples
   - Strengths and improvement areas
   - Best practices score (if available)

6. **Suggested Career Paths:**

   - List of 3 career path suggestions
   - Each shows: path name, description, skills to develop
   - "Start this path" action button
   - "Regenerate suggestions" button (calls /analyze again)

7. **Suggested Projects:**
   - Grid of 3 project ideas
   - Each shows: title, description, features, tech stack
   - "Save project" functionality
   - "Regenerate projects" button

**Report Actions:**

- "Delete Report" button (confirmation dialog)
- "Share Report" button (future feature)
- "Export PDF" button (future feature)
- "Run New Analysis" button

#### 5. Career Track Generator (POST /generate-track)

**Input Form:**

- Multi-select for current skills (autocomplete from KNOWN_SKILLS)
- Text input for target domain
- Examples shown: "Machine Learning", "Frontend Development", "DevOps"
- "Generate Career Track" button

**Output Display:**

- Learning Step: title and description in card
- Bridge Project: full project details (title, description, features, stack)
- Capstone Project: full project details
- Timeline visualization (optional)
- "Save Track" functionality
- "Download as PDF" button (future feature)

**Rate Limiting:**

- Show remaining requests (if tracked)
- Disable button when limit reached
- Display countdown to reset

#### 6. Market Match Analyzer (POST /market-match)

**Input Form:**

- Multi-select for user skills
- Dropdown for job title (20 available titles)
- "Analyze Match" button

**Job Title Dropdown Options:**

```
- Data Engineer
- ML Engineer
- Senior React Developer
- Senior Python Backend Developer
- DevOps Engineer
- Generative AI Specialist
- Cloud Solutions Architect
- Security Engineer
- Mobile App Developer
- AI Product Engineer
- Data Scientist
- Full Stack Engineer
- Site Reliability Engineer (SRE)
- AI Infrastructure Engineer
- Data Platform Engineer
- Blockchain Developer
- Computer Vision Engineer
- AI Prompt Engineer
- Automation Engineer
- Embedded Systems Engineer
```

**Output Display:**

- Match score (calculate from matching/missing ratio)
- Matching skills: green badges
- Missing skills: red badges with "Learn" links
- Summary paragraph: prominent display
- "Save Analysis" functionality
- "Generate Learning Plan" button (future feature)

#### 7. User Profile Page

**User Information:**

- GitHub username and avatar (from GitHub API)
- Email (if provided)
- Member since date
- Total analyses run

**Settings:**

- Logout button
- Delete account button (future feature)
- Export data button (future feature)
- Privacy settings (future feature)

### Recommended UI/UX Patterns

**Loading States:**

- Use skeleton screens for content loading
- Show progress bars for long operations
- Display status messages during analysis
- Implement optimistic UI updates

**Error Handling:**

- Toast notifications for errors
- Inline validation messages
- Retry buttons for failed requests
- Fallback UI for missing data

**Responsive Design:**

- Mobile-first approach
- Collapsible sections on small screens
- Touch-friendly buttons and cards
- Optimized image loading

**Accessibility:**

- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode support
- Focus indicators on interactive elements

**Performance Optimization:**

- Lazy load report sections
- Implement virtual scrolling for large lists
- Cache API responses
- Debounce search and filter inputs

### State Management Recommendations

**Global State:**

- User authentication status
- JWT token
- Current user profile
- Report history list

**Local State:**

- Form inputs
- Loading states
- Error messages
- UI preferences

**Caching Strategy:**

- Cache report data for 5 minutes
- Cache report history for 1 minute
- Invalidate cache on new analysis
- Use React Query or SWR for automatic caching

### Testing Recommendations

**Unit Tests:**

- Test authentication utilities
- Test API wrapper functions
- Test form validation
- Test error handling

**Integration Tests:**

- Test OAuth flow end-to-end
- Test report generation and display
- Test report history management
- Test rate limiting behavior

**E2E Tests:**

- Complete user journey: login → analyze → view report
- Error scenarios: expired token, rate limit
- Cross-browser compatibility
- Mobile responsiveness

---

## Summary of v3.0.0 Changes

### What's New:

- Complete stateful authentication system with JWT tokens
- Database persistence for users and analysis reports
- Report history management (view, list, delete)
- Automatic report storage on analysis
- GitHub token encryption and secure storage
- Protected endpoints with authentication
- Token-based session management
- Input validation with detailed error messages

### Breaking Changes:

- `/full-analysis` endpoint renamed to `/analyze`
- All main endpoints now require authentication
- GitHub token no longer passed directly in headers
- OAuth flow returns JWT token instead of GitHub token
- New required environment variables: DATABASE_URL, SECRET_KEY

### Migration Guide for Existing Frontend:

1. Update endpoint URLs: `/full-analysis` → `/analyze`
2. Implement OAuth callback handler
3. Store and manage JWT tokens
4. Update all API calls to include JWT Authorization header
5. Remove GitHub token management from frontend
6. Implement report history features
7. Update error handling for new 401 responses
8. Add token refresh logic

### Dependencies Required:

- PostgreSQL database or SQLite for development
- Python packages: asyncpg (for PostgreSQL) or aiosqlite (for SQLite)
- Environment configuration with DATABASE_URL and SECRET_KEY
