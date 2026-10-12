import { z } from "zod";

const text = z.string().trim().min(1).max(2000);
export const allergenSchema = z.enum([
  "milk",
  "eggs",
  "wheat",
  "nuts",
  "peanuts",
  "soy",
  "fish",
  "shellfish",
  "sesame",
  "mustard",
  "celery",
  "sulfites",
  "lupin",
]);
const base = {
  title: text.max(160),
  summary: text,
  language: z.string().trim().min(2).max(16),
  tags: z.array(text.max(60)).max(30),
  factsVerified: z.boolean(),
  source: z.object({
    url: z
      .url()
      .refine(
        (url) => new URL(url).protocol === "https:",
        "HTTPS izvor je obavezan",
      ),
    label: text.max(200),
    checkedAt: z.iso.date(),
    rightsNote: text,
  }),
  image: z.object({
    path: z
      .string()
      .regex(
        /^\/media\/[a-zA-Z0-9_-]+\.(?:avif|webp|png|jpe?g|svg)$/,
        "Koristi /media/naziv.webp ili drugi statički asset",
      ),
    alt: text.max(300),
    rightsConfirmed: z.boolean(),
    generated: z.boolean(),
  }),
};
export const contentSchema = z.discriminatedUnion("category", [
  z.object({
    ...base,
    category: z.literal("EAT"),
    servings: z.number().int().min(1).max(100),
    totalMinutes: z.number().int().min(1).max(1440),
    ingredients: z
      .array(
        z.object({
          name: text.max(160),
          quantity: z.number().positive(),
          unit: text.max(40),
        }),
      )
      .min(1)
      .max(100),
    steps: z.array(text).min(1).max(60),
    allergens: z.array(allergenSchema).max(13),
    allergensVerified: z.boolean(),
    dietaryTags: z.array(text.max(60)).max(20),
  }),
  z.object({
    ...base,
    category: z.literal("BOOK"),
    authors: z.array(text.max(160)).min(1).max(20),
    genres: z.array(text.max(60)).min(1).max(20),
    recommendationReason: text,
    isbn: z
      .string()
      .regex(/^(?:\d{13}|\d{9}[\dX])$/)
      .optional(),
    pageCount: z.number().int().positive().optional(),
  }),
]);
export type ContentInput = z.infer<typeof contentSchema>;
export type Category = ContentInput["category"];
export type ContentStatus = "draft" | "review" | "published";
export type ContentRecord = ContentInput & {
  id: string;
  status: ContentStatus;
  version: number;
  updatedAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
};
export function publicationIssues(item: ContentInput): string[] {
  const issues: string[] = [];
  const parsed = contentSchema.safeParse(item);
  if (!parsed.success)
    return parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
  if (!item.factsVerified)
    issues.push("Činjenice i izvor moraju biti provjereni.");
  if (!item.image.rightsConfirmed) issues.push("Potvrdi prava za sliku.");
  if (item.category === "EAT" && !item.allergensVerified)
    issues.push("Sastojci i alergeni moraju biti provjereni.");
  return issues;
}
export const spinContextSchema = z.object({
  category: z.enum(["EAT", "BOOK"]),
  language: z.string().trim().min(2).max(16).optional(),
  excludedAllergens: z.array(allergenSchema).max(13).default([]),
  requiredDietaryTags: z.array(text.max(60)).max(20).default([]),
  maxMinutes: z.number().int().positive().max(1440).optional(),
  excludeIds: z.array(z.string().max(100)).max(200).default([]),
});
export type SpinContext = z.input<typeof spinContextSchema>;
