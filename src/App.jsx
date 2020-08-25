import React from "react";
import { Route, Switch } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import moment from "moment";
import Particles from "react-particles-js";
import BetterPrivateRoute from "./components/custom/BetterPrivateRoute.jsx";
import Navbar from "./components/templates/Navbar.jsx";
import Main from "./components/templates/Main.jsx";
import Options from "./components/templates/Options.jsx";
import Home from "./components/pages/Home.jsx";
import About from "./components/pages/About.jsx";
import Schedule from "./components/pages/Schedule.jsx";
import VideoRoom from "./components/pages/VideoRoom.jsx";
import Contact from "./components/pages/Contact.jsx";
import ShouldSignin from "./components/pages/ShouldSignin.jsx";
import expireSession from "./components/scripts/expireSession.js";
import particleParams from "./components/scripts/particleParams.js";
import "moment/locale/pt-br";
import theme from "./components/custom/theme";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  particlesCanva: {
    position: "absolute",
    zIndex: -1,
  },
});

moment.locale("pt-br");

setInterval(expireSession, 5000);

export default () => {
  return (
    <Switch>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Particles
            canvasClassName={useStyles().particlesCanva}
            params={particleParams}
            style={{ zIndex: -1 }}
          />
          <Navbar />
          <Main>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/shouldsignin" component={ShouldSignin} />
            <BetterPrivateRoute exact path="/options">
              <Options />
            </BetterPrivateRoute>
            <BetterPrivateRoute exact path="/scheduler">
              <Schedule />
            </BetterPrivateRoute>
            <BetterPrivateRoute exact path="/videoroom">
              <VideoRoom />
            </BetterPrivateRoute>
          </Main>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </Switch>
  );
};
