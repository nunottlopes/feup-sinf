import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Sidebar from "components/Sidebar/Sidebar.js";
import Navbar from "components/Navbars/AdminNavbarLinks.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import routes from "routes.js";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

let ps;

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/admin" to="/admin/overview" />
  </Switch>
);

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [parsing, setParsing] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"360º CompanyDashboard"}
        className={classes.sideBar}
        //logo={logo}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color="blue"
        {...rest}
      />

      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar setParsing={setParsing}></Navbar>
        {!parsing && <div className={classes.map}>{switchRoutes}</div>}
        {parsing && (
          <div className={classes.parsing}>
            <CircularProgress />
            <h3>Parsing information...</h3>
          </div>
        )}
      </div>
    </div>
  );
}
