import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, Legend, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const FinancesGraph = (props) => {
  const { expenses, income } = props;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let data = [];
  for (let i = 0; i < months.length; i++) {
    data.push({
      month: months[i],
      expense: expenses[i],
      income: income[i]
    })
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="expense" stroke="red" />
        <Line type="monotone" dataKey="income" stroke="green" />
      </LineChart>
    </ResponsiveContainer>
  )
}

FinancesGraph.propTypes = {
  expenses: PropTypes.array.isRequired,
  income: PropTypes.array.isRequired
}

export default FinancesGraph;