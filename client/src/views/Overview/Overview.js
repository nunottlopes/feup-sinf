import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ChartistGraph from 'react-chartist';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 0,
    },
    grid: {
        width: 'unset',
        margin: 0
    }
}));

const global_finances_graph = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            {
                className: 'series-expenses',
                data: [10, 20, 30, 40, 50, 20, 5, 70, 80, 50, 35]
            },
            {
                className: 'series-income',
                data: [5, 20, 10, 5, 3, 30, 25, 30, 40, 64, 80]
            },
        ]
    }

    const options = {
        height: 400
    }

    return <ChartistGraph type='Line' data={data} options={options}></ChartistGraph>
}

const montly_sales_graph = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            {
                className: 'series-expenses',
                data: [10, 20, 30, 40, 50, 20, 5, 70, 80, 50, 35]
            },
            {
                className: 'series-income',
                data: [5, 20, 10, 5, 3, 30, 25, 30, 40, 64, 80]
            },
        ]
    }

    const options = {
        height: 400
    }

    return <ChartistGraph type='Bar' data={data} options={options}></ChartistGraph>
}

const Overview = () => {
    const classes = useStyles();
    return (
            <Grid className={classes.grid} container spacing={2}>
            <Grid item md={6} sm={12}>
                <Paper>{global_finances_graph()}</Paper>
            </Grid>
            <Grid item md={6} sm={12}>
                <Paper>{montly_sales_graph()}</Paper>
            </Grid>
            <Grid item md={4} sm={12}>
                <Paper>1</Paper>
            </Grid>
            <Grid item md={4} sm={12}>
                <Paper>1</Paper>
            </Grid>
            <Grid item md={4} sm={12}>
                <Paper>1</Paper>
            </Grid>
        </Grid>
    )
}

export default Overview;