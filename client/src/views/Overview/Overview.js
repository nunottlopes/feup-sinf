import { Typography } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { MyPieChart } from "./../../components";
import FinancesGraph from "./FinancesGraph";
import MonthlySalesGraph from "./MonthlySalesGraph";
import TopProductsTable from "../../components/TopProductsTable/TopProductsTable";

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

const Overview = props => {
  // styling classes
  const classes = useStyles();
  // constant for the overview API endpoint
  const api_endpoint_base = "http://localhost:3001/api/overview";
  // hooks for data/state
  const [top_clients, set_top_clients] = useState({ loaded: false, data: [] });
  const [top_regions, set_top_regions] = useState({ loaded: false, data: [] });
  const [top_products, set_top_products] = useState({ loaded: false, data: [] });
  const [monthly_sales, set_monthly_sales] = useState({ loaded: false, data: [] });
  const [finances, set_finances] = useState({
    loaded: false,
    data: {
      revenue: [],
      cost: []
    }
  });
  // Perform all API calls for this page
  useEffect(() => {
    // Get the top clients
    axios
      .get(
        `${api_endpoint_base}/top-clients?start-date=${props.startDate}&end-date=${props.endDate}`,
        { withCredentials: true }
      )
      .then(function (response) {
        set_top_clients({ loaded: true, data: response.data.slice(0, 5) });
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get the top regions
    axios
      .get(
        `${api_endpoint_base}/top-regions?start-date=${props.startDate}&end-date=${props.endDate}`,
        { withCredentials: true }
      )
      .then(function (response) {
        set_top_regions({ loaded: true, data: response.data.slice(0, 5) });
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get the top products
    axios
      .get(
        `${api_endpoint_base}/top-products?start-date=${props.startDate}&end-date=${props.endDate}`,
        { withCredentials: true }
      )
      .then(function (response) {
        set_top_products({ loaded: true, data: response.data.slice(0, 5) });
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get the monthly sales
    axios
      .get(
        `${api_endpoint_base}/month-sales?start-date=${props.startDate}&end-date=${props.endDate}`,
        { withCredentials: true }
      )
      .then(function (response) {
        set_monthly_sales({ loaded: true, data: response.data.data });
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get the financial data (income and expenses)
    axios
      .get(
        `${api_endpoint_base}/global-finances?start-date=${props.startDate}&end-date=${props.endDate}`,
        { withCredentials: true }
      )
      .then(function (response) {
        set_finances({ loaded: true, data: { revenue: response.data.revenue.data, cost: response.data.cost.data } });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [props.startDate, props.endDate]);

  return (
    <Grid className={classes.grid} container spacing={3}>
      <Grid item lg={6} xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Global finances
          </Typography>
          {finances.loaded ?
            <FinancesGraph
              income={finances.data.revenue}
              expenses={finances.data.cost}
            /> :
            <CircularProgress />
          }

        </Paper>
      </Grid>
      <Grid item lg={6} xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Monthly Sales
          </Typography>
          {monthly_sales.loaded ?
            <MonthlySalesGraph sales={monthly_sales.data} />
            :
            <CircularProgress />
          }
        </Paper>
      </Grid>
      <Grid item md={6} xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Top Clients
          </Typography>
          {top_clients.loaded ?
            <MyPieChart
              data={top_clients.data}
              //https://coolors.co/00292d-475a5b-799496-97bec1-9de4ea
              colors={["#00292d", "#475a5b", "#799496", "#97bec1", "#9de4ea"]}
              pieProps={{ nameKey: "client", dataKey: "totalPurchased" }}
              cellProps={{ stroke: "#001719" }}
            />
            :
            <CircularProgress />
          }
        </Paper>
      </Grid>
      <Grid item md={6} xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Top Regions
          </Typography>
          { top_regions.loaded ?
            <MyPieChart
              data={top_regions.data}
              // https://coolors.co/bf211e-e82f2c-f95f5c-f99593-a06968
              colors={["#bf211e", "#e82f2c", "#f95f5c", "#f99593", "#a06968"]}
              pieProps={{ nameKey: "id", dataKey: "netTotal" }}
              cellProps={{ stroke: "#7f1614" }}
            />
            :
            <CircularProgress />
          }
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Top Products
          </Typography>
          { top_products.loaded ?
            <TopProductsTable products={top_products.data} />
            :
            <CircularProgress />
          }
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Overview;
