import React from 'react';
import PropTypes from 'prop-types';
import ChartistGraph from 'react-chartist';

const TopClientsGraph = (props) => {
  const { clients } = props;

  const data = {
    labels: clients.map(client => client.client),
    series: clients.map(client => client.totalPurchased)
  };
  
  return <ChartistGraph type='Pie' data={data} />
}

TopClientsGraph.propTypes = {
  clients: PropTypes.array.isRequired,
}

export default TopClientsGraph;