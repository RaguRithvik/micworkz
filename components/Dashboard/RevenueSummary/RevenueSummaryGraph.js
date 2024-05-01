import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
 import { Box } from '@material-ui/core';
import Zoom from '../../../@coremat/CmtTransitions/Zoom';

const revenueSummary=[
  { month: 'Jan', income: 500, expense: 300 },
  { month: 'Feb', income: 1000, expense: 600 },
  { month: 'Mar', income: 1500, expense: 1000 },
  { month: 'Apr', income: 900, expense: 400 },
  { month: 'May', income: 200, expense: 200 },
  { month: 'Jun', income: 500, expense: 1100 },
  { month: 'Jul', income: 800, expense: 1400 },
  { month: 'Aug', income: 1400, expense: 1700 },
  { month: 'Sep', income: 2000, expense: 2000 },
  { month: 'Oct', income: 1300, expense: 400 },
  { month: 'Nov', income: 700, expense: 700 },
  { month: 'Dec', income: 1300, expense: 2100 },
];

const RevenueSummaryGraph = ({ value }) => {
  let incomeColor = value === 0 ? '#5F33C2' : '#FF8C00';
  let expanseColor = value === 1 ? '#5F33C2' : '#FF8C00';

  return (
    <React.Fragment>
      <Zoom in={value === 0} direction="up">
        <Box>
          <ResponsiveContainer width="100%" height={value === 0 ? 205 : 0}>
            <AreaChart data={revenueSummary} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <Tooltip labelStyle={{ color: 'black' }} cursor={false} />
              <XAxis dataKey="month" axisLine={false} />
              <Area dataKey="expense" stackId="2" stroke={expanseColor} fillOpacity={1} fill={expanseColor} />
              <Area dataKey="income" stackId="1" stroke={incomeColor} fillOpacity={1} fill={incomeColor} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Zoom>
      <Zoom in={value === 1} direction="down">
        <Box>
          <ResponsiveContainer width="100%" height={value === 1 ? 205 : 0}>
            <AreaChart data={revenueSummary} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <Tooltip labelStyle={{ color: 'black' }} cursor={false} />
              <XAxis dataKey="month" axisLine={false} />
              <Area dataKey="expense" stackId="2" stroke={expanseColor} fillOpacity={1} fill={expanseColor} />
              <Area dataKey="income" stackId="1" stroke={incomeColor} fillOpacity={1} fill={incomeColor} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Zoom>
    </React.Fragment>
  );
};

export default RevenueSummaryGraph;
