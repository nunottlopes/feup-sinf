import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core/';

import { euroCurrency } from '../../utils';

const TopClientsTable = (props) => {
  const { clients } = props;
  const table_header = ['Client ID', 'Number of Purchases', 'Profit from sales']

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
        {clients.map(client => (
          <TableRow key={client.client}>
            <TableCell>{client.client}</TableCell>
            <TableCell>{client.nPurchases}</TableCell>
            <TableCell>{euroCurrency(client.totalPurchased)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

TopClientsTable.propTypes = {
  clients: PropTypes.array.isRequired,
}

export default TopClientsTable;