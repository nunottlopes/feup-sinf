import React from 'react';
import PropTypes from 'prop-types';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatNumber } from '../../utils.js';

const TopRegionsTable = (props) => {
  const { regions } = props;
  console.log(regions);
  const formatTooltip = (value, name, props) => formatNumber(value);
  // https://coolors.co/bf211e-e82f2c-f95f5c-f99593-a06968
  const colors = ['#bf211e', '#e82f2c', '#f95f5c', '#f99593', '#a06968'];
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={regions}
          nameKey="id"
          dataKey="netTotal"
          innerRadius="50%"
          paddingAngle="3"
        >
          {regions.map((client, index) =>
            <Cell fill={colors[index]} stroke="#7f1614" strokeWidth={0.5} />
          )}
        </Pie>
        <Tooltip cursor formatter={formatTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

TopRegionsTable.propTypes = {
  regions: PropTypes.array.isRequired,
}

export default TopRegionsTable;