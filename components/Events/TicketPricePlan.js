import React, { useState, useEffect, useMemo } from 'react';
import {
  Text,
  TextField,
  Card,
  Row,
  Column,
  Loader,
  CustomAlert,
  SingelSelectOnDemand,
  ModalComponent,
} from '../../core';
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
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Create, Delete } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import {
  EventticketPlanPriceUpdate,
  getEventTicketByKey,
  getAllTicketType,
  EventticketPlanPriceSave,
  ticketPlanPriceUpdate,
  deleteEventTicketPlanPrice,
  EventTicketPlanByTicketKey,
  getAllEvenTicketPlanPrice,
  getAllEventTicketActiveY,
  eventTicketPlanPriceGetByKey,
} from '../../helper/RequestPayLoadEvents';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from "../PrimaryContainer"
import LanguageConfig from "../../helper/LanguageConfig";
var FA = require('react-fontawesome');


const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  table: {
    minWidth: 650,
  },
  addEdit: {
    marginLeft: 4,
    marginRight: 4,
  },
  saveButton: {
    minWidth: 100,
    height: 40,
    margin: 5,
    backgroundColor: "rgb(26, 43, 71)",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    },
  },
  addButton: {
    margin: 5
  },
  closeButton: {
    margin: 5,
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
    // minWidth:150
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
  add: {
    backgroundColor: "rgb(26, 43, 71)",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    },
  },
  DateTime: {
    color: "rgb(104, 150, 194)",
    fontWeight: 600
  }
}));

const room_plan_cancel_policy = {
  [newConstants.REFUND_TYPE_KEY]: {
    value: '',
    is_require: true,
    error: false,
    type: 'dropdown',
    err_msg: '',
  },
  [newConstants.DAYS_BEFORE_CHECK_IN]: {
    value: '',
    is_require: true,
    error: false,
    type: 'number',
    err_msg: '',
  },
  [newConstants.CANCELATION_VALUE]: {
    value: '',
    is_require: true,
    error: false,
    type: 'price',
    err_msg: '',
  },
};

const room_plan_cancel_rules = {
  [newConstants.ROOM_CANCEL_RULE_NAME]: {
    value: '',
    is_require: true,
    error: false,
    min_length: 2,
    max_length: null,
    type: 'text',
    err_msg: '',
  },
  [newConstants.TICKET_TYPE_KEY]: {
    value: '',
    is_require: true,
    error: false,
    type: 'dropdown',
    err_msg: '',
  },
  [newConstants.IS_DATE_RANGE]: {
    value: true,
    is_require: true,
    error: false,
    type: 'boolean',
    err_msg: '',
  },
  [newConstants.EFFECTIVE_FROM]: {
    value: '',
    is_require: true,
    error: false,
  },
  [newConstants.EFFECTIVE_TO]: {
    value: '',
    is_require: true,
    error: false,
  },
  [newConstants.IS_OVERWRITE]: {
    value: true,
    is_require: true,
    error: false,
    type: 'boolean',
    err_msg: '',
  },
  [newConstants.ROOM_PLAN_CANCEL_POLICIES]: { value: [room_plan_cancel_policy], is_require: true, error: false },
};

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg, formname } = useStore();
  const [deleteId, setDeleteId] = useState('');

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: <LanguageConfig id="ticketpriceplan.sno" /> },
    [newConstants.TICKET_SEASONALITY_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketpriceplan.seasonaliyname" /> },
    [newConstants.IS_APPROVED]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketpriceplan.approved" /> },
    [newConstants.IS_APPROVED_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketpriceplan.approvedstatus" /> },
    [newConstants.IS_INCLUSIVE_PRICE]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketpriceplan.inclusiveprice" /> },
    [newConstants.EFFECTIVE_FROM]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketpriceplan.effectivefrom" /> },
    [newConstants.EFFECTIVE_TO]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketpriceplan.effectiveto" /> },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketpriceplan.status" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketpriceplan.lastupdatedby" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="ticketpriceplan.action" /> }
  });

  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getAllEvenTicketPlanPrice(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.TICKET_SEASONALITY_LISTS]);
      setLoader(false);
      setMaxPage(
        res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
          parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
          0
          ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
          : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
      );
    } else {
      setCurrIndex(1);
      setLoader(false);
      setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
    }
  };


  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  const filter_data = data.map((value, index) =>
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
  const editRoomPlan = async (key) => {
    setAddEdit(false);
    let res = await httpPostRequest(eventTicketPlanPriceGetByKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
    }
    else{
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }   
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function delRoomPlan() {
    const res = await httpPostRequest(deleteEventTicketPlanPrice(deleteId));
    setDeleteLoader(deleteId);
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
      setDeleteLoader('');
      loadData();
      setDeleteId('');
    } else {
      setDeleteLoader('');
      setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
    }
  }
  const updateShowCol = (e) => {
    setShowCol({ ...showCol, [e.target.name]: e.target.checked });
  };

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
        editRow={editRoomPlan}
        deleteRow={setDeleteId}
        action_key={newConstants.TICKET_SEASONALITY_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="ticketpriceplan.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delRoomPlan}
        />

      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit, languages, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [loader, setLoader] = useState(false);
  const [planname, setPlanName] = useState(editData?editData[newConstants.TICKET_KEY]:"")
  const [ticketplan, setTicketPlan] = useState([])

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.TICKET_PLAN_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.EFFECTIVE_FROM]: {
          value: "",
          is_require: true,
          error: false,
        },
        [newConstants.EFFECTIVE_TO]: {
          value: "",
          is_require: true,
          error: false,
        },
        [newConstants.TICKET_SEASONALITY_NAME]: {
          value: "",
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_APPROVED]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_INCLUSIVE_PRICE]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
      });
    }
    else {
      setLocalFields({
        [newConstants.TICKET_PLAN_KEY]: {
          value: editData[newConstants.TICKET_PLAN_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_KEY]: {
          value: editData[newConstants.TICKET_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.EFFECTIVE_FROM]: {
          value: editData[newConstants.EFFECTIVE_FROM].split("-").reverse().join("-"),
          is_require: true,
          error: false,
        },
        [newConstants.EFFECTIVE_TO]: {
          value:  editData[newConstants.EFFECTIVE_TO].split("-").reverse().join("-"),
          is_require: true,
          error: false,
        },
        [newConstants.TICKET_SEASONALITY_NAME]: {
          value: editData[newConstants.TICKET_SEASONALITY_NAME],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_APPROVED]: {
          value:  editData[newConstants.IS_APPROVED],
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_INCLUSIVE_PRICE]: {
          value: editData[newConstants.IS_INCLUSIVE_PRICE],
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_ACTIVE]: {
          value: editData[newConstants.IS_ACTIVE]?editData[newConstants.IS_ACTIVE]:false,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
      });
    }
  }, [editData]);


  const stateUpdater = (e) => {
    let localFields_ = _.cloneDeep(localFields);
    if (e.target.value.length == 0 && typeof e.target.value == 'string') {
      localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
      localFields_[e.target.name].value = e.target.value;
    } else {
      localFields_[e.target.name].value = e.target.value;
      localFields_[e.target.name].error = false;
    }
    setLocalFields(localFields_);
  };

  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);

    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    let flag = localFields_validation.err;

    if (!flag) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(EventticketPlanPriceSave(localFields));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(EventticketPlanPriceUpdate(editData[newConstants.TICKET_SEASONALITY_KEY], localFields));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    }
    else {
      setAlertMsg({ type: 'error', msg: 'Please fill all the require fields.' });
    }
  };


  const getEventTicketPlanByKey = async (planname) => {
    let res = await httpPostRequest(EventTicketPlanByTicketKey(planname));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setTicketPlan(res[newConstants.DATA])
    }
    else {
      setTicketPlan([])
      setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
    }
  }

  useEffect(() => {
    if (planname) {
      getEventTicketPlanByKey(planname)
    }
  }, [planname])

  return (
    <div>
      {localFields.hasOwnProperty([newConstants.TICKET_PLAN_KEY]) ? (
        <Row padding={[10]} margin={[10, 0, 0, 0]}>
          {/* <Column padding={[8]}>
            <Text bold size={16}>
              <LanguageConfig id={editData?"ticketpriceplan.editticketpriceplan":"ticketpriceplan.addticketpriceplan"} />
            </Text>
          </Column> */}
          <Column md={3} padding={[10, 5]}>
            <TicketName
              name={newConstants.TICKET_KEY}
              value={localFields[newConstants.TICKET_KEY].value}
              onChange={(e) => { stateUpdater(e), setPlanName(e.target.value) }}
              error={
                localFields[newConstants.TICKET_KEY].error &&
                localFields[newConstants.TICKET_KEY].is_require
              }
              helperText={
                localFields[newConstants.TICKET_KEY].error
                  ? localFields[newConstants.TICKET_KEY].err_msg
                  : ''
              }
              label={<LanguageConfig id="ticketpriceplan.ticketname" />}
              margin="dense"
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <TicketPlanName
              ticketplan={ticketplan}
              name={newConstants.TICKET_PLAN_KEY}
              value={localFields[newConstants.TICKET_PLAN_KEY].value}
              onChange={stateUpdater}
              error={
                localFields[newConstants.TICKET_PLAN_KEY].error
              }
              helperText={
                localFields[newConstants.TICKET_PLAN_KEY].error &&
                  localFields[newConstants.TICKET_PLAN_KEY].is_require
                  ? localFields[newConstants.TICKET_PLAN_KEY].err_msg
                  : ''
              }
              label={<LanguageConfig id="ticketpriceplan.ticketpriceplan" />}
              margin="dense"
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <TextField
              type="date"
              id="effective-from-id"
              label={<LanguageConfig id="ticketpriceplan.effectivefrom" />}
              InputLabelProps={{
                shrink: true,
                classes: {
                  root: classes.DateTime,
                }
              }}
              value={localFields[newConstants.EFFECTIVE_FROM].value}
              name={newConstants.EFFECTIVE_FROM}
              error={localFields[newConstants.EFFECTIVE_FROM].error}
              onChange={stateUpdater}
              helperText={
                localFields[newConstants.EFFECTIVE_FROM].error
                  ? localFields[newConstants.EFFECTIVE_FROM].err_msg
                  : ''
              }
              variant="outlined"
              margin="dense"
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <TextField
              type="date"
              id="effective-from-id"
              label={<LanguageConfig id="ticketpriceplan.effectiveto" />}
              InputLabelProps={{
                shrink: true,
                classes: {
                  root: classes.DateTime,
                }
              }}
              value={localFields[newConstants.EFFECTIVE_TO].value}
              name={newConstants.EFFECTIVE_TO}
              error={localFields[newConstants.EFFECTIVE_TO].error}
              onChange={stateUpdater}
              helperText={
                localFields[newConstants.EFFECTIVE_TO].error
                  ? localFields[newConstants.EFFECTIVE_TO].err_msg
                  : ''
              }
              variant="outlined"
              margin="dense"
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <TextField
              label={<LanguageConfig id="ticketpriceplan.seasonaliyname" />}
              value={localFields[newConstants.TICKET_SEASONALITY_NAME].value}
              name={newConstants.TICKET_SEASONALITY_NAME}
              error={localFields[newConstants.TICKET_SEASONALITY_NAME].error}
              onChange={stateUpdater}
              helperText={
                localFields[newConstants.TICKET_SEASONALITY_NAME].error
                  ? localFields[newConstants.TICKET_SEASONALITY_NAME].err_msg
                  : ''
              }
              variant="outlined"
              margin="dense"
            />
          </Column>
          {editData ? (
            <Column padding={[10, 20]} center>
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
                label={<LanguageConfig id="ticketpriceplan.isactive" />}
              />
            </Column>
          ) : (
            ''
          )}
          <Column md={3} padding={[10, 20]} center>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFields[newConstants.IS_APPROVED].value}
                  color="primary"
                  onChange={() => stateUpdater({ target: { value: !localFields[newConstants.IS_APPROVED].value, name: newConstants.IS_APPROVED } })}
                  name={newConstants.IS_APPROVED}
                />
              }
              label={<LanguageConfig id="Is approved" />}
              margin="dense"
            />
          </Column>
          <Column md={3} padding={[10, 20]} center>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFields[newConstants.IS_INCLUSIVE_PRICE].value}
                  color="primary"
                  onChange={() => stateUpdater({ target: { value: !localFields[newConstants.IS_INCLUSIVE_PRICE].value, name: newConstants.IS_INCLUSIVE_PRICE } })}
                  name={newConstants.IS_INCLUSIVE_PRICE}
                />
              }
              label={<LanguageConfig id="ticketpriceplan.inclusiverate" />}
              margin="dense"
            />
          </Column>
          <Column>
            <Column right>
              <Row>
                <Column md={8}></Column>
                <Column right md={4}>
                  <Row style={{ placeContent: 'flex-end' }}>
                    <Button
                      className={classes.saveButton}
                      variant="contained"
                      color="primary"
                      onClick={loader ? console.log('') : save}>
                      <Row>
                        {loader && (
                          <Column md={1} xs={1} sm={1} center middle>
                            <Loader size={14} color={'white'} />
                          </Column>
                        )}
                        <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} center middle sm={loader ? 11 : 12}>
                          <LanguageConfig id={editData ? "ticketpriceplan.update" : "Save"} />
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
                      <LanguageConfig id={"ticketpriceplan.cancel"} />
                    </Button>
                  </Row>
                </Column>
              </Row>
            </Column>
          </Column>
        </Row>
      ) : null}
    </div>
  );
};

const TicketPlanName = ({ name, value, onChange, error, helperText, label, ticketplan }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    LoadPlan()
  }, [ticketplan, value]);

  const LoadPlan = () => {
    setDefaultOptions(
      ticketplan.map((v) => ({
        value: v[newConstants.TICKET_PLAN_KEY],
        label: v[newConstants.TICKET_PLAN_NAME],
      }))
    )
  }

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
      name={name}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};


const TicketName = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    loadOption();
  }, [value]);
  

  const loadOption = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllEventTicketActiveY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.TICKETS].map((v) => ({
            value: v[newConstants.TICKET_KEY],
            label: v[newConstants.TICKET_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.TICKETS].map((v) => ({
            value: v[newConstants.TICKET_KEY],
            label: v[newConstants.TICKET_NAME],
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
      loadOptions={loadOption}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};



