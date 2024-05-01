import React from 'react';
import PortfolioDetails from './PortfolioDetails';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import CmtAdvCard from '../../../@coremat/CmtAdvCard';
import CmtCardHeader from '../../../@coremat/CmtCard/CmtCardHeader';
import CmtAdvCardContent from '../../../@coremat/CmtAdvCard/CmtAdvCardContent';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  textError: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.error.main,
    marginLeft: 8,
    marginTop: 4,
    fontWeight: theme.typography.fontWeightRegular,
  },
  subTitle: {
    color: theme.palette.text.secondary,
  },
  linkBtn: {
    marginLeft: -6,
  },
}));

const PortfolioBalance = () => {
  const classes = useStyles();
  const getBalance = () => (
    <Box mb={2} display="flex" flexDirection="row" alignItems="center">
      <Typography component="div" variant="h1">
      &euro;179,626
      </Typography>
      <Typography component="span" variant="h4" className={classes.textError}>
        23%
        <TrendingDownIcon fontSize="small" />
      </Typography>
    </Box>
  );

  const extraContent = () => (
    <Box mt={{ xs: 6, md: 8, xl: 10 }}>
      <Box mb={{ xs: 4, md: 6 }} display="flex" flexDirection="row" flexWrap="wrap">
        <Box mr={2} mb={2}>
          <Button variant="contained" color="secondary">
            Deposit
          </Button>
        </Box>
        <Box mb={2}>
          <Button variant="outlined">Withdraw</Button>
        </Box>
      </Box>

      <Button color="primary" className={classes.linkBtn}>
        <AddIcon />
        <Box component="span" ml={2}>
          Add Wallet
        </Box>
      </Button>
    </Box>
  );

  return (
    <CmtAdvCard>
      <CmtCardHeader
        titleProps={{
          variant: 'h4',
          component: 'div',
        }}
        title={'Your Portfolio Balance'}
      />
      <CmtAdvCardContent
        title={getBalance()}
        subTitle={'Overall balance'}
        subTitleProps={{
          variant: 'body2',
          component: 'p',
          className: classes.subTitle,
        }}
        extraContent={extraContent()}
        reverseDir>
        <PortfolioDetails />
      </CmtAdvCardContent>
    </CmtAdvCard>
  );
};

export default PortfolioBalance;
