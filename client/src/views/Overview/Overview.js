import React, { useState, useEffect } from "react";
import { LineChart, Line } from 'recharts';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";

import TopProductsTable from "./TopProductsTable";
import TopClientsGraph from "./TopClientsGraph";
import TopRegionsGraph from "./TopRegionsGraph";
import MonthlySalesGraph from "./MonthlySalesGraph";
import FinancesGraph from "./FinancesGraph";

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

const Overview = () => {
  // styling classes
  const classes = useStyles();
  // constant for the overview API endpoint
  const api_endpoint_base = "http://localhost:3001/api/overview";
  // hooks for data/state
  const [top_clients, set_top_clients] = useState([]);
  const [top_regions, set_top_regions] = useState([]);
  const [top_products, set_top_products] = useState([]);
  const [monthly_sales, set_monthly_sales] = useState([]);
  const [finances, set_finances] = useState({
    revenue: {
      data: []
    },
    cost: {
      data: []
    }
  });
  // Perform all API calls for this page
  useEffect(() => {
    // Get the top clients
    axios
      .get(`${api_endpoint_base}/top-clients`)
      .then(function(response) {
        set_top_clients(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    // Get the top regions
    axios
      .get(`${api_endpoint_base}/top-regions`)
      .then(function(response) {
        set_top_regions(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    // Get the top products
    axios
      .get(`${api_endpoint_base}/top-products`)
      .then(function(response) {
        set_top_products(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    // Get the monthly sales
    axios
      .get(`${api_endpoint_base}/month-sales`)
      .then(function(response) {
        set_monthly_sales(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    // Get the financial data (income and expenses)
    axios
      .get(`${api_endpoint_base}/global-finances`)
      .then(function(response) {
        set_finances(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

  return (
    <Grid className={classes.grid} container spacing={3}>
      <Grid item md={6} xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Global finances
          </Typography>
          <FinancesGraph
            income={finances.revenue.data}
            expenses={finances.cost.data}
          />
        </Paper>
      </Grid>
      <Grid item md={6} xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Monthly Sales
          </Typography>
          <MonthlySalesGraph sales={monthly_sales} />
        </Paper>
      </Grid>
      <Grid item md={6} xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Top Clients
          </Typography>
          <TopClientsGraph clients={top_clients.slice(0, 5)} />
        </Paper>
      </Grid>
      <Grid item md={6} xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Top Regions
          </Typography>
          <TopRegionsGraph regions={top_regions.slice(0, 5)} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Top Products
          </Typography>
          <TopProductsTable products={top_products.slice(0, 5)} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Overview;
