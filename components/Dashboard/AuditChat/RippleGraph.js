import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import {Paper,Box} from '@material-ui/core'; 
import {Row,Column} from '../../../core'; 
import { makeStyles } from '@material-ui/styles';
import LanguageConfig from "../../../helper/LanguageConfig"

const  ripple= [
  { month: 'Jan', price: 1500 },
  { month: '', price: 400 },
  { month: 'Feb', price: 2000 },
  { month: 'Mar', price: 1200 },
  { month: 'Apr', price: 2200 },
  { month: 'May', price: 2600 },
  { month: 'Jun', price: 4300 },
  { month: 'July', price: 2900 },
  { month: 'Aug', price: 3800 },
  { month: 'Sep', price: 1500 },
]
const useStyles = makeStyles((theme) => ({
  tooltip: {
    position: 'relative',
    borderRadius: 6,
    padding: '4px 12px',
    backgroundColor: '#E59D1E',
    color: theme.palette.common.white,
  },
  semiColor:{
    color:'blue', 
    opacity:.8
  }
}));

const RippleGraph = () => {
  const classes = useStyles();
  return (
    <Paper>
      <Row>
        <Column padding={[0,0,0,20]} bottom>
          <h2><LanguageConfig id="dashboardpage.expenses" /></h2> 
        </Column>
        <Column md={6} xs={6} sm={6} center middle padding={[10,0]}>
          <p className={classes.semiColor}><LanguageConfig id="dashboardpage.accountbalance" /></p>
          <h1>400 K</h1>
        </Column>
        <Column md={6} xs={6} sm={6} center middle padding={[10,0]}>
          <p className={classes.semiColor}><LanguageConfig id="dashboardpage.accountpayable" /></p>
          <h1>30 K</h1> 
        </Column>
      </Row>
    <ResponsiveContainer width="100%" height={210}> 
      <AreaChart data={ripple} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Tooltip
          labelStyle={{ color: 'black' }}
          cursor={false}
          content={(data) => {
            return data.payload[0] ? <Box className={classes.tooltip}>${data.payload[0].payload.price}</Box> : null;
          }}
        />
        <defs>
          <linearGradient id="color12" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F39711" stopOpacity={1} />
            <stop offset="95%" stopColor="#fff" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="price"
          type="monotone"
          strokeWidth={2}
          stackId="2"
          stroke="#F39711"
          fill="url(#color12)"
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
    </Paper>
  );
};

export default RippleGraph;
