import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@material-ui/core";

interface Props {
  gameId: string;
  onContinue: Function;
}

export const NoGame = (props: Props) => {
  const { gameId, onContinue } = props;
  return (
    <Dialog open>
      <DialogContent style={{ padding: 24, textAlign: "center" }}>
        Could not find a game called{" "}
        <Typography
          color="secondary"
          style={{ fontSize: "1.25rem" }}
          component="span">
          {gameId}
        </Typography>
        .<br />
        Please join or create a different game instead.
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onContinue()}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
