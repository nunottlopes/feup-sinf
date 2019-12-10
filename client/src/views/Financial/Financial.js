import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ChartistGraph from 'react-chartist';
import { Typography } from "@material-ui/core";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core/';
require('chartist-plugin-legend');


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

const reducer_debit = (acc_1, product) => acc_1 + product.debit;
const reducer_credit = (acc_2, product) => acc_2 + product.credit;

const balance_sheet_table = () => {
    const table_header = ['Account', 'Description', 'Debit', 'Credit']
    const table_rows = [
        { account: '1', description: 'Depósitos à ordem', debit: 0.00, credit: 1500 },
        { account: '2', description: 'Dividas de clientes', debit: 250, credit: 0 },
        { account: '3', description: 'Vendas', debit: 0, credit: 4000 },
        { account: '4', description: 'Prestação de serviços', debit: 0, credit: 5000 },
        { account: '5', description: 'Compras', debit: 2000, credit: 0 },
        { account: '6', description: 'Caixa', debit: 240, credit: 0 },
        { account: '7', description: 'Contas a pagar ao estado', debit: 0, credit: 500 },
        { account: '8', description: 'Trabalhos em curso', debit: 200, credit: 0 },
        { account: '9', description: 'Serviços Externos', debit: 500, credit: 0 },
    ]

    const total_debit = table_rows.reduce(reducer_debit, 0)
    const total_credit = table_rows.reduce(reducer_credit, 0)

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {table_header.map(header => <TableCell>{header}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {table_rows.map(product => (
                    <TableRow key={product.account}>
                        <TableCell>{product.account}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.debit} €</TableCell>
                        <TableCell>{product.credit} €</TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell> - </TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell> {total_debit} €</TableCell>
                    <TableCell> {total_credit} €</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

const revenue_from_sales_graph = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
            {
                className: 'revenue_from_sales',
                data: [0, 20, 30, 40, 50, 20, 5, 70, 80, 50, 35, 50]
            },
            {
                className: 'cost_of_goods_sold',
                data: [0, 20, 10, 5, 3, 30, 25, 30, 40, 64, 80, 75]
            },
        ],

    }

    return <ChartistGraph type='Line' data={data} ></ChartistGraph>
}

const Financial = () => {
    const classes = useStyles();
    console.log(classes)
    return (
        <Grid className={classes.grid} container spacing={2}>
            <Grid item sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Balance Sheet</Typography>
                    {balance_sheet_table()}
                </Paper>
            </Grid>


            <Grid item md={8} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Revenue from sales and cost of goods sold</Typography>
                    {revenue_from_sales_graph()}
                </Paper>
            </Grid>
            <Grid item md={4} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>EBIT</Typography>
                    € 25,078.00
                </Paper>
                <Paper className="financial_fix">
                    <Typography variant='h5' className={classes.graphs_title}>EBITDA</Typography>
                    € 25,078.00
                </Paper>
            </Grid>

        </Grid>
    )
}

export default Financial;