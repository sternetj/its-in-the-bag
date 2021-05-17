import { Grid, styled } from "@material-ui/core";

export const Background = styled(Grid)({
  width: "100%",
  height: "100%",
  minHeight: "100vh",
  minWidth: "100vw",
  backgroundImage: `url('background-path.svg')`,
});
