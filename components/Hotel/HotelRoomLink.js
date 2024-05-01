import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Text, Card, Row, Column, Loader, CustomAlert, SingelSelectOnDemand, ModalComponent, Touchable } from '../../core';
import {
  Fade,
  InputLabel,
  Tabs,
  Tab,
  Select,
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
  MenuItem,
  FormControl,
  FormControlLabel,
  Typography,
  Box,
  IconButton
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Create, Delete, Add, Remove, AddAPhoto, Cancel, CheckCircle, RadioButtonUnchecked } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest, httpPostRequestWithForm } from '../../helper/JsHelper';
import {
  hotelMasterGetId,
  hotelMasterGetY,
  getAllRoomsY,
  getRoomByKey,
  getAmmunityInfoById,
  getAllAmmunityY,
  getAllHotelImageTypeY,
  getHotelImageTypeByKey,
  getAllHotelRoomLink,
  getHotelRoomLinkByKey,
  deleteHotelRoomLink,
  createHotelRoomLink,
  updateHotelRoomLink,
  imageUploder,
  GetRoomByHotelKey
} from '../../helper/RequestPayLoad';
import PropTypes from 'prop-types';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from '../PrimaryContainer';
import LanguageConfig from "../../helper/LanguageConfig";

var FA = require('react-fontawesome');

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
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
  blockButton: {
    backgroundColor: "rgb(26, 43, 71)",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    },
  },
  inputSelect: {
    display: 'none',
  },
  addButton: {
    margin: 5
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
    overflow: "auto"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
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
  modalScrollContainer: {
    overflowY: 'scroll',
    height: '50vh',
  },
  imageSelectContainer: {
    position: 'absolute',
    top: -5,
    left: -5,
  },
  primaryImageSelect: {
    color: '#008000',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  primaryImageUnSelect: {
    color: '#000',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  hotelImage: {
    borderRadius: 10,
    height: 140,
    width: 150,
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
      marginLeft: theme.spacing(3),
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
    color: '#003399',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    textTransform: 'uppercase',
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
    margin: '5px',
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.main,
    },
  },
  searchCol: {
    alignContent: 'flex-end',
    // padding:0,
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
  TransferButtton: {
    margin: theme.spacing(0.5, 0)
  }
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const { setAlertMsg, formname } = useStore();
  const [deleteId, setDeleteId] = useState('');
  const [editData, setEditData] = useState(null);

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
   
    [newConstants.ROW_NUM]: { is_hide: true, bool: true, label: <LanguageConfig id="hotelroomlink.sno" /> },
    ["hotel-name"]:{ is_hide: false, bool: true, label: <LanguageConfig id="hotel name" /> },
    ["room-name"]:{ is_hide: false, bool: true, label: <LanguageConfig id="room name" /> },
    [newConstants.ROOM_ALLOTMENT]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelroomlink.roomallotment" /> },
    [newConstants.ROOM_MIN_PAX]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelroomlink.roomminpax" /> },
    [newConstants.ROOM_MAX_PAX]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelroomlink.roommaxpax" /> },
    [newConstants.ROOM_MIN_ADULTS]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelroomlink.roomminadult" /> },
    [newConstants.ROOM_MAX_ADULTS]: { is_hide: true, bool: true, label: <LanguageConfig id="hotelroomlink.roommaxadult" /> },
    [newConstants.ROOM_MAX_CHILDS]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelroomlink.roommaxchilds" /> },
    [newConstants.CHILD_AGE_LIMIT]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelroomlink.childagelimit" /> },
    [newConstants.IS_CHILD_ALLOWED]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelroomlink.ischildallowed" /> },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelroomlink.status" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: true, bool: true, label: <LanguageConfig id="hotelroomlink.lastupdatedby" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelroomlink.lastupdatedon" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="hotelroomlink.action" /> }

  });

  const loadData = async () => {
    if (!addEdit) {
      setLoader(true);
      let res = await httpPostRequest(getAllHotelRoomLink(search_key, (currIndex - 1) * pageSize + 1, pageSize));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setData(res[constants.DATA][newConstants.HOTEL_ROOM_LINKS]);
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
        setCurrIndex(1);
        setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
      }
    }
  };
  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  const filter_data = data
    .map((value, index) =>
      (currIndex - 1) * pageSize <= value[newConstants.ROW_NUM] - 1 && currIndex * pageSize > value[newConstants.ROW_NUM] - 1
        ? value
        : null,
    )
    .filter((f) => f != null);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };
  const editRoomLink = async (actionProps) => {
    setAddEdit(false);
    let res = await httpPostRequest(getHotelRoomLinkByKey(actionProps[newConstants.HOTEL_KEY], actionProps[newConstants.ROOM_KEY]));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
   else{
    setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
   }
  };

  const delRoomLink = async () => {
    if (deleteId != '') {
      const res = await httpPostRequest(
        deleteHotelRoomLink(deleteId[newConstants.HOTEL_KEY], deleteId[newConstants.ROOM_KEY]),
      );
      setDeleteLoader(deleteId);
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setDeleteId('');
        setDeleteLoader('');
        loadData();
      } else {
        setDeleteId('');
        setDeleteLoader('');
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    } else {
      setDeleteId('');
    }
  };
  const updateShowCol = (e) => {
    setShowCol({ ...showCol, [e.target.name]: e.target.checked });
  };

  return (
    <div>
       <Card margin={[0,0,10,0]}>
       {addEdit &&
          <Fade in={addEdit}>
            <EditContainer
              classes={classes}
              loadData={loadData}
              editData={editData}
              setEditData={setEditData}
              addEdit={addEdit}
              setAddEdit={setAddEdit}
              setAlertMsg={setAlertMsg}
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
        filter_object={newConstants.ROW_NUM}
        editRow={editRoomLink}
        deleteRow={setDeleteId}
        action_key={[newConstants.HOTEL_KEY, newConstants.ROOM_KEY]}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="hotelroomlink.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delRoomLink}
        />        
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState(null);
  const [amenityLinks, setAmenityLinks] = useState(null);
  const [imagePathLinks, setImagePathLinks] = useState(null);
  const [loader, setLoader] = useState(false);
  const [multi_images, setMultiImages] = useState([]);
  const [imageErr, setImageErr] = useState("")
  const [room, setRoom] = useState([])
  const [generate, setGenerate] = useState(null)
  const [leftAmen, setLeftamen] = useState([])
  const [rightAmen, setRightamen] = useState([])
  const [hotelname, setHotelname] = useState(editData ? editData[newConstants.HOTEL_KEY] : "")
  const [roomname, setRoomname] = useState(editData ? editData[newConstants.ROOM_KEY] : "")

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.HOTEL_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ROOM_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ROOM_ALLOTMENT]: {
          value: '',
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.CHILD_AGE_LIMIT]: {
          value: '',
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.IS_CHILD_ALLOWED]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
      });
      setRightamen([])
    } else {
      setLocalFields({
        [newConstants.HOTEL_KEY]: {
          value: editData[newConstants.HOTEL_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ROOM_KEY]: {
          value: editData[newConstants.ROOM_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ROOM_ALLOTMENT]: {
          value: editData[newConstants.ROOM_ALLOTMENT],
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.CHILD_AGE_LIMIT]: {
          value: editData[newConstants.CHILD_AGE_LIMIT],
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.IS_CHILD_ALLOWED]: {
          value: editData[newConstants.IS_CHILD_ALLOWED],
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_ACTIVE]: {
          value: editData[newConstants.IS_ACTIVE],
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
      });

      if (editData[newConstants.HOTEL_ROOM_AMENITY_LINKS].length) {
        setRightamen(
          editData[newConstants.HOTEL_ROOM_AMENITY_LINKS].map((val) => ({
            [newConstants.HOTEL_AMENITY_KEY]: val[newConstants.HOTEL_AMENITY_KEY],
            [newConstants.HOTEL_ROOM_AMENITY_NAME]: val[newConstants.HOTEL_ROOM_AMENITY_NAME],
          })),
        )
      }

      if (editData[newConstants.HOTEL_ROOM_IMAGE_PATH_LINKS].length) {
        setMultiImages(
          editData[newConstants.HOTEL_ROOM_IMAGE_PATH_LINKS].map((value) => ({
            value: value[newConstants.HOTEL_IMAGE_PATH_KEY],
            url: value[newConstants.IMAGE_PATH],
            image_type_key: value[newConstants.HOTEL_IMAGE_TYPE_KEY],
          })),
        );
      }
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

  const generateUpdate = (e) => {
    let generate_ = _.cloneDeep(generate);
    if (e.target.value.length == 0) {
      generate_[e.target.name].error = generate_[e.target.name].is_require ? true : false;
      generate_[e.target.name].value = e.target.value;
    } else {
      generate_[e.target.name].value = e.target.value;
      generate_[e.target.name].error = false;
    }
    setGenerate(generate_);
  };

  function multiStateUpdater(e, index, tag) {
    if (tag == 'image') {
      let multi_images_ = [...multi_images];
      e.forEach((f) => {
        multi_images_.push({ value: f.value, url: f.url, image_type_key: f.image_type_key });
      });
      setMultiImages(multi_images_);
    }
    else if (tag == 'amenity') {
      let amenityLinks_ = _.cloneDeep(amenityLinks);
      if (e.target.value.length == 0) {
        amenityLinks_[index][e.target.name].error = amenityLinks_[index][e.target.name].is_require ? true : false;
        amenityLinks_[index][e.target.name].value = e.target.value;
      } else {
        amenityLinks_[index][e.target.name].value = e.target.value;
        amenityLinks_[index][e.target.name].error = false;
      }
      setAmenityLinks(amenityLinks_);
    } 
    else if (tag == 'amenity_check') {
      let amenityLinks_ = _.cloneDeep(amenityLinks);
      if (e.target.value == '') {
        amenityLinks_[index][e.target.name].error = amenityLinks_[index][e.target.name].is_require ? true : false;
        amenityLinks_[index][e.target.name].value = e.target.value;
    } 
      else {
        amenityLinks_[index][e.target.name].value = e.target.value === 'true' ? false : true;
        amenityLinks_[index][e.target.name].error = false;
      }
      setAmenityLinks(amenityLinks_);
    }
  }

  function removeMulti(index_, tag, index1) {
    if (tag == 'image') {
      let multi_images_ = _.cloneDeep(multi_images);
      if (multi_images_.length >= 1) {
        multi_images_ = multi_images_.map((val, index) => (index != index_ ? val : null));
        setMultiImages(multi_images_.filter((f) => f != null));
      }
    }
    else if (tag == 'amenity') {
      let amenityLinks_ = _.cloneDeep(amenityLinks);
      if (amenityLinks_.length > 1) {
        amenityLinks_ = amenityLinks_.map((val, index) => (index != index_ ? val : null));
        setAmenityLinks(amenityLinks_.filter((f) => f != null));
      }
    }
  }
  const addMulti = (tag) => {
    if (tag == 'image') {
      let multi_images_ = _.cloneDeep(multi_images);
      multi_images_.push({ ImagePath: { value: '', is_require: true, error: false } });
      setMultiImages(multi_images_);
    }
    else if (tag == 'amenity') {
      let amenityLinks_ = _.cloneDeep(amenityLinks);
      amenityLinks_.push({
        [newConstants.HOTEL_AMENITY_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.IS_SHOW]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
      });
      setAmenityLinks(amenityLinks_);
    }
  };  


  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    //console.log(validator(localFields_validation))
    if (!multi_images.length) {
      setImageErr("Image not found")
    }
    else if (multi_images.length) {
      setImageErr("")
    }

    let flag =
      !localFields_validation.err &&
      multi_images.length > 0

    if (flag) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createHotelRoomLink(localFields, generate, rightAmen, multi_images));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          loadData();
          setLoader(false);
          setAddEdit(false);
          setAlertMsg({ type: 'success', msg:res[constants.DATA_EXCEPTION].err_msg});
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(updateHotelRoomLink(localFields, generate, rightAmen, multi_images));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="hotelroomlink.fillrequired" /> });
    }
  };


  const AmenityLoad = async () => {
    let res = await httpPostRequest(getAllAmmunityY(""));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {

      let leftAmen_ = res[newConstants.DATA][newConstants.HOTEL_AMENITIES].map((val, index) => ({
        [newConstants.HOTEL_AMENITY_KEY]: val[newConstants.HOTEL_AMENITY_KEY],
        [newConstants.HOTEL_ROOM_AMENITY_NAME]: val[newConstants.HOTEL_AMENITY_NAME],
      }))
      setLeftamen(leftAmen_.filter(f => (!rightAmen.map(v => v[newConstants.HOTEL_AMENITY_KEY]).includes(f[newConstants.HOTEL_AMENITY_KEY]))))
    }
  };

  useEffect(() => {
    AmenityLoad()
  }, [rightAmen])



  const RoomKeyApi = async (hotelname) => {
    let res = await httpPostRequest(GetRoomByHotelKey(hotelname));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setRoom(res[newConstants.DATA][newConstants.ROOM_CATEGORIES])
    }
    else {
      setRoom([])
      setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
    }
  }

  useEffect(() => {
    if (hotelname) {
      RoomKeyApi(hotelname)
    }
  }, [hotelname])


  const generateJson = (data) => {
    var obj = {
      [newConstants.ROOM_MIN_PAX]: {
        value: data[newConstants.ROOM_MIN_PAX],
        is_require: true,
        error: false,
        type: 'number',
        err_msg: '',
      },
      [newConstants.ROOM_MAX_PAX]: {
        value: data[newConstants.ROOM_MAX_PAX],
        is_require: true,
        error: false,
        type: 'number',
        err_msg: '',
      },
      [newConstants.ROOM_MIN_ADULTS]: {
        value: data[newConstants.ROOM_MIN_ADULTS],
        is_require: true,
        error: false,
        type: 'number',
        err_msg: '',
      },
      [newConstants.ROOM_MAX_ADULTS]: {
        value: data[newConstants.ROOM_MAX_ADULTS],
        is_require: true,
        error: false,
        type: 'number',
        err_msg: '',
      },
      [newConstants.ROOM_MAX_CHILDS]: {
        value: data[newConstants.ROOM_MAX_CHILDS],
        is_require: true,
        error: false,
        type: 'number',
        err_msg: '',
      },
    }
    setGenerate(obj)
  }


  const generateField = async (f) => {
    let localFields_ = _.cloneDeep(localFields)
    let res = await httpPostRequest(getRoomByKey(roomname));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (editData) {
        let tag = false
        for (let field in localFields_) {
          if (localFields_[field].value != editData[field]) {
            tag = true;
          }
        }
        generateJson(tag ? res[newConstants.DATA] : editData);
      }
      else {
        generateJson(res[newConstants.DATA])
      }
    }
    else {
      // setGenerate([])
      setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
    }
  }

  useEffect(() => {
    if (roomname) {
      generateField(roomname)
    }
  }, [roomname])

  return (
    <div>
      {localFields ? (
        <Row padding={[10]}>
          {/* <Column padding={[8]} margin={[0, 0, 10, 0]}>
            <Text bold size={16}>
              <LanguageConfig id={editData ? "hotelroomlink.editroominfo" : "hotelroomlink.addroominfo"} />
            </Text>
          </Column> */}
          <Column>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <HotelName
                  name={newConstants.HOTEL_KEY}
                  value={localFields[newConstants.HOTEL_KEY].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.HOTEL_KEY].error && localFields[newConstants.HOTEL_KEY].is_require}
                  helperText={
                    localFields[newConstants.HOTEL_KEY].error && localFields[newConstants.HOTEL_KEY].is_require
                      ? localFields[newConstants.HOTEL_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="hotelroomlink.hotel" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <RoomName
                  name={newConstants.ROOM_KEY}
                  value={localFields[newConstants.ROOM_KEY].value}
                  onChange={(e) => {
                    setRoomname(e.target.value)
                    stateUpdater(e)
                  }}
                  error={localFields[newConstants.ROOM_KEY].error && localFields[newConstants.ROOM_KEY].is_require}
                  helperText={
                    localFields[newConstants.ROOM_KEY].error && localFields[newConstants.ROOM_KEY].is_require
                      ? localFields[newConstants.ROOM_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="hotelroomlink.room" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="hotelroomlink.roomallotment" />}
                  name={newConstants.ROOM_ALLOTMENT}
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields[newConstants.ROOM_ALLOTMENT].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.ROOM_ALLOTMENT].error
                  }
                  helperText={localFields[newConstants.ROOM_ALLOTMENT].err_msg}
                  required={localFields[newConstants.ROOM_ALLOTMENT].is_require}
                />
              </Column>
              {generate &&
                <Row>
                  <Column md={3} padding={[10, 5]}>
                    <TextField
                      label={<LanguageConfig id="hotelroomlink.roomminpax" />}
                      name={newConstants.ROOM_MIN_PAX}
                      type="number"
                      inputProps={{ min: 0 }}
                      value={generate[newConstants.ROOM_MIN_PAX].value}
                      onChange={generateUpdate}
                      error={generate[newConstants.ROOM_MIN_PAX].error}
                      helperText={generate[newConstants.ROOM_MIN_PAX].err_msg}
                      required={generate[newConstants.ROOM_MIN_PAX].is_require}
                    />
                  </Column>
                  <Column md={3} padding={[10, 5]}>
                    <TextField
                      label={<LanguageConfig id="hotelroomlink.roommaxpax" />}
                      name={newConstants.ROOM_MAX_PAX}
                      type="number"
                      inputProps={{ min: 0 }}
                      value={generate[newConstants.ROOM_MAX_PAX].value}
                      onChange={generateUpdate}
                      error={generate[newConstants.ROOM_MAX_PAX].error}
                      helperText={generate[newConstants.ROOM_MAX_PAX].err_msg}
                      required={generate[newConstants.ROOM_MAX_PAX].is_require}
                    />
                  </Column>
                  <Column md={3} padding={[10, 5]}>
                    <TextField
                      id="room-min-adults"
                      label={<LanguageConfig id="hotelroomlink.roomminadult" />}
                      name={newConstants.ROOM_MIN_ADULTS}
                      type="number"
                      inputProps={{ min: 0 }}
                      value={generate[newConstants.ROOM_MIN_ADULTS].value}
                      onChange={generateUpdate}
                      error={
                        generate[newConstants.ROOM_MIN_ADULTS].error
                      }
                      helperText={generate[newConstants.ROOM_MIN_ADULTS].err_msg}
                      required={generate[newConstants.ROOM_MIN_ADULTS].is_require}
                    />
                  </Column>
                  <Column md={3} padding={[10, 5]}>
                    <TextField
                      label={<LanguageConfig id="hotelroomlink.roommaxadult" />}
                      name={newConstants.ROOM_MAX_ADULTS}
                      type="number"
                      inputProps={{ min: 0 }}
                      value={generate[newConstants.ROOM_MAX_ADULTS].value}
                      onChange={generateUpdate}
                      error={
                        generate[newConstants.ROOM_MAX_ADULTS].error
                      }
                      helperText={generate[newConstants.ROOM_MAX_ADULTS].err_msg}
                      required={generate[newConstants.ROOM_MAX_ADULTS].is_require}
                    />
                  </Column>
                  <Column md={3} padding={[10, 5]}>
                    <TextField
                      label={<LanguageConfig id="hotelroomlink.roommaxchilds" />}
                      name={newConstants.ROOM_MAX_CHILDS}
                      type="number"
                      inputProps={{ min: 0 }}
                      value={generate[newConstants.ROOM_MAX_CHILDS].value}
                      onChange={generateUpdate}
                      error={
                        generate[newConstants.ROOM_MAX_CHILDS].error
                      }
                      helperText={generate[newConstants.ROOM_MAX_CHILDS].err_msg}
                      required={generate[newConstants.ROOM_MAX_CHILDS].is_require}
                    />
                  </Column>
                  
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="hotelroomlink.childagelimit" />}
                  name={newConstants.CHILD_AGE_LIMIT}
                  type="number"
                  disabled={localFields[newConstants.IS_CHILD_ALLOWED].value == true ? false : true}
                  inputProps={{ min: 0 }}
                  value={localFields[newConstants.IS_CHILD_ALLOWED].value == true ? localFields[newConstants.CHILD_AGE_LIMIT].value : localFields[newConstants.CHILD_AGE_LIMIT].value = ""}
                  onChange={stateUpdater}
                  error={localFields[newConstants.CHILD_AGE_LIMIT].error}
                  helperText={localFields[newConstants.CHILD_AGE_LIMIT].err_msg}
                  required={localFields[newConstants.CHILD_AGE_LIMIT].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 20]} center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFields[newConstants.IS_CHILD_ALLOWED].value}
                      color="primary"
                      onChange={() =>
                        setLocalFields({
                          ...localFields,
                          [newConstants.IS_CHILD_ALLOWED]: {
                            ...localFields[newConstants.IS_CHILD_ALLOWED],
                            value: !localFields[newConstants.IS_CHILD_ALLOWED].value,
                          },
                        })
                      }
                      name={newConstants.IS_CHILD_ALLOWED}
                    />
                  }
                  label={<LanguageConfig id="hotelroomlink.ischildallowed" />}
                />
              </Column>
                </Row>}
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
                    label={<LanguageConfig id="hotelroomlink.isactive" />}
                  />
                </Column>
              ) : (
                ''
              )}
              <Row>
                <Column md={2} padding={[0,0,0,7]}>
                  <HotelAmenity
                    leftAmen={leftAmen}
                    setLeftamen={setLeftamen}
                    rightAmen={rightAmen}
                    setRightamen={setRightamen}
                  />
                </Column>
                <Column md={2}>
                  <Box
                    border={1}
                    borderColor={imageErr.length ? 'red' : 'white'}
                    borderRadius={5}>
                    <ImageHandler
                      multiStateUpdater={multiStateUpdater}
                      classes={classes}
                      multi_images={multi_images}
                      removeMulti={removeMulti}
                    />
                  </Box>
                  <Column md={8}></Column>
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
                            {<LanguageConfig id={editData ? "hotelroomlink.update" : "Save"} />}
                          </Column>
                        </Row>
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setAddEdit(false);
                          setEditData(null);
                        }}
                        className={classes.closeButton}
                        variant="contained">
                        <LanguageConfig id={"hotelroomlink.cancel"} />
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



const RoomName = ({ name, value, onChange, error, helperText, label, isDisabled }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    loadRooms()
  }, [value])


  const loadRooms = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllRoomsY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.ROOM_CATEGORIES].map((v) => ({
            value: v[newConstants.ROOM_KEY],
            label: v[newConstants.ROOM_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.ROOM_CATEGORIES].map((v) => ({
            value: v[newConstants.ROOM_KEY],
            label: v[newConstants.ROOM_NAME],
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
      loadOptions={loadRooms}
      isDisabled={isDisabled}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const HotelName = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);
  useEffect(() => {
    hotelByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadHotel();
  }, []);

  const hotelByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(hotelMasterGetId(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.HOTEL_NAME],
          value: res[newConstants.DATA][newConstants.HOTEL_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadHotel = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(hotelMasterGetY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.HOTELS].map((v) => ({
            value: v[newConstants.HOTEL_KEY],
            label: v[newConstants.HOTEL_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.HOTELS].map((v) => ({
            value: v[newConstants.HOTEL_KEY],
            label: v[newConstants.HOTEL_NAME],
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
      loadOptions={loadHotel}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const ImageHandler = ({ classes, multiStateUpdater, multi_images, removeMulti }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [tab, setTab] = useState(0);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  console.log(multi_images)
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
      const res = await httpPostRequestWithForm(imageUploder(e[i], 'ROOM_IMAGES', key));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        images_.push({ value: res.data.fileKey, url: res.data.downloadUrl, image_type_key: key });
      }
      i++;
    }
    multiStateUpdater(images_, '', 'image');
    setLoader(false);
  };

  function removeImage(key) {
    let index = multi_images.findIndex((f) => f.url == key);
    removeMulti(index, 'image');
  }

  return (
    <Row >
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
                                // onClick={() =>
                                //   stateUpdater({
                                //     target: { value: val.url, name: newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY },
                                //   })
                                // }
                                >
                                  {val.image_type_key ? (
                                    <CheckCircle className={classes.primaryImageSelect} />
                                  ) : (
                                    <RadioButtonUnchecked className={classes.primaryImageUnSelect} />
                                  )}
                                </Touchable>
                                <Touchable
                                // onClick={() =>
                                //   stateUpdater({
                                //     target: { value: val.url, name: newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY },
                                //   })
                                // }
                                >
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
    return amm[newConstants.HOTEL_ROOM_AMENITY_NAME].toLowerCase().indexOf(search.trim().toLowerCase()) !== -1;
  });

  //console.log(leftAmen)
  //console.log(rightAmen)

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
              <ListItemText id={labelId} primary={value[newConstants.HOTEL_ROOM_AMENITY_NAME]} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <div >
      <Button onClick={() => setOpen(true)}  className={classes.blockButton} variant="contained" color="primary">
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
               &gt;&gt;
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
               &lt;&lt;
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList(rightAmen, "right")}</Grid>
        </Grid>
      </ModalComponent>
    </div>
  );
}

