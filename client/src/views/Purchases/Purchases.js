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

const top_clients_table = () => {
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

const Purchases = () => {
    const classes = useStyles();
    console.log(classes)
    return (
        <Grid className={classes.grid} container spacing={2}>
            <Grid item md={6} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>MacBook Pro</Typography>
                    Description
                </Paper>
            </Grid>
            <Grid item md={6} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Growth</Typography>
                    43%
                </Paper>
            </Grid>
            <Grid item md={6} sm={12}>
                <Paper className="financial_fix">
                    <Typography variant='h5' className={classes.graphs_title}>Units in Stock</Typography>
                    536
                </Paper>
            </Grid>
            <Grid item md={6} sm={12}>
                <Paper className="financial_fix">
                    <Typography variant='h5' className={classes.graphs_title}>Unist Sold</Typography>
                    10k
                </Paper>
            </Grid>


            <Grid item md={12} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Top products</Typography>
                    {top_clients_table()}
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Purchases;