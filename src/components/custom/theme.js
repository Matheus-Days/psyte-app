import { createMuiTheme } from "@material-ui/core/styles";
import raleway from "../scripts/ralewayFont.js";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Raleway, Arial",
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [raleway],
      },
    },
  },
  palette: {
    background: {
      default: "#1a1e45",
    },
    primary: {
      main: "#424772",
    },
  },
});

export default theme;
