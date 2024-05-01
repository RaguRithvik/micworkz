import React, { useState } from 'react';
import CmtCard from '../../../@coremat/CmtCard';
import CmtCardHeader from '../../../@coremat/CmtCard/CmtCardHeader';
import CmtCardContent from '../../../@coremat/CmtCard/CmtCardContent';
import OrderTable from './OrderTable'; 
import PerfectScrollbar from 'react-perfect-scrollbar';
import { getTodayDate, getYesterdayDate } from '../../../@jumbo/utils/dateHelper';
import makeStyles from '@material-ui/core/styles/makeStyles';

const actions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Today',
    value: getTodayDate(),
  },
  {
    label: 'Yesterday',
    value: getYesterdayDate(),
  },
  {
    label: 'This Week',
    value: 'this_week',
  },
];

const useStyles = makeStyles((theme) => ({
  cardContentRoot: {
    padding: '0 !important',
  },
  titleRoot: {
    letterSpacing: 0.15,
  },
  scrollbarRoot: {
    height: 347,
  },
}));

const orders=[
  {
    orderId: 1,
    currency: '0.24 BTC',
    rate: '1 BTC = $740',
    date: getTodayDate(),
    fee: '-$2.33',
  },
  {
    orderId: 2,
    currency: '0.34 RPL',
    rate: '1 BTC = $740',
    date: getYesterdayDate(),
    fee: '-$2.33',
  },
  {
    orderId: 3,
    currency: '0.24 BTC',
    rate: '1 BTC = $740',
    date: '22.06.2020',
    fee: '-$2.33',
  },
  {
    orderId: 4,
    currency: '0.22 BTC',
    rate: '1 BTC = $740',
    date: '21.06.2020',
    fee: '-$2.33',
  },
  {
    orderId: 5,
    currency: '0.74 LTE',
    rate: '1 BTC = $740',
    date: '20.06.2020',
    fee: '-$2.33',
  },
]

const OrderHistory = () => {
  const [tableData, setTableData] = useState(orders);
  const classes = useStyles();

  const filterTableData = (event) => {
    switch (event.value) {
      case getTodayDate(): {
        return setTableData(orders.filter((item) => item.date === event.value));
      }
      case getYesterdayDate(): {
        return setTableData(orders.filter((item) => item.date === event.value));
      }
      case 'this_week': {
        return setTableData(
          orders.filter((item) => item.date !== getTodayDate() && item.date !== getYesterdayDate()),
        );
      }
      default:
        return setTableData(orders);
    }
  };

  return (
    <CmtCard>
      <CmtCardHeader
        className="pt-4"
        title="Order History"
        titleProps={{
          variant: 'h4',
          component: 'div',
          className: classes.titleRoot,
        }}
        actionsPos="top-corner"
        actions={actions}
        actionHandler={filterTableData}
      />
      <CmtCardContent className={classes.cardContentRoot}>
        <PerfectScrollbar className={classes.scrollbarRoot}>
          <OrderTable tableData={tableData} />
        </PerfectScrollbar>
      </CmtCardContent>
    </CmtCard>
  );
};

export default OrderHistory;
