import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSkillName(skill: string): string {
  return skill
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getArchetypeColor(archetype: string): string {
  const lower = archetype.toLowerCase();
  if (lower.includes("builder")) return "from-blue-500 to-cyan-500";
  if (lower.includes("refiner")) return "from-purple-500 to-pink-500";
  if (lower.includes("maintainer")) return "from-green-500 to-emerald-500";
  return "from-gray-500 to-slate-500";
}

export function getArchetypeIcon(archetype: string): string {
  const lower = archetype.toLowerCase();
  if (lower.includes("builder")) return "🏗️";
  if (lower.includes("refiner")) return "✨";
  if (lower.includes("maintainer")) return "🛡️";
  return "👨‍💻";
}
