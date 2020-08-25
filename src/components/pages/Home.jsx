import React from "react";
import { Typography, Grid, Box } from "@material-ui/core";
import avatar from "../../assets/img/profile.jpg";
import Typed from "react-typed";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: theme.spacing(1),
    border: "solid 2px #DDD",
    borderRadius: "50%",
  },
  title: {
    color: "#DDD",
  },
  subtitle: {
    color: "#DDD",
    marginBottom: "3rem",
  },
  typedContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100vw",
    textAlign: "center",
    zIndex: 1,
  },
}));

export default (props) => {
  const classes = useStyles();
  return (
    <Box className={classes.typedContainer}>
      <div id="ready"></div>
      <Grid container justify="center">
        <img className={classes.avatar} src={avatar} alt="Matheus Braga" />
      </Grid>
      <Typography className={classes.title} variant="h4">
        <Typed strings={["Matheus Braga"]} typeSpeed={40} />
      </Typography>
      <Typography variant="h6" className={classes.title}>
        <Typed strings={["CRP-11/15137"]} startDelay={1000} typeSpeed={40} />
      </Typography>
      <Typography className={classes.subtitle} variant="h5">
        <Typed
          strings={["Psicólogo", "Analista Junguiano"]}
          startDelay={2000}
          typeSpeed={40}
          backSpeed={60}
          backDelay={2000}
          loop
        />
      </Typography>
    </Box>
  );
};
