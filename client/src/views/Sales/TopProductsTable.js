import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core/';

const TopProductsTable = (props) => {
  const { products } = props;
  const table_header = ['Product ID', 'Name', 'Quantity (sold)']

  return (
    <Table>
      <TableHead>
        <TableRow>
          {table_header.map(header => 
            <TableCell key={header}>{header}</TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.ProductCode}>
            <TableCell>{product.ProductCode}</TableCell>
            <TableCell>{product.ProductDescription}</TableCell>
            <TableCell>{product.Quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

TopProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
}

export default TopProductsTable;