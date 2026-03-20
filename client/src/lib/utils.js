import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formateMessageTime(date) {
    return new Date (date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
}