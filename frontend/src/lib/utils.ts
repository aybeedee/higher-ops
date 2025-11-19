import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TAILWIND_BG_COLORS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getColor(num: number) {
  const index = Math.abs(num) % TAILWIND_BG_COLORS.length;
  return TAILWIND_BG_COLORS[index];
}
