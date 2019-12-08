import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
//import DateRangePicker from "material-date-range-picker";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Calendar from "@material-ui/icons/CalendarToday";
// core components
import Button from "components/CustomButtons/Button.js";

import TextField from "@material-ui/core/TextField";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  const [openProfile, setOpenProfile] = React.useState(null);

  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };

  return (
    <div>
      <TextField
        id="date_from"
        label="From"
        type="date"
        defaultValue="2017-05-24"
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        id="date_to"
        label="To"
        type="date"
        defaultValue="2017-06-30"
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
      />

      <Button
        color={window.innerWidth > 959 ? "transparent" : "white"}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-owns={openProfile ? "profile-menu-list-grow" : null}
        aria-haspopup="true"
        onClick={handleClickProfile}
        className={classes.buttonLink}
      >
        <Person className={classes.icons} />
        <Hidden mdUp implementation="css">
          <p className={classes.linkText}>Profile</p>
        </Hidden>
      </Button>
    </div>
  );
}
