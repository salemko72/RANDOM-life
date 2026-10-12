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
export const demoCatalog: ContentRecord[] = demoItems.map((item, i) => ({
  ...item,
  id: `demo-${i + 1}`,
  status: "published",
  version: 1,
  updatedAt: "2026-10-12T00:00:00Z",
  approvedBy: "local-demo",
  approvedAt: "2026-10-12T00:00:00Z",
}));
