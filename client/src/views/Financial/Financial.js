import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ChartistGraph from 'react-chartist';
import { Typography } from "@material-ui/core";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core/';
import {formatCurrency} from '../../utils';
require('chartist-plugin-legend');

const axios = require('axios');

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 0
  },
  grid: {
    width: "unset",
    margin: 0
  },
  graphs_title: {
    fontWeight: "lighter",
    marginBottom: "1rem"
  }
}));

const reducer_debit = (acc_1, product) => acc_1 + product.debit;
const reducer_credit = (acc_2, product) => acc_2 + product.credit;


const Balance = () => {

    const table_header = ['Account', 'Name', 'Credit - Debit']  

  // styling classes
  const classes = useStyles();
  // constant for the overview API endpoint
  const api_endpoint_base = 'http://localhost:3001/api/financial';
  // hooks for data/state
  const [balance, set_balance] = useState([]);
  

 // Perform all API calls for this page
 useEffect(() => {

    // Get the balance sheet
    axios.get(`${api_endpoint_base}/balance`)
      .then(function (response) {
        set_balance(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      }, [])

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {table_header.map(header => <TableCell>{header}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {balance.map(product => (
                    <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{formatCurrency(product.value)}</TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell> - </TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell> {balance.length == 0 ?"": balance.map(product => {return product.value}).reduce((n1,n2) => n1+n2)} €</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

const Revenue = () => {

  // styling classes
  const classes = useStyles();
  // constant for the overview API endpoint
  const api_endpoint_base = 'http://localhost:3001/api/financial';
  // hooks for data/state
  const [revenue, set_revenue] = useState([]);
  

 // Perform all API calls for this page
 useEffect(() => {

    // Get the balance sheet
    axios.get(`${api_endpoint_base}/revenue`)
      .then(function (response) {
        set_revenue(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      }, [])

      console.log(revenue)

      const data = {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        series:[
          {
            className: "revenue_from_sales",
            data: [0,0,0,0,0,0,0,0,0,0,0,0]
          },
          {
            className: "cost_of_goods_sold",
            data: [0,0,0,0,0,0,0,0,0,0,0,0]
          }
        ]}

    if(revenue.length == 0){
      return <ChartistGraph type="Line" data={data}></ChartistGraph>
    }

    data.series=  [
      {
        className: "revenue_from_sales",
        data: revenue.revenue.data
      },
      {
        className: "cost_of_goods_sold",
        data: revenue.cost.data
      }
    ]

    return (
      <ChartistGraph type="Line" data={data}></ChartistGraph>
    )
  
};

const Financial = () => {
    const classes = useStyles();
    const api_endpoint_base = 'http://localhost:3001/api/financial';

    const [ebit, set_ebit] = useState([]);
    const [ebitda, set_ebitda] = useState([]);

    useEffect(() => {

    // Get the ebit
    axios.get(`${api_endpoint_base}/ebit`)
        .then(function (response) {
        set_ebit(response.data);
        })
        .catch(function (error) {
        console.log(error);
        })

    // Get the ebitda
    axios.get(`${api_endpoint_base}/ebitda`)
        .then(function (response) {
        set_ebitda(response.data);
        })
        .catch(function (error) {
        console.log(error);
        })

    },[])

    return (
        <Grid className={classes.grid} container spacing={2}>


            <Grid item md={8} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Revenue from sales and cost of goods sold</Typography>
                    {Revenue()}
                </Paper>
            </Grid>
            <Grid item md={4} sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>EBIT</Typography>
                     {!isNaN(parseFloat(ebit.ebit)) ? formatCurrency(ebit.ebit) : " "}
                </Paper>
                <Paper className="financial_fix">
                    <Typography variant='h5' className={classes.graphs_title}>EBITDA</Typography>
                     {!isNaN(parseFloat(ebitda.ebitda)) ? formatCurrency(ebitda.ebitda) : " "}
                </Paper>
            </Grid>

            <Grid item sm={12}>
                <Paper>
                    <Typography variant='h5' className={classes.graphs_title}>Balance Sheet</Typography>
                    {Balance()}
                </Paper>
            </Grid>

    </Grid>
  );
};

export default Financial;
