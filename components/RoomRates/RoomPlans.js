import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from '../../../core';
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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Create, Delete, Add, Remove, Edit } from '@material-ui/icons';
import { useStore } from '../../../helper/Store';
import { validator, httpPostRequest ,getDateYYYYMMDD} from '../../../helper/JsHelper';
import {
  generateRoomPlan,
  hotelMasterGetId,
  hotelMasterGetY,
  getAllRoomsY,
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
} from '../../../helper/RequestPayLoad';
import { constants, newConstants } from '../../../helper/constants';
var FA = require('react-fontawesome');
import LanguageConfig from "../../../helper/LanguageConfig";
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
  Languageheadernow: {fontSize: '35px', marginBottom: '20px',},
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
  const { languages, setAlertMsg ,copylanguages} = useStore();

  return (
    <div>
        <Column>
            <h3 className={classes.Languageheadernow}>Hotel Management</h3>
        </Column>
      <Card margin={[0,0,10,0]}>
     <Fade >
          <EditContainer
            languages={languages}
            setAlertMsg={setAlertMsg}
            classes={classes}
            copylanguages={copylanguages}
          />
        </Fade>
    
      </Card>
      </div>
  );
}

const EditContainer = ({ classes,languages, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [amenityLinks, setAmenityLinks] = useState([]);
  const [roomamenity, setRoomAmenity] = useState([])
  const [cancelPolicyRules, setCancelPolicyRules] = useState([]);
  const [loader, setLoader] = useState(false);
  const [genetatedFields, setGenetatedFields] = useState([])
  const [hotelname, setHotelname] = useState("")
  const [roomname, setRoomname] = useState("")
  const [room, setRoom] = useState([])
  const [amenityCharge,setAmenityCharge] = useState(0)

  useEffect(() => {
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
        [newConstants.B2B_TAX_VALUE]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.B2B_SERVICE_VALUE]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.B2B_ADDITIONAL_VALUE]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.B2B_AMENITY_VALUE]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.B2B_NET_VALUE]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.B2C_TAX_VALUE]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.B2C_SERVICE_VALUE]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.B2C_ADDITIONAL_VALUE]: {
          value: "",
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.B2C_AMENITY_VALUE]: {
          value: "",
          is_require: false,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.B2C_NET_VALUE]: {
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
          value: true,
          is_require: true,
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
          is_require: true,
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
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_TUESDAY]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_WEDNESDAY]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_THURSDAY]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_FRIDAY]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_SATURDAY]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
      });      
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
    
  }, []);

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
        [newConstants.B2B_NET_VALUE]: {
          value: value[newConstants.B2B_NET_VALUE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.B2C_NET_VALUE]: {
          value: value[newConstants.B2C_NET_VALUE],
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
    if (flag) {
      setLoader(true);
      
        let res = await httpPostRequest(createRoomPlan(localFields, amenityLinks, cancelPolicyRules, localFields[newConstants.IS_PAX_WISE].value == true ? genetatedFields : []));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg});
          setLoader(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:res[constants.DATA_EXCEPTION].err_msg });
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
              <Row>
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
                    label={<LanguageConfig id="roomplan.sunday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
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
                    label={<LanguageConfig id="roomplan.monday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
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
                    label={<LanguageConfig id="roomplan.tuesday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
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
                    label={<LanguageConfig id="roomplan.wednesday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
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
                    label={<LanguageConfig id="roomplan.thursday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
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
                    label={<LanguageConfig id="roomplan.friday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
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
                            <LanguageConfig id={ "Save"} />
                          </Column>
                        </Row>
                      </Button>
                      <Button
                        // onClick={() => {
                        //   setAddEdit(false);
                        //   setEditData(null);
                        // }}
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
                        value={basic[newConstants.B2B_NET_VALUE].value}
                        name={[newConstants.B2B_NET_VALUE]}
                        error={basic[newConstants.B2B_NET_VALUE].error}
                        onChange={(e) => multiStateUpdater(e, index, 'list')}
                        helperText={
                          basic[newConstants.B2B_NET_VALUE].err_msg
                        }
                        required={basic[newConstants.B2B_NET_VALUE].is_require}
                      />
                    </TableCell>
                    <TableCell className={classes.tableBodyTuple}>
                      <TextField
                        style={{ minWidth: "100px" }}
                        value={basic[newConstants.B2C_NET_VALUE].value}
                        name={[newConstants.B2C_NET_VALUE]}
                        error={basic[newConstants.B2C_NET_VALUE].error}
                        onChange={(e) => multiStateUpdater(e, index, 'list')}
                        helperText={
                          basic[newConstants.B2C_NET_VALUE].err_msg
                        }
                        required={basic[newConstants.B2C_NET_VALUE].is_require}
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

const loadRoomAmenity = async (inputValue = "", callback = null) => {
    callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))
  }

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      loadOptions={loadRoomAmenity}
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

  const loadRates = async (inputValue = "", callback = null) => {
    callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))
  }
  
  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
      name={name}
      loadOptions={loadRates}
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
 
const loadRoomName = async (inputValue = "", callback = null) => {
    callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))
  }

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
      loadOptions={loadRoomName}
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
    console.log(res)
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
                    name={newConstants.B2B_TAX_VALUE}
                    value={localFields[newConstants.B2B_TAX_VALUE].value}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.B2B_TAX_VALUE].error
                    }
                    helperText={localFields[newConstants.B2B_TAX_VALUE].err_msg}
                    required={localFields[newConstants.B2B_TAX_VALUE].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"service"}
                    name={[newConstants.B2B_SERVICE_VALUE]}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={localFields[newConstants.B2B_SERVICE_VALUE].value}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.B2B_SERVICE_VALUE].error
                    }
                    helperText={localFields[newConstants.B2B_SERVICE_VALUE].err_msg}
                    required={localFields[newConstants.B2B_SERVICE_VALUE].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"additional"}
                    name={[newConstants.B2B_ADDITIONAL_VALUE]}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={localFields[newConstants.B2B_ADDITIONAL_VALUE].value}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.B2B_ADDITIONAL_VALUE].error
                    }
                    helperText={localFields[newConstants.B2B_ADDITIONAL_VALUE].err_msg}
                    required={localFields[newConstants.B2B_ADDITIONAL_VALUE].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"amenity"}
                    name={[newConstants.B2B_AMENITY_VALUE]}
                    type="number"
                    inputProps={{ min: 0 }}
                    // value={amenityCharge}
                    disabled
                    value={localFields[newConstants.B2B_AMENITY_VALUE].value=amenityCharge}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.B2B_AMENITY_VALUE].error
                    }
                    helperText={localFields[newConstants.B2B_AMENITY_VALUE].err_msg}
                    required={localFields[newConstants.B2B_AMENITY_VALUE].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={" rate"}
                    name={[newConstants.B2B_NET_VALUE]}
                    type="number"
                    inputProps={{ min: 0 }}
                    disabled={localFields[newConstants.IS_PAX_WISE].value==true?true:false}
                    value={localFields[newConstants.B2B_NET_VALUE].value}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.B2B_NET_VALUE].error
                    }
                    helperText={localFields[newConstants.B2B_NET_VALUE].err_msg}
                    required={localFields[newConstants.B2B_NET_VALUE].is_require}
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
                    name={newConstants.B2C_TAX_VALUE}
                    inputProps={{ min: 0 }}
                    value={localFields[newConstants.B2C_TAX_VALUE].value}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.B2C_TAX_VALUE].error
                    }
                    helperText={localFields[newConstants.B2C_TAX_VALUE].err_msg}
                    required={localFields[newConstants.B2C_TAX_VALUE].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"service"}
                    name={[newConstants.B2C_SERVICE_VALUE]}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={localFields[newConstants.B2C_SERVICE_VALUE].value}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.B2C_SERVICE_VALUE].error
                    }
                    helperText={localFields[newConstants.B2C_SERVICE_VALUE].err_msg}
                    required={localFields[newConstants.B2C_SERVICE_VALUE].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"additional"}
                    name={[newConstants.B2C_ADDITIONAL_VALUE]}
                    type="number"
                    inputProps={{ min: 0 }}
                    value={localFields[newConstants.B2C_ADDITIONAL_VALUE].value}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.B2C_ADDITIONAL_VALUE].error
                    }
                    helperText={localFields[newConstants.B2C_ADDITIONAL_VALUE].err_msg}
                    required={localFields[newConstants.B2C_ADDITIONAL_VALUE].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={"amenity"}
                    name={[newConstants.B2C_AMENITY_VALUE]}
                    type="number"
                    inputProps={{ min: 0 }}
                    // value={amenityCharge}
                    disabled
                    value={localFields[newConstants.B2C_AMENITY_VALUE].value=amenityCharge}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.B2C_AMENITY_VALUE].error
                    }
                    helperText={localFields[newConstants.B2C_AMENITY_VALUE].err_msg}
                    required={localFields[newConstants.B2C_AMENITY_VALUE].is_require}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    label={" rate"}
                    name={[newConstants.B2C_NET_VALUE]}
                    type="number"
                    disabled={localFields[newConstants.IS_PAX_WISE].value==true?true:false}
                    inputProps={{ min: 0 }}
                    value={localFields[newConstants.B2C_NET_VALUE].value}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.B2C_NET_VALUE].error
                    }
                    helperText={localFields[newConstants.B2C_NET_VALUE].err_msg}
                    required={localFields[newConstants.B2C_NET_VALUE].is_require}
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