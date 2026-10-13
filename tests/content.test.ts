import { describe, it, expect } from "vitest";
import {
  contentSchema,
  publicationIssues,
  selectRecommendation,
  demoItems,
  createChatGPTPrompt,
} from "@random/shared";

describe("approved content contract", () => {
  it("rejects empty recipe ingredients and invented book facts", () => {
    expect(
      contentSchema.safeParse({ ...demoItems[0], ingredients: [] }).success,
    ).toBe(false);
    expect(
      contentSchema.safeParse({ ...demoItems[1], authors: [] }).success,
    ).toBe(false);
  });
  it("blocks publication with unknown allergens or missing fact verification", () => {
    expect(
      publicationIssues({ ...demoItems[0], factsVerified: false }),
    ).not.toHaveLength(0);
    const recipe = demoItems.find((i) => i.category === "EAT")!;
    expect(
      publicationIssues({ ...recipe, allergensVerified: false }),
    ).not.toHaveLength(0);
    expect(
      publicationIssues({ ...demoItems[1], factsVerified: false }),
    ).not.toHaveLength(0);
  });
  it("accepts valid reviewed source and media records", () => {
    for (const item of demoItems) expect(publicationIssues(item)).toEqual([]);
  });
  it("does not trust status fields from a JSON import", () => {
    const parsed = contentSchema.parse({
      ...demoItems[0],
      status: "published",
      approvedBy: "attacker",
    });
    expect(parsed).not.toHaveProperty("status");
    expect(parsed).not.toHaveProperty("approvedBy");
  });
});
describe("one safe recommendation", () => {
  const catalog = demoItems.map((item, i) => ({
    ...item,
    id: String(i),
    status: "published" as const,
  }));
  it("filters draft records, allergies and language before randomness", () => {
    expect(
      selectRecommendation(
        [{ ...catalog[0], status: "draft" }],
        { category: "EAT" },
        () => 0,
      ),
    ).toBeNull();
    expect(
      selectRecommendation(
        catalog,
        { category: "EAT", excludedAllergens: ["milk"] },
        () => 0,
      ),
    ).toBeNull();
    expect(
      selectRecommendation(
        catalog,
        { category: "BOOK", language: "de" },
        () => 0,
      ),
    ).toBeNull();
  });
  it("returns one record and terminates when all records have been rejected", () => {
    expect(
      selectRecommendation(catalog, { category: "BOOK" }, () => 0)?.id,
    ).toBe("1");
    expect(
      selectRecommendation(
        catalog,
        { category: "BOOK", excludeIds: ["1"] },
        () => 0,
      ),
    ).toBeNull();
  });
  it("never relaxes hard filters for an empty pool", () => {
    for (let i = 0; i < 100; i++)
      expect(
        selectRecommendation(catalog, { category: "EAT", maxMinutes: 1 }),
      ).toBeNull();
  });
});
it("manual prompt requires sources, unverified facts and human review without an API", () => {
  const prompt = createChatGPTPrompt(
    "BOOK",
    "The Little Prince / Antoine de Saint-Exupéry",
  );
  expect(prompt).toContain("factsVerified");
  expect(prompt).toContain("source");
  expect(prompt).toContain("ISBN");
  expect(prompt).toContain("BOOK");
});

describe('ZIP prompt and AI dietary proposals',()=>{
 it('requests one ZIP, category correction and unconfirmed dietary assessment',()=>{
 const prompt=createChatGPTPrompt('WATCH','recipe ingredients');
 expect(prompt).toContain('RANDOM-content.zip');expect(prompt).toContain('content.json');expect(prompt).toContain('samo prijedlog');expect(prompt).toContain('dietaryAssessment');expect(prompt).toContain('uncertain');expect(prompt).toContain('allergensVerified ostaje false');
 });
 it('blocks conflicting dietary claims and classification before publication',()=>{
 const recipe=structuredClone(demoItems.find(i=>i.category==='EAT')!);
 if(recipe.category!=='EAT')throw Error();
 recipe.dietaryTags=['gluten-free','lactose-free'];recipe.dietaryAssessment={gluten:'uncertain',lactose:'present',suggestedAllergens:['milk'],notes:{en:'Review labels',bs:'Provjeri deklaracije'}};
 recipe.classification={requestedCategory:'EAT',suggestedCategory:'WATCH',confidence:'low',reason:{en:'Needs review',bs:'Za pregled'}};
 expect(publicationIssues(recipe)).toEqual(expect.arrayContaining(['Gluten-free claim conflicts with the dietary assessment.','Lactose-free claim conflicts with the dietary assessment.','Category must match the proposed classification before publishing.']));
 });
});
