import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ChartistGraph from 'react-chartist';
import { Typography } from "@material-ui/core";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 0,
    },
    grid: {
        width: 'unset',
        margin: 0
    },
    graphs_title: {
        fontWeight: 'lighter',
        marginBottom: '1rem',
    }
}));

const sales_per_store_graph = () => {
    const data = {
        labels: ['1', '2', '3'],
        series: [20, 15, 40]
    };

    const options = {
        labelInterpolationFnc: function (value) {
            return value[0]
        }
    }

    return <ChartistGraph type='Pie' data={data} options={options}></ChartistGraph>
}

const sales_per_region_graph = () => {
    const data = {
        labels: ['4', '5', '6'],
        series: [30, 15, 75]
    };

    const options = {
        labelInterpolationFnc: function (value) {
            return value[0]
        }
    }

    return <ChartistGraph type='Pie' data={data} options={options}></ChartistGraph>
}

const sold_vs_projected_graph = () => {

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            [5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
            [3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]
        ]
    };

    const options = {
        seriesBarDistance: 6,
        height: 300
    };

    return <ChartistGraph type='Bar' data={data} options={options}></ChartistGraph>
}

const sales_volume_graph = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            {
                className: 'series-expenses',
                data: [10, 20, 30, 40, 50, 20, 5, 70, 80, 50, 35, 40]
            },
        ]
    }

    const options = {
        height: 300
    }

    return <ChartistGraph type='Line' data={data} options={options}></ChartistGraph>
}

const cumulative_sales_graph = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            {
                className: 'series-expenses',
                data: [10, 15, 17, 35, 50, 51, 58, 60, 70, 75, 80, 82]
            },

        ]
    }

    const options = {
        height: 300
    }

    return <ChartistGraph type='Line' data={data} options={options}></ChartistGraph>
}




const top_products_table = () => {
    const table_header = ['Product ID', 'Name', 'Quantity']
    const table_rows = [
        { product_id: 'PRODUCT_ID1', name: 'Product 1', quantity: 100 },
        { product_id: 'PRODUCT_ID2', name: 'Product 2', quantity: 90 },
        { product_id: 'PRODUCT_ID3', name: 'Product 3', quantity: 50 },
        { product_id: 'PRODUCT_ID4', name: 'Product 4', quantity: 20 },
    ]

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {table_header.map(header => <TableCell>{header}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {table_rows.map(product => (
                    <TableRow key={product.product_id}>
                        <TableCell>{product.product_id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

const Sales = () => {
    const classes = useStyles();
    console.log(classes)
    return (
        <Grid className={classes.grid} container spacing={2}>
            <Grid item md={4} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Sales Per Store</Typography>
                    {sales_per_store_graph()}
                </Paper>
            </Grid>
            <Grid item md={4} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Sales Per Region</Typography>
                    {sales_per_region_graph()}
                </Paper>
            </Grid>
            <Grid item md={4} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Growth</Typography>
                    43%
                </Paper>
                <Paper className="financial_fix">
                    <Typography variant='h5' className={classes.graphs_title}>Profit</Typography>
                    € 7367
                </Paper>
            </Grid>
            <Grid item md={4} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Solded vs Projected</Typography>
                    {sold_vs_projected_graph()}
                </Paper>
            </Grid>
            <Grid item md={4} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Sales Volume</Typography>
                    {sales_volume_graph()}
                </Paper>
            </Grid>
            <Grid item md={4} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Cumulative Sales</Typography>
                    {cumulative_sales_graph()}
                </Paper>
            </Grid>
            <Grid item md={12} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Top products</Typography>
                    {top_products_table()}
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Sales;