import React, { useState, useEffect, useRef } from 'react';
import { Text, TextField, Card, Row, Column, Loader, CustomAlert, SingelSelectOnDemand, DemandDropDown } from '../../core';
import {
  Fade,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { Add, Remove, Edit } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import {
  getAllAccountsGroupParentBankCash,
  geAccountsLedgerGroupKey,
  getModeOfPayRemark,
  getModeOfPay,
  createModeOfPay,
  updateModeOfPay,
  getModeOfPayKey,
  deleteModeOfPay,
} from '../../helper/RequestPayloadAccount';
import LanguageConfig from '../../helper/LanguageConfig';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from '../PrimaryContainer';

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
    backgroundColor: 'rgb(26, 43, 71);',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgb(26, 43, 71);',
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
  tableHead: {
    backgroundColor: '#ffffff',
    borderBottom: '1.2px solid #003399',
  },
  tableHeadTuple: {
    color: theme.palette.grey.light,
    fontSize: '15px',
    fontWeight: '1000',
    padding: 15,
    width: 'clamp(150px,10vw,300px)',
    minWidth: 150,
    // width: 'clamp(150px,10vw,300px)',
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
    color: 'black',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    textTransform: 'uppercase',
    width: 'clamp(150px,10vw,300px)',
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
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg, copylanguages, formname } = useStore();
  const [deleteId, setDeleteId] = useState('');

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUMBER]: { is_hide: false, bool: true, label: <LanguageConfig id="modofpay.sno" /> },
    [newConstants.MOP_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="modofpay.mopname" /> },
    [newConstants.IS_LEDGER_CONFIG_REQ]: {
      is_hide: false,
      bool: true,
      label: <LanguageConfig id="modofpay.ledgerrequired" />,
    },
    [newConstants.IS_SYSTEM_DEFAULT_STATUS]: {
      is_hide: false,
      bool: true,
      label: <LanguageConfig id="modofpay.systemstatus" />,
    },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: 'Status' },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="modofpay.lastupdatedby" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="modofpay.lastupdatedon" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="modofpay.action" /> },
  });
  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getModeOfPay(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.MOP_MASTERS]);
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
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="modofpay.tryagain" /> });
    }
  };
  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);
  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };
  const editRoomPlan = async (key) => {
    setAddEdit(false);
    let res = await httpPostRequest(getModeOfPayKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
    }
    setAddEdit(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function delRoomPlan() {
    const res = await httpPostRequest(deleteModeOfPay(deleteId));
    setDeleteLoader(deleteId);
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setDeleteLoader('');
      loadData();
      setDeleteId('');
      setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
    } else {
      setDeleteLoader('');
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="modofpay.tryagain" /> });
    }
  }

  return (
    <div>
      <Card margin={[0, 0, 10, 0]}>
        {addEdit ? (
          <Column padding={[10]}>
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
                copylanguages={copylanguages}
              />
            </Fade>
          </Column>
        ) : null}
      </Card>
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
        editRow={editRoomPlan}
        deleteRow={setDeleteId}
        action_key={newConstants.MOP_MASTER_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="modofpay.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delRoomPlan}
        />
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({
  classes,
  loadData,
  editData,
  setEditData,
  addEdit,
  setAddEdit,
  languages,
  copylanguages,
  setAlertMsg,
}) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [detail, setDetail] = useState([]);
  const [loader, setLoader] = useState(false);
  const [accountGroupParentKey, setAccountGroupParentKey] = useState([]);
  console.log(accountGroupParentKey)

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.MOP_NAME]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      });
      var Tab_multi = languages.map((val) => ({
        [newConstants.LANG_CODE]: {
          value: val.value,
          is_require: false,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.MOP_NAME]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }));
      setMultiLanguage(Tab_multi);
      setDetail([
        {
          [newConstants.LEDGER_KEY]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.LEDGER_GROUP_KEY]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.MOP_REMARK_FIELD1_TYPE]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.MOP_REMARK_FIELD1_CAPTION]: {
            value: '',
            is_require: false,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.MOP_REMARK_FIELD2_TYPE]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.MOP_REMARK_FIELD2_CAPTION]: {
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
        [newConstants.MOP_NAME]: {
          value: editData[newConstants.MOP_NAME],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_ACTIVE]: {
          value: editData[newConstants.IS_ACTIVE],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
      });
      var Tab_multi = languages.map((val) => ({
        [newConstants.LANG_CODE]: {
          value: val.value,
          is_require: false,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.MOP_NAME]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }));
      let multi_language_ = [];
      if (editData[newConstants.MODEOF_PAYMASTER_LANGUAGES] && editData[newConstants.MODEOF_PAYMASTER_LANGUAGES].length) {
        editData[newConstants.MODEOF_PAYMASTER_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.MOP_NAME]: {
              value: value[newConstants.MOP_NAME],
              is_require: false,
              error: false,
              type: 'text',
              err_msg: '',
            },
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: false,
              error: false,
              type: 'dropdown',
              err_ms: '',
            },
          });
        });
      } else {
        multi_language_.push(...Tab_multi);
      }
      setMultiLanguage(
        multi_language_.concat(
          Tab_multi.filter(
            (f) => !multi_language_.map((v) => v[newConstants.LANG_CODE].value).includes(f[newConstants.LANG_CODE].value),
          ),
        ),
      );
      let detail_ = [];

      if (editData[newConstants.MOP_DETAIL] && editData[newConstants.MOP_DETAIL].length) {
        editData[newConstants.MOP_DETAIL] &&
          editData[newConstants.MOP_DETAIL].map((val) => {
            setAccountGroupParentKey(...accountGroupParentKey, val[newConstants.LEDGER_GROUP_KEY]);
          });
        editData[newConstants.MOP_DETAIL] &&
          editData[newConstants.MOP_DETAIL].forEach((value) => {
            detail_.push({
              [newConstants.LEDGER_GROUP_KEY]: {
                value: value[newConstants.LEDGER_GROUP_KEY],
                is_require: true,
                error: false,
                type: 'dropdown',
                err_msg: '',
              },
              [newConstants.LEDGER_KEY]: {
                value: value[newConstants.LEDGER_KEY],
                is_require: true,
                error: false,
                type: 'dropdown',
                err_msg: '',
              },
              [newConstants.MOP_REMARK_FIELD1_TYPE]: {
                value: value[newConstants.MOP_REMARK_FIELD1_TYPE],
                is_require: true,
                error: false,
                type: 'dropdown',
                err_msg: '',
              },
              [newConstants.MOP_REMARK_FIELD1_CAPTION]: {
                value: value[newConstants.MOP_REMARK_FIELD1_CAPTION],
                is_require: true,
                error: false,
                min_length: 2,
                max_length: null,
                type: 'text',
                err_msg: '',
              },
              [newConstants.MOP_REMARK_FIELD2_TYPE]: {
                value: value[newConstants.MOP_REMARK_FIELD2_TYPE],
                is_require: true,
                error: false,
                type: 'dropdown',
                err_msg: '',
              },
              [newConstants.MOP_REMARK_FIELD2_CAPTION]: {
                value: value[newConstants.MOP_REMARK_FIELD2_CAPTION],
                is_require: true,
                error: false,
                min_length: 2,
                max_length: null,
                type: 'text',
                err_msg: '',
              },
            });
          });
      } else {
        detail_.push({
          [newConstants.LEDGER_GROUP_KEY]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.LEDGER_KEY]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.MOP_REMARK_FIELD1_TYPE]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.MOP_REMARK_FIELD1_CAPTION]: {
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.MOP_REMARK_FIELD2_TYPE]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.MOP_REMARK_FIELD2_CAPTION]: {
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
        });
      }
      setDetail(detail_);
    }
  }, [editData, languages]);

  // useEffect(() => {
  //   let detail_ = [];
  //   detail.forEach((value, index) => {
  //     if (value[newConstants.MOP_REMARK_FIELD1_TYPE] && value[newConstants.MOP_REMARK_FIELD1_TYPE].value === 'M') {
  //       detail_.push({
  //         ...detail[index],
  //         [newConstants.MOP_REMARK_FIELD1_CAPTION]: {
  //           ...value[newConstants.MOP_REMARK_FIELD1_CAPTION],
  //           is_require: true,
  //         },
  //       });
  //     }
  //     if (value[newConstants.MOP_REMARK_FIELD2_TYPE] && value[newConstants.MOP_REMARK_FIELD2_TYPE].value === 'M') {
  //       detail_.push({
  //         ...detail[index],
  //         [newConstants.MOP_REMARK_FIELD2_CAPTION]: {
  //           ...value[newConstants.MOP_REMARK_FIELD2_CAPTION],
  //           is_require: true,
  //         },
  //       });
  //     }
  //   });
  //   console.log(detail);
  //   console.log(detail_);
  // }, [detail]);

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

  function multiStateUpdater(e, index, tag, index1) {
    if (tag == 'lang') {
      let multi_language_ = _.cloneDeep(multi_language);
      if (e.target.value.length == 0) {
        multi_language_[index][e.target.name].error = multi_language_[index][e.target.name].is_require ? true : false;
        multi_language_[index][e.target.name].value = e.target.value;
      } else {
        multi_language_[index][e.target.name].value = e.target.value;
        multi_language_[index][e.target.name].error = false;
      }
      setMultiLanguage(multi_language_);
    } else if (tag == 'detail') {
      let detail_ = _.cloneDeep(detail);
      if (e.target.value.length == 0) {
        detail_[index][e.target.name].error = detail_[index][e.target.name].is_require ? true : false;
        detail_[index][e.target.name].value = e.target.value;
      } else {
        detail_[index][e.target.name].value = e.target.value;
        detail_[index][e.target.name].error = false;
      }

      if (e.target.name === newConstants.MOP_REMARK_FIELD1_TYPE && e.target.value.length !== 0 && e.target.value === 'M') {
        detail_[index][newConstants.MOP_REMARK_FIELD1_CAPTION].is_require = true;
      }
      if (e.target.name === newConstants.MOP_REMARK_FIELD1_TYPE && e.target.value.length !== 0 && e.target.value !== 'M') {
        detail_[index][newConstants.MOP_REMARK_FIELD1_CAPTION].is_require = false;
        detail_[index][newConstants.MOP_REMARK_FIELD1_CAPTION].error = false;
      }
      if (e.target.name === newConstants.MOP_REMARK_FIELD2_TYPE && e.target.value.length !== 0 && e.target.value === 'M') {
        detail_[index][newConstants.MOP_REMARK_FIELD2_CAPTION].is_require = true;
      }
      if (e.target.name === newConstants.MOP_REMARK_FIELD2_TYPE && e.target.value.length !== 0 && e.target.value !== 'M') {
        detail_[index][newConstants.MOP_REMARK_FIELD2_CAPTION].is_require = false;
        detail_[index][newConstants.MOP_REMARK_FIELD2_CAPTION].error = false;
      }
      setDetail(detail_);
    }
  }
  function removeMulti(index_, tag, index1) {
    if (tag == 'lang') {
      let multi_language_ = _.cloneDeep(multi_language);
      if (multi_language_.length > 1) {
        multi_language_ = multi_language_.map((val, index) => (index != index_ ? val : null));
        setMultiLanguage(multi_language_.filter((f) => f != null));
      }
    } else if (tag == 'detail') {
      let detail_ = _.cloneDeep(detail);
      if (detail_.length > 1) {
        detail_ = detail_.map((val, index) => (index != index_ ? val : null));
        setDetail(detail_.filter((f) => f != null));
      }
    }
  }

  const addMulti = (tag, index) => {
    if (tag == 'lang') {
      let multi_language_ = _.cloneDeep(multi_language);
      if (
        languages.filter((f) => !multi_language.map((val) => val[newConstants.LANG_CODE].value).includes(f.code)).length &&
        multi_language.length < languages.length
      ) {
        multi_language_.push({
          [newConstants.MOP_NAME]: {
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.LANG_CODE]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
        });
        setMultiLanguage(multi_language_);
      }
    } else if (tag == 'detail') {
      let detail_ = _.cloneDeep(detail);
      detail_.push({
        [newConstants.LEDGER_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.LEDGER_GROUP_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.MOP_REMARK_FIELD1_TYPE]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.MOP_REMARK_FIELD1_CAPTION]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.MOP_REMARK_FIELD2_TYPE]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.MOP_REMARK_FIELD2_CAPTION]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      });
      setDetail(detail_);
    }
  };
  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    let multi_language_validator = _.cloneDeep(multi_language);
    multi_language_validator = multi_language_validator.map((value) => validator(value));
    if (multi_language_validator.filter((f) => f.err == true).length) {
      setMultiLanguage(multi_language_validator.map((value) => value.values));
    }
    let detail_validator = _.cloneDeep(detail);
    detail_validator = detail_validator.map((value) => validator(value));
    if (detail_validator.filter((f) => f.err == true).length) {
      setDetail(detail_validator.map((value) => value.values));
    }
    let flag =
      !localFields_validation.err &&
      detail_validator.filter((f) => f.err).length == 0 &&
      multi_language_validator.filter((f) => f.err).length == 0;
    let multi_lang_ = multi_language.filter((f) => f[newConstants.MOP_NAME].value != '');

    if (flag) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createModeOfPay(localFields, multi_lang_, detail));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="modofpay.tryagain" /> });
        }
      } else {
        let res = await httpPostRequest(
          updateModeOfPay(editData[newConstants.MOP_MASTER_KEY], localFields, multi_lang_, detail),
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="modofpay.tryagain" /> });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="modofpay.fillrequired" /> });
    }
  };

  return (
    <div>
      {localFields.hasOwnProperty([newConstants.MOP_NAME]) ? (
        <Row padding={[10]}>
          <Column padding={[8]}>
            <Text bold size={16}>
              {editData ? <LanguageConfig id="modofpay.editmodofpay" /> : <LanguageConfig id="modofpay.addmodofpay" />}
            </Text>
          </Column>
          <Column>
            <Row>
              <Column md={4} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="modofpay.mopname" />}
                  name={newConstants.MOP_NAME}
                  value={localFields[newConstants.MOP_NAME].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.MOP_NAME].error && localFields[newConstants.MOP_NAME].is_require}
                  helperText={
                    localFields[newConstants.MOP_NAME].error && localFields[newConstants.MOP_NAME].is_require
                      ? localFields[newConstants.MOP_NAME].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>

              {editData ? (
                <Column md={4} padding={[10, 20]} center>
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
                    label={<LanguageConfig id="modofpay.isactive" />}
                  />
                </Column>
              ) : (
                ''
              )}
              <Row></Row>
              <Column>
                <MopDetails
                  detail={detail}
                  setDetail={setDetail}
                  classes={classes}
                  editData={editData}
                  multiStateUpdater={multiStateUpdater}
                  addMulti={addMulti}
                  removeMulti={removeMulti}
                  accountGroupParentKey={accountGroupParentKey}
                  setAccountGroupParentKey={setAccountGroupParentKey}
                />
              </Column>
              <Row>
                <Column md={6} padding={[7]}>
                  <LanguageContainer
                    copylanguages={copylanguages}
                    classes={classes}
                    languages={languages}
                    multi_language={multi_language}
                    multiStateUpdater={multiStateUpdater}
                  />
                </Column>
              </Row>
              <Column right>
                <Row>
                  <Column md={9}></Column>
                  <Column right md={3}>
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
                            {editData ? <LanguageConfig id="modofpay.update" /> : <LanguageConfig id="Save" />}
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
                        <LanguageConfig id="modofpay.cancel" />
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

const LanguageContainer = ({ classes, multi_language, multiStateUpdater, languages, copylanguages }) => {
  const ref = useRef();
  return (
    <div ref={ref}>
      <Row>
        <Column>
          <div className={classes.scrollContainer}>
            <Row>
              <Paper style={{ width: '100%' }}>
                <TableContainer className={classes.TableContain}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHeadTuple}>Language</TableCell>
                        <TableCell className={classes.tableHeadTuple}>Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {multi_language.map((val, index) => (
                        <TableRow>
                          <TableCell className={classes.tableBodyTuple}>
                            <Text>
                              {languages.filter((f) => f.value == val[newConstants.LANG_CODE].value).length
                                ? languages.filter((f) => f.value == val[newConstants.LANG_CODE].value)[0].label
                                : copylanguages.filter((f) => f.value == val[newConstants.LANG_CODE].value)[0].label}
                            </Text>
                          </TableCell>
                          <TableCell className={classes.tableBodyTuple}>
                            <TextField
                              label={'Mop Name'}
                              type="text"
                              value={val[newConstants.MOP_NAME].value}
                              name={newConstants.MOP_NAME}
                              error={val[newConstants.MOP_NAME].error}
                              onChange={(e) => multiStateUpdater(e, index, 'lang')}
                              helperText={val[newConstants.MOP_NAME].err_msg}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Row>
          </div>
        </Column>
      </Row>
    </div>
  );
};

const MopDetails = ({
  detail,
  setDetail,
  classes,
  multiStateUpdater,
  addMulti,
  removeMulti,
}) => {
  return (
    <Row margin={[10, 5]}>
      <Column padding={[5, 0]}>
        <Text size={14} bold>
          <LanguageConfig id="modofpay.mopdetails" />
        </Text>
      </Column>
      {detail.map((value, index) => (
        <Column md={4} padding={[5]} key={'detail_' + index}>
          <Card padding={[10]}>
            <Row>
              <Column padding={[5]}>
                <LedgerGroupName
                  name={newConstants.LEDGER_GROUP_KEY}
                  value={value[newConstants.LEDGER_GROUP_KEY].value}
                  onChange={(e) => {
                    multiStateUpdater(e, index, 'detail');
                  }}
                  error={value[newConstants.LEDGER_GROUP_KEY].error && value[newConstants.LEDGER_GROUP_KEY].is_require}
                  helperText={
                    value[newConstants.LEDGER_GROUP_KEY].error && value[newConstants.LEDGER_GROUP_KEY].is_require
                      ? value[newConstants.LEDGER_GROUP_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="ledgergroup.ledgergroupparent" />}
                />
              </Column>
              <Column padding={[5]}>
                <LedgerName
                  name={newConstants.LEDGER_KEY}
                  value={value[newConstants.LEDGER_KEY].value}
                  onChange={(e) => multiStateUpdater(e, index, 'detail')}
                  error={value[newConstants.LEDGER_KEY].error && value[newConstants.LEDGER_KEY].is_require}
                  helperText={
                    value[newConstants.LEDGER_KEY].error && value[newConstants.LEDGER_KEY].is_require
                      ? value[newConstants.LEDGER_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="modofpay.ledgerkey" />}
                  accountGroupParentKey={value[newConstants.LEDGER_GROUP_KEY].value}
                />
              </Column>
              <Column padding={[5]}>
                <FieldType
                  value={value[newConstants.MOP_REMARK_FIELD1_TYPE].value}
                  name={newConstants.MOP_REMARK_FIELD1_TYPE}
                  error={
                    value[newConstants.MOP_REMARK_FIELD1_TYPE].is_require && value[newConstants.MOP_REMARK_FIELD1_TYPE].error
                  }
                  onChange={(e) => {
                    multiStateUpdater(e, index, 'detail');
                  }}
                  helperText={
                    value[newConstants.MOP_REMARK_FIELD1_TYPE].is_require && value[newConstants.MOP_REMARK_FIELD1_TYPE].error
                      ? value[newConstants.MOP_REMARK_FIELD1_TYPE].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="modofpay.remarkfieldtype1" />}
                />
              </Column>
              <Column padding={[5]}>
                <TextField
                  label={<LanguageConfig id="modofpay.remarkfieldtype1caption" />}
                  value={value[newConstants.MOP_REMARK_FIELD1_CAPTION].value}
                  name={newConstants.MOP_REMARK_FIELD1_CAPTION}
                  error={
                    value[newConstants.MOP_REMARK_FIELD1_CAPTION].is_require &&
                    value[newConstants.MOP_REMARK_FIELD1_CAPTION].error
                  }
                  onChange={(e) => multiStateUpdater(e, index, 'detail')}
                  helperText={
                    value[newConstants.MOP_REMARK_FIELD1_CAPTION].is_require &&
                      value[newConstants.MOP_REMARK_FIELD1_CAPTION].error
                      ? value[newConstants.MOP_REMARK_FIELD1_CAPTION].err_msg
                      : ''
                  }
                  required={value[newConstants.MOP_REMARK_FIELD1_CAPTION].is_require}
                  disabled={value[newConstants.MOP_REMARK_FIELD1_TYPE].value == 'N'}
                  variant="outlined"
                />
              </Column>
              <Column padding={[5]}>
                <FieldType
                  value={value[newConstants.MOP_REMARK_FIELD2_TYPE].value}
                  name={newConstants.MOP_REMARK_FIELD2_TYPE}
                  error={
                    value[newConstants.MOP_REMARK_FIELD2_TYPE].is_require && value[newConstants.MOP_REMARK_FIELD2_TYPE].error
                  }
                  onChange={(e) => {
                    multiStateUpdater(e, index, 'detail');
                  }}
                  helperText={
                    value[newConstants.MOP_REMARK_FIELD2_TYPE].is_require && value[newConstants.MOP_REMARK_FIELD2_TYPE].error
                      ? value[newConstants.MOP_REMARK_FIELD2_TYPE].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="modofpay.remarkfieldtype2" />}
                />
              </Column>
              <Column padding={[5]}>
                <TextField
                  label={<LanguageConfig id="modofpay.remarkfieldtype2caption" />}
                  value={value[newConstants.MOP_REMARK_FIELD2_CAPTION].value}
                  name={newConstants.MOP_REMARK_FIELD2_CAPTION}
                  error={
                    value[newConstants.MOP_REMARK_FIELD2_CAPTION].is_require &&
                    value[newConstants.MOP_REMARK_FIELD2_CAPTION].error
                  }
                  onChange={(e) => multiStateUpdater(e, index, 'detail')}
                  helperText={
                    value[newConstants.MOP_REMARK_FIELD2_CAPTION].is_require &&
                      value[newConstants.MOP_REMARK_FIELD2_CAPTION].error
                      ? value[newConstants.MOP_REMARK_FIELD2_CAPTION].err_msg
                      : ''
                  }
                  required={value[newConstants.MOP_REMARK_FIELD2_CAPTION].is_require}
                  disabled={value[newConstants.MOP_REMARK_FIELD2_TYPE].value == 'N'}
                  variant="outlined"
                />
              </Column>
              <Column
                md={detail.length > 1 && detail.length - 1 == index ? 6 : 9}
                xs={detail.length > 1 && detail.length - 1 == index ? 5 : 9}
                sm={detail.length > 1 && detail.length - 1 == index ? 5 : 9}></Column>
              <Column
                md={detail.length > 1 && detail.length - 1 == index ? 6 : 3}
                xs={detail.length > 1 && detail.length - 1 == index ? 7 : 3}
                sm={detail.length > 1 && detail.length - 1 == index ? 7 : 3}>
                <Row className={classes.endPadd}>
                  {detail.length > 1 ? (
                    <Button
                      onClick={() => removeMulti(index, 'detail')}
                      className={classes.addEdit}
                      size="small"
                      variant="contained"
                      color="primary">
                      <Remove />
                    </Button>
                  ) : null}
                  {detail.length - 1 == index ? (
                    <Button onClick={() => addMulti('detail')} size="small" variant="contained" color="primary">
                      <Add />
                    </Button>
                  ) : null}
                </Row>
              </Column>
            </Row>
          </Card>
        </Column>
      ))}
    </Row>
  );
};

const LedgerGroupName = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);

  useEffect(() => {
    LedgerGroupNameByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    LedgerGroupNameGroup();
  }, []);

  const LedgerGroupNameByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getAllAccountsGroupParentBankCash(value));
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

  const LedgerGroupNameGroup = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllAccountsGroupParentBankCash(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.LEDGER_ACCOUNTS].map((v) => ({
            value: v[newConstants.LEDGER_GROUP_KEY],
            label: v[newConstants.LEDGER_GROUP_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.LEDGER_ACCOUNTS].map((v) => ({
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
      loadOptions={LedgerGroupNameGroup}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const LedgerName = ({ name, value, onChange, error, helperText, label, accountGroupParentKey }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  useEffect(() => {
    loadLedgerGroup();
  }, [value, accountGroupParentKey]);
  const loadLedgerGroup = async () => {
    const res = await httpPostRequest(geAccountsLedgerGroupKey(accountGroupParentKey));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultOptions(
        res[newConstants.DATA][newConstants.LEDGER_ACCOUNTS].map((v) => ({
          value: v[newConstants.LEDGER_KEY],
          label: v[newConstants.LEDGER_NAME],
        })),
      );
    } else {
      setDefaultOptions([]);
    }
  };
  const loadOptions = (inputValue, callback) => {
    const filter_data = defaultOptions.filter((i) => i.value.toLowerCase().includes(inputValue.toLowerCase()));
    callback(filter_data);
  };
  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={
        defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null
      }
      name={name}
      loadOptions={loadOptions}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const FieldType = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  useEffect(() => {
    loadRemark();
  }, [value]);
  const loadRemark = async () => {
    const res = await httpPostRequest(getModeOfPayRemark());
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultOptions(
        res[newConstants.DATA].map((v) => ({
          value: v[newConstants.REMARK_FIELD_TYPE_VALUE],
          label: v[newConstants.REMARK_FIELD_TYPE],
        })),
      );
    }
  };
  const loadOptions = (inputValue, callback) => {
    const filter_data = defaultOptions.filter((i) => i.value.toLowerCase().includes(inputValue.toLowerCase()));
    callback(filter_data);
  };
  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={
        defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null
      }
      name={name}
      loadOptions={loadOptions}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const MopLang = ({ multi_language, languages, classes, multiStateUpdater, addMulti, removeMulti }) => {
  const { Language } = DemandDropDown;
  return (
    <Row margin={[10, 5]}>
      <Column padding={[5, 0]}>
        <Text size={14} bold>
          {<LanguageConfig id="modofpay.paymentlanguages" />}
        </Text>
      </Column>
      {multi_language.map((value, index) => (
        <Column md={4} padding={[5]} key={'lang_' + index}>
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
                  onChange={(e) => multiStateUpdater(e, index, 'lang')}
                  helperText={
                    value[newConstants.LANG_CODE].is_require && value[newConstants.LANG_CODE].error
                      ? value[newConstants.LANG_CODE].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="modofpay.languagecode" />}
                />
              </Column>
              <Column padding={[5]}>
                <TextField
                  error={false}
                  id="room-plan-name-id"
                  label={<LanguageConfig id="modofpay.mopname" />}
                  value={value[newConstants.MOP_NAME].value}
                  name={newConstants.MOP_NAME}
                  error={value[newConstants.MOP_NAME].is_require && value[newConstants.MOP_NAME].error}
                  onChange={(e) => multiStateUpdater(e, index, 'lang')}
                  helperText={
                    value[newConstants.MOP_NAME].is_require && value[newConstants.MOP_NAME].error
                      ? value[newConstants.MOP_NAME].err_msg
                      : ''
                  }
                  variant="outlined"
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
                      onClick={() => removeMulti(index, 'lang')}
                      className={classes.addEdit}
                      size="small"
                      variant="contained"
                      color="primary">
                      <Remove />
                    </Button>
                  ) : null}
                  {multi_language.length - 1 == index
                    ? multi_language.length < languages.length && (
                      <Button onClick={() => addMulti('lang')} size="small" variant="contained" color="primary">
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
  );
};
