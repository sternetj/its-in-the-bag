export type CardType = {
  text: string;
  type: "entertainment" | "locations" | "sports" | "outdoors" | "people";
};

export const cards: CardType[] = [
  { text: "Running", type: "sports" },
  { text: "Obama", type: "people" },
  { text: "Pickle Rick", type: "entertainment" },
  { text: "Maroon 5", type: "entertainment" },
];
