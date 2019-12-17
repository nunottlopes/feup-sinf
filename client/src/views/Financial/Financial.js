import { Typography } from "@material-ui/core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core/";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
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
import { formatCurrency, formatNumber } from "../../utils";

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
  }
}));

const Balance = () => {
  const table_header = ["Account", "Name", "Credit - Debit"];
  // constant for the overview API endpoint
  const api_endpoint_base = "http://localhost:3001/api/financial";
  // hooks for data/state
  const [balance, set_balance] = useState([]);

  // Perform all API calls for this page
  useEffect(() => {
    // Get the balance sheet
    axios
      .get(`${api_endpoint_base}/balance`, { withCredentials: true })
      .then(function(response) {
        set_balance(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          {table_header.map((header, index) => (
            <TableCell key={`${header}_${index}`}>{header}</TableCell>
          ))}
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
        <TableRow selected>
          <TableCell> - </TableCell>
          <TableCell>Total</TableCell>
          <TableCell>
            {" "}
            {balance.length === 0
              ? ""
              : formatCurrency(
                  balance
                    .map(product => {
                      return product.value;
                    })
                    .reduce((n1, n2) => n1 + n2)
                )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const Revenue = () => {
  // constant for the overview API endpoint
  const api_endpoint_base = "http://localhost:3001/api/financial";
  // hooks for data/state
  const [revenue, set_revenue] = useState([]);

  // Perform the API call
  useEffect(() => {
    // Get the balance sheet
    axios
      .get(`${api_endpoint_base}/revenue`, { withCredentials: true })
      .then(function(response) {
        const { revenue, cost } = response.data;
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
        set_revenue(
          months.map((month, index) => ({
            month: month,
            revenue: revenue.data[index],
            cost: cost.data[index]
          }))
        );
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={revenue}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={value => formatNumber(value)} />
        <Tooltip formatter={value => formatCurrency(value)} />
        <Legend />
        <Line type="monotone" dataKey="cost" stroke="red" strokeWidth={2} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="green"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Financial = () => {
  const classes = useStyles();
  const api_endpoint_base = "http://localhost:3001/api/financial";

  const [ebit, set_ebit] = useState([]);
  const [ebitda, set_ebitda] = useState([]);

  useEffect(() => {
    // Get the ebit
    axios
      .get(`${api_endpoint_base}/ebit`, { withCredentials: true })
      .then(function(response) {
        set_ebit(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    // Get the ebitda
    axios
      .get(`${api_endpoint_base}/ebitda`, { withCredentials: true })
      .then(function(response) {
        set_ebitda(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

  return (
    <Grid className={classes.grid} container spacing={2}>
      <Grid item md={8} sm={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Revenue from sales and cost of goods sold
          </Typography>
          {Revenue()}
        </Paper>
      </Grid>
      <Grid item md={4} sm={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            EBIT
          </Typography>
          {!isNaN(parseFloat(ebit.ebit)) ? formatCurrency(ebit.ebit) : " "}
        </Paper>
        <Paper className="financial_fix">
          <Typography variant="h5" className={classes.graphs_title}>
            EBITDA
          </Typography>
          {!isNaN(parseFloat(ebitda.ebitda))
            ? formatCurrency(ebitda.ebitda)
            : " "}
        </Paper>
      </Grid>

      <Grid item sm={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Balance Sheet
          </Typography>
          {Balance()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Financial;
