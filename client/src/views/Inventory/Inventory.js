import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Typography, CircularProgress } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core/";
import Product from "views/Product/Product";
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
  },
  product: {
    cursor: "pointer"
  }
}));

const Inventory = props => {
  const classes = useStyles();
  const api_endpoint_base = "http://localhost:3001/api/inventory";

  const products_header = [
    "Product ID",
    "Name",
    "Quantity (sold)",
    "Base Price"
  ];
  const warehouses_header = [
    "Warehouse ID",
    "Name",
    "Stock balance",
    "Inventory Balance"
  ];

  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [products, setProducts] = useState({ loaded: false, data: [] });
  const [assets, setAssets] = useState({ loaded: false, data: null });
  const [warehouses, setWarehouses] = useState({ loaded: false, data: [] });

  useEffect(() => {
    // Get products
    axios
      .get(
        `${api_endpoint_base}/products?start-date=${props.startDate}&end-date=${props.endDate}`,
        { withCredentials: true }
      )
      .then(function (response) {
        setProducts({ loaded: true, data: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get stock balance
    axios
      .get(
        `${api_endpoint_base}/stock-balance?start-date=${props.startDate}&end-date=${props.endDate}`,
        { withCredentials: true }
      )
      .then(function (response) {
        setAssets({ loaded: true, data: response.data.stockTotalBalance });
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get warehouse stock
    axios
      .get(
        `${api_endpoint_base}/warehouse-units?start-date=${props.startDate}&end-date=${props.endDate}`,
        { withCredentials: true }
      )
      .then(function (response) {
        setWarehouses({ loaded: true, data: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [props.startDate, props.endDate]);

  const action = product => {
    setModal(true);
    setModalData(product);
  };

  const close = () => {
    setModal(!modal);
    setModalData({});
  };

  return (
    <Grid className={classes.grid} container spacing={3}>
      <Grid item md={12} sm={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Assets in Stock
          </Typography>
          {assets.loaded && formatCurrency(assets.data)}
        </Paper>
      </Grid>
      <Grid item sm={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Warehouses
          </Typography>
          {warehouses.loaded ?
            <Table>
              <TableHead>
                <TableRow>
                  {warehouses_header.map(header => (
                    <TableCell key={`header_${header}`}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {warehouses.data.map(warehouse => (
                  <TableRow key={warehouse.warehouse}>
                    <TableCell>{warehouse.warehouse}</TableCell>
                    <TableCell>{warehouse.warehouseDescription}</TableCell>
                    <TableCell>{warehouse.stockBalance}</TableCell>
                    <TableCell>
                      {formatCurrency(warehouse.inventoryBalance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            :
            <CircularProgress />
          }

        </Paper>
      </Grid>
      <Grid item sm={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Products
          </Typography>
          {products.loaded ?
            <Table>
              <TableHead>
                <TableRow>
                  {products_header.map(header => (
                    <TableCell key={`header_${header}`}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody className={classes.product}>
                {products.data.map(product => (
                  <TableRow
                    key={product.product_id}
                    onClick={() => action(product)}
                  >
                    <TableCell>{product.product_id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{formatCurrency(product.base_price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <Product
                isOpen={modal}
                close={close}
                data={modalData}
                props={props}
              />
            </Table>
            :
            <CircularProgress />
          }
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Inventory;
