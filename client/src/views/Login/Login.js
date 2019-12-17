import React, { Fragment, useState } from "react";
import clsx from "clsx";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Cookies from "js-cookie";
import CircularProgress from "@material-ui/core/CircularProgress";

import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/components/buttonStyle.js";
const useStyleBase = makeStyles(styles);
const axios = require("axios");

const useStyles = makeStyles(theme => ({
  companyName: {
    margin: "50px 0"
  },
  inputFields: {
    width: "100%",
    margin: "10px 0"
  },
  card: {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    maxWidth: "450px",
    height: "400px",
    padding: "3rem 2rem"
  },
  cardContent: {
    flexGrow: 1
  }
}));

const Login = () => {
  const classes = useStyles();
  const buttonClasses = useStyleBase();
  const buttonLogin = clsx(buttonClasses.button, buttonClasses.info);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginAction = () => {
    setIsLoading(true);
    axios
      .post(`http://localhost:3001/api/auth/login`, {
        username: username,
        password: password
      })
      .then(function(response) {
        Cookies.set("__session", response.data.token, {
          expires: new Date(Date.now() + 3600 * 1000)
        });
        window.location.href = "/admin/overview";
      })
      .catch(function(error) {
        setIsLoading(false);
        window.alert("Invalid username and/or password");
      });
  };

  return (
    <Fragment>
      <Typography className={classes.companyName} variant="h2" align="center">
        360º Company
      </Typography>
      <Card className={classes.card}>
        <CardHeader title="Sign In" />
        <CardContent className={classes.cardContent}>
          <TextField
            className={classes.inputFields}
            id="username-input"
            label="Username"
            onChange={event => setUsername(event.target.value)}
          />
          <TextField
            className={classes.inputFields}
            id="password-input"
            label="Password"
            type="password"
            onChange={event => setPassword(event.target.value)}
          />
        </CardContent>
        <CardActions>
          {!isLoading && (
            <Button
              className={buttonLogin}
              variant="contained"
              onClick={() => loginAction()}
            >
              Login
            </Button>
          )}
          {isLoading && <CircularProgress />}
        </CardActions>
      </Card>
    </Fragment>
  );
};

export default Login;
