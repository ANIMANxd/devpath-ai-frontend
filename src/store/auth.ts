import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  jwtToken: string | null;
  githubUsername: string | null;
  setJwtToken: (token: string | null) => void;
  setGithubUsername: (username: string | null) => void;
  clearJwtToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      jwtToken: null,
      githubUsername: null,
      setJwtToken: (token) => set({ jwtToken: token }),
      setGithubUsername: (username) => set({ githubUsername: username }),
      clearJwtToken: () => set({ jwtToken: null, githubUsername: null }),
    }),
    {
      name: "devpath-auth",
    }
  )
);
