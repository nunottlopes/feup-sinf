/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createMuiTheme } from '@material-ui/core/styles';
// core components
import Admin from "layouts/Admin.js";
import { Login } from "views";
import "assets/css/material-dashboard-react.css?v=1.8.0";
import { ThemeProvider } from "@material-ui/styles";

const hist = createBrowserHistory();

const theme = createMuiTheme({
  palette: {
    primary: { main: '#00ACC1' },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Router history={hist}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/admin" component={Admin} />
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </Router>
  </ThemeProvider>,
  document.getElementById("root")
);
