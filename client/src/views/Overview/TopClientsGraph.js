import PropTypes from 'prop-types';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatNumber } from '../../utils.js';

const TopClientsGraph = (props) => {
  const { clients } = props;
  const formatTooltip = (value, name, props) => formatNumber(value);
  //https://coolors.co/00292d-475a5b-799496-97bec1-9de4ea
  const colors = ['#00292d', '#475a5b', '#799496', '#97bec1', '#9de4ea'];
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={clients}
          nameKey="client"
          dataKey="totalPurchased"
          innerRadius="50%"
          paddingAngle="3"
        >
          {clients.map((client, index) =>
            <Cell key={`cell_${index}`} fill={colors[index]} />
          )}
        </Pie>
        <Tooltip cursor={{ stroke: 'red', strokeWidth: 2 }} formatter={formatTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

TopClientsGraph.propTypes = {
  clients: PropTypes.array.isRequired,
}

export default TopClientsGraph;