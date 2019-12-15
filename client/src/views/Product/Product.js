import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ChartistGraph from "react-chartist";
import { Typography, Modal } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core/";

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

const top_clients_table = () => {
  const table_header = ["Client", "Units", "Amount"];
  const table_rows = [
    { client: "PRODUCT_ID1", units: "Product 1", amount: 100 },
    { client: "PRODUCT_ID2", units: "Product 2", amount: 100 },
    { client: "PRODUCT_ID3", units: "Product 3", amount: 100 },
    { client: "PRODUCT_ID4", units: "Product 4", amount: 100 }
  ];

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
            <TableCell>{product.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const Product = ({ isOpen, close, data }) => {
  const classes = useStyles();
  return (
    <Modal open={isOpen} onClose={close}>
      <div className="modal_css">
        <Grid className={classes.grid} container spacing={2}>
          <Grid item md={12} sm={12}>
            <Paper>
              <Typography
                align="center"
                variant="h5"
                className={classes.graphs_title}
              >
                MacBook Pro
              </Typography>
              <Typography className="product_description" align="left">
                Lorem Ipsum <br />
                Item ID:{" "}
                <b>
                  {" "}
                  MACKBOOK_PRO <br />
                </b>
                Production cost:{" "}
                <b>
                  2099€ <br />{" "}
                </b>
                Minimum selling price:{" "}
                <b>
                  2500€ <br />{" "}
                </b>
              </Typography>
            </Paper>
          </Grid>
          <Grid item md={6} sm={12}>
            <Paper align="center" className="financial_fix">
              <Typography variant="h5" className={classes.graphs_title}>
                Units in Stock
              </Typography>
              536
            </Paper>
          </Grid>
          <Grid item md={6} sm={12}>
            <Paper align="center" className="financial_fix">
              <Typography variant="h5" className={classes.graphs_title}>
                Unist Sold
              </Typography>
              10k
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
              {top_clients_table()}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};

export default Product;
