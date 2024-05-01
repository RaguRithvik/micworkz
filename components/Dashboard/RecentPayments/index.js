import React from 'react';
import CmtCard from '../../../@coremat/CmtCard';
import CmtCardHeader from '../../../@coremat/CmtCard/CmtCardHeader';
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';
import CmtCardContent from '../../../@coremat/CmtCard/CmtCardContent';
import RecentPaymentsTable from './RecentPaymentsTable';
import PerfectScrollbar from 'react-perfect-scrollbar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import LanguageConfig from "../../../helper/LanguageConfig"

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    [theme.breakpoints.down('xs')]: {
      '& .Cmt-header-root': {
        flexDirection: 'column',
      },
      '& .Cmt-action-default-menu': {
        marginLeft: 0,
        marginTop: 10,
      },
    },
  },
  cardContentRoot: {
    padding: 0,
  },
  scrollbarRoot: {
    height: 275,
  },
}));

const RecentPayments = () => {
  const classes = useStyles();
  return (
    <CmtCard className={classes.cardRoot}>
      <CmtCardHeader
        className="pt-4"
        title={<LanguageConfig id="dashboardpage.recentbooking" />}
        titleProps={{
          variant: 'h4',
          component: 'div',
        }}>
        <Box clone>
          <Button color="primary">
            <AddIcon />
            <Box component="span" ml={2}>
              <LanguageConfig id="dashboardpage.addnew" />
            </Box>
          </Button>
        </Box>
      </CmtCardHeader>
      <CmtCardContent className={classes.cardContentRoot}>
        <PerfectScrollbar className={classes.scrollbarRoot}>
          <RecentPaymentsTable />
        </PerfectScrollbar>
      </CmtCardContent>
    </CmtCard>
  );
};

export default RecentPayments;
