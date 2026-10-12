import {
  type ContentInput,
  type ContentStatus,
  type SpinContext,
  publicationIssues,
  spinContextSchema,
} from "./content";
type Candidate = ContentInput & { id: string; status: ContentStatus };
export function selectRecommendation<T extends Candidate>(
  items: T[],
  context: SpinContext,
  random: () => number = Math.random,
): T | null {
  const parsed = spinContextSchema.parse(context);
  const eligible = items.filter((item) => {
    if (
      item.status !== "published" ||
      item.category !== parsed.category ||
      publicationIssues(item).length
    )
      return false;
    if (
      parsed.excludeIds.includes(item.id) ||
      (parsed.language && item.language !== parsed.language)
    )
      return false;
    if (item.category === "EAT") {
      if (parsed.excludedAllergens.some((a) => item.allergens.includes(a)))
        return false;
      if (parsed.requiredDietaryTags.some((t) => !item.dietaryTags.includes(t)))
        return false;
      if (parsed.maxMinutes && item.totalMinutes > parsed.maxMinutes)
        return false;
    }
    return true;
  });
  if (!eligible.length) return null;
  const sample = random();
  const index = Math.floor(
    Math.min(0.999999999, Math.max(0, Number.isFinite(sample) ? sample : 0)) *
      eligible.length,
  );
  return eligible[index];
}
