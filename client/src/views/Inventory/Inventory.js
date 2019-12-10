import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
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

const all_products_table = () => {
    const table_header = ['Product ID', 'Name', 'Quantity (sales)', 'Base Price']
    const table_rows = [
        { product_id: 'PRODUCT_ID1', name: 'Product 1', quantity: 100, base_price: '80' },
        { product_id: 'PRODUCT_ID2', name: 'Product 2', quantity: 90, base_price: '100' },
        { product_id: 'PRODUCT_ID3', name: 'Product 3', quantity: 50, base_price: '20' },
        { product_id: 'PRODUCT_ID4', name: 'Product 4', quantity: 20, base_price: '10' },
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
                        <TableCell>{product.base_price}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

const Inventory = () => {
    const classes = useStyles();
    return (
        <Grid className={classes.grid} container spacing={2}>
            <Grid item md={6} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Assets in Stock</Typography>
                    10 000€
                </Paper>
            </Grid>
            <Grid item md={6} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Monthly Sales</Typography>
                    5 days
                </Paper>
            </Grid>
            <Grid item sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Products</Typography>
                    {all_products_table()}
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Inventory;