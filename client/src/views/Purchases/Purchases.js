import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core/";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { formatCurrency, formatNumber, formatDate } from "../../utils";

const axios = require("axios");

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
  },
  card: {
    height: "100%"
  }
}));

const SuppliersTable = props => {
  const { suppliers } = props;
  const table_header = ["Name", "Total Expenses"];

  return (
    <Table>
      <TableHead>
        <TableRow>
          {table_header.map(header => (
            <TableCell key={header}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {suppliers.map(supplier => (
          <TableRow key={supplier.id}>
            <TableCell>{supplier.name}</TableCell>
            <TableCell>{formatCurrency(supplier.totalExpenses)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ExpensesLineGraph = props => {
  const { monthly_expenses } = props;
  const months = [
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
  ];
  const data = months.map((value, index) => ({
    month: value,
    expense: monthly_expenses[index]
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={value => formatNumber(value)} />
        <Tooltip formatter={value => formatCurrency(value)} />
        <Legend />
        <Line type="monotone" dataKey="expense" stroke="red" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const PendentBillsTable = props => {
  const { pendent_bills } = props;
  const table_header = ["Order ID", "Supplier", "Debt", "Due Date"];

  return (
    <Table>
      <TableHead>
        <TableRow>
          {table_header.map(header => (
            <TableCell key={header}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {pendent_bills.map(bill => (
          <TableRow key={bill.orderId}>
            <TableCell>{bill.orderId}</TableCell>
            <TableCell>{bill.supplier}</TableCell>
            <TableCell>{formatCurrency(bill.amount)}</TableCell>
            <TableCell>{formatDate(bill.dueDate)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const PendentOrdersDeliveryTable = props => {
  const { pendent_orders } = props;
  const table_header = ["Order ID", "Item", "Description", "Delivery Date"];

  return (
    <Table>
      <TableHead>
        <TableRow>
          {table_header.map(header => (
            <TableCell key={header}>{header}</TableCell>
          ))}
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
  );
};

const Purchases = () => {
  const classes = useStyles();
  // constant for the overview API endpoint
  const api_endpoint_base = "http://localhost:3001/api/purchases";
  // hooks for data/state
  // list of pendent orders, i.e. orders that weren't loaded in company inventory
  const [pendent_orders, set_pendent_orders] = useState([]);
  // total expenses in purchases
  const [expenses, set_expenses] = useState({ data: [] });
  // pendent bills, i.e., orders that weren't paid yet
  const [pendent_bills, set_pendent_bills] = useState([]);
  // list of suppliers
  const [suppliers, set_suppliers] = useState([]);
  // Perform all API calls for this page
  useEffect(() => {
    // Get the pendent orders
    axios
      .get(`${api_endpoint_base}/orders-to-receive`, { withCredentials: true })
      .then(function(response) {
        set_pendent_orders(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    // Get the expenses orders
    axios
      .get(`${api_endpoint_base}/expenses`, { withCredentials: true })
      .then(function(response) {
        set_expenses(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    // Get the pendent bills
    axios
      .get(`${api_endpoint_base}/pendent-bills`, { withCredentials: true })
      .then(function(response) {
        set_pendent_bills(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    // Get the list of suppliers
    axios
      .get(`${api_endpoint_base}/suppliers`, { withCredentials: true })
      .then(function(response) {
        set_suppliers(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);
  return (
    <Grid className={classes.grid} container spacing={2}>
      <Grid item md={3} sm={12}>
        <Paper className={classes.card}>
          <Typography variant="h5" className={classes.graphs_title}>
            Suppliers
          </Typography>
          <SuppliersTable suppliers={suppliers} />
        </Paper>
      </Grid>
      <Grid item md={9} sm={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Monthly Expenses
          </Typography>
          <ExpensesLineGraph monthly_expenses={expenses.data} />
        </Paper>
      </Grid>
      <Grid item md={6} sm={12}>
        <Paper className={classes.card}>
          <Typography variant="h5" className={classes.graphs_title}>
            Pendent Bills
          </Typography>
          <PendentBillsTable pendent_bills={pendent_bills} />
        </Paper>
      </Grid>
      <Grid item md={6} sm={12}>
        <Paper className={classes.card}>
          <Typography variant="h5" className={classes.graphs_title}>
            Pendent Orders Delivery
          </Typography>
          <PendentOrdersDeliveryTable pendent_orders={pendent_orders} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Purchases;
