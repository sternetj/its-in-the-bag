import { FC, ReactNode } from "react";
import { Grid, makeStyles, Paper, Typography, Box } from "@material-ui/core";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import ReactCardFlip from "react-card-flip";

interface Props {
  cardFront: ReactNode;
  card?: { text: string; type: string };
  isFlipped: boolean;
  onClick: () => void;
}

export const Card: FC<Props> = (props) => {
  const { card, cardFront, isFlipped, onClick } = props;
  const classes = useStyles();

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={card?.text}
        addEndListener={(node, done) =>
          node.addEventListener("transitionend", done, false)
        }
        classNames="fade">
        <Grid container item justify="center" className={classes.card}>
          <ReactCardFlip
            isFlipped={isFlipped}
            flipDirection="vertical"
            flipSpeedBackToFront={0.5}
            flipSpeedFrontToBack={0.5}>
            <Paper
              style={{
                width: 200,
                height: 150,
                backgroundColor: "white",
                cursor: "pointer",
                display: "flex",
              }}
              onClick={onClick}>
              <Grid container justify="center" alignItems="center">
                <Typography
                  variant="body1"
                  style={{
                    textAlign: "center",
                    fontSize: 25,
                    lineHeight: "2.5rem",
                  }}>
                  {cardFront}
                </Typography>
              </Grid>
            </Paper>

            <Paper
              style={{
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
                alignItems: "center",
                width: 200,
                height: 140,
                backgroundColor: "white",
                backgroundSize: "contain",
                background: `url(cards/${card?.type}.svg), white`,
                padding: 20,
              }}>
              <Box margin="auto">
                <Typography
                  variant="body1"
                  align="center"
                  style={{
                    flex: 1,
                    fontSize: 25,
                    lineHeight: "1.5rem",
                    textTransform: "uppercase",
                  }}>
                  {card?.text}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                align="center"
                style={{
                  fontSize: 13,
                  lineHeight: "0.7rem",
                  marginBottom: 5,
                }}>
                {
                  {
                    people: "People",
                    locations: "Locations",
                    sports: (
                      <Box marginBottom={-1}>
                        Recreation and
                        <br />
                        Sports
                      </Box>
                    ),
                    outdoors: "Outdoors",
                    entertainment: "Entertainment",
                    undefined: "",
                  }[card?.type || "undefined"]
                }
              </Typography>
            </Paper>
          </ReactCardFlip>
        </Grid>
      </CSSTransition>
    </SwitchTransition>
  );
};

const useStyles = makeStyles(() => ({
  card: {
    "&&&& *": {
      fontFamily: "IITB !important",
      fontWeight: "bolder !important",
      color: "#242827 !important",
      "& svg path ": {
        fill: "var(--stroke-color)",
        stroke: "var(--stroke-color)",
      },
    },
    "&.fade-enter": {
      opacity: 0,
      transform: "translateX(-24px)",
    },
    "&.fade-exit": {
      opacity: 1,
    },
    "&.fade-enter-active": {
      opacity: 1,
      transform: "translateX(0)",
    },
    "&.fade-exit-active": {
      opacity: 0,
    },
    "&.fade-enter-active, &.fade-exit-active": {
      transition: "all 250ms",
    },
  },
}));
