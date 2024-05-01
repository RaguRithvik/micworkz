import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Text, Card, TextField, Row, Column, Loader, CustomAlert, SingelSelectOnDemand, DemandDropDown, ModalComponent, MapSelect, Touchable, Glyphi } from '../../core';
import { Fade, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControlLabel, Grid, List, ListItem, ListItemText, Checkbox, ListItemIcon, IconButton, Tabs, Tab, Box, Typography } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Edit, Delete, AddAPhoto, RadioButtonUnchecked, CheckCircle, Cancel } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest, httpPostRequestWithForm } from '../../helper/JsHelper';
import {
  hotelMasterUpdate,
  hotelMasterSave,
  hotelMasterGetByKey,
  getHotelTypeY,
  getAllHotelCategoryY,
  getHotelCategoryInfoById,
  getAllAmmunityY,
  hotelMasterGet,
  imageUploder,
  getAllHotelImageTypeY,
  hotelMasterSaves,
  deleteByHotel,
  getHotelTax,
  createHotelCategory,
  createHotelType,
  hotelMasterUpdates
} from '../../helper/RequestPayLoad';
import PropTypes from 'prop-types';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from "../PrimaryContainer";
import GeneralLanguageContainer from "../GeneralLanguageContainer";
import LanguageConfig from "../../helper/LanguageConfig";
import { Container } from 'next/app';
import EventAmenity from "./AmenityMaster/EventAmenity"
import IssuesHotel from "./EventMaster/IssuesHotel"
import HotelTagsNew from "./EventMaster/HotelTags"
import ImageType from "./EventMaster/ImageType"
import NearbyPlaces from "./NearbyPlace/NearbyPlaces"

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
  Modal: {
    "&:focus": {
      outline: "none"
    },
    position: 'absolute',
    // width: theme.spacing.unit * 90,
    width: "85%",
    height: "90%",
    overflowX: "auto",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    [theme.breakpoints.down('sm')]: {
      // width: theme.spacing.unit * 35,
      width: "80%",
      overflowX: "auto",
      height: "70%"
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
  Languageheadernow: { fontSize: '30px', marginBottom: '11px', },
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
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [deleteId, setDeleteId] = useState('');
  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUM]: { is_hide: true, bool: true, label: <LanguageConfig id="managehotel.sno" /> },
    [newConstants.HOTEL_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.hotelname" /> },
    [newConstants.HOTEL_EMAIL1]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.email" /> },
    [newConstants.HOTEL_ADDRESS]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.address" /> },
    [newConstants.HOTEL_COUNTRY_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.country" /> },
    [newConstants.HOTEL_PROVINCE_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.procinces" /> },
    [newConstants.HOTEL_CITY_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.city" /> },
    [newConstants.HOTEL_OFFICE_PHONE1]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.officephone" /> },
    [newConstants.HOTEL_CONTACT_PERSON]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.contactperson" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.lastupdatedon" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.lastupdatedby" /> },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="managehotel.status" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="managehotel.action" /> }

  });

  const loadData = async () => {
    if (!addEdit) {
      setLoader(true);
      let res = await httpPostRequest(hotelMasterGet(search_key, (currIndex - 1) * pageSize + 1, pageSize));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setData(res[newConstants.DATA][newConstants.HOTELS]);
        setMaxPage(
          res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
            parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
            0
            ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
            : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
        );
        setLoader(false);
      }
      else {
        setLoader(false);
        setCurrIndex(1);
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  const editHotel = async (key) => {
    setAddEdit(false)
    let res = await httpPostRequest(hotelMasterGetByKey(key));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setEditData(res[newConstants.DATA]);
      setAddEdit(true);
    }
    else {
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHotel = async () => {
    if (deleteId != '') {
      setDeleteLoader(deleteId);
      const res = await httpPostRequest(deleteByHotel(deleteId));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setDeleteLoader('');
        loadData();
        setDeleteId('');
      } else {
        setDeleteLoader('');
        setDeleteId('');
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    } else {
      setDeleteId('');
    }
  };

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
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
              addEdit={addEdit}
              setAddEdit={setAddEdit}
              classes={classes}
              languages={languages}
              copylanguages={copylanguages}
              setAlertMsg={setAlertMsg}
            />
          </Fade>
        }
      </Card>
      <PrimaryContainer
        formName={editData != null && addEdit == true ? formname + "-" + "(Update)" : editData == null && addEdit == true ? formname + "-" + "(Save)" : formname}
        search_key={search_key}
        addEdit={addEdit}
        search={search}
        setAddEdit={setAddEdit}
        currIndex={currIndex}
        maxPage={maxPage}
        editData={editData}
        setCurrIndex={setCurrIndex}
        setPageSize={setPageSize}
        pageSize={pageSize}
        showCol={showCol}
        setShowCol={setShowCol}
        loadData={loadData}
        data={data}
        filter_object={newConstants.ROW_NUM}
        editRow={editHotel}
        deleteRow={setDeleteId}
        action_key={newConstants.HOTEL_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="managehotel.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={deleteHotel}
        />
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit, setAlertMsg, languages, copylanguages }) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [rightAmen, setRightamen] = useState([]);
  const [mapPicker, setMapPicker] = useState(false);
  const [loader, setLoader] = useState(false);
  const { Country, City, Province, ContactNum } = DemandDropDown;
  const [storeTag, setStoretag] = useState([])
  const [tab, setTab] = useState(0);
  const [tabfirst, setTabFirst] = useState(false)
  const [imageData, setImageData] = useState([]);
  const [imageflag, setImageflag] = useState(false)
  const [storeAmenity, setStoreAmenity] = useState([])
  const [storeNearbyPlaces, setStoreNearbyPlaces] = useState([])
  const [storeIssuesHotel, setStoreIssuesHotel] = useState([])
  const [hotel_description, setHotelDescription] = useState([]);
  const [multi_images, setMultiImages] = useState([]);
  const [leftAmen, setLeftamen] = useState([]);
  const [category, setCategory] = useState(false);
  const [type, setType] = useState(false);
  const [categoryValue, setCategoryValue] = useState([]);
  const [typeValue, setTypeValue] = useState([]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.HOTEL_NAME]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_ADDRESS]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_EMAIL1]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_WEB_SITE]: {
          value: '',
          is_require: false,
          error: false,
        },
        [newConstants.HOTEL_OFFICE_PHONE1]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_OFFICE_PHONE2]: {
          value: '',
          is_require: false,
          error: false,
        },
        [newConstants.HOTEL_PHONE1]: {
          value: "",
          is_require: false,
          error: false,
        },
        [newConstants.HOTEL_REGNO]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_CONTACT_PERSON]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_CATEGORY_KEY]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_TYPE_KEY]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_POSTAL_CODE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_LATITUDE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_LONGITUDE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_PROVINCE_KEY]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_CITY_KEY]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_COUNTRY_KEY]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.TAX_TYPE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.SERVICE_TYPE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.ADDITIONAL_TYPE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_TAX_VALUE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_SERVICE_VALUE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_ADDITIONAL_VALUE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_TAX_RULE_KEY]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP]: {
          value: false,
          is_require: false,
          error: false,
          type: "boolean",
          err_msg: "",
        },
        [newConstants.CLIENT_MARGIN_VALUE]: {
          value: "",
          is_require: true,
          error: false,
        },
        [newConstants.CLIENT_MARGIN_TYPE]: {
          value: "",
          is_require: true,
          error: false,
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
        [newConstants.HOTEL_NAME]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_ADDRESS]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_CONTACT_PERSON]: {
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
      setRightamen([])
      setHotelDescription([]);
      setMultiImages([]);
    }
    else {
      if (editData && editData[newConstants.HOTEL_TAGS]) {
        var editData_tag = editData[newConstants.HOTEL_TAGS].map((v) => ({
          [newConstants.HOTEL_TAG_NAME]: v[newConstants.HOTEL_TAG_NAME],
          [newConstants.HOTEL_TAG_KEY]: v[newConstants.HOTEL_TAG_KEY],
        }))
        setStoretag(editData_tag)
      }
      setLocalFields({
        [newConstants.HOTEL_NAME]: {
          value: editData[newConstants.HOTEL_NAME],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_ADDRESS]: {
          value: editData[newConstants.HOTEL_ADDRESS],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_EMAIL1]: {
          value: editData[newConstants.HOTEL_EMAIL1],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_WEB_SITE]: {
          value: editData[newConstants.HOTEL_WEB_SITE],
          is_require: false,
          error: false,
        },
        [newConstants.HOTEL_OFFICE_PHONE1]: {
          value: editData[newConstants.HOTEL_OFFICE_PHONE1],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_OFFICE_PHONE2]: {
          value: editData[newConstants.HOTEL_OFFICE_PHONE2],
          is_require: false,
          error: false,
        },
        [newConstants.HOTEL_CONTACT_PERSON]: {
          value: editData[newConstants.HOTEL_CONTACT_PERSON],
          is_require: false,
          error: false,
        },
        [newConstants.HOTEL_PHONE1]: {
          value: editData[newConstants.HOTEL_PHONE1],
          is_require: false,
          error: false,
        },
        [newConstants.HOTEL_REGNO]: {
          value: editData[newConstants.HOTEL_REGNO],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_CATEGORY_KEY]: {
          value: editData[newConstants.HOTEL_CATEGORY_KEY],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_TYPE_KEY]: {
          value: editData[newConstants.HOTEL_TYPE_KEY],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_POSTAL_CODE]: {
          value: editData[newConstants.HOTEL_POSTAL_CODE],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_LATITUDE]: {
          value: editData[newConstants.HOTEL_LATITUDE],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_LONGITUDE]: {
          value: editData[newConstants.HOTEL_LONGITUDE],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY]: {
          value: editData[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_PROVINCE_KEY]: {
          value: editData[newConstants.HOTEL_PROVINCE_KEY],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_CITY_KEY]: {
          value: editData[newConstants.HOTEL_CITY_KEY],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_COUNTRY_KEY]: {
          value: editData[newConstants.HOTEL_COUNTRY_KEY],
          is_require: true,
          error: false,
        },
        [newConstants.TAX_TYPE]: {
          value: editData[newConstants.TAX_TYPE],
          is_require: true,
          error: false,
        },
        [newConstants.SERVICE_TYPE]: {
          value: editData[newConstants.SERVICE_TYPE],
          is_require: true,
          error: false,
        },
        [newConstants.ADDITIONAL_TYPE]: {
          value: editData[newConstants.ADDITIONAL_TYPE],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_TAX_VALUE]: {
          value: editData[newConstants.HOTEL_TAX_VALUE],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_SERVICE_VALUE]: {
          value: editData[newConstants.HOTEL_SERVICE_VALUE],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_ADDITIONAL_VALUE]: {
          value: editData[newConstants.HOTEL_ADDITIONAL_VALUE],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_TAX_RULE_KEY]: {
          value: editData[newConstants.HOTEL_TAX_RULE_KEY],
          is_require: true,
          error: false,
        },
        [newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP]: {
          value: editData[newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP],
          is_require: false,
          error: false,
          type: "boolean",
          err_msg: "",
        },
        [newConstants.CLIENT_MARGIN_VALUE]: {
          value: editData[newConstants.CLIENT_MARGIN_VALUE],
          is_require: true,
          error: false,
        },
        [newConstants.CLIENT_MARGIN_TYPE]: {
          value: editData[newConstants.CLIENT_MARGIN_TYPE],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_TAGS]: {
          value: editData[newConstants.HOTEL_TAGS].length
            ? editData[newConstants.HOTEL_TAGS].map((value) => ({
              [newConstants.HOTEL_TAG_NAME]: value[newConstants.HOTEL_TAG_NAME],
              [newConstants.HOTEL_TAG_KEY]: value[newConstants.HOTEL_TAG_KEY],
            }))
            : [],
          is_require: false,
          error: false,
        },
      });
      if (editData && editData[newConstants.HOTEL_AMENITIES]) {
        var editData_ = editData[newConstants.HOTEL_AMENITIES].map((val) => ({
          key: val[newConstants.HOTEL_AMENITY_KEY],
          label: val[newConstants.HOTEL_AMENITY_NAME],
        }))
        setStoreAmenity(editData_)
      }
      if (editData[newConstants.HOTEL_IMAGES].length) {
        setMultiImages(
          editData[newConstants.HOTEL_IMAGES].map((value) => ({
            value: value[newConstants.IMAGE_PATH_KEY],
            url: value[newConstants.IMAGE_PATH],
            image_type_key: value[newConstants.IMAGE_TYPE_KEY],
          })),
        );
      }
      if (editData[newConstants.HOTEL_ISSUES].length) {
        var editData_ = editData[newConstants.HOTEL_ISSUES].map((val) => ({
          [newConstants.HOTEL_ISSUES_KEY]: val[newConstants.HOTEL_ISSUES_KEY],
          [newConstants.HOTEL_ISSUES_TITLE]: val[newConstants.HOTEL_ISSUES_TITLE],
          [newConstants.HOTEL_ISSUES_KEY]: val[newConstants.HOTEL_ISSUES_KEY],
          [newConstants.EFFECTIVE_FROM]: val[newConstants.EFFECTIVE_FROM],
          [newConstants.EFFECTIVE_TO]: val[newConstants.EFFECTIVE_TO],
        }))
        setStoreIssuesHotel(editData_)
      }
      if (editData[newConstants.HOTEL_DESCRIPTIONS].length) {
        setHotelDescription(
          editData[newConstants.HOTEL_DESCRIPTIONS].map((value) => ({
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE],
            [newConstants.HOTEL_DESCRIPTION_LABEL]: value[newConstants.HOTEL_DESCRIPTION_LABEL],
            [newConstants.HOTEL_DESCRIPTION_TEXT]: value[newConstants.HOTEL_DESCRIPTION_TEXT],
          })),
        );
      }
      if (editData[newConstants.HOTEL_NEAR_PLACES].length) {
        var editData_ = editData[newConstants.HOTEL_NEAR_PLACES].map((val) => ({
          [newConstants.HOTEL_NEAR_BY_PLACE_KEY]: val[newConstants.NEAR_PLACE_KEY],
          [newConstants.NEAR_PLACE_DESC]: val[newConstants.NEAR_PLACE_DESC],
          [newConstants.LATTITUDE]: val[newConstants.LATTITUDE],
          [newConstants.LONGITUDE]: val[newConstants.LONGITUDE],
        }))
        setStoreNearbyPlaces(editData_)
      }
      var Tab_multi = languages.map(val => ({
        [newConstants.LANG_CODE]: {
          value: val.value,
          is_require: false,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_NAME]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_ADDRESS]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_CONTACT_PERSON]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      let hotel_languages_ = [];
      if (editData[newConstants.HOTEL_LANGUAGES] && editData[newConstants.HOTEL_LANGUAGES].length) {
        editData[newConstants.HOTEL_LANGUAGES].forEach((value) => {
          hotel_languages_.push({
            [newConstants.LANG_CODE]: {
              value: value[newConstants.CC_LANG_CODE],
              is_require: false,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.HOTEL_NAME]: {
              value: value[newConstants.C_HOTEL_NAME],
              is_require: false,
              error: false,
              min_length: 1,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.HOTEL_ADDRESS]: {
              value: value[newConstants.C_HOTEL_ADDRESS],
              is_require: false,
              error: false,
              min_length: 1,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.HOTEL_CONTACT_PERSON]: {
              value: value[newConstants.HOTEL_CONTACT_PERSON],
              is_require: false,
              error: false,
              min_length: 1,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
          });
        });
      }
      else {
        hotel_languages_.push(...Tab_multi);
      }
      setMultiLanguage(hotel_languages_.concat(Tab_multi.filter(f => !(hotel_languages_.map(v => v["lang-code"].value).includes(f["lang-code"].value)))))
    }
  }, [editData]);

  const AmenityLoad = async () => {
    let res = await httpPostRequest(getAllAmmunityY(""));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {

      let leftAmen_ = res[newConstants.DATA][newConstants.HOTEL_AMENITIES].map((val, index) => ({
        [newConstants.HOTEL_AMENITY_KEY]: val[newConstants.HOTEL_AMENITY_KEY],
        [newConstants.HOTEL_AMENITY_NAME]: val[newConstants.HOTEL_AMENITY_NAME],
      }))
      setLeftamen(leftAmen_.filter(f => (!rightAmen.map(v => v[newConstants.HOTEL_AMENITY_KEY]).includes(f[newConstants.HOTEL_AMENITY_KEY]))))
    }
  };

  useEffect(() => {
    AmenityLoad()
  }, [rightAmen])

  const stateUpdater = (e) => {
    let localFields_ = _.cloneDeep(localFields);
    if (e.target.value.length == 0) {
      localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
      localFields_[e.target.name].value = e.target.value;
    }
    else if (typeof e.target.value == 'object' && typeof e.target.name == 'object') {
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

  function multiStateUpdater(e, index, tag) {
    if (tag == 'image') {
      let multi_images_ = [...multi_images];
      e.forEach((f) => {
        multi_images_.push({ value: f.value, url: f.url, image_type_key: f.image_type_key });
      });
      setMultiImages(multi_images_);
    }
    else if (tag == 'hotel_lang') {
      let hotel_languages_ = _.cloneDeep(multi_language);
      if (e.target.value.length == 0) {
        hotel_languages_[index][e.target.name].error = hotel_languages_[index][e.target.name].is_require ? true : false;
        hotel_languages_[index][e.target.name].value = e.target.value;
      }
      else {
        hotel_languages_[index][e.target.name].value = e.target.value;
        hotel_languages_[index][e.target.name].error = false;
      }
      setMultiLanguage(hotel_languages_);
    }
    else if (tag == 'hotel_description') {
      let hotel_description_ = _.cloneDeep(hotel_description);
      if (index != null) {
        hotel_description_[index] = e;
      } else {
        hotel_description_.push(e);
      }
      setHotelDescription(hotel_description_.filter(f => f && f[newConstants.LANG_CODE]?.value != ""));
    }

  }
  function multiStateUpdate(e, index) {
    let hotel_languages_ = _.cloneDeep(multi_language);
    if (e.target.value.length == 0) {
      hotel_languages_[index][e.target.name].error = hotel_languages_[index][e.target.name].is_require ? true : false;
      hotel_languages_[index][e.target.name].value = e.target.value;
    }
    else {
      hotel_languages_[index][e.target.name].value = e.target.value;
      hotel_languages_[index][e.target.name].error = false;
    }
    setMultiLanguage(hotel_languages_);
  }
  function removeMulti(index_, tag) {
    if (tag == 'image') {
      let multi_images_ = _.cloneDeep(multi_images);
      if (multi_images_.length >= 1) {
        multi_images_ = multi_images_.map((val, index) => (index != index_ ? val : null));
        setMultiImages(multi_images_.filter((f) => f != null));
      }
    }
    else if (tag == 'hotel_description') {
      let hotel_description_ = _.cloneDeep(hotel_description);
      hotel_description_ = hotel_description_.filter((f, index) => index != index_);
      setHotelDescription(hotel_description_);
    }
  }

  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setTabFirst(true)
      setLocalFields(localFields_validation.values);
    }
    else {
      setTabFirst(false)
    }
    let flag = !localFields_validation.err;
    let multi_lang_ = multi_language.filter(f => f[newConstants.HOTEL_NAME].value != "")
    if (flag) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(hotelMasterSaves(localFields, multi_lang_, hotel_description, multi_images, storeAmenity, storeNearbyPlaces, storeIssuesHotel, storeTag));
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
        let res = await httpPostRequest(hotelMasterUpdates(editData[newConstants.HOTEL_KEY], localFields, multi_lang_, hotel_description, multi_images, storeAmenity, storeNearbyPlaces, storeIssuesHotel, storeTag));
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

  const setLatLong = (e) => {
    if (e && e['longitude']) {
      stateUpdater({
        target: {
          value: [e["longitude"] + "", e["latitude"] + ""],
          name: [newConstants.HOTEL_LONGITUDE, newConstants.HOTEL_LATITUDE],
        },
      });
    }
  };

  const loadHotelType = async () => {
    let res = await httpPostRequest(getHotelTypeY("", 1, 200));
    if (
      res &&
      res[newConstants.DATA_EXCEPTION] &&
      res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200
    ) {
      setTypeValue(
        res.data[newConstants.HOTEL_TYPES].map((v) => ({
          value: v[newConstants.HOTEL_TYPE_KEY],
          label: v[newConstants.HOTEL_TYPE_DESC],
        }))
      );
    }
  };

  const loadCateory = async (inputValue = "", callback = null) => {
    let res = await httpPostRequest(getAllHotelCategoryY(inputValue));
    if (
      res &&
      res[newConstants.DATA_EXCEPTION] &&
      res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200
    ) {
      if (callback) {
        callback(
          res.data[newConstants.HOTEL_CATEGORIES].map((v) => ({
            value: v[newConstants.HOTEL_CATEGORY_KEY],
            label: v[newConstants.HOTEL_CATEGORY_NAME],
          }))
        );
      } else {
        setCategoryValue(
          res.data[newConstants.HOTEL_CATEGORIES].map((v) => ({
            value: v[newConstants.HOTEL_CATEGORY_KEY],
            label: v[newConstants.HOTEL_CATEGORY_NAME],
          }))
        );
      }
    }
  };

  useEffect(() => {
    loadHotelType()
    loadCateory()
  }, [])
  return (
    <div>
      {localFields.hasOwnProperty(newConstants.HOTEL_NAME) ? (
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
                      label="Hotel Info"
                      style={{ color: tabfirst ? "red" : "" }}
                      {...a11yProps(0)}
                    />
                    <Tab
                      label="Hotel Attributes"
                      {...a11yProps(1)}
                    />
                    <Tab
                      label="Images Info"
                      style={{ color: localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY].error ? "red" : "" }}
                      {...a11yProps(2)}
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
                      <Column md={3} padding={[5]} >
                        <Box>
                          <Button variant="outlined" color="primary" style={{ width: "65%" }} onClick={() => setType(true)}>Add Type</Button>
                        </Box>
                      </Column>
                      <Column md={3} padding={[5]} >
                        <Box>
                          <Button variant="outlined" color="primary" style={{ width: "65%" }} onClick={() => setCategory(true)}>Add Category</Button>
                        </Box>
                      </Column>
                    </Row>
                    <Row>
                      <ModalComponent open={category} setOpen={setCategory} className={classes.Modal}>
                        <Fade >
                          <AddCategory
                            setCategory={setCategory}
                            category={category}
                            setAlertMsg={setAlertMsg}
                            loadCateory={loadCateory}
                            typeValue={typeValue}
                            loadHotelType={loadHotelType}
                          />
                        </Fade>
                      </ModalComponent>
                      <ModalComponent open={type} setOpen={setType} className={classes.Modal}>
                        <AddType
                          type={type}
                          setType={setType}
                          setAlertMsg={setAlertMsg}
                          loadHotelType={loadHotelType}
                        />
                      </ModalComponent>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id="managehotel.hotelname" />}
                          name={newConstants.HOTEL_NAME}
                          value={localFields[newConstants.HOTEL_NAME].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.HOTEL_NAME].error}
                          helperText={
                            localFields[newConstants.HOTEL_NAME].err_msg
                          }
                          required={localFields[newConstants.HOTEL_NAME].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <HotelType
                          name={newConstants.HOTEL_TYPE_KEY}
                          typeValue={typeValue} setTypeValue={setTypeValue}
                          error={localFields[newConstants.HOTEL_TYPE_KEY].error}
                          value={localFields[newConstants.HOTEL_TYPE_KEY].value}
                          onChange={stateUpdater}
                          helperText={localFields[newConstants.HOTEL_TYPE_KEY].error ? 'Incorrect entry.' : ''}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <HotelCategory
                          name={newConstants.HOTEL_CATEGORY_KEY}
                          error={localFields[newConstants.HOTEL_CATEGORY_KEY].error}
                          value={localFields[newConstants.HOTEL_CATEGORY_KEY].value}
                          onChange={stateUpdater}
                          helperText={localFields[newConstants.HOTEL_CATEGORY_KEY].error ? 'Incorrect entry.' : ''}
                          categoryValue={categoryValue} setCategoryValue={setCategoryValue}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id="managehotel.registrationno" />}
                          name={newConstants.HOTEL_REGNO}
                          value={localFields[newConstants.HOTEL_REGNO].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.HOTEL_REGNO].error}
                          helperText={
                            localFields[newConstants.HOTEL_REGNO].err_msg
                          }
                          required={localFields[newConstants.HOTEL_REGNO].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id="managehotel.email" />}
                          name={newConstants.HOTEL_EMAIL1}
                          value={localFields[newConstants.HOTEL_EMAIL1].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.HOTEL_EMAIL1].error}
                          helperText={
                            localFields[newConstants.HOTEL_EMAIL1].err_msg
                          }
                          required={localFields[newConstants.HOTEL_EMAIL1].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id="managehotel.website" />}
                          name={newConstants.HOTEL_WEB_SITE}
                          value={localFields[newConstants.HOTEL_WEB_SITE].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.HOTEL_WEB_SITE].error}
                          helperText={
                            localFields[newConstants.HOTEL_WEB_SITE].err_msg
                          }
                          required={localFields[newConstants.HOTEL_WEB_SITE].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id="managehotel.contactperson" />}
                          name={newConstants.HOTEL_CONTACT_PERSON}
                          value={localFields[newConstants.HOTEL_CONTACT_PERSON].value}
                          onChange={stateUpdater}
                          error={
                            localFields[newConstants.HOTEL_CONTACT_PERSON].error}
                          helperText={
                            localFields[newConstants.HOTEL_CONTACT_PERSON].err_msg
                          }
                          required={localFields[newConstants.HOTEL_CONTACT_PERSON].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <ContactNum
                          variant="outlined"
                          inputClass="small-height-field"
                          type="number"
                          label={<LanguageConfig id="managehotel.officephone1" />}
                          name={newConstants.HOTEL_OFFICE_PHONE1}
                          value={localFields[newConstants.HOTEL_OFFICE_PHONE1].value}
                          onChange={stateUpdater}
                          error={
                            localFields[newConstants.HOTEL_OFFICE_PHONE1].error}
                          helperText={
                            localFields[newConstants.HOTEL_OFFICE_PHONE1].err_msg
                          }
                          required={localFields[newConstants.HOTEL_OFFICE_PHONE1].is_require}

                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <ContactNum
                          variant="outlined"
                          inputClass="small-height-field"
                          type="number"
                          label={<LanguageConfig id="managehotel.officephone2" />}
                          name={newConstants.HOTEL_OFFICE_PHONE2}
                          value={localFields[newConstants.HOTEL_OFFICE_PHONE2].value}
                          onChange={stateUpdater}
                          error={
                            localFields[newConstants.HOTEL_OFFICE_PHONE2].error}
                          helperText={
                            localFields[newConstants.HOTEL_OFFICE_PHONE2].err_msg
                          }
                          required={localFields[newConstants.HOTEL_OFFICE_PHONE2].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <ContactNum
                          variant="outlined"
                          inputClass="small-height-field"
                          type="number"
                          label={"hotel phoneno 1"}
                          name={newConstants.HOTEL_PHONE1}
                          value={localFields[newConstants.HOTEL_PHONE1].value}
                          onChange={stateUpdater}
                          error={
                            localFields[newConstants.HOTEL_PHONE1].error}
                          helperText={
                            localFields[newConstants.HOTEL_PHONE1].err_msg
                          }
                          required={localFields[newConstants.HOTEL_PHONE1].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={"hotel tax value"}
                          type="number"
                          name={newConstants.HOTEL_TAX_VALUE}
                          value={localFields[newConstants.HOTEL_TAX_VALUE].value}
                          onChange={stateUpdater}
                          error={
                            localFields[newConstants.HOTEL_TAX_VALUE].error}
                          helperText={
                            localFields[newConstants.HOTEL_TAX_VALUE].err_msg
                          }
                          required={localFields[newConstants.HOTEL_TAX_VALUE].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={"hotel service value"}
                          type="number"
                          name={newConstants.HOTEL_SERVICE_VALUE}
                          value={localFields[newConstants.HOTEL_SERVICE_VALUE].value}
                          onChange={stateUpdater}
                          error={
                            localFields[newConstants.HOTEL_SERVICE_VALUE].error}
                          helperText={
                            localFields[newConstants.HOTEL_SERVICE_VALUE].err_msg
                          }
                          required={localFields[newConstants.HOTEL_SERVICE_VALUE].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={"hotel additional value"}
                          type="number"
                          name={newConstants.HOTEL_ADDITIONAL_VALUE}
                          value={localFields[newConstants.HOTEL_ADDITIONAL_VALUE].value}
                          onChange={stateUpdater}
                          error={
                            localFields[newConstants.HOTEL_ADDITIONAL_VALUE].error}
                          helperText={
                            localFields[newConstants.HOTEL_ADDITIONAL_VALUE].err_msg
                          }
                          required={localFields[newConstants.HOTEL_ADDITIONAL_VALUE].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <HotelTaxRule
                          name={newConstants.HOTEL_TAX_RULE_KEY}
                          error={localFields[newConstants.HOTEL_TAX_RULE_KEY].error}
                          value={localFields[newConstants.HOTEL_TAX_RULE_KEY].value}
                          onChange={stateUpdater}
                          helperText={localFields[newConstants.HOTEL_TAX_RULE_KEY].error ? 'Incorrect entry.' : ''}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TypeRates
                          name={newConstants.TAX_TYPE}
                          value={localFields[newConstants.TAX_TYPE].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.TAX_TYPE].error && localFields[newConstants.TAX_TYPE].is_require}
                          helperText={
                            localFields[newConstants.TAX_TYPE].error && localFields[newConstants.TAX_TYPE].is_require
                              ? localFields[newConstants.TAX_TYPE].err_msg
                              : ''
                          }
                          label={"Tax Type"}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TypeRates
                          name={newConstants.SERVICE_TYPE}
                          value={localFields[newConstants.SERVICE_TYPE].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.SERVICE_TYPE].error && localFields[newConstants.SERVICE_TYPE].is_require}
                          helperText={
                            localFields[newConstants.SERVICE_TYPE].error && localFields[newConstants.SERVICE_TYPE].is_require
                              ? localFields[newConstants.SERVICE_TYPE].err_msg
                              : ''
                          }
                          label={"Service Type"}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TypeRates
                          name={newConstants.ADDITIONAL_TYPE}
                          value={localFields[newConstants.ADDITIONAL_TYPE].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.ADDITIONAL_TYPE].error && localFields[newConstants.ADDITIONAL_TYPE].is_require}
                          helperText={
                            localFields[newConstants.ADDITIONAL_TYPE].error && localFields[newConstants.ADDITIONAL_TYPE].is_require
                              ? localFields[newConstants.ADDITIONAL_TYPE].err_msg
                              : ''
                          }
                          label={"Additional Type"}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={"Margin Value"}
                          type="number"
                          name={newConstants.CLIENT_MARGIN_VALUE}
                          value={localFields[newConstants.CLIENT_MARGIN_VALUE].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.CLIENT_MARGIN_VALUE].error}
                          helperText={localFields[newConstants.CLIENT_MARGIN_VALUE].err_msg}
                          required={localFields[newConstants.CLIENT_MARGIN_VALUE].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TypeRates
                          name={newConstants.CLIENT_MARGIN_TYPE}
                          value={localFields[newConstants.CLIENT_MARGIN_TYPE].value}
                          onChange={stateUpdater}
                          error={
                            localFields[newConstants.CLIENT_MARGIN_TYPE].error &&
                            localFields[newConstants.CLIENT_MARGIN_TYPE].is_require
                          }
                          helperText={
                            localFields[newConstants.CLIENT_MARGIN_TYPE].error &&
                              localFields[newConstants.CLIENT_MARGIN_TYPE].is_require
                              ? localFields[newConstants.CLIENT_MARGIN_TYPE].err_msg
                              : ""
                          }
                          label={"Margin Type"}
                        />
                      </Column>
                      <Column md={3} padding={[0, 10]}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={localFields[newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP].value}
                              color="primary"
                              onChange={() =>
                                setLocalFields({
                                  ...localFields, [newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP]: {
                                    ...localFields[newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP], value: !localFields[newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP].value,
                                  },
                                })
                              }
                              name={newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP}
                            />
                          }
                          label="Show Price With Tax Break"
                        />
                      </Column>
                      <Column padding={[5, 0]}>
                        <Text bold><LanguageConfig id="managehotel.address" /></Text>
                      </Column>
                      <Column md={6} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id="managehotel.hoteladdress" />}
                          name={newConstants.HOTEL_ADDRESS}
                          value={localFields[newConstants.HOTEL_ADDRESS].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.HOTEL_ADDRESS].error}
                          helperText={
                            localFields[newConstants.HOTEL_ADDRESS].err_msg
                          }
                          InputProps={{
                            style: {
                              height: "auto",
                            }
                          }}
                          rows={3}
                          multiline
                          id="outlined-multiline-static"
                          required={localFields[newConstants.HOTEL_ADDRESS].is_require}
                        />
                      </Column>
                      <Column md={6}>
                        <Row>
                          <Column md={6} padding={[10, 5]}>
                            <Country
                              name={newConstants.HOTEL_COUNTRY_KEY}
                              error={localFields[newConstants.HOTEL_COUNTRY_KEY].error}
                              value={localFields[newConstants.HOTEL_COUNTRY_KEY].value}
                              onChange={stateUpdater}
                              helperText={localFields[newConstants.HOTEL_COUNTRY_KEY].error ? 'Incorrect entry.' : ''}
                            />
                          </Column>
                          <Column md={6} padding={[10, 5]}>
                            <Province
                              name={newConstants.HOTEL_PROVINCE_KEY}
                              value={localFields[newConstants.HOTEL_PROVINCE_KEY].value}
                              country_key={localFields[newConstants.HOTEL_COUNTRY_KEY].value}
                              error={localFields[newConstants.HOTEL_PROVINCE_KEY].error}
                              onChange={stateUpdater}
                              helperText={localFields[newConstants.HOTEL_PROVINCE_KEY].error ? 'Incorrect entry.' : ''}
                            />
                          </Column>
                          <Column md={6} padding={[10, 5]}>
                            <City
                              name={newConstants.HOTEL_CITY_KEY}
                              value={localFields[newConstants.HOTEL_CITY_KEY].value}
                              country_key={localFields[newConstants.HOTEL_COUNTRY_KEY].value}
                              error={localFields[newConstants.HOTEL_CITY_KEY].error}
                              onChange={stateUpdater}
                              helperText={localFields[newConstants.HOTEL_CITY_KEY].error ? 'Incorrect entry.' : ''}
                            />
                          </Column>
                          <Column md={6} padding={[10, 5]}>
                            <TextField
                              label={<LanguageConfig id="managehotel.postalcode" />}
                              name={newConstants.HOTEL_POSTAL_CODE}
                              value={localFields[newConstants.HOTEL_POSTAL_CODE].value}
                              onChange={stateUpdater}
                              error={localFields[newConstants.HOTEL_POSTAL_CODE].error}
                              helperText={localFields[newConstants.HOTEL_POSTAL_CODE].err_msg}
                              required={localFields[newConstants.HOTEL_POSTAL_CODE].is_require}
                            />
                          </Column>
                        </Row>
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id="managehotel.latitude" />}
                          onClick={() => setMapPicker(true)}
                          name={newConstants.HOTEL_LATITUDE}
                          value={localFields[newConstants.HOTEL_LATITUDE].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.HOTEL_LATITUDE].error}
                          helperText={
                            localFields[newConstants.HOTEL_LATITUDE].err_msg
                          }
                          required={localFields[newConstants.HOTEL_LATITUDE].is_require}
                        />
                      </Column>
                      <Column md={3} padding={[10, 5]}>
                        <TextField
                          label={<LanguageConfig id="managehotel.longitude" />}
                          onClick={() => setMapPicker(true)}
                          name={newConstants.HOTEL_LONGITUDE}
                          value={localFields[newConstants.HOTEL_LONGITUDE].value}
                          onChange={stateUpdater}
                          error={localFields[newConstants.HOTEL_LONGITUDE].error}
                          helperText={
                            localFields[newConstants.HOTEL_LONGITUDE].err_msg
                          }
                          required={localFields[newConstants.HOTEL_LONGITUDE].is_require}
                        />
                      </Column>
                      <MapSelect
                        openMap={mapPicker}
                        setOpenMap={setMapPicker}
                        latLong={{
                          longitude: parseFloat(
                            localFields[newConstants.HOTEL_LONGITUDE].value
                          ),
                          latitude: parseFloat(localFields[newConstants.HOTEL_LATITUDE].value),
                        }}
                        setLatLong={setLatLong}
                      />
                    </Row>
                  </Card>
                  {/* <Column md={12} padding={[10, 0]}>
                    <LanguageContainer
                      classes={classes}
                      multi_language={multi_language}
                      multiStateUpdater={multiStateUpdater}
                      languages={languages}
                      copylanguages={copylanguages}
                    />
                  </Column> */}
                  <Column padding={[5, 0]}>
                    <Text bold>
                      <LanguageConfig id="managehotel.hotellanguage" />
                    </Text>
                  </Column>
                  <Column md={12} padding={[10, 5]}>
                    <Row>
                      {multi_language.map((val, index) => (<>
                        <Column md={3} padding={[10, 5]}>
                          <Text>{languages.filter(f => f.value == val[newConstants.LANG_CODE].value).length ? languages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label : val[newConstants.LANG_CODE].value}</Text>
                        </Column>
                        <Column md={3} padding={[10, 5]}>
                          <TextField
                            label={"name"}
                            type="text"
                            value={val[newConstants.HOTEL_NAME].value}
                            name={newConstants.HOTEL_NAME}
                            error={val[newConstants.HOTEL_NAME].error}
                            onChange={(e) => multiStateUpdate(e, index)}
                            helperText={val[newConstants.HOTEL_NAME].err_msg}
                          />
                        </Column>
                        <Column md={3} padding={[10, 5]}>
                          <TextField
                            label={"Address"}
                            type="text"
                            value={val[newConstants.HOTEL_ADDRESS].value}
                            name={newConstants.HOTEL_ADDRESS}
                            error={val[newConstants.HOTEL_ADDRESS].error}
                            onChange={(e) => multiStateUpdate(e, index)}
                            helperText={val[newConstants.HOTEL_ADDRESS].err_msg}
                          />
                        </Column>
                        <Column md={3} padding={[10, 5]}>
                          <TextField
                            label={"Contact"}
                            type="text"
                            value={val[newConstants.HOTEL_CONTACT_PERSON].value}
                            name={newConstants.HOTEL_CONTACT_PERSON}
                            error={val[newConstants.HOTEL_CONTACT_PERSON].error}
                            onChange={(e) => multiStateUpdate(e, index)}
                            helperText={val[newConstants.HOTEL_CONTACT_PERSON].err_msg}
                          />
                        </Column></>))}
                    </Row>
                  </Column>



                  <Column md={12} padding={[10, 0]}>
                    <HotelDescriptionHandler
                      multiStateUpdater={multiStateUpdater}
                      removeMulti={removeMulti}
                      classes={classes}
                      hotel_description={hotel_description}
                    />
                  </Column>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <EventAmenity storeAmenity={storeAmenity} setStoreAmenity={setStoreAmenity} />
                  <IssuesHotel storeIssuesHotel={storeIssuesHotel} setStoreIssuesHotel={setStoreIssuesHotel} />
                  <NearbyPlaces storeNearbyPlaces={storeNearbyPlaces} setStoreNearbyPlaces={setStoreNearbyPlaces} />
                  <HotelTagsNew storeTag={storeTag} setStoretag={setStoretag} />
                </TabPanel>
                <TabPanel value={tab} index={2}>
                  <Column md={12} padding={[10, 5]}>
                    <Row>
                      <ParentImage imageflag={imageflag} setImageflag={setImageflag}
                        imageData={imageData} classes={classes} setImageData={setImageData}
                        multiStateUpdater={multiStateUpdater} stateUpdater={stateUpdater} multi_images={multi_images}
                        localFields={localFields} removeMulti={removeMulti} />
                    </Row>
                  </Column>
                </TabPanel>
              </Column>
            </Row>
          </Box>
          <Row>
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

const LanguageContainer = ({ classes, multi_language, multiStateUpdater, languages, copylanguages }) => {
  const ref = useRef();
  return (
    <div ref={ref} >
      <LanguageConfig id="managehotel.hotellanguage" />
      <GeneralLanguageContainer
        multi_language={multi_language}
        multiStateUpdater={multiStateUpdater}
        constant={newConstants.HOTEL_NAME}
        constant_a={newConstants.HOTEL_ADDRESS}
        constant_c={newConstants.HOTEL_CONTACT_PERSON}
        fieldLabel='general.name'
        onchangeParam="hotel_lang"
      />
    </div>
  )
}

const ParentImage = ({ imageflag, setImageflag, imageData, classes, setImageData, multiStateUpdater, stateUpdater, multi_images, localFields, removeMulti }) => {
  const [loader, setLoader] = useState(false)

  const loadData = async () => {
    let res = await httpPostRequest(getAllHotelImageTypeY(""));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setImageData(res.data[newConstants.HOTEL_IMAGE_TYPES].map((v) => ({
        image_type_key: v[newConstants.HOTEL_IMAGE_TYPE_KEY],
        label: v[newConstants.HOTEL_IMAGE_TYPE_DESC],
        icon: v[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON],
      })));
    } else {
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }

  };

  useEffect(() => {
    loadData();
  }, []);

  const onUploadImage = async (e, key) => {
    setLoader(true);
    e = e.target.files;
    let i = 0;
    let images_ = [];
    while (i < e.length) {
      const res = await httpPostRequestWithForm(imageUploder(e[i], 'HOTEL_IMAGES', key));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        images_.push({ value: res.data.fileKey, url: res.data.downloadUrl, image_type_key: key });
        //setting primary image
        if (multi_images.length == 0 && images_.length == 1) {
          stateUpdater({ target: { value: res.data.downloadUrl, name: newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY } });
        }
      }
      i++;
    }
    multiStateUpdater(images_, '', 'image');
    setLoader(false);
  };

  function removeImage(key) {
    let index = multi_images.findIndex((f) => f.url == key);
    if (localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY].value == key) {
      if (index == 0) {
        if (multi_images.length == 1) {
          stateUpdater({ target: { value: '', name: newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY } });
        } else {
          stateUpdater({ target: { value: multi_images[1].url, name: newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY } });
        }
      } else {
        stateUpdater({ target: { value: multi_images[0].url, name: newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY } });
      }
    }
    removeMulti(index, 'image');
  }

  return (
    <Column md={12}>
      <Row>
        <Column md={3}>
          <h3 className={classes.Languageheadernow}>ImageTypes</h3>
        </Column>
        <Column md={9} right>
          <Box >
            <Button variant="outlined" color="primary" style={{ width: "100%" }} onClick={() => setImageflag(true)}>Add Type</Button>
          </Box>
        </Column>
        <Column md={12}>
          {imageData.map((value, index) =>
            <Row>
              <Column md={6}>
                <Text bold size={16}>{value.label}</Text>
              </Column>
              <Column md={6} xs={12} sm={12} right>
                <input
                  accept="image/*"
                  onChange={(e) => onUploadImage(e, value.image_type_key)}
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
              {multi_images.filter((f) => f.image_type_key == value.image_type_key).length > 0 &&
                <Column className={classes.modalScrollContainer}>
                  <Row>
                    {multi_images.filter((f) => f.image_type_key == value.image_type_key).map((val, index1) => (<Column key={'image_hotel_' + index1} md={2} padding={[5]}>
                      <div style={{ position: 'relative' }}>
                        <Touchable
                          className={classes.imageSelectContainer}
                          onClick={() =>
                            stateUpdater({
                              target: { value: val.url, name: newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY },
                            })
                          }>
                          {localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY].value == val.url ? (
                            <CheckCircle className={classes.primaryImageSelect} />
                          ) : (
                            <RadioButtonUnchecked className={classes.primaryImageUnSelect} />
                          )}
                        </Touchable>
                        <Touchable
                          onClick={() =>
                            stateUpdater({
                              target: { value: val.url, name: newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY },
                            })
                          }>
                          {/* {loader? <Loader size={17} color={'blue'} />: */}
                          <img className={classes.hotelImage} src={val.url} />
                          {/* } */}
                        </Touchable>
                        <Touchable className={classes.closeImageContainer} onClick={() => removeImage(val.url)}>
                          <Cancel className={classes.closeImage} />
                        </Touchable>
                      </div>
                    </Column>
                    ))}
                  </Row>
                </Column>}
            </Row>
          )}
        </Column>
      </Row>
      <ModalComponent open={imageflag} setOpen={setImageflag} className={classes.Modal}>
        <ImageType imageData={imageData} setImageData={setImageData} setImageflag={setImageflag} loadData={loadData} />
      </ModalComponent>
    </Column>
  )
}

const HotelDescriptionHandler = ({ multiStateUpdater, removeMulti, classes, hotel_description }) => {
  const options = {
    [newConstants.LANG_CODE]: {
      value: '',
      is_require: true,
      error: false,
    },
    [newConstants.HOTEL_DESCRIPTION_TEXT]: {
      value: '',
      is_require: true,
      error: false,
    },
    [newConstants.HOTEL_DESCRIPTION_LABEL]: {
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
      options_[newConstants.LANG_CODE].value = hotel_description[editIndex][newConstants.LANG_CODE];
      options_[newConstants.HOTEL_DESCRIPTION_TEXT].value =
        hotel_description[editIndex][newConstants.HOTEL_DESCRIPTION_TEXT];
      options_[newConstants.HOTEL_DESCRIPTION_LABEL].value =
        hotel_description[editIndex][newConstants.HOTEL_DESCRIPTION_LABEL];
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
          [newConstants.HOTEL_DESCRIPTION_TEXT]: values[newConstants.HOTEL_DESCRIPTION_TEXT].value,
          [newConstants.HOTEL_DESCRIPTION_LABEL]: values[newConstants.HOTEL_DESCRIPTION_LABEL].value,
        },
        editIndex,
        'hotel_description',
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
    <Row>
      <Text bold ><LanguageConfig id="managehotel.hoteldesc" /></Text>
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
                      label={<LanguageConfig id="managehotel.languagecode" />}
                    />
                  </Column>
                  <Column md={9} padding={[5]}>
                    <TextField
                      label={<LanguageConfig id="managehotel.title" />}
                      type="text"
                      value={values[newConstants.HOTEL_DESCRIPTION_LABEL].value}
                      name={newConstants.HOTEL_DESCRIPTION_LABEL}
                      error={values[newConstants.HOTEL_DESCRIPTION_LABEL].error}
                      onChange={(e) => stateUpdater(e)}
                      helperText={'Incorrect entry.'}
                      required={values[newConstants.HOTEL_DESCRIPTION_LABEL].is_require}
                    />
                  </Column>
                  <Column padding={[5]}>
                    <TextField
                      label={<LanguageConfig id="managehotel.hoteldesc" />}
                      type="text"
                      value={values[newConstants.HOTEL_DESCRIPTION_TEXT].value}
                      name={newConstants.HOTEL_DESCRIPTION_TEXT}
                      error={values[newConstants.HOTEL_DESCRIPTION_TEXT].error}
                      onChange={(e) => stateUpdater(e)}
                      helperText={'Incorrect entry.'}
                      required={values[newConstants.HOTEL_DESCRIPTION_TEXT].is_require}
                    />
                  </Column>
                </Row>
              </Column>
              <Column md={2} padding={[5, 10]}>
                <Button onClick={save} className={classes.modalBtn} variant="contained" color="primary">
                  <LanguageConfig id="managehotel.add" />
                </Button>
              </Column>
            </Row>
          </Column>
        ) : null}
        <Column>
          <div className={classes.scrollContainer}>
            <Row>
              {hotel_description.map(
                (value, index) =>
                  editIndex != index && (
                    <Column key={'hotel_issue_' + index} md={4} padding={[5]}>
                      <Card padding={[5]}>
                        <Row>
                          <Column md={10} xs={10} sm={10}>
                            <Row>
                              <Column>
                                <Text size={10} color={'blue'}>
                                  <LanguageConfig id="managehotel.languagecode" />
                                </Text>
                                <Text size={13}>{value[newConstants.LANG_CODE]}</Text>
                              </Column>
                              <Column>
                                <Text size={10} color={'blue'}>
                                  <LanguageConfig id="managehotel.title" />
                                </Text>
                                <Text size={13}>{value[newConstants.HOTEL_DESCRIPTION_LABEL]}</Text>
                              </Column>
                              <Column>
                                <Text size={10} color={'blue'}>
                                  <LanguageConfig id="managehotel.description" />
                                </Text>
                                <Text size={13}>{value[newConstants.HOTEL_DESCRIPTION_TEXT]}</Text>
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
                                    onClick={() => removeMulti(index, 'hotel_description')}
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

const HotelCategory = ({
  error,
  name,
  value: hotel_category_key,
  helperText,
  onChange,
  loadCateory,
  categoryValue,
  setCategoryValue,
}) => {
  const [value, setValue] = useState(null);
  const getCategoryByKey = async () => {
    if (hotel_category_key) {
      let res = await httpPostRequest(
        getHotelCategoryInfoById(hotel_category_key)
      );
      if (
        res &&
        res[newConstants.DATA_EXCEPTION] &&
        res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200
      ) {
        setValue({
          value: hotel_category_key,
          label: res.data[newConstants.HOTEL_CATEGORY_NAME],
        });
      }
    }
  };
  useEffect(() => {
    getCategoryByKey();
  }, [hotel_category_key, categoryValue]);

  // useEffect(() => {
  //   loadCateory();
  // }, []);

  const loadOptions = (inputValue = "", callback = null) => {
    callback(categoryValue.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))
  }
  return (
    <SingelSelectOnDemand
      defaultOptions={
        value
          ? [value].concat(categoryValue.filter((f) => f.value != value.value))
          : categoryValue
      }
      value={value}
      // loadOptions={loadCateory}
      loadOptions={loadOptions}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={<LanguageConfig id="managehotel.hotelcategory" />}
      helperText={helperText}
      error={error}
    />
  );
};

const HotelType = ({
  error,
  name,
  value: hotel_type_key,
  helperText,
  onChange,
  typeValue,
  loadHotelType,
}) => {
  const [value, setValue] = useState(null);

  const getCategoryByKey = async () => {
    if (hotel_type_key && typeValue.length) {
      setValue(
        typeValue.filter((f) => f.value == hotel_type_key).length
          ? typeValue.filter((f) => f.value == hotel_type_key)[0]
          : null
      );
    }
  };
  useEffect(() => {
    getCategoryByKey();
  }, [hotel_type_key, typeValue]);

  // useEffect(() => {
  //   loadHotelType();
  // }, []);

  const loadCateory = async (inputValue = "", callback = null) => {
    callback(typeValue.filter((f) => f.value.includes(inputValue)));
  };

  return (
    <SingelSelectOnDemand
      defaultOptions={typeValue}
      value={value}
      loadOptions={loadCateory}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={<LanguageConfig id="managehotel.hoteltype" />}
      helperText={helperText}
      error={error}
    />
  );
};

const HotelTaxRule = ({
  error,
  name,
  value: hotel_tax_key,
  helperText,
  onChange,
}) => {
  const [value, setValue] = useState(null);
  const [defaultValue, setDefaultValue] = useState([]);

  const getCategoryByKey = async () => {
    if (hotel_tax_key && defaultValue.length) {
      setValue(
        defaultValue.filter((f) => f.value == hotel_tax_key).length
          ? defaultValue.filter((f) => f.value == hotel_tax_key)[0]
          : null
      );
    }
  };
  useEffect(() => {
    getCategoryByKey();
  }, [hotel_tax_key, defaultValue]);

  useEffect(() => {
    loadHotelTax();
  }, []);

  const loadHotelTax = async () => {
    let res = await httpPostRequest(getHotelTax());
    if (
      res &&
      res[newConstants.DATA_EXCEPTION] &&
      res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200
    ) {
      setDefaultValue(
        res.data.map((v) => ({
          value: v[newConstants.TAX_RULE_KEY],
          label: v[newConstants.TAX_RULE_NAME],
        }))
      );
    }
  };

  const loadCateory = async (inputValue = "", callback = null) => {
    callback(defaultValue.filter((f) => f.value.includes(inputValue)));
  };

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultValue}
      value={value}
      loadOptions={loadCateory}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={"Hotel tax rule"}
      helperText={helperText}
      error={error}
    />
  );
};

const TypeRates = ({
  name,
  value,
  onChange,
  error,
  helperText,
  label,
  isDisabled,
}) => {
  const [defaultOptions, setDefaultOptions] = useState([
    { value: "P", label: "Percentage" },
    { value: "F", label: "Flat rate" },
  ]);

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={
        defaultOptions.filter((f) => f.value == value).length
          ? defaultOptions.filter((f) => f.value == value)[0]
          : null
      }
      name={name}
      isDisabled={isDisabled}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const AddCategory = ({
  category,
  setCategory,
  setAlertMsg,
  loadCateory,
  typeValue,
  loadHotelType,
}) => {
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [categoryField, setCategoryField] = useState([]);
  const stateUpdater = (e) => {
    let categoryField_ = _.cloneDeep(categoryField);
    if (e.target.value.length == 0) {
      categoryField_[e.target.name].error = categoryField_[e.target.name]
        .is_require
        ? true
        : false;
      categoryField_[e.target.name].value = e.target.value;
    } else {
      categoryField_[e.target.name].value = e.target.value;
      categoryField_[e.target.name].error = false;
    }
    setCategoryField(categoryField_);
  };

  const save = async () => {
    let categoryField_validation = _.cloneDeep(categoryField);
    categoryField_validation = validator(categoryField_validation);
    if (categoryField_validation.err) {
      setCategoryField(categoryField_validation.values);
    }
    let flag = !categoryField_validation.err;
    if (flag) {
      setLoader(true);
      let res = await httpPostRequest(createHotelCategory(categoryField, []));
      if (
        res &&
        res[constants.DATA_EXCEPTION] &&
        res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200
      ) {
        setLoader(false);
        setCategory(false);
        loadCateory();
        setAlertMsg({
          type: "success",
          msg: res[constants.DATA_EXCEPTION].err_msg,
        });
      } else {
        setLoader(false);
        setAlertMsg({
          type: "error",
          msg: res[constants.DATA_EXCEPTION].err_msg,
        });
      }
    } else {
      setAlertMsg({
        type: "error",
        msg: <LanguageConfig id="managehotel.fillrequired" />,
      });
    }
  };

  useEffect(() => {
    setCategoryField({
      [newConstants.HOTEL_TYPE_KEY]: {
        value: "",
        is_require: true,
        error: false,
        type: "dropdown",
        err_msg: "",
      },
      [newConstants.HOTEL_CATEGORY_NAME]: {
        value: "",
        is_require: true,
        error: false,
        min_length: 2,
        max_length: null,
        type: "text",
        err_msg: "",
      },
      [newConstants.HOTEL_CATEGORY_GLYP_CSS]: {
        value: "",
        is_require: false,
        error: false,
        type: "dropdown",
        err_msg: "",
      },
    });
  }, []);
  return (
    <div>
      <Row padding={[10]}>
        <Column md={3} padding={[10, 5]}>
          <TextField
            label={<LanguageConfig id={"hotelcategory.categoryname"} />}
            name={newConstants.HOTEL_CATEGORY_NAME}
            value={
              categoryField[newConstants.HOTEL_CATEGORY_NAME] &&
              categoryField[newConstants.HOTEL_CATEGORY_NAME].value
            }
            onChange={stateUpdater}
            error={
              categoryField[newConstants.HOTEL_CATEGORY_NAME] &&
              categoryField[newConstants.HOTEL_CATEGORY_NAME].error
            }
            helperText={
              categoryField[newConstants.HOTEL_CATEGORY_NAME] &&
              categoryField[newConstants.HOTEL_CATEGORY_NAME].err_msg
            }
            required={
              categoryField[newConstants.HOTEL_CATEGORY_NAME] &&
              categoryField[newConstants.HOTEL_CATEGORY_NAME].is_require
            }
          />
        </Column>
        <Column md={3} padding={[10, 5]}>
          <HotelType
            typeValue={typeValue}
            loadHotelType={loadHotelType}
            name={newConstants.HOTEL_TYPE_KEY}
            error={
              categoryField[newConstants.HOTEL_TYPE_KEY] &&
              categoryField[newConstants.HOTEL_TYPE_KEY].error
            }
            value={
              categoryField[newConstants.HOTEL_TYPE_KEY] &&
              categoryField[newConstants.HOTEL_TYPE_KEY].value
            }
            onChange={stateUpdater}
            helperText={
              categoryField[newConstants.HOTEL_TYPE_KEY] &&
                categoryField[newConstants.HOTEL_TYPE_KEY].error
                ? "Incorrect entry."
                : ""
            }
          />
        </Column>
        <Column md={3} padding={[10, 5]}>
          <Glyphi
            size="small"
            labelId="category_icon"
            id="hotel-cat-icon"
            name={newConstants.HOTEL_CATEGORY_GLYP_CSS}
            value={
              categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS] &&
              categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS].value
            }
            error={
              categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS] &&
              categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS].error
            }
            onChange={stateUpdater}
            helperText={
              categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS] &&
              categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS].err_msg
            }
            label={<LanguageConfig id={"hotelcategory.icon"} />}
            required={
              categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS] &&
                categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS].is_require
                ? true
                : false
            }
          />
        </Column>
        <Row>
          <Column md={10}>{/* <Button>Save</Button> */}</Column>
          <Column md={2} right>
            <Button
              className={classes.saveButton}
              variant="contained"
              color="primary"
              onClick={loader ? console.log("") : save}
            >
              <Row>
                {loader ? (
                  <Column md={1} xs={1} sm={1} center middle>
                    <Loader size={14} color={"white"} />
                  </Column>
                ) : null}
                <Column
                  md={loader ? 11 : 12}
                  xs={loader ? 11 : 12}
                  center
                  middle
                  sm={loader ? 11 : 12}
                >
                  <LanguageConfig id={"save"} />
                </Column>
              </Row>
            </Button>
          </Column>
        </Row>
      </Row>
    </div>
  );
};

const AddType = ({ type, setType, loadHotelType, setAlertMsg }) => {
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [typeField, setTypeField] = useState([]);
  const stateUpdater = (e) => {
    let typeField_ = _.cloneDeep(typeField);
    if (e.target.value.length == 0) {
      typeField_[e.target.name].error = typeField_[e.target.name].is_require
        ? true
        : false;
      typeField_[e.target.name].value = e.target.value;
    } else {
      typeField_[e.target.name].value = e.target.value;
      typeField_[e.target.name].error = false;
    }
    setTypeField(typeField_);
  };

  const save = async () => {
    let typeField__validation = _.cloneDeep(typeField);
    typeField__validation = validator(typeField__validation);
    if (typeField__validation.err) {
      setTypeField(typeField__validation.values);
    }
    let flag = !typeField__validation.err;
    if (flag) {
      setLoader(true);
      let res = await httpPostRequest(createHotelType(typeField));
      if (
        res &&
        res[constants.DATA_EXCEPTION] &&
        res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200
      ) {
        setLoader(false);
        setType(false);
        loadHotelType();
        setAlertMsg({
          type: "success",
          msg: res[constants.DATA_EXCEPTION].err_msg,
        });
      } else {
        setLoader(false);
        setAlertMsg({
          type: "error",
          msg: res[constants.DATA_EXCEPTION].err_msg,
        });
      }
    } else {
      setAlertMsg({
        type: "error",
        msg: <LanguageConfig id="managehotel.fillrequired" />,
      });
    }
  };

  useEffect(() => {
    setTypeField({
      [newConstants.HOTEL_TYPE_DESC]: {
        value: "",
        is_require: true,
        error: false,
        min_length: 2,
        max_length: null,
        type: "text",
        err_msg: "",
      },
    });
  }, []);
  return (
    <div>
      <Row padding={[10]}>
        <Column md={3} padding={[10, 5]}>
          <TextField
            label={<LanguageConfig id="managehotel.hoteltype" />}
            name={newConstants.HOTEL_TYPE_DESC}
            value={
              typeField[newConstants.HOTEL_TYPE_DESC] &&
              typeField[newConstants.HOTEL_TYPE_DESC].value
            }
            onChange={stateUpdater}
            error={
              typeField[newConstants.HOTEL_TYPE_DESC] &&
              typeField[newConstants.HOTEL_TYPE_DESC].error
            }
            helperText={
              typeField[newConstants.HOTEL_TYPE_DESC] &&
              typeField[newConstants.HOTEL_TYPE_DESC].err_msg
            }
            required={
              typeField[newConstants.HOTEL_TYPE_DESC] &&
              typeField[newConstants.HOTEL_TYPE_DESC].is_require
            }
          />
        </Column>
        <Row>
          <Column md={10}>{/* <Button>Save</Button> */}</Column>
          <Column md={2} right>
            <Button
              className={classes.saveButton}
              variant="contained"
              color="primary"
              onClick={loader ? console.log("") : save}
            >
              <Row>
                {loader ? (
                  <Column md={1} xs={1} sm={1} center middle>
                    <Loader size={14} color={"white"} />
                  </Column>
                ) : null}
                <Column
                  md={loader ? 11 : 12}
                  xs={loader ? 11 : 12}
                  center
                  middle
                  sm={loader ? 11 : 12}
                >
                  <LanguageConfig id={"save"} />
                </Column>
              </Row>
            </Button>
          </Column>
        </Row>
      </Row>
    </div>
  );
};