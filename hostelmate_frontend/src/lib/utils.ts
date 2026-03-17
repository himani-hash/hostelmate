import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getInitials(name: string): string {
 return name
 .split(" ")
 .map((word) => word[0])
 .join("")
 .toUpperCase()
 .slice(0, 2)
}

export function formatCurrency(value: number): string {
 return new Intl.NumberFormat("en-US", {
 style: "currency",
 currency: "USD",
 }).format(value)
}