import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  ListItem,
  IconButton,
  ListItemText,
  List,
  Typography,
  Box,
  ListItemIcon,
} from "@material-ui/core";
import {
  Menu,
  AssignmentInd,
  Home,
  CalendarTodayTwoTone,
  ContactMail,
  VideoCall,
} from "@material-ui/icons";
import MobilRightMenuSlider from "@material-ui/core/Drawer";
import LoginDialog from "./LoginDialog.jsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  headerTitle: {
    color: "#DDD",
  },
  listItem: {
    color: "#DDD",
  },
  menuSliderContainer: {
    width: 200,
    background: "#1a1e45",
    height: "100%",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const menuItems = [
  {
    key: "home",
    listIcon: <Home />,
    listText: "Início",
    listPath: "/",
  },
  {
    key: "about",
    listIcon: <AssignmentInd />,
    listText: "Sobre",
    listPath: "/about",
  },
  {
    key: "contact",
    listIcon: <ContactMail />,
    listText: "Contato",
    listPath: "/contact",
  },
  {
    key: "calendar",
    listIcon: <CalendarTodayTwoTone />,
    listText: "Agendar Consulta",
    listPath: "/scheduler",
  },
  {
    key: "VideoRoom",
    listIcon: <VideoCall />,
    listText: "Atendimento Online",
    listPath: "/videoroom",
  },
];

const Navbar = () => {
  const [state, setState] = useState({
    right: false,
  });

  const togglerSlider = (slider, open) => () => {
    setState({ ...state, [slider]: open });
  };

  const classes = useStyles();

  const sideList = (slider) => (
    <Box
      className={classes.menuSliderContainer}
      component="div"
      onClick={togglerSlider(slider, false)}
    >
      <List>
        {menuItems.map((listItem, key) => (
          <ListItem
            button
            key={listItem.key}
            component={Link}
            to={listItem.listPath}
          >
            <ListItemIcon className={classes.listItem}>
              {listItem.listIcon}
            </ListItemIcon>
            <ListItemText
              primary={listItem.listText}
              className={classes.listItem}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" className={classes.nav}>
      <AppBar
        position="static"
        className={classes.appbar}
        style={{
          background: "#8888ff15",
        }}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton onClick={togglerSlider("right", true)}>
            <Menu style={{ color: "#DDD" }} />
            <Box ml={2}>
              <Typography variant="h5" className={classes.headerTitle}>
                Menu
              </Typography>
            </Box>
          </IconButton>
          <MobilRightMenuSlider
            open={state.right}
            anchor="left"
            onClose={togglerSlider("right", false)}
          >
            {sideList("right")}
          </MobilRightMenuSlider>
          <LoginDialog />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
