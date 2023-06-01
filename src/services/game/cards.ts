import cardData from "./cardsData.json";

const cardTypes = [
  "entertainment",
  "locations",
  "sports",
  "outdoors",
  "people",
] as const;

export type CardType = {
  text: string;
  type: (typeof cardTypes)[number];
};

export const cards: CardType[] = cardData.cards.filter(
  (data): data is CardType => {
    return (
      typeof data.text === "string" &&
      !!data.text &&
      typeof data.type === "string" &&
      cardTypes.includes(data.type as any)
    );
  },
);
