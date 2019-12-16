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

import { formatCurrency, formatNumber } from "../../utils";

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
    { client: "Administrador", units: 171, amount: formatCurrency(16205) },
    { client: "EUGENIO.VEIGA", units: 1, amount: formatCurrency(94.77) }
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
        <Grid className={classes.grid} container spacing={3}>
          <Grid item md={12} sm={12}>
            <Paper>
              <Typography
                align="center"
                variant="h5"
                className={classes.graphs_title}
              >
                Hand Scanner -TR89
              </Typography>
              <Typography className="product_description" align="left">
                Product Group:{" "}
                <b>
                  {" "}
                  Scanners <br />
                </b>
                Product Code:{" "}
                <b>
                  {" "}
                  C0003 <br />
                </b>
                Product Type:{" "}
                <b>
                  {" "}
                  P <br />{" "}
                </b>
                Minimum selling price:{" "}
                <b>
                  {" "}
                  {formatCurrency(94.77)} <br />{" "}
                </b>
              </Typography>
            </Paper>
          </Grid>

          <Grid item md={12} sm={12}>
            <Paper align="center" className="financial_fix">
              <Typography variant="h5" className={classes.graphs_title}>
                Units Sold
              </Typography>
              172
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
