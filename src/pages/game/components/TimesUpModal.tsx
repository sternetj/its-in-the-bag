import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  Typography,
} from "@material-ui/core";

interface Props {
  open: boolean;
  cardWasShown: boolean;
  cardText: string;
  onClose: (didCompleteCard: boolean) => void;
}

export const TimesUpModal = (props: Props) => {
  const { open, cardText, onClose, cardWasShown } = props;
  return (
    <Dialog open={open}>
      <DialogTitle>Times Up!</DialogTitle>
      {cardWasShown ? (
        <DialogContent style={{ textAlign: "center" }}>
          Did your team guess{" "}
          <Typography color="secondary" component="span">
            {cardText}
          </Typography>{" "}
          before time ran out?
        </DialogContent>
      ) : (
        <DialogContent style={{ textAlign: "center" }}>
          Your turn is over. End your turn now so the other team can play.
        </DialogContent>
      )}
      <DialogActions>
        {cardWasShown && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onClose(true)}>
            We Got It!
          </Button>
        )}
        <Button
          variant={cardWasShown ? "contained" : "outlined"}
          color={cardWasShown ? "primary" : "secondary"}
          onClick={() => onClose(false)}>
          {cardWasShown ? "No, End My Turn" : "Okay, End My Turn"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
