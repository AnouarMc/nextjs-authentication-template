import { ZodError } from "zod";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatZodErrors = (error: ZodError) => {
  return error.issues.map((issue) => ({
    name: issue.path[0].toString(),
    message: issue.message,
  }));
};
