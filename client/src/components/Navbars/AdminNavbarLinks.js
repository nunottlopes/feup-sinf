import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import AccountCircle from "@material-ui/icons/AccountCircle";
import IconButton from "@material-ui/core/IconButton";
import Sync from "@material-ui/icons/Sync";
// core components
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import TextField from "@material-ui/core/TextField";
import Cookies from "js-cookie";
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const axios = require("axios");
const useStyles = makeStyles(styles);

export default function AdminNavbarLinks(props) {
  const { setParsing, setStartDate, setEndDate } = props;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    setAnchorEl(null);
    Cookies.remove("__session");
    window.location.href = "/login";
    console.log("LOGOUT");
  };

  const handleParse = () => {
    setParsing(true);
    axios
      .get(`http://localhost:3001/api/parse/saft`, { withCredentials: true })
      .then(function(response) {
        setParsing(false);
      })
      .catch(function(error) {
        setParsing(false);
      });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.exp}>
          <Typography variant="body1" className={classes.title}>
            From
          </Typography>
          <TextField
            id="date_from"
            type="date"
            onChange={event => setStartDate(event.target.value)}
            className={classes.dateContent}
            InputLabelProps={{
              shrink: true
            }}
          />
          <Typography variant="body1" className={classes.title}>
            To
          </Typography>
          <TextField
            id="date_to"
            type="date"
            onChange={event => setEndDate(event.target.value)}
            className={classes.dateContent}
            InputLabelProps={{
              shrink: true
            }}
          />
          <div>
            <IconButton
              aria-label="parse information"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              className={classes.parse}
              onClick={handleParse}
              color="inherit"
            >
              <Sync />
            </IconButton>
          </div>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              className={classes.count}
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogOut}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
