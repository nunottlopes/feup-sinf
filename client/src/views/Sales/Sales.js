import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency, formatNumber } from "../../utils";
import { MyPieChart } from "./../../components";
import TopClientsTable from "./TopClientsTable";
import TopProductsTable from "./TopProductsTable";



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

/**
 * Returns total net sales for each month
 * @param {Array} daily_sales The response from '/daily-volume' endpoint
 */
const __group_sales_by_month = daily_sales => {
  let grouped_sales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let m = 1; m <= 12; m++) {
    if (m in daily_sales) {
      let month_sales = daily_sales[m];
      for (const day of month_sales) {
        grouped_sales[m - 1] += day.NetTotal;
      }
    }
  }

  return grouped_sales;
};

/**
 * Linear graph that shows both net and gross sales by month
 * @param {*} props
 */
const SalesVolumes = props => {
  const { net_sales, gross_sales } = props;
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

  const data = months.map((month, index) => ({
    month: month,
    net_sales: net_sales[index],
    gross_sales: gross_sales[index]
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => formatNumber(value)} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Bar type="monotone" dataKey="net_sales" fill="red" />
        <Bar type="monotone" dataKey="gross_sales" fill="green" />
      </BarChart>
    </ResponsiveContainer>
  )
};

SalesVolumes.propTypes = {
  net_sales: PropTypes.arrayOf(PropTypes.number).isRequired,
  gross_sales: PropTypes.arrayOf(PropTypes.number).isRequired
};

/**
 * Linear graph showing cumulative gross sales by each month
 * @param {*} props
 */
const CumulativeSalesVolumes = props => {
  const { cumulative_gross_sales } = props;
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

  const data = months.map((month, index) => ({
    month: month,
    cumulative_gross_sale: cumulative_gross_sales[index]
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => formatNumber(value)} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Line type="monotone" dataKey="cumulative_gross_sale" stroke="red" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
};

CumulativeSalesVolumes.propTypes = {
  cumulative_gross_sales: PropTypes.arrayOf(PropTypes.number).isRequired
};

/**
 * Simple card to show numeric information such as total profits, total revenues, etc
 * @param {*} props
 */
const InformationCard = props => {
  const { title, value, classes } = props;

  return (
    <Paper>
      <Typography variant="h5" className={classes.graphs_title}>
        {title}
      </Typography>
      {value ? (
        <Typography variant="body1" className={classes.graphs_title}>
          {formatCurrency(value)}
        </Typography>
      ) : (
          <Skeleton variant="text" />
        )}
    </Paper>
  );
};

InformationCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  classes: PropTypes.object
};

const Sales = () => {
  const classes = useStyles();
  // constant for the overview API endpoint
  const api_endpoint_base = "http://localhost:3001/api/sales";
  // hooks for data/state
  // list of the top regions that purchase more products
  const [top_regions, set_top_regions] = useState([]);
  // list of most sold products
  const [top_products, set_top_products] = useState([]);
  // list of top clients
  const [top_clients, set_top_clients] = useState([]);
  // information about sales for every day of every month (net values)
  const [net_sales_volumes, set_net_sales_volumes] = useState([]);
  // gross sales for every month
  const [gross_sales_volumes, set_gross_sales_volumes] = useState([]);
  // cumulative gross sales over a year
  const [gross_cumulative_sales, set_gross_cumulative_sales] = useState([]);
  // total value of profit, revenues from sales, and production costs
  const [profits, set_profits] = useState({
    profit: undefined,
    revenueFromSales: undefined,
    costOfGoodsSold: undefined
  });
  // total net sales value
  const [total_net_sales, set_total_net_sales] = useState();
  // total gross sales value
  const [total_gross_sales, set_total_gross_sales] = useState();
  // Perform all API calls for this page
  useEffect(() => {
    // Get the top regions
    axios
      .get(`${api_endpoint_base}/top-regions`)
      .then(function (response) {
        set_top_regions(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get the top products
    axios
      .get(`${api_endpoint_base}/top-products`)
      .then(function (response) {
        set_top_products(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get the top clients
    axios
      .get(`${api_endpoint_base}/top-clients`)
      .then(function (response) {
        set_top_clients(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get the daily volume sales for every month
    axios
      .get(`${api_endpoint_base}/daily-volume`)
      .then(function (response) {
        set_net_sales_volumes(__group_sales_by_month(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get gross sales for every month and cumulative gross sales
    axios
      .get(`${api_endpoint_base}/cumulative-month-gross`)
      .then(function (response) {
        const [cumulative, per_month] = response.data;
        set_gross_cumulative_sales(cumulative.data);
        set_gross_sales_volumes(per_month.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get profit, revenues and cost of goods sold
    axios
      .get(`${api_endpoint_base}/profit`)
      .then(function (response) {
        set_profits(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get the total net sales
    axios
      .get(`${api_endpoint_base}/total-net-sales`)
      .then(function (response) {
        set_total_net_sales(response.data.totalNetSales);
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get the total gross (net + taxes) sales
    axios
      .get(`${api_endpoint_base}/total-gross-sales`)
      .then(function (response) {
        set_total_gross_sales(response.data.totalGrossSales);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Grid
      className={classes.grid}
      container
      spacing={3}
      justify="center"
      alignItems="center"
    >
      <Grid item xs={6} sm={4} md={3} lg>
        <InformationCard
          title="Profit"
          value={profits.profit}
          classes={classes}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={3} lg>
        <InformationCard
          title="Revenue from sales"
          value={profits.revenueFromSales}
          classes={classes}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={3} lg>
        <InformationCard
          title="Costs of good solds"
          value={profits.costOfGoodsSold}
          classes={classes}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={3} lg>
        <InformationCard
          title="Total Net Sales"
          value={total_net_sales}
          classes={classes}
        />
      </Grid>
      <Grid item xs={6} sm={4} md={3} lg>
        <InformationCard
          title="Total Gross Sales"
          value={total_gross_sales}
          classes={classes}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Sales Per Region
          </Typography>
          <MyPieChart
            data={top_regions.slice(0, 5)}
            colors={['#bf211e', '#e82f2c', '#f95f5c', '#f99593', '#a06968']}
            pieProps={{ nameKey: 'id', dataKey: 'netTotal' }}
            cellProps={{ stroke: '#7f1614' }}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Sales Volume (net &amp; gross)
          </Typography>
          <SalesVolumes
            net_sales={net_sales_volumes}
            gross_sales={gross_sales_volumes}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Cumulative Sales Volume (gross)
          </Typography>
          <CumulativeSalesVolumes
            cumulative_gross_sales={gross_cumulative_sales}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Top Products
          </Typography>
          <TopProductsTable products={top_products.slice(0, 10)} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Top Clients
          </Typography>
          <TopClientsTable clients={top_clients.slice(0, 10)} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Sales;
