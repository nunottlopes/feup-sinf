import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core/";
import Product from "views/Product/Product";

const useStyles = makeStyles(theme => ({
  product: {
    cursor: "pointer"
  }
}));

const TopProductsTable = props => {
  const classes = useStyles();
  const { products } = props;
  const table_header = ["Product ID", "Name", "Quantity (sold)"];

  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const close = () => {
    setModal(!modal);
    setModalData({});
  };

  const action = product => {
    product.product_id = product.ProductCode;
    setModal(true);
    setModalData(product);
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            {table_header.map(header => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className={classes.product}>
          {products.map(product => (
            <TableRow key={product.ProductCode} onClick={() => action(product)}>
              <TableCell>{product.ProductCode}</TableCell>
              <TableCell>{product.ProductDescription}</TableCell>
              <TableCell>{product.Quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Product isOpen={modal} close={close} data={modalData} props={props} />
    </div>
  );
};

TopProductsTable.propTypes = {
  products: PropTypes.array.isRequired
};

export default TopProductsTable;
