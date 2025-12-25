import dayjs from "dayjs";

type DateMode = "display" | "api";

/**
 * Format date (auto include time if available)
 * @param date Date object or parsable string
 * @param mode "display" (DD/MM/YYYY[ HH:mm:ss]) | "api" (YYYY-MM-DD[ HH:mm:ss])
 * @param fallback Return if null/invalid
 */
export const formatDate = (
  date?: string | Date | null,
  mode: DateMode = "display",
  fallback: string | null = "-"
): string | null => {
  if (!date) return fallback;

  const d = dayjs(date);
  if (!d.isValid()) return fallback;

  const hasTime =
    d.hour() !== 0 || d.minute() !== 0 || d.second() !== 0;

  if (mode === "api")
    return d.format(hasTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD");

  return d.format(hasTime ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY");
};
