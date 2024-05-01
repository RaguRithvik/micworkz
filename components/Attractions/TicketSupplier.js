import React, { useState, useEffect } from 'react';
import { TextField, Text, Card, Row, Column, Loader, CustomAlert, DemandDropDown, SingelSelectOnDemand } from '../../core';
import { Fade, FormControlLabel, Checkbox, Button, } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import { createAttractionTicketSupplier, updateAttractionTicketSupplier, getAttractionTicketSupplier, deleteAttractionTicketSupplier, getTicketModule, getKeyAttractionTicketSupplier, LedgerAccountSupplier, attractionSupplierTaxRule, getAllAttractionTicketTypeY } from '../../helper/RequestPayLoadAttractions';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from "../PrimaryContainer"
import LanguageConfig from "../../helper/LanguageConfig";
import GeneralLanguageContainer from "../GeneralLanguageContainer"

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    minWidth: 100,
    height: 40,
    margin: 5,
    width: '30%',
    backgroundColor: "rgb(26, 43, 71);",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71);",
    },
  },
  addButton: {
    margin: 5
  },
  closeButton: {
    margin: 5,
    width: '30%',
    minWidth: 100,
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
    pointerAttractions: 'none',
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
    '&:hover': {
      backgroundColor: theme.palette.error.main,
    },
  },
  endPadd: {
    placeContent: 'flex-end',
    padding: 8,
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
    fontWeight: "bold"
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
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { setAlertMsg, languages, copylanguages, formname } = useStore();
  const [deleteId, setDeleteId] = useState('');

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    ["row-number"]: { is_hide: true, bool: true, label: <LanguageConfig id="general.sno" /> },
    ["ticket-supplier-regno"]: { is_hide: false, bool: true, label: <LanguageConfig id="event.regno" /> },
    ["ticket-supplier-country-name"]: { is_hide: false, bool: true, label: <LanguageConfig id="event.code" /> },
    ["ticket-supplier-city-name"]: { is_hide: false, bool: true, label: <LanguageConfig id="general.city" /> },
    ["ticket-supplier-teleno1"]: { is_hide: false, bool: true, label: <LanguageConfig id="general.telephoneno1" /> },
    ["ticket-supplier-email"]: { is_hide: false, bool: true, label: <LanguageConfig id="general.email" /> },
    ["last-update-on"]: { is_hide: false, bool: true, label: <LanguageConfig id="general.lastupdatedon" /> },
    ["last-update-by"]: { is_hide: false, bool: true, label: <LanguageConfig id="general.lastupdatedby" /> },
    ["active-status"]: { is_hide: false, bool: true, label: <LanguageConfig id="general.status" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="general.action" /> }
  });

  const loadData = async () => {
    setLoader(true)
    let res = await httpPostRequest(getAttractionTicketSupplier(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA]["ticket-suppliers"]);
      setMaxPage(
        res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
          parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
          0
          ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
          : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
      );
      setLoader(false);
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

  const editAmmunity = async (id) => {
    setAddEdit(false);
    let res = await httpPostRequest(getKeyAttractionTicketSupplier(id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setEditData(res[newConstants.DATA]);
      setAddEdit(true);
    }
    else if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 502) {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="ticketsupplier.suppliernotfound" /> });
    }
  };

  async function deleteAmmunity() {
    const res = await httpPostRequest(deleteAttractionTicketSupplier(deleteId));
    setDeleteLoader(deleteId);
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDeleteLoader('');
      loadData();
      setDeleteId('');
      setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
    else {
      setDeleteLoader('');
      setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
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
              setAlertMsg={setAlertMsg}
              addEdit={addEdit}
              setAddEdit={setAddEdit}
              classes={classes}
              languages={languages}
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
        editRow={editAmmunity}
        deleteRow={setDeleteId}
        action_key={newConstants.TICKET_SUPPLIER_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="general.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={deleteAmmunity}
        />

      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, loadData, editData, languages, setEditData, addEdit, setAddEdit, setAlertMsg, copylanguages }) => {
  const [localFields, setLocalFields] = useState(null);
  const [loader, setLoader] = useState(false);
  const [multi_language, setMultiLanguage] = useState([]);
  const { Country, City, Province, Currency } = DemandDropDown;
  const [defaultValue, setDefaultValue] = useState([]);

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.TICKET_MODULE_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.LEDGER_GROUP_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_REGNO]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_NAME]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_ADDRESS]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_CITY_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_STATE_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },

        [newConstants.TICKET_SUPPLIER_COUNTRY_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_PINCODE]: {
          value: '',
          is_require: true,
          error: false,
          type: 'text',
          err_msg: '',
          min_length: 2,
          max_length: null,
        },
        // [newConstants.TICKET_SUPPLIER_REMARK]: {
        //   value: '',
        //   is_require: false,
        //   error: false,
        //   min_length: 2,
        //   max_length: null,
        //   type: 'text',
        //   err_msg: '',
        // },
        [newConstants.TICKET_SUPPLIER_TELENO1]: {
          value: '',
          is_require: true,
          error: false,
          type: 'text',
          err_msg: '',
          min_length: 5,
          max_length: null,
        },
        // [newConstants.TICKET_SUPPLIER_TELENO2]: {
        //   value: '',
        //   is_require: false,
        //   error: false,
        //   type: 'text',
        //   err_msg: '',
        // },
        // [newConstants.TICKET_SUPPLIER_MOBILENO1]: {
        //   value: '',
        //   is_require: false,
        //   error: false,
        //   min_length: 10,
        //   max_length: null,
        //   type: 'text',
        //   err_msg: '',
        // },
        // [newConstants.TICKET_SUPPLIER_MOBILENO2]: {
        //   value: '',
        //   is_require: false,
        //   error: false,
        //   min_length: 10,
        //   max_length: null,
        //   type: 'text',
        //   err_msg: '',
        // },
        [newConstants.TICKET_SUPPLIER_FAX1]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_WEBURL]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_EMAIL]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'email',
          err_msg: '',
        },
        // [newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE]: {
        //   value: '',
        //   is_require: true,
        //   error: false,
        //   type: 'price',
        //   err_msg: '',
        // },
        // [newConstants.SUPPLIER_SERVICE_PERCENTAGE]: {
        //   value: '',
        //   is_require: true,
        //   error: false,
        //   type: 'price',
        //   err_msg: '',
        // },
        // [newConstants.SUPPLIER_TAX_PERCENTAGE]: {
        //   value: '',
        //   is_require: true,
        //   error: false,
        //   type: 'price',
        //   err_msg: '',
        // },
        // [newConstants.SUPPLIER_TAX_RULE_KEY]: {
        //   value: '',
        //   is_require: true,
        //   error: false,
        //   type: 'dropdown',
        //   err_msg: '',
        // },
        [newConstants.LEDGER_CURR_CODE]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_TYPE_KEY]: {
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
        [newConstants.TICKET_SUPPLIER_NAME]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_ADDRESS]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_REMARK]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      setMultiLanguage(Tab_multi);

    } else {
      setLocalFields({
        [newConstants.TICKET_MODULE_KEY]: {
          value: editData[newConstants.TICKET_MODULE_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.LEDGER_GROUP_KEY]: {
          value: editData[newConstants.LEDGER_GROUP_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_REGNO]: {
          value: editData[newConstants.TICKET_SUPPLIER_REGNO],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_NAME]: {
          value: editData[newConstants.TICKET_SUPPLIER_NAME],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_ADDRESS]: {
          value: editData[newConstants.TICKET_SUPPLIER_ADDRESS],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_CITY_KEY]: {
          value: editData[newConstants.TICKET_SUPPLIER_CITY_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_STATE_KEY]: {
          value: editData[newConstants.TICKET_SUPPLIER_STATE_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_COUNTRY_KEY]: {
          value: editData[newConstants.TICKET_SUPPLIER_COUNTRY_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_PINCODE]: {
          value: editData[newConstants.TICKET_SUPPLIER_PINCODE],
          is_require: true,
          error: false,
          type: 'text',
          err_msg: '',
          min_length: 2,
          max_length: null,
        },
        // [newConstants.TICKET_SUPPLIER_REMARK]: {
        //   value: editData[newConstants.TICKET_SUPPLIER_REMARK],
        //   is_require: false,
        //   error: false,
        //   min_length: 2,
        //   max_length: null,
        //   type: 'text',
        //   err_msg: '',
        // },
        [newConstants.TICKET_SUPPLIER_TELENO1]: {
          value: editData[newConstants.TICKET_SUPPLIER_TELENO1],
          is_require: true,
          error: false,
          type: 'text',
          err_msg: '',
          min_length: 5,
          max_length: null,
        },
        // [newConstants.TICKET_SUPPLIER_TELENO2]: {
        //   value: editData[newConstants.TICKET_SUPPLIER_TELENO2],
        //   is_require: false,
        //   error: false,
        //   type: 'text',
        //   err_msg: '',
        // },
        // [newConstants.TICKET_SUPPLIER_MOBILENO1]: {
        //   value: editData[newConstants.TICKET_SUPPLIER_MOBILENO1],
        //   is_require: false,
        //   error: false,
        //   min_length: 10,
        //   max_length: null,
        //   type: 'text',
        //   err_msg: '',
        // },
        // [newConstants.TICKET_SUPPLIER_MOBILENO2]: {
        //   value: editData[newConstants.TICKET_SUPPLIER_MOBILENO2],
        //   is_require: false,
        //   error: false,
        //   min_length: 10,
        //   max_length: null,
        //   type: 'text',
        //   err_msg: '',
        // },
        [newConstants.TICKET_SUPPLIER_FAX1]: {
          value: editData[newConstants.TICKET_SUPPLIER_FAX1],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_WEBURL]: {
          value: editData[newConstants.TICKET_SUPPLIER_WEBURL],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_EMAIL]: {
          value: editData[newConstants.TICKET_SUPPLIER_EMAIL],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'email',
          err_msg: '',
        },
        // [newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE]: {
        //   value: editData[newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE],
        //   is_require: true,
        //   error: false,
        //   type: 'price',
        //   err_msg: '',
        // },
        // [newConstants.SUPPLIER_SERVICE_PERCENTAGE]: {
        //   value: editData[newConstants.SUPPLIER_SERVICE_PERCENTAGE],
        //   is_require: true,
        //   error: false,
        //   type: 'price',
        //   err_msg: '',
        // },
        // [newConstants.SUPPLIER_TAX_PERCENTAGE]: {
        //   value: editData[newConstants.SUPPLIER_TAX_PERCENTAGE],
        //   is_require: true,
        //   error: false,
        //   type: 'price',
        //   err_msg: '',
        // },
        // [newConstants.SUPPLIER_TAX_RULE_KEY]: {
        //   value: editData[newConstants.SUPPLIER_TAX_RULE_KEY],
        //   is_require: true,
        //   error: false,
        //   type: 'dropdown',
        //   err_msg: '',
        // },
        [newConstants.LEDGER_CURR_CODE]: {
          value: editData[newConstants.LEDGER_CURR_CODE],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_TYPE_KEY]: {
          value: editData[newConstants.TICKET_SUPPLIER_LINKS].length
            ? editData[newConstants.TICKET_SUPPLIER_LINKS].map((value) => ({
              label: (defaultValue.filter(f => f.value === value[newConstants.TICKET_TYPE_KEY]).length ? defaultValue.filter(f => f.value === value[newConstants.TICKET_TYPE_KEY])[0].label : ""),
              value: value[newConstants.TICKET_TYPE_KEY],
            }))
            : [],
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
        [newConstants.TICKET_SUPPLIER_NAME]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_ADDRESS]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_REMARK]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      let multi_language_ = [];
      if (
        editData[newConstants.TICKET_SUPPLIER_LANGUAGES] &&
        editData[newConstants.TICKET_SUPPLIER_LANGUAGES].length
      ) {
        editData[newConstants.TICKET_SUPPLIER_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.TICKET_SUPPLIER_NAME]: {
              value: value[newConstants.TICKET_SUPPLIER_NAME],
              is_require: true,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.TICKET_SUPPLIER_ADDRESS]: {
              value: value[newConstants.TICKET_SUPPLIER_ADDRESS],
              is_require: true,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.TICKET_SUPPLIER_REMARK]: {
              value: value[newConstants.TICKET_SUPPLIER_REMARK],
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
      setMultiLanguage(multi_language_.concat(Tab_multi.filter(f => !(multi_language_.map(v => v["lang-code"].value).includes(f["lang-code"].value)))))
    }
  }, [editData, defaultValue]);

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

  function multiStateUpdater(e, index, tag) {
    if (tag == 'Supplier_language') {
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
  }

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
    let multi_lang_ = multi_language.filter(f => f[newConstants.TICKET_SUPPLIER_NAME].value != "")
    if (!localFields_validation.err) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createAttractionTicketSupplier(localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: <LanguageConfig id="general.successfullysaved" /> });
          setLoader(false);
          setAddEdit(false);
          loadData();
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.tryagain" /> });
        }
      } else {
        let res = await httpPostRequest(updateAttractionTicketSupplier(editData[newConstants.TICKET_SUPPLIER_KEY], localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: <LanguageConfig id="general.successfullyupdated" /> });
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
          loadData();
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.tryagain" /> });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.fillrequired" /> });
    }
  };

  return (
    <div>
      {localFields ? (
        <Row padding={[10]}>
          <Column>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <ModuleName
                  label={<LanguageConfig id="event.module" />}
                  name={newConstants.TICKET_MODULE_KEY}
                  value={localFields[[newConstants.TICKET_MODULE_KEY]].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_MODULE_KEY].error && localFields[newConstants.TICKET_MODULE_KEY].is_require}
                  helperText={
                    localFields[newConstants.TICKET_MODULE_KEY].error && localFields[newConstants.TICKET_MODULE_KEY].is_require ? 'Incorrect entry.' : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <LedgerGroupName
                  label={<LanguageConfig id="event.ledgers" />}
                  name={newConstants.LEDGER_GROUP_KEY}
                  value={localFields[[newConstants.LEDGER_GROUP_KEY]].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.LEDGER_GROUP_KEY].error && localFields[newConstants.LEDGER_GROUP_KEY].is_require}
                  helperText={
                    localFields[newConstants.LEDGER_GROUP_KEY].error && localFields[newConstants.LEDGER_GROUP_KEY].is_require ? 'Incorrect entry.' : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"general.registrationno"} />}
                  name={newConstants.TICKET_SUPPLIER_REGNO}
                  value={localFields[[newConstants.TICKET_SUPPLIER_REGNO]].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_REGNO].error && localFields[newConstants.TICKET_SUPPLIER_REGNO].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_REGNO].error && localFields[newConstants.TICKET_SUPPLIER_REGNO].is_require ? localFields[newConstants.TICKET_SUPPLIER_REGNO].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"event.organizername"} />}
                  name={newConstants.TICKET_SUPPLIER_NAME}
                  value={localFields[newConstants.TICKET_SUPPLIER_NAME].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_NAME].error && localFields[newConstants.TICKET_SUPPLIER_NAME].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_NAME].error && localFields[newConstants.TICKET_SUPPLIER_NAME].is_require ?
                      localFields[newConstants.TICKET_SUPPLIER_NAME].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>

              <Column md={6} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"general.address"} />}
                  name={newConstants.TICKET_SUPPLIER_ADDRESS}
                  InputProps={{
                    style: {
                      height: "auto",
                    }
                  }}
                  rows={3}
                  multiline
                  value={localFields[newConstants.TICKET_SUPPLIER_ADDRESS].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_ADDRESS].error && localFields[newConstants.TICKET_SUPPLIER_ADDRESS].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_ADDRESS].error && localFields[newConstants.TICKET_SUPPLIER_ADDRESS].is_require
                      ? localFields[newConstants.TICKET_SUPPLIER_ADDRESS].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={6}>
                <Row>
                  <Column md={6} padding={[10, 5]}>
                    <Country
                      name={newConstants.TICKET_SUPPLIER_COUNTRY_KEY}
                      error={localFields[newConstants.TICKET_SUPPLIER_COUNTRY_KEY].error}
                      value={localFields[newConstants.TICKET_SUPPLIER_COUNTRY_KEY].value}
                      onChange={stateUpdater}
                      helperText={localFields[newConstants.TICKET_SUPPLIER_COUNTRY_KEY].error ? localFields[newConstants.TICKET_SUPPLIER_COUNTRY_KEY].err_msg : ""}
                    />
                  </Column>
                  <Column md={6} padding={[10, 5]}>
                    <Province
                      name={newConstants.TICKET_SUPPLIER_STATE_KEY}
                      error={localFields[newConstants.TICKET_SUPPLIER_STATE_KEY].error}
                      value={localFields[newConstants.TICKET_SUPPLIER_STATE_KEY].value}
                      country_key={localFields[newConstants.TICKET_SUPPLIER_COUNTRY_KEY].value}
                      onChange={stateUpdater}
                      helperText={localFields[newConstants.TICKET_SUPPLIER_STATE_KEY].error ? localFields[newConstants.TICKET_SUPPLIER_STATE_KEY].err_msg : ""}
                    />
                  </Column>
                  <Column md={6} padding={[10, 5]}>
                    <City
                      name={newConstants.TICKET_SUPPLIER_CITY_KEY}
                      error={localFields[newConstants.TICKET_SUPPLIER_CITY_KEY].error}
                      value={localFields[newConstants.TICKET_SUPPLIER_CITY_KEY].value}
                      onChange={stateUpdater}
                      helperText={localFields[newConstants.TICKET_SUPPLIER_CITY_KEY].error ? localFields[newConstants.TICKET_SUPPLIER_CITY_KEY].err_msg : ""}
                      country_key={localFields[newConstants.TICKET_SUPPLIER_COUNTRY_KEY].value}
                    />
                  </Column>
                  <Column md={6} padding={[10, 5]}>
                    <TextField
                      id="outlined-error-helper-text"
                      label={<LanguageConfig id={"general.pincode"} />}
                      name={newConstants.TICKET_SUPPLIER_PINCODE}
                      value={localFields[newConstants.TICKET_SUPPLIER_PINCODE].value}
                      onChange={stateUpdater}
                      error={localFields[newConstants.TICKET_SUPPLIER_PINCODE].error && localFields[newConstants.TICKET_SUPPLIER_PINCODE].is_require}
                      helperText={
                        localFields[newConstants.TICKET_SUPPLIER_PINCODE].error && localFields[newConstants.TICKET_SUPPLIER_PINCODE].is_require
                          ? localFields[newConstants.TICKET_SUPPLIER_PINCODE].err_msg : ''
                      }
                      variant="outlined"
                    />
                  </Column>
                </Row>
              </Column>
              {/* <Column md={3} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"ticketsupplier.remark"} />}
                  name={newConstants.TICKET_SUPPLIER_REMARK}
                  value={localFields[newConstants.TICKET_SUPPLIER_REMARK].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_REMARK].error && localFields[newConstants.TICKET_SUPPLIER_REMARK].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_REMARK].error && localFields[newConstants.TICKET_SUPPLIER_REMARK].is_require ? localFields[newConstants.TICKET_SUPPLIER_REMARK].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column> */}
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"general.telephoneno1"} />}

                  name={newConstants.TICKET_SUPPLIER_TELENO1}
                  value={localFields[newConstants.TICKET_SUPPLIER_TELENO1].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_TELENO1].error && localFields[newConstants.TICKET_SUPPLIER_TELENO1].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_TELENO1].error && localFields[newConstants.TICKET_SUPPLIER_TELENO1].is_require ? localFields[newConstants.TICKET_SUPPLIER_TELENO1].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              {/* <Column md={3} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"ticketsupplier.telephoneno2"} />}

                  name={newConstants.TICKET_SUPPLIER_TELENO2}
                  value={localFields[newConstants.TICKET_SUPPLIER_TELENO2].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_TELENO2].error && localFields[newConstants.TICKET_SUPPLIER_TELENO2].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_TELENO2].error && localFields[newConstants.TICKET_SUPPLIER_TELENO2].is_require ? localFields[newConstants.TICKET_SUPPLIER_TELENO2].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"ticketsupplier.mobileno1"} />}

                  name={newConstants.TICKET_SUPPLIER_MOBILENO1}
                  value={localFields[newConstants.TICKET_SUPPLIER_MOBILENO1].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_MOBILENO1].error && localFields[newConstants.TICKET_SUPPLIER_MOBILENO1].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_MOBILENO1].error && localFields[newConstants.TICKET_SUPPLIER_MOBILENO1].is_require ? localFields[newConstants.TICKET_SUPPLIER_MOBILENO1].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"ticketsupplier.mobileno2"} />}
                 
                  name={newConstants.TICKET_SUPPLIER_MOBILENO2}
                  value={localFields[newConstants.TICKET_SUPPLIER_MOBILENO2].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_MOBILENO2].error && localFields[newConstants.TICKET_SUPPLIER_MOBILENO2].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_MOBILENO2].error && localFields[newConstants.TICKET_SUPPLIER_MOBILENO2].is_require
                      ? localFields[newConstants.TICKET_SUPPLIER_MOBILENO2].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column> */}
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"general.faxno1"} />}
                  name={newConstants.TICKET_SUPPLIER_FAX1}
                  value={localFields[newConstants.TICKET_SUPPLIER_FAX1].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_FAX1].error && localFields[newConstants.TICKET_SUPPLIER_FAX1].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_FAX1].error && localFields[newConstants.TICKET_SUPPLIER_FAX1].is_require ? localFields[newConstants.TICKET_SUPPLIER_FAX1].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"general.weburl"} />}
                  name={newConstants.TICKET_SUPPLIER_WEBURL}
                  value={localFields[newConstants.TICKET_SUPPLIER_WEBURL].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_WEBURL].error && localFields[newConstants.TICKET_SUPPLIER_WEBURL].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_WEBURL].error && localFields[newConstants.TICKET_SUPPLIER_WEBURL].is_require ?
                      localFields[newConstants.TICKET_SUPPLIER_WEBURL].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"general.email"} />}
                  name={newConstants.TICKET_SUPPLIER_EMAIL}
                  value={localFields[newConstants.TICKET_SUPPLIER_EMAIL].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUPPLIER_EMAIL].error && localFields[newConstants.TICKET_SUPPLIER_EMAIL].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_EMAIL].error && localFields[newConstants.TICKET_SUPPLIER_EMAIL].is_require ?
                      localFields[newConstants.TICKET_SUPPLIER_EMAIL].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              {/* <Column md={3} padding={[10, 5]}>
                <TextField
                  type="number"
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"Additional percentage"} />}
                  name={newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE}
                  value={localFields[newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE].error && localFields[newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE].is_require}
                  helperText={
                    localFields[newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE].error && localFields[newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE].is_require ?
                      localFields[newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="number"
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"Service percentage"} />}
                  name={newConstants.SUPPLIER_SERVICE_PERCENTAGE}
                  value={localFields[newConstants.SUPPLIER_SERVICE_PERCENTAGE].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.SUPPLIER_SERVICE_PERCENTAGE].error && localFields[newConstants.SUPPLIER_SERVICE_PERCENTAGE].is_require}
                  helperText={
                    localFields[newConstants.SUPPLIER_SERVICE_PERCENTAGE].error && localFields[newConstants.SUPPLIER_SERVICE_PERCENTAGE].is_require ?
                      localFields[newConstants.SUPPLIER_SERVICE_PERCENTAGE].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="number"
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id={"Tax percentage"} />}
                  name={newConstants.SUPPLIER_TAX_PERCENTAGE}
                  value={localFields[newConstants.SUPPLIER_TAX_PERCENTAGE].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.SUPPLIER_TAX_PERCENTAGE].error && localFields[newConstants.SUPPLIER_TAX_PERCENTAGE].is_require}
                  helperText={
                    localFields[newConstants.SUPPLIER_TAX_PERCENTAGE].error && localFields[newConstants.SUPPLIER_TAX_PERCENTAGE].is_require ?
                      localFields[newConstants.SUPPLIER_TAX_PERCENTAGE].err_msg : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TaxRuleName
                  label="tax rule"
                  name={newConstants.SUPPLIER_TAX_RULE_KEY}
                  value={localFields[[newConstants.SUPPLIER_TAX_RULE_KEY]].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.SUPPLIER_TAX_RULE_KEY].error && localFields[newConstants.SUPPLIER_TAX_RULE_KEY].is_require}
                  helperText={
                    localFields[newConstants.SUPPLIER_TAX_RULE_KEY].error && localFields[newConstants.SUPPLIER_TAX_RULE_KEY].is_require ? 'Incorrect entry.' : ''
                  }
                  variant="outlined"
                />
              </Column> */}
              <Column md={3} padding={[10, 5]}>
                <Currency
                  name={newConstants.LEDGER_CURR_CODE}
                  error={localFields[newConstants.LEDGER_CURR_CODE].error}
                  currency={localFields[newConstants.LEDGER_CURR_CODE].value}
                  onChange={stateUpdater}
                  helperText={localFields[newConstants.LEDGER_CURR_CODE].error ? localFields[newConstants.LEDGER_CURR_CODE].err_msg : ""}
                />
              </Column>
              {editData ? (
                <Column md={4} center>
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
                </Column>
              ) : (
                ''
              )}
              <Row>
                <Column md={12} padding={[10, 5]}>
                  <TicketType
                    name={newConstants.TICKET_TYPE_KEY}
                    values={localFields[newConstants.TICKET_TYPE_KEY]}
                    classes={classes}
                    stateUpdater={stateUpdater}
                    defaultValue={defaultValue} setDefaultValue={setDefaultValue} />
                </Column>
              </Row>
              <Row>
                <Column md={6} padding={[10, 5]}>
                  <GeneralLanguageContainer
                    multi_language={multi_language}
                    multiStateUpdater={multiStateUpdater}
                    constant={newConstants.TICKET_SUPPLIER_NAME}
                    fieldLabel='event.organizername'
                    isMoreFields={{ type: 'address', constant: newConstants.TICKET_SUPPLIER_ADDRESS, fieldLabel: 'general.address' }}
                    onchangeParam="Supplier_language"
                  />
                </Column>
              </Row>
              <Column right>
                <Row>
                  <Column md={9}></Column>

                  <Column right md={3}>
                    <Row style={{ placeContent: 'flex-end' }}>
                      <Button
                        size="small"
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
                            <LanguageConfig id={editData ? "general.update" : "general.save"} />
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
                        <LanguageConfig id={"general.cancel"} />
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


const LedgerGroupName = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null)

  useEffect(() => {
    LedgerByKey()
  }, [value, defaultOptions])
  useEffect(() => {
    loadLedger();
  }, [])

  const LedgerByKey = async () => {
    if (value && defaultOptions.length) {
      setSetectedValue(
        defaultOptions.filter((f) => f.value == value).length
          ? defaultOptions.filter((f) => f.value == value)[0]
          : null,
      );
    }
  }

  const loadLedger = async () => {
    const res = await httpPostRequest(LedgerAccountSupplier());
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultOptions(res[newConstants.DATA][newConstants.LEDGER_ACCOUNTS].map((value) =>
      ({
        value: value[newConstants.LEDGER_GROUP_KEY],
        label: value[newConstants.LEDGER_GROUP_NAME]
      })
      ));

    }
  }
  return (
    <SingelSelectOnDemand
      defaultOptions={selectValue ? [selectValue].concat(defaultOptions.filter(f => f.value != selectValue.value)) : defaultOptions}
      value={selectValue}
      name={name}
      loadOptions={loadLedger}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  )
}


const ModuleName = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null)

  useEffect(() => {
    moduleByKey()
  }, [value, defaultOptions])
  useEffect(() => {
    loadModale();
  }, [])

  const moduleByKey = async () => {
    if (value && defaultOptions.length) {
      setSetectedValue(
        defaultOptions.filter((f) => f.value == value).length
          ? defaultOptions.filter((f) => f.value == value)[0]
          : null,
      );
    }
  }

  const loadModale = async (inputValue = "", callback = null) => {
    const res = await httpPostRequest(getTicketModule(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(res[newConstants.DATA][newConstants.TICKET_MODULES].map((v) => ({ value: v[newConstants.TICKET_MODULE_KEY], label: v[newConstants.TICKET_MODULE_DESC] })));
      }
      else {
        setDefaultOptions(res[newConstants.DATA][newConstants.TICKET_MODULES].map((value) =>
        ({
          value: value[newConstants.TICKET_MODULE_KEY],
          label: value[newConstants.TICKET_MODULE_DESC]
        })
        ));
      }
    }
  }
  return (
    <SingelSelectOnDemand
      defaultOptions={selectValue ? [selectValue].concat(defaultOptions.filter(f => f.value != selectValue.value)) : defaultOptions}
      value={selectValue}
      name={name}
      loadOptions={loadModale}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  )
}



const TaxRuleName = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null)

  useEffect(() => {
    TaxByKey()
  }, [value, defaultOptions])
  useEffect(() => {
    TaxModale();
  }, [])

  const TaxByKey = async () => {
    if (value && defaultOptions.length) {
      setSetectedValue(
        defaultOptions.filter((f) => f.value == value).length
          ? defaultOptions.filter((f) => f.value == value)[0]
          : null,
      );
    }
  }

  const TaxModale = async (inputValue = "", callback = null) => {
    const res = await httpPostRequest(attractionSupplierTaxRule(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))
      }
      else {
        setDefaultOptions(res[newConstants.DATA].map((value) =>
        ({
          value: value[newConstants.TAX_RULE_KEY],
          label: value[newConstants.TAX_RULE_NAME]
        })
        ));
      }
    }
  }
  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions.concat(selectValue ? [selectValue] : [])}
      value={selectValue}
      name={name}
      loadOptions={TaxModale}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  )
}

const TicketType = ({ values, classes, stateUpdater, name, defaultValue, setDefaultValue }) => {
  useEffect(() => {
    loadOptions();
  }, []);
  const loadOptions = async (inputValue = '', callback = null) => {
    let res = await httpPostRequest(getAllAttractionTicketTypeY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res.data[newConstants.TICKET_TYPES].map((v) => ({
            value: v[newConstants.TICKET_TYPE_KEY],
            label: v[newConstants.TICKET_TYPE_NAME],
          })),
        );
      } else {
        setDefaultValue(
          res.data[newConstants.TICKET_TYPES].map((v) => ({
            value: v[newConstants.TICKET_TYPE_KEY],
            label: v[newConstants.TICKET_TYPE_NAME],
          })),
        );
      }
    }
  };
  return (
    <Row>
      <Column padding={[5, 0]}>
        <Text size={15} bold>
          <LanguageConfig id="event.tickettypes" />
        </Text>
      </Column>
      <Column padding={[5, 0]}>
        <SingelSelectOnDemand
          isMulti
          defaultOptions={defaultValue.concat(values[newConstants.VALUE])}
          value={values[newConstants.VALUE]}
          loadOptions={loadOptions}
          onChange={(e) => stateUpdater({ target: { value: e, name: name } })}
          placeholder={<LanguageConfig id="event.tickettypes" />}
          helperText={values.error ? 'Require Field.' : ''}
          error={values.error}
        />
      </Column>
    </Row>
  );
};
