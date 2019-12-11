import React, { Fragment } from 'react';
import clsx from 'clsx';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';
import styles from "assets/jss/material-dashboard-react/components/buttonStyle.js";
const useStyleBase = makeStyles(styles)

const useStyles = makeStyles(theme => ({
    companyName: {
        margin: '50px 0'
    },
    inputFields: {
        width: '100%',
        margin: '10px 0',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        maxWidth: '450px',
        height: '400px',
        padding: '3rem 2rem'
    },
    cardContent: {
        flexGrow: 1
    },
}));

const Login = () => {
    const classes = useStyles();
    const buttonClasses = useStyleBase();
    const buttonLogin = clsx(buttonClasses.button, buttonClasses.info)
    return (
        <Fragment>
            <Typography className={classes.companyName} variant="h2" align="center">360º Company</Typography>
            <Card className={classes.card}>
                <CardHeader title="Sign In" />
                <CardContent className={classes.cardContent}>
                    <TextField className={classes.inputFields} id="email-input" label="E-mail" />
                    <TextField className={classes.inputFields} id="password-input" label="Password" type="password" />
                </CardContent>
                <CardActions>
                    <Button className={buttonLogin} variant="contained">
                        Login
                    </Button>
                </CardActions>
            </Card>
        </Fragment>
    )
}

export default Login;