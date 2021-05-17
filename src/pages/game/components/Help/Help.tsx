import React, { FC, useState, useMemo } from "react";
import { IconButton, Grid } from "@material-ui/core";

import HelpRounded from "@material-ui/icons/HelpRounded";
import ExitToApp from "@material-ui/icons/ExitToAppOutlined";
import Sync from "@material-ui/icons/Sync";
import { HowToPlayModal } from "./HowToPlayModal";
import { ExitGameModal } from "./ExitGameModal";
import { NewGameModal } from "./NewGameModal";
import { isMobile as checkIsMobile } from "is-mobile";
import ReactGA from "react-ga";

const isMobile = checkIsMobile();

interface Props {
  gameId: string;
  canControl: boolean;
  onNewGame: Function;
  onExitGame: Function;
}

export const Help: FC<Props> = (props) => {
  const { gameId, canControl, onNewGame, onExitGame } = props;
  const [open, setOpen] = useState<"howTo" | "leave-game" | "new-game">();

  const close = useMemo(
    () =>
      (action: string = "cancel") => {
        setOpen((category) => {
          category && ReactGA.event({ category, action });
          return undefined;
        });
      },
    [setOpen],
  );

  return (
    <>
      <Grid
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
        }}>
        {/* <IconButton
          title="Help"
          color="inherit"
          onClick={() => {
            setOpen("howTo");
            ReactGA.event({ category: "howTo", action: "open" });
          }}>
          <HelpRounded />
        </IconButton> */}
        {canControl && (
          <IconButton
            title="New Game"
            color="inherit"
            onClick={() => {
              setOpen("new-game");
              ReactGA.event({ category: "new-game", action: "initiate" });
            }}>
            <Sync />
          </IconButton>
        )}
        <IconButton
          title="Leave Game"
          color="inherit"
          onClick={() => {
            setOpen("leave-game");
            ReactGA.event({ category: "leave-game", action: "initiate" });
          }}>
          <ExitToApp />
        </IconButton>
      </Grid>

      <HowToPlayModal
        gameId={gameId}
        open={open === "howTo"}
        onClose={() => close("close")}
      />

      <NewGameModal
        open={open === "new-game" && canControl}
        onNewGame={() => {
          onNewGame();
          close("confirm");
        }}
        onCancel={close}
      />

      <ExitGameModal
        open={open === "leave-game"}
        onCancel={close}
        onExitGame={() => {
          close("confirm");
          onExitGame();
        }}
      />
    </>
  );
};
