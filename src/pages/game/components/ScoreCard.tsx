import React, { Fragment } from "react";
import { Typography } from "@material-ui/core";
import { GameState, Team } from "../hooks/use-game";

interface Props {
  scores: GameState["scores"];
  team: Team;
  isYourTeam: boolean;
}
export const ScoreCard = ({ team, scores, isYourTeam }: Props) => {
  const moreThanOneRound = Object.keys(scores[team]).length > 1;
  const total = Object.values(scores[team] || {}).reduce(
    (t, roundScore) => t + roundScore,
    0,
  );

  return (
    <Typography align="center" variant="h5">
      Team {team}:
      <Typography
        variant="inherit"
        component="span"
        color="secondary"
        style={{ marginLeft: 16 }}>
        {total}
      </Typography>
      {isYourTeam && (
        <Typography variant="caption" color="secondary" component="div">
          (Your Team)
        </Typography>
      )}
      {moreThanOneRound &&
        Object.entries(scores[team] || {}).map(([round, score]) => (
          <Fragment key={round}>
            <Typography variant="subtitle2" style={{ marginTop: 8 }}>
              Round {round}:{" "}
              <Typography
                variant="subtitle2"
                component="span"
                color="secondary">
                {score}
              </Typography>
            </Typography>
          </Fragment>
        ))}
    </Typography>
  );
};
