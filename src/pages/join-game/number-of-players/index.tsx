import React, { FC, useState } from "react";
import { Grid, Button, Typography, styled, TextField } from "@material-ui/core";

interface NumberOfPlayersProps {
  onSubmit: (players: number) => void;
  onBack: () => void;
}

const NumberOfPlayers: FC<NumberOfPlayersProps> = (props) => {
  const { onSubmit, onBack } = props;
  const [players, setPlayers] = useState<number>(2);
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
        helperText={
          players ? `There will be ${players * 4} cards in the bag` : ""
        }
        value={players}
        onKeyPress={(e) => e.key === "Enter" && onSubmit(players ?? 2)}
        onChange={(e) => setPlayers(Math.max(+e.target.value, 2))}
      />
      <Grid container direction="row" justify="space-evenly">
        <ActionButton onClick={() => onBack()}>Back</ActionButton>
        <ActionButton color="primary" onClick={() => onSubmit(players ?? 2)}>
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
