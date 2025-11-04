# DevPath AI — API Documentation (Updated)

This file documents the current backend implementation (v2.4.0). It lists endpoints, request/response shapes, authentication, concurrency/limits, AI behaviors, GitHub interactions, TypeScript interfaces, sample requests, and frontend guidance. Use it as the single source of truth for building the frontend.

Repository base: `c:/Users/bhide/Dev/devpath-ai/devpath-ai-backend`

## How to run locally

- Start the FastAPI server (PowerShell):

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Default base URL: `http://localhost:8000`

## Environment / secrets

- The backend uses the Gemini (Generative AI) client and reads the API key from the environment variable `GEMINI_API_KEY` via a `.env` file. File: `app/config.py` (Pydantic Settings).

Example `.env`:

```
GEMINI_API_KEY=sk-xxxxx
```

Security note: protect the Gemini key on the server; do not expose it to the frontend.

## Authentication

- Endpoints that interact with GitHub require an OAuth token passed via the `Authorization` header in the format:

  Authorization: Bearer <GITHUB_OAUTH_TOKEN>

- This token is forwarded to GitHub. For access to private repos or commit history, request appropriate scopes (e.g., `repo`). Public repo access may work with fewer scopes.

## Global runtime behavior and limits

- REPO_PROCESSING_LIMIT = 30 — endpoints that scan repos will only process the top 30 repositories returned by GitHub to avoid runaway work.
- COMMIT_FETCH_LIMIT = 100 — how many commits to fetch per repo when analyzing commit history.
- Gemini concurrency: the backend uses an asyncio.Semaphore (size 10) around costly Gemini calls to avoid overloading the AI API.
- GitHub tree calls may return truncated trees; the code has a fallback to try `main` then `master` branches.

## New / Updated Endpoints (detailed)

1) GET /

- Purpose: health/welcome message.
- Auth: none.
- Response: 200

Example:

```json
{ "message": "Welcome to DevPath AI v2. The oracle is ready." }
```

2) POST /full-analysis

- Purpose: Full, comprehensive analysis of a user's GitHub presence.
- Auth: Required. Header: `Authorization: Bearer <GITHUB_TOKEN>`.
- Response model: `FullReport` (defined in `app/schemas.py`). This replaces the previous `analyze-profile` endpoint and expands the output to include flagship projects, AI code-quality analysis, and suggested career paths & projects.

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

- 200 OK — returns `FullReport` JSON.
- 400 Bad Request — invalid Authorization header.
- 404 Not Found — no repos returned from GitHub (invalid/expired token or no repos).
- 500 Internal — any unexpected server error (frontend should show a retry option).

Notes on long-running work:

- `/full-analysis` can be CPU/IO-heavy and may take many seconds (or minutes) depending on the number of repos and Gemini latency. The frontend should present a progress indicator and allow retries. Consider using a server-side job queue + polling for large-scale production.

3) POST /generate-track

- Purpose: Produce a structured, multi-step career track (learning_step, bridge_project, capstone_project) tailored to the user's current skills and a target domain.
- Auth: None required.
- Request body (CareerTrackRequest):

```json
{
  "current_skills": ["fastapi", "postgres"],
  "target_domain": "frontend development with React"
}
```

- Response: `CareerTrack` object with `target_domain`, `learning_step`, `bridge_project`, and `capstone_project`.

4) POST /market-match

- Purpose: Compare a user's skills against an ideal job profile and produce a Gap Analysis.
- Auth: None required by the code. (The endpoint expects a `job_title` that maps to an `IDEAL_JOB_PROFILES` constant on the server.)
- Request body (MarketMatchRequest):

```json
{
  "user_skills": ["fastapi","pydantic","docker"],
  "job_title": "backend-engineer"
}
```

- Response: `GapAnalysis` object with `matching_skills`, `missing_skills`, and `summary_paragraph`.

Notes: the endpoint will return 404 if the supplied `job_title` is not present in the server's `IDEAL_JOB_PROFILES` mapping.

---

## Models / Schemas (current)

Source of truth: `app/schemas.py`.

Key models and fields (TypeScript equivalents shown below):

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

- CareerTrack / CareerTrackRequest
  - CareerTrackRequest: { current_skills: string[], target_domain: string }
  - CareerTrack: { target_domain, learning_step, bridge_project, capstone_project }

- MarketMatchRequest / GapAnalysis
  - MarketMatchRequest: { user_skills: string[], job_title: string }
  - GapAnalysis: { matching_skills: string[], missing_skills: string[], summary_paragraph: string }

## TypeScript interfaces (copy/paste)

```ts
export interface RepoReport { name: string; skills: string[]; ai_summary: string; }

export interface GeneratedProject { title: string; description: string; features: string[]; suggested_stack: string[] }

export interface SuggestedPath { path_name: string; description: string; skills_to_develop: string[] }

export interface FullReport {
  skill_constellation: string[];
  developer_archetype: string;
  project_hubs: RepoReport[];
  flagship_projects: RepoReport[];
  ai_code_quality_summary: string;
  suggested_paths: SuggestedPath[];
  suggested_projects: GeneratedProject[];
}

export interface CareerTrackRequest { current_skills: string[]; target_domain: string }
export interface CareerTrack { target_domain: string; learning_step: { title: string; description: string }; bridge_project: GeneratedProject; capstone_project: GeneratedProject }

export interface MarketMatchRequest { user_skills: string[]; job_title: string }
export interface GapAnalysis { matching_skills: string[]; missing_skills: string[]; summary_paragraph: string }
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

1) Full analysis (POST /full-analysis)

```bash
curl -X POST "{{API_BASE}}/full-analysis" \
  -H "Authorization: Bearer <GITHUB_TOKEN>" \
  -H "Accept: application/json"
```

2) Generate career track (POST /generate-track)

```bash
curl -X POST "{{API_BASE}}/generate-track" \
  -H "Content-Type: application/json" \
  -d '{"current_skills":["fastapi","postgres"],"target_domain":"frontend with React"}'
```

3) Market match (POST /market-match)

```bash
curl -X POST "{{API_BASE}}/market-match" \
  -H "Content-Type: application/json" \
  -d '{"user_skills":["fastapi","docker"], "job_title":"backend-engineer"}'
```

4) JS/TypeScript helper (updated)

```ts
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers ? options.headers as any : {})
    },
    ...options
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

// Example: full analysis
// apiFetch<FullReport>('/full-analysis', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });

// Example: generate career track
// apiFetch<CareerTrack>('/generate-track', { method: 'POST', body: JSON.stringify({ current_skills, target_domain }) });

// Example: market match
// apiFetch<GapAnalysis>('/market-match', { method: 'POST', body: JSON.stringify({ user_skills, job_title }) });
```

## Frontend integration notes & UX suggestions

- Full analysis is heavy: present an explicit progress state and warn users that analysis may take tens of seconds. Prefer an async job/polling UX for production.
- Provide a token validation step (client-side) before running full analysis — the backend currently returns 404 when no repos are found; consider adding a lightweight `/token-check` endpoint (suggested change).
- The `skill_constellation` is a curated, lowercased list coming from `KNOWN_SKILLS`. Offer a manual skill-add feature in the UI for skills not recognized.
- For `suggested_projects` and `suggested_paths`, show the AI outputs with a small "Regenerate" button that calls the same endpoints again.
- Show code-quality summaries for flagship projects in a read-only code modal with the sample and analysis.

## Error mapping (recommended user-facing messages)

- 400 — "Invalid request or header format. Ensure Authorization is 'Bearer <token>'."
- 404 (full-analysis) — "No repositories found for this token. Verify your GitHub token and scopes."
- 404 (market-match) — "Job title not recognized. Try another job title or update server mapping."
- 500 — "Server error during analysis. Try again later."

## Observability & debugging notes for frontend devs

- The backend prints helpful logs when fetching from GitHub and when selecting source files. If you run locally, watch the uvicorn console for debug information that can help map UI states to backend progress.

## Recommended small backend improvements (low-risk)

- Add a lightweight `POST /token-check` that validates a GitHub token quickly via `/user` or `/user/repos?per_page=1` and returns scopes / validity. This improves UX before starting `full-analysis`.
- Add CORS configuration (FastAPI CORSMiddleware) with dev and prod origins defined so the frontend can call the API directly from the browser.
- Consider converting `full-analysis` to an asynchronous job (Redis + RQ or Celery) that returns a job id with a smaller `POST` response and a `GET /job/{id}` for progress/result — this avoids timeouts and improves UX.
- Add optional streaming or WebSocket endpoint to push incremental `RepoReport` updates to the frontend as repos are processed.

---

If you'd like, I can now implement one of these follow-ups directly in the repo:

- Add a typed `api.ts` client file under a new `frontend/` or `web/` folder with helpers and interfaces.
- Add a simple `POST /token-check` endpoint and enable CORS in `app/main.py` so the frontend can validate GitHub tokens.
- Convert `full-analysis` to a background job pattern (outline + simple in-memory queue proof-of-concept).

Tell me which follow-up you want and I'll implement it next.
