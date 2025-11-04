// API Client for DevPath AI Backend

import {
  FullReport,
  CareerTrack,
  CareerTrackRequest,
  GapAnalysis,
  MarketMatchRequest,
  ApiError,
} from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

class ApiClient {
  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
        ...options,
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `API Error ${res.status}: ${res.statusText}`;

        try {
          const errorJson = JSON.parse(errorText) as ApiError;
          errorMessage = errorJson.detail || errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
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
   * @param githubToken - GitHub OAuth token (Bearer token)
   */
  async fullAnalysis(githubToken: string): Promise<FullReport> {
    return this.fetch("/full-analysis", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
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
}

export const apiClient = new ApiClient();
