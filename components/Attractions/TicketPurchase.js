import React, { useState, useEffect } from 'react';
import { Text, TextField, Card, Row, Column, Loader, CustomAlert, SingelSelectOnDemand, ExcelUpload, ModalComponent } from '../../core';
import {
    Fade,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Paper,
    Button,
} from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import {
    AttractionTicketPlanByTicketKey,
    getAllAttractionPurchase,
    AttractionTicketpurchaseinvoiceKey,
    getAttractionTicketKey,
    supplyKeyByTicketKey,
    getEventTicketSupplier,
    createAttractionTicketPurchaseInvoice,
    getTicketPlan,
    getTicketAmenityByKey,
    deleteTicketAmenity,
    updateTicketAmenity,
    purchaseInvoiceProcessExcel,
    getAttractionActiveYTicketSupplier,
} from '../../helper/RequestPayLoadAttractions';
import LanguageConfig from "../../helper/LanguageConfig";
import { httpPostRequest, validator } from '../../helper/JsHelper';
import { constants, newConstants } from '../../helper/constants';
import { useStore } from '../../helper/Store';
import PrimaryContainer from "../PrimaryContainer"


let purchaseModuleA = {
    [newConstants.TICKET_TYPE_NAME]: {
        value: '',
        is_require: false,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
    },
    [newConstants.TICKET_QUANTITY]: {
        value: '',
        is_require: true,
        error: false,
        type: 'number',
        err_msg: '',
    },
    [newConstants.TICKET_TYPE_KEY]: {
        value: '',
        is_require: true,
        error: false,
        type: 'dropdown',
        err_msg: '',
    },
    [newConstants.TICKET_STOCK_KEY]: {
        value: '',
        is_require: true,
        error: false,
        type: 'dropdown',
        err_msg: '',
    },
    [newConstants.IS_ZERO_COST]: {
        value: '',
        is_require: true,
        error: false,
        type: 'boolean',
        err_msg: '',
    },
    [newConstants.TICKET_COST]: {
        value: '',
        is_require: true,
        error: false,
        type: 'price',
        err_msg: '',
    },
    [newConstants.TICKET_MRP]: {
        value: '',
        is_require: true,
        error: false,
        type: 'price',
        err_msg: '',
    },

}
let purchaseModuleB = {
    [newConstants.TICKET_CODE_LENGTH]: {
        value: '',
        is_require: false,
        error: false,
        type: 'number',
        err_msg: '',
    },
    [newConstants.TICKET_SUFFIX]: {
        value: '',
        is_require: false,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
    },
    [newConstants.TICKET_START_NUMBER]: {
        value: '',
        is_require: false,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
    },
    [newConstants.TICKET_END_NUMBER]: {
        value: '',
        is_require: false,
        error: false,
        type: 'number',
        err_msg: '',
    },
    [newConstants.TICKET_PREFIX]: {
        value: '',
        is_require: false,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
    },
}

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    addEdit: {
        marginLeft: 4,
        marginRight: 4,
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
    tableBodyTuple: {
        color: 'black',
        fontSize: '.8rem',
        fontWeight: '1000',
        padding: 15,
        width: 'clamp(150px,10vw,300px)',
        whiteSpace: "nowrap !important",
      },
      TableContain: {
        maxWidth: "300px",
        minWidth: "100%"
      },
      tableHeadTuple: {
        color: 'blue',
        fontSize: '.8rem',
        fontWeight: '1000',
        padding: 15,
        textTransform: 'uppercase',
        width: 'clamp(150px,10vw,300px)',
        whiteSpace: "nowrap !important",
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
    DateTime: {
        color: "rgb(104, 150, 194)",
        fontWeight: 600
    }
}));

export default function Setup() {
    const classes = useStyles();
    const [addEdit, setAddEdit] = useState(false);
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [editData, setEditData] = useState(null);
    const { languages, setAlertMsg, formname} = useStore();
    const [deleteLoader, setDeleteLoader] = useState('');
    const [deleteId, setDeleteId] = useState('');

    // for pagination
    const [search_key, setSearchKey] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currIndex, setCurrIndex] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    const [showCol, setShowCol] = useState({
        [newConstants.ROW_NUMBER]: { is_hide: false, bool: true, label: "SNo" },
        [newConstants.SUPPLIER_NAME]: { is_hide: false, bool: true, label: "Ticket name" },
        [newConstants.INVOICE_COST]: { is_hide: false, bool: true, label: "Cost" },
        [newConstants.INVOICE_AMOUNT]: { is_hide: false, bool: true, label: "Amount" },
        [newConstants.INVOICE_STATUS]: { is_hide: false, bool: true, label: "Amount" },
        [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: "Last Updated By" },
        [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: "Last Updated On" },
        // action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="action" /> }
    });

    const loadData = async () => {
        setLoader(true);
        let res = await httpPostRequest(getAllAttractionPurchase(search_key, (currIndex - 1) * pageSize + 1, pageSize));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
            setData(res[constants.DATA][newConstants.PURCHASE_INVOICES] ? res[constants.DATA][newConstants.PURCHASE_INVOICES] : []);
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
            setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
    };
    useEffect(() => {
        loadData();
    }, [addEdit, search_key, pageSize, currIndex]);

    const search = (e) => {
        setSearchKey(e.target.value);
        setCurrIndex(1);
    };
    async function edit(key) {
        setAddEdit(false)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        let res = await httpPostRequest(getTicketAmenityByKey(key));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
            setEditData(res[constants.DATA]);
        }
        setAddEdit(true);

    }
    const deleteAmmunityCall = async () => {
        const res = await httpPostRequest(deleteTicketAmenity(deleteId));
        setDeleteLoader(deleteId);
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
            setDeleteLoader('');
            loadData();
            setDeleteId('');
        } else {
            setDeleteLoader('');
            setAlertMsg({ type: 'error', msg: 'Please try again later.' });
        }
    };

    return (
        <div>
            <Card margin={[0, 0, 10, 0]}>
                {addEdit ? (
                    <Column>
                        <Fade in={addEdit}>
                            <EditContainer
                                loadData={loadData}
                                languages={languages}
                                setAlertMsg={setAlertMsg}
                                editData={editData}
                                setEditData={setEditData}
                                setAddEdit={setAddEdit}
                                addEdit={addEdit}
                                classes={classes}
                            />
                        </Fade>
                    </Column>
                ) : null}
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
                filter_object={newConstants.ROW_NUMBER}
                editRow={edit}
                deleteRow={setDeleteId}
                action_key={newConstants.TICKET_SUPPLIER_KEY}
                loader={loader}
                deleteLoader={deleteLoader}
                setEditData={setEditData}>
                <CustomAlert
                    message={'Are you sure, you are deleting a recoard.'}
                    open={deleteId != ''}
                    setOpen={setDeleteId}
                    action={deleteAmmunityCall}
                />
            </PrimaryContainer>
        </div>
    );
}

const EditContainer = ({ classes, setEditData, languages, addEdit, setAddEdit, editData, setAlertMsg, loadData }) => {
    const [localFields, setLocalFields] = useState([]);
    const [purchaseDetails, setPurchaseDetails] = useState([])
    const [invoiceExcel, setInvoiceExcel] = useState([]);
    const [supplierKey, setSupplierKey] = useState("");
    const [ticketKeys, setTicketKeys] = useState([]);
    const [ticketValue, setTicketvalue] = useState("")
    const [stockKeys, setStockKeys] = useState([]);
    const [purchaseModule, setPurchaseModule] = useState("");
    const [processExcel, setProcessExcel] = useState(false)
    const [loader, setLoader] = useState(false);
    const [ticketplan, setTicketPlan] = useState([])

    useEffect(() => {
        setLocalFields({
            [newConstants.TICKET_SUPPLIER_KEY]: {
                value: "",
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
            [newConstants.INVOICE_REF_NUMBER]: {
                value: "",
                is_require: true,
                error: false,
                max_length: null,
                min_length: 4,
                type: 'text',
                err_msg: '',
            },
            [newConstants.INVOICE_DATE]: {
                value: '',
                is_require: true,
                error: false,
            },
            [newConstants.EXPIRY_DAYS]: {
                value: '',
                is_require: true,
                error: false,
                type: 'number',
                err_msg: '',
            }
        })

    }, []);
    
    const getModuleDetails = async (supplierKey) => {
        let res = await httpPostRequest(AttractionTicketpurchaseinvoiceKey(supplierKey));
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA] != null && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
            setPurchaseModule(res[newConstants.DATA][newConstants.SUPPLIER_MODULE_CODE] != null ? res[newConstants.DATA][newConstants.SUPPLIER_MODULE_CODE] : "")
            setTicketKeys(res[newConstants.DATA][newConstants.SUPPLIER_TICKETS] ? res[newConstants.DATA][newConstants.SUPPLIER_TICKETS] : []);
            setStockKeys(res[newConstants.DATA][newConstants.SUPPLIER_TICKET_TYPES] != null ? res[newConstants.DATA][newConstants.SUPPLIER_TICKET_TYPES] : [])
            if (res[newConstants.DATA][newConstants.SUPPLIER_TICKET_TYPES] != null) {
                if (res[newConstants.DATA][newConstants.SUPPLIER_MODULE_CODE] == "MODULE_A" || res[newConstants.DATA][newConstants.SUPPLIER_MODULE_CODE] == "MODULE_B") {
                    let purchaseDetails_ = []
                    for (let index = 0; index < res[newConstants.DATA][newConstants.SUPPLIER_TICKET_TYPES].length; index++) {
                        purchaseDetails_.push(_.cloneDeep(purchaseModuleA))
                    }
                    setPurchaseDetails(purchaseDetails_)
                }
                else if (res[newConstants.DATA][newConstants.SUPPLIER_MODULE_CODE] == "MODULE_C" || res[newConstants.DATA][newConstants.SUPPLIER_MODULE_CODE] == "MODULE_D" || res[newConstants.DATA][newConstants.SUPPLIER_MODULE_CODE] == "MODULE_E") {
                    let purchaseDetails_ = []
                    for (let index = 0; index < res[newConstants.DATA][newConstants.SUPPLIER_TICKET_TYPES].length; index++) {
                        purchaseDetails_.push({ ..._.cloneDeep(purchaseModuleA), ..._.cloneDeep(purchaseModuleB) })
                    }
                    setPurchaseDetails(purchaseDetails_)
                }
            }
            else {
                setPurchaseDetails([])
                setAlertMsg({ type: 'error', msg: 'Could Not Found Module, Please Different Supplier' });
            }
            setTicketPlan([])
            setTicketvalue("")
        }
        else {
            setPurchaseModule("")
            setTicketPlan([])
            setTicketKeys([])
            setStockKeys([])
            setPurchaseDetails([])
            setTicketvalue("")
            setAlertMsg({ type: 'error', msg: 'Could Not Found Module, Please Different Supplier' });
        }
    }


    useEffect(() => {
        if (supplierKey) {
            getModuleDetails(supplierKey)
        }
    }, [supplierKey])



    function fileStateUpdater(e) {
        if (e.target.value && e.target.value.length == 0) {
            setAlertMsg({ type: 'error', msg: 'File Could Not be processed' });
        } else {
            setInvoiceExcel(e.target.value)
        }

    }


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
        if (tag == 'list_check') {
            let purchaseDetails_ = _.cloneDeep(purchaseDetails);
            if (e.target.value == '') {
                purchaseDetails_[index][e.target.name].error = purchaseDetails_[index][e.target.name].is_require ? true : false;
                purchaseDetails_[index][e.target.name].value = e.target.value;
            } else {
                purchaseDetails_[index][e.target.name].value = e.target.value === 'true' ? false : true;
                purchaseDetails_[index][e.target.name].error = false;
            }
            setPurchaseDetails(purchaseDetails_);
        }
        else {
            let purchaseDetails_ = _.cloneDeep(purchaseDetails);
            if (e.target.value.length == 0) {
                purchaseDetails_[index][e.target.name].error = purchaseDetails_[index][e.target.name].is_require ? true : false;
                purchaseDetails_[index][e.target.name].value = e.target.value;
            } else {
                purchaseDetails_[index][e.target.name].value = e.target.value;
                purchaseDetails_[index][e.target.name].error = false;
            }
            setPurchaseDetails(purchaseDetails_);
        }
    }

    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const save = async () => {
        let purchaseDetails_validator = _.cloneDeep(purchaseDetails);
        purchaseDetails_validator = purchaseDetails_validator.map((value) => validator(value));
        if (purchaseDetails_validator.filter((f) => f.err == true).length) {
            setPurchaseDetails(purchaseDetails_validator.map((value) => value.values));
        }

        let localFields_validation = _.cloneDeep(localFields);
        localFields_validation = validator(localFields_validation);
        if (localFields_validation.err) {
            setLocalFields(localFields_validation.values);
        }

        if (!localFields_validation.err && purchaseDetails_validator.filter((f) => f.err).length == 0) {
            setLoader(true);
            if (editData == null) {
                let res = await httpPostRequest(createAttractionTicketPurchaseInvoice(localFields, purchaseDetails, purchaseModule == "MODULE_A" ? invoiceExcel : [],purchaseModule));
                if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
                    setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
                    loadData();
                    setLoader(false);
                    setAddEdit(false);
                } else if (res &&
                    res[constants.DATA_EXCEPTION] &&
                    res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 502 &&
                    res[constants.DATA_EXCEPTION][constants.ERR_MSG] == "Ticket  start number length and end number length differ") {
                    setLoader(false);
                    setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
                }
                else {
                    setLoader(false);
                    setAlertMsg({ type: 'error', msg: 'Try again later.' });
                }
            } else {
                let res = await httpPostRequest(updateTicketAmenity(editData['ticket-amenity-key'], localFields, multi_language));
                if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
                    setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
                    loadData();
                    setLoader(false);
                    setAddEdit(false);
                    setEditData(null);
                } else {
                    setLoader(false);
                    setAlertMsg({ type: 'error', msg: 'Try again later.' });
                }
            }
        } else {
            setAlertMsg({ type: 'error', msg: 'Please fill all the require fileds.' });
        }
    };


    const getEventTicketPlanByKey = async (ticketValue) => {
        let res = await httpPostRequest(AttractionTicketPlanByTicketKey(ticketValue));
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
            setTicketPlan(res[newConstants.DATA])
        }
        else {
            setTicketPlan([])
            setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
        }
    }

    useEffect(() => {
        if (ticketValue) {
            getEventTicketPlanByKey(ticketValue)
        }
    }, [ticketValue])

    return localFields.hasOwnProperty(newConstants.TICKET_SUPPLIER_KEY) ? (
        <Row padding={[10]}>
            {/* <Column padding={[8]}>
                <Text bold size={16}>
                    {'Add Ticket Stock'}
                </Text>
            </Column> */}
            <Column padding={[10]}>
                <Row>
                    <Column md={3} padding={[10, 5]}>
                        <SupplierName
                            name={newConstants.TICKET_SUPPLIER_KEY}
                            value={localFields[newConstants.TICKET_SUPPLIER_KEY].value}
                            onChange={(e) => {
                                setSupplierKey(e.target.value)
                                stateUpdater(e)
                                // stateUpdater({target:{name:newConstants.TICKET_KEY,value:""}})
                            }}
                            error={
                                localFields[newConstants.TICKET_SUPPLIER_KEY].error
                            }
                            helperText={
                                localFields[newConstants.TICKET_SUPPLIER_KEY].error
                                    ? localFields[newConstants.TICKET_SUPPLIER_KEY].err_msg
                                    : ''
                            }
                            label={<LanguageConfig id={"supplierticketstock.supplier"} />}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TicketName
                            ticketKeys={ticketKeys}
                            name={newConstants.TICKET_KEY}
                            value={localFields[newConstants.TICKET_KEY].value}
                            onChange={(e) => {
                                setTicketvalue(e.target.value)
                                stateUpdater(e)
                            }}
                            error={localFields[newConstants.TICKET_KEY].error && localFields[newConstants.TICKET_KEY].is_require}
                            helperText={
                                localFields[newConstants.TICKET_KEY].error && localFields[newConstants.TICKET_KEY].is_require
                                    ? localFields[newConstants.TICKET_KEY].err_msg
                                    : ''
                            }
                            label={"Ticket Name"}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TicketPlan
                            ticketplan={ticketplan}
                            name={newConstants.TICKET_PLAN_KEY}
                            value={localFields[newConstants.TICKET_PLAN_KEY].value}
                            onChange={stateUpdater}
                            error={localFields[newConstants.TICKET_PLAN_KEY].error}
                            helperText={
                                localFields[newConstants.TICKET_PLAN_KEY].error
                                    ? localFields[newConstants.TICKET_PLAN_KEY].err_msg
                                    : ''
                            }
                            label={<LanguageConfig id={"supplierticketstock.ticketplan"} />}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            type="text"
                            label={<LanguageConfig id="Invoice number" />}
                            value={localFields[newConstants.INVOICE_REF_NUMBER].value}
                            name={newConstants.INVOICE_REF_NUMBER}
                            error={localFields[newConstants.INVOICE_REF_NUMBER].error}
                            onChange={stateUpdater}
                            helperText={
                                localFields[newConstants.INVOICE_REF_NUMBER].error
                                    ? localFields[newConstants.INVOICE_REF_NUMBER].err_msg
                                    : ''
                            }
                            variant="outlined"
                            margin="dense"
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            type="date"
                            id="effective-from-id"
                            label={<LanguageConfig id="Invoice date" />}
                            InputLabelProps={{
                                shrink: true,
                                classes: {
                                    root: classes.DateTime,
                                }
                            }}
                            value={localFields[newConstants.INVOICE_DATE].value}
                            name={newConstants.INVOICE_DATE}
                            error={localFields[newConstants.INVOICE_DATE].error}
                            onChange={stateUpdater}
                            helperText={
                                localFields[newConstants.INVOICE_DATE].error
                                    ? localFields[newConstants.INVOICE_DATE].err_msg
                                    : ''
                            }
                            variant="outlined"
                            margin="dense"
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            type="number"
                            label={<LanguageConfig id="Expire days" />}
                            value={localFields[newConstants.EXPIRY_DAYS].value}
                            name={newConstants.EXPIRY_DAYS}
                            error={localFields[newConstants.EXPIRY_DAYS].error}
                            onChange={stateUpdater}
                            helperText={
                                localFields[newConstants.EXPIRY_DAYS].error
                                    ? localFields[newConstants.EXPIRY_DAYS].err_msg
                                    : ''
                            }
                            variant="outlined"
                            margin="dense"
                        />
                    </Column>
                    {purchaseDetails && purchaseDetails.length  ?
                        <PurchaseModuleForms
                            purchaseDetails={purchaseDetails}
                            purchaseModule={purchaseModule}
                            classes={classes}
                            multiStateUpdater={multiStateUpdater}
                            stockKeys={stockKeys}
                        />
                        : ""}
                    {purchaseModule === "MODULE_A" ?
                        <Column margin={[10, 5]}>
                            <Row>
                                <Column md={3} sm={12} xs={12}>
                                    <ExcelUpload
                                        key_={"file"}
                                        label="Excel File"
                                        tag="PURCHASE_INVOICE"
                                        document_name={"Purchase Invoice"}
                                        type={"bLvdtkY9GibsfN8c137tVfY2eYgI5IgBdSkm7F7hwas="}
                                        file={"newname"}
                                        value={"value"}
                                        name="purchase_invoice_excel"
                                        error={processExcel && invoiceExcel.length <= 0}
                                        onChange={fileStateUpdater}
                                        uploadFunction={purchaseInvoiceProcessExcel}
                                    />
                                    <Button
                                        onClick={() => {
                                            setProcessExcel(!processExcel);
                                        }}
                                        className={classes.saveButton}
                                        variant="contained"
                                    >
                                        Process Excel
                                    </Button>
                                </Column>
                                <Column md sm xs>
                                    {processExcel && invoiceExcel.length ?
                                        <InvoiceExcelTable processExcel={processExcel} invoiceExcel={invoiceExcel} />
                                        : ""}
                                </Column>
                            </Row>
                        </Column>
                        : ""}
                    <Column right>
                        <Row>
                            <Column md={8}></Column>
                            <Column right md={4}>
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
                                                {"Save"}
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
                                        Cancel
                                    </Button>
                                </Row>
                            </Column>
                        </Row>
                    </Column>
                </Row>
            </Column>
        </Row>
    ) : (
        <p>A</p>
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
            const res = await httpPostRequest(getAttractionTicketKey(value));
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
        const res = await httpPostRequest(getAttractionActiveYTicketSupplier(inputValue));
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


const TicketName = ({ name, value, onChange, error, helperText, label, ticketKeys }) => {
    const [defaultOptions, setDefaultOptions] = useState([]);

    useEffect(() => {
        loadTicketName();
    }, [ticketKeys, value]);


    const loadTicketName = async (inputValue = '', callback = null) => { 
        if (callback) {      
            callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))       
      } else {
        setDefaultOptions(
            ticketKeys.map((v) => ({
                value: v[newConstants.TICKET_KEY],
                label: v[newConstants.TICKET_NAME],
            }))
        )
      }
    };

    return (
        <SingelSelectOnDemand
            defaultOptions={defaultOptions}
            value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
            name={name}
            loadOptions={loadTicketName}
            onChange={(e) => onChange({ target: { name: name, value: e.value } })}
            placeholder={label}
            helperText={helperText}
            error={error}
        />
    );
};


const StockName = ({ name, value, onChange, error, helperText, label, stockKeys }) => {

    const [defaultOptions, setDefaultOptions] = useState([]);

    useEffect(() => {
        loadStockName()
    }, [stockKeys]);

    const loadStockName = (inputValue = '', callback = null) => {
        if (callback) {      
            callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))       
      } else {
        setDefaultOptions(
            stockKeys.map((v) => ({
                value: v[newConstants.STOCK_KEY],
                label: v[newConstants.TICKET_TYPE_NAME],
            }))
        )
      }
    }


    return (
        <SingelSelectOnDemand
            defaultOptions={defaultOptions}
            value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
            name={name}
            loadOptions={loadStockName}
            onChange={(e) => onChange({ target: { name: name, value: e.value } })}
            placeholder={label}
            helperText={helperText}
            error={error}
        />
    );
};


const TicketTypeKey = ({ name, value, onChange, error, helperText, label, stockKeys }) => {
    const [defaultOptions, setDefaultOptions] = useState([]);

    useEffect(() => {
        loadStockName()
    }, [stockKeys]);

    const loadStockName = (inputValue = '', callback = null) => {
        if (callback) {      
            callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))       
      } else {
        setDefaultOptions(
            stockKeys.map((v) => ({
                value: v[newConstants.TICKET_TYPE_KEY],
                label: v[newConstants.TICKET_TYPE_NAME],
            }))
        )
      }
    }


    return (
        <SingelSelectOnDemand
            defaultOptions={defaultOptions}
            value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
            name={name}
            loadOptions={loadStockName}
            onChange={(e) => onChange({ target: { name: name, value: e.value } })}
            placeholder={label}
            helperText={helperText}
            error={error}
        />
    );
}



const TicketTypeName = ({ name, value, onChange, error, helperText, label, stockKeys }) => {

    const [defaultOptions, setDefaultOptions] = useState([]);

    useEffect(() => {
        loadStockName()
    }, [stockKeys]);

    const loadStockName = () => {
        setDefaultOptions(
            stockKeys.map((v) => ({
                value: v[newConstants.TICKET_TYPE_NAME],
                label: v[newConstants.TICKET_TYPE_NAME],
            }))
        )
    }


    const loadOptions=(inputValue = "", callback = null)=>{
        callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))
    }

    return (
        <SingelSelectOnDemand
            defaultOptions={defaultOptions}
            value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
            name={name}
            loadOptions={loadOptions}
            onChange={(e) => onChange({ target: { name: name, value: e.value } })}
            placeholder={label}
            helperText={helperText}
            error={error}
        />
    );
};




const TicketPlan = ({ name, value, onChange, error, helperText, label, ticketplan }) => {
    const [defaultOptions, setDefaultOptions] = useState([]);

    useEffect(() => {
        LoadPlan()
    }, [ticketplan, value]);

    const LoadPlan = (inputValue = '', callback = null) => {
        if (callback) {      
            callback(defaultOptions.filter(f => f.label.toLowerCase().includes(inputValue.toLowerCase())))       
      } else {
        setDefaultOptions(
            ticketplan.map((v) => ({
                value: v[newConstants.TICKET_PLAN_KEY],
                label: v[newConstants.TICKET_PLAN_NAME],
            }))
        )
      }
    }

    return (
        <SingelSelectOnDemand
            defaultOptions={defaultOptions}
            value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
            name={name}
            loadOptions={LoadPlan}
            onChange={(e) => onChange({ target: { name: name, value: e.value } })}
            placeholder={label}
            helperText={helperText}
            error={error}
        />
    );
};


const InvoiceExcelTable = ({ processExcel, invoiceExcel }) => {
    const classes=useStyles()
    const [openTable, setOpenTable] = useState(processExcel);
    useEffect(() => {
        setOpenTable(processExcel)
    }, [processExcel])
    return (
        <ModalComponent open={openTable} setOpen={setOpenTable} style={{ minHeight: '90vh', position: 'relative' }}>
             <Paper style={{ width: "100%" }}>
            <TableContainer className={classes.TableContain}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeadTuple}>{"SNo."}</TableCell>
                            <TableCell className={classes.tableHeadTuple}>{"Ticket Type Name"}</TableCell>
                            <TableCell className={classes.tableHeadTuple}>{"Serial Number"}</TableCell>
                            <TableCell className={classes.tableHeadTuple}>{"QR or Barcode Data"}</TableCell>
                            <TableCell className={classes.tableHeadTuple}>{"Comments"}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            invoiceExcel.length > 0 ?
                                (invoiceExcel.map((data, index) => (
                                    <TableRow>
                                        <TableCell  className={classes.tableBodyTuple}>{data[newConstants.SNO]}</TableCell>
                                        <TableCell  className={classes.tableBodyTuple}>{data[newConstants.TICKET_TYPE_NAME]}</TableCell>
                                        <TableCell  className={classes.tableBodyTuple}>{data[newConstants.SERIAL_NUMBER]}</TableCell>
                                        <TableCell  className={classes.tableBodyTuple}>{data[newConstants.QR_OR_BARCODE_DATA]}</TableCell>
                                        <TableCell  className={classes.tableBodyTuple}>{data[newConstants.COMMENTS]}</TableCell>
                                    </TableRow>
                                )))
                                : ""
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            </Paper>
        </ModalComponent>
    )
}



const PurchaseModuleForms = ({ purchaseDetails, purchaseModule, classes, multiStateUpdater, stockKeys }) => {
    return (
        <Row margin={[10, 5]}>
            <Column padding={[5, 0]}>
                <Text size={14} bold>
                    {"Ticket Stock Details"}
                </Text>
            </Column>
            <Column>
            {purchaseDetails.map((data, index) => (
                <Card margin={[5, 0, 0, 0]} padding={[10]}>
                    <Column md={12} sm={12} xs={12}>
                        <Row>
                            <Column md={3} padding={[10, 5]}>
                                <TicketTypeName
                                    stockKeys={stockKeys}
                                    id="ticket-type-name"
                                    label="ticket type name"
                                    name={newConstants.TICKET_TYPE_NAME}
                                    value={data[newConstants.TICKET_TYPE_NAME].value}
                                    onChange={(e) => multiStateUpdater(e, index)}
                                    error={
                                        data[newConstants.TICKET_TYPE_NAME].error
                                    }
                                    helperText={
                                        data[newConstants.TICKET_TYPE_NAME].error
                                            ? data[newConstants.TICKET_TYPE_NAME].err_msg
                                            : ''
                                    }
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <StockName
                                    stockKeys={stockKeys}
                                    id="stock-qty"
                                    label="Stock Key"
                                    name={newConstants.TICKET_STOCK_KEY}
                                    value={data[newConstants.TICKET_STOCK_KEY].value}
                                    onChange={(e) => multiStateUpdater(e, index)}
                                    error={
                                        data[newConstants.TICKET_STOCK_KEY].error
                                    }
                                    helperText={
                                        data[newConstants.TICKET_STOCK_KEY].error
                                            ? data[newConstants.TICKET_STOCK_KEY].err_msg
                                            : ''
                                    }
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    id="ticket-qty"
                                    label="Ticket Qty"
                                    inputProps={{ min: 0 }}
                                    disabled
                                    type="number"
                                    name={newConstants.TICKET_QUANTITY}
                                    value={data[newConstants.TICKET_QUANTITY].value=purchaseDetails.length}
                                    onChange={(e) => multiStateUpdater(e, index)}
                                    error={
                                        data[newConstants.TICKET_QUANTITY].error
                                    }
                                    helperText={
                                        data[newConstants.TICKET_QUANTITY].error
                                            ? data[newConstants.TICKET_QUANTITY].err_msg
                                            : ''
                                    }
                                    variant="outlined"
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TicketTypeKey
                                    stockKeys={stockKeys}
                                    id="ticket-type"
                                    label="Ticket Type"
                                    name={newConstants.TICKET_TYPE_KEY}
                                    value={data[newConstants.TICKET_TYPE_KEY].value}
                                    onChange={(e) => multiStateUpdater(e, index)}
                                    error={
                                        data[newConstants.TICKET_TYPE_KEY].error
                                    }
                                    helperText={
                                        data[newConstants.TICKET_TYPE_KEY].error
                                            ? data[newConstants.TICKET_TYPE_KEY].err_msg
                                            : ''
                                    }
                                    variant="outlined"
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={data[newConstants.IS_ZERO_COST].value}
                                            value={data[newConstants.IS_ZERO_COST].value}
                                            color="primary"
                                            onChange={(e) => multiStateUpdater(e, index, 'list_check')}
                                            name={newConstants.IS_ZERO_COST}
                                        />

                                    }
                                    label={"Zero flux"}
                                />
                            </Column>
                            {purchaseModule != "MODULE_A" && purchaseModule != "MODULE_B" ?
                                <Row>
                                    <Column md={3} padding={[10, 5]}>
                                        <TextField
                                            id="ticket-prefix"
                                            label="ticket prefix"
                                            name={newConstants.TICKET_PREFIX}
                                            value={data[newConstants.TICKET_PREFIX].value}
                                            onChange={(e) => multiStateUpdater(e, index)}
                                            error={
                                                data[newConstants.TICKET_PREFIX].error
                                            }
                                            helperText={
                                                data[newConstants.TICKET_PREFIX].error
                                                    ? data[newConstants.TICKET_PREFIX].err_msg
                                                    : ''
                                            }
                                            variant="outlined"
                                        />
                                    </Column>
                                    <Column md={3} padding={[10, 5]}>
                                        <TextField
                                            id="ticket-code-length"
                                            label="Ticket Code length"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            name={newConstants.TICKET_CODE_LENGTH}
                                            value={data[newConstants.TICKET_CODE_LENGTH].value}
                                            onChange={(e) => multiStateUpdater(e, index)}
                                            error={
                                                data[newConstants.TICKET_CODE_LENGTH].error
                                            }
                                            helperText={
                                                data[newConstants.TICKET_CODE_LENGTH].error
                                                    ? data[newConstants.TICKET_CODE_LENGTH].err_msg
                                                    : ''
                                            }
                                            variant="outlined"
                                        />
                                    </Column>
                                    <Column md={3} padding={[10, 5]}>
                                        <TextField
                                            id="ticket-suffix"
                                            label="ticket suffix"
                                            name={newConstants.TICKET_SUFFIX}
                                            value={data[newConstants.TICKET_SUFFIX].value}
                                            onChange={(e) => multiStateUpdater(e, index)}
                                            error={
                                                data[newConstants.TICKET_SUFFIX].error
                                            }
                                            helperText={
                                                data[newConstants.TICKET_SUFFIX].error
                                                    ? data[newConstants.TICKET_SUFFIX].err_msg
                                                    : ''
                                            }
                                            variant="outlined"
                                        />
                                    </Column>
                                    <Column md={3} padding={[10, 5]}>
                                        <TextField
                                            id="ticket-start-number-id"
                                            label="Ticket start number"
                                            inputProps={{ min: 0 }}
                                            type="number"
                                            name={newConstants.TICKET_START_NUMBER}
                                            value={data[newConstants.TICKET_START_NUMBER].value}
                                            onChange={(e) => multiStateUpdater(e, index)}
                                            error={
                                                data[newConstants.TICKET_START_NUMBER].error
                                            }
                                            helperText={
                                                data[newConstants.TICKET_START_NUMBER].error
                                                    ? data[newConstants.TICKET_START_NUMBER].err_msg
                                                    : ''
                                            }
                                            variant="outlined"
                                        />
                                    </Column>
                                    <Column md={3} padding={[10, 5]}>
                                        <TextField
                                            id="ticket-end-number-id"
                                            label="Ticket end number"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            name={newConstants.TICKET_END_NUMBER}
                                            value={data[newConstants.TICKET_END_NUMBER].value}
                                            onChange={(e) => multiStateUpdater(e, index)}
                                            error={
                                                data[newConstants.TICKET_END_NUMBER].error
                                            }
                                            helperText={
                                                data[newConstants.TICKET_END_NUMBER].error
                                                    ? data[newConstants.TICKET_END_NUMBER].err_msg
                                                    : ''
                                            }
                                            variant="outlined"
                                        />
                                    </Column></Row> : null}
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    id="ticket-cost-id"
                                    label="Ticket Cost"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    name={newConstants.TICKET_COST}
                                    value={data[newConstants.TICKET_COST].value}
                                    onChange={(e) => multiStateUpdater(e, index)}
                                    error={
                                        data[newConstants.TICKET_COST].error
                                    }
                                    helperText={
                                        data[newConstants.TICKET_COST].error
                                            ? data[newConstants.TICKET_COST].err_msg
                                            : ''
                                    }
                                    variant="outlined"
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    id="ticket-mrp-id"
                                    label="Ticket MRP"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    name={newConstants.TICKET_MRP}
                                    value={data[newConstants.TICKET_MRP].value}
                                    onChange={(e) => multiStateUpdater(e, index)}
                                    error={
                                        data[newConstants.TICKET_MRP].error
                                    }
                                    helperText={
                                        data[newConstants.TICKET_MRP].error
                                            ? data[newConstants.TICKET_MRP].err_msg
                                            : ''
                                    }
                                    variant="outlined"
                                />
                            </Column>
                        </Row>
                    </Column>
                </Card>
            ))
            }
            </Column>
        </Row>
    )
}
