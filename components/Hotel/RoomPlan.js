import React, { useState, useEffect, useRef, useCallback, useMemo  } from 'react';
import {
  Text,
  TextField,
  Card,
  Row,
  Column,
  Loader,
  CustomAlert,
  SingelSelectOnDemand,
  DemandDropDown
} from '../../core';
import {
  Fade,
  InputLabel,
  Button,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  IconButton,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Create, Delete, Add, Remove, Edit } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest ,getDateYYYYMMDD} from '../../helper/JsHelper';
import {
  generateRoomPlan,
  hotelMasterGetId,
  hotelMasterGet,
  getAllRooms,
  createRoomPlan,
  updateRoomPlan,
  deleteRoomPlan,
  getAllRefundTypes,
  getAllRoomPlan,
  getRoomPlanByKey,
  RoomPriceInfoById,
  GetRoomByHotelKey,
  getRoomPriceY,
  getHotelRoomLinkByKey
} from '../../helper/RequestPayLoad';
import { constants, newConstants } from '../../helper/constants';
var FA = require('react-fontawesome');
import PrimaryContainer from "../PrimaryContainer";
import LanguageConfig from "../../helper/LanguageConfig";
import { typeParameterInstantiation } from '@babel/types';

const useStyles = makeStyles((theme) => ({

  addEdit: {
    margin: '5px',
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.main,
    },
  },
  addMulti: {
    margin: '5px',
    backgroundColor: "#505ccb",
    '&:hover': {
      backgroundColor: "#505ccb",
    },
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
  box: {
    flexGrow: 1,
    flexBasis: 0,
  },
  TableContain: {
    maxWidth: "300px",
    minWidth: "100%"
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
  tableBodyTuple: {
    color: 'black',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    // textTransform: 'uppercase',
    width: 'clamp(150px,10vw,300px)',
  },
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
    is_require: false,
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
  [newConstants.ROOM_PLAN_CANCEL_POLICIES]: { value: [room_plan_cancel_policy], is_require: true, error: false },
};

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg ,copylanguages, formname} = useStore();
  const [deleteId, setDeleteId] = useState('');


  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: <LanguageConfig id="roomplan.sno" /> },
    [newConstants.ROOM_PLAN_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="roomplan.roomplanname" /> },
    [newConstants.IS_ALL_DAYS_IS_WEEK_STR]: { is_hide: false, bool: true, label: <LanguageConfig id="roomplan.isalldaysinweek" /> },
    // ["b2b-price-addition-value"]: { is_hide: false, bool: true, label: "b2b addition value" },
    // ["b2b-price-amenity-value"]: { is_hide: false, bool: true, label: "b2b amenity value" },
    // ["b2b-price-net-value"]: { is_hide: false, bool: true, label: "b2b net value" },
    // ["b2b-price-service-value"]: { is_hide: false, bool: true, label: "b2b service value" },
    // ["b2b-price-tax-value"]: { is_hide: false, bool: true, label: "b2b tax value" },
    // ["b2c-price-addition-value"]: { is_hide: false, bool: true, label: "b2c addition value" },
    // ["b2c-price-amenity-value"]: { is_hide: false, bool: true, label: "b2c amenity value" },
    // ["b2c-price-net-value"]: { is_hide: false, bool: true, label: "b2c net value" },
    // ["b2c-price-service-value"]: { is_hide: false, bool: true, label: "b2c service value" },
    // ["b2c-price-tax-value"]: { is_hide: false, bool: true, label: "b2c tax value" },

    // [newConstants.IS_SUNDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.issunday" /> },
    // [newConstants.IS_MONDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.ismonday" /> },
    // [newConstants.IS_TUESDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.istuesday" /> },
    // [newConstants.IS_WEDNESDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.iswednesday" /> },
    // [newConstants.IS_THURSDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.isthursday" /> },
    // [newConstants.IS_FRIDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.isfriday" /> },
    // [newConstants.IS_SATURDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.issaturday" /> },

    // [newConstants.IS_SATURDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="roomplan.issaturday" /> },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="roomplan.status" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="roomplan.lastupdatedby" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: true, bool: true, label: <LanguageConfig id="roomplan.lastupdatedon" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="roomcategory.action" /> }
  });

  const objectReAssign = (values) => {
    if (Array.isArray(values)) {
      for (let index = 0; index < values.length; index++) {
        values[index] = objectReAssign(values[index])
      }
    }
    else {
      for (let object in values) {
        if (typeof values[object] == 'object' && values[object] != null) {

          for (let innerObj in values[object]) {
            values[object + "-" + innerObj] = values[object][innerObj];
          }
          delete values[object];
        }
      }
    }
    return values;
  }

  const loadData = async () => {
    if (!addEdit) {
      setLoader(true);
      let res = await httpPostRequest(getAllRoomPlan(search_key, (currIndex - 1) * pageSize + 1, pageSize));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setData(objectReAssign(res[constants.DATA][newConstants.ROOM_PLANS]));
        setLoader(false);
        setMaxPage(
          res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
            parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
            0
            ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
            : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
        );
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

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };
  const editRoomPlan = async (key) => {
    setAddEdit(false);
    let res = await httpPostRequest(getRoomPlanByKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
    }
    else {
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function delRoomPlan() {
    const res = await httpPostRequest(deleteRoomPlan(deleteId));
    setDeleteLoader(deleteId);
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setDeleteLoader('');
      loadData();
      setDeleteId('');
      setAlertMsg({ type: 'success', msg:res[constants.DATA_EXCEPTION].err_msg });
    } else {
      setDeleteLoader('');
      setAlertMsg({ type: 'error', msg:res[constants.DATA_EXCEPTION].err_msg });
    }
  }


  return (
    <div>
      <Card margin={[0,0,10,0]}>
      {addEdit && <Fade in={addEdit}>
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
        setEditData={setEditData}
        data={data}
        filter_object={newConstants.ROW_NUMBER}
        editRow={editRoomPlan}
        deleteRow={setDeleteId}
        action_key={newConstants.ROOM_PLAN_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
      >
        <CustomAlert
          message={<LanguageConfig id="roomplan.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delRoomPlan}
        />
        
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit, copylanguages,languages, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [amenityLinks, setAmenityLinks] = useState([]);
  const [roomamenity, setRoomAmenity] = useState([])
  const [cancelPolicyRules, setCancelPolicyRules] = useState([]);
  const [loader, setLoader] = useState(false);
  const [genetatedFields, setGenetatedFields] = useState([])
  const [hotelname, setHotelname] = useState(editData?editData[newConstants.HOTEL_KEY]:"")
  const [roomname, setRoomname] = useState(editData?editData[newConstants.ROOM_KEY]:"")
  const [room, setRoom] = useState([])
  const [amenityCharge,setAmenityCharge] = useState(0)

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.ROOM_PLAN_NAME]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
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
        ["b2b-tax-value"]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-service-value"]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-additional-value"]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-amenity-value"]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-net-value"]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-tax-value"]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-service-value"]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-additional-value"]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-amenity-value"]: {
          value: "",
          is_require: false,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-net-value"]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.TAX_TYPE]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.SERVICE_TYPE]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ADDITIONAL_TYPE]: {
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
        [newConstants.IS_SOLD_OUT]: {
          value: false,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.PRICE_COMMENTS_KEY]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_PAX_WISE]: {
          value: false,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
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
        [newConstants.ROOM_PLAN_NAME]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      setMultiLanguage(Tab_multi)
      setAmenityLinks([
        {
          [newConstants.ROOM_AMENITY_KEY]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.ROOM_AMENITY_PRICE]: {
            value: '',
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          [newConstants.IS_SHOW]: {
            value: true,
            is_require: true,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
        },
      ]);
      const room_plan_cancel_rules_ = _.cloneDeep(room_plan_cancel_rules);
      setCancelPolicyRules([room_plan_cancel_rules_]);
      // console.log([room_plan_cancel_rules_]);
    } else {
      setLocalFields({
        [newConstants.ROOM_PLAN_NAME]: {
          value: editData[newConstants.ROOM_PLAN_NAME],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
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
        ["b2b-tax-value"]: {
          value: editData[newConstants.B2B_PRICE][newConstants.TAX_VALUE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-service-value"]: {
          value: editData[newConstants.B2B_PRICE][newConstants.SERVICE_VALUE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-additional-value"]: {
          value: editData[newConstants.B2B_PRICE][newConstants.ADDITION_VALUE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-amenity-value"]: {
          value: editData[newConstants.B2B_PRICE][newConstants.AMENITY_VALUE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-net-value"]: {
          value: editData[newConstants.B2B_PRICE][newConstants.NET_VALUE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-tax-value"]: {
          value: editData[newConstants.B2C_PRICE][newConstants.TAX_VALUE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-service-value"]: {
          value: editData[newConstants.B2C_PRICE][newConstants.SERVICE_VALUE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-additional-value"]: {
          value: editData[newConstants.B2C_PRICE][newConstants.ADDITION_VALUE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-amenity-value"]: {
          value: editData[newConstants.B2C_PRICE][newConstants.AMENITY_VALUE],
          is_require: false,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-net-value"]: {
          value: editData[newConstants.B2C_PRICE][newConstants.NET_VALUE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },

        [newConstants.TAX_TYPE]: {
          value: editData[newConstants.TAX_TYPE],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.SERVICE_TYPE]: {
          value: editData[newConstants.SERVICE_TYPE],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ADDITIONAL_TYPE]: {
          value: editData[newConstants.ADDITIONAL_TYPE],
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
        [newConstants.IS_SOLD_OUT]: {
          value: editData[newConstants.IS_SOLD_OUT],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.PRICE_COMMENTS_KEY]: {
          value: editData[newConstants.PRICE_COMMENTS_KEY],
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_PAX_WISE]: {
          value: editData[newConstants.IS_PAX_WISE],
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_ALL_DAYS_IN_WEEK]: {
          value: editData[newConstants.IS_ALLDAYS_IN_WEEK],
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
          is_require: true,
          error: false,
          type: 'boolean',
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
        [newConstants.ROOM_PLAN_NAME]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))

      // genereteFields(editData[newConstants.ROOM_PLAN_PAX_PRICE]?editData[newConstants.ROOM_PLAN_PAX_PRICE]:null)
      let multi_language_ = [];
      if (editData[newConstants.ROOM_PLAN_LANGUAGES] && editData[newConstants.ROOM_PLAN_LANGUAGES].length) {
        editData[newConstants.ROOM_PLAN_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.ROOM_PLAN_NAME]: {
              value: value[newConstants.ROOM_PLAN_NAME],
              is_require: false,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: false,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
          });
        });
      } else {
        multi_language_.push(...Tab_multi);
      }
      setMultiLanguage(multi_language_.concat(Tab_multi.filter(f => !(multi_language_.map(v => v[newConstants.LANG_CODE].value).includes(f[newConstants.LANG_CODE].value)))))

      let amenityLinks_ = [];
      if (editData[newConstants.ROOM_PLAN_AMENITY_LINKS] && editData[newConstants.ROOM_PLAN_AMENITY_LINKS].length) {
        editData[newConstants.ROOM_PLAN_AMENITY_LINKS].forEach((value) => {
          amenityLinks_.push({
            [newConstants.ROOM_AMENITY_KEY]: {
              value: value[newConstants.ROOM_AMENITY_KEY],
              is_require: true,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.ROOM_AMENITY_PRICE]: {
              value: value[newConstants.ROOM_AMENITY_PRICE],
              is_require: true,
              error: false,
              type: 'price',
              err_msg: '',
            },
            [newConstants.IS_SHOW]: {
              value: value[newConstants.IS_SHOW],
              is_require: true,
              error: false,
              type: 'boolean',
              err_msg: '',
            },
          });
        });
      } else {
        amenityLinks_.push({
          [newConstants.ROOM_AMENITY_KEY]: {
            value: '',
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.ROOM_AMENITY_PRICE]: {
            value: '',
            is_require: true,
            error: false,
            type: 'price',
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
      }
      setAmenityLinks(amenityLinks_);

      let cancelPolicyRules_ = [];
      if (
        editData[newConstants.ROOM_PLAN_CANCEL_POLICY_RULES] &&
        editData[newConstants.ROOM_PLAN_CANCEL_POLICY_RULES].length
      ) {
        editData[newConstants.ROOM_PLAN_CANCEL_POLICY_RULES].forEach((value) => {
          let cancelPolicies_ = [];
          if (value[newConstants.ROOM_PLAN_CANCEL_POLICIES] && value[newConstants.ROOM_PLAN_CANCEL_POLICIES].length) {
            value[newConstants.ROOM_PLAN_CANCEL_POLICIES].forEach((value) => {
              cancelPolicies_.push({
                [newConstants.REFUND_TYPE_KEY]: {
                  value: value[newConstants.REFUND_TYPE_KEY],
                  is_require: true,
                  error: false,
                  type: 'dropdown',
                  err_msg: '',
                },
                [newConstants.DAYS_BEFORE_CHECK_IN]: {
                  value: value[newConstants.DAYS_BEFORE_CHECK_IN],
                  is_require: true,
                  error: false,
                  type: 'number',
                  err_msg: '',
                },
                [newConstants.CANCELATION_VALUE]: {
                  value: value[newConstants.CANCELATION_VALUE],
                  is_require: false,
                  error: false,
                  type: 'price',
                  err_msg: '',
                },
              });
            });
          } else {
            cancelPolicies_.push(room_plan_cancel_policy);
          }
          cancelPolicyRules_.push({
            [newConstants.ROOM_CANCEL_RULE_NAME]: {
              value: value[newConstants.ROOM_CANCEL_RULE_NAME],
              is_require: true,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.IS_DATE_RANGE]: {
              value: value[newConstants.IS_DATE_RANGE],
              is_require: true,
              error: false,
              type: 'boolean',
              err_msg: '',
            },
            [newConstants.EFFECTIVE_FROM]: {
              value: value[newConstants.EFFECTIVE_FROM].split("-").reverse().join("-"),
              is_require: true,
              error: false,
            },
            [newConstants.EFFECTIVE_TO]: {
              value: value[newConstants.EFFECTIVE_TO].split("-").reverse().join("-"),
              is_require: true,
              error: false,
            },
            [newConstants.ROOM_PLAN_CANCEL_POLICIES]: {
              value: cancelPolicies_,
              is_require: false,
              error: false,
            },
          });
        });
      } else {
        cancelPolicyRules_.push(room_plan_cancel_rules);
      }
      // console.log('cancel rules', cancelPolicyRules_);
      setCancelPolicyRules(cancelPolicyRules_);
      genereteFields(editData[newConstants.ROOM_PLAN_PAX_PRICE])
    }
  }, [editData]);

  useEffect(() => { 
    let temp = 0;
    amenityLinks.forEach(obj=>{
      temp+=parseFloat(obj[newConstants.ROOM_AMENITY_PRICE][newConstants.VALUE])
    })
    setAmenityCharge(temp)
  }, [amenityLinks])



  const stateUpdater = (e) => {
    let localFields_ = _.cloneDeep(localFields);
    if (e.target.value.length == 0) {
      localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
      localFields_[e.target.name].value = e.target.value;
    } else {
      localFields_[e.target.name].value = e.target.value;
      localFields_[e.target.name].error = false;
    }
    //   if (editData) {
    //     let tag = false
    //     for (let field in localFields_) {
    //         if (localFields_[field].value != editData[field]) {
    //             tag = true;
    //         }
    //     }
    //     genereteFields(tag ? [] : editData[newConstants.ROOM_PLAN_PAX_PRICE]);
    // }
    setLocalFields(localFields_);
  };

  function multiStateUpdater(e, index, tag, index1) {
    if (tag == 'list') {
      let gson_ = _.cloneDeep(genetatedFields);
      if (e.target.value.length == 0) {
        gson_[index][e.target.name].error = gson_[index][e.target.name].is_require ? true : false;
        gson_[index][e.target.name].value = e.target.value;
      } else {
        gson_[index][e.target.name].value = e.target.value;
        gson_[index][e.target.name].error = false;
      }
      setGenetatedFields(gson_);
    }
    else if (tag == 'lang') {
      // let multi_language_ = _.cloneDeep(multi_language);
      // if (index != null) {
      //   multi_language_[index] = e;
      // }
      // else {
      //   multi_language_.push(e);
      // }
      // setMultiLanguage(multi_language_.filter(f => f && f[newConstants.LANG_CODE]?.value != ""));
      let multi_language_ = _.cloneDeep(multi_language);
      if (e.target.value.length == 0) {
        multi_language_[index][e.target.name].error = multi_language_[index][e.target.name].is_require ? true : false;
        multi_language_[index][e.target.name].value = e.target.value;
      } else {
        multi_language_[index][e.target.name].value = e.target.value;
        multi_language_[index][e.target.name].error = false;
      }
      setMultiLanguage(multi_language_);
    } else if (tag == 'amenity') {
      let amenityLinks_ = _.cloneDeep(amenityLinks);
      if (e.target.value.length == 0) {
        amenityLinks_[index][e.target.name].error = amenityLinks_[index][e.target.name].is_require ? true : false;
        amenityLinks_[index][e.target.name].value = e.target.value;
      } else {
        amenityLinks_[index][e.target.name].value = e.target.value;
        amenityLinks_[index][e.target.name].error = false;
      }
      setAmenityLinks(amenityLinks_);
    } else if (tag == 'cancel_rules') {
      let cancelPolicyRules_ = _.cloneDeep(cancelPolicyRules);
      if (index1 != undefined) {
        if (e.target.value.length == 0) {
          cancelPolicyRules_[index][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE][index1][
            e.target.name
          ].error = cancelPolicyRules_[index][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE][index1][
            e.target.name
          ].is_require
              ? true
              : false;
          cancelPolicyRules_[index][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE][index1][
            e.target.name
          ].value = e.target.value;
        } else {
          cancelPolicyRules_[index][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE][index1][
            e.target.name
          ].value = e.target.value;
          cancelPolicyRules_[index][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE][index1][
            e.target.name
          ].error = false;
        }
      } else {
        if (e.target.value.length == 0) {
          cancelPolicyRules_[index][e.target.name].error = cancelPolicyRules_[index][e.target.name].is_require
            ? true
            : false;
          cancelPolicyRules_[index][e.target.name].value = e.target.value;
        } else {
          cancelPolicyRules_[index][e.target.name].value = e.target.value;
          cancelPolicyRules_[index][e.target.name].error = false;
        }
      }
      setCancelPolicyRules(cancelPolicyRules_);
    } else if (tag == 'amenity_check') {
      let amenityLinks_ = _.cloneDeep(amenityLinks);
      if (e.target.value == '') {
        amenityLinks_[index][e.target.name].error = amenityLinks_[index][e.target.name].is_require ? true : false;
        amenityLinks_[index][e.target.name].value = e.target.value;
      } else {
        amenityLinks_[index][e.target.name].value = e.target.value === 'true' ? false : true;
        amenityLinks_[index][e.target.name].error = false;
      }
      setAmenityLinks(amenityLinks_);
    } else if (tag == 'cancel_rules_check') {
      let cancelPolicyRules_ = _.cloneDeep(cancelPolicyRules);
      if (e.target.value == '') {
        cancelPolicyRules_[index][e.target.name].error = cancelPolicyRules_[index][e.target.name].is_require ? true : false;
        cancelPolicyRules_[index][e.target.name].value = e.target.value;
      } else {
        cancelPolicyRules_[index][e.target.name].value = e.target.value === 'true' ? false : true;
        cancelPolicyRules_[index][e.target.name].error = false;
      }
      setCancelPolicyRules(cancelPolicyRules_);
    }
  }

  function removeMulti(index_, tag, index1) {
    if (tag == 'amenity') {
      let amenityLinks_ = _.cloneDeep(amenityLinks);
      if (amenityLinks_.length > 1) {
        amenityLinks_ = amenityLinks_.map((val, index) => (index != index_ ? val : null));
        setAmenityLinks(amenityLinks_.filter((f) => f != null));
      }
    } else if (tag == 'cancel_rules') {
      let cancelPolicyRules_ = _.cloneDeep(cancelPolicyRules);
      if (
        index1 != undefined &&
        cancelPolicyRules_[index_][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE].length > 1
      ) {
        cancelPolicyRules_[index_][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE] = cancelPolicyRules_[index_][
          newConstants.ROOM_PLAN_CANCEL_POLICIES
        ][newConstants.VALUE].filter((val, index) => index != index1);
      }
      if (index1 == undefined && cancelPolicyRules_.length > 1) {
        cancelPolicyRules_ = cancelPolicyRules_.map((val, index) => (index != index_ ? val : null));
      }
      setCancelPolicyRules(cancelPolicyRules_.filter((f) => f != null));
    }
  }

  const addMulti = (tag, index) => {
    if (tag == 'amenity') {
      let amenityLinks_ = _.cloneDeep(amenityLinks);
      amenityLinks_.push({
        [newConstants.ROOM_AMENITY_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ROOM_AMENITY_PRICE]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
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
    } else if (tag == 'cancel_rules') {
      let cancelPolicyRules_ = _.cloneDeep(cancelPolicyRules);

      if (index != undefined) {
        cancelPolicyRules_[index][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE].push(
          _.cloneDeep(room_plan_cancel_policy),
        );
      } else {
        cancelPolicyRules_.push(_.cloneDeep(room_plan_cancel_rules));
      }
      setCancelPolicyRules(cancelPolicyRules_);
    }
  };


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
    if (hotelname){
      RoomKeyApi(hotelname)
    }
  }, [hotelname])


  const genereteFields = (fields) => {
    fields = fields.map((value) => {
      return {
        [newConstants.PAX_ADULT]: {
          value: value[newConstants.PAX_ADULT],
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.PAX_CHILD]: {
          value: value[newConstants.PAX_CHILD],
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        ["b2b-net-value"]: {
          value: value["b2b-net-value"],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-net-value"]: {
          value: value["b2c-net-value"],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
      }
    })
    setGenetatedFields(fields)
  };


  const RoomPlanKey = async (hotelname, roomname) => {
    let res = await httpPostRequest(getHotelRoomLinkByKey(hotelname, roomname));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      let amenity_=res[newConstants.DATA][newConstants.HOTEL_ROOM_AMENITY_LINKS].filter(f=>!(amenityLinks.map(v=>v[newConstants.ROOM_AMENITY_KEY].value).includes(f[newConstants.HOTEL_AMENITY_KEY])))
      setRoomAmenity(amenity_)
    }    
    else {
      setRoomAmenity([])
      setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
    }
  }


  useEffect(() => {
    if (roomname.length && hotelname.length) {
      RoomPlanKey(hotelname, roomname)
    }
  }, [hotelname, roomname])


  const generateJson = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    let flag = !localFields_validation.err
    if (flag) {
      setLoader(true);
      let res = await httpPostRequest(generateRoomPlan(localFields));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        genereteFields(res[newConstants.DATA])
        setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
        setLoader(false);

      } else {
        localFields_validation.values[newConstants.IS_PAX_WISE].value = false
        genereteFields([])
        setLocalFields(localFields_validation.values)
        setLoader(false);
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    }
    else {
      setAlertMsg({ type: 'error', msg:  <LanguageConfig id="roomplan.fillrequired" /> });
    }
  }

  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }

    let amenityLinks_validator = _.cloneDeep(amenityLinks);
    amenityLinks_validator = amenityLinks_validator.map((value) => validator(value));
    if (amenityLinks_validator.filter((f) => f.err == true).length) {
      setAmenityLinks(amenityLinks_validator.map((value) => value.values));
    }
    let cancelPolicyRules_validator = _.cloneDeep(cancelPolicyRules);
    cancelPolicyRules_validator = cancelPolicyRules_validator.map((value) => validator(value));
    if (cancelPolicyRules_validator.filter((f) => f.err == true).length) {
      setCancelPolicyRules(cancelPolicyRules_validator.map((value) => value.values));
    }

    let flag =
      !localFields_validation.err &&
      amenityLinks_validator.filter((f) => f.err).length == 0 &&
      cancelPolicyRules_validator.filter((f) => f.err).length == 0
      let multi_lang_ = multi_language.filter(f => f[newConstants.ROOM_PLAN_NAME].value != "")
    if (flag) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createRoomPlan(localFields, multi_lang_, amenityLinks, cancelPolicyRules, localFields[newConstants.IS_PAX_WISE].value == true ? genetatedFields : []));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg});
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(
          updateRoomPlan(editData[newConstants.ROOM_PLAN_KEY], localFields, multi_lang_, amenityLinks, cancelPolicyRules, genetatedFields),
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="roomplan.fillrequired" /> });
    }
  };

  return (
    <div>
      {localFields.hasOwnProperty([newConstants.ROOM_PLAN_NAME]) ? (
        <Row padding={[10]}>
          {/* <Column padding={[8]}>
            <Text bold size={16}>
              <LanguageConfig id={editData ? "roomplan.editroomplan" : "roomplan.addroomplan"} />
            </Text>
          </Column> */}
          <Column>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <HotelName
                  name={newConstants.HOTEL_KEY}
                  value={localFields[newConstants.HOTEL_KEY].value}
                  isDisabled={localFields[newConstants.IS_PAX_WISE].value==true?true:false}
                  onChange={(e) => {
                    setHotelname(e.target.value)
                    stateUpdater(e)
                    // stateUpdater({target:{name:newConstants.ROOM_KEY,value:""}})
                  }}
                  error={localFields[newConstants.HOTEL_KEY].error && localFields[newConstants.HOTEL_KEY].is_require}
                  helperText={
                    localFields[newConstants.HOTEL_KEY].error && localFields[newConstants.HOTEL_KEY].is_require
                      ? localFields[newConstants.HOTEL_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="roomplan.hotel" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <RoomName
                  room={room}
                  name={newConstants.ROOM_KEY}
                  isDisabled={localFields[newConstants.IS_PAX_WISE].value==true?true:false}
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
                  label={<LanguageConfig id="roomplan.room" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="roomplan.roomplanname" />}
                  name={newConstants.ROOM_PLAN_NAME}
                  value={localFields[newConstants.ROOM_PLAN_NAME].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.ROOM_PLAN_NAME].error
                  }
                  helperText={localFields[newConstants.ROOM_PLAN_NAME].err_msg}
                  required={localFields[newConstants.ROOM_PLAN_NAME].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={"Room allotment"}
                  type="number"
                  inputProps={{ min: 0 }}
                  name={newConstants.ROOM_ALLOTMENT}
                  value={localFields[newConstants.ROOM_ALLOTMENT].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.ROOM_ALLOTMENT].error
                  }
                  helperText={localFields[newConstants.ROOM_ALLOTMENT].err_msg}
                  required={localFields[newConstants.ROOM_ALLOTMENT].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 20]} center>
              {editData &&
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFields[newConstants.IS_SOLD_OUT].value}
                      color="primary"
                      onChange={() =>
                        setLocalFields({
                          ...localFields,
                          [newConstants.IS_SOLD_OUT]: {
                            ...localFields[newConstants.IS_SOLD_OUT],
                            value: !localFields[newConstants.IS_SOLD_OUT].value,
                          },
                        })
                      }
                      name={newConstants.IS_SOLD_OUT}
                    />
                  }
                  label={"sold out"}
                />}
              </Column>
              <Row>
                <Column>
                  <LanguageContainer copylanguages={copylanguages} classes={classes} languages={languages} multi_language={multi_language} languageStateUpdater={multiStateUpdater} />
                </Column>
                <Column>
                  <Text size={14} bold style={{ margin: 10 }}>
                    Available days
                  </Text>
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            [newConstants.IS_ALL_DAYS_IN_WEEK]: {
                              ...localFields[newConstants.IS_ALL_DAYS_IN_WEEK],
                              value: !localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value,
                            },
                          })
                        }
                        name={newConstants.IS_ALL_DAYS_IN_WEEK}
                      />
                    }
                    label={<LanguageConfig id="roomplan.isalldaysinweek" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value?localFields[newConstants.IS_SUNDAY].value=true:localFields[newConstants.IS_SUNDAY].value}
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
                    label={<LanguageConfig id="roomplan.sunday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value?localFields[newConstants.IS_MONDAY].value=true:localFields[newConstants.IS_MONDAY].value}
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
                    label={<LanguageConfig id="roomplan.monday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value?localFields[newConstants.IS_TUESDAY].value=true:localFields[newConstants.IS_TUESDAY].value}
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
                    label={<LanguageConfig id="roomplan.tuesday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value?localFields[newConstants.IS_WEDNESDAY].value=true:localFields[newConstants.IS_WEDNESDAY].value}
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
                    label={<LanguageConfig id="roomplan.wednesday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value?localFields[newConstants.IS_THURSDAY].value=true:localFields[newConstants.IS_THURSDAY].value}
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
                    label={<LanguageConfig id="roomplan.thursday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value?localFields[newConstants.IS_FRIDAY].value=true:localFields[newConstants.IS_FRIDAY].value}
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
                    label={<LanguageConfig id="roomplan.friday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value?localFields[newConstants.IS_SATURDAY].value=true:localFields[newConstants.IS_SATURDAY].value}
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
                    label={<LanguageConfig id="roomplan.saturday" />}
                  />
                </Column>
              </Row>
              <Column>
                <RoomPlanAmenityLinks
                  roomamenity={roomamenity}
                  amenityLinks={amenityLinks}
                  classes={classes}
                  multiStateUpdater={multiStateUpdater}
                  addMulti={addMulti}
                  removeMulti={removeMulti}
                />
              </Column>
              <Column md={12}>                
                <Card padding={[5]}>
                  <Row>
                    <Column md={12} padding={[5, 5]}>
                     <Text size={14} bold>Tax Price</Text>
                     </Column> 
                    <Column md={3} padding={[5, 5]}>
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
                    <Column md={3} padding={[5, 5]}>
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
                    <Column md={3} padding={[5, 5]}>
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
                    <Column md={3} padding={[5, 5]}>
                      <RoomPriceComments
                        label={"price comments"}
                        name={newConstants.PRICE_COMMENTS_KEY}
                        value={localFields[newConstants.PRICE_COMMENTS_KEY].value}
                        isDisabled={localFields[newConstants.IS_PAX_WISE].value==true?true:false}
                        onChange={stateUpdater}
                        error={
                          localFields[newConstants.PRICE_COMMENTS_KEY].error
                        }
                        helperText={localFields[newConstants.PRICE_COMMENTS_KEY].err_msg}
                        required={localFields[newConstants.PRICE_COMMENTS_KEY].is_require}
                      />
                    </Column>
                  </Row>
                  <Business localFields={localFields} amenityCharge={amenityCharge} stateUpdater={stateUpdater} />
                  <Customer localFields={localFields} amenityCharge={amenityCharge} stateUpdater={stateUpdater} />
                </Card>
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
                    label={<LanguageConfig id="roomplan.isactive" />}
                  />
                </Column>
              ) : null}
              <Row>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields[newConstants.IS_PAX_WISE].value}
                        color="primary"
                        onChange={() => {
                          setLocalFields({
                            ...localFields,
                            [newConstants.IS_PAX_WISE]: {
                              ...localFields[newConstants.IS_PAX_WISE],
                              value: !localFields[newConstants.IS_PAX_WISE].value,
                            },
                          })
                          if (localFields[newConstants.IS_PAX_WISE].value == false) {
                            generateJson()
                          }
                        }
                        }
                        name={newConstants.IS_PAX_WISE}
                      />
                    }
                    label={"Is paxwise"}
                  />
                </Column>
              </Row>
              {localFields[newConstants.IS_PAX_WISE].value == true && genetatedFields.length > 0 &&
                <Column>
                  <Row margin={[10, 0, 0, 0]}>
                    <GeneratedResult
                      basic={genetatedFields}
                      multiStateUpdater={multiStateUpdater}
                      classes={classes}
                    />

                  </Row>
                </Column>
              }              
              <Column>
                <RoomPlanCancelPolicyRules
                  cancelPolicyRules={cancelPolicyRules}
                  classes={classes}
                  multiStateUpdater={multiStateUpdater}
                  addMulti={addMulti}
                  removeMulti={removeMulti}
                />
              </Column>
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
                            <LanguageConfig id={editData ? "roomplan.update" : "Save"} />
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
                        {<LanguageConfig id="roomplan.cancel" />}
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



const GeneratedResult = ({ basic, multiStateUpdater, classes }) => {
  return (
    <Row>
      <Column>
        <Paper style={{ width: "100%" }}>
          <TableContainer className={classes.TableContain}>
            <Table className={classes.table} >
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell className={classes.tableHeadTuple} >Pax adult</TableCell>
                  <TableCell className={classes.tableHeadTuple} >Pax child</TableCell>
                  <TableCell className={classes.tableHeadTuple} >B2B net value</TableCell>
                  <TableCell className={classes.tableHeadTuple} >B2C net value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {basic.map((basic, index) => (
                  <TableRow>
                    <TableCell className={classes.tableBodyTuple}>
                      <TextField
                        style={{ minWidth: "100px" }}
                        value={basic[newConstants.PAX_ADULT].value}
                        name={newConstants.PAX_ADULT}
                        error={basic[newConstants.PAX_ADULT].error}
                        onChange={(e) => multiStateUpdater(e, index, 'list')}
                        helperText={
                          basic[newConstants.PAX_ADULT].err_msg
                        }
                        required={basic[newConstants.PAX_ADULT].is_require}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyTuple}>
                      <TextField
                        style={{ minWidth: "100px" }}
                        value={basic[newConstants.PAX_CHILD].value}
                        name={newConstants.PAX_CHILD}
                        error={basic[newConstants.PAX_CHILD].error}
                        onChange={(e) => multiStateUpdater(e, index, 'list')}
                        helperText={
                          basic[newConstants.PAX_CHILD].err_msg
                        }
                        required={basic[newConstants.PAX_CHILD].is_require}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyTuple}>
                      <TextField
                        style={{ minWidth: "100px" }}
                        type="number"
                        value={basic["b2b-net-value"].value}
                        name={["b2b-net-value"]}
                        error={basic["b2b-net-value"].error}
                        onChange={(e) => multiStateUpdater(e, index, 'list')}
                        helperText={
                          basic["b2b-net-value"].err_msg
                        }
                        required={basic["b2b-net-value"].is_require}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyTuple}>
                      <TextField
                        style={{ minWidth: "100px" }}
                        value={basic["b2c-net-value"].value}
                        name={["b2c-net-value"]}
                        error={basic["b2c-net-value"].error}
                        onChange={(e) => multiStateUpdater(e, index, 'list')}
                        helperText={
                          basic["b2c-net-value"].err_msg
                        }
                        required={basic["b2c-net-value"].is_require}
                      />
                    </TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Column>
    </Row>
  )
}


const RoomAmenity = ({ name, value, onChange, error, helperText, label, roomamenity }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  console.log(roomamenity)

  useEffect(() => {
    setDefaultOptions(roomamenity.map((v) => ({
            value: v[newConstants.HOTEL_AMENITY_KEY],
            label: v[newConstants.HOTEL_ROOM_AMENITY_NAME],
          })))
  }, [roomamenity]);


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


const TypeRates = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([
    { value: 'P', label: 'Percentage' },
    { value: 'F', label: 'flat-rate' }
  ]);

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


const RoomName = ({ name, value, onChange, error, helperText, label, room ,isDisabled}) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  useEffect(() => {
    setDefaultOptions(
      room.map((v) => ({
        value: v[newConstants.ROOM_KEY],
        label: v[newConstants.ROOM_NAME],
      }))
    )
  }, [room,value]);
 


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

const HotelName = ({ name, value, onChange, error, helperText, label ,isDisabled}) => {
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
    const res = await httpPostRequest(hotelMasterGet(inputValue));
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
      isDisabled={isDisabled}
      loadOptions={loadHotel}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};


const RoomPlanAmenityLinks = ({ amenityLinks, classes, multiStateUpdater, addMulti, removeMulti, roomamenity }) => {
  return (
    <Row margin={[10, 0]}>
      <Column padding={[5, 0]}>
        <Text size={14} bold><LanguageConfig id="roomplan.roomplanamenitylinks" /></Text>
      </Column>
      <Card padding={[10]} className={classes.box}>
        {amenityLinks.map((value, index) => (
          <Column>
            <Row>
              <Column md={3} padding={[5]}>
                <RoomAmenity
                  roomamenity={roomamenity.filter(f=> f[newConstants.HOTEL_AMENITY_KEY] == value[newConstants.ROOM_AMENITY_KEY].value || !(amenityLinks.map(v=>v[newConstants.ROOM_AMENITY_KEY].value).includes(f[newConstants.HOTEL_AMENITY_KEY])))}
                  name={newConstants.ROOM_AMENITY_KEY}
                  value={value[newConstants.ROOM_AMENITY_KEY].value}
                  onChange={(e) => multiStateUpdater(e, index, 'amenity')}
                  error={value[newConstants.ROOM_AMENITY_KEY].error && value[newConstants.ROOM_AMENITY_KEY].is_require}
                  helperText={
                    value[newConstants.ROOM_AMENITY_KEY].error && value[newConstants.ROOM_AMENITY_KEY].is_require
                      ? value[newConstants.ROOM_AMENITY_KEY].err_msg
                      : ''
                  }
                  label={"Room amenity name"}
                />
              </Column>

              <Column md={3} padding={[5]}>
                <TextField
                  type="number"
                  inputProps={{ min: 0 }}
                  label={<LanguageConfig id="roomplan.roomamenityprice" />}
                  value={value[newConstants.ROOM_AMENITY_PRICE].value}
                  name={newConstants.ROOM_AMENITY_PRICE}
                  error={value[newConstants.ROOM_AMENITY_PRICE].error}
                  onChange={(e) => multiStateUpdater(e, index, 'amenity')}
                  helperText={value[newConstants.ROOM_AMENITY_PRICE].err_msg}
                  required={value[newConstants.ROOM_AMENITY_PRICE].is_require}
                />
              </Column>
              <Column md={2} padding={[5]} center middle>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value[newConstants.IS_SHOW].value}
                      value={value[newConstants.IS_SHOW].value}
                      color="primary"
                      onChange={(e) => multiStateUpdater(e, index, 'amenity_check')}
                      name={newConstants.IS_SHOW}
                    />
                  }
                  label={"Show on listing"}
                />
              </Column>
              <Column
                md={amenityLinks.length > 1 && amenityLinks.length - 1 == index ? 4 : 4}
                xs={amenityLinks.length > 1 && amenityLinks.length - 1 == index ? 12 :12}
                sm={amenityLinks.length > 1 && amenityLinks.length - 1 == index ? 12 : 12}>
                <Row className={classes.endPadd}>
                  {amenityLinks.length > 1 ? (
                    <Button
                      onClick={() => removeMulti(index, 'amenity')}
                      className={classes.addEdit}
                      size="small"
                      variant="contained"
                      color="primary">
                      <Remove />
                    </Button>
                  ) : null}
                  {amenityLinks.length - 1 == index ? amenityLinks.length < roomamenity.length && (                    
                    <Button className={classes.addMulti} onClick={() => addMulti('amenity')} size="small" variant="contained" color="primary">
                      <Add />
                    </Button>
                  ) : null}
                </Row>
              </Column>
            </Row>
          </Column>
        ))}
      </Card>
    </Row>
  );
};

const RefundType = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);
  useEffect(() => {
    refundByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadRefundType();
  }, []);

  const refundByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getAllRefundTypes(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.REFUND_TYPE_DESC],
          value: res[newConstants.DATA][newConstants.REFUND_TYPE_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadRefundType = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllRefundTypes(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.REFUND_TYPES].map((v) => ({
            value: v[newConstants.REFUND_TYPE_KEY],
            label: v[newConstants.REFUND_TYPE_DESC],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.REFUND_TYPES].map((v) => ({
            value: v[newConstants.REFUND_TYPE_KEY],
            label: v[newConstants.REFUND_TYPE_DESC],
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
      loadOptions={loadRefundType}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const RoomPlanRefund = ({ cancelPolicies, index, classes, multiStateUpdater, addMulti, removeMulti }) => {
  return (
    <Row >
      <Column >
        <Text size={14} bold><LanguageConfig id="roomplan.roomplancancelpolicies" /></Text>
      </Column>
      <Card padding={[10]} margin={[5, 0, 0, 0]} className={classes.box}>
        {cancelPolicies.map((value, index_) => (
          <Column >
            <Row>
              <Column md={3} padding={[5]}>
                <RefundType
                  name={newConstants.REFUND_TYPE_KEY}
                  value={value[newConstants.REFUND_TYPE_KEY].value}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index_)}
                  error={value[newConstants.REFUND_TYPE_KEY].error}
                  helperText={
                    value[newConstants.REFUND_TYPE_KEY].error && value[newConstants.REFUND_TYPE_KEY].is_require
                      ? value[newConstants.REFUND_TYPE_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="roomplan.refundtype" />}
                />
              </Column>
              <Column md={3} padding={[5]}>
                <TextField
                  type="number"
                  inputProps={{ min: 1 }}
                  label={<LanguageConfig id="roomplan.daysbeforecheckin" />}
                  name={newConstants.DAYS_BEFORE_CHECK_IN}
                  value={value[newConstants.DAYS_BEFORE_CHECK_IN].value}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index_)}
                  error={
                    value[newConstants.DAYS_BEFORE_CHECK_IN].error
                  }
                  helperText={value[newConstants.DAYS_BEFORE_CHECK_IN].err_msg}
                  required={value[newConstants.DAYS_BEFORE_CHECK_IN].is_require}
                />
              </Column>
              <Column md={3} padding={[5]}>
                <TextField
                  type="number"
                  inputProps={{ min: 0 }}
                  disabled={value[newConstants.REFUND_TYPE_KEY].value != "lD//MiYRL5bDFRUWn62iTKPiTxHVPNgoxmBntbkJgu8=" ? false : true}
                  label={<LanguageConfig id="roomplan.cancelationvalue" />}
                  value={value[newConstants.CANCELATION_VALUE].value}
                  name={newConstants.CANCELATION_VALUE}
                  error={value[newConstants.CANCELATION_VALUE].error}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index_)}
                  helperText={value[newConstants.CANCELATION_VALUE].err_msg}
                  required={value[newConstants.CANCELATION_VALUE].is_require}
                />
              </Column>
              <Column
                md={cancelPolicies.length > 1 && cancelPolicies.length - 1 == index_ ? 3 : 3}
                xs={cancelPolicies.length > 1 && cancelPolicies.length - 1 == index_ ? 7 : 3}
                sm={cancelPolicies.length > 1 && cancelPolicies.length - 1 == index_ ? 7 : 3}>
                <Row className={classes.endPadd}>
                  {cancelPolicies.length > 1 ? (
                    <Button
                      onClick={() => removeMulti(index, 'cancel_rules', index_)}
                      className={classes.addEdit}
                      size="small"
                      variant="contained"
                      color="primary">
                      <Remove />
                    </Button>
                  ) : null}
                  {cancelPolicies.length - 1 == index_ ? (
                    <Button className={classes.addMulti} onClick={() => addMulti('cancel_rules', index)} size="small" variant="contained" color="primary">
                      <Add />
                    </Button>
                  ) : null}
                </Row>
              </Column>
            </Row>
          </Column>
        ))}
      </Card>
    </Row>
  );
};

const RoomPlanCancelPolicyRules = ({ cancelPolicyRules, classes, multiStateUpdater, addMulti, removeMulti }) => {
  return (
    <Row margin={[10, 5]}>
      <Column padding={[5, 0]}>
        <Text size={14} bold><LanguageConfig id="roomplan.roomplancancelpolicyrules" /> </Text>
      </Column>
      {cancelPolicyRules.map((value, index) => (
        <Column padding={[5]} key={'cancel_rules_' + index}>
          <Card padding={[10]} className={classes.box}>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="roomplan.roomcancelrulename" />}
                  value={value[newConstants.ROOM_CANCEL_RULE_NAME].value}
                  name={newConstants.ROOM_CANCEL_RULE_NAME}
                  error={value[newConstants.ROOM_CANCEL_RULE_NAME].error}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules')}
                  helperText={
                    value[newConstants.ROOM_CANCEL_RULE_NAME].err_msg
                  }
                  required={value[newConstants.ROOM_CANCEL_RULE_NAME].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 5]} style={{ placeContent: "center" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value[newConstants.IS_DATE_RANGE].value}
                      value={value[newConstants.IS_DATE_RANGE].value}
                      color="primary"
                      onChange={(e) => multiStateUpdater(e, index, 'cancel_rules_check')}
                      name={newConstants.IS_DATE_RANGE}
                    />
                  }
                  label={<LanguageConfig id="roomplan.isdaterange" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="date"
                  label={<LanguageConfig id="roomplan.effectivefrom" />}
                  InputLabelProps={{ shrink: true }}
                  value={value[newConstants.IS_DATE_RANGE].value == true ? value[newConstants.EFFECTIVE_FROM].value : value[newConstants.EFFECTIVE_FROM].value = ""}
                  name={newConstants.EFFECTIVE_FROM}
                  disabled={value[newConstants.IS_DATE_RANGE].value == true ? false : true}
                  error={value[newConstants.EFFECTIVE_FROM].error}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules')}
                  helperText={
                    value[newConstants.EFFECTIVE_FROM].err_msg
                  }
                  required={value[newConstants.EFFECTIVE_FROM].is_require}
                />
              </Column>

              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="date"
                  label={<LanguageConfig id="roomplan.effectiveto" />}
                  InputLabelProps={{ shrink: true }}
                  value={value[newConstants.IS_DATE_RANGE].value == true ? value[newConstants.EFFECTIVE_TO].value : value[newConstants.EFFECTIVE_TO].value = ""}
                  name={newConstants.EFFECTIVE_TO}
                  disabled={value[newConstants.IS_DATE_RANGE].value == true ? false : true}
                  error={value[newConstants.EFFECTIVE_TO].error}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules')}
                  helperText={
                    value[newConstants.EFFECTIVE_TO].err_msg
                  }
                  required={value[newConstants.EFFECTIVE_TO].is_require}
                />
              </Column>
              <Column padding={[0, 7]}>
                <RoomPlanRefund
                  index={index}
                  cancelPolicies={value[newConstants.ROOM_PLAN_CANCEL_POLICIES].value}
                  classes={classes}
                  multiStateUpdater={multiStateUpdater}
                  addMulti={addMulti}
                  removeMulti={removeMulti}
                />
              </Column>
              <Column
                md={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index ? 6 : 9}
                xs={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index ? 5 : 9}
                sm={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index ? 5 : 9}></Column>
              <Column
                md={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index ? 6 : 3}
                xs={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index ? 7 : 3}
                sm={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index ? 7 : 3}>
                <Row className={classes.endPadd}>
                  {cancelPolicyRules.length > 1 ? (
                    <Button
                      onClick={() => removeMulti(index, 'cancel_rules')}
                      className={classes.addEdit}
                      size="small"
                      variant="contained"
                      color="primary">
                      <Remove />
                    </Button>
                  ) : null}
                  {cancelPolicyRules.length - 1 == index ? (
                    <Button className={classes.addMulti} onClick={() => addMulti('cancel_rules')} size="small" variant="contained" color="primary">
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

const LanguageContainer = ({ classes, multi_language, languageStateUpdater,languages ,copylanguages}) => {

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
                            <Text>{languages.filter(f=>f.value==val[newConstants.LANG_CODE].value).length?languages.filter(f=>f.value==val[newConstants.LANG_CODE].value)[0].label:
                            copylanguages.filter(f=>f.value==val[newConstants.LANG_CODE].value)[0].label
                            }</Text>
                            </TableCell>
                            <TableCell className={classes.tableBodyTuple}>
                              <TextField
                                label={"room plan name"}
                                type="text"
                                value={val[newConstants.ROOM_PLAN_NAME].value}
                                name={newConstants.ROOM_PLAN_NAME}
                                error={val[newConstants.ROOM_PLAN_NAME].error}
                                onChange={(e) => languageStateUpdater(e, index,"lang")}
                                helperText={val[newConstants.ROOM_PLAN_NAME].err_msg}
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

const RoomPriceComments = ({ name, value, onChange, error, helperText, label ,isDisabled}) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);
  useEffect(() => {
    RoomByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadHotel();
  }, []);

  const RoomByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(RoomPriceInfoById(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.ROOM_PRICE_COMMENTS_TITLE],
          value: res[newConstants.DATA][newConstants.ROOM_PRICE_COMMENTS_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadHotel = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getRoomPriceY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.ROOM_PRICE_COMMENTS].map((v) => ({
            value: v[newConstants.ROOM_PRICE_COMMENTS_KEY],
            label: v[newConstants.ROOM_PRICE_COMMENTS_TITLE]
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.ROOM_PRICE_COMMENTS].map((v) => ({
            value: v[newConstants.ROOM_PRICE_COMMENTS_KEY],
            label: v[newConstants.ROOM_PRICE_COMMENTS_TITLE]
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
      isDisabled={isDisabled}
      loadOptions={loadHotel}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};



const Business = ({ localFields, stateUpdater ,amenityCharge}) => {
  const classes = useStyles()

  return (
    <Row padding={[3]}>
      <Paper style={{ width: "100%" }}>
        <TableContainer className={classes.TableContain}>
          <Table className={classes.table} >
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableHeadTuple} scope="row" align="center" colSpan={6} rowSpan={2}>B2B</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    label={"tax"}
                    type="number"
                    inputProps={{ min: 0 }}
                    name={"b2b-tax-value"}
                    value={localFields["b2b-tax-value"].value}
                    onChange={stateUpdater}
                    error={
                      localFields["b2b-tax-value"].error
                    }
                    helperText={localFields["b2b-tax-value"].err_msg}
                    required={localFields["b2b-tax-value"].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"service"}
                    name={["b2b-service-value"]}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={localFields["b2b-service-value"].value}
                    onChange={stateUpdater}
                    error={
                      localFields["b2b-service-value"].error
                    }
                    helperText={localFields["b2b-service-value"].err_msg}
                    required={localFields["b2b-service-value"].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"additional"}
                    name={["b2b-additional-value"]}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={localFields["b2b-additional-value"].value}
                    onChange={stateUpdater}
                    error={
                      localFields["b2b-additional-value"].error
                    }
                    helperText={localFields["b2b-additional-value"].err_msg}
                    required={localFields["b2b-additional-value"].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"amenity"}
                    name={["b2b-amenity-value"]}
                    type="number"
                    inputProps={{ min: 0 }}
                    // value={amenityCharge}
                    disabled
                    value={localFields["b2b-amenity-value"].value=amenityCharge ? amenityCharge : ''}
                    onChange={stateUpdater}
                    error={
                      localFields["b2b-amenity-value"].error
                    }
                    helperText={localFields["b2b-amenity-value"].err_msg}
                    required={localFields["b2b-amenity-value"].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={" rate"}
                    name={["b2b-net-value"]}
                    type="number"
                    inputProps={{ min: 0 }}
                    disabled={localFields[newConstants.IS_PAX_WISE].value==true?true:false}
                    value={localFields["b2b-net-value"].value}
                    onChange={stateUpdater}
                    error={
                      localFields["b2b-net-value"].error
                    }
                    helperText={localFields["b2b-net-value"].err_msg}
                    required={localFields["b2b-net-value"].is_require}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Row>
  )
}





const Customer = ({ localFields, stateUpdater ,amenityCharge}) => {
  const classes = useStyles()

  return (
    <Row padding={[3]}>
      <Paper style={{ width: "100%" }}>
        <TableContainer className={classes.TableContain}>
          <Table className={classes.table} >
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableHeadTuple} scope="row" align="center" colSpan={6} rowSpan={2}>B2C</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    label={"tax"}
                    type="number"
                    name={"b2c-tax-value"}
                    inputProps={{ min: 0 }}
                    value={localFields["b2c-tax-value"].value}
                    onChange={stateUpdater}
                    error={
                      localFields["b2c-tax-value"].error
                    }
                    helperText={localFields["b2c-tax-value"].err_msg}
                    required={localFields["b2c-tax-value"].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"service"}
                    name={["b2c-service-value"]}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={localFields["b2c-service-value"].value}
                    onChange={stateUpdater}
                    error={
                      localFields["b2c-service-value"].error
                    }
                    helperText={localFields["b2c-service-value"].err_msg}
                    required={localFields["b2c-service-value"].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"additional"}
                    name={["b2c-additional-value"]}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={localFields["b2c-additional-value"].value}
                    onChange={stateUpdater}
                    error={
                      localFields["b2c-additional-value"].error
                    }
                    helperText={localFields["b2c-additional-value"].err_msg}
                    required={localFields["b2c-additional-value"].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"amenity"}
                    name={["b2c-amenity-value"]}
                    type="number"
                    inputProps={{ min: 0 }}
                    // value={amenityCharge}
                    disabled
                    value={localFields["b2c-amenity-value"].value=amenityCharge ? amenityCharge : ''}
                    onChange={stateUpdater}
                    error={
                      localFields["b2c-amenity-value"].error
                    }
                    helperText={localFields["b2c-amenity-value"].err_msg}
                    required={localFields["b2c-amenity-value"].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={" rate"}
                    name={["b2c-net-value"]}
                    type="number"
                    disabled={localFields[newConstants.IS_PAX_WISE].value==true?true:false}
                    inputProps={{ min: 0 }}
                    value={localFields["b2c-net-value"].value}
                    onChange={stateUpdater}
                    error={
                      localFields["b2c-net-value"].error
                    }
                    helperText={localFields["b2c-net-value"].err_msg}
                    required={localFields["b2c-net-value"].is_require}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Row>
  )
}