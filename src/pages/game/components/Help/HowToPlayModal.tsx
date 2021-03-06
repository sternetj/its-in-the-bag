import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  List,
  ListItem,
  styled,
  Box,
  DialogTitle,
  Grid,
  ListSubheader,
  DialogProps,
  Link,
  Icon,
} from "@material-ui/core";
import { ArrowRight } from "@material-ui/icons";
import { ShareLink } from "../../../../components/ShareLink";

interface Props extends DialogProps {
  gameId: string;
}

export const HowToPlayModal: FC<Props> = ({ gameId, ...dialogProps }) => {
  return (
    <Dialog {...dialogProps}>
      <DialogTitle style={{ textAlign: "center", paddingBottom: 0 }}>
        How to Play
      </DialogTitle>
      <DialogContent style={{ padding: "0px 24px 24px 24px" }}>
        <List>
          <ListSubheader disableSticky>Difficulty</ListSubheader>
          <ListItem dense>
            <Grid container direction="row" justify="space-around">
              <span>
                <b>Zero</b>: Easy
              </span>
              <span>
                <b>2</b>: Normal
              </span>
              <span>
                <b>4</b>: Hard
              </span>
              <span>
                <b>6</b>: Doomed!
              </span>
            </Grid>
          </ListItem>
          <ListItem>
            For further game specific details please refer to the{" "}
            <Link
              style={{ marginLeft: 4, textDecoration: "underline" }}
              target="_blank"
              color="textSecondary"
              rel="noopener noreferrer"
              href="https://www.meromorphgames.com/shipwreck-arcana/rules">
              Rules
            </Link>
          </ListItem>
          <ListSubheader disableSticky>Turn Order</ListSubheader>
          <ListItem dense>
            Play proceeds in a clock-wise fashion, moving from one player color
            to the next{" "}
            <Icon style={{ width: 32, height: 32 }}>
              <img
                style={{ height: "100%" }}
                src="/pieces/turn-order.svg"
                alt="Turn Order Icon"
              />
            </Icon>
          </ListItem>
          <ListSubheader disableSticky style={{}}>
            Player Controls
          </ListSubheader>
          <ListItem style={{ paddingTop: 0 }}>
            You can click the bag to draw a fate <Bag />
          </ListItem>
          <ListItem style={{ display: "inline-block" }}>
            Drag and drop fates{" "}
            {/* <Inline>
              <Fate num={3} />
            </Inline>{" "} */}
            onto playable cards or the bag. Right-click (long press) to reveal
            it to the other players.
          </ListItem>
          <ListItem>
            Click on a card to view it full screen or right-click (long press)
            it to perform an action
            {/* <CardImg src={sampleCard.cardPath} /> */}
          </ListItem>
          <List dense style={{ marginLeft: 16, marginTop: -16 }}>
            <ListItem>
              <ArrowRight />
              <Box>
                Cards outlined in <Blue>blue</Blue> mean a fate can be played
                there while dragging a fate
              </Box>
            </ListItem>
            <ListItem>
              <ArrowRight />
              <Box>
                Cards outlined in <Yellow>yellow</Yellow> mean the card may fade
                this turn
              </Box>
            </ListItem>
            <ListItem>
              <ArrowRight />
              <Box>
                Cards outlined in <Red>red</Red> mean the card will fade this
                turn
              </Box>
            </ListItem>
          </List>
          <ListItem style={{ display: "inline-block" }}>
            Click a token{" "}
            {/* <Inline>
              <Token num={4} color="blue" />
            </Inline>{" "} */}
            to flip it over
          </ListItem>
          <ListItem dense>
            <ShareLink gameId={gameId} />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

const Bag = () => (
  <img src={`pieces/bag.png`} style={{ height: 50 }} alt="draw-bag" />
);

const CardImg = styled("img")({
  boxSizing: "border-box",
  height: "70px",
  marginLeft: 8,
});

const Inline = styled(Box)({
  display: "inline-block",
  verticalAlign: "middle",
  "&& *": {
    cursor: "default",
  },
});

const ColoredText = styled("span")({
  fontWeight: "bold",
});
const Blue = styled(ColoredText)({ color: "lightskyblue" });
const Red = styled(ColoredText)({ color: "#cd3133" });
const Yellow = styled(ColoredText)({ color: "#ab9f00" });
