import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
// import ChartistGraph from "react-chartist";
import { Typography, Modal } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core/";

import { formatCurrency } from "../../utils";

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

const top_clients_table = clients => {
  const table_header = ["Client", "Units", "Total Amount"];

  let table_rows = [];
  for (let key in clients) {
    table_rows.push({
      client: key,
      units: clients[key].units,
      amount: clients[key].amount
    });
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          {table_header.map(header => (
            <TableCell>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {table_rows.map(product => (
          <TableRow key={product.client}>
            <TableCell>{product.client}</TableCell>
            <TableCell>{product.units}</TableCell>
            <TableCell>{formatCurrency(product.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const Product = ({ isOpen, close, data, props }) => {
  const classes = useStyles();
  const [product, setProduct] = useState(null);
  const [productDetail, setProductDetail] = useState(null);

  const api_endpoint_base = "http://localhost:3001/api/product";

  useEffect(() => {
    if (data.product_id) {
      axios
        .get(
          `${api_endpoint_base}/${data.product_id}?start-date=${props.startDate}&end-date=${props.endDate}`,
          {
            withCredentials: true
          }
        )
        .then(function(response) {
          setProductDetail(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });

      axios
        .get(
          `${api_endpoint_base}/${data.product_id}/info?start-date=${props.startDate}&end-date=${props.endDate}`,
          {
            withCredentials: true
          }
        )
        .then(function(response) {
          setProduct(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      setProduct(null);
      setProductDetail(null);
    }
  }, [data, props.startDate, props.endDate]);

  return (
    <Modal open={isOpen} onClose={close}>
      <div className="modal_css">
        <Grid className={classes.grid} container spacing={3}>
          <Grid item md={12} sm={12}>
            <Paper>
              <Typography
                align="center"
                variant="h5"
                className={classes.graphs_title}
              >
                {product && product.name}
              </Typography>
              <Typography className="product_description" align="left">
                Product Group:{" "}
                <b>
                  {" "}
                  {productDetail && productDetail.ProductGroup} <br />
                </b>
                Product Code:{" "}
                <b>
                  {" "}
                  {productDetail && productDetail.ProductNumberCode} <br />
                </b>
                Product Type:{" "}
                <b>
                  {" "}
                  {productDetail && productDetail.ProductType} <br />{" "}
                </b>
                Minimum selling price:{" "}
                <b>
                  {" "}
                  {product &&
                    formatCurrency(product.minimumUnitPrice)} <br />{" "}
                </b>
              </Typography>
            </Paper>
          </Grid>

          <Grid item md={12} sm={12}>
            <Paper align="center" className="financial_fix">
              <Typography variant="h5" className={classes.graphs_title}>
                Units Sold
              </Typography>
              {product && product.unitsSold}
            </Paper>
          </Grid>

          <Grid item md={12} sm={12}>
            <Paper>
              <Typography
                align="center"
                variant="h5"
                className={classes.graphs_title}
              >
                Top Clients
              </Typography>
              {product && top_clients_table(product.clients)}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};

export default Product;
