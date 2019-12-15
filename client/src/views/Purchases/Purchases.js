import React, {useState, useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ChartistGraph from 'react-chartist';
import { Typography } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core/";

const axios = require('axios');

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
  // constant for the overview API endpoint
  const api_endpoint_base = 'http://localhost:3001/api/purchases';
  // hooks for data/state
  // list of pendent orders, i.e. orders that weren't loaded in company inventory
  const [pendent_orders, set_pendent_orders] = useState([]);
  // total expenses in purchases
  const [expenses, set_expenses] = useState([]);
  // pendent bills, i.e., orders that weren't paid yet
  const [pendent_bills, set_pendent_bills] = useState([]);
  // list of suppliers
  const [suppliers, set_suppliers] = useState([]);
  // Perform all API calls for this page
  useEffect(() => {
    // Get the pendent orders
    axios.get(`${api_endpoint_base}/orders-to-receive`)
      .then(function (response) {
        set_pendent_orders(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })

    // Get the expenses orders
    axios.get(`${api_endpoint_base}/expenses`)
      .then(function (response) {
        set_expenses(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })

    // Get the pendent bills
    axios.get(`${api_endpoint_base}/pendent-bills`)
      .then(function (response) {
        set_pendent_bills(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
    
    // Get the list of suppliers
    axios.get(`${api_endpoint_base}/suppliers`)
      .then(function (response) {
        set_suppliers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  }, [])
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
