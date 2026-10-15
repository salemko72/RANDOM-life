import { type ContentInput, type ContentRecord } from "./content";
// Local development fixtures, not editorial approvals or the 50+50 release catalog.
export const demoItems: ContentInput[] = [
  {
    category: "EAT",
    title: "Tjestenina s paradajzom",
    summary:
      "Malo sastojaka, topli tanjir i mirno veče. Jednostavan recept za lokalni razvoj.",
    language: "bs",
    tags: ["brzo", "večera"],
    factsVerified: true,
    source: {
      url: "https://example.com/random-demo-recipe",
      label: "Lokalni razvojni primjer — nije izvor za javnu objavu",
      checkedAt: "2026-10-12",
      rightsNote:
        "Demonstracijski sadržaj, potreban stvarni urednički pregled prije testa.",
    },
    image: {
      path: "/media/demo-eat.png",
      alt: "Originalna vektorska ilustracija tanjira tjestenine",
      rightsConfirmed: true,
      generated: false,
    },
    servings: 2,
    totalMinutes: 25,
    ingredients: [
      { name: "Tjestenina", quantity: 200, unit: "g" },
      { name: "Paradajz", quantity: 300, unit: "g" },
      { name: "Maslinovo ulje", quantity: 1, unit: "kašika" },
      { name: "Parmezan", quantity: 20, unit: "g" },
    ],
    steps: [
      "Skuhaj tjesteninu prema uputama na pakovanju.",
      "Na ulju kuhaj nasjeckani paradajz 10 minuta.",
      "Pomiješaj s tjesteninom i dodaj parmezan.",
    ],
    allergens: ["wheat", "milk"],
    allergensVerified: true,
    dietaryTags: ["vegetarian"],
  },
  {
    category: "BOOK",
    title: "Mali princ",
    summary:
      "Kratka priča koja otvara velika pitanja o prijateljstvu, pažnji i stvarima koje su nam važne.",
    language: "bs",
    tags: ["prijateljstvo", "kratko"],
    factsVerified: true,
    source: {
      url: "https://www.britannica.com/topic/The-Little-Prince",
      label: "Razvojni bibliografski primjer — provjeriti odabrano izdanje",
      checkedAt: "2026-10-12",
      rightsNote:
        "Originalni demo opis i ilustracija; bez preuzete naslovnice.",
    },
    image: {
      path: "/media/demo-book.png",
      alt: "Originalna ilustracija otvorene knjige i zvijezda",
      rightsConfirmed: true,
      generated: false,
    },
    authors: ["Antoine de Saint-Exupéry"],
    genres: ["novela", "fantazija"],
    recommendationReason:
      "Za trenutak kada želiš kratko čitanje i drugačiji pogled na svakodnevicu.",
  },
];
// Explicit bilingual test fixtures; production translations still require human review.
for(const item of demoItems){
 const bs={title:item.title,summary:item.summary,imageAlt:item.image.alt,sourceLabel:item.source.label,rightsNote:item.source.rightsNote,reviewed:true,...(item.category==='EAT'?{steps:item.steps,ingredientNames:item.ingredients.map(i=>i.name),ingredientUnits:item.ingredients.map(i=>i.unit)}:item.category==='BOOK'?{genres:item.genres,recommendationReason:item.recommendationReason,authors:item.authors}:{})};
 const en=item.category==='EAT'?{title:'Pasta with tomatoes',summary:'A few ingredients, a warm plate and a quiet evening. A simple local development recipe.',imageAlt:'Original vector illustration of a plate of pasta',sourceLabel:'Local development example — not a source for public release',rightsNote:'Demonstration content; real editorial review is required before testing.',reviewed:true,steps:['Cook the pasta according to the package instructions.','Cook chopped tomatoes in oil for 10 minutes.','Combine with the pasta and add Parmesan.'],ingredientNames:['Pasta','Tomato','Olive oil','Parmesan'],ingredientUnits:['g','g','tbsp','g']}:{title:'The Little Prince',summary:'A short story that opens big questions about friendship, care and the things that matter to us.',imageAlt:'Original illustration of an open book and stars',sourceLabel:'Development bibliographic example — verify the chosen edition',rightsNote:'Original demo description and illustration; no copied book cover.',reviewed:true,genres:['Novella','Fantasy'],recommendationReason:'For a moment when you want a short read and a different perspective on everyday life.',authors:['Antoine de Saint-Exupéry']};
 item.translations={en,bs};
}
export const demoCatalog: ContentRecord[] = demoItems.map((item, i) => ({
  ...item,
  id: `demo-${i + 1}`,
  status: "published",
  version: 1,
  updatedAt: "2026-10-12T00:00:00Z",
  approvedBy: "local-demo",
  approvedAt: "2026-10-12T00:00:00Z",
}));
