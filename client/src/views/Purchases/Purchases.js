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

import { euroCurrency, nFormatter, formatDate } from '../../utils';

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
  },
  card: {
    height: '100%'
  }
}));

const SuppliersTable = (props) => {
  const {suppliers} = props;
  const table_header = ['Name', 'Total Expenses']

  return (
    <Table>
      <TableHead>
        <TableRow>
          {table_header.map(header => <TableCell>{header}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {suppliers.map(supplier => (
          <TableRow key={supplier.id}>
            <TableCell>{supplier.name}</TableCell>
            <TableCell>{euroCurrency(supplier.totalExpenses)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const ExpensesLineGraph = (props) => {
  const {monthly_expenses} = props;
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
      {
        className: 'series-expenses',
        data: monthly_expenses
      },
    ]
  }

  const options = {
    height: 400,
    axisY: {
      labelInterpolationFnc: (label) => nFormatter(label, 3)
    }
  }

  return <ChartistGraph type='Line' data={data} options={options}></ChartistGraph>
}

const PendentBillsTable = (props) => {
  const { pendent_bills } = props;
  const table_header = ['Order ID', 'Supplier', 'Debt', 'Due Date']

  return (
    <Table>
      <TableHead>
        <TableRow>
          {table_header.map(header => <TableCell>{header}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {pendent_bills.map(bill => (
          <TableRow key={bill.orderId}>
            <TableCell>{bill.orderId}</TableCell>
            <TableCell>{bill.supplier}</TableCell>
            <TableCell>{euroCurrency(bill.amount)}</TableCell>
            <TableCell>{formatDate(bill.dueDate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const PendentOrdersDeliveryTable = (props) => {
  const { pendent_orders } = props;
  const table_header = ['Order ID', 'Item', 'Description', 'Delivery Date']

  return (
    <Table>
      <TableHead>
        <TableRow>
          {table_header.map(header => <TableCell>{header}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {pendent_orders.map(order => (
          <TableRow key={order.sourceDocKey}>
            <TableCell>{order.sourceDocKey}</TableCell>
            <TableCell>{order.item}</TableCell>
            <TableCell>{order.itemDescription}</TableCell>
            <TableCell>{formatDate(order.deliveryDate)}</TableCell>
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
  const [expenses, set_expenses] = useState({data: []});
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
      <Grid item md={3} sm={12}>
        <Paper className={classes.card}>
          <Typography variant='h5' className={classes.graphs_title}>Suppliers</Typography>
          <SuppliersTable suppliers={suppliers} />
        </Paper>
      </Grid>
      <Grid item md={9} sm={12}>
        <Paper>
          <Typography variant='h5' className={classes.graphs_title}>Monthly Expenses</Typography>
          <ExpensesLineGraph monthly_expenses={expenses.data} />
        </Paper>
      </Grid>
      <Grid item md={6} sm={12}>
        <Paper className={classes.card}>
          <Typography variant='h5' className={classes.graphs_title}>Pendent Bills</Typography>
          <PendentBillsTable pendent_bills={pendent_bills} />
        </Paper>
      </Grid>
      <Grid item md={6} sm={12}>
        <Paper className={classes.card}>
          <Typography variant='h5' className={classes.graphs_title}>Pendent Orders Delivery</Typography>
          <PendentOrdersDeliveryTable pendent_orders={pendent_orders} />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Purchases;
