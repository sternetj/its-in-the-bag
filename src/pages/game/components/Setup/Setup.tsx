import {
  Typography,
  Grid,
  Box,
  Container,
  makeStyles,
  Button,
} from "@material-ui/core";
import React, { FC, useCallback } from "react";
import { Player } from "../../hooks/use-game";
import { TeamPlayerRow } from "./TeamPlayerRow";
import { groupBy } from "lodash";
import { Background } from "../../../../components/Background";
import { SwapDirectionIcon } from "./SwapDirectionIcon";

type TeamType = Required<Player>["team"];
type Props = {
  playerId: string;
  players: Player[];
  onChangeTeam: (newTeam: TeamType) => void;
  onStartGame: () => void;
};

export const Setup: FC<Props> = (props) => {
  const classes = useStyles();
  const { players, onChangeTeam, playerId, onStartGame } = props;
  const { A: teamA = [], B: teamB = [] } = groupBy(players, "team");
  const currentTeam = players.find(({ id }) => id === playerId)?.team || "A";

  const switchTeams = useCallback(() => {
    onChangeTeam(currentTeam === "B" ? "A" : "B");
  }, [currentTeam, onChangeTeam]);

  return (
    <Background>
      <Container>
        <Grid container justify="center" direction="row">
          <Grid item>
            <Box marginTop={4}>
              <Typography variant="h4" align="center">
                Choose Your Team
              </Typography>
            </Box>
          </Grid>
          <Grid item container justify="center" className={classes.switchTeams}>
            <Button
              color="primary"
              variant="outlined"
              onClick={switchTeams}
              endIcon={<SwapDirectionIcon />}>
              Switch Team
            </Button>
          </Grid>
          <Grid
            item
            container
            spacing={3}
            direction="row"
            className={classes.teamSelection}>
            <Grid item xs={12} md={6} className={classes.teamContainer}>
              <Typography variant="h6" align="center" color="textSecondary">
                Team A
              </Typography>
              <Box className={classes.paper}>
                {teamA?.length ? (
                  teamA.map((p) => (
                    <TeamPlayerRow
                      key={p.id}
                      player={p}
                      onSwap={switchTeams}
                      canEdit={p.id === playerId}
                    />
                  ))
                ) : (
                  <NoTeamMembers />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6} className={classes.teamContainer}>
              <Typography variant="h6" align="center" color="textSecondary">
                Team B
              </Typography>
              <Box className={classes.paper}>
                {teamB?.length ? (
                  teamB.map((p) => (
                    <TeamPlayerRow
                      key={p.id}
                      player={p}
                      onSwap={switchTeams}
                      canEdit={p.id === playerId}
                    />
                  ))
                ) : (
                  <NoTeamMembers />
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid item container justify="center">
            <Button
              color="secondary"
              variant="outlined"
              disabled={!teamA.length || !teamB.length}
              onClick={onStartGame}>
              Start Game
            </Button>
          </Grid>
          {!!teamA.length && !!teamB.length && (
            <Grid item container justify="center">
              <Box marginTop={1.25} marginBottom={5}>
                <Typography variant="subtitle2" align="center">
                  Note: This will end team selection for all
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Background>
  );
};

const NoTeamMembers = () => (
  <Typography variant="subtitle1" align="center">
    No Players have joined this team
  </Typography>
);

const useStyles = makeStyles((theme) => ({
  teamContainer: {
    display: "flex",
    flexDirection: "column",
  },
  paper: {
    flex: 1,
    height: "auto",
  },
  teamSelection: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  switchTeams: {
    marginTop: theme.spacing(2),
  },
}));
