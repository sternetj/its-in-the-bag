import React, { FC } from "react";
import { Grid, Button, Typography, Link, styled } from "@material-ui/core";

interface WelcomeProps {
  onJoin: Function;
  onCreate: Function;
}

const Welcome: FC<WelcomeProps> = ({ onJoin, onCreate }) => {
  return (
    <Container container direction="column" alignItems="center">
      <Typography variant="h4">It's In The Bag!</Typography>
      <Typography variant="body1" color="primary">
        The Quick Witted Party Game
      </Typography>
      <Grid container justify="space-around">
        <ActionButton onClick={() => onJoin()}>Join</ActionButton>
        <ActionButton onClick={() => onCreate()}>Create</ActionButton>
      </Grid>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        href="https://drive.google.com/file/d/1ew6XkFEDeWrbuNJvjP2EQBmYxxgDu8dR/view">
        Rules
      </Link>
    </Container>
  );
};

const Container = styled(Grid)({
  "&>*:not(:last-child)": {
    paddingBottom: ".75rem",
  },
});

const ActionButton = styled(Button)({});
ActionButton.defaultProps = {
  variant: "outlined",
  size: "large",
  color: "secondary",
  style: {
    minWidth: "108px",
  },
};

export default Welcome;
