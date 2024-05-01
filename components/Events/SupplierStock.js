import React, { useState, useEffect } from 'react';
import { TextField, Text, Card, Row, Column, Loader, CustomAlert, SingelSelectOnDemand } from '../../core';
import {
  Fade,
  InputLabel,
  Select,
  Button,
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
  Checkbox,
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Create, Delete } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { Add, Remove } from '@material-ui/icons';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import {
  createSupplierTicketStock,
  updateSupplierTicketStock,
  deleteSupplierTicketStock,
  getSupplierTicketStockByKey,
  getAllSupplierTicketStock,
  getTicketSupplier,
  getTicketKey,
  getAllTicket,
  getTicketByKey,
  getTicketPlan,
  getTicketPlanKey,
  getAllTicketType,
  getTicketTypeByKey,
} from '../../helper/RequestPayLoadEvents';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from "../PrimaryContainer"
import LanguageConfig from "../../helper/LanguageConfig";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    width: '40%',
    margin: 5,
    width: '30%',
    backgroundColor:"rgb(26, 43, 71)",
    color:"white",
    '&:hover': {
      backgroundColor:"rgb(26, 43, 71)",
    },
  },
  addButton: {
    margin: 5
  },
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
      backgroundColor:theme.palette.error.main,
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
  box:{
    flexGrow: 1,
    flexBasis: 0,
  },
  add:{
    backgroundColor:"rgb(26, 43, 71)",
    color:"white",
    margin: '5px',
    '&:hover': {
      backgroundColor:"rgb(26, 43, 71)",
    },
  },
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg } = useStore();
  const [deleteId, setDeleteId] = useState('');
  const [moduleKeys, setModuleKeys] = useState([
    { value: 'TjWRT/L+8VtPDQ8GBbuk27Z4CKlR6SG9KcLZDYq0wqA=', label: 'MANUAL ENTRY' },
  ]);
  const [supplierKeys, setSupplierKeys] = useState([
    { value: 'pXsP+kp6Mv1mRKilSNBSzxNDSU/+lpYsloMzgzQ2ml0=', label: 'MANUAL ENTRY' },
  ]);
  const [ticketKeys, setTicketKeys] = useState([
    { value: 'TjWRT/L+8VtPDQ8GBbuk27Z4CKlR6SG9KcLZDYq0wqA=', label: 'MANUAL ENTRY' },
  ]);
  const [planKeys, setPlanKeys] = useState([
    { value: 'TjWRT/L+8VtPDQ8GBbuk27Z4CKlR6SG9KcLZDYq0wqA=', label: 'MANUAL ENTRY' },
  ]);
  const [typeKeys, setTypeKeys] = useState([
    { value: 'TjWRT/L+8VtPDQ8GBbuk27Z4CKlR6SG9KcLZDYq0wqA=', label: 'MANUAL ENTRY' },
  ]);

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);


  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NO]: { is_hide: true, bool: true, label: <LanguageConfig id="supplierticketstock.sno" /> },
    [newConstants.TICKET_COST_PRICEB2C]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.costpriceb2c" /> },
    [newConstants.TICKET_COST_PRICEB2B]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.costpriceb2b" /> },
    [newConstants.TICKET_MRP_PRICE]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.mrpprice" /> },
    [newConstants.TICKET_STOCK]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.stock" /> },
    [newConstants.TICKET_PREFIX]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.prefix" /> },
   [newConstants.TICKET_CODE_LENGTH]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.codelength" /> },
   [newConstants.TICKET_SUFFIX]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.suffix" /> },
   [newConstants.TICKET_START_NUMBER]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.startnumber" /> },
   [newConstants.TICKET_END_NUMBER]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.endnumber" /> },
   [newConstants.IS_OPENING_STOCK_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.isopeningstock" /> },

  [newConstants.DATE_OF_PURCHASE]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.dateofpurchase" /> },

   [newConstants.PURCHASE_REF_NUMBER]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.purchaserefnumber" /> },

   [newConstants.IS_SOLD_OUT_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.issoldout" /> },
 
   [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.lastupdatedby" /> },
   [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="supplierticketstock.lastupdatedon" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="supplierticketstock.action" /> }
  });

  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getAllSupplierTicketStock(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.TICKET_STOCKS]);
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
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="supplierticketstock.tryagain" /> });
    }
  };

  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);


  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };
  const editSupplierStock = async (key) => {
    let res = await httpPostRequest(getSupplierTicketStockByKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
    }
    setAddEdit(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function deleteSupplierStock() {
    const res = await httpPostRequest(deleteSupplierTicketStock(deleteId));
    setDeleteLoader(deleteId);
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setDeleteLoader('');
      loadData();
      setDeleteId('');
    } else {
      setDeleteLoader('');
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="supplierticketstock.tryagain" /> });
    }
  }

  return (
    <div>
      <PrimaryContainer
        formName={<LanguageConfig id="supplierticketstock.supplierticketstock" />}
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
        filter_object={newConstants.ROW_NO}
        editRow={editSupplierStock}
        deleteRow={setDeleteId}
        action_key={newConstants.TICKET_STOCK_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="supplierticketstock.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={deleteSupplierStock}
        />
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
              moduleKeys={moduleKeys}
              supplierKeys={supplierKeys}
              ticketKeys={ticketKeys}
              planKeys={planKeys}
              typeKeys={typeKeys}
            />
          </Fade>
        }
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({
  classes,
  loadData,
  editData,
  setEditData,
  addEdit,
  setAddEdit,
  languages,
  setAlertMsg,
  moduleKeys,
  supplierKeys,
  ticketKeys,
  planKeys,
  typeKeys,
}) => {
  const [localFields, setLocalFields] = useState([]);
  const [ticketStockSerials, setTicketStockSerials] = useState([]);
  const [loader, setLoader] = useState(false);

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
        [newConstants.TICKET_SUPPLIER_KEY]: {
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
        [newConstants.TICKET_PLAN_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_TYPE_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_COST_PRICEB2C]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.TICKET_COST_PRICEB2B]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.TICKET_MRP_PRICE]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.TICKET_STOCK]: {
          value: '',
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.TICKET_PREFIX]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_CODE_LENGTH]: {
          value: '',
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.TICKET_SUFFIX]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_START_NUMBER]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_END_NUMBER]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_OPENING_STOCK]: {
          value: '',
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.DATE_OF_PURCHASE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.PURCHASE_REF_NUMBER]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_SOLD_OUT]: {
          value: '',
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
      });
      setTicketStockSerials([
        {
          [newConstants.BARCODE_NUMBER]: {
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.BARCODE_DATA]: {
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
        },
      ]);
    } else {
      setLocalFields({
        [newConstants.TICKET_MODULE_KEY]: {
          value: editData[newConstants.TICKET_MODULE_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_SUPPLIER_KEY]: {
          value: editData[newConstants.TICKET_SUPPLIER_KEY],
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
        [newConstants.TICKET_PLAN_KEY]: {
          value: editData[newConstants.TICKET_PLAN_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_TYPE_KEY]: {
          value: editData[newConstants.TICKET_TYPE_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_COST_PRICEB2C]: {
          value: editData[newConstants.TICKET_COST_PRICEB2C],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.TICKET_COST_PRICEB2B]: {
          value: editData[newConstants.TICKET_COST_PRICEB2B],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.TICKET_MRP_PRICE]: {
          value: editData[newConstants.TICKET_MRP_PRICE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.TICKET_STOCK]: {
          value: editData[newConstants.TICKET_STOCK],
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.TICKET_PREFIX]: {
          value: editData[newConstants.TICKET_PREFIX],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_CODE_LENGTH]: {
          value: editData[newConstants.TICKET_CODE_LENGTH],
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.TICKET_SUFFIX]: {
          value: editData[newConstants.TICKET_SUFFIX],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_START_NUMBER]: {
          value: editData[newConstants.TICKET_START_NUMBER],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_END_NUMBER]: {
          value: editData[newConstants.TICKET_END_NUMBER],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_OPENING_STOCK]: {
          value: editData[newConstants.IS_OPENING_STOCK],
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.DATE_OF_PURCHASE]: {
          value: editData[newConstants.DATE_OF_PURCHASE],
          is_require: true,
          error: false,
        },
        [newConstants.PURCHASE_REF_NUMBER]: {
          value: editData[newConstants.PURCHASE_REF_NUMBER],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_SOLD_OUT]: {
          value: editData[newConstants.IS_SOLD_OUT],
          is_require: true,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
      });
      let ticketStockSerials_ = [];
      if (editData[newConstants.TICKET_STOCK_SERIALS] && editData[newConstants.TICKET_STOCK_SERIALS].length) {
        editData[newConstants.TICKET_STOCK_SERIALS].forEach((value) => {
          ticketStockSerials_.push({
            [newConstants.BARCODE_NUMBER]: {
              value: value[newConstants.BARCODE_NUMBER],
              is_require: false,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.BARCODE_DATA]: {
              value: value[newConstants.BARCODE_DATA],
              is_require: false,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
          });
        });
      } else {
        ticketStockSerials_.push({
          [newConstants.BARCODE_NUMBER]: {
            value: editData[newConstants.BARCODE_NUMBER],
            is_require: false,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.BARCODE_DATA]: {
            value: editData[newConstants.BARCODE_DATA],
            is_require: false,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
        });
      }
      setTicketStockSerials(ticketStockSerials_);
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

  function ticketSerialStateUpdater(e, index) {
    let ticketStockSerials_ = _.cloneDeep(ticketStockSerials);
    if (e.target.value.length == 0) {
      ticketStockSerials_[index][e.target.name].error = ticketStockSerials_[index][e.target.name].is_require ? true : false;
      ticketStockSerials_[index][e.target.name].value = e.target.value;
    } else {
      ticketStockSerials_[index][e.target.name].value = e.target.value;
      ticketStockSerials_[index][e.target.name].error = false;
    }
    setTicketStockSerials(ticketStockSerials_);
  }

  function removeMultiTicketSerials(index_) {
    let ticketStockSerials_ = _.cloneDeep(ticketStockSerials);
    if (ticketStockSerials_.length > 1) {
      ticketStockSerials_ = ticketStockSerials_.map((val, index) => (index != index_ ? val : null));
      setTicketStockSerials(ticketStockSerials_.filter((f) => f != null));
    }
  }

  const addMultiTicketSerials = () => {
    let ticketStockSerials_ = _.cloneDeep(ticketStockSerials);
    if (
      languages.filter((f) => !ticketStockSerials.map((val) => val[newConstants.BARCODE_NUMBER].value).includes(f.code))
        .length
    ) {
      ticketStockSerials_.push({
        [newConstants.BARCODE_NUMBER]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.BARCODE_DATA]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      });
      setTicketStockSerials(ticketStockSerials_);
    }
  };

  const save = async () => {
    let ticketStockSerials_validator = _.cloneDeep(ticketStockSerials);
    ticketStockSerials_validator = ticketStockSerials_validator.map((value) => validator(value));

    if (ticketStockSerials_validator.filter((f) => f.err == true).length) {
      setTicketStockSerials(ticketStockSerials_validator.map((value) => value.values));
    }

    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }

    if (!localFields_validation.err && ticketStockSerials_validator.filter((f) => f.err).length == 0) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createSupplierTicketStock(localFields, ticketStockSerials));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: <LanguageConfig id="supplierticketstock.successfullysave" /> });
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="supplierticketstock.tryagain" /> });
        }
      } else {
        let res = await httpPostRequest(
          updateSupplierTicketStock(editData[newConstants.TICKET_STOCK_KEY], localFields, ticketStockSerials),
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: <LanguageConfig id="supplierticketstock.successfullyupdate" /> });
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="supplierticketstock.tryagain" /> });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="supplierticketstock.fillrequired" /> });
    }
  };

  return (
    <div>
      {localFields.hasOwnProperty(newConstants.TICKET_STOCK) ? (
        <Row padding={[10]}>
          <Column padding={[8]}>
            <Text bold size={16}>
              <LanguageConfig id={editData ? "supplierticketstock.addticketstock" : "supplierticketstock.editticketstock"} />
            </Text>
          </Column>
          <Column padding={[10]}>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="ticket-cost-priceb2c-id"
                  label={<LanguageConfig id={"supplierticketstock.costpriceb2c"} />}
                  type="number"
                  inputProps={{ min: 1 }}
                  name={newConstants.TICKET_COST_PRICEB2C}
                  value={localFields[newConstants.TICKET_COST_PRICEB2C].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_COST_PRICEB2C].error &&
                    localFields[newConstants.TICKET_COST_PRICEB2C].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_COST_PRICEB2C].error &&
                      localFields[newConstants.TICKET_COST_PRICEB2C].is_require
                      ? localFields[newConstants.TICKET_COST_PRICEB2C].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="ticket-cost-priceb2B-id"
                  label={<LanguageConfig id={"supplierticketstock.costpriceb2b"} />}
                  type="number"
                  inputProps={{ min: 1 }}
                  name={newConstants.TICKET_COST_PRICEB2B}
                  value={localFields[newConstants.TICKET_COST_PRICEB2B].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_COST_PRICEB2B].error &&
                    localFields[newConstants.TICKET_COST_PRICEB2B].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_COST_PRICEB2B].error &&
                      localFields[newConstants.TICKET_COST_PRICEB2B].is_require
                      ? localFields[newConstants.TICKET_COST_PRICEB2B].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="ticket-mrp-price-id"
                  label={<LanguageConfig id={"supplierticketstock.mrpprice"} />}
                  type="number"
                  inputProps={{ min: 1 }}
                  name={newConstants.TICKET_MRP_PRICE}
                  value={localFields[newConstants.TICKET_MRP_PRICE].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_MRP_PRICE].error && localFields[newConstants.TICKET_MRP_PRICE].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_MRP_PRICE].error && localFields[newConstants.TICKET_MRP_PRICE].is_require
                      ? localFields[newConstants.TICKET_MRP_PRICE].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="ticket-stock-id"
                  label={<LanguageConfig id={"supplierticketstock.stock"} />}
                  type="number"
                  inputProps={{ min: 1 }}
                  name={newConstants.TICKET_STOCK}
                  value={localFields[newConstants.TICKET_STOCK].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_STOCK].error && localFields[newConstants.TICKET_STOCK].is_require}
                  helperText={
                    localFields[newConstants.TICKET_STOCK].error && localFields[newConstants.TICKET_STOCK].is_require
                      ? localFields[newConstants.TICKET_STOCK].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="ticket-module-key-id">Module</InputLabel>
                  <Select
                    size="small"
                    label={<LanguageConfig id={"supplierticketstock.module"} />}
                    labelId="ticket-module-key-label"
                    id="ticket-module-key"
                    name={newConstants.TICKET_MODULE_KEY}
                    value={localFields[newConstants.TICKET_MODULE_KEY].value}
                    onChange={stateUpdater}
                    error={
                      localFields[newConstants.TICKET_MODULE_KEY].error &&
                      localFields[newConstants.TICKET_MODULE_KEY].is_require
                    }
                    helperText={
                      localFields[newConstants.TICKET_MODULE_KEY].error &&
                        localFields[newConstants.TICKET_MODULE_KEY].is_require
                        ? localFields[newConstants.TICKET_MODULE_KEY].err_msg
                        : ''
                    }
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {moduleKeys.map((value, index) => (
                      <MenuItem key={'module_' + index} value={value.value}>
                        {value.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Column>
              <Column md={3} padding={[10, 5]}>
                <SupplierName
                  name={newConstants.TICKET_SUPPLIER_KEY}
                  value={localFields[newConstants.TICKET_SUPPLIER_KEY].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_SUPPLIER_KEY].error &&
                    localFields[newConstants.TICKET_SUPPLIER_KEY].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_SUPPLIER_KEY].error &&
                      localFields[newConstants.TICKET_SUPPLIER_KEY].is_require
                      ? localFields[newConstants.TICKET_SUPPLIER_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id={"supplierticketstock.supplier"} />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TicketName
                  name={newConstants.TICKET_KEY}
                  value={localFields[newConstants.TICKET_KEY].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_KEY].error && localFields[newConstants.TICKET_KEY].is_require}
                  helperText={
                    localFields[newConstants.TICKET_KEY].error && localFields[newConstants.TICKET_KEY].is_require
                      ? localFields[newConstants.TICKET_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id={"supplierticketstock.ticket"} />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TicketPlan
                  name={newConstants.TICKET_PLAN_KEY}
                  value={localFields[newConstants.TICKET_PLAN_KEY].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_PLAN_KEY].error && localFields[newConstants.TICKET_PLAN_KEY].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_PLAN_KEY].error && localFields[newConstants.TICKET_PLAN_KEY].is_require
                      ? localFields[newConstants.TICKET_PLAN_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id={"supplierticketstock.ticketplan"} />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TicketType
                  name={newConstants.TICKET_TYPE_KEY}
                  value={localFields[newConstants.TICKET_TYPE_KEY].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_TYPE_KEY].error && localFields[newConstants.TICKET_TYPE_KEY].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_TYPE_KEY].error && localFields[newConstants.TICKET_TYPE_KEY].is_require
                      ? localFields[newConstants.TICKET_TYPE_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id={"supplierticketstock.tickettype"} />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="ticket-prefix"
                  label={<LanguageConfig id={"supplierticketstock.prefix"} />}
                  name={newConstants.TICKET_PREFIX}
                  value={localFields[newConstants.TICKET_PREFIX].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_PREFIX].error && localFields[newConstants.TICKET_PREFIX].is_require}
                  helperText={
                    localFields[newConstants.TICKET_PREFIX].error && localFields[newConstants.TICKET_PREFIX].is_require
                      ? localFields[newConstants.TICKET_PREFIX].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="ticket-code-length"
                  label={<LanguageConfig id={"supplierticketstock.codelength"} />}
                  type="number"
                  inputProps={{ min: 1 }}
                  name={newConstants.TICKET_CODE_LENGTH}
                  value={localFields[newConstants.TICKET_CODE_LENGTH].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_CODE_LENGTH].error &&
                    localFields[newConstants.TICKET_CODE_LENGTH].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_CODE_LENGTH].error &&
                      localFields[newConstants.TICKET_CODE_LENGTH].is_require
                      ? localFields[newConstants.TICKET_CODE_LENGTH].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>

              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="ticket-suffix"
                  label={<LanguageConfig id={"supplierticketstock.suffix"} />}
                  name={newConstants.TICKET_SUFFIX}
                  value={localFields[newConstants.TICKET_SUFFIX].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_SUFFIX].error && localFields[newConstants.TICKET_SUFFIX].is_require}
                  helperText={
                    localFields[newConstants.TICKET_SUFFIX].error && localFields[newConstants.TICKET_SUFFIX].is_require
                      ? localFields[newConstants.TICKET_SUFFIX].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="ticket-start-number"
                  label={<LanguageConfig id={"supplierticketstock.startnumber"} />}
                  name={newConstants.TICKET_START_NUMBER}
                  value={localFields[newConstants.TICKET_START_NUMBER].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_START_NUMBER].error &&
                    localFields[newConstants.TICKET_START_NUMBER].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_START_NUMBER].error &&
                      localFields[newConstants.TICKET_START_NUMBER].is_require
                      ? localFields[newConstants.TICKET_START_NUMBER].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="ticket-end-number"
                  label={<LanguageConfig id={"supplierticketstock.endnumber"} />}
                  name={newConstants.TICKET_END_NUMBER}
                  value={localFields[newConstants.TICKET_END_NUMBER].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.TICKET_END_NUMBER].error &&
                    localFields[newConstants.TICKET_END_NUMBER].is_require
                  }
                  helperText={
                    localFields[newConstants.TICKET_END_NUMBER].error &&
                      localFields[newConstants.TICKET_END_NUMBER].is_require
                      ? localFields[newConstants.TICKET_END_NUMBER].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                {/* <SingleDatePicker
                  label="Date of Purchase"
                  value={localFields[newConstants.DATE_OF_PURCHASE].value}
                  setNewDate={stateUpdater}
                  name={newConstants.DATE_OF_PURCHASE}
                /> */}
                <TextField
                  id="ticket-date-of-purchase"
                  label={<LanguageConfig id={"supplierticketstock.dateofpurchase"} />}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name={newConstants.DATE_OF_PURCHASE}
                  value={localFields[newConstants.DATE_OF_PURCHASE].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.DATE_OF_PURCHASE].error && localFields[newConstants.DATE_OF_PURCHASE].is_require
                  }
                  helperText={
                    localFields[newConstants.DATE_OF_PURCHASE].error && localFields[newConstants.DATE_OF_PURCHASE].is_require
                      ? 'Incorrect entry.'
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="ticket-purchase-ref-number"
                  label={<LanguageConfig id={"supplierticketstock.purchaserefnumber"} />}
                  name={newConstants.PURCHASE_REF_NUMBER}
                  value={localFields[newConstants.PURCHASE_REF_NUMBER].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.PURCHASE_REF_NUMBER].error &&
                    localFields[newConstants.PURCHASE_REF_NUMBER].is_require
                  }
                  helperText={
                    localFields[newConstants.PURCHASE_REF_NUMBER].error &&
                      localFields[newConstants.PURCHASE_REF_NUMBER].is_require
                      ? localFields[newConstants.PURCHASE_REF_NUMBER].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 20]} center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFields[newConstants.IS_OPENING_STOCK].value}
                      color="primary"
                      onChange={() =>
                        setLocalFields({
                          ...localFields,
                          [newConstants.IS_OPENING_STOCK]: {
                            ...localFields[newConstants.IS_OPENING_STOCK],
                            value: !localFields[newConstants.IS_OPENING_STOCK].value,
                          },
                        })
                      }
                      name={newConstants.IS_OPENING_STOCK}
                    />
                  }
                  label={<LanguageConfig id={"supplierticketstock.isopeningstock"} />}
                />
              </Column>

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
                  label={<LanguageConfig id={"supplierticketstock.issoldout"} />}
                />
              </Column>

              <Column padding={[10, 5]}>
                <Row>
                  <Column>
                    <Text size={14} bold style={{ marginRight: 5 }}>
                      Ticket Stock serials
                    </Text>
                  </Column>
                  {ticketStockSerials.map((value, index) => (
                    <Column md={3} padding={[5]} key={index + 'country_code'}>
                      <Card padding={[10]} className={classes.box}>
                        <Row>
                          <Column padding={[5]}>
                            <TextField
                              id="ticket-barcode-number"
                              label={<LanguageConfig id={"supplierticketstock.barcodenumber"} />}
                              name={newConstants.BARCODE_NUMBER}
                              value={value[newConstants.BARCODE_NUMBER].value}
                              onChange={(e) => ticketSerialStateUpdater(e, index)}
                              error={
                                value[newConstants.BARCODE_NUMBER].error && value[newConstants.BARCODE_NUMBER].is_require
                              }
                              helperText={
                                value[newConstants.BARCODE_NUMBER].error && value[newConstants.BARCODE_NUMBER].is_require
                                  ? value[newConstants.BARCODE_NUMBER].err_msg
                                  : ''
                              }
                              variant="outlined"
                            />
                          </Column>
                          <Column padding={[5]}>
                            <TextField
                              id="ticket-barcode-date"
                              label={<LanguageConfig id={"supplierticketstock.barcodedata"} />}
                              name={newConstants.BARCODE_DATA}
                              value={value[newConstants.BARCODE_DATA].value}
                              onChange={(e) => ticketSerialStateUpdater(e, index)}
                              error={value[newConstants.BARCODE_DATA].error && value[newConstants.BARCODE_DATA].is_require}
                              helperText={
                                value[newConstants.BARCODE_DATA].error && value[newConstants.BARCODE_DATA].is_require
                                  ? value[newConstants.BARCODE_DATA].err_msg
                                  : ''
                              }
                              variant="outlined"
                            />
                          </Column>
                          <Column
                            md={ticketStockSerials.length > 1 && ticketStockSerials.length - 1 == index ? 4 : 9}
                            xs={ticketStockSerials.length > 1 && ticketStockSerials.length - 1 == index ? 5 : 9}
                            sm={ticketStockSerials.length > 1 && ticketStockSerials.length - 1 == index ? 5 : 9}></Column>
                          <Column
                            md={ticketStockSerials.length > 1 && ticketStockSerials.length - 1 == index ? 8 : 3}
                            xs={ticketStockSerials.length > 1 && ticketStockSerials.length - 1 == index ? 7 : 3}
                            sm={ticketStockSerials.length > 1 && ticketStockSerials.length - 1 == index ? 7 : 3}>
                            <Row className={classes.endPadd}>
                              {ticketStockSerials.length > 1 ? (
                                <Button
                                  onClick={() => removeMultiTicketSerials(index)}
                                  className={classes.addEdit}
                                  size="small"
                                  variant="contained"
                                  color="primary">
                                  <Remove />
                                </Button>
                              ) : null}
                              {ticketStockSerials.length - 1 == index ? (
                                <Button onClick={addMultiTicketSerials} size="small" variant="contained" className={classes.add}>
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
                        disabled={editData ? true : false}
                        onClick={loader ? console.log('') : save}>
                        <Row>
                          {loader ? (
                            <Column md={1} xs={1} sm={1} center middle>
                              <Loader size={14} color={'white'} />
                            </Column>
                          ) : null}
                          <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} center middle sm={loader ? 11 : 12}>
                            <LanguageConfig id={editData ? "supplierticketstock.update" : "supplierticketstock.add"} />
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
                        <LanguageConfig id={"supplierticketstock.cancel"} />
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

const SupplierName = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);

  useEffect(() => {
    ticketByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadTicket();
  }, []);

  const ticketByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getTicketKey(value));
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

  const loadTicket = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getTicketSupplier(inputValue));
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
      defaultOptions={defaultOptions.concat(selectValue ? [selectValue] : [])}
      value={selectValue}
      name={name}
      loadOptions={loadTicket}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const TicketName = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);

  useEffect(() => {
    nameByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadTicketName();
  }, []);

  const nameByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getTicketByKey(value));
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

  const loadTicketName = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllTicket(inputValue));
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
      loadOptions={loadTicketName}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const TicketPlan = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);

  useEffect(() => {
    planByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadPlan();
  }, []);

  const planByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getTicketPlanKey(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.TICKET_PLAN_NAME],
          value: res[newConstants.DATA][newConstants.TICKET_PLAN_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadPlan = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getTicketPlan(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.TICKET_PLANS].map((v) => ({
            value: v[newConstants.TICKET_PLAN_KEY],
            label: v[newConstants.TICKET_PLAN_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.TICKET_PLANS].map((v) => ({
            value: v[newConstants.TICKET_PLAN_KEY],
            label: v[newConstants.TICKET_PLAN_NAME],
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
      loadOptions={loadPlan}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const TicketType = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);

  useEffect(() => {
    typeByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadType();
  }, []);

  const typeByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getTicketTypeByKey(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.TICKET_TYPE_NAME],
          value: res[newConstants.DATA][newConstants.TICKET_TYPE_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadType = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllTicketType(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.TICKET_TYPES].map((v) => ({
            value: v[newConstants.TICKET_TYPE_KEY],
            label: v[newConstants.TICKET_TYPE_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.TICKET_TYPES].map((v) => ({
            value: v[newConstants.TICKET_TYPE_KEY],
            label: v[newConstants.TICKET_TYPE_NAME],
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
      loadOptions={loadType}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};
