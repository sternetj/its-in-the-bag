import React, { FC } from "react";
import {
  Grid,
  Button,
  Typography,
  styled,
  List,
  ListItem,
  Box,
} from "@material-ui/core";

interface GameTypeProps {
  onPassAndPlay: Function;
  onMultiDevice: Function;
  onBack: Function;
}

const GameType: FC<GameTypeProps> = ({
  onPassAndPlay,
  onMultiDevice,
  onBack,
}) => {
  return (
    <Container container direction="column" alignItems="center">
      <Typography variant="h4">How do you want to play?</Typography>
      <Typography variant="body1" color="primary">
        <List>
          <ListItem>
            <Box>
              <Yellow>Pass And Play</Yellow> - Use a single device and pass it
              to the next player between turns
            </Box>
          </ListItem>
          <ListItem>
            <Box>
              <Yellow>BYOD</Yellow> (Bring Your Own Device) - Everyone joins on
              their own device
            </Box>
          </ListItem>
        </List>
      </Typography>
      <Grid container justify="space-around">
        <ActionButton onClick={() => onPassAndPlay()}>
          Pass and Play
        </ActionButton>
        <ActionButton onClick={() => onMultiDevice()}>BYOD</ActionButton>
      </Grid>
      <BackButton onClick={() => onBack()}>Back</BackButton>
    </Container>
  );
};

const Container = styled(Grid)({
  "&>*:not(:last-child)": {
    paddingBottom: ".75rem",
  },
});

const BackButton = styled(Button)({});
BackButton.defaultProps = {
  variant: "text",
};

const ActionButton = styled(Button)({});
ActionButton.defaultProps = {
  variant: "outlined",
  size: "large",
  color: "secondary",
  style: {
    minWidth: "108px",
  },
};

const Yellow = styled("span")(({ theme }) => ({
  color: theme.palette.secondary.main,
}));

export default GameType;
