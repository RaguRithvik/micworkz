import React, { useState, useEffect, useRef } from 'react';
import { Text, Card, TextField, Row, Column, Loader, CustomAlert, SingelSelectOnDemand, DemandDropDown, ModalComponent, MapSelect, Touchable } from '../../core';
import { Fade, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControlLabel, Grid, List, ListItem, ListItemText, Checkbox, ListItemIcon, IconButton, Tabs, Tab, Box, Typography } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Edit, Delete, AddAPhoto, RadioButtonUnchecked, CheckCircle, Cancel } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest, httpPostRequestWithForm, getDateYYYYMMDD } from '../../helper/JsHelper';
import { imageUploder, getAllEventTicketTag, getEventActiveYTicketSupplier, getAllEventImageType, getEventTicketKey, getAllEventTicket, getEventTicketByKey, deleteEventTicket, createEventTicket, updateEventTicket, getAllEventTicketCategory, getAllAmmunityY, getEventTicketCategoryKey, GetTicketTypeBySupplier } from '../../helper/RequestPayLoadEvents';
import PropTypes from 'prop-types';
import { constants, newConstants, eventConstants } from '../../helper/constants';
import PrimaryContainer from "../PrimaryContainer";
import GeneralLanguageContainer from "../GeneralLanguageContainer";
import LanguageConfig from "../../helper/LanguageConfig";
import { Container } from 'next/app';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  errorContainer: {
    border: '1px solid red'
  },
  saveButton: {
    width: '40%',
    margin: 5,
    backgroundColor: "rgb(26, 43, 71)",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    },
  },
  AddBtn: {
    padding: 10,
    backgroundColor: "rgb(26, 43, 71)",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    },
  },
  addButton: {
    margin: 5
  },
  RouterNavbarInverse: {
    width: "100%",
    float: "left",
  },
  RouterInformation: {
    backgroundColor: "#fff",
    boxShadow: "0px 0px 20px #ccc",
    borderRadius: "10px",
  },
  RouterNowmax: { width: "100%" },
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
    // width: 'clamp(150px,10vw,300px)',
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
    margin: '5px',
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.main,
    },
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
  box: {
    flexGrow: 1,
    flexBasis: 0,
  },
  add: {
    backgroundColor: "rgb(26, 43, 71)",
    color: "white",
    margin: '5px',
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    },
  },
  scrollContainer: {
    overflowY: 'scroll',
    maxHeight: 300,
  },
  blockButton: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    width: "180px",
    backgroundColor: "rgb(26, 43, 71)",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    }
  },
  tableBodyTuple: {
    color: 'black',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    width: 'clamp(150px,10vw,300px)',
  },
  TableContain: {
    maxWidth: "300px",
    minWidth: "100%"
  },
  tableHeadTuple: {
    color: 'black',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    textTransform: 'uppercase',
    width: 'clamp(150px,10vw,300px)',
  },
  TransferButtton: {
    margin: theme.spacing(0.5, 0)
  },
  ItemInformationNow: {
    width: "100%",
    float: "left",
    marginTop: '20px',
    backgroundColor: "#fff",
    boxShadow: "0px 0px 20px #ccc",
    borderRadius: "10px",
    // padding: "20px 40px 20px 40px",
    [theme.breakpoints.down("xs")]: {
      padding: "50px 30px 20px 30px",
    },
  },
  paper: {
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
    width: 216,
    height: 230,
    overflow: "auto"
  },
  inputSelect: {
    display: 'none',
  },
  addPhotos: {
    fontSize: 35,
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  modalScrollContainer: {
    overflowY: 'scroll',
    height: '50vh',
  },
  imageSelectContainer: {
    position: 'absolute',
    top: 0,
    left: -5,
  },
  primaryImageUnSelect: {
    color: '#000',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  closeImageContainer: {
    position: 'absolute',
    bottom: -3,
    right: 3,
  },
  closeImage: {
    color: 'red',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    zIndex: 2,
  },
  tabContainer: {
    width: '100%',
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '70vh',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  primaryImageSelect: {
    color: '#008000',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  hotelImage: {
    borderRadius: 10,
    height: 140,
    width: 150,
  },
  modalBtn: {
    color: "white",
    padding: '10px',
    backgroundColor: "rgb(26, 43, 71)",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    }
  },
  DateTime: {
    color: "rgb(104, 150, 194)",
    fontWeight: 600
  },
  tableHead2: {
    backgroundColor: '#eee'
  },
  tableCell2: {
    fontWeight: 'bolder',
    textTransform: 'uppercase'
  }
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
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: <LanguageConfig id="general.sno" /> },
    [newConstants.TICKET_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="event.eventname" /> },
    [newConstants.TICKET_CODE]: { is_hide: false, bool: true, label: <LanguageConfig id="event.eventcode" /> },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="general.status" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="general.lastupdatedon" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="general.lastupdatedby" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="general.action" /> }
  });

  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getAllEventTicket(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.TICKETS]);
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
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };

  const editTicket = async (key) => {
    setAddEdit(false);
    let res = await httpPostRequest(getEventTicketByKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
    }
    else {
      setAddEdit(false);
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function delTicket() {
    const res = await httpPostRequest(deleteEventTicket(deleteId));
    setDeleteLoader(deleteId);
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setDeleteLoader('');
      loadData();
      setDeleteId('');
    } else {
      setDeleteLoader('');
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.tryagain" /> });
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
              copylanguages={copylanguages}
              setAlertMsg={setAlertMsg}
              addEdit={addEdit}
              setAddEdit={setAddEdit}
              classes={classes}
            />
          </Fade>
        }
      </Card>
      <PrimaryContainer
        formName={editData != null && addEdit == true ? formname + "-" + "(Update)" : editData == null && addEdit == true ? formname + "-" + "(Save)" : formname}
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
        editRow={editTicket}
        deleteRow={setDeleteId}
        action_key={newConstants.TICKET_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="general.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delTicket}
        />

      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit, languages, setAlertMsg, copylanguages }) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [ticket_images, setTicketImages] = useState([]);
  const [leftAmen, setLeftamen] = useState([]);
  const [rightAmen, setRightamen] = useState([]);
  const [ticket_description, setTicketDescription] = useState([]);
  const [mapPicker, setMapPicker] = useState(false);
  const [loader, setLoader] = useState(false);
  const { Country, City, Province, ContactNum } = DemandDropDown;
  const [eventTypes, setEventTypes] = useState([]);
  const [defaultTypes, setDefaultTypes] = useState([]);
  const [eventTags, setEventTags] = useState([]);
  const [defaultTags, setDefaultTags] = useState([]);
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.SUPPLIER_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_CATEGORY_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_NAME]: {
          value: '',
          is_require: true,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_CODE]: {
          value: '',
          is_require: true,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.BEGIN_DATE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.IS_EXPIRE]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.EXPIRE_DATE]: {
          value: '',
          is_require: true,
          error: false,
        },
        ["event-country-key"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        ["event-city-key"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        ["event-state-key"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_FEATURED_IMAGE_KEY]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.IS_ALL_DAYS_IN_WEEK]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_SUNDAY]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_MONDAY]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_TUESDAY]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_WEDNESDAY]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_THURSDAY]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_FRIDAY]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_SATURDAY]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.TICKET_TAG_KEY]: {
          value: [],
          is_require: false,
          error: false,
        },
        [newConstants.TICKET_TYPE_KEY]: {
          value: [],
          is_require: true,
          error: false,
        },
        [eventConstants.EVENT_ADDRESS]: {
          value: '',
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_COUNTRY_KEY]: {
          value: '',
          is_require: false,
          type: 'dropdown',
          err_msg: '',
        },
        [eventConstants.EVENT_CITY_KEY]: {
          value: '',
          is_require: false,
          type: 'dropdown',
          err_msg: '',
        },
        [eventConstants.EVENT_STATE_KEY]: {
          value: '',
          is_require: false,
          type: 'dropdown',
          err_msg: '',
        },
        [eventConstants.EVENT_PINCODE]: {
          value: '',
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_TEL_1]: {
          value: '',
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_TEL_2]: {
          value: '',
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_MOB_1]: {
          value: '',
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_MOB_2]: {
          value: '',
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_LATTITUDE]: {
          value: '',
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_LONGITUDE]: {
          value: '',
          is_require: false,
          type: 'text',
          err_msg: '',
        },
      });
      setRightamen([])
      setTicketDescription([])
      setTicketImages([]);
      var Tab_multi = languages.map(val => ({
        [newConstants.LANG_CODE]:
        {
          value: val.value,
          is_require: false,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_NAME]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      setMultiLanguage(Tab_multi);
    } else {
      if (editData[newConstants.TICKET_TAG_LINKS].length) {
        let array = [];
        editData[newConstants.TICKET_TAG_LINKS].map((value) => {
          array.push(value[newConstants.TICKET_TAG_KEY]);
        });
        setDefaultTags(array);
      }

      if (editData[newConstants.TICKET_TYPE_LINKS].length) {
        let obj = {};
        editData[newConstants.TICKET_TYPE_LINKS].map((value) => {
          obj[value[newConstants.TICKET_TYPE_KEY]] = {
            [newConstants.TICKET_TYPE_KEY]: value[newConstants.TICKET_TYPE_KEY],
            [newConstants.IS_AGE_LIMIT]: value[newConstants.IS_AGE_LIMIT],
            [newConstants.AGE_FROM]: value[newConstants.AGE_FROM],
            [newConstants.AGE_TO]: value[newConstants.AGE_TO],
          }
        });
        setDefaultTypes(obj);
      }

      changeSupplierHandler(editData[newConstants.SUPPLIER_KEY]);

      setLocalFields({
        [newConstants.SUPPLIER_KEY]: {
          value: editData[newConstants.SUPPLIER_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_CATEGORY_KEY]: {
          value: editData[newConstants.TICKET_CATEGORY_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_NAME]: {
          value: editData[newConstants.TICKET_NAME],
          is_require: true,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_CODE]: {
          value: editData[newConstants.TICKET_CODE],
          is_require: true,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.BEGIN_DATE]: {
          value: getDateYYYYMMDD(editData[newConstants.BEGIN_DATE]),
          is_require: true,
          error: false,
        },
        [newConstants.IS_EXPIRE]: {
          value: editData[newConstants.IS_EXPIRE],
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.EXPIRE_DATE]: {
          value: getDateYYYYMMDD(editData[newConstants.EXPIRE_DATE]),
          is_require: true,
          error: false,
        },
        ["event-country-key"]: {
          value: editData["event-country-key"],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        ["event-city-key"]: {
          value: editData["event-city-key"],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        ["event-state-key"]: {
          value: editData["event-state-key"],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_FEATURED_IMAGE_KEY]: {
          value: editData[newConstants.TICKET_FEATURED_IMAGE_KEY],
          is_require: true,
          error: false,
        },
        [newConstants.IS_ALL_DAYS_IN_WEEK]: {
          value: editData[newConstants.IS_ALL_DAYS_IN_WEEK],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_SUNDAY]: {
          value: editData[newConstants.IS_SUNDAY],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_MONDAY]: {
          value: editData[newConstants.IS_MONDAY],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_TUESDAY]: {
          value: editData[newConstants.IS_TUESDAY],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_WEDNESDAY]: {
          value: editData[newConstants.IS_WEDNESDAY],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_THURSDAY]: {
          value: editData[newConstants.IS_THURSDAY],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_FRIDAY]: {
          value: editData[newConstants.IS_FRIDAY],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_SATURDAY]: {
          value: editData[newConstants.IS_SATURDAY],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_ACTIVE]: {
          value: editData[newConstants.IS_ACTIVE],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [eventConstants.EVENT_ADDRESS]: {
          value: editData[eventConstants.EVENT_ADDRESS],
          error: false,
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_COUNTRY_KEY]: {
          value: editData[eventConstants.EVENT_COUNTRY_KEY],
          error: false,
          is_require: false,
          type: 'dropdown',
          err_msg: '',
        },
        [eventConstants.EVENT_CITY_KEY]: {
          value: editData[eventConstants.EVENT_CITY_KEY],
          error: false,
          is_require: false,
          type: 'dropdown',
          err_msg: '',
        },
        [eventConstants.EVENT_STATE_KEY]: {
          value: editData[eventConstants.EVENT_STATE_KEY],
          error: false,
          is_require: false,
          type: 'dropdown',
          err_msg: '',
        },
        [eventConstants.EVENT_PINCODE]: {
          value: editData[eventConstants.EVENT_PINCODE],
          error: false,
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_TEL_1]: {
          value: editData[eventConstants.EVENT_TEL_1],
          error: false,
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_TEL_2]: {
          value: editData[eventConstants.EVENT_TEL_2],
          error: false,
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_MOB_1]: {
          value: editData[eventConstants.EVENT_MOB_1],
          error: false,
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_MOB_2]: {
          value: editData[eventConstants.EVENT_MOB_2],
          error: false,
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_LATTITUDE]: {
          value: editData[eventConstants.EVENT_LATTITUDE],
          error: false,
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [eventConstants.EVENT_LONGITUDE]: {
          value: editData[eventConstants.EVENT_LONGITUDE],
          error: false,
          is_require: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_TAG_KEY]: {
          value: editData[newConstants.TICKET_TAG_LINKS].length
            ? editData[newConstants.TICKET_TAG_LINKS].map((value) => ({
              label: value[newConstants.TICKET_TAG_NAME],
              value: value[newConstants.TICKET_TAG_KEY],
            }))
            : [],
          is_require: true,
          error: false,
        },
        [newConstants.TICKET_TYPE_KEY]: {
          value: editData[newConstants.TICKET_TYPE_LINKS].length
            ? editData[newConstants.TICKET_TYPE_LINKS].map((value) => ({
              [newConstants.TICKET_TYPE_NAME]: value[newConstants.TICKET_TYPE_NAME],
              [newConstants.TICKET_TYPE_KEY]: value[newConstants.TICKET_TYPE_KEY],
              [newConstants.IS_AGE_LIMIT]: value[newConstants.IS_AGE_LIMIT],
              [newConstants.AGE_FROM]: value[newConstants.AGE_FROM],
              [newConstants.AGE_TO]: value[newConstants.AGE_TO],
            }))
            : [],
          is_require: true,
          error: false,
        },
      });

      if (editData[newConstants.TICKET_AMENITY_LINKS].length) {
        setRightamen(
          editData[newConstants.TICKET_AMENITY_LINKS].map((val) => ({
            [newConstants.TICKET_AMENITY_KEY]: val[newConstants.TICKET_AMENITY_KEY],
            [newConstants.TICKET_AMENITY_NAME]: val[newConstants.TICKET_AMENITY_NAME],
          })),
        )
      }

      if (editData[newConstants.TICKET_IMAGE_LINKS].length) {
        setTicketImages(
          editData[newConstants.TICKET_IMAGE_LINKS].map((value) => ({
            value: value["ticket-image-path-key"],
            url: value["ticket-image-path"],
            image_type_key: value[newConstants.TICKET_IMAGE_TYPE_KEY],
          })),
        );
      }

      if (editData[newConstants.TICKET_DESCRIPTIONS] && editData[newConstants.TICKET_DESCRIPTIONS] != null && editData[newConstants.TICKET_DESCRIPTIONS].length) {
        setTicketDescription(
          editData[newConstants.TICKET_DESCRIPTIONS].map((value) => ({
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE],
            [newConstants.TICKET_DESCRIPTION_LABEL]: value[newConstants.TICKET_DESCRIPTION_LABEL],
            [newConstants.TICKET_DESCRIPTION_TEXT]: value[newConstants.TICKET_DESCRIPTION_TEXT],
          })),
        );
      }

      var Tab_multi = languages.map(val => ({
        [newConstants.LANG_CODE]: {
          value: val.value,
          is_require: false,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_NAME]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      let multi_language_ = [];
      if (editData[newConstants.TICKET_LANGUAGES] && editData[newConstants.TICKET_LANGUAGES].length) {
        editData[newConstants.TICKET_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: false,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.TICKET_NAME]: {
              value: value[newConstants.TICKET_NAME],
              is_require: false,
              error: false,
              min_length: 1,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
          });
        });
      } else {
        multi_language_.push(...Tab_multi);
      }
      setMultiLanguage(multi_language_.concat(Tab_multi.filter(f => !(multi_language_.map(v => v["lang-code"].value).includes(f["lang-code"].value)))))
    }
  }, [editData]);

  const AmenityLoad = async () => {
    let res = await httpPostRequest(getAllAmmunityY(""));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {

      let leftAmen_ = res[newConstants.DATA][newConstants.TICKET_AMENITIES].map((val, index) => ({
        [newConstants.TICKET_AMENITY_KEY]: val[newConstants.TICKET_AMENITY_KEY],
        [newConstants.TICKET_AMENITY_NAME]: val[newConstants.TICKET_AMENITY_NAME],
      }))
      setLeftamen(leftAmen_.filter(f => (!rightAmen.map(v => v[newConstants.TICKET_AMENITY_KEY]).includes(f[newConstants.TICKET_AMENITY_KEY]))))
    }
  };

  useEffect(() => {
    AmenityLoad()
  }, [rightAmen])

  const stateUpdater = (e, checker = null, constants = null) => {
    let localFields_ = _.cloneDeep(localFields);
    if (e.target.value.length == 0) {
      localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
      localFields_[e.target.name].value = e.target.value;
    } else if (checker && checker === 'checkers') {
      if (e.target.checked) {
        let obj = { [constants]: e.target.value };
        localFields_[e.target.name].value = [...localFields_[e.target.name].value, obj];
      } else {
        let filtered = localFields_[e.target.name].value.filter(val => val[constants] != e.target.value);
        localFields_[e.target.name].value = filtered;
      }
      localFields_[e.target.name].error = localFields_[e.target.name].value.length === 0 ? true : false;
    } else if (typeof e.target.value == 'object' && typeof e.target.name == 'object') {
      e.target.value.forEach((value, index) => {
        localFields_[e.target.name[index]].value = value;
        localFields_[e.target.name[index]].error = false;
      });
    } else {
      localFields_[e.target.name].value = e.target.value;
      localFields_[e.target.name].error = false;
    }
    setLocalFields(localFields_);
  };

  const typeStateUpdater = (e, constant, value, type_key) => {
    let localFields_ = _.cloneDeep(localFields);
    if (localFields_[e.target.name].value.length === 0) {      
      let obj = { [constant]: value, [newConstants.IS_AGE_LIMIT]: false, [newConstants.AGE_FROM]: 0, [newConstants.AGE_TO]: 0 };
      // console.log(localFields_[e.target.name].value)
      localFields_[e.target.name].value = [...localFields_[e.target.name].value, obj];
    } else {
      // console.log(localFields_[e.target.name].value)
      let isFound = localFields_[e.target.name].value.filter(el => el[newConstants.TICKET_TYPE_KEY] === type_key)
      if (isFound.length > 0) {
        if (constant === newConstants.TICKET_TYPE_KEY && !e.target.checked) {
          let extractedObj = localFields_[e.target.name].value.filter(el => el[newConstants.TICKET_TYPE_KEY] !== type_key)
          localFields_[e.target.name].value = extractedObj;
        } else {
          let obj = { ...isFound[0] };
          obj[constant] = value;
          let extractedObj = localFields_[e.target.name].value.filter(el => el[newConstants.TICKET_TYPE_KEY] !== type_key)
          localFields_[e.target.name].value = [...extractedObj, obj];
        }
      } else {
        let obj = { [constant]: value, [newConstants.IS_AGE_LIMIT]: false, [newConstants.AGE_FROM]: 0, [newConstants.AGE_TO]: 0 };
        localFields_[e.target.name].value = [...localFields_[e.target.name].value, obj];
      }
    }

    localFields_[e.target.name].error = localFields_[e.target.name].value.length === 0 ? true : false;


    console.log(localFields_[e.target.name].value)
    if (localFields_[e.target.name].value) {
      let obj = {};
      localFields_[e.target.name].value.map((value) => {
        obj[value[newConstants.TICKET_TYPE_KEY]] = {
          [newConstants.TICKET_TYPE_KEY]: value[newConstants.TICKET_TYPE_KEY],
          [newConstants.IS_AGE_LIMIT]: value[newConstants.IS_AGE_LIMIT],
          [newConstants.AGE_FROM]: value[newConstants.AGE_FROM],
          [newConstants.AGE_TO]: value[newConstants.AGE_TO],
        }
      });
      setDefaultTypes(obj);
    }
    setLocalFields(localFields_);
  }
  

  function multiStateUpdater(e, index, tag) {
    if (tag == 'Ticket_lang') {
      let multi_language_ = _.cloneDeep(multi_language);
      if (e.target.value.length == 0) {
        multi_language_[index][e.target.name].error = multi_language_[index][e.target.name].is_require ? true : false;
        multi_language_[index][e.target.name].value = e.target.value;
      } else {
        multi_language_[index][e.target.name].value = e.target.value;
        multi_language_[index][e.target.name].error = false;
      }
      setMultiLanguage(multi_language_);
    } else if (tag == 'image') {
      let ticket_images_ = [...ticket_images];
      e.forEach((f) => {
        ticket_images_.push({ value: f.value, url: f.url, image_type_key: f.image_type_key });
      });
      setTicketImages(ticket_images_);
    }
    else if (tag == 'ticket_description') {
      let ticket_description_ = _.cloneDeep(ticket_description);
      if (index != null) {
        ticket_description_[index] = e;
      } else {
        ticket_description_.push(e);
      }
      setTicketDescription(ticket_description_.filter(f => f && f[newConstants.LANG_CODE]?.value != ""));
    }
  }

  function removeMulti(index_, tag) {
    if (tag == 'image') {
      let ticket_images_ = _.cloneDeep(ticket_images);
      if (ticket_images_.length >= 1) {
        ticket_images_ = ticket_images_.map((val, index) => (index != index_ ? val : null));
        setTicketImages(ticket_images_.filter((f) => f != null));
      }
    }
    else if (tag == 'ticket_description') {
      let ticket_description_ = _.cloneDeep(ticket_description);
      ticket_description_ = ticket_description_.filter((f, index) => index != index_);
      setTicketDescription(ticket_description_);
    }
  }

  const addMulti = (tag) => {
    if (tag == 'lang') {
      let multi_language_ = _.cloneDeep(multi_language);
      if (
        languages.filter((f) => !multi_language.map((val) => val[newConstants.LANG_CODE].value).includes(f.value)).length &&
        multi_language.length < languages.length
      ) {
        multi_language_.push({
          [newConstants.TICKET_NAME]: {
            value: '',
            is_require: false,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.LANG_CODE]: {
            value: '',
            is_require: false,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
        });
        setMultiLanguage(multi_language_);
      }
    } else if (tag == 'images') {
      let ticket_images_ = _.cloneDeep(ticket_images);
      ticket_images_.push({
        [newConstants.TICKET_IMAGE_TYPE_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_IMAGE_PATH]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      });
      setTicketImages(ticket_images_);
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

    console.log(localFields_validation)

    let localState = _.cloneDeep(localFields);
    let isTypesError = false;
    if (localState[newConstants.TICKET_TYPE_KEY].value.length > 0) {
      localState[newConstants.TICKET_TYPE_KEY].value.map(el => {
        if (el[newConstants.IS_AGE_LIMIT] && (el[newConstants.AGE_FROM] == 0 || el[newConstants.AGE_TO] == 0)) {
          isTypesError = true;
        }
      })
    } else {
      isTypesError = true;
    }

    if (isTypesError) {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.fillrequired" /> });
      localState[newConstants.TICKET_TYPE_KEY].error = true;
      setLocalFields(localState);
    }

    let flag =
      !localFields_validation.err && !isTypesError &&
      multi_language_validator.filter((f) => f.err).length == 0;
    let multi_lang_ = multi_language.filter(f => f[newConstants.TICKET_NAME].value != "")
    if (flag) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createEventTicket(localFields, multi_lang_, rightAmen, ticket_images, ticket_description));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: <LanguageConfig id="general.successfullysaved" /> });
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.tryagain" /> });
        }
      } else {
        let res = await httpPostRequest(updateEventTicket(editData[newConstants.TICKET_KEY], localFields, multi_lang_, rightAmen, ticket_images, ticket_description));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: <LanguageConfig id="general.successfullyupdated" /> });
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.tryagain" /> });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.tryagain" /> });
    }
  };

  const changeSupplierHandler = async key => {
    let res = await httpPostRequest(GetTicketTypeBySupplier(key));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setEventTypes(
        res.data[newConstants.TICKET_TYPES].map((v) => ({
          value: v[newConstants.TICKET_TYPE_KEY],
          label: v[newConstants.TICKET_TYPE_NAME],
        })),
      );
    }
  }

  const loadEventTags = async () => {
    let res = await httpPostRequest(getAllEventTicketTag());
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setEventTags(
        res.data[newConstants.TICKET_TAGS].map((v) => ({
          value: v[newConstants.TICKET_TAG_KEY],
          label: v[newConstants.TICKET_TAG_NAME],
        })),
      );
    }
  };

  const setLatLong = (e) => {
    if (e && e['longitude']) {
      stateUpdater({
        target: {
          value: [e['longitude'] + '', e['latitude'] + ''],
          name: [eventConstants.EVENT_LONGITUDE, eventConstants.EVENT_LATTITUDE],
        },
      });
    }
  };

  useEffect(() => {
    loadEventTags();
  }, []);

  const toggleChecks = checked => {
    let optionsArr = [newConstants.IS_ALL_DAYS_IN_WEEK, newConstants.IS_SUNDAY, newConstants.IS_MONDAY, newConstants.IS_TUESDAY, newConstants.IS_WEDNESDAY, newConstants.IS_THURSDAY, newConstants.IS_FRIDAY, newConstants.IS_SATURDAY];
    let localFields_ = _.cloneDeep(localFields);
    optionsArr.map(el => localFields_[el].value = checked);
    setLocalFields(localFields_);
  }

  return (
    <div>
      {localFields.hasOwnProperty(newConstants.TICKET_NAME) ? (
        <Container>
          <Box className={classes.RouterNavbarInverse}>
            <Box className={classes.RouterInformation}>
              <Box className={classes.RouterNowmax}>
                <Box className={classes.ItemOverSeventh}>
                  <Tabs
                    value={tab}
                    onChange={handleChange}
                    variant="scrollable"
                    style={{ justifyContent: "center" }}
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="scrollable force tabs example"
                  >
                    <Tab
                      label="Event Info"

                      {...a11yProps(0)}
                    />
                    <Tab
                      label="Availability Info"

                      {...a11yProps(1)}
                    />
                    <Tab
                      label="Attributes Info"

                      {...a11yProps(2)}
                    />
                    <Tab
                      label="Images Info"

                      {...a11yProps(3)}
                    />
                  </Tabs>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className={classes.ItemInformationNow}>
            <Row padding={[10]}>
              <Column padding={[10]}>
                <TabPanel value={tab} index={0}>
                  <Card padding={[10]} margin={[0, 0, 10, 0]}>
                    <Row>
                      <Column md={3} padding={[10, 5]}>
                        <TicketSuppliers
                          name={newConstants.SUPPLIER_KEY}
                          value={localFields[newConstants.SUPPLIER_KEY].value}
                          onChange={e => { stateUpdater(e); changeSupplierHandler(e.target.value); }}
                          error={localFields[newConstants.SUPPLIER_KEY].error && localFields[newConstants.SUPPLIER_KEY].is_require}
                          helperText={
                            localFields[newConstants.SUPPLIER_KEY].error && localFields[newConstants.SUPPLIER_KEY].is_require
                              ? localFields[newConstants.SUPPLIER_KEY].err_msg
                              : ''
                          }
                          label={<LanguageConfig id={"event.eventsupplier"} />}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TicketCategory
                          label={<LanguageConfig id={"event.eventcategory"} />}
                          name={newConstants.TICKET_CATEGORY_KEY}
                          value={localFields[newConstants.TICKET_CATEGORY_KEY].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.TICKET_CATEGORY_KEY].error}
                          helperText={
                            localFields[newConstants.TICKET_CATEGORY_KEY].err_msg
                          }
                          required={localFields[newConstants.TICKET_CATEGORY_KEY].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id={"event.eventname"} />}
                          name={newConstants.TICKET_NAME}
                          value={localFields[newConstants.TICKET_NAME].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.TICKET_NAME].error}
                          helperText={
                            localFields[newConstants.TICKET_NAME].err_msg
                          }
                          required={localFields[newConstants.TICKET_NAME].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id={"event.eventcode"} />}
                          name={newConstants.TICKET_CODE}
                          value={localFields[newConstants.TICKET_CODE].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.TICKET_CODE].error}
                          helperText={
                            localFields[newConstants.TICKET_CODE].err_msg
                          }
                          required={localFields[newConstants.TICKET_CODE].is_require}
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id="event.eventaddress" />}
                          name={eventConstants.EVENT_ADDRESS}
                          value={localFields[eventConstants.EVENT_ADDRESS].value}
                          onChange={stateUpdater}
                          error={localFields[eventConstants.EVENT_ADDRESS].error}
                          helperText={localFields[eventConstants.EVENT_ADDRESS].err_msg}
                          required={localFields[eventConstants.EVENT_ADDRESS].is_require}
                          InputProps={{ style: { height: "auto" } }}
                          rows={3}
                          multiline
                          id={eventConstants.EVENT_ADDRESS}
                        />
                      </Column>
                      <Column md={9}>
                        <Row>
                          <Column md={4} padding={[10, 5]}>
                            <Country
                              name={eventConstants.EVENT_COUNTRY_KEY}
                              error={localFields[eventConstants.EVENT_COUNTRY_KEY].error}
                              value={localFields[eventConstants.EVENT_COUNTRY_KEY].value}
                              onChange={stateUpdater}
                              helperText={localFields[eventConstants.EVENT_COUNTRY_KEY].error ? 'Incorrect entry.' : ''}
                            />
                          </Column>
                          <Column md={4} padding={[10, 5]}>
                            <Province
                              name={eventConstants.EVENT_STATE_KEY}
                              value={localFields[eventConstants.EVENT_STATE_KEY].value}
                              country_key={localFields[eventConstants.EVENT_COUNTRY_KEY].value}
                              error={localFields[eventConstants.EVENT_STATE_KEY].error}
                              onChange={stateUpdater}
                              helperText={localFields[eventConstants.EVENT_STATE_KEY].error ? 'Incorrect entry.' : ''}
                            />
                          </Column>
                          <Column md={4} padding={[10, 5]}>
                            <City
                              name={eventConstants.EVENT_CITY_KEY}
                              value={localFields[eventConstants.EVENT_CITY_KEY].value}
                              country_key={localFields[eventConstants.EVENT_COUNTRY_KEY].value}
                              error={localFields[eventConstants.EVENT_CITY_KEY].error}
                              onChange={stateUpdater}
                              helperText={localFields[eventConstants.EVENT_CITY_KEY].error ? 'Incorrect entry.' : ''}
                            />
                          </Column>
                        </Row>
                        <Row>
                          <Column md={4} padding={[10, 5]}>
                            <TextField
                              label={<LanguageConfig id="general.postalcode" />}
                              name={eventConstants.EVENT_PINCODE}
                              value={localFields[eventConstants.EVENT_PINCODE].value}
                              onChange={stateUpdater}
                              error={localFields[eventConstants.EVENT_PINCODE].error}
                              helperText={localFields[eventConstants.EVENT_PINCODE].err_msg}
                              required={localFields[eventConstants.EVENT_PINCODE].is_require}
                            />
                          </Column>
                          <Column md={4} padding={[10, 5]}>
                            <TextField
                              label={<LanguageConfig id="general.lattitude" />}
                              name={eventConstants.EVENT_LATTITUDE}
                              onClick={() => setMapPicker(true)}
                              value={localFields[eventConstants.EVENT_LATTITUDE].value}
                              onChange={stateUpdater}
                              error={localFields[eventConstants.EVENT_LATTITUDE].error}
                              helperText={localFields[eventConstants.EVENT_LATTITUDE].err_msg}
                              required={localFields[eventConstants.EVENT_LATTITUDE].is_require}
                            />
                          </Column>
                          <Column md={4} padding={[10, 5]}>
                            <TextField
                              label={<LanguageConfig id="general.longitude" />}
                              name={eventConstants.EVENT_LONGITUDE}
                              onClick={() => setMapPicker(true)}
                              value={localFields[eventConstants.EVENT_LONGITUDE].value}
                              onChange={stateUpdater}
                              error={localFields[eventConstants.EVENT_LONGITUDE].error}
                              helperText={localFields[eventConstants.EVENT_LONGITUDE].err_msg}
                              required={localFields[eventConstants.EVENT_LONGITUDE].is_require}
                            />
                          </Column>
                          <MapSelect
                            openMap={mapPicker}
                            setOpenMap={setMapPicker}
                            latLong={{
                              longitude: parseFloat(localFields[eventConstants.EVENT_LONGITUDE].value),
                              latitude: parseFloat(localFields[eventConstants.EVENT_LATTITUDE].value),
                            }}
                            setLatLong={setLatLong}
                          />
                        </Row>
                      </Column>
                    </Row>
                    <Row>
                      <Column md={3} padding={[10, 5]}>
                        <ContactNum
                          inputClass="small-height-field"
                          type="number"
                          label={<LanguageConfig id="general.telephoneno1" />}
                          name={eventConstants.EVENT_TEL_1}
                          value={localFields[eventConstants.EVENT_TEL_1].value}
                          error={localFields[eventConstants.EVENT_TEL_1].error}
                          onChange={stateUpdater}
                          helperText={localFields[eventConstants.EVENT_TEL_1].err_msg}
                          required={localFields[eventConstants.EVENT_TEL_1].is_require}
                          variant="outlined"
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <ContactNum
                          inputClass="small-height-field"
                          type="number"
                          label={<LanguageConfig id="general.telephoneno2" />}
                          name={eventConstants.EVENT_TEL_2}
                          value={localFields[eventConstants.EVENT_TEL_2].value}
                          error={localFields[eventConstants.EVENT_TEL_2].error}
                          onChange={stateUpdater}
                          helperText={localFields[eventConstants.EVENT_TEL_2].err_msg}
                          required={localFields[eventConstants.EVENT_TEL_2].is_require}
                          variant="outlined"
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <ContactNum
                          inputClass="small-height-field"
                          type="number"
                          label={<LanguageConfig id="general.mobileno1" />}
                          name={eventConstants.EVENT_MOB_1}
                          value={localFields[eventConstants.EVENT_MOB_1].value}
                          error={localFields[eventConstants.EVENT_MOB_1].error}
                          onChange={stateUpdater}
                          helperText={localFields[eventConstants.EVENT_MOB_1].err_msg}
                          required={localFields[eventConstants.EVENT_MOB_1].is_require}
                          variant="outlined"
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <ContactNum
                          inputClass="small-height-field"
                          type="number"
                          label={<LanguageConfig id="general.mobileno2" />}
                          name={eventConstants.EVENT_MOB_2}
                          value={localFields[eventConstants.EVENT_MOB_2].value}
                          error={localFields[eventConstants.EVENT_MOB_2].error}
                          onChange={stateUpdater}
                          helperText={localFields[eventConstants.EVENT_MOB_2].err_msg}
                          required={localFields[eventConstants.EVENT_MOB_2].is_require}
                          variant="outlined"
                        />
                      </Column>
                      {editData &&
                        <Column md={3} padding={[10, 5]} center>
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
                            label={<LanguageConfig id={"general.isactive"} />}
                          />
                        </Column>}
                    </Row>
                  </Card>
                  <Column md={12} padding={[10, 0]}>
                    <LanguageContainer
                      classes={classes}
                      multi_language={multi_language}
                      multiStateUpdater={multiStateUpdater}
                      languages={languages}
                      copylanguages={copylanguages}
                    />
                  </Column>

                  <Column md={12} padding={[10, 0]}>
                    <TicketDescription
                      multiStateUpdater={multiStateUpdater}
                      removeMulti={removeMulti}
                      classes={classes}
                      ticket_description={ticket_description}
                    />
                  </Column>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <Row>
                    <Column md={5}  padding={[10, 5]}>
                      <Card padding={[10]}>
                        <Row>
                          <Column md={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value}
                                  color="primary"
                                  onChange={() => toggleChecks(!localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value)}
                                  name={newConstants.IS_ALL_DAYS_IN_WEEK}
                                />
                              }
                              label={<LanguageConfig id="event.isalldaysinweek" />}
                            />
                          </Column>
                          <Column md={12} padding={[0, 0, 0, 40]}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={localFields[newConstants.IS_SUNDAY].value}
                                  color="primary"
                                  onChange={() =>
                                    setLocalFields({
                                      ...localFields,
                                      [newConstants.IS_SUNDAY]: {
                                        ...localFields[newConstants.IS_SUNDAY],
                                        value: !localFields[newConstants.IS_SUNDAY].value,
                                      },
                                    })
                                  }
                                  name={newConstants.IS_SUNDAY}
                                />
                              }
                              label={<LanguageConfig id="event.issunday" />}
                            />
                          </Column>
                          <Column md={12} padding={[0, 0, 0, 40]}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={localFields[newConstants.IS_MONDAY].value}
                                  color="primary"
                                  onChange={() =>
                                    setLocalFields({
                                      ...localFields,
                                      [newConstants.IS_MONDAY]: {
                                        ...localFields[newConstants.IS_MONDAY],
                                        value: !localFields[newConstants.IS_MONDAY].value,
                                      },
                                    })
                                  }
                                  name={newConstants.IS_MONDAY}
                                />
                              }
                              label={<LanguageConfig id="event.ismonday" />}
                            />
                          </Column>
                          <Column md={12} padding={[0, 0, 0, 40]}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={localFields[newConstants.IS_TUESDAY].value}
                                  color="primary"
                                  onChange={() =>
                                    setLocalFields({
                                      ...localFields,
                                      [newConstants.IS_TUESDAY]: {
                                        ...localFields[newConstants.IS_TUESDAY],
                                        value: !localFields[newConstants.IS_TUESDAY].value,
                                      },
                                    })
                                  }
                                  name={newConstants.IS_TUESDAY}
                                />
                              }
                              label={<LanguageConfig id="event.istuesday" />}
                            />
                          </Column>
                          <Column md={12} padding={[0, 0, 0, 40]}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={localFields[newConstants.IS_WEDNESDAY].value}
                                  color="primary"
                                  onChange={() =>
                                    setLocalFields({
                                      ...localFields,
                                      [newConstants.IS_WEDNESDAY]: {
                                        ...localFields[newConstants.IS_WEDNESDAY],
                                        value: !localFields[newConstants.IS_WEDNESDAY].value,
                                      },
                                    })
                                  }
                                  name={newConstants.IS_WEDNESDAY}
                                />
                              }
                              label={<LanguageConfig id="event.iswednesday" />}
                            />
                          </Column>
                          <Column md={12} padding={[0, 0, 0, 40]}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={localFields[newConstants.IS_THURSDAY].value}
                                  color="primary"
                                  onChange={() =>
                                    setLocalFields({
                                      ...localFields,
                                      [newConstants.IS_THURSDAY]: {
                                        ...localFields[newConstants.IS_THURSDAY],
                                        value: !localFields[newConstants.IS_THURSDAY].value,
                                      },
                                    })
                                  }
                                  name={newConstants.IS_THURSDAY}
                                />
                              }
                              label={<LanguageConfig id="event.isthursday" />}
                            />
                          </Column>
                          <Column md={12} padding={[0, 0, 0, 40]}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={localFields[newConstants.IS_FRIDAY].value}
                                  color="primary"
                                  onChange={() =>
                                    setLocalFields({
                                      ...localFields,
                                      [newConstants.IS_FRIDAY]: {
                                        ...localFields[newConstants.IS_FRIDAY],
                                        value: !localFields[newConstants.IS_FRIDAY].value,
                                      },
                                    })
                                  }
                                  name={newConstants.IS_FRIDAY}
                                />
                              }
                              label={<LanguageConfig id="event.isfriday" />}
                            />
                          </Column>
                          <Column md={12} padding={[0, 0, 0, 40]}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={localFields[newConstants.IS_SATURDAY].value}
                                  color="primary"
                                  onChange={() =>
                                    setLocalFields({
                                      ...localFields,
                                      [newConstants.IS_SATURDAY]: {
                                        ...localFields[newConstants.IS_SATURDAY],
                                        value: !localFields[newConstants.IS_SATURDAY].value,
                                      },
                                    })
                                  }
                                  name={newConstants.IS_SATURDAY}
                                />
                              }
                              label={<LanguageConfig id="event.issaturday" />}
                            />
                          </Column>
                        </Row>
                      </Card>
                    </Column>
                    <Column md={7} padding={[10, 5]}>
                      <Card padding={[10]} margin={[0, 0, 10, 0]}>
                        <Row>
                          <Column md={12} padding={[0, 5]}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={localFields[newConstants.IS_EXPIRE].value}
                                  color="primary"
                                  onChange={() =>
                                    setLocalFields({
                                      ...localFields,
                                      [newConstants.IS_EXPIRE]: {
                                        ...localFields[newConstants.IS_EXPIRE],
                                        value: !localFields[newConstants.IS_EXPIRE].value,
                                      },
                                    })
                                  }
                                  name={newConstants.IS_EXPIRE}
                                />
                              }
                              label={<LanguageConfig id="event.isdaterangevisibility" />}
                            />
                          </Column>
                          <Column md={12} padding={[10, 5]}>
                            <TextField
                              type="date"
                              InputLabelProps={{ shrink: true, classes: { root: classes.DateTime } }}
                              label={<LanguageConfig id={"event.availablefrom"} />}
                              name={newConstants.BEGIN_DATE}
                              value={localFields[newConstants.BEGIN_DATE].value}
                              onChange={stateUpdater}
                              error={localFields[newConstants.BEGIN_DATE].error}
                              helperText={localFields[newConstants.BEGIN_DATE].err_msg}
                              required={localFields[newConstants.BEGIN_DATE].is_require}
                            />
                          </Column>
                          <Column md={12} padding={[10, 5]}>
                            <TextField
                              type="date"
                              InputLabelProps={{ shrink: true, classes: { root: classes.DateTime } }}
                              label={<LanguageConfig id={"event.availableto"} />}
                              name={newConstants.EXPIRE_DATE}
                              value={localFields[newConstants.EXPIRE_DATE].value}
                              onChange={stateUpdater}
                              error={localFields[newConstants.EXPIRE_DATE].error}
                              helperText={
                                localFields[newConstants.EXPIRE_DATE].err_msg
                              }
                              required={localFields[newConstants.EXPIRE_DATE].is_require}
                            />
                          </Column>
                        </Row>
                      </Card>
                    </Column>
                  </Row>
                </TabPanel>
                <TabPanel value={tab} index={2}>
                  <Row>
                    <Column md={12} padding={[10, 5]}>
                      <Card padding={[10]} className={localFields[newConstants.TICKET_TAG_KEY].error ? classes.errorContainer : ''}>
                        <Row>
                          <TableContainer>
                            <Table >
                              <TableHead>
                                <TableRow className={classes.tableHead2}>
                                  <TableCell className={classes.tableCell2}><LanguageConfig id="event.eventtags" /></TableCell>
                                  <TableCell className={classes.tableCell2}><LanguageConfig id="general.status" /></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {eventTags.map(tag => (
                                  <TableRow>
                                    <TableCell><LanguageConfig id={tag.label} /></TableCell>
                                    <TableCell>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            defaultChecked={defaultTags.includes(tag.value)}
                                            color="primary"
                                            onChange={(e) => stateUpdater(e, 'checkers', newConstants.TICKET_TAG_KEY)}
                                            value={tag.value}
                                            name={newConstants.TICKET_TAG_KEY}
                                          />
                                        }
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Row>
                      </Card>
                    </Column>
                    <Column md={12} padding={[10, 5]}>
                      <HotelAmenity
                        leftAmen={leftAmen}
                        setLeftamen={setLeftamen}
                        rightAmen={rightAmen}
                        setRightamen={setRightamen}
                      />
                    </Column>
                  </Row>
                </TabPanel>
                <TabPanel value={tab} index={3}>
                  <Column md={12} padding={[10, 5]}>
                    <Row>
                      <Column md={12} padding={[10, 0]}>
                        <Row>
                          <Column>
                            {/* <Box
                            border={1}
                            borderColor={localFields[newConstants.TICKET_FEATURED_IMAGE_KEY].error ? 'red' : 'white'}
                            borderRadius={5}> */}
                            <ImageHandler
                              localFields={localFields}
                              stateUpdater={stateUpdater}
                              multiStateUpdater={multiStateUpdater}
                              classes={classes}
                              ticket_images={ticket_images}
                              removeMulti={removeMulti}
                            />
                            {/* </Box> */}
                          </Column>
                          {/* <Column padding={[0, 0, 0, 15]}>
                          <Text size={11.5} color="#e00202">
                            {ticket_images.length > 0
                              ? localFields[newConstants.TICKET_FEATURED_IMAGE_KEY].error
                                ? 'Select a  Image as primary.'
                                : ''
                              : localFields[newConstants.TICKET_FEATURED_IMAGE_KEY].error
                                ? 'Require Field.'
                                : ''}
                          </Text>
                        </Column> */}
                        </Row>
                      </Column>
                    </Row>
                  </Column>
                </TabPanel>
              </Column>
            </Row>
          </Box>
          <Row>            
          <Row>
                  {
                    eventTypes.length > 0 &&
                    <Column md={12} padding={[10, 5]}>
                      <Card padding={[10]} className={localFields[newConstants.TICKET_TYPE_KEY].error ? classes.errorContainer : ''}>
                        <Row>
                          <TableContainer>
                            <Table >
                              <TableHead>
                                <TableRow className={classes.tableHead2}>
                                  <TableCell className={classes.tableCell2}><LanguageConfig id="event.tickettypes" /></TableCell>
                                  <TableCell className={classes.tableCell2}><LanguageConfig id="general.status" /></TableCell>
                                  <TableCell className={classes.tableCell2}><LanguageConfig id="event.isagelimit" /></TableCell>
                                  <TableCell className={classes.tableCell2}><LanguageConfig id="event.agefrom" /></TableCell>
                                  <TableCell className={classes.tableCell2}><LanguageConfig id="event.ageto" /></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {eventTypes.map((type, i) => (
                                  <TableRow>
                                    <TableCell><LanguageConfig id={type.label} /></TableCell>
                                    <TableCell>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            defaultChecked={defaultTypes[type.value] !== undefined}
                                            color="primary"
                                            value={type.value}
                                            name={newConstants.TICKET_TYPE_KEY}
                                            onChange={(e) => typeStateUpdater(e, newConstants.TICKET_TYPE_KEY, e.target.value, type.value)}
                                          />
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            color="primary"
                                            defaultChecked={defaultTypes[type.value] !== undefined && defaultTypes[type.value][newConstants.IS_AGE_LIMIT]}
                                            name={newConstants.TICKET_TYPE_KEY}
                                            disabled={defaultTypes[type.value] === undefined}
                                            onChange={(e) => typeStateUpdater(e, newConstants.IS_AGE_LIMIT, e.target.checked, type.value)}
                                          />
                                        }
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        defaultValue={defaultTypes[type.value] !== undefined && defaultTypes[type.value][newConstants.AGE_FROM]}
                                        inputProps={{ min: 1 }}
                                        disabled={defaultTypes[type.value] !== undefined && !defaultTypes[type.value][newConstants.IS_AGE_LIMIT]}
                                        name={newConstants.TICKET_TYPE_KEY}
                                        onChange={(e) => typeStateUpdater(e, newConstants.AGE_FROM, parseInt(e.target.value), type.value)}
                                        required={defaultTypes[type.value] !== undefined && defaultTypes[type.value][newConstants.IS_AGE_LIMIT]}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        defaultValue={defaultTypes[type.value] !== undefined && defaultTypes[type.value][newConstants.AGE_TO]}
                                        inputProps={{ min: 1 }}
                                        disabled={defaultTypes[type.value] !== undefined && !defaultTypes[type.value][newConstants.IS_AGE_LIMIT]}
                                        name={newConstants.TICKET_TYPE_KEY}
                                        onChange={(e) => typeStateUpdater(e, newConstants.AGE_TO, parseInt(e.target.value), type.value)}
                                        required={defaultTypes[type.value] !== undefined && defaultTypes[type.value][newConstants.IS_AGE_LIMIT]}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Row>
                      </Card>
                    </Column>
                  }
                </Row>
                {/* <Row>
              <Column md={12} padding={[10, 5]}>
                <TicketTag
                  name={newConstants.TICKET_TAG_KEY}
                  values={localFields[newConstants.TICKET_TAG_KEY]}
                  classes={classes}
                  stateUpdater={stateUpdater}
                  addMulti={addMulti}
                  removeMulti={removeMulti} />
              </Column>
            </Row> */}

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
                              {editData ? <LanguageConfig id="general.update" /> : <LanguageConfig id="general.save" />}
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
                          <LanguageConfig id="general.cancel" />
                        </Button>
                      </Row>
                    </Column>
                  </Row>
                </Column>
          </Row>
        </Container>) : null}
    </div>

  );
};

const TicketCategory = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    loadTicketCategory();
  }, [value]);

  const loadTicketCategory = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllEventTicketCategory(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.TICKET_CATEGORYS].map((v) => ({
            value: v[newConstants.TICKET_CATEGORY_KEY],
            label: v[newConstants.TICKET_CATEGORY_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.TICKET_CATEGORYS].map((v) => ({
            value: v[newConstants.TICKET_CATEGORY_KEY],
            label: v[newConstants.TICKET_CATEGORY_NAME],
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
      loadOptions={loadTicketCategory}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
}

const TicketSuppliers = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);

  useEffect(() => {
    ticketSupplierByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadTicketSupplier();
  }, []);

  const ticketSupplierByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getEventTicketKey(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.TICKET_SUPPLIER_NAME],
          value: res[newConstants.DATA][newConstants.TICKET_SUPPLIER_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadTicketSupplier = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getEventActiveYTicketSupplier(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.TICKET_SUPPLIERS].map((v) => ({
            value: v[newConstants.TICKET_SUPPLIER_KEY],
            label: v[newConstants.TICKET_SUPPLIER_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.TICKET_SUPPLIERS].map((v) => ({
            value: v[newConstants.TICKET_SUPPLIER_KEY],
            label: v[newConstants.TICKET_SUPPLIER_NAME],
          })),
        );
      }
    }
  };
  return (
    <SingelSelectOnDemand
      // defaultOptions={defaultOptions.concat(selectValue ? [selectValue] : [])}
      defaultOptions={selectValue ? [selectValue].concat(defaultOptions.filter(f => f.value != selectValue.value)) : defaultOptions}
      value={selectValue}
      name={name}
      loadOptions={loadTicketSupplier}
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
    <div ref={ref} >
      <LanguageConfig id="event.eventlanguages" />
      <GeneralLanguageContainer
        multi_language={multi_language}
        multiStateUpdater={multiStateUpdater}
        constant={newConstants.TICKET_NAME}
        fieldLabel='general.name'
        onchangeParam="Ticket_lang"
      />
    </div>
  )
}

const HotelAmenity = ({ leftAmen, setLeftamen, rightAmen, setRightamen }) => {
  const classes = useStyles();
  const [checked, setChecked] = useState([]);
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  const leftChecked = intersection(checked, leftAmen);
  const rightChecked = intersection(checked, rightAmen);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRightamen(rightAmen.concat(leftAmen));
    setLeftamen([]);
  };

  const handleCheckedRight = () => {
    setRightamen(rightAmen.concat(leftChecked));
    setLeftamen(not(leftAmen, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeftamen(leftAmen.concat(rightChecked));
    setRightamen(not(rightAmen, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeftamen(leftAmen.concat(rightAmen));
    setRightamen([]);
  };

  const filteredAmenity = leftAmen.filter(amm => {
    return amm[newConstants.TICKET_AMENITY_NAME].toLowerCase().indexOf(search.trim().toLowerCase()) !== -1;
  });


  const customList = (items, tag) => (
    <Paper className={classes.paper}>
      {tag == "left" ?
        <TextField
          style={{ width: "100%" }}
          value={search}
          name="search"
          label="search"
          onChange={(e) => setSearch(e.target.value)}
        /> : ""}
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value[newConstants.TICKET_AMENITY_NAME]} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <div style={{ textAlign: "center" }}>
      <Grid style={{ placeContent: "center", height: "auto" }}
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        className={classes.root}
      >
        <Row>
          <Column middle center>
            <Text size={23} bold><LanguageConfig id="event.eventamenities" /></Text>
          </Column>
        </Row>
        <Grid item>{customList(filteredAmenity, "left")}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              className={classes.TransferButtton}
              onClick={handleAllRight}
              disabled={leftAmen.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.TransferButtton}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.TransferButtton}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.TransferButtton}
              onClick={handleAllLeft}
              disabled={rightAmen.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList(rightAmen, "right")}</Grid>
      </Grid>
    </div>
  );
}
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const ImageHandler = ({ classes, multiStateUpdater, stateUpdater, ticket_images, localFields, removeMulti }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [tab, setTab] = useState(0);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    loadImageType();
  }, []);
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const loadImageType = async () => {
    let res = await httpPostRequest(getAllEventImageType(''));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultOptions(
        res.data[newConstants.TICKET_IMAGES_TYPES].map((v) => ({
          image_type_key: v[newConstants.TICKET_IMAGE_TYPE_KEY],
          label: v[newConstants.TICKET_IMAGE_TYPE_DESC],
          icon: v[newConstants.TICKET_IMAGE_TYPE_GLYPH_ICON],
        })),
      );
    }
  };

  const onUploadImage = async (e) => {
    setLoader(true);
    e = e.target.files;
    let key = defaultOptions[tab].image_type_key;
    let i = 0;
    let images_ = [];
    while (i < e.length) {
      const res = await httpPostRequestWithForm(imageUploder(e[i], 'EVENT_IMAGES', key));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        images_.push({ value: res.data.fileKey, url: res.data.downloadUrl, image_type_key: key });
        //setting primary image
        if (ticket_images.length == 0 && images_.length == 1) {
          stateUpdater({ target: { value: res.data.downloadUrl, name: newConstants.TICKET_FEATURED_IMAGE_KEY } });
        }
      }
      i++;
    }
    multiStateUpdater(images_, '', 'image');
    setLoader(false);
  };

  function removeImage(key) {
    let index = ticket_images.findIndex((f) => f.url == key);
    if (localFields[newConstants.TICKET_FEATURED_IMAGE_KEY].value == key) {
      if (index == 0) {
        if (ticket_images.length == 1) {
          stateUpdater({ target: { value: '', name: newConstants.TICKET_FEATURED_IMAGE_KEY } });
        } else {
          stateUpdater({ target: { value: ticket_images[1].url, name: newConstants.TICKET_FEATURED_IMAGE_KEY } });
        }
      } else {
        stateUpdater({ target: { value: ticket_images[0].url, name: newConstants.TICKET_FEATURED_IMAGE_KEY } });
      }
    }
    removeMulti(index, 'image');
  }

  return (
    <Row >
      <Text bold style={{marginLeft:10}}><LanguageConfig id="event.eventgallery" /></Text>
      {/* <LoadingOverlay
        active={loader}
        spinner
        text='Please wait Image is uploading...' 
      > */}
      <Row margin={[10,0,0,0]}>
        <Column>
          <div className={classes.root}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={tab}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              className={classes.tabs}>
              {defaultOptions.map((value, index) => (
                <Tab label={value.label} {...a11yProps(index)} />
              ))}
            </Tabs>
            {defaultOptions.map((value, index) => (
              <TabPanel value={tab} index={index} className={classes.tabContainer}>
                <Row>
                  <Column md={6} xs={12} sm={12}>
                    <h2>{value.label}</h2>
                  </Column>
                  <Column md={6} xs={12} sm={12} right>
                    <input
                      accept="image/*"
                      onChange={onUploadImage}
                      multiple="multiple"
                      className={classes.inputSelect}
                      id={'icon-button-file' + index}
                      type="file"
                    />
                    <label htmlFor={'icon-button-file' + index}>
                      <IconButton color="primary" aria-label="upload picture" component="span">
                        <AddAPhoto className={classes.addPhotos} />
                      </IconButton>
                    </label>
                  </Column>
                  <Column className={classes.modalScrollContainer}>
                    <Row>
                      {ticket_images
                        .filter((f) => f.image_type_key == value.image_type_key)
                        .map((val, index1) => (
                          <Column key={'image_hotel_' + index1} md={2} padding={[5]}>
                            <div style={{ position: 'relative' }}>
                              <Touchable
                                className={classes.imageSelectContainer}
                                onClick={() =>
                                  stateUpdater({
                                    target: { value: val.url, name: newConstants.TICKET_FEATURED_IMAGE_KEY },
                                  })
                                }>
                                {localFields[newConstants.TICKET_FEATURED_IMAGE_KEY].value == val.url ? (
                                  <CheckCircle className={classes.primaryImageSelect} />
                                ) : (
                                  <RadioButtonUnchecked className={classes.primaryImageUnSelect} />
                                )}
                              </Touchable>
                              <Touchable
                                onClick={() =>
                                  stateUpdater({
                                    target: { value: val.url, name: newConstants.TICKET_FEATURED_IMAGE_KEY },
                                  })
                                }>
                                <img className={classes.hotelImage} src={val.url} />
                              </Touchable>
                              <Touchable className={classes.closeImageContainer} onClick={() => removeImage(val.url)}>
                                <Cancel className={classes.closeImage} />
                              </Touchable>
                            </div>
                          </Column>
                        ))}
                    </Row>
                  </Column>
                </Row>
              </TabPanel>
            ))}
          </div>
        </Column>
      </Row>
    </Row>
  );
};

const TicketDescription = ({ multiStateUpdater, removeMulti, classes, ticket_description }) => {
  const options = {
    [newConstants.LANG_CODE]: {
      value: '',
      is_require: true,
      error: false,
    },
    [newConstants.TICKET_DESCRIPTION_TEXT]: {
      value: '',
      is_require: true,
      error: false,
    },
    [newConstants.TICKET_DESCRIPTION_LABEL]: {
      value: '',
      is_require: true,
      error: false,
    },
  };
  const [values, setValues] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const { languages, copylanguages } = useStore();
  const { Language } = DemandDropDown;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let options_ = _.cloneDeep(options);
    if (editIndex != null) {
      options_[newConstants.LANG_CODE].value = ticket_description[editIndex][newConstants.LANG_CODE];
      options_[newConstants.TICKET_DESCRIPTION_TEXT].value =
        ticket_description[editIndex][newConstants.TICKET_DESCRIPTION_TEXT];
      options_[newConstants.TICKET_DESCRIPTION_LABEL].value =
        ticket_description[editIndex][newConstants.TICKET_DESCRIPTION_LABEL];
    }
    setValues(options_);
  }, [editIndex]);

  function stateUpdater(e) {
    let values_ = { ...values };
    values_[e.target.name].error = e.target.value.length == 0 && values_[e.target.name].is_require ? true : false;
    values_[e.target.name].value = e.target.value;
    setValues(values_);
  }

  const save = () => {
    let values_validator = { ...values };
    values_validator = validator(values_validator);
    if (!values_validator.err) {
      multiStateUpdater(
        {
          [newConstants.LANG_CODE]: values[newConstants.LANG_CODE].value,
          [newConstants.TICKET_DESCRIPTION_TEXT]: values[newConstants.TICKET_DESCRIPTION_TEXT].value,
          [newConstants.TICKET_DESCRIPTION_LABEL]: values[newConstants.TICKET_DESCRIPTION_LABEL].value,
        },
        editIndex,
        'ticket_description',
      );
      setValues(_.cloneDeep(options));
      if (editIndex != null) {
        setEditIndex(null);
      }
    } else {
      setValues(values_validator.values);
    }
  };

  return (
    <Row >
      <Text bold ><LanguageConfig id="general.description" /></Text>
      <Row>
        {values ? (
          <Column>
            <Row>
              <Column md={10}>
                <Row>
                  <Column md={3} padding={[5]}>
                    <Language
                      options={copylanguages}
                      value={values[newConstants.LANG_CODE].value}
                      name={newConstants.LANG_CODE}
                      error={values[newConstants.LANG_CODE].error}
                      onChange={(e) => stateUpdater(e)}
                      helperText={values[newConstants.LANG_CODE].error ? 'require field' : ''}
                      label={<LanguageConfig id="general.languagecode" />}
                    />
                  </Column>
                  <Column md={9} padding={[5]}>
                    <TextField
                      label={<LanguageConfig id="general.title" />}
                      type="text"
                      value={values[newConstants.TICKET_DESCRIPTION_LABEL].value}
                      name={newConstants.TICKET_DESCRIPTION_LABEL}
                      error={values[newConstants.TICKET_DESCRIPTION_LABEL].error}
                      onChange={(e) => stateUpdater(e)}
                      helperText={'Incorrect entry.'}
                      required={values[newConstants.TICKET_DESCRIPTION_LABEL].is_require}
                    />
                  </Column>
                  <Column padding={[5]}>
                    <TextField
                      label={<LanguageConfig id="general.description" />}
                      type="text"
                      value={values[newConstants.TICKET_DESCRIPTION_TEXT].value}
                      name={newConstants.TICKET_DESCRIPTION_TEXT}
                      error={values[newConstants.TICKET_DESCRIPTION_TEXT].error}
                      onChange={(e) => stateUpdater(e)}
                      helperText={'Incorrect entry.'}
                      required={values[newConstants.TICKET_DESCRIPTION_TEXT].is_require}
                    />
                  </Column>
                </Row>
              </Column>
              <Column md={2} padding={[5, 10]}>
                <Button onClick={save} className={classes.modalBtn} variant="contained" color="primary">
                  <LanguageConfig id="general.add" />
                </Button>
              </Column>
            </Row>
          </Column>
        ) : null}
        <Column>
          <div className={classes.scrollContainer}>
            <Row>
              {ticket_description.map(
                (value, index) =>
                  editIndex != index && (
                    <Column key={'hotel_issue_' + index} md={4} padding={[5]}>
                      <Card padding={[5]}>
                        <Row>
                          <Column md={10} xs={10} sm={10}>
                            <Row>
                              <Column>
                                <Text size={10} color={'blue'}>
                                  <LanguageConfig id="general.languagecode" />
                                </Text>
                                <Text size={13}>{value[newConstants.LANG_CODE]}</Text>
                              </Column>
                              <Column>
                                <Text size={10} color={'blue'}>
                                  <LanguageConfig id="general.title" />
                                </Text>
                                <Text size={13}>{value[newConstants.TICKET_DESCRIPTION_LABEL]}</Text>
                              </Column>
                              <Column>
                                <Text size={10} color={'blue'}>
                                  <LanguageConfig id="general.description" />
                                </Text>
                                <Text size={13}>{value[newConstants.TICKET_DESCRIPTION_TEXT]}</Text>
                              </Column>
                            </Row>
                          </Column>
                          <Column md={2} xs={2} sm={2}>
                            <Row>
                              <Column>
                                <IconButton onClick={() => setEditIndex(index)}>
                                  <Edit style={{ fontSize: 18, color: 'blue' }} />
                                </IconButton>
                              </Column>
                              <Column>
                                <IconButton>
                                  <Delete
                                    onClick={() => removeMulti(index, 'ticket_description')}
                                    style={{ fontSize: 18, color: 'red' }}
                                  />
                                </IconButton>
                              </Column>
                            </Row>
                          </Column>
                        </Row>
                      </Card>
                    </Column>
                  )
              )}
            </Row>
          </div>
        </Column>
      </Row>
    </Row>
  );
};




