import React, { FC, useRef, useState } from "react";
import FilterNone from "@material-ui/icons/FilterNone";
import {
  styled,
  FilledInput,
  Grid,
  Typography,
  GridProps,
  Popper,
  Fade,
} from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";
import ReactGA from "react-ga";
import { isMobile as checkIsMobile } from "is-mobile";

const isMobile = checkIsMobile();

interface Props {
  gameId: string;
  style?: GridProps["style"];
}

export const ShareLink: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const copyInput = useRef<HTMLInputElement>();
  const { gameId, style } = props;

  const link = `${window.location.origin}/join?name=${gameId}`;

  return (
    <Grid container justify="center" style={style}>
      <Typography variant="caption">
        Invite your friends by clicking this link and sharing it with them
      </Typography>
      <Input
        value={link}
        readOnly
        fullWidth
        color="secondary"
        inputRef={copyInput}
        onClick={() => {
          ReactGA.event({
            category: "share-link",
            action: "click",
            label: window.location.pathname,
          });

          if (navigator.share && isMobile) {
            navigator.share({
              title: `Join a Game of It's in the Bag!`,
              text: "Join a Game of It's in the Bag! – Your friends are waiting, tap the link to start playing!",
              url: link,
            });
          } else {
            setOpen(true);
            const start = copyInput.current?.selectionStart || 0;
            const end = copyInput.current?.selectionEnd || 0;
            copyInput.current?.select();
            document.execCommand("copy");
            copyInput.current?.setSelectionRange(start, end);
            setTimeout(() => setOpen(false), 1250);
          }
        }}
        endAdornment={<FilterNone />}
      />
      <Popper
        open={open}
        anchorEl={copyInput.current?.parentElement}
        style={{ zIndex: zIndex.modal }}
        placement="top"
        transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Notification color="secondary">You copied the link!</Notification>
          </Fade>
        )}
      </Popper>
    </Grid>
  );
};

const Input = styled(FilledInput)({
  "&&& *": {
    cursor: "pointer",
  },
});

const Notification = styled(Typography)({
  marginLeft: 8,
  padding: "1rem",
  backgroundColor: "rgba(0,0,0,0.85)",
});
