import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Text,
  TextField,
  Card,
  Row,
  Column,
  Loader,
  CustomAlert,
  SingelSelectOnDemand,
  DemandDropDown,
  ModalComponent
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
import { useStore } from '../../../helper/Store';
import { validator, httpPostRequest, getDateYYYYMMDD } from '../../../helper/JsHelper';
import {
  generateRoomPlan,
  hotelMasterGetId,
  hotelMasterGetY,
  getAllRefundTypes,
  RoomPriceInfoById,
  GetRoomByHotelKey,
  getRoomPriceY,
  getHotelRoomLinkByKey
} from '../../../helper/RequestPayLoad';
import { constants, newConstants } from '../../../helper/constants';
var FA = require('react-fontawesome');
import LanguageConfig from "../../../helper/LanguageConfig";
import { typeParameterInstantiation } from '@babel/types';
import RoomComments from "./RoomComments"

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
  RoomAmenityButton: { fontWeight: '700', width: "71%" },
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
  Languageheadernow: { fontSize: '20px', marginBottom: '11px', },
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

export default function Setup({ storeAmenity,globalState,index }) {
  const classes = useStyles();
  const { languages, setAlertMsg, copylanguages } = useStore();

  return (
    <div>
      <Column>
        <h3 className={classes.Languageheadernow}>Room Plans</h3>
      </Column>
      <Card margin={[0, 0, 10, 0]}>
        <Fade >
          <EditContainer
            languages={languages}
            setAlertMsg={setAlertMsg}
            classes={classes}
            copylanguages={copylanguages}
            storeAmenity={storeAmenity}
            globalState={globalState}
            index={index}
          />
        </Fade>

      </Card>
    </div>
  );
}

const EditContainer = ({ classes, languages, setAlertMsg, storeAmenity,globalState,index:index_3 }) => {
  const [localFields, setLocalFields] = useState([]);
  const [amenityLinks, setAmenityLinks] = useState([]);
  const [roomamenity, setRoomAmenity] = useState([])
  const [cancelPolicyRules, setCancelPolicyRules] = useState([]);
  const [loader, setLoader] = useState(false);
  const [genetatedFields, setGenetatedFields] = useState([])
  const [hotelname, setHotelname] = useState("")
  const [roomname, setRoomname] = useState("")
  const [room, setRoom] = useState([])
  const [amenityCharge, setAmenityCharge] = useState(0)
  const [wholeField, setWholeField] = useState([])
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [commentsFlag, setCommentflag] = useState(false)

  const loadComments = async () => {
    const res = await httpPostRequest(getRoomPriceY(""));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultOptions(
        res[newConstants.DATA][newConstants.ROOM_PRICE_COMMENTS].map((v) => ({
          value: v[newConstants.ROOM_PRICE_COMMENTS_KEY],
          label: v[newConstants.ROOM_PRICE_COMMENTS_TITLE]
        })),
      );
    }
    else {
      setDefaultOptions([])
    }
  };

  useEffect(()=>{
    globalState(index_3,wholeField)
  },[wholeField])

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
        is_require: false,
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
  }, []);

  const memValue = useMemo(() => {
    setWholeField([{
      localFields, amenityLinks, cancelPolicyRules
    }])
    //clean up function
  }, [localFields, amenityLinks, cancelPolicyRules])

  useEffect(() => {
    let temp = 0;
    wholeField.map((val) =>
      val.amenityLinks.forEach(obj => {
        temp += parseFloat(obj[newConstants.ROOM_AMENITY_PRICE][newConstants.VALUE])
      })
    )
    setAmenityCharge(temp)
  }, [amenityLinks])



  function multiStateUpdater(e, index, tag, index1, index2) {
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
    else if (tag == "whole") {
      let wholeField_ = _.cloneDeep(wholeField);
      if (e.target.value.length == 0) {
        wholeField_[index].localFields[e.target.name].error = wholeField_[index].localFields[e.target.name].is_require ? true : false;
        wholeField_[index].localFields[e.target.name].value = e.target.value;
      } else {
        wholeField_[index].localFields[e.target.name].value = e.target.value;
        wholeField_[index].localFields[e.target.name].error = false;
      }
      setWholeField(wholeField_);
    }
    else if (tag == "whole_check") {
      let wholeField_ = _.cloneDeep(wholeField);
      if (e.target.value == '') {
        wholeField_[index].localFields[e.target.name].error = wholeField_[index].localFields[e.target.name].is_require ? true : false;
        wholeField_[index].localFields[e.target.name].value = e.target.value;
      } else {
        wholeField_[index].localFields[e.target.name].value = e.target.value === 'true' ? false : true;
        wholeField_[index].localFields[e.target.name].error = false;
      }
      setWholeField(wholeField_);
    }
    else if (tag == 'amenity') {
      let wholeField_ = _.cloneDeep(wholeField);
      if (e.target.value.length == 0) {
        wholeField_[index].amenityLinks[index1][e.target.name].error = wholeField_[index].amenityLinks[index1][e.target.name].is_require ? true : false;
        wholeField_[index].amenityLinks[index1][e.target.name].value = e.target.value;
      } else {
        wholeField_[index].amenityLinks[index1][e.target.name].value = e.target.value;
        wholeField_[index].amenityLinks[index1][e.target.name].error = false;
      }
      setWholeField(wholeField_);
    } else if (tag == 'amenity_check') {
      let wholeField_ = _.cloneDeep(wholeField);
      if (e.target.value == '') {
        wholeField_[index].amenityLinks[index1][e.target.name].error = wholeField_[index].amenityLinks[index1][e.target.name].is_require ? true : false;
        wholeField_[index].amenityLinks[index1][e.target.name].value = e.target.value;
      } else {
        wholeField_[index].amenityLinks[index1][e.target.name].value = e.target.value === 'true' ? false : true;
        wholeField_[index].amenityLinks[index1][e.target.name].error = false;
      }
      setWholeField(wholeField_);
    } else if (tag == 'cancel_rules') {
      let wholeField_ = _.cloneDeep(wholeField);
      if (index2 != undefined) {
        if (e.target.value.length == 0) {
          wholeField_[index].cancelPolicyRules[index1][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE][index2][
            e.target.name
          ].error = wholeField_[index].cancelPolicyRules[index1][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE][index2][
            e.target.name
          ].is_require
              ? true
              : false;
          wholeField_[index].cancelPolicyRules[index1][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE][index2][
            e.target.name
          ].value = e.target.value;
        } else {
          wholeField_[index].cancelPolicyRules[index1][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE][index2][
            e.target.name
          ].value = e.target.value;
          wholeField_[index].cancelPolicyRules[index1][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE][index2][
            e.target.name
          ].error = false;
        }
      } else {
        if (e.target.value.length == 0) {
          wholeField_[index].cancelPolicyRules[index1][e.target.name].error = wholeField_[index].cancelPolicyRules[index1][e.target.name].is_require
            ? true
            : false;
          wholeField_[index].cancelPolicyRules[index1][e.target.name].value = e.target.value;
        } else {
          wholeField_[index].cancelPolicyRules[index1][e.target.name].value = e.target.value;
          wholeField_[index].cancelPolicyRules[index1][e.target.name].error = false;
        }
      }
      setWholeField(wholeField_);
    } else if (tag == 'cancel_rules_check') {
      let wholeField_ = _.cloneDeep(wholeField);
      if (e.target.value == '') {
        wholeField_[index].cancelPolicyRules[index1][e.target.name].error = wholeField_[index].cancelPolicyRules[index1][e.target.name].is_require ? true : false;
        wholeField_[index].cancelPolicyRules[index1][e.target.name].value = e.target.value;
      } else {
        wholeField_[index].cancelPolicyRules[index1][e.target.name].value = e.target.value === 'true' ? false : true;
        wholeField_[index].cancelPolicyRules[index1][e.target.name].error = false;
      }
      setWholeField(wholeField_);
    }
  }

  function removeMulti(index_, tag, index1, index2) {
    if (tag == 'whole') {
      let wholeField_ = _.cloneDeep(wholeField);
      if (wholeField_.length > 1) {
        wholeField_ = wholeField_.map((val, index) => (index != index_ ? val : null));
        setWholeField(wholeField_.filter((f) => f != null));
      }
    }
    else if (tag == "amenity") {
      let wholeField_ = _.cloneDeep(wholeField);
      if (index1 != undefined) {
        wholeField_[index_].amenityLinks = wholeField_[index_].amenityLinks.filter((val, index) => index != index1);
        setWholeField(wholeField_.filter((f) => f != null));
      }
    }
    else if (tag == 'cancel_rules') {
      let wholeField_ = _.cloneDeep(wholeField);
      if (
        index2 != undefined && index1 != undefined
      ) {
        wholeField_[index_].cancelPolicyRules[index1][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE] = wholeField_[index_].cancelPolicyRules[index1][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE].filter((val, index) => index != index2);

      }
      else if (index1 != undefined
      ) {
        wholeField_[index_].cancelPolicyRules = wholeField_[index_].cancelPolicyRules.filter((val, index) => index != index1);

      }
      setWholeField(wholeField_.filter((f) => f != null));
    }
  }

  const addMulti = (tag, index, index1) => {
    if (tag == 'amenity') {
      let wholeField_ = _.cloneDeep(wholeField);
      wholeField_[index].amenityLinks.push({
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
      setWholeField(wholeField_);
    } else if (tag == 'cancel_rules') {
      let wholeField_ = _.cloneDeep(wholeField);

      if (index1 != undefined) {
        wholeField_[index].cancelPolicyRules[index1][newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE].push(
          _.cloneDeep(room_plan_cancel_policy),
        );
      } else {
        wholeField_[index].cancelPolicyRules.push(_.cloneDeep(room_plan_cancel_rules));
      }
      setWholeField(wholeField_);
    }
    else if (tag == "whole") {
      let wholeField_ = _.cloneDeep(wholeField)
      wholeField_.push({
        localFields,
        amenityLinks,
        cancelPolicyRules
      })
      setWholeField(wholeField_)
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
    if (hotelname) {
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
      let amenity_ = res[newConstants.DATA][newConstants.HOTEL_ROOM_AMENITY_LINKS].filter(f => !(amenityLinks.map(v => v[newConstants.ROOM_AMENITY_KEY].value).includes(f[newConstants.HOTEL_AMENITY_KEY])))
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


  const generateJson = async (val, index) => {
    let localFields_validation = _.cloneDeep(val);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      let newGenerateFields = wholeField.map(
        (v, index1) => (
          index1 == index ?
            {
              ...wholeField[index], localFields: localFields_validation.values
            }
            : v
        )
      )
      setWholeField(newGenerateFields)
    }
    let flag = !localFields_validation.err
    if (flag) {
      setLoader(true);
      let res = await httpPostRequest(generateRoomPlan(wholeField[index].localFields));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        genereteFields(res[newConstants.DATA])
        setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
        setLoader(false);

      } else {
        val[newConstants.IS_PAX_WISE].value = false
        genereteFields([])
        // setLocalFields(localFields_validation.values)
        setLoader(false);
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    }
    else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="roomplan.fillrequired" /> });
    }
  }


  return (
    <div>
      {localFields.hasOwnProperty([newConstants.ROOM_PLAN_NAME]) ? (

        <Row padding={[10]}>
          {wholeField && wholeField.map((val, index) =>
            <Column>
              <Row>
                <Column md={3} padding={[10, 5]}>
                  <TextField
                    label={<LanguageConfig id="roomplan.roomplanname" />}
                    name={newConstants.ROOM_PLAN_NAME}
                    value={val && val.localFields && val.localFields[newConstants.ROOM_PLAN_NAME] && val.localFields[newConstants.ROOM_PLAN_NAME].value}
                    onChange={(e) => multiStateUpdater(e, index, 'whole')}
                    error={
                      val && val.localFields && val.localFields[newConstants.ROOM_PLAN_NAME] && val.localFields[newConstants.ROOM_PLAN_NAME].error
                    }
                    helperText={val && val.localFields && val.localFields[newConstants.ROOM_PLAN_NAME] && val.localFields[newConstants.ROOM_PLAN_NAME].err_msg}
                    required={val && val.localFields && val.localFields[newConstants.ROOM_PLAN_NAME] && val.localFields[newConstants.ROOM_PLAN_NAME].is_require}
                  />
                </Column>
                <Column md={3} padding={[10, 5]}>
                  <TextField
                    label={"Room allotment"}
                    type="number"
                    inputProps={{ min: 0 }}
                    name={newConstants.ROOM_ALLOTMENT}
                    value={val && val.localFields && val.localFields[newConstants.ROOM_ALLOTMENT] && val.localFields[newConstants.ROOM_ALLOTMENT].value}
                    onChange={(e) => multiStateUpdater(e, index, 'whole')}
                    error={
                      val && val.localFields && val.localFields[newConstants.ROOM_ALLOTMENT] && val.localFields[newConstants.ROOM_ALLOTMENT].error
                    }
                    helperText={val && val.localFields && val.localFields[newConstants.ROOM_ALLOTMENT] && val.localFields[newConstants.ROOM_ALLOTMENT].err_msg}
                    required={val && val.localFields && val.localFields[newConstants.ROOM_ALLOTMENT] && val.localFields[newConstants.ROOM_ALLOTMENT].is_require}
                  />
                </Column>
                <Column md={3} padding={[10, 5]}>
                  <RoomPriceComments
                    label={"price comments"}
                    defaultOptions={defaultOptions}
                    loadComments={loadComments}
                    name={newConstants.PRICE_COMMENTS_KEY}
                    value={val && val.localFields && val.localFields[newConstants.PRICE_COMMENTS_KEY] && val.localFields[newConstants.PRICE_COMMENTS_KEY].value}
                    isDisabled={val && val.localFields && val.localFields[newConstants.PRICE_COMMENTS_KEY] && val.localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
                    onChange={(e) => multiStateUpdater(e, index, 'whole')}
                    error={
                      val && val.localFields && val.localFields[newConstants.PRICE_COMMENTS_KEY] && val.localFields[newConstants.PRICE_COMMENTS_KEY] && val.localFields[newConstants.PRICE_COMMENTS_KEY].error
                    }
                    helperText={val && val.localFields && val.localFields[newConstants.PRICE_COMMENTS_KEY] && val.localFields[newConstants.PRICE_COMMENTS_KEY].err_msg}
                    required={val && val.localFields && val.localFields[newConstants.PRICE_COMMENTS_KEY] && val.localFields[newConstants.PRICE_COMMENTS_KEY].is_require}
                  />
                </Column>
                <Column md={3} xs={3} sm={3} right>
                  <Button variant="outlined" color="primary" className={classes.RoomAmenityButton} onClick={() => setCommentflag(true)}>Add Comments</Button>
                </Column>
                <ModalComponent open={commentsFlag} setOpen={setCommentflag}>
                  <RoomComments commentsFlag={commentsFlag} setCommentflag={setCommentflag} loadComments={loadComments} />
                </ModalComponent>
                <Row>
                  <Column md={4} padding={[10, 20]}>
                    <Text size={14} bold style={{ margin: 10 }}>
                      Available days
                    </Text>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={val && val.localFields && val.localFields[newConstants.IS_ALL_DAYS_IN_WEEK] && val.localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value}
                          value={val && val.localFields && val.localFields[newConstants.IS_ALL_DAYS_IN_WEEK] && val.localFields[newConstants.IS_ALL_DAYS_IN_WEEK].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'whole_check')}
                          name={newConstants.IS_ALL_DAYS_IN_WEEK}
                        />
                      }
                      label={<LanguageConfig id="roomplan.isalldaysinweek" />}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={val && val.localFields && val.localFields[newConstants.IS_SUNDAY] && val.localFields[newConstants.IS_SUNDAY].value}
                          value={val && val.localFields && val.localFields[newConstants.IS_SUNDAY] && val.localFields[newConstants.IS_SUNDAY].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'whole_check')}
                          name={newConstants.IS_SUNDAY}
                        />
                      }
                      label={<LanguageConfig id="roomplan.sunday" />}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={val && val.localFields && val.localFields[newConstants.IS_MONDAY] && val.localFields[newConstants.IS_MONDAY].value}
                          value={val && val.localFields && val.localFields[newConstants.IS_MONDAY] && val.localFields[newConstants.IS_MONDAY].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'whole_check')}
                          name={newConstants.IS_MONDAY}
                        />
                      }
                      label={<LanguageConfig id="roomplan.monday" />}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={val && val.localFields && val.localFields[newConstants.IS_TUESDAY] && val.localFields[newConstants.IS_TUESDAY].value}
                          value={val && val.localFields && val.localFields[newConstants.IS_TUESDAY] && val.localFields[newConstants.IS_TUESDAY].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'whole_check')}
                          name={newConstants.IS_TUESDAY}
                        />
                      }
                      label={<LanguageConfig id="roomplan.tuesday" />}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={val && val.localFields && val.localFields[newConstants.IS_WEDNESDAY] && val.localFields[newConstants.IS_WEDNESDAY].value}
                          value={val && val.localFields && val.localFields[newConstants.IS_WEDNESDAY] && val.localFields[newConstants.IS_WEDNESDAY].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'whole_check')}
                          name={newConstants.IS_WEDNESDAY}
                        />
                      }
                      label={<LanguageConfig id="roomplan.wednesday" />}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={val && val.localFields && val.localFields[newConstants.IS_THURSDAY] && val.localFields[newConstants.IS_THURSDAY].value}
                          value={val && val.localFields && val.localFields[newConstants.IS_THURSDAY] && val.localFields[newConstants.IS_THURSDAY].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'whole_check')}
                          name={newConstants.IS_THURSDAY}
                        />
                      }
                      label={<LanguageConfig id="roomplan.thursday" />}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={val && val.localFields && val.localFields[newConstants.IS_FRIDAY] && val.localFields[newConstants.IS_FRIDAY].value}
                          value={val && val.localFields && val.localFields[newConstants.IS_FRIDAY] && val.localFields[newConstants.IS_FRIDAY].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'whole_check')}
                          name={newConstants.IS_FRIDAY}
                        />
                      }
                      label={<LanguageConfig id="roomplan.friday" />}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={val && val.localFields && val.localFields[newConstants.IS_SATURDAY] && val.localFields[newConstants.IS_SATURDAY].value}
                          value={val && val.localFields && val.localFields[newConstants.IS_SATURDAY] && val.localFields[newConstants.IS_SATURDAY].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'whole_check')}
                          name={newConstants.IS_SATURDAY}
                        />
                      }
                      label={<LanguageConfig id="roomplan.saturday" />}
                    />
                  </Column>
                  <Column md={4} padding={[10, 20]}>
                    <Business localFields={val.localFields} amenityCharge={amenityCharge} multiStateUpdater={multiStateUpdater} index={index} />
                  </Column>
                  <Column md={4} padding={[10, 20]}>
                    <Customer localFields={val.localFields} amenityCharge={amenityCharge} multiStateUpdater={multiStateUpdater} index={index} />
                  </Column>
                </Row>
                <Column>
                  <RoomPlanAmenityLinks
                    storeAmenity={storeAmenity}
                    amenityLinks={val.amenityLinks}
                    index={index}
                    classes={classes}
                    multiStateUpdater={multiStateUpdater}
                    addMulti={addMulti}
                    removeMulti={removeMulti}
                  />
                </Column>
                <Row>
                  <Column md={3} padding={[10, 20]} center>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={val && val.localFields && val.localFields[newConstants.IS_PAX_WISE] && val.localFields[newConstants.IS_PAX_WISE].value}
                          value={val && val.localFields && val.localFields[newConstants.IS_PAX_WISE] && val.localFields[newConstants.IS_PAX_WISE].value}
                          color="primary"
                          onChange={(e) => {
                            multiStateUpdater(e, index, 'whole_check')
                            if (val && val.localFields && val.localFields[newConstants.IS_PAX_WISE] && val.localFields[newConstants.IS_PAX_WISE].value == false) {
                              generateJson(val.localFields, index)
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
                    cancelPolicyRules={val.cancelPolicyRules}
                    classes={classes}
                    index={index}
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
                        {/* <Button
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
                      </Button> */}
                      </Row>
                    </Column>
                  </Row>
                </Column>
              </Row>
              <Row className={classes.endPadd}>
                {wholeField.length > 1 ? (
                  <Button
                    onClick={() => removeMulti(index, 'whole',)}
                    className={classes.addEdit}
                    size="small"
                    variant="contained"
                    color="primary">
                    <Remove />
                  </Button>
                ) : null}
                {wholeField.length - 1 == index ? (
                  <Button className={classes.addMulti} onClick={() => addMulti("whole")} size="small" variant="contained" color="primary">
                    <Add />
                  </Button>
                ) : null}
              </Row>
            </Column>
          )}
          <Row>
          </Row>
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


const RoomAmenity = ({ name, value, onChange, error, helperText, label, storeAmenity }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    setDefaultOptions(storeAmenity.map((v) => ({
      value: v.key,
      label: v.label,
    })))
  }, [storeAmenity]);

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


const RoomName = ({ name, value, onChange, error, helperText, label, room, isDisabled }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  useEffect(() => {
    setDefaultOptions(
      room.map((v) => ({
        value: v[newConstants.ROOM_KEY],
        label: v[newConstants.ROOM_NAME],
      }))
    )
  }, [room, value]);

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

const HotelName = ({ name, value, onChange, error, helperText, label, isDisabled }) => {
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


const RoomPlanAmenityLinks = ({ amenityLinks, classes, multiStateUpdater, addMulti, removeMulti, storeAmenity, index }) => {
  return (
    <Row margin={[10, 0]}>
      <Column padding={[5, 0]}>
        <Text size={14} bold><LanguageConfig id="roomplan.roomplanamenitylinks" /></Text>
      </Column>
      <Card padding={[10]} className={classes.box}>
        {amenityLinks.map((value, index_) => (
          <Column>
            <Row>
              <Column md={3} padding={[5]}>
                <RoomAmenity
                  storeAmenity={storeAmenity}
                  name={newConstants.ROOM_AMENITY_KEY}
                  value={value[newConstants.ROOM_AMENITY_KEY].value}
                  onChange={(e) => multiStateUpdater(e, index, 'amenity', index_)}
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
                  onChange={(e) => multiStateUpdater(e, index, 'amenity', index_)}
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
                      onChange={(e) => multiStateUpdater(e, index, 'amenity_check', index_)}
                      name={newConstants.IS_SHOW}
                    />
                  }
                  label={"Show on listing"}
                />
              </Column>
              <Column
                md={amenityLinks.length > 1 && amenityLinks.length - 1 == index_ ? 4 : 4}
                xs={amenityLinks.length > 1 && amenityLinks.length - 1 == index_ ? 12 : 12}
                sm={amenityLinks.length > 1 && amenityLinks.length - 1 == index_ ? 12 : 12}>
                <Row className={classes.endPadd}>
                  {amenityLinks.length > 1 ? (
                    <Button
                      onClick={() => removeMulti(index, 'amenity', index_)}
                      className={classes.addEdit}
                      size="small"
                      variant="contained"
                      color="primary">
                      <Remove />
                    </Button>
                  ) : null}
                  {amenityLinks.length - 1 == index_ ?
                    amenityLinks.length < storeAmenity.length &&
                    (
                      <Button className={classes.addMulti} onClick={() => addMulti('amenity', index)} size="small" variant="contained" color="primary">
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

const RoomPlanRefund = ({ cancelPolicies, index, classes, multiStateUpdater, addMulti, removeMulti, index1 }) => {
  return (
    <Row >
      <Column >
        <Text size={14} bold><LanguageConfig id="roomplan.roomplancancelpolicies" /></Text>
      </Column>
      <Card padding={[10]} margin={[5, 0, 0, 0]} className={classes.box}>
        {cancelPolicies.map((value, index2) => (
          <Column >
            <Row>
              <Column md={3} padding={[5]}>
                <RefundType
                  name={newConstants.REFUND_TYPE_KEY}
                  value={value[newConstants.REFUND_TYPE_KEY].value}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index1, index2)}
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
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index1, index2)}
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
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index1, index2)}
                  helperText={value[newConstants.CANCELATION_VALUE].err_msg}
                  required={value[newConstants.CANCELATION_VALUE].is_require}
                />
              </Column>
              <Column
                md={cancelPolicies.length > 1 && cancelPolicies.length - 1 == index2 ? 3 : 3}
                xs={cancelPolicies.length > 1 && cancelPolicies.length - 1 == index2 ? 7 : 3}
                sm={cancelPolicies.length > 1 && cancelPolicies.length - 1 == index2 ? 7 : 3}>
                <Row className={classes.endPadd}>
                  {cancelPolicies.length > 1 ? (
                    <Button
                      onClick={() => removeMulti(index, 'cancel_rules', index1, index2)}
                      className={classes.addEdit}
                      size="small"
                      variant="contained"
                      color="primary">
                      <Remove />
                    </Button>
                  ) : null}
                  {cancelPolicies.length - 1 == index2 ? (
                    <Button className={classes.addMulti} onClick={() => addMulti('cancel_rules', index, index1)} size="small" variant="contained" color="primary">
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

const RoomPlanCancelPolicyRules = ({ cancelPolicyRules, classes, multiStateUpdater, addMulti, removeMulti, index }) => {
  return (
    <Row margin={[10, 5]}>
      <Column padding={[5, 0]}>
        <Text size={14} bold><LanguageConfig id="roomplan.roomplancancelpolicyrules" /> </Text>
      </Column>
      {cancelPolicyRules.map((value, index1) => (
        <Column padding={[5]} key={'cancel_rules_' + index1}>
          <Card padding={[10]} className={classes.box}>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="roomplan.roomcancelrulename" />}
                  value={value[newConstants.ROOM_CANCEL_RULE_NAME].value}
                  name={newConstants.ROOM_CANCEL_RULE_NAME}
                  error={value[newConstants.ROOM_CANCEL_RULE_NAME].error}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index1)}
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
                      onChange={(e) => multiStateUpdater(e, index, 'cancel_rules_check', index1)}
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
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index1)}
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
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index1)}
                  helperText={
                    value[newConstants.EFFECTIVE_TO].err_msg
                  }
                  required={value[newConstants.EFFECTIVE_TO].is_require}
                />
              </Column>
              <Column padding={[0, 7]}>
                <RoomPlanRefund
                  index={index}
                  index1={index1}
                  cancelPolicies={value[newConstants.ROOM_PLAN_CANCEL_POLICIES].value}
                  classes={classes}
                  multiStateUpdater={multiStateUpdater}
                  addMulti={addMulti}
                  removeMulti={removeMulti}
                />
              </Column>
              <Column
                md={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index1 ? 6 : 9}
                xs={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index1 ? 5 : 9}
                sm={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index1 ? 5 : 9}></Column>
              <Column
                md={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index1 ? 6 : 3}
                xs={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index1 ? 7 : 3}
                sm={cancelPolicyRules.length > 1 && cancelPolicyRules.length - 1 == index1 ? 7 : 3}>
                <Row className={classes.endPadd}>
                  {cancelPolicyRules.length > 1 ? (
                    <Button
                      onClick={() => removeMulti(index, 'cancel_rules', index1)}
                      className={classes.addEdit}
                      size="small"
                      variant="contained"
                      color="primary">
                      <Remove />
                    </Button>
                  ) : null}
                  {cancelPolicyRules.length - 1 == index1 ? (
                    <Button className={classes.addMulti} onClick={() => addMulti('cancel_rules', index)} size="small" variant="contained" color="primary">
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


const RoomPriceComments = ({ name, value, onChange, error, helperText, label, isDisabled, defaultOptions, loadComments }) => {
  const [selectValue, setSetectedValue] = useState(null);
  useEffect(() => {
    RoomByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadComments();
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

  const loadRoomComments = async (inputValue = "", callback = null) => {
    callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))
  }

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions.concat(selectValue ? [selectValue] : [])}
      value={selectValue}
      name={name}
      isDisabled={isDisabled}
      loadOptions={loadRoomComments}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};



const Business = ({ localFields, multiStateUpdater, amenityCharge, index }) => {
  const classes = useStyles()

  return (
    <Row padding={[3]}>
      <Column >
        <Text size={14} bold style={{ margin: 10 }}>
          B2B
        </Text>
      </Column>
      <TextField
        label={"tax"}
        type="number"
        inputProps={{ min: 0 }}
        name={newConstants.B2B_TAX_VALUE}
        value={localFields && localFields[newConstants.B2B_TAX_VALUE] && localFields[newConstants.B2B_TAX_VALUE].value}
        onChange={(e) => multiStateUpdater(e, index, 'whole')}
        error={
          localFields && localFields[newConstants.B2B_TAX_VALUE] && localFields[newConstants.B2B_TAX_VALUE].error
        }
        helperText={localFields && localFields[newConstants.B2B_TAX_VALUE] && localFields[newConstants.B2B_TAX_VALUE].err_msg}
        required={localFields && localFields[newConstants.B2B_TAX_VALUE] && localFields[newConstants.B2B_TAX_VALUE].is_require}
      />
      <TextField
        label={"service"}
        name={[newConstants.B2B_SERVICE_VALUE]}
        type="number"
        inputProps={{ min: 0 }}
        value={localFields && localFields[newConstants.B2B_SERVICE_VALUE] && localFields[newConstants.B2B_SERVICE_VALUE].value}
        onChange={(e) => multiStateUpdater(e, index, 'whole')}
        error={
          localFields && localFields[newConstants.B2B_SERVICE_VALUE] && localFields[newConstants.B2B_SERVICE_VALUE].error
        }
        helperText={localFields && localFields[newConstants.B2B_SERVICE_VALUE] && localFields[newConstants.B2B_SERVICE_VALUE].err_msg}
        required={localFields && localFields[newConstants.B2B_SERVICE_VALUE] && localFields[newConstants.B2B_SERVICE_VALUE].is_require}
      />
      <TextField
        label={"additional"}
        name={[newConstants.B2B_ADDITIONAL_VALUE]}
        type="number"
        inputProps={{ min: 0 }}
        value={localFields && localFields[newConstants.B2B_ADDITIONAL_VALUE] && localFields[newConstants.B2B_ADDITIONAL_VALUE].value}
        onChange={(e) => multiStateUpdater(e, index, 'whole')}
        error={
          localFields && localFields[newConstants.B2B_ADDITIONAL_VALUE] && localFields[newConstants.B2B_ADDITIONAL_VALUE].error
        }
        helperText={localFields && localFields[newConstants.B2B_ADDITIONAL_VALUE] && localFields[newConstants.B2B_ADDITIONAL_VALUE].err_msg}
        required={localFields && localFields[newConstants.B2B_ADDITIONAL_VALUE] && localFields[newConstants.B2B_ADDITIONAL_VALUE].is_require}
      />
      <TextField
        label={"amenity"}
        name={[newConstants.B2B_AMENITY_VALUE]}
        type="number"
        inputProps={{ min: 0 }}
        // value={amenityCharge}
        disabled
        value={localFields && localFields[newConstants.B2B_AMENITY_VALUE] && localFields[newConstants.B2B_AMENITY_VALUE].value}
        onChange={(e) => multiStateUpdater(e, index, 'whole')}
        error={
          localFields && localFields[newConstants.B2B_AMENITY_VALUE] && localFields[newConstants.B2B_AMENITY_VALUE].error
        }
        helperText={localFields && localFields[newConstants.B2B_AMENITY_VALUE] && localFields[newConstants.B2B_AMENITY_VALUE].err_msg}
        required={localFields && localFields[newConstants.B2B_AMENITY_VALUE] && localFields[newConstants.B2B_AMENITY_VALUE].is_require}
      />
      <TextField
        label={" rate"}
        name={[newConstants.B2B_NET_VALUE]}
        type="number"
        inputProps={{ min: 0 }}
        disabled={localFields && localFields[newConstants.IS_PAX_WISE] && localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
        value={localFields && localFields[newConstants.B2B_NET_VALUE] && localFields[newConstants.B2B_NET_VALUE].value}
        onChange={(e) => multiStateUpdater(e, index, 'whole')}
        error={
          localFields && localFields[newConstants.B2B_NET_VALUE] && localFields[newConstants.B2B_NET_VALUE].error
        }
        helperText={localFields && localFields[newConstants.B2B_NET_VALUE] && localFields[newConstants.B2B_NET_VALUE].err_msg}
        required={localFields && localFields[newConstants.B2B_NET_VALUE] && localFields[newConstants.B2B_NET_VALUE].is_require}
      />
    </Row>
  )
}





const Customer = ({ localFields, multiStateUpdater, amenityCharge, index }) => {
  const classes = useStyles()

  return (
    <Row padding={[3]}>
      <Column >
        <Text size={14} bold style={{ margin: 10 }}>
          B2C
        </Text>
      </Column>
      <TextField
        label={"tax"}
        type="number"
        name={newConstants.B2C_TAX_VALUE}
        inputProps={{ min: 0 }}
        value={localFields && localFields[newConstants.B2C_TAX_VALUE] && localFields[newConstants.B2C_TAX_VALUE].value}
        onChange={(e) => multiStateUpdater(e, index, 'whole')}
        error={
          localFields && localFields[newConstants.B2C_TAX_VALUE] && localFields[newConstants.B2C_TAX_VALUE].error
        }
        helperText={localFields && localFields[newConstants.B2C_TAX_VALUE] && localFields[newConstants.B2C_TAX_VALUE].err_msg}
        required={localFields && localFields[newConstants.B2C_TAX_VALUE] && localFields[newConstants.B2C_TAX_VALUE].is_require}
      />
      <TextField
        label={"service"}
        name={[newConstants.B2C_SERVICE_VALUE]}
        type="number"
        inputProps={{ min: 0 }}
        value={localFields && localFields[newConstants.B2C_SERVICE_VALUE] && localFields[newConstants.B2C_SERVICE_VALUE].value}
        onChange={(e) => multiStateUpdater(e, index, 'whole')}
        error={
          localFields && localFields[newConstants.B2C_SERVICE_VALUE] && localFields[newConstants.B2C_SERVICE_VALUE].error
        }
        helperText={localFields && localFields[newConstants.B2C_SERVICE_VALUE] && localFields[newConstants.B2C_SERVICE_VALUE].err_msg}
        required={localFields && localFields[newConstants.B2C_SERVICE_VALUE] && localFields[newConstants.B2C_SERVICE_VALUE].is_require}
      />
      <TextField
        label={"additional"}
        name={[newConstants.B2C_ADDITIONAL_VALUE]}
        type="number"
        inputProps={{ min: 0 }}
        value={localFields && localFields[newConstants.B2C_ADDITIONAL_VALUE] && localFields[newConstants.B2C_ADDITIONAL_VALUE].value}
        onChange={(e) => multiStateUpdater(e, index, 'whole')}
        error={
          localFields && localFields[newConstants.B2C_ADDITIONAL_VALUE] && localFields[newConstants.B2C_ADDITIONAL_VALUE].error
        }
        helperText={localFields && localFields[newConstants.B2C_ADDITIONAL_VALUE] && localFields[newConstants.B2C_ADDITIONAL_VALUE].err_msg}
        required={localFields && localFields[newConstants.B2C_ADDITIONAL_VALUE] && localFields[newConstants.B2C_ADDITIONAL_VALUE].is_require}
      />
      <TextField
        label={"amenity"}
        name={[newConstants.B2C_AMENITY_VALUE]}
        type="number"
        inputProps={{ min: 0 }}
        // value={amenityCharge}
        disabled
        value={localFields && localFields[newConstants.B2C_AMENITY_VALUE] && localFields[newConstants.B2C_AMENITY_VALUE].value}
        onChange={(e) => multiStateUpdater(e, index, 'whole')}
        error={
          localFields && localFields[newConstants.B2C_AMENITY_VALUE] && localFields[newConstants.B2C_AMENITY_VALUE].error
        }
        helperText={localFields && localFields[newConstants.B2C_AMENITY_VALUE] && localFields[newConstants.B2C_AMENITY_VALUE].err_msg}
        required={localFields && localFields[newConstants.B2C_AMENITY_VALUE] && localFields[newConstants.B2C_AMENITY_VALUE].is_require}
      />
      <TextField
        label={" rate"}
        name={[newConstants.B2C_NET_VALUE]}
        type="number"
        disabled={localFields && localFields[newConstants.IS_PAX_WISE] && localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
        inputProps={{ min: 0 }}
        value={localFields && localFields[newConstants.B2C_NET_VALUE] && localFields[newConstants.B2C_NET_VALUE].value}
        onChange={(e) => multiStateUpdater(e, index, 'whole')}
        error={
          localFields && localFields[newConstants.B2C_NET_VALUE] && localFields[newConstants.B2C_NET_VALUE].error
        }
        helperText={localFields && localFields[newConstants.B2C_NET_VALUE] && localFields[newConstants.B2C_NET_VALUE].err_msg}
        required={localFields && localFields[newConstants.B2C_NET_VALUE] && localFields[newConstants.B2C_NET_VALUE].is_require}
      />
    </Row>
  )
}