import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import ChartistGraph from 'react-chartist';
import { Typography } from "@material-ui/core";

import TopRegionsGraph from './TopRegionsGraph';
import TopProductsTable from './TopProductsTable';

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

/**
 * Returns total net sales for each month
 * @param {Array} daily_sales The response from '/daily-volume' endpoint
 */
const __group_sales_by_month = (daily_sales) => {
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
}

/**
 * Linear graph that shows both net and gross sales by month
 * @param {*} props 
 */
const SalesVolumes = (props) => {
  const { net_sales, gross_sales } = props;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
      net_sales,
      gross_sales
    ]
  };

  const options = {
    height: 400,
  }

  return <ChartistGraph type='Line' data={data} options={options} />
}

SalesVolumes.propTypes = {
  net_sales: PropTypes.arrayOf(PropTypes.number).isRequired,
  gross_sales: PropTypes.arrayOf(PropTypes.number).isRequired
}

/**
 * Linear graph showing cumulative gross sales by each month
 * @param {*} props 
 */
const CumulativeSalesVolumes = (props) => {
  const { cumulative_gross_sales } = props;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
      cumulative_gross_sales
    ]
  };

  const options = {
    height: 400,
  }

  return <ChartistGraph type='Line' data={data} options={options} />
}

CumulativeSalesVolumes.propTypes = {
  cumulative_gross_sales: PropTypes.arrayOf(PropTypes.number).isRequired
}

/**
 * Simple card to show numeric information such as total profits, total revenues, etc
 * @param {*} props 
 */
const InformationCard = (props) => {
  const { title, value, classes } = props;

  return (
    <Paper>
      <Typography variant='h5' className={classes.graphs_title}>{title}</Typography>
      {value ? (
        <Typography variant='body1' className={classes.graphs_title}>€ {value}</Typography>
      ) : (
          <Skeleton variant="text" />
        )}
    </Paper>
  )
}

InformationCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  classes: PropTypes.object
}

const Sales = () => {
  const classes = useStyles();
  // constant for the overview API endpoint
  const api_endpoint_base = 'http://localhost:3001/api/sales';
  // hooks for data/state
  // list of the top regions that purchase more products
  const [top_regions, set_top_regions] = useState([]);
  // list of most sold products
  const [top_products, set_top_products] = useState([]);
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
    axios.get(`${api_endpoint_base}/top-regions`)
      .then(function (response) {
        set_top_regions(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })

    // Get the top products
    axios.get(`${api_endpoint_base}/top-products`)
      .then(function (response) {
        set_top_products(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })

    // Get the daily volume sales for every month
    axios.get(`${api_endpoint_base}/daily-volume`)
      .then(function (response) {
        set_net_sales_volumes(__group_sales_by_month(response.data));
      })
      .catch(function (error) {
        console.log(error);
      })

    // Get gross sales for every month and cumulative gross sales
    axios.get(`${api_endpoint_base}/cumulative-month-gross`)
      .then(function (response) {
        const [cumulative, per_month] = response.data;
        set_gross_cumulative_sales(cumulative.data);
        set_gross_sales_volumes(per_month.data);
      })
      .catch(function (error) {
        console.log(error);
      })

    // Get profit, revenues and cost of goods sold
    axios.get(`${api_endpoint_base}/profit`)
      .then(function (response) {
        let obj = response.data;
        for (const key of Object.keys(obj)) {
          obj[key] = obj[key].toFixed(2)
        }
        set_profits(obj);
      })
      .catch(function (error) {
        console.log(error);
      })


    // Get the total net sales
    axios.get(`${api_endpoint_base}/total-net-sales`)
      .then(function (response) {
        set_total_net_sales(response.data.totalNetSales.toFixed(2));
      })
      .catch(function (error) {
        console.log(error);
      })

    // Get the total gross (net + taxes) sales
    axios.get(`${api_endpoint_base}/total-gross-sales`)
      .then(function (response) {
        set_total_gross_sales(response.data.totalGrossSales.toFixed(2));
      })
      .catch(function (error) {
        console.log(error);
      })
  }, [])

  return (
    <Grid className={classes.grid} container spacing={2} justify="center" alignItems="center">
      <Grid item xs={6} sm={4} md={3} lg>
        <InformationCard title="Profit" value={profits.profit} classes={classes} />
      </Grid>
      <Grid item xs={6} sm={4} md={3} lg>
        <InformationCard title="Revenue" value={profits.revenueFromSales} classes={classes} />
      </Grid>
      <Grid item xs={6} sm={4} md={3} lg>
        <InformationCard title="Costs" value={profits.costOfGoodsSold} classes={classes} />
      </Grid>
      <Grid item xs={6} sm={4} md={3} lg>
        <InformationCard title="Total Net Sales" value={total_net_sales} classes={classes} />
      </Grid>
      <Grid item xs={6} sm={4} md={3} lg>
        <InformationCard title="Total Gross Sales" value={total_gross_sales} classes={classes} />
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant='h5' className={classes.graphs_title}>Sales Per Region</Typography>
          <TopRegionsGraph regions={top_regions} />
        </Paper>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper>
          <Typography variant='h5' className={classes.graphs_title}>Sales Volume (net &amp; gross)</Typography>
          <SalesVolumes net_sales={net_sales_volumes} gross_sales={gross_sales_volumes} />
        </Paper>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper>
          <Typography variant='h5' className={classes.graphs_title}>Cumulative Sales Volume (gross)</Typography>
          <CumulativeSalesVolumes cumulative_gross_sales={gross_cumulative_sales} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant='h5' className={classes.graphs_title}>Top products</Typography>
          <TopProductsTable products={top_products.slice(0, 10)} />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Sales;