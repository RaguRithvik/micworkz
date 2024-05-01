import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import CmtCard from '../../../@coremat/CmtCard';
import CmtCardHeader from '../../../@coremat/CmtCard/CmtCardHeader';
import RevenueSummaryGraph from './RevenueSummaryGraph';
import SummaryTabs from './SummaryTabs';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import LanguageConfig from "../../../helper/LanguageConfig"

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    height: '100%',
    '@media screen and (min-width: 1280px) and (max-width: 1368px)': {
      '& .Cmt-header-root': {
        flexDirection: 'column',
      },
    },
    [theme.breakpoints.down('xs')]: {
      '& .Cmt-header-root': {
        flexDirection: 'column',
      },
    },
  },
  titleRoot: {
    marginBottom: 4,
  },
  titlePrimary: {
    color: theme.palette.primary.main,
  },
  subTitle: {
    fontSize: 12,
    color: theme.palette.text.secondary,
  },
}));

const RevenueSummary = () => {
  const [tabValue, setTabValue] = useState(0);
  const classes = useStyles();

  const getTitle = () => (
    <Box display="flex" alignItems="center">
      <Box mr={5}>
        <Typography component="div" variant="h1" className={clsx(classes.titleRoot, classes.titlePrimary)}>
        &yen;2,95,400
        </Typography>
        <Typography className={classes.subTitle}><LanguageConfig id="dashboardpage.earningthisyear" /></Typography>
      </Box>
      <Box>
        <Typography component="div" variant="h1" className={classes.titleRoot}>
        &yen;58,000
        </Typography>
        <Typography className={classes.subTitle}><LanguageConfig id="dashboardpage.Available" /></Typography>
      </Box>
    </Box>
  );

  return (
    <CmtCard className={classes.cardRoot}>
      <CmtCardHeader title={getTitle()}>
        <SummaryTabs tabValue={tabValue} setTabValue={setTabValue} />
      </CmtCardHeader>
      <RevenueSummaryGraph value={tabValue} />
    </CmtCard>
  );
};

export default RevenueSummary;
