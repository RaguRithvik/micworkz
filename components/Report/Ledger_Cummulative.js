import React, { useState, useEffect } from 'react';
import { Card} from '../../core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useStore } from '../../helper/Store';
import { httpPostRequest } from '../../helper/JsHelper';
import { getAllLedgersList, getLedgerCummulativeList, getLedgerCummulativeView, getAllBranches } from "../../helper/RequestPayLoadReports";
import { newConstants, constants, userConstants, reportConstants } from '../../helper/constants';
import ReportPrimaryContainerNew from '../ReportPrimaryContainerNew';
import FilterContainer from './FilterContainer';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    minWidth: 100,
    height: 40,
    margin: 5,
    backgroundColor: "rgb(26, 43, 71);",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71);",
    },
  },
  AddBtn: {
    padding: 10,
    backgroundColor: "rgb(26, 43, 71);",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71);",
    },
  },
  addButton: {
    margin: 5
  },
  closeButton: {
    margin: 5,
    width: '30%',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    height: 30,
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
  tableHead: {
    backgroundColor: '#ffffff',
    borderBottom: '1.2px solid' + theme.palette.primary.main,
  },
  tableHeadTuple: {
    color: theme.palette.grey.light,
    fontSize: '15px',
    fontWeight: '1000',
    padding: 15,
    width: 'clamp(150px,10vw,300px)',
    minWidth: 150,
  },
  actionButton: {
    margin: 3,
    backgroundColor: theme.palette.primary.main,
    minWidth: 50,
  },
  actionButtonDelete: {
    margin: 3,
    backgroundColor: theme.palette.error.main,
    minWidth: 50,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  columnCheck: {
    marginLeft: 10,
  },
  headerName: {
    borderRadius: 5,
    margin: '10px 0px',
  },
  addEdit: {
    margin: '0px 5px',
    backgroundColor: theme.palette.error.main,
  },
  searchCol: {
    alignContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      alignContent: 'end',
      padding: 6,
    },
  },
  endPadd: {
    placeContent: 'flex-end',
    padding: 8,
  },
  Bold: {
    fontWeight: 'bold',
  },
  editContainer: {
    margin: '0px 0px 10px 0px',
    width: '100%',
  },
}));

export default function Setup() {
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const { setAlertMsg } = useStore();

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [startDate, setStartDate] = useState(new Date(Date.now() - 864e5));
  const [endDate, setEndDate] = useState(new Date());
  const [branch, setBranch] = useState('');
  const [allBranches, setAllBranches] = useState([]);
  const [genLoader, setGenLoader] = useState(false);
  const [viewLoader, setViewLoader] = useState(false);

  // legder mechanism
  const [searchLedger, setSearchLedger] = useState('');
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [allLedgers, setAllLedgers] = useState([]);
  const [isOnLoad, setIsOnLoad] = useState(true);
  const [openBal, setOpenBal] = React.useState(0.00);
  const [closeBal, setCloseBal] = React.useState(0.00);

  const [showCol, setShowCol] = useState({
    [userConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: "SNO" },
    [reportConstants.TXN_REC_NO]: { is_hide: false, bool: true, label: "Reciept No" },
    [reportConstants.TXN_DATE]: { is_hide: false, bool: true, label: "Date" },
    [reportConstants.TXN_TYPE]: { is_hide: false, bool: true, label: "Type" },
    [reportConstants.MOP_NAME]: { is_hide: false, bool: true, label: "MOP" },
    [reportConstants.MOP_REMARKS_1_CAP]: { is_hide: false, bool: true, label: "MOP Remark 1" },
    [reportConstants.MOP_REMARKS_1_VALUE]: { is_hide: false, bool: true, label: "MOP Remark 1 Value" },
    [reportConstants.MOP_REMARKS_2_CAP]: { is_hide: false, bool: true, label: "MOP Remark 2" },
    [reportConstants.MOP_REMARKS_2_VALUE]: { is_hide: false, bool: true, label: "MOP Remark 2 Value" },
    [reportConstants.REMARKS]: { is_hide: false, bool: true, label: "Remarks" },
    [reportConstants.DEBIT_BAL]: { is_hide: false, bool: true, label: "Debit" },
    [reportConstants.CREDIT_BAL]: { is_hide: false, bool: true, label: "Credit" },
    [reportConstants.CUM_BAL]: { is_hide: false, bool: true, label: "Cumm. Bal" },
  });

  const prepareDate = date => {
    var today = date;
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = `${dd}-${mm}-${yyyy}`;
    return today;
  }

  const loadData = async (loader = null, key = null) => {
    setLoader(true);
    let sdate = prepareDate(startDate), edate = prepareDate(endDate);
    let ledger_key = key ? key : (selectedLedger !== null ? selectedLedger[reportConstants.LEDGER_KEY] : "");
    let res = await httpPostRequest(getLedgerCummulativeList(search_key, (currIndex - 1) * pageSize + 1, pageSize, sdate, edate, ledger_key, branch));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200 && res[newConstants.DATA]) {
      setData(res[newConstants.DATA][reportConstants.LEDGER_TRANS]);
      setLoader(false);
      setMaxPage(
        res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
          parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
          0
          ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
          : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
      );
      
      setOpenBal(res[newConstants.DATA][reportConstants.OPENING_BAL]);
      setCloseBal(res[newConstants.DATA][reportConstants.CLOSING_BAL]);

      loader != null && loader(false);
    } else {
      setLoader(false);
      setCurrIndex(1);
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      loader != null && loader(false);
    }
  };

  const loadBranchesData = async () => {
    let res = await httpPostRequest(getAllBranches());
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200 && res[newConstants.DATA]) {
      let branches = res[newConstants.DATA][reportConstants.CLIENT_BRANCHES];
      let preparedBranches = [];
      branches.map(data => {
        preparedBranches.push({value: data[reportConstants.CLIENT_BRANCH_KEY], label: data[reportConstants.CLIENT_BRANCH_NAME]})
      });
      setAllBranches(preparedBranches);
      if(branch === ''){
        setBranch(preparedBranches[0].value);
      }
    } else {
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  const getLedgers = async (callme = false) => {
    let body = {
      length: 100,
      start: 1,
      sort_column: 0,
      sort_direction: "ASC",
      search: searchLedger,
      active: "Y",
    };
    let res = await httpPostRequest(getAllLedgersList(body));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200 && res[newConstants.DATA]) {
      let data = res[newConstants.DATA]["ledger-accounts"]
      setAllLedgers(data);
      if (callme) {
        setSelectedLedger(data[0])
        if(branch !== ''){
          loadData(null, data[0]['ledger-key']);
        }
        setIsOnLoad(false);
      }
    } else {
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg }); 
      console.log('Get Ledger Error', res[newConstants.DATA_EXCEPTION]) 
    }
  }

  const generateBtnHandler = () => {
    setGenLoader(true);
    if(selectedLedger && selectedLedger[reportConstants.LEDGER_KEY]){
      loadData(setGenLoader);
    } else {
      setGenLoader(false);
      setAlertMsg({ type: 'error', msg: 'Please select the ledger!' }); 
    }
  }

  const viewBtnHandler = async () => {
    let res = await httpPostRequest(getLedgerCummulativeView({ sdate: prepareDate(startDate), edate: prepareDate(endDate), key: branch }));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200 && res[newConstants.DATA]) {
      setViewLoader(false);
      window.open(res[newConstants.DATA]["print-url"], '_blank');
    } else {
      setViewLoader(false);
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      console.log('Error', res[newConstants.DATA_EXCEPTION]);
    }
  }

  useEffect(() => {
    if (!isOnLoad) {
      getLedgers();
    }
  }, [searchLedger]);

  useEffect(() => {
    if(branch !== '' && !isOnLoad)
      loadData();
  }, [search_key, pageSize, currIndex]);

  useEffect(() => {
    loadBranchesData();
  }, []);

  useEffect(() => {
    if(branch !== '' && selectedLedger)
      loadData();
  }, [branch, selectedLedger]);

  useEffect(() => { getLedgers(true) }, []);

  useEffect(() => {
    if (!isOnLoad) {
      getLedgers();
    }
  }, [searchLedger]);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };

  return (
    <div>
      <Card margin={[0, 0, 10, 0]}>
        <FilterContainer
          loadData={loadData}
          setAlertMsg={setAlertMsg}
          classes={classes}
          startDate={startDate}
          setStartDate={setStartDate}
          branch={branch}
          setBranch={setBranch}
          allBranches={allBranches}
          genLoader={genLoader}
          viewLoader={viewLoader}
          viewBtnHandler={viewBtnHandler}
          generateBtnHandler={generateBtnHandler}

          legderCumm={true}
          endDate={endDate} 
          setEndDate={setEndDate}
          allLedgers={allLedgers}
          selectedLedger={selectedLedger} 
          setSelectedLedger={setSelectedLedger}
          searchLedger={searchLedger} 
          setSearchLedger={setSearchLedger}
        />
      </Card>
      <ReportPrimaryContainerNew
        formName={"Ledger Cummulative"}
        search_key={search_key}
        search={search}
        currIndex={currIndex}
        maxPage={maxPage}
        setCurrIndex={setCurrIndex}
        setPageSize={setPageSize}
        pageSize={pageSize}
        showCol={showCol}
        setShowCol={setShowCol}
        data={data}
        loader={loader}
        filter_object={userConstants.ROW_NUMBER}
        colSpanValue={13}
      >
      </ReportPrimaryContainerNew>
    </div>
  );
}

