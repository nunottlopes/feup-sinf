import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ChartistGraph from 'react-chartist';
import { Typography } from "@material-ui/core";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core/';

import { ReactComponent as Logo } from 'assets/img/apple-icon.png';


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

const suppliers_table = () => {
    const table_header = ['Name', 'Contact', 'Total Expenses']
    const table_rows = [
        { name: 'Webber Group', contact: 'info@webber.com', total_expenses: 22 },
        { name: 'Lynch', contact: 'info@lynch.com', total_expenses: 13 },
        { name: 'Jacobs LLC', contact: 'info@jacobs.com', total_expenses: 5 }
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
                    <TableRow key={product.name}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.contact}</TableCell>
                        <TableCell>{product.total_expenses}k €</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

const purchases_graph = () => {
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

const pendent_bills_table = () => {
    const table_header = ['Supplier', 'Debt', 'Due Date']
    const table_rows = [
        { supplier: 'Webber Group', debt: 1230, due_date: '10/11/2019' },
        { supplier: 'Webber Group', debt: 492, due_date: '20/11/2019' },
        { supplier: 'Webber Group', debt: 180, due_date: '21/11/2019' },
        { supplier: 'Webber Group', debt: 5027, due_date: '05/12/2019' }
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
                    <TableRow key={product.supplier}>
                        <TableCell>{product.supplier}</TableCell>
                        <TableCell>{product.debt} €</TableCell>
                        <TableCell>{product.due_date}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

const orders_delivery_table = () => {
    const table_header = ['Order ID', 'Delivery Date']
    const table_rows = [
        { order_id: 'ECF.2019.6', delivery_date: '25/11/2019' },
        { order_id: 'ECF.2019.7', delivery_date: '04/12/2019' },
        { order_id: 'ECF.2019.10', delivery_date: '13/12/2019' }
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
                    <TableRow key={product.order_ide}>
                        <TableCell>{product.order_id}</TableCell>
                        <TableCell>{product.delivery_date}</TableCell>
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
                    <Typography variant='h5' className={classes.graphs_title}>Suppliers</Typography>
                    {suppliers_table()}
                </Paper>
            </Grid>
            <Grid item md={6} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Purchases</Typography>
                    {purchases_graph()}
                </Paper>
            </Grid>
            <Grid item md={6} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Pendent Bills</Typography>
                    {pendent_bills_table()}
                </Paper>
            </Grid>
            <Grid item md={6} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Orders Delivery</Typography>
                    {orders_delivery_table()}
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Purchases;