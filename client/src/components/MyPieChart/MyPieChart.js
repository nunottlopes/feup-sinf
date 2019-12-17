import PropTypes from 'prop-types';
import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatNumber } from '../../utils.js';

/**
 * Customized PieChart from Rechart library
 * * Responsive by default
 * * Has an inner radius of 50% and padding angle of 3º
 * * Each cell has a custom color provided, and a small stroke around (WARNING: it expects a different color for each data entry)
 * 
 * Customization:
 * * Width is set to be 100%, but height can configured through 'height' prop (300px by default)
 * * Pie props can be provided through pieProps, which are directly passed to <Pie>, thus overriding defaults
 * * Cell props can be provided through cellProps, which are directly passed to <Cell>, thus overriding defaults
 * @param {*} props 
 */
const MyPieChart = (props) => {
  const { data, colors, pieProps, cellProps, height } = props;
  const formatTooltip = (value, name, props) => formatNumber(value);

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <PieChart>
        <Pie
          data={data}
          innerRadius="50%"
          paddingAngle="3"
          {...pieProps}
        >
          {data.map((value, index) =>
            <Cell key={`cell_${value}_${index}`} fill={colors[index]} strokeWidth={0.5} {...cellProps} />
          )}
        </Pie>
        <Tooltip formatter={formatTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

MyPieChart.propTypes = {
  data: PropTypes.array.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  pieProps: PropTypes.object, 
  cellProps: PropTypes.object, 
  height: PropTypes.number
}

export default MyPieChart;