import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Checkbox,
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Create, Delete, Add, Remove } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest, getDateYYYYMMDD } from '../../helper/JsHelper';
import {
  getAllTicketType,
  getTicketTypeByKey,
  getEventTicketByKey,
  getEventTicketPlanByKey,
  UpdateEventTicketPlan,
  getTicketRefundTypes,
  getEventTicketPlan,
  getAllEventTicketY,
  getAllTicketAmenity,
  createEventTicketPlan,
  deleteEventTicketPlan,
  GetEventTicketComments,
  getTicketAmenityByKey,
  getKeyEventTicketKeyBYTicket
} from '../../helper/RequestPayLoadEvents';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from "../PrimaryContainer"
import LanguageConfig from "../../helper/LanguageConfig";
import { check } from 'prettier';

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
  add: {
    backgroundColor: "rgb(26, 43, 71)",
    color: "white",
    margin: '5px',
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    },
  },
  scrollContainer: {
    // overflowY: 'scroll',
    // maxHeight: 300,
  },

  tableBodyTuple: {
    color: 'black',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 7,
    // width: 'clamp(150px,10vw,300px)',
  },
  TableContainRates: {
    maxWidth: "300px",
    minWidth: "100%",
    overflowX: "auto"
  },
  TableContain: {
    maxWidth: "300px",
    minWidth: "100%",
    overflowX: "hidden"
  },
  tableHeadTuple: {
    color: 'black',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    textTransform: 'uppercase',
    width: 'clamp(150px,10vw,300px)',
  },
  DateTime: {
    color: "rgb(104, 150, 194)",
    fontWeight: 600
  }
}));

const Ticket_plan_cancel_policy = {
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
const Ticket_plan_cancel_rules = {
  [newConstants.TICKET_CANCEL_RULE_NAME]: {
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
  [newConstants.IS_OVERWRITE]: {
    value: true,
    is_require: true,
    error: false,
    type: 'boolean',
    err_msg: '',
  },
  [newConstants.TICKET_PLAN_CANCEL_POLICIES]: { value: [Ticket_plan_cancel_policy], is_require: true, error: false },
};
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
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: <LanguageConfig id="ticketplan.sno" /> },
    [newConstants.TICKET_PLAN_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.ticketplanname" /> },
    // [newConstants.IS_ALL_DAYS_IN_WEEK]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.isalldaysinweek" /> },
    // [newConstants.IS_SUNDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.issunday" /> },
    // [newConstants.IS_MONDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.ismonday" /> },
    // [newConstants.IS_TUESDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.istuesday" /> },
    // [newConstants.IS_WEDNESDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.iswednesday" /> },
    // [newConstants.IS_THURSDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.isthursday" /> },
    // [newConstants.IS_FRIDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.isfriday" /> },
    // [newConstants.IS_SATURDAY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.issaturday" /> },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.selectdays" /> },
    [newConstants.ACTIVE_HOURS_FROM]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.hoursfrom" /> },
    [newConstants.ACTIVE_HOURS_TO]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.hoursto" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.lastupdatedby" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="ticketplan.lastupdatedon" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="ticketplan.action" /> }
  });

  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getEventTicketPlan(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setData(res[newConstants.DATA][newConstants.TICKET_PLANS]);
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

  const filter_data = data
    .map((value, index) =>
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
    let res = await httpPostRequest(getEventTicketPlanByKey(key));
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
    const res = await httpPostRequest(deleteEventTicketPlan(deleteId));
    setDeleteLoader(deleteId);
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setDeleteLoader('');
      loadData();
      setDeleteId('');
      setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
    } else {
      setDeleteLoader('');
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
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
              copylanguages={copylanguages}
            />
          </Fade>}
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
        editRow={editRoomPlan}
        deleteRow={setDeleteId}
        action_key={newConstants.TICKET_PLAN_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="ticketplan.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delRoomPlan}
        />
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit, languages, setAlertMsg, copylanguages }) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [amenityLinks, setAmenityLinks] = useState([]);
  const [cancelPolicyRules, setCancelPolicyRules] = useState([]);
  const [plandescription, setPlandescription] = useState([]);
  const [planrates, setPlanrates] = useState([]);
  const [ticketname, setTicketname] = useState(editData ? editData[newConstants.TICKET_KEY] : "")
  const [amenity, setAmenity] = useState([])
  const [tickeykey, setTicketKey] = useState([])
  const [loader, setLoader] = useState(false);
  const [amenityCharge, setAmenityCharge] = useState(0)


  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.TICKET_PLAN_NAME]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.GROUP_ALLOTMENT]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_GROUP_TICKET]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_TERM_DATE]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.MAX_ALLOWED]: {
          value: "",
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.TICKET_TERM_DATE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.ADDITIONAL_TYPE]: {
          value: "",
          is_require: false,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.SERVICE_TYPE]: {
          value: "",
          is_require: false,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TAX_TYPE]: {
          value: "",
          is_require: false,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_TYPE_KEY]: {
          value: "",
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.IS_SOLD_OUT]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_EXPIRE]: {
          value: false,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        // [newConstants.EXPIRE_DATE]: {
        //   value: '',
        //   is_require: true,
        //   error: false,
        // },
        [newConstants.ACTIVE_HOURS_FROM]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.ACTIVE_HOURS_TO]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
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
        [newConstants.TICKET_PLAN_NAME]: {
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
      setAmenityLinks([
        {
          [newConstants.TICKET_AMENITY_KEY]: {
            value: '',
            is_require: false,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.IS_CHARGEABLE]: {
            value: true,
            is_require: false,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
          [newConstants.TICKET_AMENITY_PRICE]: {
            value: '',
            is_require: false,
            error: false,
            type: 'price',
            err_msg: '',
          },
          [newConstants.IS_SHOW]: {
            value: true,
            is_require: false,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
        },
      ]);
      setPlandescription([
        {
          [newConstants.LANG_CODE]: {
            value: "",
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.TICKET_PLAN_LABEL]: {
            value: "",
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.TICKET_PLAN_TEXT]: {
            value: "",
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.IS_PRINT_VOUCHER]: {
            value: true,
            is_require: false,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
        }
      ])
      const Ticket_plan_cancel_rules_ = _.cloneDeep(Ticket_plan_cancel_rules);
      setCancelPolicyRules([Ticket_plan_cancel_rules_]);
    } else {
      setLocalFields({
        [newConstants.TICKET_PLAN_NAME]: {
          value: editData[newConstants.TICKET_PLAN_NAME],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_KEY]: {
          value: editData[newConstants.TICKET_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.GROUP_ALLOTMENT]: {
          value: editData[newConstants.GROUP_ALLOTMENT],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_GROUP_TICKET]: {
          value: editData[newConstants.IS_GROUP_TICKET],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.ADDITIONAL_TYPE]: {
          value: editData[newConstants.ADDITIONAL_TYPE],
          is_require: false,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.SERVICE_TYPE]: {
          value: editData[newConstants.SERVICE_TYPE],
          is_require: false,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TAX_TYPE]: {
          value: editData[newConstants.TAX_TYPE],
          is_require: false,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_TYPE_KEY]: {
          value:editData["ticket-plan-rates"].filter(f=>f["is-show-on-listing"]==true).length?editData["ticket-plan-rates"].filter(f=>f["is-show-on-listing"]==true)[0]["ticket-type-key"]:"",
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.IS_TERM_DATE]: {
          value: editData[newConstants.IS_TERM_DATE],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.MAX_ALLOWED]: {
          value: editData[newConstants.MAX_ALLOWED],
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.TICKET_TERM_DATE]: {
          value: getDateYYYYMMDD(editData[newConstants.TICKET_TERM_DATE]),
          is_require: true,
          error: false,
        },
        [newConstants.IS_SOLD_OUT]: {
          value: editData[newConstants.IS_SOLD_OUT],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_EXPIRE]: {
          value: editData[newConstants.IS_EXPIRE],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.ACTIVE_HOURS_FROM]: {
          value: editData[newConstants.ACTIVE_HOURS_FROM],
          is_require: true,
          error: false,
        },
        [newConstants.ACTIVE_HOURS_TO]: {
          value: editData[newConstants.ACTIVE_HOURS_TO],
          is_require: true,
          error: false,
        },
        [newConstants.IS_ACTIVE]: {
          value: editData[newConstants.IS_ACTIVE],
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
        [newConstants.TICKET_PLAN_NAME]: {
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
      if (editData[newConstants.TICKET_PLAN_LANGUAGES] && editData[newConstants.TICKET_PLAN_LANGUAGES].length) {
        editData[newConstants.TICKET_PLAN_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.TICKET_PLAN_NAME]: {
              value: value[newConstants.TICKET_PLAN_NAME],
              is_require: true,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: true,
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
      if (editData[newConstants.TICKET_PLAN_AMENITY_LINKS] && editData[newConstants.TICKET_PLAN_AMENITY_LINKS].length) {
        editData[newConstants.TICKET_PLAN_AMENITY_LINKS].forEach((value) => {
          amenityLinks_.push({
            [newConstants.TICKET_AMENITY_KEY]: {
              value: value[newConstants.TICKET_AMENITY_KEY],
              is_require: false,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.IS_CHARGEABLE]: {
              value: value[newConstants.IS_CHARGEABLE],
              is_require: false,
              error: false,
              type: 'boolean',
              err_msg: '',
            },
            [newConstants.TICKET_AMENITY_PRICE]: {
              value: value[newConstants.TICKET_AMENITY_PRICE],
              is_require: false,
              error: false,
              type: 'price',
              err_msg: '',
            },
            [newConstants.IS_SHOW]: {
              value: value[newConstants.IS_SHOW],
              is_require: false,
              error: false,
              type: 'boolean',
              err_msg: '',
            },
          });
        });
      } else {
        amenityLinks_.push({
          [newConstants.TICKET_AMENITY_KEY]: {
            value: '',
            is_require: false,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.IS_CHARGEABLE]: {
            value: true,
            is_require: false,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
          [newConstants.TICKET_AMENITY_PRICE]: {
            value: '',
            is_require: false,
            error: false,
            type: 'price',
            err_msg: '',
          },
          [newConstants.IS_SHOW]: {
            value: true,
            is_require: false,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
        });
      }
      setAmenityLinks(amenityLinks_);

      let plandescription_ = [];
      if (editData[newConstants.TICKET_PLAN_DESCRIPTION] && editData[newConstants.TICKET_PLAN_DESCRIPTION].length) {
        editData[newConstants.TICKET_PLAN_DESCRIPTION].forEach((value) => {
          plandescription_.push({
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: true,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.TICKET_PLAN_LABEL]: {
              value: value[newConstants.TICKET_PLAN_LABEL],
              is_require: true,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.TICKET_PLAN_TEXT]: {
              value: value[newConstants.TICKET_PLAN_TEXT],
              is_require: true,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.IS_PRINT_VOUCHER]: {
              value: value[newConstants.IS_PRINT_VOUCHER],
              is_require: false,
              error: false,
              type: 'boolean',
              err_msg: '',
            },
          });
        });
      } else {
        plandescription_.push({
          [newConstants.LANG_CODE]: {
            value: "",
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.TICKET_PLAN_LABEL]: {
            value: "",
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.TICKET_PLAN_TEXT]: {
            value: "",
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.IS_PRINT_VOUCHER]: {
            value: true,
            is_require: false,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
        });
      }
      setPlandescription(plandescription_);

      let cancelPolicyRules_ = [];
      if (
        editData[newConstants.TICKET_PLAN_CANCEL_POLICY_RULES] &&
        editData[newConstants.TICKET_PLAN_CANCEL_POLICY_RULES].length
      ) {
        let cancelPolicies_ = [];
        editData[newConstants.TICKET_PLAN_CANCEL_POLICY_RULES].forEach((value) => {
          if (value[newConstants.TICKET_PLAN_CANCEL_POLICIES] && value[newConstants.TICKET_PLAN_CANCEL_POLICIES]) {
            value[newConstants.TICKET_PLAN_CANCEL_POLICIES].forEach((value) => {
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
                  is_require: true,
                  error: false,
                  type: 'price',
                  err_msg: '',
                },
              });
            });
          } else {
            cancelPolicies_.push({
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
            });
          }
          cancelPolicyRules_.push({
            [newConstants.TICKET_CANCEL_RULE_NAME]: {
              value: value[newConstants.TICKET_CANCEL_RULE_NAME],
              is_require: true,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.TICKET_KEY]: {
              value: value[newConstants.TICKET_KEY],
              is_require: true,
              error: false,
              type: 'dropdown',
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
            [newConstants.IS_OVERWRITE]: {
              value: value[newConstants.IS_OVERWRITE],
              is_require: true,
              error: false,
              type: 'boolean',
              err_msg: '',
            },
            [newConstants.TICKET_PLAN_CANCEL_POLICIES]: {
              value: cancelPolicies_,
              is_require: false,
              error: false,
            },
          });
        });
      } else {
        cancelPolicyRules_.push(Ticket_plan_cancel_rules)
      }
      setCancelPolicyRules(cancelPolicyRules_);
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
    }
    else if (tag === 'desc') {
      let plandescription_ = _.cloneDeep(plandescription);
      if (e.target.value.length == 0) {
        plandescription_[index][e.target.name].error = plandescription_[index][e.target.name].is_require ? true : false;
        plandescription_[index][e.target.name].value = e.target.value;
      } else {
        plandescription_[index][e.target.name].value = e.target.value;
        plandescription_[index][e.target.name].error = false;
      }
      setPlandescription(plandescription_);
    }
    else if (tag == 'rates') {
      let planrates_ = _.cloneDeep(planrates);
      if (e.target.value.length == 0) {
        planrates_[index][e.target.name].error = planrates_[index][e.target.name].is_require ? true : false;
        planrates_[index][e.target.name].value = e.target.value;
      } else {
        planrates_[index][e.target.name].value = e.target.value;
        planrates_[index][e.target.name].error = false;
      }
      setPlanrates(planrates_);
    }

    else if (tag == 'rates_check') {
      let planrates_ = _.cloneDeep(planrates);
      if (e.target.value.length == 0) {
        planrates_[index][e.target.name].error = planrates_[index][e.target.name].is_require ? true : false;
        planrates_[index][e.target.name].value = e.target.value;
      } else {
        planrates_[index][e.target.name].value = e.target.value === 'true' ? false : true;
        planrates_[index][e.target.name].error = false;
      }
      setPlanrates(planrates_);
    }

    else if (tag == 'cancel_rules') {
      let cancelPolicyRules_ = _.cloneDeep(cancelPolicyRules);
      if (index1 != undefined) {
        if (e.target.value.length == 0) {
          cancelPolicyRules_[index][newConstants.TICKET_PLAN_CANCEL_POLICIES][newConstants.VALUE][index1][
            e.target.name
          ].error = cancelPolicyRules_[index][newConstants.TICKET_PLAN_CANCEL_POLICIES][newConstants.VALUE][index1][
            e.target.name
          ].is_require
              ? true
              : false;
          cancelPolicyRules_[index][newConstants.TICKET_PLAN_CANCEL_POLICIES][newConstants.VALUE][index1][
            e.target.name
          ].value = e.target.value;
        } else {
          cancelPolicyRules_[index][newConstants.TICKET_PLAN_CANCEL_POLICIES][newConstants.VALUE][index1][
            e.target.name
          ].value = e.target.value;
          cancelPolicyRules_[index][newConstants.TICKET_PLAN_CANCEL_POLICIES][newConstants.VALUE][index1][
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
    }
    else if (tag == 'desc_check') {
      let plandescription_ = _.cloneDeep(plandescription);
      if (e.target.value == '') {
        plandescription_[index][e.target.name].error = plandescription_[index][e.target.name].is_require ? true : false;
        plandescription_[index][e.target.name].value = e.target.value;
      } else {
        plandescription_[index][e.target.name].value = e.target.value === 'true' ? false : true;
        plandescription_[index][e.target.name].error = false;
      }
      setPlandescription(plandescription_);
    }
    else if (tag == 'cancel_rules_check') {
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
    if (tag == 'lang') {
      let multi_language_ = _.cloneDeep(multi_language);
      if (multi_language_.length > 1) {
        multi_language_ = multi_language_.map((val, index) => (index != index_ ? val : null));
        setMultiLanguage(multi_language_.filter((f) => f != null));
      }
    } else if (tag == 'amenity') {
      let amenityLinks_ = _.cloneDeep(amenityLinks);
      if (amenityLinks_.length > 1) {
        amenityLinks_ = amenityLinks_.map((val, index) => (index != index_ ? val : null));
        setAmenityLinks(amenityLinks_.filter((f) => f != null));
      }
    }
    else if (tag == 'desc') {
      let plandescription_ = _.cloneDeep(plandescription);
      if (plandescription_.length > 1) {
        plandescription_ = plandescription_.map((val, index) => (index != index_ ? val : null));
        setPlandescription(plandescription_.filter((f) => f != null));
      }
    }
    else if (tag == 'cancel_rules') {
      let cancelPolicyRules_ = _.cloneDeep(cancelPolicyRules);
      if (
        index1 != undefined &&
        cancelPolicyRules_[index_][newConstants.TICKET_PLAN_CANCEL_POLICIES][newConstants.VALUE].length > 1
      ) {
        cancelPolicyRules_[index_][newConstants.TICKET_PLAN_CANCEL_POLICIES][newConstants.VALUE] = cancelPolicyRules_[index_][
          newConstants.TICKET_PLAN_CANCEL_POLICIES
        ][newConstants.VALUE].filter((val, index) => index != index1);
      }
      if (index1 == undefined && cancelPolicyRules_.length > 1) {
        cancelPolicyRules_ = cancelPolicyRules_.map((val, index) => (index != index_ ? val : null));
      }
      setCancelPolicyRules(cancelPolicyRules_.filter((f) => f != null));
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
          [newConstants.TICKET_PLAN_NAME]: {
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
    } else if (tag == 'amenity') {
      let amenityLinks_ = _.cloneDeep(amenityLinks);
      amenityLinks_.push({
        [newConstants.TICKET_AMENITY_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.IS_CHARGEABLE]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.TICKET_AMENITY_PRICE]: {
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
    }
    else if (tag == "desc") {
      let plandescription_ = _.cloneDeep(plandescription)
      plandescription_.push({
        [newConstants.LANG_CODE]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_PLAN_LABEL]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_PLAN_TEXT]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_PRINT_VOUCHER]: {
          value: true,
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
      });
      setPlandescription(plandescription_);
    }
    else if (tag == 'cancel_rules') {
      let cancelPolicyRules_ = _.cloneDeep(cancelPolicyRules);
      if (index != undefined) {
        cancelPolicyRules_[index][newConstants.TICKET_PLAN_CANCEL_POLICIES][newConstants.VALUE].push(_.cloneDeep(Ticket_plan_cancel_policy));
      } else {
        cancelPolicyRules_.push(_.cloneDeep(Ticket_plan_cancel_rules));
      }
      setCancelPolicyRules(cancelPolicyRules_);
    }
  };


  useEffect(() => {
    let temp = 0;
    amenityLinks.forEach(obj => {
      temp += parseFloat(obj[newConstants.TICKET_AMENITY_PRICE][newConstants.VALUE])
    })
    setAmenityCharge(temp)
  }, [amenityLinks])


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
    let plandescription_validator = _.cloneDeep(plandescription);
    plandescription_validator = plandescription_validator.map((value) => validator(value));
    if (plandescription_validator.filter((f) => f.err == true).length) {
      setPlandescription(plandescription_validator.map((value) => value.values));
    }

    let planrates_validator = _.cloneDeep(planrates);
    planrates_validator = planrates_validator.map((value) => validator(value));
    if (planrates_validator.filter((f) => f.err == true).length) {
      setPlanrates(planrates_validator.map((value) => value.values));
    }

    let flag =
      !localFields_validation.err &&
      amenityLinks_validator.filter((f) => f.err).length == 0 &&
      cancelPolicyRules_validator.filter((f) => f.err).length == 0 &&
      plandescription_validator.filter((f) => f.err).length == 0 &&
      planrates_validator.filter((f) => f.err).length == 0

    let multi_lang_ = multi_language.filter(f => f[newConstants.TICKET_PLAN_NAME].value != "")


    if (flag) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(
          createEventTicketPlan(localFields, multi_lang_, amenityLinks, plandescription, planrates, cancelPolicyRules),
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: <LanguageConfig id="ticketplan.successfullysave" /> });
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="ticketplan.tryagain" /> });
        }
      } else {
        let res = await httpPostRequest(
          UpdateEventTicketPlan(
            editData[newConstants.TICKET_PLAN_KEY],
            localFields, multi_lang_, amenityLinks, plandescription, planrates, cancelPolicyRules
          ),
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="ticketplan.fillrequired" /> });
    }
  };



  const TickeyKeyEvent = async (ticketname) => {
    let res = await httpPostRequest(getEventTicketByKey(ticketname));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setAmenity(res[newConstants.DATA][newConstants.TICKET_AMENITY_LINKS])
    }
    else {
      setAmenity([])
      setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
    }
  }

  useEffect(() => {
    if (ticketname) {
      TickeyKeyEvent(ticketname)
    }
  }, [ticketname])



  const TicketTypeKey = async (ticketname) => {    
    let res = await httpPostRequest(getKeyEventTicketKeyBYTicket(ticketname));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setTicketKey(res[newConstants.DATA])
      generateRates(res[newConstants.DATA])
    }
    else {
      setTicketKey([])
      setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
    }
  }


  useMemo(() => {
    if (ticketname) {
      TicketTypeKey(ticketname)
    }
  }, [ticketname, editData])


  const generateRates = (fields) => {
    let field1 = fields.map((value) => {
      return {
        [newConstants.TICKET_TYPE_KEY]: {
          value: value[newConstants.TICKET_TYPE_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.IS_SHOW_ON_LISTING]: {
          value: false,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.TICKET_RATE_REGULAR_B2B]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.TICKET_RATE_REGULAR_B2C]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.IS_SOLD_OUT]: {
          value: false,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.IS_TAX_INCLUSION]: {
          value: true,
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.RATE_COMMENTS_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.MAX_ALLOWED]: {
          value: '',
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.AMENITY_VALUE]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-tax-value"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-service-value"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-addition-value"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2b-net-value"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-tax-value"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-service-value"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-addition-value"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        ["b2c-net-value"]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
      }
    })

    let field2 = editData && editData[newConstants.TICKET_PLAN_RATES] ?
      editData[newConstants.TICKET_PLAN_RATES].map((value) => {
        return {
          [newConstants.TICKET_TYPE_KEY]: {
            value: value[newConstants.TICKET_TYPE_KEY],
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.IS_SHOW_ON_LISTING]: {
            value: value[newConstants.IS_SHOW_ON_LISTING],
            is_require: false,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
          [newConstants.TICKET_RATE_REGULAR_B2B]: {
            value: value[newConstants.TICKET_RATE_REGULAR_B2B],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          [newConstants.TICKET_RATE_REGULAR_B2C]: {
            value: value[newConstants.TICKET_RATE_REGULAR_B2C],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          [newConstants.IS_SOLD_OUT]: {
            value: value[newConstants.IS_SOLD_OUT],
            is_require: false,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
          [newConstants.IS_TAX_INCLUSION]: {
            value: value[newConstants.IS_TAX_INCLUSION],
            is_require: false,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
          [newConstants.RATE_COMMENTS_KEY]: {
            value: value[newConstants.RATE_COMMENTS_KEY],
            is_require: true,
            error: false,
            type: 'dropdown',
            err_msg: '',
          },
          [newConstants.MAX_ALLOWED]: {
            value: value[newConstants.MAX_ALLOWED],
            is_require: true,
            error: false,
            type: 'number',
            err_msg: '',
          },
          [newConstants.AMENITY_VALUE]: {
            value: value[newConstants.AMENITY_VALUE],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          ["b2b-tax-value"]: {
            value: value[newConstants.B2B_PRICE][newConstants.TAX_VALUE],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          ["b2b-service-value"]: {
            value: value[newConstants.B2B_PRICE][newConstants.SERVICE_VALUE],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          ["b2b-addition-value"]: {
            value: value[newConstants.B2B_PRICE][newConstants.ADDITION_VALUE],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          ["b2b-net-value"]: {
            value: value[newConstants.B2B_PRICE][newConstants.NET_VALUE],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          ["b2c-tax-value"]: {
            value: value[newConstants.B2C_PRICE][newConstants.TAX_VALUE],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          ["b2c-service-value"]: {
            value: value[newConstants.B2C_PRICE][newConstants.SERVICE_VALUE],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          ["b2c-addition-value"]: {
            value: value[newConstants.B2C_PRICE][newConstants.ADDITION_VALUE],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
          ["b2c-net-value"]: {
            value: value[newConstants.B2C_PRICE][newConstants.NET_VALUE],
            is_require: true,
            error: false,
            type: 'price',
            err_msg: '',
          },
        }
      }) : []

    let checkedFilter = field2.filter(f => (field1.map(v => v[newConstants.TICKET_TYPE_KEY].value).includes(f[newConstants.TICKET_TYPE_KEY].value)))
    let fieldFilter = field1.filter(f => !(field2.map(v => v[newConstants.TICKET_TYPE_KEY].value).includes(f[newConstants.TICKET_TYPE_KEY].value)))
    setPlanrates(checkedFilter.concat(fieldFilter))
  };


  return (
    <div>
      {localFields.hasOwnProperty([newConstants.TICKET_PLAN_NAME]) ? (
        <Row padding={[10]}>
          <Column>
            <Row>
              <Column md={6} padding={[10, 5]}>
                <TextField
                  id="room-plan-name-id"
                  label={<LanguageConfig id="Event plan name" />}
                  name={newConstants.TICKET_PLAN_NAME}
                  value={localFields[newConstants.TICKET_PLAN_NAME].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_PLAN_NAME].error && localFields[newConstants.TICKET_PLAN_NAME].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_PLAN_NAME].error && localFields[newConstants.TICKET_PLAN_NAME].is_require
                      ? localFields[newConstants.TICKET_PLAN_NAME].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TicketName
                  name={newConstants.TICKET_KEY}
                  value={localFields[newConstants.TICKET_KEY].value}
                  onChange={(e) => {
                    setTicketname(e.target.value)
                    stateUpdater(e)
                    setPlanrates([])
                    // stateUpdater({target:{name:newConstants.ROOM_KEY,value:""}})
                  }}
                  error={localFields[newConstants.TICKET_KEY].error && localFields[newConstants.TICKET_KEY].is_require}
                  helperText={
                    localFields[newConstants.TICKET_KEY].error && localFields[newConstants.TICKET_KEY].is_require
                      ? localFields[newConstants.TICKET_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="Events" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="number"
                  label={<LanguageConfig id="Max.Booking Limit" />}
                  name={newConstants.MAX_ALLOWED}
                  value={localFields[newConstants.MAX_ALLOWED].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.MAX_ALLOWED].error && localFields[newConstants.MAX_ALLOWED].is_require
                  }
                  helperText={
                    localFields[newConstants.MAX_ALLOWED].error && localFields[newConstants.MAX_ALLOWED].is_require
                      ? localFields[newConstants.MAX_ALLOWED].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 20]} center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFields[newConstants.IS_TERM_DATE].value}
                      color="primary"
                      onChange={() =>
                        setLocalFields({
                          ...localFields,
                          [newConstants.IS_TERM_DATE]: {
                            ...localFields[newConstants.IS_TERM_DATE],
                            value: !localFields[newConstants.IS_TERM_DATE].value,
                          },
                        })
                      }
                      name={newConstants.IS_TERM_DATE}
                    />
                  }
                  label={<LanguageConfig id="Sale date" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                    classes: {
                      root: classes.DateTime,
                    }
                  }}
                  label={<LanguageConfig id="Last Sale Date" />}
                  name={newConstants.TICKET_TERM_DATE}
                  disabled={localFields[newConstants.IS_TERM_DATE].value ? false : true}
                  value={localFields[newConstants.IS_TERM_DATE].value ? localFields[newConstants.TICKET_TERM_DATE].value : localFields[newConstants.TICKET_TERM_DATE].value = ""}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_TERM_DATE].error && localFields[newConstants.TICKET_TERM_DATE].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_TERM_DATE].error && localFields[newConstants.TICKET_TERM_DATE].is_require
                      ? localFields[newConstants.TICKET_TERM_DATE].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="time"
                  id="room-plan-name-id"
                  InputLabelProps={{
                    shrink: true,
                    classes: {
                      root: classes.DateTime,
                    }
                  }}
                  label={<LanguageConfig id="ticketplan.hoursfrom" />}
                  name={newConstants.ACTIVE_HOURS_FROM}
                  value={localFields[newConstants.ACTIVE_HOURS_FROM].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.ACTIVE_HOURS_FROM].error && localFields[newConstants.ACTIVE_HOURS_FROM].is_require
                  }
                  helperText={
                    localFields[newConstants.ACTIVE_HOURS_FROM].error && localFields[newConstants.ACTIVE_HOURS_FROM].is_require
                      ? localFields[newConstants.ACTIVE_HOURS_FROM].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="time"
                  id="room-plan-name-id"
                  InputLabelProps={{
                    shrink: true,
                    classes: {
                      root: classes.DateTime,
                    }
                  }}
                  label={<LanguageConfig id="ticketplan.hoursto" />}
                  name={newConstants.ACTIVE_HOURS_TO}
                  value={localFields[newConstants.ACTIVE_HOURS_TO].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.ACTIVE_HOURS_TO].error && localFields[newConstants.ACTIVE_HOURS_TO].is_require
                  }
                  helperText={
                    localFields[newConstants.ACTIVE_HOURS_TO].error && localFields[newConstants.ACTIVE_HOURS_TO].is_require
                      ? localFields[newConstants.ACTIVE_HOURS_TO].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TypeRates
                  name={newConstants.SERVICE_TYPE}
                  value={localFields[newConstants.SERVICE_TYPE] && localFields[newConstants.SERVICE_TYPE].value}
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
                <TicketTypeName
                  tickeykey={tickeykey}
                  // isDisabled={true}
                  name={newConstants.TICKET_TYPE_KEY}
                  value={localFields[newConstants.TICKET_TYPE_KEY] && localFields[newConstants.TICKET_TYPE_KEY].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_TYPE_KEY] &&  localFields[newConstants.TICKET_TYPE_KEY].error && localFields[newConstants.TICKET_TYPE_KEY].is_require}
                  helperText={
                    localFields[newConstants.TICKET_TYPE_KEY] &&  localFields[newConstants.TICKET_TYPE_KEY].error && localFields[newConstants.TICKET_TYPE_KEY].is_require
                      ? localFields[newConstants.TICKET_TYPE_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="ticketplan.tickettype" />}
                />
              </Column>
              {editData &&
                <Column md={3} padding={[10, 20]} center>
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
                    label={<LanguageConfig id="ticketplan.soldout" />}
                  />
                </Column>}

              {/* make visible for below three  */}
              {/* <Column md={3} padding={[10, 20]} center>
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
                  label={<LanguageConfig id="ticketplan.isexpire" />}
                />
              </Column>

              <Column md={3} padding={[10, 20]} center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFields[newConstants.GROUP_ALLOTMENT].value}
                      color="primary"
                      onChange={() =>
                        setLocalFields({
                          ...localFields,
                          [newConstants.GROUP_ALLOTMENT]: {
                            ...localFields[newConstants.GROUP_ALLOTMENT],
                            value: !localFields[newConstants.GROUP_ALLOTMENT].value,
                          },
                        })
                      }
                      name={newConstants.GROUP_ALLOTMENT}
                    />
                  }
                  label={<LanguageConfig id="group allotment" />}
                />
              </Column>
              <Column md={3} padding={[10, 20]} center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFields[newConstants.IS_GROUP_TICKET].value}
                      color="primary"
                      onChange={() =>
                        setLocalFields({
                          ...localFields,
                          [newConstants.IS_GROUP_TICKET]: {
                            ...localFields[newConstants.IS_GROUP_TICKET],
                            value: !localFields[newConstants.IS_GROUP_TICKET].value,
                          },
                        })
                      }
                      name={newConstants.IS_GROUP_TICKET}
                    />
                  }
                  label={<LanguageConfig id="group ticket" />}
                />
              </Column>             */}

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
                    label={<LanguageConfig id="ticketplan.selectdays" />}
                  />
                </Column>
              ) : null}
              <Row>
                <Column padding={[5]} md={6}>
                  <LanguageContainer classes={classes} multi_language={multi_language} multiStateUpdater={multiStateUpdater} languages={languages} copylanguages={copylanguages} />
                </Column>
                <Column padding={[5]} md={6}>
                  <TicketPlanAmenityLinks
                    amenity={amenity}
                    amenityLinks={amenityLinks}
                    classes={classes}
                    multiStateUpdater={multiStateUpdater}
                    addMulti={addMulti}
                    removeMulti={removeMulti}
                  /></Column>
              </Row>
              <Column>
                <TicketPlanDesc
                  plandescription={plandescription}
                  classes={classes}
                  multiStateUpdater={multiStateUpdater}
                  addMulti={addMulti}
                  removeMulti={removeMulti}
                  languages={languages}
                />
                {planrates.length > 0 &&
                  <TicketPlanrates
                    amenityCharge={amenityCharge}
                    localFields={localFields}
                    tickeykey={tickeykey}
                    planrates={planrates}
                    editData={editData}
                    classes={classes}
                    multiStateUpdater={multiStateUpdater}
                  />}
              </Column>
              <Column>
                <TicketPlanCancelPolicyRules
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
                            <LanguageConfig id={editData ? "ticketplan.update" : "Save"} />
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
                        <LanguageConfig id={"ticketplan.cancel"} />
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


const TicketName = ({ name, value, onChange, error, helperText, label }) => {
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
      const res = await httpPostRequest(getEventTicketByKey(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.TICKET_NAME],
          value: res[newConstants.DATA][newConstants.TICKET_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadHotel = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllEventTicketY(inputValue));
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



const TicketTypeName = ({ name, value, onChange, error, helperText, label, tickeykey, isDisabled }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    setDefaultOptions(
      tickeykey.map((v) => ({
        value: v[newConstants.TICKET_TYPE_KEY],
        label: v[newConstants.TICKET_TYPE_NAME],
      }))
    )
  }, [tickeykey, value]);



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



const TicketAmenityName = ({ name, value, onChange, error, helperText, label, amenity }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    setDefaultOptions(
      amenity.map((v) => ({
        value: v[newConstants.TICKET_AMENITY_KEY],
        label: v[newConstants.TICKET_AMENITY_NAME],
      }))
    )
  }, [amenity, value]);

  const loadAmenity = (inputValue = "", callback = null) => {
    callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))
  }


  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
      name={name}
      loadOptions={loadAmenity}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};


const TicketPlanAmenityLinks = ({ amenityLinks, classes, multiStateUpdater, addMulti, removeMulti, amenity }) => {

  return (
    <Row>
      <Column padding={[5, 0]}>
        <Text size={14} bold>
          <LanguageConfig id="Event amenity links" />
        </Text>
      </Column>
      <Column padding={[5]}>
        <Card padding={[10]} className={classes.box}>
          {amenityLinks.map((value, index) => (
            <Row>
              <Column md={4} padding={[5]}>
                <TicketAmenityName
                  amenity={amenity.filter(f => f[newConstants.HOTEL_AMENITY_KEY] == value[newConstants.TICKET_AMENITY_KEY].value || !(amenityLinks.map(v => v[newConstants.TICKET_AMENITY_KEY].value).includes(f[newConstants.HOTEL_AMENITY_KEY])))}
                  value={value[newConstants.TICKET_AMENITY_KEY].value}
                  name={newConstants.TICKET_AMENITY_KEY}
                  error={value[newConstants.TICKET_AMENITY_KEY].is_require && value[newConstants.TICKET_AMENITY_KEY].error}
                  onChange={(e) => multiStateUpdater(e, index, 'amenity')}
                  helperText={
                    value[newConstants.TICKET_AMENITY_KEY].is_require && value[newConstants.TICKET_AMENITY_KEY].error
                      ? value[newConstants.TICKET_AMENITY_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="amenity" />} />
              </Column>
              <Column md={3} padding={[5]}>
                <TextField
                  type="number"
                  inputProps={{ min: 0 }}
                  label={<LanguageConfig id="Price" />}
                  value={value[newConstants.TICKET_AMENITY_PRICE].value}
                  name={newConstants.TICKET_AMENITY_PRICE}
                  error={value[newConstants.TICKET_AMENITY_PRICE].is_require && value[newConstants.TICKET_AMENITY_PRICE].error}
                  onChange={(e) => multiStateUpdater(e, index, 'amenity')}
                  helperText={
                    value[newConstants.TICKET_AMENITY_PRICE].is_require && value[newConstants.TICKET_AMENITY_PRICE].error
                      ? value[newConstants.TICKET_AMENITY_PRICE].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              {/* <Column padding={[5]} center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value[newConstants.IS_CHARGEABLE].value}
                      value={value[newConstants.IS_CHARGEABLE].value}
                      color="primary"
                      onChange={(e) => multiStateUpdater(e, index, 'amenity_check')}
                      name={newConstants.IS_CHARGEABLE}
                    />
                  }
                  label={<LanguageConfig id="ticketplan.ischargeable" />}
                />
              </Column> */}
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
                  label={<LanguageConfig id="Listing" />}
                />
              </Column>
              <Column
                md={amenityLinks.length > 1 && amenityLinks.length - 1 == index ? 3 : 3}
                xs={amenityLinks.length > 1 && amenityLinks.length - 1 == index ? 2 : 1}
                sm={amenityLinks.length > 1 && amenityLinks.length - 1 == index ? 2 : 1}>
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
                  {amenityLinks.length - 1 == index ? amenityLinks.length < amenity.length && (
                    <Button onClick={() => addMulti('amenity')} size="small" variant="contained" className={classes.add}>
                      <Add />
                    </Button>
                  ) : null}
                </Row>
              </Column>
            </Row>
          ))}
        </Card>
      </Column>
    </Row>
  );
};

const TicketPlanDesc = ({ plandescription, classes, multiStateUpdater, addMulti, removeMulti, languages }) => {
  const { Language } = DemandDropDown
  const { copylanguages } = useStore()
  const [roomAmenity, setRoomAmenityKey] = useState([
    { value: 'pXsP+kp6Mv1mRKilSNBSzxNDSU/+lpYsloMzgzQ2ml0=', label: 'MANUAL ENTRY' },
  ]);
  return (
    <Row margin={[10, 5]}>
      <Column padding={[5, 0]}>
        <Text size={14} bold>
          <LanguageConfig id="Event plan description" />
        </Text>
      </Column>
      {plandescription.map((value, index) => (
        <Column md={4} padding={[5]} key={'amenity_' + index}>
          <Card padding={[10]} className={classes.box}>
            <Row>
              <Column padding={[5]}>
                <Language
                  options={copylanguages}
                  value={value[newConstants.LANG_CODE].value}
                  name={newConstants.LANG_CODE}
                  error={value[newConstants.LANG_CODE].is_require && value[newConstants.LANG_CODE].error}
                  onChange={(e) => multiStateUpdater(e, index, 'desc')}
                  helperText={
                    value[newConstants.LANG_CODE].is_require && value[newConstants.LANG_CODE].error
                      ? value[newConstants.LANG_CODE].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="ticketplan.languagecode" />}
                />
              </Column>
              <Column padding={[5]}>
                <TextField
                  label={<LanguageConfig id="Event label" />}
                  value={value[newConstants.TICKET_PLAN_LABEL].value}
                  name={newConstants.TICKET_PLAN_LABEL}
                  error={value[newConstants.TICKET_PLAN_LABEL].is_require && value[newConstants.TICKET_PLAN_LABEL].error}
                  onChange={(e) => multiStateUpdater(e, index, 'desc')}
                  helperText={
                    value[newConstants.TICKET_PLAN_LABEL].is_require && value[newConstants.TICKET_PLAN_LABEL].error
                      ? value[newConstants.TICKET_PLAN_LABEL].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>

              <Column padding={[5]}>
                <TextField
                  label={<LanguageConfig id="Event text" />}
                  value={value[newConstants.TICKET_PLAN_TEXT].value}
                  name={newConstants.TICKET_PLAN_TEXT}
                  error={value[newConstants.TICKET_PLAN_TEXT].is_require && value[newConstants.TICKET_PLAN_TEXT].error}
                  onChange={(e) => multiStateUpdater(e, index, 'desc')}
                  InputProps={{
                    style: {
                      height: "auto",
                    }
                  }}
                  rows={3}
                  multiline
                  helperText={
                    value[newConstants.TICKET_PLAN_TEXT].is_require && value[newConstants.TICKET_PLAN_TEXT].error
                      ? value[newConstants.TICKET_PLAN_TEXT].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column padding={[5]} center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value[newConstants.IS_PRINT_VOUCHER].value}
                      value={value[newConstants.IS_PRINT_VOUCHER].value}
                      color="primary"
                      onChange={(e) => multiStateUpdater(e, index, 'desc_check')}
                      name={newConstants.IS_PRINT_VOUCHER}
                    />
                  }
                  label={<LanguageConfig id="ticketplan.isprintvoucher" />}
                />
              </Column>
              <Column
                md={plandescription.length > 1 && plandescription.length - 1 == index ? 6 : 9}
                xs={plandescription.length > 1 && plandescription.length - 1 == index ? 5 : 9}
                sm={plandescription.length > 1 && plandescription.length - 1 == index ? 5 : 9}></Column>
              <Column
                md={plandescription.length > 1 && plandescription.length - 1 == index ? 6 : 3}
                xs={plandescription.length > 1 && plandescription.length - 1 == index ? 7 : 3}
                sm={plandescription.length > 1 && plandescription.length - 1 == index ? 7 : 3}>
                <Row className={classes.endPadd}>
                  {plandescription.length > 1 ? (
                    <Button
                      onClick={() => removeMulti(index, 'desc')}
                      className={classes.addEdit}
                      size="small"
                      variant="contained"
                      color="primary">
                      <Remove />
                    </Button>
                  ) : null}
                  {plandescription.length - 1 == index ? plandescription.length < languages.length && (
                    <Button onClick={() => addMulti('desc')} size="small" variant="contained" className={classes.add}>
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


const TicketPlanrates = ({editData, planrates, classes, multiStateUpdater, tickeykey, amenityCharge ,localFields}) => {


  return (
    <Row margin={[10, 5]}>
      <Column padding={[5, 0]}>
        <Text size={14} bold>
          <LanguageConfig id="Event plan rates" />
        </Text>
      </Column>
      <Row>{planrates.map((value, index) => (
        <Paper style={{ width: "100%", marginTop: 10 }}>
          <TableContainer className={classes.TableContainRates}>
            <Table style={{ width: "1095px" }}>
              <TableHead>
                <TableRow>
                  <TableCell scope="row" align="center" colSpan={6} className={classes.tableHeadTuple}>{tickeykey.filter(f => f[newConstants.TICKET_TYPE_KEY] == value[newConstants.TICKET_TYPE_KEY].value)[0][newConstants.TICKET_TYPE_NAME]}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className={classes.tableBodyTuple}>
                    <Text>Common</Text>
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple} style={{ width: "20%" }}>
                    <RateCommentsKey
                      label={"price comments"}
                      name={newConstants.RATE_COMMENTS_KEY}
                      value={value[newConstants.RATE_COMMENTS_KEY].value}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      error={
                        value[newConstants.RATE_COMMENTS_KEY].error
                      }
                      helperText={value[newConstants.RATE_COMMENTS_KEY].err_msg}
                      required={value[newConstants.RATE_COMMENTS_KEY].is_require}
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="Max.Booking Limit" />}
                      value={value[newConstants.MAX_ALLOWED].value}
                      name={newConstants.MAX_ALLOWED}
                      error={value[newConstants.MAX_ALLOWED].is_require && value[newConstants.MAX_ALLOWED].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value[newConstants.MAX_ALLOWED].is_require && value[newConstants.MAX_ALLOWED].error
                          ? value[newConstants.MAX_ALLOWED].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="Amenity value" />}
                      disabled
                      value={value[newConstants.AMENITY_VALUE].value = amenityCharge}
                      name={newConstants.AMENITY_VALUE}
                      error={value[newConstants.AMENITY_VALUE].is_require && value[newConstants.AMENITY_VALUE].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value[newConstants.AMENITY_VALUE].is_require && value[newConstants.AMENITY_VALUE].error
                          ? value[newConstants.AMENITY_VALUE].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  {editData &&
                  <TableCell className={classes.tableBodyTuple}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value[newConstants.IS_SOLD_OUT].value}
                          value={value[newConstants.IS_SOLD_OUT].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'rates_check')}
                          name={newConstants.IS_SOLD_OUT}
                        />
                      }
                      label={<LanguageConfig id="sold out" />}
                    />
                  </TableCell>}
                  <TableCell className={classes.tableBodyTuple} style={{ display: "none" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value[newConstants.IS_SHOW_ON_LISTING].value}
                          value={localFields[newConstants.TICKET_TYPE_KEY].value==value[newConstants.TICKET_TYPE_KEY].value?value[newConstants.IS_SHOW_ON_LISTING].value=true:value[newConstants.IS_SHOW_ON_LISTING].value=false}
                          // value={value[newConstants.IS_SHOW_ON_LISTING].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'rates_check')}
                          name={newConstants.IS_SHOW_ON_LISTING}
                        />
                      }
                      label={<LanguageConfig id="show on listing" />}
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={value[newConstants.IS_TAX_INCLUSION].value}
                          value={value[newConstants.IS_TAX_INCLUSION].value}
                          color="primary"
                          onChange={(e) => multiStateUpdater(e, index, 'rates_check')}
                          name={newConstants.IS_TAX_INCLUSION}
                        />
                      }
                      label={<LanguageConfig id="Tax inclusion" />}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableBodyTuple}>
                    <Text>B2B</Text>
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple} style={{ width: "20%" }}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="rate b2b" />}
                      value={value[newConstants.TICKET_RATE_REGULAR_B2B].value}
                      name={newConstants.TICKET_RATE_REGULAR_B2B}
                      error={value[newConstants.TICKET_RATE_REGULAR_B2B].is_require && value[newConstants.TICKET_RATE_REGULAR_B2B].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value[newConstants.TICKET_RATE_REGULAR_B2B].is_require && value[newConstants.TICKET_RATE_REGULAR_B2B].error
                          ? value[newConstants.TICKET_RATE_REGULAR_B2B].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="B2b tax" />}
                      value={value["b2b-tax-value"].value}
                      name={["b2b-tax-value"]}
                      error={value["b2b-tax-value"].is_require && value["b2b-tax-value"].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value["b2b-tax-value"].is_require && value["b2b-tax-value"].error
                          ? value["b2b-tax-value"].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="B2b service" />}
                      value={value["b2b-service-value"].value}
                      name={["b2b-service-value"]}
                      error={value["b2b-service-value"].is_require && value["b2b-service-value"].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value["b2b-service-value"].is_require && value["b2b-service-value"].error
                          ? value["b2b-service-value"].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="B2b additional" />}
                      value={value["b2b-addition-value"].value}
                      name={["b2b-addition-value"]}
                      error={value["b2b-addition-value"].is_require && value["b2b-addition-value"].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value["b2b-addition-value"].is_require && value["b2b-addition-value"].error
                          ? value["b2b-addition-value"].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="B2b net" />}
                      value={value["b2b-net-value"].value}
                      name={["b2b-net-value"]}
                      error={value["b2b-net-value"].is_require && value["b2b-net-value"].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value["b2b-net-value"].is_require && value["b2b-net-value"].error
                          ? value["b2b-net-value"].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.tableBodyTuple}>
                    <Text>B2C</Text>
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple} style={{ width: "20%" }}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="rate b2c" />}
                      value={value[newConstants.TICKET_RATE_REGULAR_B2C].value}
                      name={newConstants.TICKET_RATE_REGULAR_B2C}
                      error={value[newConstants.TICKET_RATE_REGULAR_B2C].is_require && value[newConstants.TICKET_RATE_REGULAR_B2C].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value[newConstants.TICKET_RATE_REGULAR_B2C].is_require && value[newConstants.TICKET_RATE_REGULAR_B2C].error
                          ? value[newConstants.TICKET_RATE_REGULAR_B2C].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="B2c tax" />}
                      value={value["b2c-tax-value"].value}
                      name={["b2c-tax-value"]}
                      error={value["b2c-tax-value"].is_require && value["b2c-tax-value"].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value["b2c-tax-value"].is_require && value["b2c-tax-value"].error
                          ? value["b2c-tax-value"].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="B2c service" />}
                      value={value["b2c-service-value"].value}
                      name={["b2c-service-value"]}
                      error={value["b2c-service-value"].is_require && value["b2c-service-value"].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value["b2c-service-value"].is_require && value["b2c-service-value"].error
                          ? value["b2c-service-value"].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="B2c additional" />}
                      value={value["b2c-addition-value"].value}
                      name={["b2c-addition-value"]}
                      error={value["b2c-addition-value"].is_require && value["b2c-addition-value"].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value["b2c-addition-value"].is_require && value["b2c-addition-value"].error
                          ? value["b2c-addition-value"].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className={classes.tableBodyTuple}>
                    <TextField
                      type="number"
                      inputProps={{ min: 0 }}
                      label={<LanguageConfig id="B2c net" />}
                      value={value["b2c-net-value"].value}
                      name={["b2c-net-value"]}
                      error={value["b2c-net-value"].is_require && value["b2c-net-value"].error}
                      onChange={(e) => multiStateUpdater(e, index, 'rates')}
                      helperText={
                        value["b2c-net-value"].is_require && value["b2c-net-value"].error
                          ? value["b2c-net-value"].err_msg
                          : ''
                      }
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>)
      )}
      </Row>
    </Row>
  );
};


const RateCommentsKey = ({ name, value, onChange, error, helperText, label, isDisabled }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    loadRate();
  }, [value]);


  const loadRate = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(GetEventTicketComments(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultOptions(
        res[newConstants.DATA][newConstants.TICKET_PRICE_COMMENTS].map((v) => ({
          value: v[newConstants.TICKET_PRICE_COMMENTS_KEY],
          label: v[newConstants.TICKET_PRICE_COMMENTS_TITLE]
        })),
      );
    }
  };

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
      name={name}
      isDisabled={isDisabled}
      loadOptions={loadRate}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
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
      const res = await httpPostRequest(getTicketRefundTypes(value));
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
    const res = await httpPostRequest(getTicketRefundTypes(inputValue));
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

const TicketPlanRefund = ({ cancelPolicies, index, classes, multiStateUpdater, addMulti, removeMulti }) => {
  return (
    <Row margin={[0, 5]}>
      <Column padding={[5, 0]}>
        <Text size={14} bold>
          <LanguageConfig id="Event Plan Cancel Policies" />
        </Text>
      </Column>
      <Column padding={[5]}>
        <Card padding={[10]}>
          {cancelPolicies.map((value, index_) => (
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
                  label={<LanguageConfig id="ticketplan.refundtype" />}
                />
              </Column>
              <Column md={3} padding={[5]}>
                <TextField
                  type="number"
                  inputProps={{ min: 1 }}
                  id="days-before-id"
                  label={<LanguageConfig id="ticketplan.daysbeforecheckin" />}
                  name={newConstants.DAYS_BEFORE_CHECK_IN}
                  value={value[newConstants.DAYS_BEFORE_CHECK_IN].value}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index_)}
                  error={
                    value[newConstants.DAYS_BEFORE_CHECK_IN].error && value[newConstants.DAYS_BEFORE_CHECK_IN].is_require
                  }
                  helperText={
                    value[newConstants.DAYS_BEFORE_CHECK_IN].error && value[newConstants.DAYS_BEFORE_CHECK_IN].is_require
                      ? value[newConstants.DAYS_BEFORE_CHECK_IN].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[5]}>
                <TextField
                  type="number"
                  inputProps={{ min: 0 }}
                  id="cancelation-value-id"
                  disabled={value[newConstants.REFUND_TYPE_KEY].value != "3U3h8NhijxMup7rLtl/0o2jYbTCsIobTKrjTQbu93AI=" ? false : true}
                  label={<LanguageConfig id="ticketplan.cancelationvalue" />}
                  value={value[newConstants.REFUND_TYPE_KEY].value != "3U3h8NhijxMup7rLtl/0o2jYbTCsIobTKrjTQbu93AI=" ? value[newConstants.CANCELATION_VALUE].value : value[newConstants.CANCELATION_VALUE].value = ""}
                  name={newConstants.CANCELATION_VALUE}
                  error={value[newConstants.CANCELATION_VALUE].is_require && value[newConstants.CANCELATION_VALUE].error}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules', index_)}
                  helperText={
                    value[newConstants.CANCELATION_VALUE].is_require && value[newConstants.CANCELATION_VALUE].error
                      ? value[newConstants.CANCELATION_VALUE].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column
                md={cancelPolicies.length > 1 && cancelPolicies.length - 1 == index_ ? 3 : 3}
                xs={cancelPolicies.length > 1 && cancelPolicies.length - 1 == index_ ? 12 : 12}
                sm={cancelPolicies.length > 1 && cancelPolicies.length - 1 == index_ ? 12 : 12}>
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
                    <Button onClick={() => addMulti('cancel_rules', index)} size="small" variant="contained" className={classes.add}>
                      <Add />
                    </Button>
                  ) : null}
                </Row>
              </Column>
            </Row>

          ))}
        </Card>
      </Column>
    </Row>
  );
};

const TicketPlanCancelPolicyRules = ({ cancelPolicyRules, classes, multiStateUpdater, addMulti, removeMulti }) => {
  return (
    <Row margin={[10, 5]}>
      <Column padding={[5, 0]}>
        <Text size={14} bold>
          <LanguageConfig id="Event Plan Cancel Policy Rules" />
        </Text>
      </Column>
      {cancelPolicyRules.map((value, index) => (
        <Column padding={[5]} key={'cancel_rules_' + index}>
          <Card padding={[10]}>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="room-cancel-rule-name-id"
                  label={<LanguageConfig id="Event cancel rule name" />}
                  value={value[newConstants.TICKET_CANCEL_RULE_NAME].value}
                  name={newConstants.TICKET_CANCEL_RULE_NAME}
                  error={
                    value[newConstants.TICKET_CANCEL_RULE_NAME].is_require && value[newConstants.TICKET_CANCEL_RULE_NAME].error
                  }
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules')}
                  helperText={
                    value[newConstants.TICKET_CANCEL_RULE_NAME].is_require && value[newConstants.TICKET_CANCEL_RULE_NAME].error
                      ? value[newConstants.TICKET_CANCEL_RULE_NAME].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]} center middle>
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
                  label={<LanguageConfig id="ticketplan.isdaterange" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="date"
                  id="effective-from-id"
                  label={<LanguageConfig id="ticketplan.effectivefrom" />}
                  InputLabelProps={{
                    shrink: true,
                    classes: {
                      root: classes.DateTime,
                    }
                  }}
                  disabled={value[newConstants.IS_DATE_RANGE].value ? false : true}
                  value={value[newConstants.IS_DATE_RANGE].value ? value[newConstants.EFFECTIVE_FROM].value : value[newConstants.EFFECTIVE_FROM].value = ""}
                  name={newConstants.EFFECTIVE_FROM}
                  error={value[newConstants.EFFECTIVE_FROM].is_require && value[newConstants.EFFECTIVE_FROM].error}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules')}
                  helperText={
                    value[newConstants.EFFECTIVE_FROM].is_require && value[newConstants.EFFECTIVE_FROM].error
                      ? value[newConstants.EFFECTIVE_FROM].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>

              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="date"
                  id="effective-to-id"
                  label={<LanguageConfig id="ticketplan.effectiveto" />}
                  InputLabelProps={{
                    shrink: true,
                    classes: {
                      root: classes.DateTime,
                    }
                  }}
                  disabled={value[newConstants.IS_DATE_RANGE].value ? false : true}
                  value={value[newConstants.IS_DATE_RANGE].value ? value[newConstants.EFFECTIVE_TO].value : value[newConstants.EFFECTIVE_TO].value = ""}
                  name={newConstants.EFFECTIVE_TO}
                  error={value[newConstants.EFFECTIVE_TO].is_require && value[newConstants.EFFECTIVE_TO].error}
                  onChange={(e) => multiStateUpdater(e, index, 'cancel_rules')}
                  helperText={
                    value[newConstants.EFFECTIVE_TO].is_require && value[newConstants.EFFECTIVE_TO].error
                      ? value[newConstants.EFFECTIVE_TO].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[0, 5]} center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value[newConstants.IS_OVERWRITE].value}
                      value={value[newConstants.IS_OVERWRITE].value}
                      color="primary"
                      onChange={(e) => multiStateUpdater(e, index, 'cancel_rules_check')}
                      name={newConstants.IS_OVERWRITE}
                    />
                  }
                  label={<LanguageConfig id="ticketplan.isoverwrite" />}
                />
              </Column>
              <Column padding={[5]}>
                <TicketPlanRefund
                  index={index}
                  cancelPolicies={value[newConstants.TICKET_PLAN_CANCEL_POLICIES].value}
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
                    <Button onClick={() => addMulti('cancel_rules')} size="small" variant="contained" className={classes.add}>
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



const LanguageContainer = ({ classes, multi_language, multiStateUpdater, languages, copylanguages }) => {
  const ref = useRef();
  return (
    <div ref={ref}>
      <Row>
        <Column md={12}>
          <Text size={14} bold>Event languages</Text>
        </Column>
        <Column margin={[6, 0, 0, 0]}>
          <div className={classes.scrollContainer}>
            <Row>
              <Paper style={{ width: "100%" }}>
                <TableContainer className={classes.TableContain}>
                  <Table>
                    {/* <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHeadTuple}>Language</TableCell>
                        <TableCell className={classes.tableHeadTuple}>plan name</TableCell>
                      </TableRow>
                    </TableHead> */}
                    <TableBody>
                      {multi_language.map(
                        (val, index) => (
                          <TableRow>
                            <TableCell className={classes.tableBodyTuple}>
                              <Text>{languages.filter(f => f.value == val[newConstants.LANG_CODE].value).length ? languages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label :
                                copylanguages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label
                              }</Text>
                            </TableCell>
                            <TableCell className={classes.tableBodyTuple}>
                              <TextField
                                style={{ width: "100%" }}
                                label={"Event plan name"}
                                type="text"
                                value={val[newConstants.TICKET_PLAN_NAME].value}
                                name={newConstants.TICKET_PLAN_NAME}
                                error={val[newConstants.TICKET_PLAN_NAME].error}
                                onChange={(e) => multiStateUpdater(e, index, "lang")}
                                helperText={val[newConstants.TICKET_PLAN_NAME].err_msg}
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