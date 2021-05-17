import firebase from "firebase";
import { v4 as uuid } from "uuid";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  colors,
} from "unique-names-generator";
import { countBy } from "lodash";

const playerId = window.localStorage.getItem("playerId") || uuid();
window.localStorage.setItem("playerId", playerId);

const config = {
  apiKey: "AIzaSyCR8dcSv9ya4DldMVpco5CGy3fUMb4wiMY",
  authDomain: "its-in-the-bag-451ff.firebaseapp.com",
  projectId: "its-in-the-bag-451ff",
  storageBucket: "its-in-the-bag-451ff.appspot.com",
  messagingSenderId: "540181405272",
  appId: "1:540181405272:web:6cb96692af52d10fb7f42d",
  measurementId: "G-FWL3BRLTEC",
  databaseURL: "https://its-in-the-bag-451ff-default-rtdb.firebaseio.com/",
};

firebase.initializeApp(config);
const db = firebase.database();
const databaseRef = db.ref();

export const generateGameName = () =>
  uniqueNamesGenerator({
    dictionaries: [[...adjectives, ...colors], animals],
    separator: "-",
    style: "lowerCase",
    length: 2,
  });

export const createGame = async (
  gameId: string,
  playerName: string,
  player?: string,
) => {
  const ref = databaseRef.child(gameId);
  const pId = player || playerId;

  await ref.set({
    players: {
      [pId]: {
        id: pId,
        playerName,
        team: "A",
      },
    },
    round: 1,
    answered: {
      A: [],
      B: [],
    },
    scores: {
      A: [],
      B: [],
    },
  });

  return {
    name: gameId,
    ref,
  };
};

export const gameExists = async (gameId: string) => {
  const ref = db.ref(gameId);
  const snapshot = await ref.once("value");
  return snapshot.val();
};

export const joinGame = async (
  gameId: string,
  playerName: string,
  player?: string,
) => {
  const ref = db.ref(`${gameId}/players`);
  const snapshot = await ref.once("value");
  const { A = 0, B = 0 } = countBy(Object.values(snapshot.val()), "team");

  await ref.update({
    [player || playerId]: {
      id: player || playerId,
      playerName,
      team: A <= B ? "A" : "B",
    },
  });

  return {
    name: gameId,
    ref,
  };
};

export const getGame = (gameId: string) => {
  return db.ref(gameId);
};
