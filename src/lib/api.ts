// API Client for DevPath AI Backend v3.0.0

import {
  FullReport,
  CareerTrack,
  CareerTrackRequest,
  GapAnalysis,
  MarketMatchRequest,
  ApiError,
  ReportHistoryItem,
} from "@/types/api";
import { useAuthStore } from "@/store/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

class ApiClient {
  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    try {
      // Read JWT token from auth store (persisted)
      const jwtToken = useAuthStore.getState().jwtToken;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options?.headers as Record<string, string>) || {}),
      };

      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }

      let res: Response;
      try {
        res = await fetch(`${API_BASE}${path}`, {
          credentials: "omit",
          headers,
          ...options,
        });
      } catch {
        // Network error - backend unreachable
        throw new Error(
          `Cannot connect to backend at ${API_BASE}. Please check your internet connection and backend configuration.`
        );
      }

      if (!res.ok) {
        // Handle 401 Unauthorized - token expired or invalid
        if (res.status === 401) {
          useAuthStore.getState().clearJwtToken();
          throw new Error("Your session has expired. Please log in again.");
        }

        // Handle 204 No Content responses
        if (res.status === 204) {
          return undefined as T;
        }

        // Check Content-Type to determine if response is JSON or HTML
        const contentType = res.headers.get("content-type");
        const isJson = contentType?.includes("application/json");

        let errorMessage = `API Error ${res.status}: ${res.statusText}`;

        if (isJson) {
          try {
            const errorJson = (await res.json()) as ApiError;
            errorMessage =
              errorJson.detail || errorJson.message || errorMessage;
          } catch {
            errorMessage = `Failed to parse error response`;
          }
        } else {
          // Response is likely HTML (nginx error page, 404, etc.)
          // Don't expose raw HTML to user
          if (res.status === 404) {
            errorMessage =
              "API endpoint not found. Please check your backend configuration.";
          } else if (res.status === 502 || res.status === 503) {
            errorMessage =
              "Backend service is unavailable. Please try again later.";
          } else if (res.status === 500) {
            errorMessage = "Internal server error. Please contact support.";
          } else {
            errorMessage = `Server error (${res.status}). Please try again later.`;
          }
        }

        throw new Error(errorMessage);
      }

      // Handle 204 No Content success responses
      if (res.status === 204) {
        return undefined as T;
      }

      return (await res.json()) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ message: string }> {
    return this.fetch("/");
  }

  /**
   * Full analysis - comprehensive GitHub profile analysis
   * (v3: uses application JWT stored in auth store)
   */
  async analyze(): Promise<FullReport> {
    return this.fetch("/analyze", {
      method: "POST",
    });
  }

  /**
   * Generate career track - personalized learning path
   * @param request - Current skills and target domain
   */
  async generateTrack(request: CareerTrackRequest): Promise<CareerTrack> {
    return this.fetch("/generate-track", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Market match - gap analysis against job profile
   * @param request - User skills and target job title
   */
  async marketMatch(request: MarketMatchRequest): Promise<GapAnalysis> {
    return this.fetch("/market-match", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Get report history - list of saved analysis reports
   * @returns Array of report history items (up to 3 most recent)
   */
  async getReportHistory(): Promise<ReportHistoryItem[]> {
    return this.fetch("/reports/", {
      method: "GET",
    });
  }

  /**
   * Get specific report - retrieve full analysis report by ID
   * @param reportId - ID of the report to retrieve
   * @returns Full report data
   */
  async getReport(reportId: number): Promise<FullReport> {
    return this.fetch(`/reports/${reportId}`, {
      method: "GET",
    });
  }

  /**
   * Delete report - remove a saved analysis report
   * @param reportId - ID of the report to delete
   */
  async deleteReport(reportId: number): Promise<void> {
    return this.fetch(`/reports/${reportId}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
