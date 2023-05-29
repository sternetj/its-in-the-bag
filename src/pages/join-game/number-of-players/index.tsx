import React, { useCallback, useState } from "react";
import { Grid, Button, Typography, styled, TextField } from "@material-ui/core";
import { isFinite, parseInt } from "lodash";

interface NumberOfPlayersProps {
  onSubmit: (players: number) => void;
  onBack: () => void;
}

const NumberOfPlayers = (props: NumberOfPlayersProps) => {
  const { onSubmit, onBack } = props;
  const [players, setPlayers] = useState("2");
  const [errorText, setErrorText] = useState<string>("");

  const handleSubmit = useCallback(() => {
    const playerNum = parseInt(players);
    if (isFinite(playerNum) && playerNum >= 2) {
      onSubmit(playerNum);
    } else {
      setErrorText("You must have at lease 2 players");
    }
  }, [players, onSubmit]);

  return (
    <Container container direction="column" alignItems="center">
      <Typography variant="h4">How Many People are Playing?</Typography>
      <Typography variant="subtitle1">
        Four cards will be added to the bag for each player
      </Typography>
      <StyledTextField
        autoFocus
        variant="outlined"
        type="number"
        placeholder="2"
        error={!!errorText}
        helperText={
          errorText ||
          (Number(players) > 1
            ? `There will be ${Number(players) * 4} cards in the bag`
            : "")
        }
        value={players}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit}
        onChange={(e) => setPlayers(e.target.value)}
      />
      <Grid container direction="row" justify="space-evenly">
        <ActionButton onClick={() => onBack()}>Back</ActionButton>
        <ActionButton color="primary" onClick={handleSubmit}>
          Continue
        </ActionButton>
      </Grid>
    </Container>
  );
};

const Container = styled(Grid)({
  "&>*:not(:last-child)": {
    paddingBottom: ".75rem",
  },
});

const StyledTextField = styled(TextField)({
  textAlign: "center",
});

const ActionButton = styled(Button)({});
ActionButton.defaultProps = {
  variant: "outlined",
  size: "large",
};

export default NumberOfPlayers;
