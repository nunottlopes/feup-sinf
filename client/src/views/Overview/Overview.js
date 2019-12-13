import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ChartistGraph from 'react-chartist';
import { Typography } from "@material-ui/core";

import TopProductsTable from './TopProductsTable';
import TopClientsGraph from './TopClientsGraph';
import TopRegionsGraph from './TopRegionsGraph';
import MonthlySalesGraph from './MonthlySalesGraph';

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

const global_finances_graph = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
      {
        className: 'series-expenses',
        data: [10, 20, 30, 40, 50, 20, 5, 70, 80, 50, 35]
      },
      {
        className: 'series-income',
        data: [5, 20, 10, 5, 3, 30, 25, 30, 40, 64, 80]
      },
    ]
  }

  const options = {
    height: 400
  }

  return <ChartistGraph type='Line' data={data} options={options}></ChartistGraph>
}

const Overview = () => {
  // styling classes
  const classes = useStyles();
  // constant for the overview API endpoint
  const api_endpoint_base = 'http://localhost:3001/api/overview';
  // hooks for data/state
  const [top_clients, set_top_clients] = useState([]);
  const [top_regions, set_top_regions] = useState([]);
  const [top_products, set_top_products] = useState([]);
  const [monthly_sales, set_monthly_sales] = useState([]);
  // Perform all API calls for this page
  useEffect(() => {
    // Get the top clients
    axios.get(`${api_endpoint_base}/top-clients`)
      .then(function (response) {
        set_top_clients(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })

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

    // Get the monthly sales
    axios.get(`${api_endpoint_base}/month-sales`)
      .then(function (response) {
        set_monthly_sales(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })

  }, [])

  return (
    <Grid className={classes.grid} container spacing={2}>
      <Grid item md={6} sm={12}>
        <Paper>
          <Typography variant='h5' className={classes.graphs_title}>Global finances</Typography>
          {global_finances_graph()}
        </Paper>
      </Grid>
      <Grid item md={6} sm={12}>
        <Paper>
          <Typography variant='h5' className={classes.graphs_title}>Monthly Sales</Typography>
          <MonthlySalesGraph sales={monthly_sales} />
        </Paper>
      </Grid>
      <Grid item lg={4} md={6} sm={12}>
        <Paper>
          <Typography variant='h5' className={classes.graphs_title}>Top Clients</Typography>
          <TopClientsGraph clients={top_clients.slice(0, 5)} />
        </Paper>
      </Grid>
      <Grid item lg={4} md={6} sm={12}>
        <Paper>
          <Typography variant='h5' className={classes.graphs_title}>Top Regions</Typography>
          <TopRegionsGraph regions={top_regions.slice(0, 5)} />
        </Paper>
      </Grid>
      <Grid item lg={4} sm={12}>
        <Paper>
          <Typography variant='h5' className={classes.graphs_title}>Top Products</Typography>
          <TopProductsTable products={top_products.slice(0, 5)} />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Overview;