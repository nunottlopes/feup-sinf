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
import Product from "views/Product/Product";
import { euroCurrency } from "../../utils";

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

const Inventory = () => {
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
  const [products, setProducts] = useState([]);
  const [assets, setAssets] = useState(null);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    // Get products
    axios
      .get(`${api_endpoint_base}/products`)
      .then(function(response) {
        setProducts(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    // Get stock balance
    axios
      .get(`${api_endpoint_base}/stock-balance`)
      .then(function(response) {
        setAssets(response.data.stockTotalBalance);
      })
      .catch(function(error) {
        console.log(error);
      });

    // Get warehouse stock
    axios
      .get(`${api_endpoint_base}/warehouse-units`)
      .then(function(response) {
        setWarehouses(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

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
          {assets && euroCurrency(assets)}
        </Paper>
      </Grid>
      <Grid item sm={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Warehouses
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                {warehouses_header.map(header => (
                  <TableCell>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {warehouses &&
                warehouses.length !== 0 &&
                warehouses.map(warehouse => (
                  <TableRow
                    key={warehouse.warehouse}
                    onClick={() => action(warehouse)}
                  >
                    <TableCell>{warehouse.warehouse}</TableCell>
                    <TableCell>{warehouse.warehouseDescription}</TableCell>
                    <TableCell>{warehouse.stockBalance}</TableCell>
                    <TableCell>
                      {euroCurrency(warehouse.inventoryBalance)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <Product isOpen={modal} close={close} data={modalData} />
          </Table>
        </Paper>
      </Grid>
      <Grid item sm={12}>
        <Paper>
          <Typography variant="h5" className={classes.graphs_title}>
            Products
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                {products_header.map(header => (
                  <TableCell>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products &&
                products.length !== 0 &&
                products.map(product => (
                  <TableRow
                    key={product.product_id}
                    onClick={() => action(product)}
                  >
                    <TableCell>{product.product_id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{euroCurrency(product.base_price)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <Product isOpen={modal} close={close} data={modalData} />
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Inventory;
