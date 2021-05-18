import { Grid, styled } from "@material-ui/core";

export const Background = styled(Grid)({
  minHeight: "100vh",
  width: "100%",
  height: "100%",
  minWidth: "100vw",
  backgroundImage: `url('background-path.svg')`,
});

if (Background.defaultProps) {
  Background.defaultProps.className = "fullHeight";
}
