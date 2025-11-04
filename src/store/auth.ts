import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  githubToken: string | null;
  setGithubToken: (token: string | null) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      githubToken: null,
      setGithubToken: (token) => set({ githubToken: token }),
      clearToken: () => set({ githubToken: null }),
    }),
    {
      name: "devpath-auth",
    }
  )
);
