import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = function (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

export const slugify = function (title: string): string {
  return title
    .toString()
    .toLowerCase()
    .normalize("NFD") // Normalize to decomposed form for handling accents
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim() // Trim leading and trailing spaces/hyphens
    .replace(/^-+|-+$/g, "");
};
