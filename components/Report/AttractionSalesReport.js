import React, { useState, useEffect, useRef } from 'react';
import { TextField, Text, Card, Row, Column, Glyphi, Loader, CustomAlert, DemandDropDown } from '../../core';
import { Button, MenuItem } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useStore } from '../../helper/Store';
import { httpPostRequest } from '../../helper/JsHelper';
import { getAttractionSalesReportList, getAttractionSalesReportView, getAllBranches } from "../../helper/RequestPayLoadReports";
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
  const [reportStatus, setStatus] = useState('Y');

  const [showCol, setShowCol] = useState({
    [userConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: "SNO" },
    [reportConstants.PRODUCT_NAME]: { is_hide: false, bool: true, label: "Attraction Name" },
    [reportConstants.BOOKING_REFRENCE_NO]: { is_hide: false, bool: true, label: "Booking Refrence No" },
    [reportConstants.INV_DATE]: { is_hide: false, bool: true, label: "Date" },
    [reportConstants.SUPPLIER_NAME]: { is_hide: false, bool: true, label: "Name" },
    [reportConstants.SUPPLIER_ADDRESS]: { is_hide: false, bool: true, label: "Address" },
    [reportConstants.SUPPLIER_CITY_NAME]: { is_hide: false, bool: true, label: "City" },
    [reportConstants.SUPPLIER_STATE_NAME]: { is_hide: false, bool: true, label: "State" },
    [reportConstants.SUPPLIER_COUNTRY_NAME]: { is_hide: false, bool: true, label: "Country" },
    [reportConstants.SUPPLIER_POSTAL_CODE]: { is_hide: false, bool: true, label: "Postal Code" },
    [reportConstants.SUPPLIER_EMAIL_1]: { is_hide: false, bool: true, label: "email" },
    [reportConstants.PAY_STATUS]: { is_hide: false, bool: true, label: "Pay Status" },
    [reportConstants.CLIENT_CURRENCY]: { is_hide: false, bool: true, label: "Currency" },
    [reportConstants.CLIENT_SALE_PRICE]: { is_hide: false, bool: true, label: "Sale Price" },
    [reportConstants.CLIENT_SALE_PRICE_TAX_VALUE]: { is_hide: false, bool: true, label: "Sale Price Tax" },
    [reportConstants.CLIENT_SALE_PRICE_NET]: { is_hide: false, bool: true, label: "Sale Price Net" },
    [reportConstants.CLIENT_SALE_PROFIT]: { is_hide: false, bool: true, label: "Sale Profit" },
  });

  const prepareDate = date => {
    var today = date;
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = `${dd}-${mm}-${yyyy}`;
    return today;
  }

  const loadData = async (loader = null) => {
    setLoader(true);
    let sdate = prepareDate(startDate), edate = prepareDate(endDate);
    let res = await httpPostRequest(getAttractionSalesReportList(search_key, (currIndex - 1) * pageSize + 1, pageSize, sdate, edate, reportStatus, branch));
    console.log('razaa branch', res)
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200 && res[newConstants.DATA]) {
      setData(res[newConstants.DATA][reportConstants.SALES_DTLS]);
      setLoader(false);
      setMaxPage(
        res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
          parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
          0
          ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
          : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
      );

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
        preparedBranches.push({ value: data[reportConstants.CLIENT_BRANCH_KEY], label: data[reportConstants.CLIENT_BRANCH_NAME] })
      });
      setAllBranches(preparedBranches);
      if (branch === '') {
        setBranch(preparedBranches[0].value);
      }
    } else {
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  const generateBtnHandler = () => {
    setGenLoader(true);
    loadData(setGenLoader);
  }

  const viewBtnHandler = async () => {
    let res = await httpPostRequest(getAttractionSalesReportView({ sdate: prepareDate(startDate), edate: prepareDate(endDate), key: branch }));
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
    if (branch !== '')
      loadData();
  }, [search_key, pageSize, currIndex]);

  useEffect(() => {
    loadBranchesData();
  }, []);

  useEffect(() => {
    if (branch !== '')
      loadData();
  }, [branch]);

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

          salesReportFlag={true}
          endDate={endDate}
          setEndDate={setEndDate}
          reportStatus={reportStatus}
          setStatus={setStatus}
        />
      </Card>
      <ReportPrimaryContainerNew
        formName={"Attraction Sales Report"}
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
        colSpanValue={17}
      >
      </ReportPrimaryContainerNew>
    </div>
  );
}

