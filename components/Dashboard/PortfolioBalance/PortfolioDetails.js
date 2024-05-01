import React from 'react';
import Box from '@material-ui/core/Box';
import ProgressIndicator from './ProgressIndicator';
import CmtList from '../../../@coremat/CmtList'; 
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

const wallets=[
  { label: 'BTC', value: 74, rate: 8.75, color: '#89CB00' },
  { label: 'RPL', value: 18, rate: 1.23, color: '#FF8800' },
  { label: 'LTE', value: 8, rate: 0.71, color: '#E31D41' },
]

const useStyles = makeStyles(() => ({
  titleRoot: {
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  listItemRoot: {
    padding: 0,
    marginBottom: 4,
  },
}));

const PortfolioDetails = () => {
  const classes = useStyles();
  return (
    <Box width={1}>
      <Typography component="div" variant="h6" className={classes.titleRoot}>
        Portfolio Distribution
      </Typography>
      <CmtList
        data={crypto.wallets}
        renderRow={(item, index) => <ProgressIndicator key={index} className={classes.listItemRoot} item={item} />}
      />
    </Box>
  );
};

export default PortfolioDetails;
