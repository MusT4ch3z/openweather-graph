import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  // Generate a dark color by limiting the first character to 0-7
  for (let i = 0; i < 6; i++) {
    if (i === 0) {
      color += letters[Math.floor(Math.random() * 7)];
    } else {
      color += letters[Math.floor(Math.random() * 16)];
    }
  }
  return color;
};
