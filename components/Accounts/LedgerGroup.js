import React, { useState, useEffect, useRef } from 'react';
import { Text, TextField, Card, Row, Column, Loader, CustomAlert, DemandDropDown, SingelSelectOnDemand } from '../../core';
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
import { fade, makeStyles } from '@material-ui/core/styles';
import { Create, Delete, Edit, Add, Remove } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import {
  getAllAccountsGroup,
  createAccountsGroup,
  updateAccountsGroup,
  getAccountsGroupByKey,
  deleteAccountsGroup,
  getAllAccountsGroupParent
} from '../../helper/RequestPayloadAccount';
import LanguageConfig from "../../helper/LanguageConfig";
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
    width: '40%',
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
  const { languages, setAlertMsg, formname} = useStore();
  const [deleteId, setDeleteId] = useState('');

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUMBER]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgergroup.sno" /> },
    [newConstants.LEDGER_GROUP_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgergroup.ledgergroupname" /> },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgergroup.status" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgergroup.lastupdatedby" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="ledgergroup.lastupdatedon" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="ledgergroup.action" /> }
  });
  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getAllAccountsGroup(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.LEDGER_GROUPS]);
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
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgergroup.tryagain" /> });
    }
  };

  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);


  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };
  const editLedgerGroup = async (key) => {
    setAddEdit(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let res = await httpPostRequest(getAccountsGroupByKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
    }
    else{
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function delLedgerGroup() {
    const res = await httpPostRequest(deleteAccountsGroup(deleteId));
    setDeleteLoader(deleteId);
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setDeleteLoader('');
      loadData();
      setDeleteId('');
      setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
    } else {
      setDeleteLoader('');
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgergroup.tryagain" /> });
    }
  }


  return (
    <div>
      <Card margin={[0, 0, 10, 0]}>
        {addEdit &&
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
        }
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
        editRow={editLedgerGroup}
        deleteRow={setDeleteId}
        action_key={newConstants.LEDGER_GROUP_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="ledgergroup.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delLedgerGroup}
        />
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const { languages, copylanguages } = useStore();

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.LEDGER_GROUP_NAME]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.LEDGER_GROUP_PARENT_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
      });
      var Tab_multi = languages.map(val => ({
        [newConstants.LANG_CODE]:
        {
          value: val.value,
          is_require: false,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.LEDGER_GROUP_NAME]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      setMultiLanguage(Tab_multi)
    } else {
      setLocalFields({
        [newConstants.LEDGER_GROUP_NAME]: {
          value: editData[newConstants.LEDGER_GROUP_NAME],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.LEDGER_GROUP_PARENT_KEY]: {
          value: editData[newConstants.LEDGER_GROUP_PARENT_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
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
      let multi_language_ = [];
      var Tab_multi = languages.map(val => ({
        [newConstants.LANG_CODE]:
        {
          value: val.value,
          is_require: false,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.LEDGER_GROUP_NAME]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      if (editData[newConstants.LEDGER_GROUP_LANGUAGES] && editData[newConstants.LEDGER_GROUP_LANGUAGES].length) {
        editData[newConstants.LEDGER_GROUP_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.LEDGER_GROUP_NAME]: {
              value: value[newConstants.LEDGER_GROUP_NAME],
              is_require: false,
              error: false,
              type: 'text',
              err_msg: '',
            },
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: true,
              error: false,
              type: 'dropdown',
              err_ms: '',
            },
          });
        });
      } else {
        multi_language_.push(...Tab_multi);
      }
      setMultiLanguage(multi_language_.concat(Tab_multi.filter(f => !(multi_language_.map(v => v[newConstants.LANG_CODE].value).includes(f[newConstants.LANG_CODE].value)))))
    }
  }, [editData, languages]);

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

  function multiStateUpdater(e, index) {
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

  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);

    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    let multi_lang_ = multi_language.filter(f => f[newConstants.LEDGER_GROUP_NAME].value != "")
    if (!localFields_validation.err) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createAccountsGroup(localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgergroup.tryagain" /> });
        }
      } else {
        let res = await httpPostRequest(
          updateAccountsGroup(editData[newConstants.LEDGER_GROUP_KEY], localFields, multi_lang_),
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgergroup.tryagain" /> });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="ledgergroup.fillrequired" /> });
    }
  };

  return (
    <div>
      {localFields.hasOwnProperty(newConstants.LEDGER_GROUP_NAME) ? (
        <Row padding={[10]}>
          <Column padding={[8]}>
            <Text bold size={16}>
              {editData ? <LanguageConfig id="ledgergroup.editledgers" /> : <LanguageConfig id="ledgergroup.addledgers" />}
            </Text>
          </Column>
          <Column padding={[10]}>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  error={false}
                  id="ledger-name-id"
                  label={<LanguageConfig id="ledgergroup.ledgergroupname" />}
                  name={newConstants.LEDGER_GROUP_NAME}
                  value={localFields[newConstants.LEDGER_GROUP_NAME].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.LEDGER_GROUP_NAME].error && localFields[newConstants.LEDGER_GROUP_NAME].is_require}
                  helperText={
                    localFields[newConstants.LEDGER_GROUP_NAME].error && localFields[newConstants.LEDGER_GROUP_NAME].is_require
                      ? localFields[newConstants.LEDGER_GROUP_NAME].err_msg
                      : ''
                  }
                  variant="outlined"
                  margin="dense"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <LedgerGroupParent
                  name={newConstants.LEDGER_GROUP_PARENT_KEY}
                  value={localFields[newConstants.LEDGER_GROUP_PARENT_KEY].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.LEDGER_GROUP_PARENT_KEY].error && localFields[newConstants.LEDGER_GROUP_PARENT_KEY].is_require}
                  helperText={
                    localFields[newConstants.LEDGER_GROUP_PARENT_KEY].error && localFields[newConstants.LEDGER_GROUP_PARENT_KEY].is_require
                      ? localFields[newConstants.LEDGER_GROUP_PARENT_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="ledgergroup.ledgergroupparent" />}
                />
              </Column>
              {editData ? (
                <Column md={3} padding={[10, 20]} center>
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
                    label={<LanguageConfig id="ledgergroup.isactive" />}
                  />
                </Column>
              ) : (
                ''
              )}
              <Row>
                <Column md={6} padding={[7]}>
                  <LanguageContainer copylanguages={copylanguages} classes={classes} languages={languages} multi_language={multi_language} multiStateUpdater={multiStateUpdater} />
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
                            {editData ? <LanguageConfig id="ledgergroup.update" /> : <LanguageConfig id="Save" />}
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
                        <LanguageConfig id="ledgergroup.cancel" />
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

  useEffect(() => {
    ledgerGroupByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadLedgerGroup();
  }, []);

  const ledgerGroupByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getAllAccountsGroupParent(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.LEDGER_GROUP_NAME],
          value: res[newConstants.DATA][newConstants.LEDGER_GROUP_CHILD_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadLedgerGroup = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllAccountsGroupParent(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA].map((v) => ({
            value: v[newConstants.LEDGER_GROUP_CHILD_KEY],
            label: v[newConstants.LEDGER_GROUP_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA].map((v) => ({
            value: v[newConstants.LEDGER_GROUP_CHILD_KEY],
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

const LanguageContainer = ({ classes, multi_language, multiStateUpdater, languages, copylanguages }) => {
  const ref = useRef();
  return (
    <div ref={ref}>
      <Row>
        <Column>
          <div className={classes.scrollContainer}>
            <Row>
              <Paper style={{ width: "100%" }}>
                <TableContainer className={classes.TableContain}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHeadTuple}>Language</TableCell>
                        <TableCell className={classes.tableHeadTuple}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {multi_language.map(
                        (val, index) => (
                          <TableRow>
                            <TableCell className={classes.tableBodyTuple}>
                              <Text>{languages.filter(f => f.value == val[newConstants.LANG_CODE].value).length ? languages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label :
                                copylanguages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label}</Text>
                            </TableCell>
                            <TableCell className={classes.tableBodyTuple}>
                              <TextField
                                label={<LanguageConfig id="ledgergroup.ledgergroupname" />}
                                type="text"
                                value={val[newConstants.LEDGER_GROUP_NAME].value}
                                name={newConstants.LEDGER_GROUP_NAME}
                                error={val[newConstants.LEDGER_GROUP_NAME].error}
                                onChange={(e) => multiStateUpdater(e, index)}
                                helperText={val[newConstants.LEDGER_GROUP_NAME].err_msg}
                              />
                            </TableCell>
                          </TableRow>)
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Row>
          </div>
        </Column>
      </Row>
    </div>
  )
}
