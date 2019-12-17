import PropTypes from 'prop-types';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency, formatNumber } from '../../utils';
const MonthlySalesGraph = (props) => {
  const { sales } = props;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let data = sales.map((value, index) => ({
    month: months[index],
    sales: value
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => formatNumber(value)} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Bar dataKey="sales" fill="green" />
      </BarChart>
    </ResponsiveContainer>
  )
}

MonthlySalesGraph.propTypes = {
  sales: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
}

export default MonthlySalesGraph;