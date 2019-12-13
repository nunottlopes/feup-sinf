import React from 'react';
import PropTypes from 'prop-types';
import ChartistGraph from 'react-chartist';

const FinancesGraph = (props) => {
  const { expenses, income } = props;

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
      {
        className: 'series-expenses',
        data: expenses
      },
      {
        className: 'series-income',
        data: income
      },
    ]
  }

  const options = {
    height: 400
  }

  return <ChartistGraph type='Line' data={data} options={options}></ChartistGraph>
}

FinancesGraph.propTypes = {
  expenses: PropTypes.array.isRequired,
  income: PropTypes.array.isRequired
}

export default FinancesGraph;