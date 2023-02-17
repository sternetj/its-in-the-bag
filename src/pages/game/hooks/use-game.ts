import { useObjectVal } from "react-firebase-hooks/database";
import { getGame } from "../../../services/firebase";
import { cards, CardType } from "../../../services/game/cards";
import { shuffle } from "../../../services/shuffle";
import * as firebase from "firebase/database";

export const ROUND_TIME = process.env.NODE_ENV === "production" ? 30 : 15;

export function useGame(id: string) {
  const ref = getGame(id);
  const [raw, loading] = useObjectVal<GameState>(ref);
  const value = deserializeGame(raw);

  const leaveGame = (playerId: string) => {
    if (!value) return;

    if (Object.keys(value.players).length > 2) {
      const { [playerId]: leaving, ...remainingPlayers } = value.players;
      const activePlayer =
        value.activePlayer === playerId
          ? getNextPlayer(
              value.players,
              getNextPlayer(value.players, playerId),
            )!
          : value.activePlayer;
      firebase.update(ref, {
        players: remainingPlayers,
        activePlayer,
      });
    } else {
      firebase.remove(ref);
    }
  };

  const newGame = () => {
    if (!value) return;

    firebase.update(ref, {
      answered: {
        A: [],
        B: [],
      },
      activePlayer: null,
      cards: null,
      gameCards: null,
      round: 1,
      scores: {
        A: [],
        B: [],
      },
      winner: null,
      snapshot: null,
      timerTimeout: null as any,
    });
  };

  const cardAnsweredCorrectly = () => {
    if (!value) return;
    const currentPlayer = value.players[value.activePlayer];
    const team = currentPlayer.team!;
    const answeredCard = value.cards.shift()!;

    let additionalStateValues: Partial<GameState> = {};

    if (value.cards.length === 0) {
      additionalStateValues = {
        timerTimeout: null as any,
        scores: {
          A: {
            ...value.scores.A,
            [value.round]:
              (value.answered.A?.length ?? 0) + (team === "A" ? 1 : 0),
          },
          B: {
            ...value.scores.B,
            [value.round]:
              (value.answered.B?.length ?? 0) + (team === "B" ? 1 : 0),
          },
        },
      };

      if (value.round === 3) {
        const [aScore, bScore] = ["A" as Team, "B" as Team].map((team) =>
          Object.values(additionalStateValues.scores![team] || {}).reduce(
            (t, roundScore) => t + roundScore,
            0,
          ),
        );

        additionalStateValues.winner =
          aScore > bScore ? "A" : bScore > aScore ? "B" : "Tie";
      }
    }

    firebase.update(ref, {
      answered: {
        ...value.answered,
        [team]: (value.answered?.[team] ?? []).concat(answeredCard),
      },
      cards: value.cards,
      ...additionalStateValues,
    });
  };

  const endTurn = (didCompleteCard: boolean) => {
    if (!value) return;

    let additionalStateValues: Partial<GameState> = {};

    if (didCompleteCard) {
      cardAnsweredCorrectly();
    } else {
      additionalStateValues = {
        cards: shuffle(value.cards),
      };
    }

    firebase.update(ref, {
      activePlayer: getNextPlayer(value.players, value.activePlayer),
      timerTimeout: null,
      ...additionalStateValues,
    });
  };

  const setPlayersTeam = (playerId: string, team: "A" | "B") => {
    if (!value || !playerId) return;
    const current = value.players[playerId];

    firebase.update(ref, {
      players: {
        ...value.players,
        [playerId]: {
          ...current,
          team,
        },
      },
    });
  };

  const startGame = () => {
    if (!value) return;

    const numPlayers = Object.keys(value.players).length;
    const gameCards = shuffle(cards).slice(0, 4 * numPlayers);

    firebase.update(ref, {
      activePlayer: getNextPlayer(value.players, value.activePlayer),
      gameCards,
      cards: gameCards,
    });
  };

  const startTurn = () => {
    if (!value) return;

    firebase.update(ref, {
      timerTimeout: new Date(Date.now() + ROUND_TIME * 1000),
    });
  };

  const startNextRound = () => {
    if (!value) return;

    firebase.update(ref, {
      activePlayer: getNextPlayer(value.players, value.activePlayer),
      round: value.round + 1,
      answered: {
        A: [],
        B: [],
      },
      cards: shuffle(value.gameCards),
    });
  };

  return {
    loading,
    value,
    leaveGame,
    newGame,
    endTurn,
    setPlayersTeam,
    startGame,
    startTurn,
    cardAnsweredCorrectly,
    startNextRound,
  };
}

const deserializeGame = (value: GameState | undefined) =>
  value && {
    ...value,
    timerTimeout: value.timerTimeout && new Date(value.timerTimeout),
    cards: value.cards || [],
    gameCards: value.gameCards || [],
    answered: {
      A: value.answered?.A ?? [],
      B: value.answered?.B ?? [],
    },
    scores: {
      A: value.scores?.A ?? {},
      B: value.scores?.B ?? {},
    },
  };

const getNextPlayer = (players: GameState["players"], currentPlayer = "") => {
  const sorted = Object.keys(players).sort();
  const activePlayer = currentPlayer || sorted[0];
  const currentIndex = sorted.indexOf(activePlayer);
  const currentTeam = players[activePlayer].team!;

  return sorted
    .concat(sorted)
    .slice(currentIndex + 1)
    .find((pId) => players[pId].team !== currentTeam);
};

export interface GameState {
  timerTimeout: Date;
  cards: CardType[];
  gameCards: CardType[];
  activePlayer: string;
  round: 1 | 2 | 3;
  players: {
    [playerId: string]: Player;
  };
  answered: {
    [t in Team]: CardType[];
  };
  scores: {
    [t in Team]: {
      [round in 1 | 2 | 3]: number;
    };
  };
  winner: Team | "Tie";
}

export type Team = "A" | "B";

export interface Player {
  id: string;
  playerName: string;
  team?: Team;
}

export type CardIndex = 1 | 2 | 3 | 4;
