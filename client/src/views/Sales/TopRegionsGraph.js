import React from 'react';
import PropTypes from 'prop-types';
import ChartistGraph from 'react-chartist';

const TopRegionsTable = (props) => {
  const { regions } = props;

  const data = {
    labels: regions.map(region => region.id),
    series: regions.map(region => region.netTotal)
  };

  return <ChartistGraph type='Pie' data={data} />
}

TopRegionsTable.propTypes = {
  regions: PropTypes.array.isRequired,
}

export default TopRegionsTable;