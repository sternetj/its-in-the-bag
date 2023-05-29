import {
  Typography,
  Avatar,
  Paper,
  Container,
  Grid,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { Player } from "../../hooks/use-game";
import { amber } from "@material-ui/core/colors";
import { SwapDirectionIcon } from "./SwapDirectionIcon";

type Props = {
  canEdit: boolean;
  player: Player;
  onSwap: () => void;
};
export const TeamPlayerRow = ({ player, onSwap, canEdit }: Props) => {
  const classes = useStyles();

  return (
    <Container className={`${classes.root} ${canEdit ? classes.canEdit : ""}`}>
      <Paper className={classes.paper} onClick={onSwap}>
        <Grid
          container
          wrap="nowrap"
          alignItems="center"
          spacing={2}
          direction="row">
          <Grid item>
            <Avatar className={canEdit ? classes.gold : ""} />
          </Grid>
          <Grid item xs zeroMinWidth>
            <Typography
              noWrap
              color={canEdit ? "textSecondary" : "textPrimary"}>
              {player.playerName}
            </Typography>
          </Grid>
          {canEdit && (
            <Grid item>
              <Typography color="secondary">
                <SwapDirectionIcon />
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: "hidden",
    padding: theme.spacing(0, 3),
  },
  canEdit: {
    cursor: "pointer",
  },
  paper: {
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  gold: {
    color: theme.palette.getContrastText(amber[300]),
    backgroundColor: amber[300],
  },
}));
