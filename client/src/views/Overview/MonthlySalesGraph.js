import React from 'react';
import PropTypes from 'prop-types';
import ChartistGraph from 'react-chartist';
import { isProperty } from '@babel/types';

const MonthlySalesGraph = (props) => {
  const { sales } = props;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
      {
        className: 'series-income',
        data: sales
      }
    ]
  };

  const options = {
    height: 400
  }

  return <ChartistGraph type='Bar' data={data} options={options} />
}

MonthlySalesGraph.propTypes = {
  sales: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
}

export default MonthlySalesGraph;