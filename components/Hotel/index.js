import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Touchable,
  MapSelect,
  Accordian,
  TextField,
  Text,
  Card,
  Row,
  Column,
  Loader,
  CustomAlert,
  SingelSelectOnDemand,
  DemandDropDown,
  ModalComponent,
} from '../../core';
import {
  IconButton,
  Tabs,
  Tab,
  Typography,
  Box,
  Fade,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  FormControl,TextareaAutosize
} from '@material-ui/core';
// import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { fade, makeStyles } from '@material-ui/core/styles';
import { RadioButtonUnchecked, CheckCircle, Cancel, Edit, Delete, AddAPhoto, Create } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { getDateYYYYMMDD, validator, httpPostRequest, httpPostRequestWithForm } from '../../helper/JsHelper';
import {
  hotelMasterUpdate,
  hotelMasterGetByKey,
  getHotelTypeY,
  getAllHotelCategoryY,
  getHotelCategoryInfoById,
  getAllHotelIssuesY,
  getAllNearPlaceY,
  getAllHotelTagY,
  getAllAmmunityY,
  hotelMasterGet,
  imageUploder,
  getAllHotelImageTypeY,
  hotelMasterSave,
  deleteByHotel,
  getHotelTax
} from '../../helper/RequestPayLoad';
import { newConstants ,constants} from '../../helper/constants';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
import PrimaryContainer from '../PrimaryContainer';
import LanguageConfig from "../../helper/LanguageConfig";

const useStyles = makeStyles((theme) => ({
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
  primaryImageSelect: {
    color: '#008000',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  scrollContainer: {
    overflowY: 'scroll',
    maxHeight: 300,
  },
  imageSelectContainer: {
    position: 'absolute',
    top: -5,
    left: -5,
  },
  primaryImageUnSelect: {
    color: '#000',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  closeImageContainer: {
    position: 'absolute',
    bottom: 5,
    right: 3,
  },
  closeImage: {
    color: 'red',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    zIndex: 2,
  },
  modalScrollContainer: {
    overflowY: 'scroll',
    height: '50vh',
  },
  hotelImage: {
    borderRadius: 10,
    height: 140,
    width: 150,
  },
  tabContainer: {
    width: '100%',
  },
  addPhotos: {
    fontSize: 35,
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  inputSelect: {
    display: 'none',
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '70vh',
  },
  paper: {
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
    width: 216,
    height: 230,
    overflowX: "hidden"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  dropZone: {
    height: 100,
  },
  table: {
    minWidth: 650,
  },
  addEdit: {
    backgroundColor: theme.palette.error.main,
  },
  saveButton: {
    width: '30%',
    margin: 5,
    color: "white",
    backgroundColor: "rgb(26, 43, 71)",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    }
  },
  modalBtn:{    
    color: "white",
    padding: '10px',
    backgroundColor: "rgb(26, 43, 71)",
  '&:hover': {
    backgroundColor: "rgb(26, 43, 71)",
    }
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
  headerName: {
    borderRadius: 5,
    margin: '10px 0px',
  },
  Bold: {
    fontWeight: 'bold',
  },
  editContainer: {
    margin: '0 0 10px 0px',
    width: '100%',
  },
  TransferButtton: {
    margin: theme.spacing(0.5, 0)
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
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { setAlertMsg, formname } = useStore();
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
        setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
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
    else{
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
        setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
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
      <Card margin={[0,0,10,0]}>
      {addEdit &&
          <Fade in={addEdit}>
            <EditContainer
              loadData={loadData}
              editData={editData}
              setEditData={setEditData}
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

const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit }) => {
  const [localFields, setLocalFields] = useState(null);
  const [loader, setLoader] = useState(false);
  const [multi_images, setMultiImages] = useState([]);
  const [hotel_languages, setHotelLanguages] = useState([]);
  const [near_place, setNearplace] = useState([]);
  const [hotelIssues, setHotelIssues] = useState([]);
  const [hotel_description, setHotelDescription] = useState([]);
  const [leftAmen, setLeftamen] = useState([])
  const [rightAmen, setRightamen] = useState([])
  const { languages, setAlertMsg } = useStore();
  const [saveFlag, setSaveFlag] = useState(false);

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

        [newConstants.HOTEL_TAGS]: {
          value: [],
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
      setHotelLanguages(Tab_multi)
      setRightamen([])
      setNearplace([]);
      setMultiImages([]);
      setHotelIssues([]);
      setHotelDescription([]);
    } else {
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
        [newConstants.HOTEL_TAGS]: {
          value: editData[newConstants.HOTEL_TAGS].length
            ? editData[newConstants.HOTEL_TAGS].map((value) => ({
              label: value[newConstants.HOTEL_TAG_NAME],
              value: value[newConstants.HOTEL_TAG_KEY],
            }))
            : [],
          is_require: true,
          error: false,
        },
      });
      if (editData[newConstants.HOTEL_AMENITIES].length) {
        setRightamen(
          editData[newConstants.HOTEL_AMENITIES].map((val) => ({
            [newConstants.HOTEL_AMENITY_KEY]: val[newConstants.HOTEL_AMENITY_KEY],
            [newConstants.HOTEL_AMENITY_NAME]: val[newConstants.HOTEL_AMENITY_NAME],
          })),
        )
      }
      if (editData[newConstants.HOTEL_NEAR_PLACES].length) {
        setNearplace(
          editData[newConstants.HOTEL_NEAR_PLACES].map((val) => ({
            [newConstants.NEAR_PLACE_DESC]: val[newConstants.NEAR_PLACE_DESC],
            [newConstants.NEAR_PLACE_KEY]: val[newConstants.NEAR_PLACE_KEY],
            [newConstants.LATTITUDE]: val[newConstants.LATTITUDE],
            [newConstants.LONGITUDE]: val[newConstants.LONGITUDE],
          })),
        )
      }
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
      } else {
        hotel_languages_.push(...Tab_multi);
      }
      setHotelLanguages(hotel_languages_.concat(Tab_multi.filter(f => !(hotel_languages_.map(v => v["lang-code"].value).includes(f["lang-code"].value)))))
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
        setHotelIssues(
          editData[newConstants.HOTEL_ISSUES].map((value) => ({
            [newConstants.HOTEL_ISSUES_TITLE]: value[newConstants.HOTEL_ISSUES_TITLE],
            [newConstants.HOTEL_ISSUES_KEY]: value[newConstants.HOTEL_ISSUES_KEY],
            [newConstants.EFFECTIVE_FROM]: value[newConstants.EFFECTIVE_FROM],
            [newConstants.EFFECTIVE_TO]: value[newConstants.EFFECTIVE_TO],
          })),
        );
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
    setSaveFlag(true);
    let localFields_ = _.cloneDeep(localFields);
    if (e.target.value.length == 0) {
      localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
      localFields_[e.target.name].value = e.target.value;
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

  function multiStateUpdater(e, index, tag) {
    setSaveFlag(true);
    if (tag == 'image') {
      let multi_images_ = [...multi_images];
      e.forEach((f) => {
        multi_images_.push({ value: f.value, url: f.url, image_type_key: f.image_type_key });
      });
      setMultiImages(multi_images_);
    } else if (tag == 'hotel_lang') {
      let hotel_languages_ = _.cloneDeep(hotel_languages);
      if (e.target.value.length == 0) {
        hotel_languages_[index][e.target.name].error = hotel_languages_[index][e.target.name].is_require ? true : false;
        hotel_languages_[index][e.target.name].value = e.target.value;
      } else {
        hotel_languages_[index][e.target.name].value = e.target.value;
        hotel_languages_[index][e.target.name].error = false;
      }
      setHotelLanguages(hotel_languages_);
    } else if (tag == 'hotel_description') {
      let hotel_description_ = _.cloneDeep(hotel_description);
      if (index != null) {
        hotel_description_[index] = e;
      } else {
        hotel_description_.push(e);
      }
      setHotelDescription(hotel_description_.filter(f => f && f[newConstants.LANG_CODE]?.value != ""));
    } else if (tag == 'hotel-issues') {
      let hotelIssues_ = _.cloneDeep(hotelIssues);
      if (index != null) {
        hotelIssues_[index] = e;
      } else {
        hotelIssues_.push(e);
      }
      setHotelIssues(hotelIssues_.filter(f => f && f[newConstants.LANG_CODE]?.value != ""));
    }
    else if (tag == 'near-place') {
      let near_place_ = _.cloneDeep(near_place);
      if (index != null) {
        near_place_[index] = e;
      } else {
        near_place_.push(e);
      }
      setNearplace(near_place_.filter(f => f && f[newConstants.NEAR_PLACE_KEY]?.value != ""));
    }
  }

  function removeMulti(index_, tag) {
    if (tag == 'image') {
      let multi_images_ = _.cloneDeep(multi_images);
      if (multi_images_.length >= 1) {
        multi_images_ = multi_images_.map((val, index) => (index != index_ ? val : null));
        setMultiImages(multi_images_.filter((f) => f != null));
      }
    } else if (tag == 'hotel_lang') {
      let hotel_languages_ = _.cloneDeep(hotel_languages);
      hotel_languages_ = hotel_languages_.filter((f, index) => index != index_);
      setHotelLanguages(hotel_languages_);
    } else if (tag == 'hotel_description') {
      let hotel_description_ = _.cloneDeep(hotel_description);
      hotel_description_ = hotel_description_.filter((f, index) => index != index_);
      setHotelDescription(hotel_description_);
    } else if (tag == 'hotel-issues') {
      let hotelIssues_ = _.cloneDeep(hotelIssues);
      hotelIssues_ = hotelIssues_.filter((f, index) => index != index_);
      setHotelIssues(hotelIssues_);
    }
    else if (tag == 'near-place') {
      let near_place_ = _.cloneDeep(near_place);
      near_place_ = near_place_.filter((f, index) => index != index_);
      setNearplace(near_place_);
    }
  }

  function addMulti(tag) {
    if (tag == 'image') {
      let multi_images_ = _.cloneDeep(multi_images);
      multi_images_.push({ ImagePath: { value: '', is_require: true, error: false } });
      setMultiImages(multi_images_);
    }
  }

  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    let flag = !localFields_validation.err;
    let multi_lang_ = hotel_languages.filter(f => f[newConstants.HOTEL_NAME].value != "")
    if (flag) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(
          hotelMasterSave(localFields_validation.values, multi_images, multi_lang_, hotel_description, hotelIssues, near_place, rightAmen),
        );
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });
          setLoader(false);
          setAddEdit(false);
          loadData();
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(
          hotelMasterUpdate(
            editData[newConstants.HOTEL_KEY],
            localFields_validation.values,
            multi_images,
            multi_lang_,
            hotel_description,
            hotelIssues,
            near_place,
            rightAmen
          ),
        );
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
          loadData();
          setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });

        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="managehotel.fillrequired" /> });
    }
  };


  return (
    <div>
      {localFields ? (
        <Row>
          <Column padding={[10]}>
            <Row>
              <Column>
                <HotelInformation stateUpdater={stateUpdater} localFields={localFields} classes={classes} />
              </Column>
              <Column>
                <HotelTags
                  name={newConstants.HOTEL_TAGS}
                  values={localFields[newConstants.HOTEL_TAGS]}
                  classes={classes}
                  stateUpdater={stateUpdater}
                  addMulti={addMulti}
                  removeMulti={removeMulti}
                />
              </Column>
              <Column md={12}>
                <Row padding={[10, 0]}>
                  <Column padding={[5, 0]} md={2}>
                    <Row>
                      <Column>
                        <Box
                          border={1}
                          borderColor={localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY].error ? 'red' : 'white'}
                          borderRadius={5}>
                          <ImageHandler
                            localFields={localFields}
                            stateUpdater={stateUpdater}
                            multiStateUpdater={multiStateUpdater}
                            classes={classes}
                            multi_images={multi_images}
                            removeMulti={removeMulti}
                          />
                        </Box>
                      </Column>
                      <Column padding={[0, 0, 0, 15]}>
                        <Text size={11.5} color="#e00202">
                          {multi_images.length > 0
                            ? localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY].error
                              ? 'Select a  Image as primary.'
                              : ''
                            : localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY].error
                              ? 'Require Field.'
                              : ''}
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                  <Column padding={[5, 0]} md={2}>
                    <HotelAmenity
                      leftAmen={leftAmen}
                      setLeftamen={setLeftamen}
                      rightAmen={rightAmen}
                      setRightamen={setRightamen}
                    />
                  </Column>
                  <Column padding={[5, 0]} md={2}>
                    <HotelNearByPlaces
                      multiStateUpdater={multiStateUpdater}
                      removeMulti={removeMulti}
                      classes={classes}
                      near_place={near_place}
                    />
                  </Column>
                  <Column padding={[5, 0]} md={2}>
                    <HotelLanguagesHandler
                      multiStateUpdater={multiStateUpdater}
                      removeMulti={removeMulti}
                      languages={languages}
                      classes={classes}
                      hotel_languages={hotel_languages}
                    />
                  </Column>
                  <Column padding={[5, 0]} md={2}>
                    <HotelDescriptionHandler
                      multiStateUpdater={multiStateUpdater}
                      removeMulti={removeMulti}
                      classes={classes}
                      hotel_description={hotel_description}
                    />
                  </Column>
                  <Column padding={[5, 0]} md={2}>
                    <HotelIssueHandler
                      multiStateUpdater={multiStateUpdater}
                      removeMulti={removeMulti}
                      classes={classes}
                      hotelIssues={hotelIssues}
                    />
                  </Column>
                </Row>
              </Column>
              <Column right>
                <Row>
                  <Column md={8}></Column>
                  <Column right md={4} padding={[10, 0]}>
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
                            <LanguageConfig id={editData ? "managehotel.update" : "Save"} />
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
                        <LanguageConfig id="managehotel.cancel" />
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

const HotelInformation = ({ stateUpdater, localFields, classes }) => {
  const { Country, City, Province } = DemandDropDown;
  const [mapPicker, setMapPicker] = useState(false);
  const [percentage, setPercentage] = useState([
    { value: 'Percentage', label: 'Percentage' },
  ]);
  const [taxrule, setTaxrule] = useState([
    { value: "pXsP+kp6Mv1mRKilSNBSzxNDSU/+lpYsloMzgzQ2ml0=", label: 'manual entry' },
  ]);

  const setLatLong = (e) => {
    if (e && e['longitude']) {
      stateUpdater({
        target: {
          value: [e['longitude'] + '', e['latitude'] + ''],
          name: [newConstants.HOTEL_LONGITUDE, newConstants.HOTEL_LATITUDE],
        },
      });
    }
  };

  return (
    <Row>
      <Column margin={[10, 0]}>
        <Text bold><LanguageConfig id="managehotel.hotelinformation" /></Text>
      </Column>
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
        <HotelCategory
          name={newConstants.HOTEL_CATEGORY_KEY}
          error={localFields[newConstants.HOTEL_CATEGORY_KEY].error}
          value={localFields[newConstants.HOTEL_CATEGORY_KEY].value}
          onChange={stateUpdater}
          helperText={localFields[newConstants.HOTEL_CATEGORY_KEY].error ? 'Incorrect entry.' : ''}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <HotelType
          name={newConstants.HOTEL_TYPE_KEY}
          error={localFields[newConstants.HOTEL_TYPE_KEY].error}
          value={localFields[newConstants.HOTEL_TYPE_KEY].value}
          onChange={stateUpdater}
          helperText={localFields[newConstants.HOTEL_TYPE_KEY].error ? 'Incorrect entry.' : ''}
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
        <TextField
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
        <TextField
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
        <TextField
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
            style:{
              height:"auto",
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
          longitude: parseFloat(localFields[newConstants.HOTEL_LONGITUDE].value),
          latitude: parseFloat(localFields[newConstants.HOTEL_LATITUDE].value),
        }}
        setLatLong={setLatLong}
      />
    </Row>
  );
};

const ImageHandler = ({ classes, multiStateUpdater, stateUpdater, multi_images, localFields, removeMulti }) => {
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
    let res = await httpPostRequest(getAllHotelImageTypeY(''));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultOptions(
        res.data[newConstants.HOTEL_IMAGE_TYPES].map((v) => ({
          image_type_key: v[newConstants.HOTEL_IMAGE_TYPE_KEY],
          label: v[newConstants.HOTEL_IMAGE_TYPE_DESC],
          icon: v[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON],
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
    <Row center>
      <Button onClick={() => setOpen(true)} className={classes.blockButton} variant="contained" color="primary">
        <LanguageConfig id="managehotel.hotelgallery" />
      </Button>
      <ModalComponent open={open} setOpen={setOpen} header="Hotel's Gallery">
        {/* <LoadingOverlay
        active={loader}
        spinner
        text='Please wait Image is uploading...' 
      > */}
        <Row>
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
                        {multi_images
                          .filter((f) => f.image_type_key == value.image_type_key)
                          .map((val, index1) => (
                            <Column key={'image_hotel_' + index1} md={2} padding={[5]}>
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
        {/* </LoadingOverlay> */}
      </ModalComponent>
    </Row>
  );
};

const HotelIssueHandler = ({ classes, multiStateUpdater, removeMulti, hotelIssues }) => {
  const options = {
    [newConstants.HOTEL_ISSUES_KEY]: {
      value: '',
      is_require: true,
      error: false,
    },
    [newConstants.EFFECTIVE_FROM]: {
      value: getDateYYYYMMDD(new Date()),
      is_require: true,
      error: false,
    },
    [newConstants.EFFECTIVE_TO]: {
      value: getDateYYYYMMDD(new Date()),
      is_require: true,
      error: false,
    },
  };
  const [defaultValue, setDefaultValue] = useState([]);
  const [values, setValues] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);
  useEffect(() => {
    let options_ = { ...options };
    if (editIndex != null) {
      options_[newConstants.HOTEL_ISSUES_KEY].value = hotelIssues[editIndex][newConstants.HOTEL_ISSUES_KEY];
      options_[newConstants.EFFECTIVE_FROM].value = hotelIssues[editIndex][newConstants.EFFECTIVE_FROM];
      options_[newConstants.EFFECTIVE_TO].value = hotelIssues[editIndex][newConstants.EFFECTIVE_TO];
      if (defaultValue.filter((f) => f.value == hotelIssues[editIndex][newConstants.HOTEL_ISSUES_KEY]).length == 0) {
        setDefaultValue(
          [...defaultValue].push({
            value: hotelIssues[editIndex][newConstants.HOTEL_ISSUES_KEY],
            label: hotelIssues[editIndex][newConstants.HOTEL_ISSUES_TITLE],
          }),
        );
      }
    }
    setValues(options_);
  }, [editIndex]);
  function stateUpdater(e) {
    let values_ = { ...values };
    values_[e.target.name].error =
      e.target.value && e.target.value.length == 0 && values_[e.target.name].is_require ? true : false;
    values_[e.target.name].value = e.target.value;
    setValues(values_);
  }
  const loadOptions = async (inputValue = '', callback = null) => {
    let res = await httpPostRequest(getAllHotelIssuesY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res.data[newConstants.HOTEL_ISSUES].map((v) => ({
            value: v[newConstants.HOTEL_ISSUES_KEY],
            label: v[newConstants.HOTEL_ISSUES_TITLE],
          })),
        );
      } else {
        setDefaultValue(
          res.data[newConstants.HOTEL_ISSUES].map((v) => ({
            value: v[newConstants.HOTEL_ISSUES_KEY],
            label: v[newConstants.HOTEL_ISSUES_TITLE],
          })),
        );
      }
    }
  };

  const save = () => {
    let values_validator = { ...values };
    values_validator = validator(values_validator);
    if (!values_validator.err) {
      multiStateUpdater(
        {
          [newConstants.HOTEL_ISSUES_KEY]: values[newConstants.HOTEL_ISSUES_KEY].value,
          [newConstants.HOTEL_ISSUES_TITLE]: defaultValue.filter(
            (f) => f.value == values[newConstants.HOTEL_ISSUES_KEY].value,
          ).length
            ? defaultValue.filter((f) => f.value == values[newConstants.HOTEL_ISSUES_KEY].value)[0].label
            : '',
          [newConstants.EFFECTIVE_FROM]: values[newConstants.EFFECTIVE_FROM].value,
          [newConstants.EFFECTIVE_TO]: values[newConstants.EFFECTIVE_TO].value,
        },
        editIndex,
        'hotel-issues',
      );
      setValues({ ...options });
      if (editIndex != null) {
        setEditIndex(null);
      }
    } else {
      setValues(values_validator.values);
    }
  };

  return (
    <Row center>
      <Button onClick={() => setOpen(true)} className={classes.blockButton} variant="contained" color="primary">
        <LanguageConfig id="managehotel.hotelissue" />
      </Button>
      <ModalComponent open={open} setOpen={setOpen}>
        {/* <Accordian header=""> */}
        <Row>
          {values ? (
            <Column>
              <Row>
                <Column md={4} padding={[5]}>
                  <SingelSelectOnDemand
                    defaultOptions={defaultValue}
                    value={
                      defaultValue.filter((f) => f.value == values[newConstants.HOTEL_ISSUES_KEY].value).length
                        ? defaultValue.filter((f) => f.value == values[newConstants.HOTEL_ISSUES_KEY].value)[0]
                        : null
                    }
                    loadOptions={loadOptions}
                    onChange={(e) => stateUpdater({ target: { value: e.value, name: newConstants.HOTEL_ISSUES_KEY } })}
                    placeholder={<LanguageConfig id="managehotel.hotelissue" />}
                    helperText={values[newConstants.HOTEL_ISSUES_KEY].error ? 'Require Field.' : ''}
                    error={values[newConstants.HOTEL_ISSUES_KEY].error}
                  />
                </Column>
                <Column md={3} padding={[5]}>
                  <TextField
                    label={<LanguageConfig id="managehotel.effectivefrom" />}
                    type="date"
                    value={values[newConstants.EFFECTIVE_FROM].value}
                    name={newConstants.EFFECTIVE_FROM}
                    error={values[newConstants.EFFECTIVE_FROM].error}
                    onChange={(e) => stateUpdater(e)}
                    helperText={values[newConstants.EFFECTIVE_FROM].err_msg}
                    required={values[newConstants.EFFECTIVE_FROM].is_require}
                  />
                </Column>
                <Column md={3} padding={[5]}>
                  <TextField
                    label={<LanguageConfig id="managehotel.effectiveto" />}
                    type="date"
                    placeholder=""
                    value={values[newConstants.EFFECTIVE_TO].value}
                    name={newConstants.EFFECTIVE_TO}
                    error={values[newConstants.EFFECTIVE_TO].error}
                    onChange={(e) => stateUpdater(e)}
                    helperText={values[newConstants.EFFECTIVE_TO].err_msg}
                    required={values[newConstants.EFFECTIVE_TO].is_require}
                  />
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
                {hotelIssues.map((value, index) => editIndex != index && (
                  <Column key={'hotel_issue_' + index} md={4} padding={[5]}>
                    <Card padding={[5]}>
                      <Row>
                        <Column md={10} xs={10} sm={10}>
                          <Row>
                            <Column>
                              <Text size={10} color={'blue'}>
                                ISSUE
                              </Text>
                              <Text size={13}>{value[newConstants.HOTEL_ISSUES_TITLE]}</Text>
                            </Column>
                            <Column md={6} xs={6} sm={6}>
                              <Text size={10} color={'blue'}>
                                EFFECTIVE FROM
                              </Text>
                              <Text size={13}>{value[newConstants.EFFECTIVE_FROM]}</Text>
                            </Column>
                            <Column md={6} xs={6} sm={6}>
                              <Text size={10} color={'blue'}>
                                EFFECTIVE TO
                              </Text>
                              <Text size={13}>{value[newConstants.EFFECTIVE_TO]}</Text>
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
                                  onClick={() => removeMulti(index, 'hotel-issues')}
                                  style={{ fontSize: 18, color: 'red' }}
                                />
                              </IconButton>
                            </Column>
                          </Row>
                        </Column>
                      </Row>
                    </Card>
                  </Column>
                ))}
              </Row>
            </div>
          </Column>
        </Row>
      </ModalComponent>
      {/* </Accordian> */}
    </Row>
  );
};



const HotelTags = ({ values, classes, stateUpdater, name }) => {
  const [defaultValue, setDefaultValue] = useState([]);
  useEffect(() => {
    loadOptions();
  }, []);
  const loadOptions = async (inputValue = '', callback = null) => {
    let res = await httpPostRequest(getAllHotelTagY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res.data[newConstants.HOTEL_TAGS].map((v) => ({
            value: v[newConstants.HOTEL_TAG_KEY],
            label: v[newConstants.HOTEL_TAG_NAME],
          })),
        );
      } else {
        setDefaultValue(
          res.data[newConstants.HOTEL_TAGS].map((v) => ({
            value: v[newConstants.HOTEL_TAG_KEY],
            label: v[newConstants.HOTEL_TAG_NAME],
          })),
        );
      }
    }
  };
  return (
    <Row>
      <Column padding={[5, 0]}>
        <Text size={14} bold>
          <LanguageConfig id="managehotel.hoteltags" />
        </Text>
      </Column>
      <Column padding={[5, 0]}>
        <SingelSelectOnDemand
          isMulti
          defaultOptions={defaultValue.concat(values[newConstants.VALUE])}
          value={values[newConstants.VALUE]}
          loadOptions={loadOptions}
          onChange={(e) => stateUpdater({ target: { value: e, name: name } })}
          placeholder={<LanguageConfig id="managehotel.hoteltags" />}
          helperText={values.error ? 'Require Field.' : ''}
          error={values.error}
        />
      </Column>
    </Row>
  );
};



const HotelNearByPlaces = ({ multiStateUpdater, removeMulti, classes, near_place }) => {
  const options = {
    [newConstants.NEAR_PLACE_KEY]: {
      value: '',
      is_require: true,
      error: false,
    },
    [newConstants.LATTITUDE]: {
      value: '',
      is_require: true,
      error: false,
    },
    [newConstants.LONGITUDE]: {
      value: '',
      is_require: true,
      error: false,
    },
  };

  const [defaultValue, setDefaultValue] = useState([]);
  const [values, setValues] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [mapPicker, setMapPicker] = useState(false);


  useEffect(() => {
    loadOptions();
  }, []);
  useEffect(() => {
    let options_ = { ...options };
    if (editIndex != null) {
      options_[newConstants.NEAR_PLACE_KEY].value = near_place[editIndex][newConstants.NEAR_PLACE_KEY];
      options_[newConstants.LATTITUDE].value = near_place[editIndex][newConstants.LATTITUDE];
      options_[newConstants.LONGITUDE].value = near_place[editIndex][newConstants.LONGITUDE];
      if (defaultValue.filter((f) => f.value == near_place[editIndex][newConstants.NEAR_PLACE_KEY]).length == 0) {
        setDefaultValue(
          [...defaultValue].push({
            value: near_place[editIndex][newConstants.HOTEL_NEAR_BY_PLACE_KEY],
            label: near_place[editIndex][newConstants.HOTEL_NEAR_BY_PLACE_DESC],
          }),
        );
      }
    }
    setValues(options_);
  }, [editIndex]);

  const setLatLong = (e) => {
    if (e && e['longitude']) {
      stateUpdater({
        target: {
          value: [e['longitude'] + '', e['latitude'] + ''],
          name: [newConstants.LATTITUDE, newConstants.LONGITUDE],
        },
      });
    }
  };


  function stateUpdater(e) {
    let values_ = { ...values };
    if (typeof e.target.value == 'object' && typeof e.target.name == 'object') {
      e.target.value.forEach((value, index) => {
        values_[e.target.name[index]].value = value;
        values_[e.target.name[index]].error = false;
      });
    }
    else {
      values_[e.target.name].error =
        e.target.value && e.target.value.length == 0 && values_[e.target.name].is_require ? true : false;
      values_[e.target.name].value = e.target.value;
    }
    setValues(values_);
  }

  const loadOptions = async (inputValue = '', callback = null) => {
    let res = await httpPostRequest(getAllNearPlaceY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res.data["hotel-near-places"].map((v) => ({
            value: v[newConstants.HOTEL_NEAR_BY_PLACE_KEY],
            label: v[newConstants.HOTEL_NEAR_BY_PLACE_DESC],
          })),
        );
      } else {
        setDefaultValue(
          res.data["hotel-near-places"].map((v) => ({
            value: v[newConstants.HOTEL_NEAR_BY_PLACE_KEY],
            label: v[newConstants.HOTEL_NEAR_BY_PLACE_DESC],
          })),
        );
      }
    }
  };

  const save = () => {
    let values_validator = { ...values };
    values_validator = validator(values_validator);
    if (!values_validator.err) {
      multiStateUpdater(
        {
          [newConstants.NEAR_PLACE_KEY]: values[newConstants.NEAR_PLACE_KEY].value,
          [newConstants.NEAR_PLACE_DESC]: defaultValue.filter(
            (f) => f.value == values[newConstants.NEAR_PLACE_KEY].value,
          ).length
            ? defaultValue.filter((f) => f.value == values[newConstants.NEAR_PLACE_KEY].value)[0].label
            : '',
          [newConstants.LATTITUDE]: values[newConstants.LATTITUDE].value,
          [newConstants.LONGITUDE]: values[newConstants.LONGITUDE].value,
        },
        editIndex,
        'near-place',
      );
      setValues({ ...options });
      if (editIndex != null) {
        setEditIndex(null);
      }
    } else {
      setValues(values_validator.values);
    }
  };

  return (
    <Row center>
      <Button onClick={() => setOpen(true)} className={classes.blockButton} variant="contained" color="primary">
        Near Place
      </Button>
      <ModalComponent open={open} setOpen={setOpen}>
        {/* <Accordian header=""> */}
        <Row>
          {values ? (
            <Column>
              <Row>
                <Column md={4} padding={[5]}>
                  <SingelSelectOnDemand
                    defaultOptions={near_place.length > 0 ? defaultValue.filter(f => (!near_place.map(v => v[newConstants.NEAR_PLACE_KEY]).includes(f.value))) : defaultValue}
                    value={
                      defaultValue.filter((f) => f.value == values[newConstants.NEAR_PLACE_KEY].value).length
                        ? defaultValue.filter((f) => f.value == values[newConstants.NEAR_PLACE_KEY].value)[0]
                        : null
                    }
                    loadOptions={loadOptions}
                    onChange={(e) => stateUpdater({ target: { value: e.value, name: newConstants.NEAR_PLACE_KEY } })}
                    placeholder={"near place"}
                    helperText={values[newConstants.NEAR_PLACE_KEY].error ? 'Require Field.' : ''}
                    error={values[newConstants.NEAR_PLACE_KEY].error}
                  />
                </Column>
                <Column md={3} padding={[5]}>
                  <TextField
                    label={"lattitude"}
                    value={values[newConstants.LATTITUDE].value}
                    name={newConstants.LATTITUDE}
                    disabled
                    InputProps={{
                      style:{
                        fontWeight:600
                      }
                    }}
                    onClick={() => setMapPicker(true)}
                    error={values[newConstants.LATTITUDE].error}
                    onChange={(e) => stateUpdater(e)}
                    helperText={values[newConstants.LATTITUDE].err_msg}
                    required={values[newConstants.LATTITUDE].is_require}
                  />
                </Column>
                <Column md={3} padding={[5]}>
                  <TextField
                    label={"longitude"}
                    value={values[newConstants.LONGITUDE].value}
                    name={newConstants.LONGITUDE}
                    disabled
                    InputProps={{
                      style:{
                        fontWeight:600
                      }
                    }}
                    onClick={() => setMapPicker(true)}
                    error={values[newConstants.LONGITUDE].error}
                    onChange={(e) => stateUpdater(e)}
                    helperText={values[newConstants.LONGITUDE].err_msg}
                    required={values[newConstants.LONGITUDE].is_require}
                  />
                </Column>
                <MapSelect
                  openMap={mapPicker}
                  setOpenMap={setMapPicker}
                  latLong={{
                    longitude: parseFloat(values[newConstants.LONGITUDE].value),
                    latitude: parseFloat(values[newConstants.LATTITUDE].value),
                  }}
                  setLatLong={setLatLong}
                />
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
                {
                  near_place.map((value, index) => editIndex != index && (
                    <Column key={'near_place' + index} md={4} padding={[5]}>
                      <Card padding={[5]}>
                        <Row>
                          <Column md={10} xs={10} sm={10}>
                            <Row>
                              <Column>
                                <Text size={10} color={'blue'}>
                                  Near place
                                </Text>
                                <Text size={13}>{value[newConstants.NEAR_PLACE_DESC]}</Text>
                              </Column>
                              <Column md={6} xs={6} sm={6}>
                                <Text size={10} color={'blue'}>
                                  Lattitude
                                </Text>
                                <Text size={13}>{value[newConstants.LATTITUDE]}</Text>
                              </Column>
                              <Column md={6} xs={6} sm={6}>
                                <Text size={10} color={'blue'}>
                                  Longitude
                                </Text>
                                <Text size={13}>{value[newConstants.LONGITUDE]}</Text>
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
                                    onClick={() => removeMulti(index, 'near-place')}
                                    style={{ fontSize: 18, color: 'red' }}
                                  />
                                </IconButton>
                              </Column>
                            </Row>
                          </Column>
                        </Row>
                      </Card>
                    </Column>
                  ))}
              </Row>
            </div>
          </Column>
        </Row>
      </ModalComponent>
      {/* </Accordian> */}
    </Row>
  );
};


const HotelLanguagesHandler = ({ multiStateUpdater, removeMulti, classes, hotel_languages ,languages}) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <Button onClick={() => setOpen(true)} className={classes.blockButton} variant="contained" color="primary">
        <LanguageConfig id="managehotel.hotellanguage" />
      </Button>
      <ModalComponent open={open} setOpen={setOpen}>
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
                          <TableCell className={classes.tableHeadTuple}>Name</TableCell>
                          <TableCell className={classes.tableHeadTuple}>Address</TableCell>
                          <TableCell className={classes.tableHeadTuple}>Contact person</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {hotel_languages.map(
                          (val, index) => (
                            <TableRow>
                              <TableCell className={classes.tableBodyTuple}>
                              <Text>{languages.filter(f=>f.value==val[newConstants.LANG_CODE].value).length?languages.filter(f=>f.value==val[newConstants.LANG_CODE].value)[0].label:val[newConstants.LANG_CODE].value}</Text>
                              </TableCell>
                              <TableCell className={classes.tableBodyTuple}>
                                <TextField
                                  label={"name"}
                                  type="text"
                                  value={val[newConstants.HOTEL_NAME].value}
                                  name={newConstants.HOTEL_NAME}
                                  error={val[newConstants.HOTEL_NAME].error}
                                  onChange={(e) => multiStateUpdater(e, index, "hotel_lang")}
                                  helperText={val[newConstants.HOTEL_NAME].err_msg}
                                />
                              </TableCell>
                              <TableCell className={classes.tableBodyTuple}>
                                <TextField
                                  label={"Address"}
                                  type="text"
                                  value={val[newConstants.HOTEL_ADDRESS].value}
                                  name={newConstants.HOTEL_ADDRESS}
                                  error={val[newConstants.HOTEL_ADDRESS].error}
                                  onChange={(e) => multiStateUpdater(e, index, "hotel_lang")}
                                  helperText={val[newConstants.HOTEL_ADDRESS].err_msg}
                                />
                              </TableCell>
                              <TableCell className={classes.tableBodyTuple}>
                                <TextField
                                  label={"Contact"}
                                  type="text"
                                  value={val[newConstants.HOTEL_CONTACT_PERSON].value}
                                  name={newConstants.HOTEL_CONTACT_PERSON}
                                  error={val[newConstants.HOTEL_CONTACT_PERSON].error}
                                  onChange={(e) => multiStateUpdater(e, index, "hotel_lang")}
                                  helperText={val[newConstants.HOTEL_CONTACT_PERSON].err_msg}
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
      </ModalComponent>
    </div>
  )
};

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
  const { languages ,copylanguages} = useStore();
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
    <Row center>
      <Button onClick={() => setOpen(true)} className={classes.blockButton} variant="contained" color="primary">
        <LanguageConfig id="managehotel.hoteldesc" />
      </Button>
      <ModalComponent open={open} setOpen={setOpen}>
        {/* <Accordian header="Hotel Description"> */}
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
        {/* </Accordian> */}
      </ModalComponent>
    </Row>
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

const HotelCategory = ({ error, name, value: hotel_category_key, helperText, onChange }) => {
  const [value, setValue] = useState(null);
  const [defaultValue, setDefaultValue] = useState([]);
  const getCategoryByKey = async () => {
    if (hotel_category_key) {
      let res = await httpPostRequest(getHotelCategoryInfoById(hotel_category_key));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setValue({ value: hotel_category_key, label: res.data[newConstants.HOTEL_CATEGORY_NAME] });
      }
    }
  };
  useEffect(() => {
    getCategoryByKey();
  }, [hotel_category_key,defaultValue]);

  useEffect(() => {
    loadCateory();
  }, []);

  const loadCateory = async (inputValue = '', callback = null) => {
    let res = await httpPostRequest(getAllHotelCategoryY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res.data[newConstants.HOTEL_CATEGORIES].map((v) => ({
            value: v[newConstants.HOTEL_CATEGORY_KEY],
            label: v[newConstants.HOTEL_CATEGORY_NAME],
          })),
        );
      } else {
        setDefaultValue(
          res.data[newConstants.HOTEL_CATEGORIES].map((v) => ({
            value: v[newConstants.HOTEL_CATEGORY_KEY],
            label: v[newConstants.HOTEL_CATEGORY_NAME],
          })),
        );
      }
    }
  };

  return (
    <SingelSelectOnDemand
      defaultOptions={value ? [value].concat(defaultValue.filter((f) => f.value != value.value)) : defaultValue}
      value={value}
      loadOptions={loadCateory}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={<LanguageConfig id="managehotel.hotelcategory" />}
      helperText={helperText}
      error={error}
    />
  );
};

const HotelType = ({ error, name, value: hotel_type_key, helperText, onChange }) => {
  const [value, setValue] = useState(null);
  const [defaultValue, setDefaultValue] = useState([]);
  const getCategoryByKey = async () => {
    if (hotel_type_key && defaultValue.length) {
      setValue(
        defaultValue.filter((f) => f.value == hotel_type_key).length
          ? defaultValue.filter((f) => f.value == hotel_type_key)[0]
          : null,
      );
    }
  };
  useEffect(() => {
    getCategoryByKey();
  }, [hotel_type_key, defaultValue]);

  useEffect(() => {
    loadHotelType();
  }, []);

  const loadHotelType = async () => {
    let res = await httpPostRequest(getHotelTypeY('', 1, 200));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultValue(
        res.data[newConstants.HOTEL_TYPES].map((v) => ({
          value: v[newConstants.HOTEL_TYPE_KEY],
          label: v[newConstants.HOTEL_TYPE_DESC],
        })),
      );
    }
  };

  const loadCateory = async (inputValue = '', callback = null) => {
    callback(defaultValue.filter((f) => f.value.includes(inputValue)));
  };

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultValue}
      value={value}
      loadOptions={loadCateory}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={<LanguageConfig id="managehotel.hoteltype" />}
      helperText={helperText}
      error={error}
    />
  );
};



// Check filter amenity 
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
    return amm[newConstants.HOTEL_AMENITY_NAME].toLowerCase().indexOf(search.trim().toLowerCase()) !== -1;
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
              <ListItemText id={labelId} primary={value[newConstants.HOTEL_AMENITY_NAME]} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <div style={{ textAlign: "center" }}>
      <Button onClick={() => setOpen(true)} className={classes.blockButton} variant="contained" color="primary">
        Hotel Amenities
      </Button>
      <ModalComponent open={open} setOpen={setOpen} style={{ width: "53%" }}>
        <Grid style={{ placeContent: "center", height: "auto" }}
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          className={classes.root}
        >
          <Row>
            <Column middle center>
              <Text size={23} bold>Hotel Amenities</Text>
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
      </ModalComponent>
    </div>
  );
}



const HotelTaxRule = ({ error, name, value: hotel_tax_key, helperText, onChange }) => {
  const [value, setValue] = useState(null);
  const [defaultValue, setDefaultValue] = useState([]);

  const getCategoryByKey = async () => {
    if (hotel_tax_key && defaultValue.length) {
      setValue(
        defaultValue.filter((f) => f.value == hotel_tax_key).length
          ? defaultValue.filter((f) => f.value == hotel_tax_key)[0]
          : null,
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
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultValue(
        res.data.map((v) => ({
          value: v[newConstants.TAX_RULE_KEY],
          label: v[newConstants.TAX_RULE_NAME],
        })),
      );
    }
  };

  const loadCateory = async (inputValue = '', callback = null) => {
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
const TypeRates = ({ name, value, onChange, error, helperText, label, isDisabled }) => {
  const [defaultOptions, setDefaultOptions] = useState([
    { value: 'P', label: 'Percentage' },
    { value: 'F', label: 'Flat rate' }
  ]);

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
      name={name}
      isDisabled={isDisabled}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};
