export const defaultLocale = "en";
export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale);
}
