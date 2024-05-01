import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Text, Card, Row, Column, Loader, CustomAlert, DemandDropDown, SingelSelectOnDemand, TextField, TextArea } from '../../core';
import {
  Fade,
  Button,
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest, getDateYYYYMMDD } from '../../helper/JsHelper';
import {
  getAllJournalTransType,
  getJournalLedgerGroupType,
  getAccountsByKey,
  getModeOfPay,
  getMopKeyModeOfPayJournal,
  getAllJournal,
  createJournal,
  updateJournal,
  getJournalByKey,
  deleteJournal

} from '../../helper/RequestPayloadAccount';
import LanguageConfig from "../../helper/LanguageConfig";
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from '../PrimaryContainer';
import { EditRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  addEdit: {
    marginLeft: 4,
    marginRight: 4,
  },
  saveButton: {
    width: '40%',
    margin: 5,
    backgroundColor: "rgb(26, 43, 71);",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71);",
    },
  },
  addButton: {
    margin: 5,
    backgroundColor: '#364BFA',
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
    borderBottom: '1.2px solid #003399',
  },
  tableHeadTuple: {
    color: '#003399',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    textTransform: 'uppercase',
    width: 'clamp(150px,10vw,300px)',
    minWidth: 150
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
      padding: '6px 0px',
    },
  },
  Bold: {
    fontWeight: 'bold',
  },
  endPadd: {
    placeContent: 'flex-end',
    padding: 8,
  },
  editContainer: {
    margin: '0 0 10px 0px',
    width: '100%',
  },
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg } = useStore();
  const [deleteId, setDeleteId] = useState('');

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);



  const [showCol, setShowCol] = useState({
    [newConstants.TXN_REC_NUMBER]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.sno" /> },
    [newConstants.TXN_DATE]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.txndate" /> },
    [newConstants.TXN_TYPE]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.txntype" /> },
    [newConstants.MOP_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.mopname" /> },
    [newConstants.MOP_REMARK_FIELD1_CAPTION]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.caption1" /> },
    [newConstants.MOP_REMARK_FIELD2_CAPTION]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.caption2" /> },
    [newConstants.MOP_REMARKS_FIELD1_VALUE]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.remark1" /> },
    [newConstants.MOP_REMARKS_FIELD2_VALUE]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.remark2" /> },
    [newConstants.TXN_REMARK]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.txnremarks" /> },
    [newConstants.TXN_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.txnstatus" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.lastupdatedby" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgerjournal.lastupdatedon" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="ledgerjournal.action" /> },
  });
  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getAllJournal(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.LEDGER_JOURNALS]);
      setLoader(false);
      setMaxPage(
        res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
          parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
          0
          ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
          : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
      );
    } else {
      setLoader(false);
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgerjournal.tryagain" /> });
    }
  };

  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  const filter_data = data
    .map((value, index) =>
      (currIndex - 1) * pageSize <= value[newConstants.ROW_NUMBER] - 1 &&
        currIndex * pageSize > value[newConstants.ROW_NUMBER] - 1
        ? value
        : null,
    )
    .filter((f) => f != null);
  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };
  const editLedgerJournal = async (key) => {
    setAddEdit(false);
    let res = await httpPostRequest(getJournalByKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
    }
    setAddEdit(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  async function delLedgerMas() {
    const res = await httpPostRequest(deleteJournal(deleteId));
    setDeleteLoader(deleteId);
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setDeleteLoader('');
      loadData();
      setDeleteId('');
    } else {
      setDeleteLoader('');
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgerjournal.tryagain" /> });
    }
  }
  const updateShowCol = (e) => {
    setShowCol({ ...showCol, [e.target.name]: e.target.checked });
  };
  return (
    <div>
      {addEdit ? (
        <Card className={classes.editContainer}>
          <Column>
            <Fade in={addEdit}>
              <EditContainer
                loadData={loadData}
                editData={editData}
                setEditData={setEditData}
                languages={languages}
                setAlertMsg={setAlertMsg}
                addEdit={addEdit}
                setAddEdit={setAddEdit}
                classes={classes}
              />
            </Fade>
          </Column>
        </Card>
      ) : null}
      <PrimaryContainer
       formName={ editData!=null && addEdit==true ?formname +"-"+"(Update)":editData==null && addEdit==true?formname +"-"+"(Save)":formname}
        search_key={search_key}
        search={search}
        setAddEdit={setAddEdit}
        currIndex={currIndex}
        maxPage={maxPage}
        setCurrIndex={setCurrIndex}
        setPageSize={setPageSize}
        pageSize={pageSize}
        showCol={showCol}
        setShowCol={setShowCol}
        loadData={loadData}
        data={data}
        filter_object={newConstants.ROW_NUMBER}
        editRow={editLedgerJournal}
        deleteRow={setDeleteId}
        action_key={newConstants.TXN_MASTER_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="ledgerjournal.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delLedgerMas}
        />
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit, languages, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [transDetails, setTransDetails] = useState([])
  const [loader, setLoader] = useState(false);
  const [accountKey, setAccountKey] = useState(editData ? editData[newConstants.LEDGER_TRANS_DETAILS][newConstants.ACCOUNT_KEY] : "")
  const [ledgerKey, setLedgerKey] = useState(editData ? editData[newConstants.LEDGER_TRANS_DETAILS][newConstants.LEDGER_KEY] : "")
  const [mopFields, setMopFields] = useState(null)
  const [mopKey, setMopKey] = useState(editData ? editData["mop-master-key"] : "")
  const [mopData, setMopData] = useState([])
  const [ledgername, setLedgername] = useState("")
  const [accountName,setAccountName]=useState("")
  const [filterData,setFilterData]=useState(null)

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.TXN_DATE]: {
          value: "",
          is_require: true,
          error: false,
          type: "date",
          err_msg: ""
        },
        [newConstants.TXN_TYPE]: {
          value: "",
          is_require: true,
          error: false,
          type: "dropdown",
          err_msg: ""
        },
        [newConstants.MOP_MASTER_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TXN_REMARK]: {
          value: "",
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TXN_REC_AMOUNT]: {
          value: '',
          is_require: true,
          error: false,
          type: "number",
          err_msg: "",
        },

      });
      setTransDetails({
        [newConstants.LEDGER_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ACCOUNT_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TXN_AMOUNT]: {
          value: '',
          is_require: true,
          error: false,
          type: "number",
          err_msg: "",
        },
        [newConstants.LEDGER_NAME]: {
          value:ledgername && ledgername,
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.ACCOUNT_NAME]: {
          value:accountName && accountName,
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      });
    } else {
      setLocalFields({
        [newConstants.TXN_DATE]: {
          value: getDateYYYYMMDD(editData[newConstants.TXN_DATE]),
          is_require: true,
          error: false,
          type: "date",
          err_msg: ""
        },
        [newConstants.TXN_TYPE]: {
          value: editData[newConstants.TXN_TYPE].trim(),
          is_require: true,
          error: false,
          type: "dropdown",
          err_msg: ""
        },
        [newConstants.MOP_MASTER_KEY]: {
          value: editData[newConstants.MOP_MASTER_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TXN_REMARK]: {
          value: editData[newConstants.TXN_REMARK],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TXN_REC_AMOUNT]: {
          value: editData[newConstants.TXN_REC_AMOUNT],
          is_require: true,
          error: false,
          type: "number",
          err_msg: "",
        },
      });
      setTransDetails({
        [newConstants.LEDGER_KEY]: {
          value: editData[newConstants.LEDGER_TRANS_DETAILS][newConstants.LEDGER_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.LEDGER_NAME]: {
          value:ledgername && ledgername,
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.ACCOUNT_KEY]: {
          value: editData[newConstants.LEDGER_TRANS_DETAILS][newConstants.ACCOUNT_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ACCOUNT_NAME]: {
          value:accountName && accountName,
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TXN_AMOUNT]: {
          value: editData[newConstants.LEDGER_TRANS_DETAILS][newConstants.TXN_AMOUNT]!=null?editData[newConstants.LEDGER_TRANS_DETAILS][newConstants.TXN_AMOUNT]:"",
          is_require: true,
          error: false,
          type: "number",
          err_msg: "",
        },
      })

    }
  }, [editData]);

  // useEffect(()=>{},[ledgername,accountName])


  const stateUpdater = (e, tag) => {
    if (tag == "local") {
      let localFields_ = _.cloneDeep(localFields);
      if (e.target.value.length == 0) {
        localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
        localFields_[e.target.name].value = e.target.value;
      } else {
        localFields_[e.target.name].value = e.target.value;
        localFields_[e.target.name].error = false;
      }
      setLocalFields(localFields_);
    }
    else if (tag == "trans") {
      let transDetails_ = _.cloneDeep(transDetails);
      if (e.target.value.length == 0) {
        transDetails_[e.target.name].error = transDetails_[e.target.name].is_require ? true : false;
        transDetails_[e.target.name].value = e.target.value;
      } else {
        transDetails_[e.target.name].value = e.target.value;
        transDetails_[e.target.name].error = false;
      }
      setTransDetails(transDetails_);
    }
    else {
      let mopFields_ = _.cloneDeep(mopFields);
      if (e.target.value.length == 0) {
        mopFields_[e.target.name].error = mopFields_[e.target.name].is_require ? true : false;
        mopFields_[e.target.name].value = e.target.value;
      } else {
        mopFields_[e.target.name].value = e.target.value;
        mopFields_[e.target.name].error = false;
      }
      setMopFields(mopFields_);
    }
  };

  const getLedgersKey = async (ledgerKey) => {
    let res = await httpPostRequest(getAccountsByKey(ledgerKey));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {  
      setLedgername(res.data["ledger-name"])
    } else {
      setLedgername("")
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgerjournal.tryagain" /> });
    }
  }

  useEffect(() => {
    if (ledgerKey) {
      getLedgersKey(ledgerKey)
    }
  }, [ledgerKey])


  const generateJson = (val) => {
    console.log(val)
    const obj = {
      [newConstants.MOP_NAME]: {
        value: val != null ? val && val[newConstants.MOP_NAME] ? editData[newConstants.MOP_NAME] : val[newConstants.LEDGER_NAME] : "",
        is_require: false,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.MOP_REMARK_FIELD1_CAPTION]: {
        value: val != null ? val[newConstants.MOP_REMARK_FIELD1_CAPTION] : "",
        is_require: false,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.MOP_REMARK_FIELD2_CAPTION]: {
        value: val != null ? val[newConstants.MOP_REMARK_FIELD2_CAPTION] : "",
        is_require: false,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.MOP_REMARKS_FIELD1_VALUE]: {
        value: val != null ? val["mop-remarks-field1-value"] ? val["mop-remarks-field1-value"] : "" : "",
        is_require: val != null ? val["mop-remarks-field1-type"] == "M" ? true : false : true,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.MOP_REMARKS_FIELD2_VALUE]: {
        value: val != null ? val["mop-remarks-field2-value"] ? val["mop-remarks-field2-value"] : "" : "",
        is_require: val != null ? val["mop-remarks-field2-type"] == "M" ? true : false : true,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
    }
    setMopFields(obj)
  }

  const getMopDetails = async (mopKey) => {
    let transDetails_ = _.cloneDeep(transDetails);
    if (editData) {
      let tag = false
      for (let field in transDetails_) {
        if (transDetails_[field].value != editData[field]) {
          tag = true;
        }
      }
      setAccountKey(tag ? "" : editData[newConstants.LEDGER_TRANS_DETAILS][newConstants.ACCOUNT_KEY])
      if (tag) {
        transDetails_[newConstants.ACCOUNT_NAME].value = ""
        transDetails_[newConstants.ACCOUNT_KEY].value = ""
        setTransDetails(transDetails_)
        setMopData([])
        setAccountKey("")
        generateJson(null)
      }
      else {
        setMopData([])
        generateJson(null)
      }
    }
    else {
      transDetails_[newConstants.ACCOUNT_NAME].value = ""
      transDetails_[newConstants.ACCOUNT_KEY].value = ""
      setTransDetails(transDetails_)
      setMopData([])
      setAccountKey("")
      generateJson(null)
    }
    let res = await httpPostRequest(getMopKeyModeOfPayJournal(mopKey));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setMopData(res[newConstants.DATA])
      generateJson(null)
    } else {
      setMopData([])
      generateJson(null)
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgerjournal.tryagain" /> });
    }
  }


  useEffect(() => {
    if (mopKey != "") {
      getMopDetails(mopKey)
    }
  }, [mopKey])

  const getAccountDetails = (accountKey) => {
    let transDetails_ = _.cloneDeep(transDetails);
    let filterData_ = mopData.filter(f => f[newConstants.LEDGER_KEY] == accountKey)[0]
    setFilterData(filterData_)
    setAccountName(filterData_["ledger-name"])
    if (editData) {
      let obj_={};
      obj_[ "txn-amount"]=editData["ledger-trans-details"]["txn-amount"]
      obj_["ledger-key"]=editData["ledger-trans-details"]["ledger-key"]
      obj_[ "ledger-name"]=ledgername
      obj_["account-key"]=editData["ledger-trans-details"]["account-key"]
      obj_[ "account-name"]=filterData_["ledger-name"]
      console.log(obj_)
      console.log(transDetails)
      let tag = false
      for (let field in transDetails_) {
        if (transDetails_[field].value != obj_[field]) {
          tag = true;
        }
      }
      generateJson(tag ? filterData_ : editData)
    }
    else {
      generateJson(filterData_)
    }  
  
  }

  useEffect(() => {
    if (accountKey != "" && mopData.length>0 ) {
      getAccountDetails(accountKey)
    }
  }, [accountKey,mopData,ledgername,accountName,filterData])


  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    let transDetails_validation = _.cloneDeep(transDetails);
    transDetails_validation = validator(transDetails_validation);
    if (transDetails_validation.err) {
      setTransDetails(transDetails_validation.values);
    }

    let mopFields_validator = _.cloneDeep(mopFields);
    mopFields_validator = validator(mopFields_validator);
    if (mopFields_validator.err) {
      setMopFields(mopFields_validator.values);
    }

    if (!localFields_validation.err && !transDetails_validation.err && !mopFields_validator.err) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createJournal(localFields, transDetails, mopFields));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgerjournal.tryagain" /> });
        }
      } else {
        let res = await httpPostRequest(updateJournal(editData[newConstants.TXN_MASTER_KEY], localFields, transDetails, mopFields),
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgerjournal.tryagain" /> });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgerjournal.fillrequired" /> });
    }
  };

  return (
    <div>
      {localFields.hasOwnProperty(newConstants.TXN_DATE) ? (
        <Row padding={[10]}>
          <Column padding={[8]}>
            <Text bold size={16}>
              {editData ? <LanguageConfig id="ledgerjournal.editledgerjournal" /> : <LanguageConfig id="ledgerjournal.addledgerjournal" />}
            </Text>
          </Column>
          <Column padding={[10]}>
            <Row>
              <Column>
                <Row>
                  <Column md={3} padding={[10, 5]}>
                    <TextField
                      id="txn-date-id"
                      label={<LanguageConfig id="ledgerjournal.txndate" />}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      name={newConstants.TXN_DATE}
                      value={localFields[newConstants.TXN_DATE] && localFields[newConstants.TXN_DATE].value}
                      onChange={(e) => stateUpdater(e, "local")}
                      error={localFields[newConstants.TXN_DATE] && localFields[newConstants.TXN_DATE].error && localFields[newConstants.TXN_DATE].is_require}
                      helperText={
                        localFields[newConstants.TXN_DATE] && localFields[newConstants.TXN_DATE].error && localFields[newConstants.TXN_DATE].is_require
                          ? localFields[newConstants.TXN_DATE].err_msg
                          : ''
                      }
                      variant="outlined"
                      margin="dense"
                    />
                  </Column>
                  <Column md={3} padding={[10, 5]}>
                    <TransTypeKey
                      id="txn-type-id"
                      label={<LanguageConfig id="ledgerjournal.txntype" />}
                      name={newConstants.TXN_TYPE}
                      value={localFields[newConstants.TXN_TYPE] && localFields[newConstants.TXN_TYPE].value}
                      onChange={(e) => stateUpdater(e, "local")}
                      error={localFields[newConstants.TXN_TYPE] && localFields[newConstants.TXN_TYPE].error && localFields[newConstants.TXN_TYPE].is_require}
                      helperText={
                        localFields[newConstants.TXN_TYPE] &&  localFields[newConstants.TXN_TYPE].error && localFields[newConstants.TXN_TYPE].is_require
                          ? localFields[newConstants.TXN_TYPE].err_msg
                          : ''
                      } />
                  </Column>

                  <Column md={3} padding={[10, 5]}>
                    <LedgerGroupParent
                      id="ledger-ey-id"
                      label={<LanguageConfig id="ledgerjournal.ledgerjournal" />}
                      name={newConstants.LEDGER_KEY}
                      value={transDetails[newConstants.LEDGER_KEY] && transDetails[newConstants.LEDGER_KEY].value}
                      onChange={(e) => {
                        setLedgerKey(e.target.value)
                        stateUpdater(e, "trans")
                      }}
                      error={transDetails[newConstants.LEDGER_KEY] && transDetails[newConstants.LEDGER_KEY].error && transDetails[newConstants.LEDGER_KEY].is_require}
                      helperText={
                        transDetails[newConstants.LEDGER_KEY] && transDetails[newConstants.LEDGER_KEY].error && transDetails[newConstants.LEDGER_KEY].is_require
                          ? transDetails[newConstants.LEDGER_KEY].err_msg
                          : ''
                      }
                    />
                  </Column>
                  <>
                    <Column md={3} padding={[10, 5]}>
                      <TextField
                        id="ledger-name-id"
                        label="Ledger Name"
                        name={newConstants.LEDGER_NAME}
                        value={transDetails[newConstants.LEDGER_NAME].value=ledgername}
                        onChange={(e) => stateUpdater(e, "trans")}
                        error={transDetails[newConstants.LEDGER_NAME] && transDetails[newConstants.LEDGER_NAME].error && transDetails[newConstants.LEDGER_NAME].is_require}
                        helperText={
                          transDetails[newConstants.LEDGER_NAME] && transDetails[newConstants.LEDGER_NAME].error && transDetails[newConstants.LEDGER_NAME].is_require
                            ? transDetails[newConstants.LEDGER_NAME].err_msg
                            : ''
                        }
                        variant="outlined"
                        disabled={true}
                      />
                    </Column>

                  </>
                  <Column md={3} padding={[10, 5]}>
                    <TextField
                      id="txn-rec-amount-id"
                      label={<LanguageConfig id="ledgerjournal.txnrecamount" />}
                      type="number"
                      inputProps={{ min: 0 }}
                      name={newConstants.TXN_REC_AMOUNT}
                      value={localFields[newConstants.TXN_REC_AMOUNT] && localFields[newConstants.TXN_REC_AMOUNT].value}
                      onChange={(e) => stateUpdater(e, "local")}
                      error={localFields[newConstants.TXN_REC_AMOUNT] && localFields[newConstants.TXN_REC_AMOUNT].error && localFields[newConstants.TXN_REC_AMOUNT].is_require}
                      helperText={
                        localFields[newConstants.TXN_REC_AMOUNT] &&  localFields[newConstants.TXN_REC_AMOUNT].error && localFields[newConstants.TXN_REC_AMOUNT].is_require
                          ? localFields[newConstants.TXN_REC_AMOUNT].err_msg
                          : ''
                      }
                      variant="outlined"
                      margin="dense"
                    />
                  </Column>
                  <Column md={3} padding={[10, 5]}>
                    <TextField
                      id="txn-amount-id"
                      label={<LanguageConfig id="ledgerjournal.txnamount" />}
                      type="number"
                      inputProps={{ min: 0 }}
                      name={newConstants.TXN_AMOUNT}
                      // value={transDetails[newConstants.TXN_AMOUNT].value}
                      value={transDetails[newConstants.TXN_AMOUNT] && transDetails[newConstants.TXN_AMOUNT].value}
                      onChange={(e) => stateUpdater(e, "trans")}
                      error={transDetails[newConstants.TXN_AMOUNT] && transDetails[newConstants.TXN_AMOUNT].error && transDetails[newConstants.TXN_AMOUNT].is_require}
                      helperText={
                        transDetails[newConstants.TXN_AMOUNT] && transDetails[newConstants.TXN_AMOUNT].error && transDetails[newConstants.TXN_AMOUNT].is_require
                          ? transDetails[newConstants.TXN_AMOUNT].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </Column>
                  <Column md={3} padding={[10, 5]}>
                    <MopMasterKey
                      name={newConstants.MOP_MASTER_KEY}
                      value={localFields[newConstants.MOP_MASTER_KEY] && localFields[newConstants.MOP_MASTER_KEY].value}
                      onChange={(e) => {
                        setMopKey(e.target.value)
                        stateUpdater(e, "local")
                        // stateUpdater({target:{name:newConstants.ACCOUNT_KEY,value:""}},"local")
                      }}
                      error={localFields[newConstants.MOP_MASTER_KEY] && localFields[newConstants.MOP_MASTER_KEY].error && localFields[newConstants.MOP_MASTER_KEY].is_require}
                      helperText={
                        localFields[newConstants.MOP_MASTER_KEY] && localFields[newConstants.MOP_MASTER_KEY].error && localFields[newConstants.MOP_MASTER_KEY].is_require
                          ? localFields[newConstants.MOP_MASTER_KEY].err_msg
                          : ''
                      }
                      label={<LanguageConfig id="ledgerjournal.modofpay" />}
                    />
                  </Column>
                </Row>
              </Column>
              <Column>
                <Row>
                  <Column md={3} padding={[10, 5]}>
                    <MopAccount
                      id="account-key-id"
                      label={<LanguageConfig id="ledgerjournal.account" />}
                      mopData={mopData}
                      name={newConstants.ACCOUNT_KEY}
                      value={transDetails[newConstants.ACCOUNT_KEY] && transDetails[newConstants.ACCOUNT_KEY].value}

                      onChange={(e) => {
                        setAccountKey(e.target.value)
                        stateUpdater(e, "trans")
                      }}
                      error={transDetails[newConstants.ACCOUNT_KEY] && transDetails[newConstants.ACCOUNT_KEY].error && transDetails[newConstants.ACCOUNT_KEY].is_require}
                      helperText={
                        transDetails[newConstants.ACCOUNT_KEY] && transDetails[newConstants.ACCOUNT_KEY].error && transDetails[newConstants.ACCOUNT_KEY].is_require
                          ? transDetails[newConstants.ACCOUNT_KEY].err_msg
                          : ''
                      }
                    />
                  </Column>
                  <Column md={3} padding={[10, 5]}>
                    <TextField
                      id="account-name-id"
                      label="Account Name"
                      name={newConstants.ACCOUNT_NAME}
                      value={transDetails[newConstants.ACCOUNT_NAME].value=accountName}
                      onChange={(e) => stateUpdater(e, "trans")}
                      error={transDetails[newConstants.ACCOUNT_NAME] && transDetails[newConstants.ACCOUNT_NAME].error && transDetails[newConstants.ACCOUNT_NAME].is_require}
                      helperText={
                        transDetails[newConstants.ACCOUNT_NAME] && transDetails[newConstants.ACCOUNT_NAME].error && transDetails[newConstants.ACCOUNT_NAME].is_require
                          ? transDetails[newConstants.ACCOUNT_NAME].err_msg
                          : ''
                      }
                      variant="outlined"
                      disabled={ transDetails[newConstants.ACCOUNT_NAME].value?true:false}
                    />
                  </Column>
                  {mopFields &&
                    <>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          id="mop-name-id"
                          label="MOP Name"
                          name={newConstants.MOP_NAME}
                          value={mopFields[newConstants.MOP_NAME].value}
                          onChange={(e) => stateUpdater(e, "mop")}
                          error={mopFields[newConstants.MOP_NAME].error && mopFields[newConstants.MOP_NAME].is_require}
                          helperText={
                            mopFields[newConstants.MOP_NAME].error && mopFields[newConstants.MOP_NAME].is_require
                              ? mopFields[newConstants.MOP_NAME].err_msg
                              : ''
                          }
                          variant="outlined"
                          margin="dense"

                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          id="mop-remarks-field1-value-id"
                          label="Remark 1 Caption"
                          name={newConstants.MOP_REMARK_FIELD1_CAPTION}
                          value={mopFields[newConstants.MOP_REMARK_FIELD1_CAPTION].value}
                          onChange={(e) => stateUpdater(e, "mop")}
                          error={mopFields[newConstants.MOP_REMARK_FIELD1_CAPTION].error && mopFields[newConstants.MOP_REMARK_FIELD1_CAPTION].is_require}
                          helperText={
                            mopFields[newConstants.MOP_REMARK_FIELD1_CAPTION].error && mopFields[newConstants.MOP_REMARK_FIELD1_CAPTION].is_require
                              ? mopFields[newConstants.MOP_REMARK_FIELD1_CAPTION].err_msg
                              : ''
                          }
                          variant="outlined"
                          margin="dense"
                          disabled={true}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          id="mop-remarks-field2-caption-id"
                          label="Remark 2 Caption"
                          name={newConstants.MOP_REMARK_FIELD2_CAPTION}
                          value={mopFields[newConstants.MOP_REMARK_FIELD2_CAPTION].value}
                          onChange={(e) => stateUpdater(e, "mop")}
                          error={mopFields[newConstants.MOP_REMARK_FIELD2_CAPTION].error && mopFields[newConstants.MOP_REMARK_FIELD2_CAPTION].is_require}
                          helperText={
                            mopFields[newConstants.MOP_REMARK_FIELD2_CAPTION].error && mopFields[newConstants.MOP_REMARK_FIELD2_CAPTION].is_require
                              ? mopFields[newConstants.MOP_REMARK_FIELD2_CAPTION].err_msg
                              : ''
                          }
                          disabled={true}
                          variant="outlined"
                          margin="dense"
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          id="mop-remarks-field1-value-id"
                          label="Remark 1 Value"
                          name={newConstants.MOP_REMARKS_FIELD1_VALUE}
                          value={mopFields[newConstants.MOP_REMARKS_FIELD1_VALUE].value}
                          onChange={(e) => stateUpdater(e, "mop")}
                          error={mopFields[newConstants.MOP_REMARKS_FIELD1_VALUE].error && mopFields[newConstants.MOP_REMARKS_FIELD1_VALUE].is_require}
                          helperText={
                            mopFields[newConstants.MOP_REMARKS_FIELD1_VALUE].error && mopFields[newConstants.MOP_REMARKS_FIELD1_VALUE].is_require
                              ? mopFields[newConstants.MOP_REMARKS_FIELD1_VALUE].err_msg
                              : ''
                          }
                          variant="outlined"
                          margin="dense"
                        />
                      </Column>

                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          id="mop-remarks-field2-value-id"
                          label="Remark 2 Value"
                          name={newConstants.MOP_REMARKS_FIELD2_VALUE}
                          value={mopFields[newConstants.MOP_REMARKS_FIELD2_VALUE].value}
                          onChange={(e) => stateUpdater(e, "mop")}
                          error={mopFields[newConstants.MOP_REMARKS_FIELD2_VALUE].error && mopFields[newConstants.MOP_REMARKS_FIELD2_VALUE].is_require}
                          helperText={
                            mopFields[newConstants.MOP_REMARKS_FIELD2_VALUE].error && mopFields[newConstants.MOP_REMARKS_FIELD2_VALUE].is_require
                              ? mopFields[newConstants.MOP_REMARKS_FIELD2_VALUE].err_msg
                              : ''
                          }
                          variant="outlined"
                          margin="dense"
                        />
                      </Column>
                    </>}
                  <Column md={3} padding={[10, 5]}>
                    <TextField
                      id="txn-remark-id"
                      label={<LanguageConfig id="ledgerjournal.txnremarks" />}
                      name={newConstants.TXN_REMARK}
                      value={ localFields[newConstants.TXN_REMARK] && localFields[newConstants.TXN_REMARK].value}
                      onChange={(e) => stateUpdater(e, "local")}
                      error={localFields[newConstants.TXN_REMARK] && localFields[newConstants.TXN_REMARK].error && localFields[newConstants.TXN_REMARK].is_require}
                      helperText={
                        localFields[newConstants.TXN_REMARK] && localFields[newConstants.TXN_REMARK].error && localFields[newConstants.TXN_REMARK].is_require
                          ? localFields[newConstants.TXN_REMARK].err_msg
                          : ''
                      }
                      variant="outlined"

                    />
                  </Column>
                </Row>
              </Column>
              <Column right>
                <Row>
                  <Column md={9}></Column>
                  <Column right md={3}>
                    <Row bottom>
                      {mopFields &&
                        <Button
                          className={classes.saveButton}
                          variant="contained"
                          color="primary"
                          onClick={loader ? console.log('') : save}>
                          <Row>
                            {loader ? (
                              <Column md={1} xs={1} sm={1} center middle>
                                <Loader size={14} color={'white'} />
                              </Column>
                            ) : null}
                            <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} center middle sm={loader ? 11 : 12}>
                              {editData ? <LanguageConfig id="ledgerjournal.update" /> :"Save"}
                            </Column>
                          </Row>
                        </Button>}
                      <Button
                        onClick={() => {
                          setAddEdit(false);
                          setEditData(null);
                        }}
                        className={classes.closeButton}
                        variant="contained">
                        <LanguageConfig id="ledgerjournal.cancel" />
                      </Button>
                    </Row>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      ) : null}
    </div>
  );
};

const LedgerGroupParent = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);
  const { setAlertMsg } = useStore()
  useEffect(() => {
    ledgerGroupByKey();
  }, [value, defaultOptions]);

  useEffect(() => {
    loadLedgerGroup();
  }, []);
  const ledgerGroupByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getJournalLedgerGroupType(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue(res[newConstants.DATA][newConstants.LEDGER_ACCOUNTS].map((v) => ({
          value: v[newConstants.LEDGER_KEY],
          label: v[newConstants.LEDGER_NAME],
        })));
      }
      else {
        setSetectedValue([])
        setAlertMsg({ type: 'error', msg: "No ledgers matched" });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };
  const loadLedgerGroup = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getJournalLedgerGroupType(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.LEDGER_ACCOUNTS].map((v) => ({
            value: v[newConstants.LEDGER_KEY],
            label: v[newConstants.LEDGER_NAME],
          })),
        );
      }
      else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.LEDGER_ACCOUNTS].map((v) => ({
            value: v[newConstants.LEDGER_KEY],
            label: v[newConstants.LEDGER_NAME],
          }))
        );
      }
    }
    else {
      setDefaultOptions([])
      setAlertMsg({ type: 'error', msg: "No ledgers Found" });
    }
  };

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions.concat(selectValue ? [selectValue] : [])}
      value={selectValue}
      name={name}
      loadOptions={loadLedgerGroup}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const TransTypeKey = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  useEffect(() => {
    loadTransType();
  }, []);
  const loadTransType = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllJournalTransType(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA].map((v) => ({
            value: v[newConstants.TRANS_TYPE_VALUE],
            label: v[newConstants.TRANS_TYPE_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA].map((v) => ({
            value: v[newConstants.TRANS_TYPE_VALUE],
            label: v[newConstants.TRANS_TYPE_NAME],
          })),
        );
      }
    }
  };
  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
      name={name}
      loadOptions={loadTransType}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const MopMasterKey = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  useEffect(() => {
    loadRemark();
  }, [value]);
  const loadRemark = async () => {
    const res = await httpPostRequest(getModeOfPay());
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultOptions(
        res[newConstants.DATA][newConstants.MOP_MASTERS].map((v) => ({
          value: v[newConstants.MOP_MASTER_KEY],
          label: v[newConstants.MOP_NAME],
        })),
      )
    }
  };
  const loadOptions = (inputValue, callback) => {
    const filter_data = defaultOptions.filter((i) => i.value.toLowerCase().includes(inputValue.toLowerCase()));
    callback(filter_data);
  };
  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
      name={name}
      loadOptions={loadOptions}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const MopAccount = ({ name, value, onChange, error, helperText, label, mopData }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  useEffect(() => {
    loadMopAccount();
  }, [value, mopData]);

  const loadMopAccount = async () => {
    setDefaultOptions(
      mopData.map((v) => ({
        value: v[newConstants.LEDGER_KEY],
        label: v[newConstants.LEDGER_NAME],
      })),
    );
  };

  const loadOptions = (inputValue, callback) => {
    const filter_data = defaultOptions.filter((i) => i.value.toLowerCase().includes(inputValue.toLowerCase()));
    callback(filter_data);
  };

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
      name={name}
      loadOptions={loadOptions}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};