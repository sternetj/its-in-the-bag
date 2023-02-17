import * as firebase from "firebase/app";
import * as firebaseDb from "firebase/database";
import { v4 as uuid } from "uuid";
import { countBy, sample } from "lodash";

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

const app = firebase.initializeApp(config);
const db = firebaseDb.getDatabase(app);
const databaseRef = firebaseDb.ref(db);

export const generateGameName = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const s = sample;

  return `${s(chars)}${s(chars)}${s(chars)}${s(chars)}`;
};

export const createGame = async (
  gameId: string,
  playerName: string,
  player?: string,
) => {
  const ref = firebaseDb.child(databaseRef, gameId);
  const pId = player || playerId;

  await firebaseDb.set(ref, {
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
  const ref = firebaseDb.child(databaseRef, gameId);
  const snapshot = await firebaseDb.get(ref);
  return snapshot.val();
};

export const joinGame = async (
  gameId: string,
  playerName: string,
  player?: string,
) => {
  const ref = firebaseDb.child(databaseRef, `${gameId}/players`);
  const snapshot = await firebaseDb.get(ref);
  const { A = 0, B = 0 } = countBy(Object.values(snapshot.val()), "team");

  await firebaseDb.update(ref, {
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
  return firebaseDb.ref(db, gameId);
};
