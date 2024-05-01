import React, { useState, useEffect } from 'react';
import { Text,TextField, Card, Row, Column, Loader, CustomAlert, DemandDropDown,SingelSelectOnDemand } from '../../core';
import {
  Fade,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Create, Delete, Add, Remove } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import {
  getAllBankMaster,
  getBankMasterByKey,
  deleteBankMaster,
  updateBankMaster,
  createBankMaster,
  getLedgerGroupByParentBank,
} from '../../helper/RequestPayLoad';
import LanguageConfig from "../../helper/LanguageConfig";
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from '../PrimaryContainer';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    minWidth: 140,
    height: 40,
    margin: 5, 
    width: '30%',
  },
  addButton: {
    margin: 5
  },
  closeButton: {
    margin: 5,
    width: '30%',
  },
  tableHead: {
    backgroundColor: '#ffffff',
    borderBottom: '1.2px solid' + theme.palette.primary.main,
  },
  tableHeadTuple: {
    color: '#003399',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    textTransform: 'uppercase',
    width: 'clamp(150px,10vw,300px)',
    minWidth:150,
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
  const { languages, setAlertMsg, formname } = useStore();
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState('');
  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUMBER]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.sno"/>  },
    [newConstants.BANK_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.bankname"/> },
    [newConstants.BANK_ACCOUNT_NO]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.accountno"/>},
    [newConstants.BANK_ADDRESS]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.address"/>},
    [newConstants.BANK_CITY_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.city"/>},
    [newConstants.BANK_STATE_NAME]: { is_hide: false, bool: true, label:  <LanguageConfig id="bankmaster.state"/>},
    [newConstants.BANK_COUNTRY_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.country"/>},
    [newConstants.BANK_POSTCODE]: { is_hide: false, bool: true, label: <LanguageConfig id= "bankmaster.postcode"/>},
    [newConstants.BANK_TEL]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.contact"/>},
    [newConstants.BANK_FAX]: { is_hide: false, bool: true, label:<LanguageConfig id="bankmaster.bankfax"/>},
    [newConstants.BANK_EMAIL]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.email"/>},
    [newConstants.BANK_BRANCH_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.branchname"/>},
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.status"/>},
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.lastupdatedby"/>},
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="bankmaster.lastupdatedon"/>},
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="bankmaster.action"/>},
  });

  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getAllBankMaster(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.ADMIN_BANKS]);
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
      setAlertMsg({ type: 'error', msg:  <LanguageConfig id="bankmaster.tryagain"/> });
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

  const editBankMaster = async (key) => {
    let res = await httpPostRequest(getBankMasterByKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function delBankMaster() {
    if (deleteId != '') {
      const res = await httpPostRequest(deleteBankMaster(deleteId));
      setDeleteLoader(deleteId);
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setDeleteId('');
        setDeleteLoader('');
        loadData();
      } else {
        setDeleteId('');
        setDeleteLoader('');
        setAlertMsg({ type: 'error', msg:  <LanguageConfig id="bankmaster.tryagain"/>  });
      }
    } else {
      setDeleteId('');
    }
  }
  const updateShowCol = (e) => {
    setShowCol({ ...showCol, [e.target.name]: e.target.checked });
  };
  return (
    <div>
          <Card margin={[0,0,10,0]}>   
            {addEdit ? (
              <Card  className={classes.editContainer}>
                <Column padding={[10]}>
                  <Fade in={addEdit}>
                    <EditContainer
                      languages={languages}
                      classes={classes}
                      editData={editData}
                      setEditData={setEditData}
                      addEdit={addEdit}
                      setAddEdit={setAddEdit}
                      setAlertMsg={setAlertMsg}
                    />
                  </Fade>
                </Column>
              </Card>
            ) : null}
            </Card>
      <PrimaryContainer
        formName={ editData!=null && addEdit==true ?formname +"-"+"(Update)":editData==null && addEdit==true?formname +"-"+"(Save)":formname}
        search_key={search_key}
        search={search}
        addEdit={addEdit}
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
        editRow={editBankMaster}
        deleteRow={setDeleteId}
        action_key={newConstants.BANK_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
       
          <CustomAlert
            message={<LanguageConfig id= "bankmaster.deletemsg"/>}
            open={deleteId != ''}
            setOpen={setDeleteId}
            action={delBankMaster}
          />

      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, languages, editData, setEditData, addEdit, setAddEdit, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const { Language,Country,Province,City,Currency } = DemandDropDown;
  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.BANK_NAME]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.LEDGER_GROUP_KEY]:{
            value:"",
            is_require:true,
            error:false,
            type:"dropdown",
            err_msg:""
        },
        [newConstants.BANK_ACCOUNT_NO]:{
            value: '',
            is_require: true,
            error: false,
            min_length: 4,
            max_length: 20,
            type: 'text',
            err_msg: '',
        },
        [newConstants.BANK_ADDRESS]:{
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length:null,
            type: 'text',
            err_msg: '',
        },
        [newConstants.LEDGER_CURRENCY_CODE]:{
            value:"",
            is_require:true,
            error:false,
            type:"dropdown",
            err_msg:""
        },
        [newConstants.BANK_COUNTRY_KEY]:{
            value:"",
            is_require:true,
            error:false,
            type:"dropdown",
            err_msg:""
        },
        [newConstants.BANK_PROVINCE_KEY]:{
            value:"",
            is_require:true,
            error:false,
            type:"dropdown",
            err_msg:""
        },
        
        [newConstants.BANK_CITY_KEY]:{
            value:"",
            is_require:true,
            error:false,
            type:"dropdown",
            err_msg:""
        },
        [newConstants.BANK_POSTCODE]:{
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length:null,
            type: 'text',
            err_msg: '',
        },
        [newConstants.BANK_TEL]:{
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length:null,
            type: 'text',
            err_msg: '',
        },
        [newConstants.BANK_FAX]:{
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length:null,
            type: 'text',
            err_msg: '',
        },
        [newConstants.BANK_EMAIL]:{
            value: '',
            is_require: true,
            error: false,
            type: 'email',
            err_msg: '',
        },
        [newConstants.BANK_BRANCH_NAME]:{
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length:null,
            type: 'text',
            err_msg: '',
        }
      });
      setMultiLanguage([
        {
          [newConstants.LANG_CODE]: {
            value: '',
            is_require: false,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.BANK_NAME]: {
            value: '',
            is_require: false,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.BANK_BRANCH_NAME]: {
            value: '',
            is_require: false,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
        },
      ]);
    } else {
      setLocalFields({
        [newConstants.BANK_NAME]: {
            value: editData[newConstants.BANK_NAME],
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.LEDGER_GROUP_KEY]:{
              value:editData[newConstants.LEDGER_GROUP_KEY],
              is_require:true,
              error:false,
              type:"dropdown",
              err_msg:""
          },
          [newConstants.BANK_ACCOUNT_NO]:{
              value: editData[newConstants.BANK_ACCOUNT_NO],
              is_require: true,
              error: false,
              min_length: 4,
              max_length: 20,
              type: 'text',
              err_msg: '',
          },
          [newConstants.BANK_ADDRESS]:{
              value: editData[newConstants.BANK_ADDRESS],
              is_require: true,
              error: false,
              min_length: 2,
              max_length:null,
              type: 'text',
              err_msg: '',
          },
          [newConstants.LEDGER_CURRENCY_CODE]:{
              value:editData[newConstants.LEDGER_CURRENCY_CODE],
              is_require:true,
              error:false,
              type:"dropdown",
              err_msg:""
          },
          [newConstants.BANK_COUNTRY_KEY]:{
              value:editData[newConstants.BANK_COUNTRY_KEY],
              is_require:true,
              error:false,
              type:"dropdown",
              err_msg:""
          },
          [newConstants.BANK_PROVINCE_KEY]:{
              value:editData[newConstants.BANK_PROVINCE_KEY],
              is_require:true,
              error:false,
              type:"dropdown",
              err_msg:""
          },
          
          [newConstants.BANK_CITY_KEY]:{
              value:editData[newConstants.BANK_CITY_KEY],
              is_require:true,
              error:false,
              type:"dropdown",
              err_msg:""
          },
          [newConstants.BANK_POSTCODE]:{
              value: editData[newConstants.BANK_POSTCODE],
              is_require: true,
              error: false,
              min_length: 2,
              max_length:null,
              type: 'text',
              err_msg: '',
          },
          [newConstants.BANK_TEL]:{
              value: editData[newConstants.BANK_TEL],
              is_require: true,
              error: false,
              min_length: 2,
              max_length:null,
              type: 'text',
              err_msg: '',
          },
          [newConstants.BANK_FAX]:{
              value: editData[newConstants.BANK_FAX],
              is_require: true,
              error: false,
              min_length: 2,
              max_length:null,
              type: 'text',
              err_msg: '',
          },
          [newConstants.BANK_EMAIL]:{
              value: editData[newConstants.BANK_EMAIL],
              is_require: true,
              error: false,
              type: 'email',
              err_msg: '',
          },
          [newConstants.BANK_BRANCH_NAME]:{
              value: editData[newConstants.BANK_BRANCH_NAME],
              is_require: true,
              error: false,
              min_length: 2,
              max_length:null,
              type: 'text',
              err_msg: '',
          },
          [newConstants.IS_ACTIVE]:{
              value:editData[newConstants.IS_ACTIVE],
              is_require:true,
              error:false,
              type:"boolean",
              err_msg:""
          }
      });
      let bank_mas_lang_ = [];
      if (editData[newConstants.BANK_LANGUAGES] && editData[newConstants.BANK_LANGUAGES].length) {
        editData[newConstants.BANK_LANGUAGES].forEach((value) => {
          bank_mas_lang_.push({
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: false,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.BANK_NAME]: {
              value: value[newConstants.BANK_NAME],
              is_require: false,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.BANK_BRANCH_NAME]: {
              value: value[newConstants.BANK_BRANCH_NAME],
              is_require: false,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
          });
        });
      } else {
        bank_mas_lang_.push({
            [newConstants.LANG_CODE]: {
                value: "",
                is_require: false,
                error: false,
                type: 'dropdown',
                err_msg: '',
              },
              [newConstants.BANK_NAME]: {
                value: "",
                is_require: false,
                error: false,
                min_length: 2,
                max_length: null,
                type: 'text',
                err_msg: '',
              },
              [newConstants.BANK_BRANCH_NAME]: {
                value: "",
                is_require: false,
                error: false,
                min_length: 2,
                max_length: null,
                type: 'text',
                err_msg: '',
              },
        });
      }
      setMultiLanguage(bank_mas_lang_);
    }
  }, [editData]);

  const stateUpdater = (e) => {
    let localFields_ = _.cloneDeep(localFields);
    if (e.target.value.length == 0) {
      localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
      localFields_[e.target.name].value = e.target.value;
    } else {
      localFields_[e.target.name].value = e.target.value;
      localFields_[e.target.name].error = false;
    }
    setLocalFields(localFields_);
  };
  function languageStateUpdater(e, index) {
    let multi_language_ = _.cloneDeep(multi_language);
    if (e.target.value.length == 0) {
      multi_language_[index][e.target.name].error = multi_language_[index][e.target.name].is_require ? true : false;
      multi_language_[index][e.target.name].value = e.target.value;
    } else {
      multi_language_[index][e.target.name].value = e.target.value;
      multi_language_[index][e.target.name].error = false;
    }
    setMultiLanguage(multi_language_);
  }

  function removeMultiLanguage(index_) {
    let multi_language_ = _.cloneDeep(multi_language);
    if (multi_language_.length > 1) {
      multi_language_ = multi_language_.map((val, index) => (index != index_ ? val : null));
      setMultiLanguage(multi_language_.filter((f) => f != null));
    }
  }

  const addMultiLanguage = () => {
    let multi_language_ = _.cloneDeep(multi_language);
    if (
      languages.filter((f) => !multi_language.map((val) => val[newConstants.LANG_CODE].value).includes(f.value)).length &&
      multi_language.length < languages.length
    ) {
      multi_language_.push({
        [newConstants.LANG_CODE]: {
          value: '',
          is_require: false,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.BANK_NAME]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.BANK_BRANCH_NAME]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      });
      setMultiLanguage(multi_language_);
    }
  };
  const save = async () => {
    let multi_language_validator = _.cloneDeep(multi_language);
    multi_language_validator = multi_language_validator.map((value) => validator(value));

    if (multi_language_validator.filter((f) => f.err == true).length) {
      setMultiLanguage(multi_language_validator.map((value) => value.values));
    }

    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    if (!localFields_validation.err && multi_language_validator.filter((f) => f.err).length == 0) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createBankMaster(localFields, multi_language));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:<LanguageConfig id= "bankmaster.tryagain"/> });
        }
      } else {
        let res = await httpPostRequest(updateBankMaster(editData[newConstants.BANK_KEY], localFields, multi_language));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:<LanguageConfig id= "bankmaster.tryagain"/> });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg:<LanguageConfig id= "bankmaster.fillrequired"/> });
    }
  };
  return (
    <div>
      {localFields.hasOwnProperty(newConstants.BANK_NAME) ? (
        <Row padding={[10]}>
          <Column padding={[8]} margin={[0, 0, 10, 0]}>
            <Text bold size={16}>
              {editData ? <LanguageConfig id= "bankmaster.editbankmaster"/> : <LanguageConfig id="bankmaster.addbankmaster"/>}
            </Text>
          </Column>
          <Column>
            <Row>
              <Column md={3} padding={[10,5]}>
                <TextField
                  id="bank-name-id"
                  label={<LanguageConfig id={"bankmaster.bankname"}/>}
                  name={newConstants.BANK_NAME}
                  value={localFields[newConstants.BANK_NAME].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_NAME].error}
                  helperText={
                    localFields[newConstants.BANK_NAME].error
                      ? localFields[newConstants.BANK_NAME].err_msg
                      : ''
                  }
                  variant="outlined"
                  margin="dense"
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <TextField
                  id="bank-branch-name-id"
                  label={<LanguageConfig id={"bankmaster.bankbranchname"}/>}
                  name={newConstants.BANK_BRANCH_NAME}
                  value={localFields[newConstants.BANK_BRANCH_NAME].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_BRANCH_NAME].error}
                  helperText={
                    localFields[newConstants.BANK_BRANCH_NAME].error
                      ? localFields[newConstants.BANK_BRANCH_NAME].err_msg
                      : ''
                  }
                  variant="outlined"
                  margin="dense"
                />
                </Column>
                <Column md={3} padding={[10, 5]}>
                <LedgerGroupBank
                  name={newConstants.LEDGER_GROUP_KEY}
                  value={localFields[newConstants.LEDGER_GROUP_KEY].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.LEDGER_GROUP_KEY].error}
                  helperText={
                    localFields[newConstants.LEDGER_GROUP_KEY].error
                      ? localFields[newConstants.LEDGER_GROUP_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id={"bankmaster.ledgergroup"}/>}
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <TextField
                  id="account-no-id"
                  label={<LanguageConfig id={"bankmaster.accountno"}/>}
                  name={newConstants.BANK_ACCOUNT_NO}
                  value={localFields[newConstants.BANK_ACCOUNT_NO].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_ACCOUNT_NO].error}
                  helperText={
                    localFields[newConstants.BANK_ACCOUNT_NO].error
                      ? localFields[newConstants.BANK_ACCOUNT_NO].err_msg
                      : ''
                  }
                  variant="outlined"
                  margin="dense"
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <TextField
                  id="bank-address-id"
                  label={<LanguageConfig id={"bankmaster.bankaddress"}/>}
                  name={newConstants.BANK_ADDRESS}
                  value={localFields[newConstants.BANK_ADDRESS].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_ADDRESS].error}
                  helperText={
                    localFields[newConstants.BANK_ADDRESS].error
                      ? localFields[newConstants.BANK_ADDRESS].err_msg
                      : ''
                  }
                  variant="outlined"
                  margin="dense"
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <Currency
                  id="currency-id"
                  label={<LanguageConfig id={"bankmaster.currency"}/>}
                  name={newConstants.LEDGER_CURRENCY_CODE}
                  currency={localFields[newConstants.LEDGER_CURRENCY_CODE].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.LEDGER_CURRENCY_CODE].error}
                  helperText={
                    localFields[newConstants.LEDGER_CURRENCY_CODE].error
                      ? localFields[newConstants.LEDGER_CURRENCY_CODE].err_msg
                      : ''
                  }
                  variant="outlined"
                  margin="dense"
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <Country
                  id="country-id"
                  label={<LanguageConfig id={"bankmaster.country"}/>}
                  name={newConstants.BANK_COUNTRY_KEY}
                  value={localFields[newConstants.BANK_COUNTRY_KEY].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_COUNTRY_KEY].error}
                  helperText={
                    localFields[newConstants.BANK_COUNTRY_KEY].error
                      ? localFields[newConstants.BANK_COUNTRY_KEY].err_msg
                      : ''
                  }
                  
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <Province
                  id="province-id"
                  label={<LanguageConfig id={"bankmaster.state"}/>}
                  name={newConstants.BANK_PROVINCE_KEY}
                  value={localFields[newConstants.BANK_PROVINCE_KEY].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_PROVINCE_KEY].error}
                  country_key={localFields[newConstants.BANK_COUNTRY_KEY].value}
                  helperText={
                    localFields[newConstants.BANK_PROVINCE_KEY].error
                      ? localFields[newConstants.BANK_PROVINCE_KEY].err_msg
                      : ''
                  }
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <City
                  id="city-id"
                  label={<LanguageConfig id={"bankmaster.city"}/>}
                  name={newConstants.BANK_CITY_KEY}
                  value={localFields[newConstants.BANK_CITY_KEY].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_CITY_KEY].error}
                  country_key={localFields[newConstants.BANK_COUNTRY_KEY].value}
                  helperText={
                    localFields[newConstants.BANK_CITY_KEY].error
                      ? localFields[newConstants.BANK_CITY_KEY].err_msg
                      : ''
                  }
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <TextField
                  id="postcode-id"
                  label={<LanguageConfig id={"bankmaster.postcode"}/>}
                  name={newConstants.BANK_POSTCODE}
                  value={localFields[newConstants.BANK_POSTCODE].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_POSTCODE].error}
                  helperText={
                    localFields[newConstants.BANK_POSTCODE].error
                      ? localFields[newConstants.BANK_POSTCODE].err_msg
                      : ''
                  }
                  variant="outlined"
                  margin="dense"
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <TextField
                  id="tel-id"
                  label={<LanguageConfig id={"bankmaster.banktelephoneno"}/>}
                  name={newConstants.BANK_TEL}
                  value={localFields[newConstants.BANK_TEL].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_TEL].error}
                  helperText={
                    localFields[newConstants.BANK_TEL].error
                      ? localFields[newConstants.BANK_TEL].err_msg
                      : ''
                  }
                  variant="outlined"
                  margin="dense"
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <TextField
                  id="fax-id"
                  label={<LanguageConfig id={"bankmaster.bankfax"}/>}
                  name={newConstants.BANK_FAX}
                  value={localFields[newConstants.BANK_FAX].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_FAX].error}
                  helperText={
                    localFields[newConstants.BANK_FAX].error
                      ? localFields[newConstants.BANK_FAX].err_msg
                      : ''
                  }
                  variant="outlined"
                  margin="dense"
                />
                </Column>
                <Column md={3} padding={[10,5]}>
                <TextField
                  id="email-id"
                  label={<LanguageConfig id={"bankmaster.bankemail"}/>}
                  name={newConstants.BANK_EMAIL}
                  value={localFields[newConstants.BANK_EMAIL].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.BANK_EMAIL].error}
                  helperText={
                    localFields[newConstants.BANK_EMAIL].error
                      ? localFields[newConstants.BANK_EMAIL].err_msg
                      : ''
                  }
                  variant="outlined"
                  margin="dense"
                />
                </Column>
                {editData ? (
                  <Column center>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={localFields[newConstants.IS_ACTIVE].value}
                          color="primary"
                          onChange={() =>
                            setLocalFields({
                              ...localFields,
                              [newConstants.IS_ACTIVE]: {
                                ...localFields[newConstants.IS_ACTIVE],
                                value: !localFields[newConstants.IS_ACTIVE].value,
                              },
                            })
                          }
                          name={newConstants.IS_ACTIVE}
                        />
                      }
                      label={<LanguageConfig id={"bankmaster.isactive"}/>}
                    />
                  </Column>
                ) : (
                  ''
                )}
                
              
              <Column>
                <Row>
                  <Column padding={[0, 7, 7, 7]} margin={[10, 0]}>
                    <Text size={14} bold>
                      Languages
                    </Text>
                  </Column>
                  {multi_language.map((value, index) => (
                    <Column md={4} padding={[5]} key={index + 'lang_code'}>
                      <Card padding={[10]}>
                        <Row>
                          <Column padding={[5]}>
                            <Language
                              options={languages.filter(
                                (f) =>
                                  f.value == value[newConstants.LANG_CODE].value ||
                                  !multi_language.map((val) => val[newConstants.LANG_CODE].value).includes(f.value),
                              )}
                              value={value[newConstants.LANG_CODE].value}
                              name={newConstants.LANG_CODE}
                              error={value[newConstants.LANG_CODE].is_require && value[newConstants.LANG_CODE].error}
                              onChange={(e) => languageStateUpdater(e, index)}
                              helperText={
                                value[newConstants.LANG_CODE].is_require && value[newConstants.LANG_CODE].error ? value[newConstants.LANG_CODE].err_msg : ''
                              }
                              label={<LanguageConfig id={"bankmaster.languagecode"}/>}
                            />
                          </Column>
                          <Column padding={[5]}>
                            <TextField
                              id={'bank-master-lang-id' + index}
                              label={<LanguageConfig id={"bankmaster.bankname"}/>}
                              value={value[newConstants.BANK_NAME].value}
                              name={newConstants.BANK_NAME}
                              error={value[newConstants.BANK_NAME].error}
                              onChange={(e) => languageStateUpdater(e, index)}
                              helperText={
                                 value[newConstants.BANK_NAME].error
                                  ? value[newConstants.BANK_NAME].err_msg
                                  : ''
                              }
                              variant="outlined"
                              margin="dense"
                            />
                          </Column>
                          <Column padding={[5]}>
                            <TextField
                              id={'bank-branch-lang-id' + index}
                              label={<LanguageConfig id={"bankmaster.bankbranchname"}/>}
                              value={value[newConstants.BANK_BRANCH_NAME].value}
                              name={newConstants.BANK_BRANCH_NAME}
                              error={ value[newConstants.BANK_BRANCH_NAME].error}
                              onChange={(e) => languageStateUpdater(e, index)}
                              helperText={
                                 value[newConstants.BANK_BRANCH_NAME].error
                                  ? value[newConstants.BANK_BRANCH_NAME].err_msg
                                  : ''
                              }
                              variant="outlined"
                              margin="dense"
                            />
                          </Column>
                          <Column
                            md={multi_language.length > 1 && multi_language.length - 1 == index ? 6 : 9}
                            xs={multi_language.length > 1 && multi_language.length - 1 == index ? 5 : 9}
                            sm={multi_language.length > 1 && multi_language.length - 1 == index ? 5 : 9}></Column>
                          <Column
                            md={multi_language.length > 1 && multi_language.length - 1 == index ? 6 : 3}
                            xs={multi_language.length > 1 && multi_language.length - 1 == index ? 7 : 3}
                            sm={multi_language.length > 1 && multi_language.length - 1 == index ? 7 : 3}>
                            <Row className={classes.endPadd}>
                              {multi_language.length > 1 ? (
                                <Button
                                  onClick={() => removeMultiLanguage(index)}
                                  className={classes.addEdit}
                                  size="small"
                                  variant="contained"
                                  color="primary">
                                  <Remove />
                                </Button>
                              ) : null}
                              {multi_language.length - 1 == index
                                ? multi_language.length < languages.length && (
                                    <Button onClick={addMultiLanguage} size="small" variant="contained" color="primary">
                                      <Add />
                                    </Button>
                                  )
                                : null}
                            </Row>
                          </Column>
                        </Row>
                      </Card>
                    </Column>
                  ))}
                </Row>
              </Column>

              <Column right>
                <Row>
                  <Column md={8}></Column>

                  <Column right md={4}>
                    <Row bottom>
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
                            {editData ? <LanguageConfig id={"bankmaster.update"}/> :<LanguageConfig id={"bankmaster.add"}/>}
                          </Column>
                        </Row>
                      </Button>
                      <Button
                        onClick={() => {
                          setAddEdit(false);
                          setEditData(null);
                        }}
                        className={classes.closeButton}
                        variant="contained">
                        Cancel
                      </Button>
                    </Row>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      ) : (
        ''
      )}
    </div>
  );
};
const LedgerGroupBank = ({ name, value, onChange, error, helperText, label }) => {
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [selectValue, setSetectedValue] = useState(null);
  
    useEffect(() => {
      ledgerGroupByKey();
    }, [value, defaultOptions]);
    useEffect(() => {
      loadLedgerGroup();
    }, []);
  
    const ledgerGroupByKey = async () => {
      if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
        const res = await httpPostRequest(getLedgerGroupByParentBank(value));
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
          setSetectedValue({
            label: res[newConstants.DATA][newConstants.LEDGER_GROUP_NAME],
            value: res[newConstants.DATA][newConstants.LEDGER_GROUP_KEY],
          });
        }
      } else {
        setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
      }
    };
  
    const loadLedgerGroup = async (inputValue = '', callback = null) => {
      const res = await httpPostRequest(getLedgerGroupByParentBank(inputValue));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        if (callback) {
          callback(
            res[newConstants.DATA][newConstants.LEDGER_GROUPS].map((v) => ({
              value: v[newConstants.LEDGER_GROUP_KEY],
              label: v[newConstants.LEDGER_GROUP_NAME],
            })),
          );
        } else {
          setDefaultOptions(
            res[newConstants.DATA][newConstants.LEDGER_GROUPS].map((v) => ({
              value: v[newConstants.LEDGER_GROUP_KEY],
              label: v[newConstants.LEDGER_GROUP_NAME],
            })),
          );
        }
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