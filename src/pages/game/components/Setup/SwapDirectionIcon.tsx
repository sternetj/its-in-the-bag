import { useMediaQuery, useTheme } from "@material-ui/core";
import { SwapHoriz, SwapVert } from "@material-ui/icons";

export const SwapDirectionIcon = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile ? (
    <SwapVert color="inherit" />
  ) : (
    <SwapHoriz color="inherit" />
  );
};
