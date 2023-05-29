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
  onConfirm: Function;
  onCancel: Function;
  prompt: string;
  title?: string;
}

export const ConfirmDialog = (props: Props) => {
  const { prompt, open, onCancel, onConfirm, title } = props;
  return (
    <Dialog open={open}>
      {title && (
        <DialogTitle>
          <Typography variant="inherit" color="secondary">
            {title}
          </Typography>
        </DialogTitle>
      )}
      <DialogContent
        style={{
          padding: 24,
          textAlign: "center",
          paddingTop: title ? 0 : 24,
        }}>
        {prompt}
      </DialogContent>
      <DialogActions style={{ paddingLeft: 24, paddingRight: 24 }}>
        <Button variant="outlined" color="inherit" onClick={() => onCancel()}>
          No
        </Button>
        <Button
          variant="contained"
          color="secondary"
          autoFocus
          onClick={() => onConfirm()}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
