import {
  demoCatalog,
  selectRecommendation,
  type ContentRecord,
  type SpinContext,
} from "@random/shared";
export const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
export async function spin(
  context: SpinContext,
): Promise<{ item: ContentRecord | null; reason: string }> {
  if (!apiUrl)
    return {
      item: selectRecommendation(demoCatalog, context),
      reason: "Lokalni demo — nije povezano s bazom.",
    };
  const response = await fetch(`${apiUrl}/spin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(context),
    signal: AbortSignal.timeout(12000),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error ?? "Preporuka trenutno nije dostupna.");
  return result;
}
