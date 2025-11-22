import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TAILWIND_BG_COLORS } from "./constants";
import type { OperationType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getColor = (num: number) => {
  const index = Math.abs(num) % TAILWIND_BG_COLORS.length;
  return TAILWIND_BG_COLORS[index];
};

export const formatTimeAgo = (utcTime: Date) => {
  const utcDate = new Date(utcTime);
  const now = Date.now();

  const diffMs = now - utcDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h`;

  return utcDate.toLocaleString("en-US", { month: "short", day: "numeric" });
};

export const getOperationText = (op: OperationType) => {
  switch (op) {
    case "ADD":
      return "Added";
    case "SUB":
      return "Subtracted";
    case "MUL":
      return "Mutliplied by";
    case "DIV":
      return "Divided by";
  }
};
