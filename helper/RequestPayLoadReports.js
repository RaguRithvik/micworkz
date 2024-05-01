import { reportConstants, newBaseUrl, newConstants } from './constants';

const getLedgerAccountBalanceList = (search_key = '', start = 1, length = newConstants.PAGE_SIZE, date, branch_key) => {
  return {
    url: newBaseUrl + 'client/accounts/report/ledger-bal-report',
    pay_load: {
      [newConstants.DISPLAY_LENGTH]: length,
      [newConstants.DISPLAY_START]: start,
      [newConstants.SORT_COLUMN]: 0,
      [newConstants.SORT_DIRECTION]: 'ASC',
      [newConstants.SEARCH_TEXT]: search_key,
      [newConstants.IS_ACTIVE]: "A",
      [reportConstants.START_DATE]: date,
      [reportConstants.CLIENT_BRANCH_KEY]: branch_key,      
    },
  };
};

const getAllUsers = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
  return {
      url: newBaseUrl + 'client/users/get',
      pay_load: {
          [newConstants.DISPLAY_LENGTH]: length,
          [newConstants.DISPLAY_START]: start,
          [newConstants.SORT_COLUMN]: 0,
          [newConstants.SORT_DIRECTION]: 'ASC',
          [newConstants.SEARCH_TEXT]: search_key,
          [newConstants.IS_ACTIVE]: "A"
      },
  };
};

const getLedgerAccountBalanceView = ({ date, key }) => {
  return {
    url: newBaseUrl + 'client/accounts/report/ledger-bal-report/view',
    pay_load: {
      [reportConstants.START_DATE]: date,
      [reportConstants.CLIENT_BRANCH_KEY]: key,
    },
  };
};

const getAllLedgersList = ({ length, start, sort_column, sort_direction, search, active }) => {
  return {
    url: newBaseUrl + 'client/accounts/ledger/get',
    pay_load: {
      [reportConstants.DISPLAY_LENGTH]: length,
      [reportConstants.DISPLAY_START]: start,
      [reportConstants.SORT_COLUMN]: sort_column,
      [reportConstants.SORT_DIRECTION]: sort_direction,
      [reportConstants.SEARCH_TEXT]: search,
      [reportConstants.IS_ACTIVE]: active
    },
  };
};

const getLedgerCummulativeList = (search_key = '', start = 1, length = newConstants.PAGE_SIZE, sdate, edate, ledger_key, branch_key) => {
  return {
    url: newBaseUrl + 'client/accounts/report/ledger-cum-report',
    pay_load: {
      [reportConstants.DISPLAY_LENGTH]: length,
      [reportConstants.DISPLAY_START]: start,
      [reportConstants.SORT_COLUMN]: 0,
      [reportConstants.SORT_DIRECTION]: 'ASC',
      [reportConstants.SEARCH_TEXT]: search_key,
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.LEDGER_KEY]: ledger_key,
      [reportConstants.CLIENT_BRANCH_KEY]: branch_key,
    },
  };
};

const getLedgerCummulativeView = ({ sdate, edate, key }) => {
  return {
    url: newBaseUrl + 'client/accounts/report/ledger-cum-report/view',
    pay_load: {
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.CLIENT_BRANCH_KEY]: key,
    },
  };
};

const getLedgerCummulativeSummaryList = (search_key = '', start = 1, length = newConstants.PAGE_SIZE, sdate, edate, ledger_key, branch_key) => {
  return {
    url: newBaseUrl + 'client/accounts/report/ledger-cum-sum-report',
    pay_load: {
      [reportConstants.DISPLAY_LENGTH]: length,
      [reportConstants.DISPLAY_START]: start,
      [reportConstants.SORT_COLUMN]: 0,
      [reportConstants.SORT_DIRECTION]: 'ASC',
      [reportConstants.SEARCH_TEXT]: search_key,
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.LEDGER_KEY]: ledger_key,
      [reportConstants.CLIENT_BRANCH_KEY]: branch_key,
    },
  };
};

const getLedgerCummulativeSummaryView = ({ sdate, edate, key }) => {
  return {
    url: newBaseUrl + 'client/accounts/report/ledger-cum-sum-report/view',
    pay_load: {
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.CLIENT_BRANCH_KEY]: key,
    },
  };
};

const getLedgerJournalList = (search_key = '', start = 1, length = newConstants.PAGE_SIZE, sdate, edate, ledger_key, branch_key) => {
  return {
    url: newBaseUrl + 'client/accounts/report/ledger-journal',
    pay_load: {
      [reportConstants.DISPLAY_LENGTH]: length,
      [reportConstants.DISPLAY_START]: start,
      [reportConstants.SORT_COLUMN]: 0,
      [reportConstants.SORT_DIRECTION]: 'ASC',
      [reportConstants.SEARCH_TEXT]: search_key,
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.LEDGER_KEY]: ledger_key,
      [reportConstants.CLIENT_BRANCH_KEY]: branch_key,
    },
  };
};

const getLedgerJournalView = ({ sdate, edate, key }) => {
  return {
    url: newBaseUrl + 'client/accounts/report/ledger-journal/view',
    pay_load: {
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.CLIENT_BRANCH_KEY]: key,
    },
  };
};

const getLedgerExpenseList = (search_key = '', start = 1, length = newConstants.PAGE_SIZE, sdate, edate, ledger_key, branch_key) => {
  return {
    url: newBaseUrl + 'client/accounts/report/ledger-expense',
    pay_load: {
      [reportConstants.DISPLAY_LENGTH]: length,
      [reportConstants.DISPLAY_START]: start,
      [reportConstants.SORT_COLUMN]: 0,
      [reportConstants.SORT_DIRECTION]: 'ASC',
      [reportConstants.SEARCH_TEXT]: search_key,
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.LEDGER_KEY]: ledger_key,
      [reportConstants.CLIENT_BRANCH_KEY]: branch_key,
    },
  };
};

const getLedgerExpenseView = ({ sdate, edate, key }) => {
  return {
    url: newBaseUrl + 'client/accounts/report/ledger-expense/view',
    pay_load: {
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.CLIENT_BRANCH_KEY]: key,
    },
  };
};


const getSalesReportList = (search_key = '', start = 1, length = newConstants.PAGE_SIZE, sdate, edate, status, branch_key) => {
  return {
    url: newBaseUrl + 'client/sales-details/get',
    pay_load: {
      [reportConstants.DISPLAY_LENGTH]: length,
      [reportConstants.DISPLAY_START]: start,
      [reportConstants.SORT_COLUMN]: 0,
      [reportConstants.SORT_DIRECTION]: 'ASC',
      [reportConstants.SEARCH_TEXT]: search_key,
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.STATUS]: status,
      [reportConstants.CLIENT_BRANCH_KEY]: branch_key,
    },
  };
};

const getSalesReportView = ({ sdate, edate, key }) => {
  return {
    url: newBaseUrl + 'client/sales-details/view',
    pay_load: {
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.CLIENT_BRANCH_KEY]: key,
    },
  };
};

const getEventSalesReportList = (search_key = '', start = 1, length = newConstants.PAGE_SIZE, sdate, edate, status, branch_key) => {
  return {
    url: newBaseUrl + 'client/sales-details/event/get',
    pay_load: {
      [reportConstants.DISPLAY_LENGTH]: length,
      [reportConstants.DISPLAY_START]: start,
      [reportConstants.SORT_COLUMN]: 0,
      [reportConstants.SORT_DIRECTION]: 'ASC',
      [reportConstants.SEARCH_TEXT]: search_key,
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.STATUS]: status,
      [reportConstants.CLIENT_BRANCH_KEY]: branch_key,
    },
  };
};

const getEventSalesReportView = ({ sdate, edate, key }) => {
  return {
    url: newBaseUrl + 'client/sales-details/event/view',
    pay_load: {
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.CLIENT_BRANCH_KEY]: key,
    },
  };
};

const getAttractionSalesReportList = (search_key = '', start = 1, length = newConstants.PAGE_SIZE, sdate, edate, status, branch_key) => {
  return {
    url: newBaseUrl + 'client/sales-details/attraction/get',
    pay_load: {
      [reportConstants.DISPLAY_LENGTH]: length,
      [reportConstants.DISPLAY_START]: start,
      [reportConstants.SORT_COLUMN]: 0,
      [reportConstants.SORT_DIRECTION]: 'ASC',
      [reportConstants.SEARCH_TEXT]: search_key,
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.STATUS]: status,
      [reportConstants.CLIENT_BRANCH_KEY]: branch_key,
    },
  };
};

const getAttractionSalesReportView = ({ sdate, edate, key }) => {
  return {
    url: newBaseUrl + 'client/sales-details/attraction/view',
    pay_load: {
      [reportConstants.START_DATE]: sdate,
      [reportConstants.END_DATE]: edate,
      [reportConstants.CLIENT_BRANCH_KEY]: key,
    },
  };
};

const getAllBranches = () => {
  return {
    url: newBaseUrl + 'client/user/get-client-branches',
    pay_load: {},
  };
}

export {
  getLedgerAccountBalanceList,
  getLedgerAccountBalanceView,
  getAllLedgersList,
  getLedgerCummulativeList,
  getLedgerCummulativeView,
  getLedgerCummulativeSummaryList,
  getLedgerCummulativeSummaryView,
  getLedgerJournalList,
  getLedgerJournalView,
  getLedgerExpenseList,
  getLedgerExpenseView,
  getSalesReportList,
  getSalesReportView,
  getEventSalesReportList,
  getEventSalesReportView,
  getAttractionSalesReportList,
  getAttractionSalesReportView,
  getAllUsers,
  getAllBranches
};
