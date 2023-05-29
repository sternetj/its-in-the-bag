import React, { useState, useEffect } from "react";
import { Grid, styled, Card, Typography } from "@material-ui/core";
import Welcome from "./welcome";
import GameType from "./game-type";
import {
  createGame,
  joinGame,
  gameExists,
  generateGameName,
} from "../../services/firebase";
import EnterName from "./enter-name";
import EnterGameId from "./enter-name";
import { useNavigate } from "react-router-dom";
import qs from "qs";
import { useLocation } from "react-router-dom";
import { ShareLink } from "../../components/ShareLink";
import { Background } from "../../components/Background";
import NumberOfPlayers from "./number-of-players";

enum Steps {
  GameName = 1,
  GameType = 2,
  PlayerName = 3,
  NumberOfPlayers = 4,
}

const JoinGame = () => {
  const { search } = useLocation();
  const { player, name } = qs.parse(search, { ignoreQueryPrefix: true }) as {
    player: string;
    name: string;
  };
  const navigateTo = useNavigate();
  const [slide, setSlide] = useState(0);
  const [type, setType] = useState<ConnectType>();
  const [directLink, setDirectLink] = useState<boolean>();
  const [gameId, setGameId] = useState(name || "");
  const [isPassAndPlay, setIsPassAndPlay] = useState(false);
  const [errorText, setErrorText] = useState<string>();

  useEffect(() => {
    if (gameId) {
      gameExists(gameId).then((exists) => {
        if (exists) {
          setSlide(Steps.PlayerName);
          setType("join");
          setDirectLink(true);
        } else {
          alert(`Could not find a game with id "${gameId}"`);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConnect = (type: ConnectType) => {
    if (isCreate(type)) {
      setGameId(generateGameName());
      setSlide(Steps.GameType);
    } else {
      setSlide(Steps.GameName);
    }
    setType(type);
  };

  const onSetGameId = async (id: string) => {
    const upperId = id?.toUpperCase();
    setErrorText(undefined);
    const exists = await gameExists(upperId);
    if (exists && !exists.isPassAndPlay) {
      setSlide(Steps.PlayerName);
      setGameId(upperId);
    } else if (exists?.isPassAndPlay) {
      setErrorText("Cannot join a Pass and Play Game");
    } else {
      setErrorText("Game does not exist");
    }
  };

  const onSetPassAndPlay = async () => {
    setIsPassAndPlay(true);
    setSlide(Steps.NumberOfPlayers);
  };

  const onSubmit = async (
    name: string,
    isPassAndPlay = false,
    numPlayers = 1,
  ) => {
    try {
      const game = await (isCreate(type)
        ? createGame(gameId, name, player, isPassAndPlay, numPlayers)
        : joinGame(gameId, name, player));

      navigateTo(
        `/game?${qs.stringify({
          player,
          name: game.name,
        })}`,
      );
    } catch (e) {
      console.log(e);
      alert("Game is already full. Please Join or Create a different game.");
    }
  };

  const prompt = isCreate(type) ? "Create Game" : "Join Game";

  return (
    <Background>
      <Container
        container
        alignItems="center"
        justify="center"
        direction="column">
        {directLink && (
          <Typography variant="h5" style={{ padding: "0.5rem" }}>
            Joining game{" "}
            <Typography variant="inherit" component="span" color="secondary">
              {gameId}
            </Typography>
          </Typography>
        )}
        <StyledCard>
          {slide === 0 && (
            <Welcome
              onJoin={() => onConnect("join")}
              onCreate={() => onConnect("create")}
            />
          )}
          {slide === Steps.GameName && (
            <EnterGameId
              title="Enter Game Id"
              placeholder="AAAA"
              label="Continue"
              error={errorText}
              onBack={() => setSlide(0)}
              onSubmit={onSetGameId}
            />
          )}
          {slide === Steps.GameType && (
            <GameType
              onMultiDevice={() => setSlide(Steps.PlayerName)}
              onPassAndPlay={onSetPassAndPlay}
              onBack={() => setSlide(0)}
            />
          )}
          {slide === Steps.PlayerName && (
            <EnterName
              dataKey="playerName"
              title="Enter Your Name"
              label={prompt}
              onBack={() => setSlide(Steps.GameType)}
              onSubmit={onSubmit}>
              {isCreate(type) && (
                <ShareLink gameId={gameId} style={{ padding: "1rem 0" }} />
              )}
            </EnterName>
          )}
          {slide === Steps.NumberOfPlayers && (
            <NumberOfPlayers
              onBack={() => setSlide(Steps.GameType)}
              onSubmit={(players) => onSubmit("", isPassAndPlay, players)}
            />
          )}
        </StyledCard>
      </Container>
    </Background>
  );
};

type ConnectType = "create" | "join";
const isCreate = (type?: ConnectType) => {
  return type === "create";
};

const StyledCard = styled(Card)({
  width: "420px",
  maxWidth: "90vw",
  padding: "2rem",
});

const Container = styled(Grid)({
  height: "100vh",
});

if (Container.defaultProps) {
  Container.defaultProps.className = "fullHeight";
}

export default JoinGame;
