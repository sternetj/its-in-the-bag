import React, { useState, useEffect } from "react";
import qs from "qs";
import { useLocation, useHistory } from "react-router-dom";
import {
  Grid,
  CircularProgress,
  Button,
  Typography,
  Box,
} from "@material-ui/core";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { useGame, ROUND_TIME } from "./hooks/use-game";
import { Help } from "./components/Help/Help";
import { NoGame } from "./components/NoGame";
import { isMobile as checkIsMobile } from "is-mobile";
import { Setup } from "./components/Setup";
import { Background } from "../../components/Background";
import { TimesUpModal } from "./components/TimesUpModal";
import { Card } from "./components/Card";
import { ScoreCard } from "./components/ScoreCard";
import { useConfirm } from "./hooks/useConfirm";

const isMobile = checkIsMobile();

const Game = () => {
  const router = useHistory();
  const { search } = useLocation();
  const { name, player } = qs.parse(search, {
    ignoreQueryPrefix: true,
  }) as { name: string; player: string };

  const [playerId] = useState(
    player || window.localStorage.getItem("playerId") || "",
  );
  const game = useGame(name);
  const { value, loading, setPlayersTeam, leaveGame, startGame } = game;
  const { newGame, endTurn, startTurn } = game;
  const { cardAnsweredCorrectly, startNextRound } = game;
  const isCurrentTurn = value?.activePlayer && playerId === value?.activePlayer;
  const numberOfPlayers = Object.keys(value?.players || {}).length;
  const [secondsRemaining, setSecondsRemaining] = useState(ROUND_TIME);
  const [isFlipped, setIsFlipped] = useState(false);
  const [turnStarted, setTurnStarted] = useState(false);
  const confirmNextRound = useConfirm(startNextRound);
  const yourTeam = value?.players[playerId]?.team;
  const isSameTeam =
    value && (value.players[value.activePlayer]?.team ?? "nope") === yourTeam;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      window.onbeforeunload = (e: BeforeUnloadEvent) => {
        if (numberOfPlayers > 1) {
          e.preventDefault();
          e.returnValue = "Are you sure you want to leave the game?";
        }
      };
      window.onunload = () => {
        leaveGame(playerId);
      };
    }
  }, [leaveGame, playerId, numberOfPlayers]);

  useEffect(() => {
    let t: number;
    if (
      value?.timerTimeout &&
      value.timerTimeout > new Date() &&
      secondsRemaining > 0
    ) {
      t = setInterval(() => {
        const now = new Date();
        setSecondsRemaining(Math.floor((+value.timerTimeout - +now) / 1000));
      }, 100) as any;
    }

    return () => clearInterval(t);
  }, [value?.timerTimeout, secondsRemaining]);

  useEffect(() => {
    setSecondsRemaining(ROUND_TIME);
  }, [value?.activePlayer]);

  if (!loading && !value) {
    return (
      <NoGame
        gameId={name}
        onContinue={() => {
          router.push("/");
        }}
      />
    );
  }

  if (!value)
    return (
      <Grid container justify="center" style={{ paddingTop: "4rem" }}>
        <CircularProgress color="secondary" size={65} />
      </Grid>
    );

  const { players, timerTimeout, scores } = value;
  const { cards, activePlayer, round, winner } = value;
  const currentPlayer = players[playerId];
  const spectator = !currentPlayer;
  const isActivePlayer = activePlayer === playerId;
  const timesUp = isActivePlayer && secondsRemaining === 0 && turnStarted;
  const isPlaying = timerTimeout > new Date() || secondsRemaining === 0;

  if (process.env.NODE_ENV !== "production") {
    console.log(JSON.stringify(value, null, 2));
  }

  if (!activePlayer) {
    return (
      <Setup
        playerId={playerId}
        players={Object.values(players)}
        onChangeTeam={(newTeam) => setPlayersTeam(playerId, newTeam)}
        onStartGame={startGame}
      />
    );
  }

  const startPlayerTurn = () => {
    if (!timerTimeout || timerTimeout <= new Date()) {
      setTurnStarted(true);
      setSecondsRemaining(ROUND_TIME);
      startTurn();
    }
    setIsFlipped(true);
  };

  const onCorrect = () => {
    cardAnsweredCorrectly();
    setIsFlipped(false);
  };

  const onEndTurn = (didCompleteCard: boolean) => {
    setTurnStarted(false);
    setIsFlipped(false);
    endTurn(didCompleteCard);
  };

  return (
    <Background>
      <Help
        gameId={name}
        canControl={!spectator}
        onNewGame={() => !spectator && newGame()}
        onExitGame={() => {
          leaveGame(playerId);
          router.push("/");
        }}
      />
      {!!cards.length && (
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          className="fullHeight"
          style={{ paddingBottom: 24, minHeight: "100vh" }}>
          {isSameTeam && !isActivePlayer && (
            <Typography variant="subtitle2" color="secondary">
              You are guessing!
            </Typography>
          )}
          <Typography
            variant="h6"
            color="secondary"
            align="center"
            style={{ marginBottom: "1rem" }}>
            Round {round}:{" "}
            {
              {
                1: "Describe the Word",
                2: "One Word Description",
                3: "Act it Out",
              }[round]
            }
          </Typography>
          {isPlaying && timerTimeout && (
            <Box position="relative" display="inline-flex" marginY={2}>
              <CircularProgress
                size={isActivePlayer ? 40 : 100}
                variant="determinate"
                color="secondary"
                value={((ROUND_TIME - secondsRemaining) / ROUND_TIME) * 100}
              />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <Typography
                  variant="caption"
                  component="div"
                  color="textSecondary">{`${secondsRemaining}s`}</Typography>
              </Box>
            </Box>
          )}
          {activePlayer === playerId && (
            <Card
              card={cards[0]}
              isFlipped={isFlipped}
              onClick={startPlayerTurn}
              cardFront={
                timerTimeout > new Date() ? (
                  `${isMobile ? "Tap" : "Click"} to Flip`
                ) : (
                  <>
                    It's Your Turn!
                    <br />
                    {isMobile ? "Tap" : "Click"} to Start
                  </>
                )
              }
            />
          )}
          {!isActivePlayer && (
            <>
              <Typography align="center">
                {`It's ${
                  players[activePlayer].playerName + `'s`
                } turn to give clues`}
              </Typography>
              <Typography align="center">
                {isSameTeam
                  ? "You are on their team so get ready to guess!"
                  : round < 3
                  ? "You are not on their team so pay attention for the next round"
                  : "You are not on their team so take a break"}
              </Typography>
            </>
          )}
          <Grid item container justify="center" direction="row">
            {isCurrentTurn && isPlaying && (
              <Button
                disabled={!isFlipped}
                onClick={onCorrect}
                color="primary"
                style={{ marginTop: 16 }}
                variant="contained">
                Got It
              </Button>
            )}
          </Grid>
        </Grid>
      )}

      {!cards.length && (
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          className="fullHeight"
          style={{ paddingBottom: 24, minHeight: "100vh" }}>
          {winner && (
            <Typography
              variant={winner !== "Tie" ? "h4" : "h5"}
              color="secondary"
              align="center"
              style={{ marginBottom: "1rem" }}>
              {winner !== "Tie" ? (
                winner === yourTeam ? (
                  `Your Team Won!`
                ) : (
                  `Team ${winner} Wins!`
                )
              ) : (
                <>
                  It's a Tie!
                  <br />
                  Play Again, Winner Takes All!
                </>
              )}
            </Typography>
          )}
          <ScoreCard team="A" scores={scores} isYourTeam={yourTeam === "A"} />
          <br />
          <ScoreCard team="B" scores={scores} isYourTeam={yourTeam === "B"} />
          <br />
          {round < 3 && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={confirmNextRound.openConfirm}>
              Start Next Round
            </Button>
          )}
          {round === 3 && (
            <Button variant="outlined" color="secondary" onClick={newGame}>
              New Game
            </Button>
          )}
        </Grid>
      )}

      <ConfirmDialog
        title="Is everyone ready to start?"
        prompt="This starts the next round for everyone so make sure they are ready to continue."
        open={confirmNextRound.isOpen}
        onConfirm={confirmNextRound.onConfirm}
        onCancel={confirmNextRound.onCancel}
      />

      <TimesUpModal
        open={timesUp}
        cardWasShown={isFlipped}
        cardText={cards[0]?.text}
        onClose={onEndTurn}
      />
    </Background>
  );
};

export default Game;
