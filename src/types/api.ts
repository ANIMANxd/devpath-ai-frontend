// API Types - Based on DevPath AI Backend v2.4.0

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

export interface MarketMatchRequest {
  user_skills: string[];
  job_title: string;
}

export interface GapAnalysis {
  matching_skills: string[];
  missing_skills: string[];
  summary_paragraph: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
}
