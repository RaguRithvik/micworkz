import React, { useState, useEffect, } from 'react';
import {
    Text,
    TextField,
    Card,
    Row,
    Column,
    Loader,
    CustomAlert,
    SingelSelectOnDemand,
    ModalComponent,
} from '../../../core';

import {
    Fade,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    TableHead,
    TableRow,
    Paper,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useStore } from '../../../helper/Store';
import { validator, httpPostRequest, getDateYYYYMMDD } from '../../../helper/JsHelper';
import {
    hotelMasterGetY,
    hotelMasterGetId,
    getRoomPlanPriceKey,
    getAllRooms,
    roomPlanPriceSave,
    roomPlanPriceUpdate,
    deleteRoomPlanPrice,
    generateRoomPlanPriceList,
    getRoomPlanPrice,
    getRoomPlanByKey,
    getRoomByKey,
    getAllRoomPlan,
    generatePlanPaxList,
    GetRoomByHotelKey,
    getRoomPriceY,
    RoomPriceInfoById,
    roomPlanPriceGetByKey
} from '../../../helper/RequestPayLoad';
import { constants, newConstants } from '../../../helper/constants';
import LanguageConfig from "../../../helper/LanguageConfig";
var FA = require('react-fontawesome');


const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
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
    tableHeadTuple: {
        color: '#003399',
        fontSize: '.8rem',
        fontWeight: '1000',
        padding: 15,
        textTransform: 'uppercase',
        width: 'clamp(150px,10vw,300px)',
        whiteSpace: "nowrap !important",
    },
    tableBodyTuple: {
        color: 'black',
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
    AddBtn: {
        backgroundColor: "rgb(26, 43, 71)",
        color: "white",
        '&:hover': {
            backgroundColor: "rgb(26, 43, 71)",
        },
    },
    TableContain: {
        maxWidth: "300px",
        minWidth: "100%"
    },
    blockButton: {
        backgroundColor: "rgb(26, 43, 71)",
        color: "white",
        '&:hover': {
            backgroundColor: "rgb(26, 43, 71)",
        },
    },
    Languageheadernow: {fontSize: '30px', marginBottom: '11px',},
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
        is_require: true,
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
    [newConstants.ROOM_KEY]: {
        value: '',
        is_require: true,
        error: false,
        type: 'dropdown',
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
    [newConstants.ROOM_PLAN_CANCEL_POLICIES]: { value: [room_plan_cancel_policy], is_require: true, error: false },
};

export default function Setup() {
    const classes = useStyles();
    const { languages, setAlertMsg } = useStore();
    

    return (
        <div>
            <Column>
            <h3 className={classes.Languageheadernow}>Room Plan Setup</h3>
        </Column>
            <Card margin={[0, 0, 10, 0]}>
                    <Fade >
                        <EditContainer
                            languages={languages}
                            setAlertMsg={setAlertMsg}
                            classes={classes}
                        />
                    </Fade>
                
            </Card> </div>
    );
}

const EditContainer = ({ classes ,languages, setAlertMsg }) => {
    const [localFields, setLocalFields] = useState([]);
    const [loader, setLoader] = useState(false);
    const [roomname, setRoomname] = useState( "")
    const [hotelname, setHotelname] = useState( "")
    const [room, setRoom] = useState([])
    const [roomplanname, setRoomplanname] = useState( "")
    const [roomplans, setRoomplans] = useState([])
    const [genetatedFields, setGenetatedFields] = useState([])
    const [rates, setRates] = useState(null)
    // const [paxdetails, setPaxdetails] = useState([])

    useEffect(() => {
        
            setLocalFields({
                [newConstants.ROOM_PLAN_KEY]: {
                    value: '',
                    is_require: true,
                    error: false,
                    type: 'dropdown',
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
                [newConstants.EFFECTIVE_FROM]: {
                    value: "",
                    is_require: true,
                    error: false,
                    type: 'date',
                    err_msg: '',
                },
                [newConstants.EFFECTIVE_TO]: {
                    value: "",
                    is_require: true,
                    error: false,
                    type: 'date',
                    err_msg: '',
                },
                [newConstants.HOTEL_SEASONALITY_NAME]: {
                    value: "",
                    is_require: false,
                    error: false,
                    min_length: 2,
                    max_length: null,
                    type: 'text',
                    err_msg: '',
                },

                [newConstants.TAX_TYPE]: {
                    value: "",
                    is_require: true,
                    error: false,
                    type: 'dropdown',
                    err_msg: '',
                },
                [newConstants.SERVICE_TYPE]: {
                    value: "",
                    is_require: true,
                    error: false,
                    type: 'dropdown',
                    err_msg: '',
                },
                [newConstants.ADDITIONAL_TYPE]: {
                    value: "",
                    is_require: true,
                    error: false,
                    type: 'dropdown',
                    err_msg: '',
                },
                [newConstants.ROOM_ALLOTMENT]: {
                    value: "",
                    is_require: false,
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
                [newConstants.IS_INCLUSIVE_PRICE]: {
                    value: true,
                    is_require: true,
                    error: false,
                    type: 'boolean',
                    err_msg: '',
                },
                [newConstants.IS_PAX_WISE]: {
                    value: false,
                    is_require: true,
                    error: false,
                    type: 'boolean',
                    err_msg: '',
                },
            });
      
    }, []);


    const genereteFields = (fields) => {
        fields = fields.map((value) => {
            return {
                [newConstants.SERIAL_NO]: {
                    value: value[newConstants.SERIAL_NO],
                    is_require: false,
                    error: false,
                    type: 'number',
                    err_msg: '',
                },
                [newConstants.DATE]: {
                    value: value[newConstants.DATE],
                    is_require: true,
                    error: false,
                    type: 'date',
                    err_msg: '',
                },
                [newConstants.B2B_RATE]: {
                    value: value[newConstants.B2B_RATE],
                    is_require: true,
                    error: false,
                    type: 'price',
                    err_msg: '',
                },
                [newConstants.B2C_RATE]: {
                    value: value[newConstants.B2C_RATE],
                    is_require: true,
                    error: false,
                    type: 'price',
                    err_msg: '',
                },
                [newConstants.ROOM_ALLOTMENT]: {
                    value: value[newConstants.ROOM_ALLOTMENT],
                    is_require: false,
                    error: false,
                    type: 'number',
                    err_msg: '',
                },
                [newConstants.ROOM_PRICE_COMMENTS_KEY]: {
                    value: value[newConstants.ROOM_PRICE_COMMENTS_KEY],
                    is_require: false,
                    error: false,
                    type: 'dropdown',
                    err_msg: '',
                },
                [newConstants.IS_SOLD_OUT]: {
                    value: value[newConstants.IS_SOLD_OUT],
                    is_require: true,
                    error: false,
                    type: 'boolean',
                    err_msg: '',
                },
                [newConstants.IS_PAX_WISE_PRICE]: {
                    value: value[newConstants.IS_PAX_WISE_PRICE],
                    is_require: true,
                    error: false,
                    type: 'boolean',
                    err_msg: '',
                },
                [newConstants.SEASONALITY_KEY]: {
                    value: value[newConstants.SEASONALITY_KEY],
                    is_require: false,
                    error: false,
                    type: 'text',
                    err_msg: '',
                },
                [newConstants.PAX_WISE_PRICE_DETAILS]: {
                    value: [],
                    is_require: false,
                    error: false,
                }
            }
        })
        setGenetatedFields(fields)
    };
    function checkStateUpdater(value) {
        stateUpdater(value)
    };


    const RoomPlanKey = async (roomname, hotelname) => {
        let res = await httpPostRequest(getRoomPlanPriceKey(roomname, hotelname));
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
            setRoomplans(res[newConstants.DATA][newConstants.ROOM_PLANS])
            setRoomplanname("")
        }
        else {
            setRoomplanname("")
            setRoomplans([])
            setAlertMsg({ type: 'error', msg: 'Please the hotel and room key' });
        }
    }


    useEffect(() => {
        if (roomname.length && hotelname.length) {
            RoomPlanKey(roomname, hotelname)
        }
    }, [roomname, hotelname])


    const objectstateUpdater = (e, tag) => {
        if (tag == "text") {
            let rates_ = _.cloneDeep(rates);
            if (e.target.value.length == 0) {
                rates_[e.target.name].error = rates_[e.target.name].is_require ? true : false;
                rates_[e.target.name].value = e.target.value;
            } else {
                rates_[e.target.name].value = e.target.value;
                rates_[e.target.name].error = false;
            }
            setRates(rates_);
        }
        else if (tag == "check") {
            let rates_ = _.cloneDeep(rates);
            if (e.target.value == '') {
                rates_[e.target.name].error = rates_[e.target.name].is_require ? true : false;
                rates_[e.target.name].value = e.target.value;
            } else {
                rates_[e.target.name].value = e.target.value === 'true' ? false : true;
                rates_[e.target.name].error = false;
            }
            setRates(rates_);
        }
    };


    const stateUpdater = (e) => {
        let localFields_ = _.cloneDeep(localFields);
        if (e.target.value.length == 0 && typeof e.target.value == 'string') {
            localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
            localFields_[e.target.name].value = e.target.value;
        } else {
            localFields_[e.target.name].value = e.target.value;
            localFields_[e.target.name].error = false;
        }
        // if (editData) {
        //     let tag = false
        //     for (let field in localFields_) {
        //         if (localFields_[field].value != editData[field]) {
        //             tag = true;
        //         }
        //     }
        //     genereteFields(tag ? [] : editData[newConstants.ROOM_PLAN_PRICE_DETAILS]);
        // if (tag) {
        //     localFields_[newConstants.IS_PAX_WISE].value = false;
        // }
        // }        
        setLocalFields(localFields_);
    };
    function multiStateUpdater(e, index, tag, index1) {
        if (tag == 'list') {
            let gson_ = _.cloneDeep(genetatedFields);
            if (index1 != undefined) {
                if (e.target.value.length == 0) {
                    gson_[index][newConstants.PAX_WISE_PRICE_DETAILS][newConstants.VALUE][index1][
                        e.target.name
                    ].error = gson_[index][newConstants.PAX_WISE_PRICE_DETAILS][newConstants.VALUE][index1][
                        e.target.name
                    ].is_require
                            ? true
                            : false;
                    gson_[index][newConstants.PAX_WISE_PRICE_DETAILS][newConstants.VALUE][index1][
                        e.target.name
                    ].value = e.target.value;
                } else {
                    gson_[index][newConstants.PAX_WISE_PRICE_DETAILS][newConstants.VALUE][index1][
                        e.target.name
                    ].value = e.target.value;
                    gson_[index][newConstants.PAX_WISE_PRICE_DETAILS][newConstants.VALUE][index1][
                        e.target.name
                    ].error = false;
                }
            } else {
                if (e.target.value.length == 0) {
                    gson_[index][e.target.name].error = gson_[index][e.target.name].is_require
                        ? true
                        : false;
                    gson_[index][e.target.name].value = e.target.value;
                } else {
                    gson_[index][e.target.name].value = e.target.value;
                    gson_[index][e.target.name].error = false;
                }
            }
            setGenetatedFields(gson_);
        } else if (tag == 'list_check') {
            let gson_ = _.cloneDeep(genetatedFields);
            if (e.target.value == '') {
                gson_[index][e.target.name].error = gson_[index][e.target.name].is_require ? true : false;
                gson_[index][e.target.name].value = e.target.value;
            } else {
                gson_[index][e.target.name].value = e.target.value === 'true' ? false : true;
                gson_[index][e.target.name].error = false;
            }
            setGenetatedFields(gson_);
        }
    };
    const save = async () => {
        let localFields_validation = _.cloneDeep(localFields);
        localFields_validation = validator(localFields_validation);
        if (localFields_validation.err) {
            setLocalFields(localFields_validation.values);
        }
        let genetatedFields_validation = _.cloneDeep(genetatedFields);
        genetatedFields_validation = validator(genetatedFields_validation);
        if (genetatedFields_validation.err) {
            setGenetatedFields(genetatedFields_validation.values);
        }
        let rates_validation = _.cloneDeep(rates);
        rates_validation = validator(rates_validation);
        if (rates_validation.err) {
            setRates(rates_validation.values);
        }
        let flag = genetatedFields_validation.err || localFields_validation.err || rates_validation.err;

        if (!flag) {
            setLoader(true);
                let res = await httpPostRequest(roomPlanPriceSave(localFields, rates, genetatedFields));
                if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
                    setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
                    loadData();
                    setLoader(false);
                    setAddEdit(false);
                } else {
                    setLoader(false);
                    setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
                }
        }
        else {
            setAlertMsg({ type: 'error', msg: <LanguageConfig id="roomplan.fillrequired" />  });
        }
    };
    const generateJson = async () => {
        let localFields_validation = _.cloneDeep(localFields);
        localFields_validation = validator(localFields_validation);
        // if (localFields_validation.values[newConstants.IS_INCLUSIVE_PRICE].value) {
        //     if (localFields_validation.values[newConstants.ROOM_RATE_B2C].value < 1) {
        //         localFields_validation.values[newConstants.ROOM_RATE_B2C].error = true
        //         localFields_validation.err = true;
        //     }
        //     if (localFields_validation.values[newConstants.ROOM_RATE_B2B].value < 1) {
        //         localFields_validation.values[newConstants.ROOM_RATE_B2B].error = true
        //         localFields_validation.err = true;
        //     }
        // }
        if (localFields_validation.err) {
            setLocalFields(localFields_validation.values);
        }
        let flag = !localFields_validation.err
        if (flag) {
            setLoader(true);
            let res = await httpPostRequest(generateRoomPlanPriceList(localFields, rates));
            if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
                genereteFields(res[newConstants.DATA])
                setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
                setLoader(false);

            } else {
                localFields_validation.values[newConstants.IS_PAX_WISE].value = false
                setLocalFields(localFields_validation.values)
                genereteFields([])
                setLoader(false);
                setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
            }
        }
        else {
            localFields_validation.values[newConstants.IS_PAX_WISE].value = false
            setLocalFields(localFields_validation.values)
            genereteFields([])
            setAlertMsg({ type: 'error', msg: <LanguageConfig id="roomplan.fillrequired" /> });
        }
    };

    const RoomKeyApi = async (hotelname) => {
        let res = await httpPostRequest(GetRoomByHotelKey(hotelname));
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
            setRoom(res[newConstants.DATA][newConstants.ROOM_CATEGORIES])
            setRoomname("")
            setRoomplanname("")
        }
        else {
            setRoomname("")
            setRoom([])
            setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
        }
    }

    useEffect(() => {
        if (hotelname) {
            RoomKeyApi(hotelname)
        }
    }, [hotelname,roomname])


    const generateRates = (data) => {
        let obj = {
            ["b2b-tax-value"]: {
                value: data[newConstants.B2B_PRICE][newConstants.TAX_VALUE],
                is_require: true,
                error: false,
                type: 'price',
                err_msg: '',
            },
            ["b2b-service-value"]: {
                value: data[newConstants.B2B_PRICE][newConstants.SERVICE_VALUE],
                is_require: true,
                error: false,
                type: 'price',
                err_msg: '',
            },
            ["b2b-additional-value"]: {
                value: data[newConstants.B2B_PRICE]["addition-value"],
                is_require: true,
                error: false,
                type: 'price',
                err_msg: '',
            },
            ["b2b-amenity-value"]: {
                value: data[newConstants.B2B_PRICE][newConstants.AMENITY_VALUE],
                is_require: true,
                error: false,
                type: 'price',
                err_msg: '',
            },
            ["b2b-net-value"]: {
                value: data[newConstants.B2B_PRICE][newConstants.NET_VALUE],
                is_require: true,
                error: false,
                type: 'price',
                err_msg: '',
            },
            ["b2c-tax-value"]: {
                value: data[newConstants.B2C_PRICE][newConstants.TAX_VALUE],
                is_require: true,
                error: false,
                type: 'price',
                err_msg: '',
            },
            ["b2c-service-value"]: {
                value: data[newConstants.B2C_PRICE][newConstants.SERVICE_VALUE],
                is_require: true,
                error: false,
                type: 'number',
                err_msg: '',
            },
            ["b2c-additional-value"]: {
                value: data[newConstants.B2C_PRICE]["addition-value"],
                is_require: true,
                error: false,
                type: 'price',
                err_msg: '',
            },
            ["b2c-amenity-value"]: {
                value: data[newConstants.B2C_PRICE][newConstants.AMENITY_VALUE],
                is_require: true,
                error: false,
                type: 'price',
                err_msg: '',
            },
            ["b2c-net-value"]: {
                value: data[newConstants.B2C_PRICE][newConstants.NET_VALUE],
                is_require: true,
                error: false,
                type: 'price',
                err_msg: '',
            },
        }
        setRates(obj)
    }


    const totalRates = async (roomplanname) => {
        let res = await httpPostRequest(getRoomPlanByKey(roomplanname));
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
            generateRates(res[newConstants.DATA])
        }
        else {
            setRoom([])
            setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
        }
    }

    useEffect(() => {
        if (roomplanname) {
            totalRates(roomplanname)
        }
    }, [roomplanname])


    const generatePax = async (val, index) => {
        let genetatedFields_ = _.cloneDeep(genetatedFields)
        if (val[newConstants.IS_PAX_WISE_PRICE][newConstants.VALUE] == false) {
            let res = await httpPostRequest(generatePlanPaxList(localFields, val));
            if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
                
               
                    let newGenerateFields = genetatedFields.map(
                        (val, index1) => (
                            index1 == index ?
                                {
                                    ...genetatedFields[index], [newConstants.PAX_WISE_PRICE_DETAILS]: {
                                        ...genetatedFields[index][newConstants.PAX_WISE_PRICE_DETAILS], value: res[newConstants.DATA],
                                    },
                                }
                                : val
                        )
                    )
                    val[newConstants.IS_PAX_WISE_PRICE][newConstants.VALUE] = true
                    setGenetatedFields(newGenerateFields)
                

            }
            else {
                setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
            }
        } else {
            let newGenerateFields = genetatedFields.map(
                (val, index1) => (
                    index1 == index ?
                        {
                            ...genetatedFields[index], [newConstants.PAX_WISE_PRICE_DETAILS]: {
                                ...genetatedFields[index][newConstants.PAX_WISE_PRICE_DETAILS], value: [],
                            },
                        }
                        : val
                )
            )
            val[newConstants.IS_PAX_WISE_PRICE][newConstants.VALUE] = false
            setGenetatedFields(newGenerateFields)
        }
    }


    return (
        <div>
            {localFields.hasOwnProperty([newConstants.ROOM_PLAN_KEY]) ? (
                <Row padding={[19,10,10,10]} >
                    {/* <Column padding={[8]}>
                        <Text bold size={16}>
                            {editData ? 'Edit Room Plan Price' : 'Add Room Plan Price'}
                        </Text>
                    </Column> */}

                    <Column md={3} padding={[0, 5, 10, 5]}>
                        <HotelName
                            name={newConstants.HOTEL_KEY}
                            value={localFields[newConstants.HOTEL_KEY].value}
                            onChange={(e) => {
                                setHotelname(e.target.value)
                                stateUpdater(e)
                            }}
                            error={
                                localFields[newConstants.HOTEL_KEY].error &&
                                localFields[newConstants.HOTEL_KEY].is_require
                            }
                            isDisabled={localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
                            helperText={
                                localFields[newConstants.HOTEL_KEY].error
                                    ? localFields[newConstants.HOTEL_KEY].err_msg
                                    : ''
                            }
                            label="Hotel Name"
                            margin="dense"
                        />
                    </Column>
                    <Column md={3} padding={[0, 5, 10, 5]}>
                        <RoomName
                            room={room}
                            name={newConstants.ROOM_KEY}
                            value={localFields[newConstants.ROOM_KEY].value}
                            onChange={(e) => {
                                setRoomname(e.target.value)
                                stateUpdater(e)
                            }}
                            isDisabled={localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
                            error={
                                localFields[newConstants.ROOM_KEY].error
                            }
                            helperText={
                                localFields[newConstants.ROOM_KEY].error
                                    ? localFields[newConstants.ROOM_KEY].err_msg
                                    : ''
                            }
                            label="Room"
                            margin="dense"
                        />
                    </Column>
                    <Column md={3} padding={[0, 5, 10, 5]}>
                        <RoomPlanName
                            roomplans={roomplans}
                            name={newConstants.ROOM_PLAN_KEY}
                            value={localFields[newConstants.ROOM_PLAN_KEY].value}
                            onChange={(e) => {
                                setRoomplanname(e.target.value)
                                stateUpdater(e)
                            }}
                            isDisabled={localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
                            error={
                                localFields[newConstants.ROOM_PLAN_KEY].error
                            }
                            helperText={
                                localFields[newConstants.ROOM_PLAN_KEY].error &&
                                    localFields[newConstants.ROOM_PLAN_KEY].is_require
                                    ? localFields[newConstants.ROOM_PLAN_KEY].err_msg
                                    : ''
                            }
                            label="Room Plan"
                            margin="dense"
                        />
                    </Column>
                    <Column md={3} padding={[0, 5, 10, 5]}>
                        <TextField
                            type="date"
                            label="Effective From"
                            disabled={localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
                            InputLabelProps={{ shrink: true }}
                            value={localFields[newConstants.EFFECTIVE_FROM].value}
                            name={newConstants.EFFECTIVE_FROM}
                            error={localFields[newConstants.EFFECTIVE_FROM].error}
                            onChange={stateUpdater}
                            helperText={
                                localFields[newConstants.EFFECTIVE_FROM].err_msg
                            }
                            required={localFields[newConstants.EFFECTIVE_FROM].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            type="date"
                            label="Effective To"
                            disabled={localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
                            InputLabelProps={{ shrink: true }}
                            value={localFields[newConstants.EFFECTIVE_TO].value}
                            name={newConstants.EFFECTIVE_TO}
                            error={localFields[newConstants.EFFECTIVE_TO].error}
                            onChange={stateUpdater}
                            helperText={
                                localFields[newConstants.EFFECTIVE_TO].err_msg
                            }
                            required={localFields[newConstants.EFFECTIVE_TO].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label="sesaonality name"
                            disabled={localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
                            value={localFields[newConstants.HOTEL_SEASONALITY_NAME].value}
                            name={newConstants.HOTEL_SEASONALITY_NAME}
                            error={localFields[newConstants.HOTEL_SEASONALITY_NAME].error}
                            onChange={stateUpdater}
                            helperText={
                                localFields[newConstants.HOTEL_SEASONALITY_NAME].err_msg
                            }
                            required={localFields[newConstants.HOTEL_SEASONALITY_NAME].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 20]} center>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={localFields[newConstants.IS_SOLD_OUT].value}
                                    color="primary"
                                    onChange={() => stateUpdater({ target: { value: !localFields[newConstants.IS_SOLD_OUT].value, name: newConstants.IS_SOLD_OUT } })}
                                    name={newConstants.IS_SOLD_OUT}
                                />
                            }
                            label="Is sold out"
                            margin="dense"
                        />
                    </Column>
                    <Column md={3} padding={[10, 20]} center>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={localFields[newConstants.IS_INCLUSIVE_PRICE].value}
                                    color="primary"
                                    onChange={() => stateUpdater({ target: { value: !localFields[newConstants.IS_INCLUSIVE_PRICE].value, name: newConstants.IS_INCLUSIVE_PRICE } })}
                                    name={newConstants.IS_INCLUSIVE_PRICE}
                                />
                            }
                            label="Inclusive rate"
                            margin="dense"
                        />
                    </Column>
                    <Row>
                        <Column md={3} padding={[10, 5]}>
                            <TypeRates
                                name={newConstants.TAX_TYPE}
                                value={localFields[newConstants.TAX_TYPE].value}
                                isDisabled={localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
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
                                isDisabled={localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
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
                                isDisabled={localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
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
                                label="room allotment"
                                type="number"
                                inputProps={{ min: 0 }}
                                disabled={localFields[newConstants.IS_PAX_WISE].value == true ? true : false}
                                value={localFields[newConstants.ROOM_ALLOTMENT].value}
                                name={newConstants.ROOM_ALLOTMENT}
                                error={localFields[newConstants.ROOM_ALLOTMENT].error}
                                onChange={stateUpdater}
                                helperText={
                                    localFields[newConstants.ROOM_ALLOTMENT].err_msg
                                }
                                required={localFields[newConstants.ROOM_ALLOTMENT].is_require}
                            />
                        </Column>
                    </Row>
                    {rates &&
                        <Row>
                            <RateComponent
                                rates={rates}
                                objectstateUpdater={objectstateUpdater}
                                classes={classes}
                                generateJson={generateJson}
                            />
                        </Row>}

                    <Column md={3} padding={[5]} center>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={localFields[newConstants.IS_PAX_WISE].value}
                                    value={localFields[newConstants.IS_PAX_WISE].value}
                                    color="primary"
                                    onChange={() => {
                                        stateUpdater({ target: { value: !localFields[newConstants.IS_PAX_WISE].value, name: newConstants.IS_PAX_WISE } })
                                        if (localFields[newConstants.IS_PAX_WISE].value == false) {
                                            generateJson()
                                        }
                                    }}
                                    name={newConstants.IS_PAX_WISE}
                                />
                            }
                            label={"Is Paxwise"}
                        />
                    </Column>
                    {localFields && localFields[newConstants.IS_PAX_WISE].value == true && genetatedFields.length > 0 &&
                        <Column>
                            <Row >
                                <Column padding={[5, 0]}>
                                    <Text size={20} bold>
                                        Generate List
                                    </Text>
                                </Column>
                                <Row margin={[10, 0, 0, 0]}>
                                    <GeneratedResult
                                        basic={genetatedFields}
                                        multiStateUpdater={multiStateUpdater}
                                        classes={classes}
                                        setGenetatedFields={setGenetatedFields}
                                        generatePax={generatePax}
                                    />

                                </Row>
                            </Row>
                        </Column>}
                </Row>
            ) : null}
        </div>
    );
};



const RateComponent = ({ objectstateUpdater, rates, classes }) => {
    const [percentage, setPercentage] = useState([
        { value: 'Percentage', label: 'Percentage' },
    ]);
    return (
        <div style={{ width: "100%" }}>
            <Row>
                <Column md={12}>
                    <Card padding={[10]}>
                        <Row>
                            <Column md={12} center middle>
                                <Text bold>B2B Rates</Text>
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="tax value"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    value={rates["b2b-tax-value"].value}
                                    name={["b2b-tax-value"]}
                                    disabled
                                    error={rates["b2b-tax-value"].error}
                                    onChange={(e) => objectstateUpdater(e, "text")}
                                    helperText={
                                        rates["b2b-tax-value"].err_msg
                                    }
                                    required={rates["b2b-tax-value"].is_require}
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="service value"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    disabled
                                    value={rates["b2b-service-value"].value}
                                    name={["b2b-service-value"]}
                                    error={rates["b2b-service-value"].error}
                                    onChange={(e) => objectstateUpdater(e, "text")}
                                    helperText={
                                        rates["b2b-service-value"].err_msg
                                    }
                                    required={rates["b2b-service-value"].is_require}
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="additional value"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    disabled
                                    value={rates["b2b-additional-value"].value}
                                    name={["b2b-additional-value"]}
                                    error={rates["b2b-additional-value"].error}
                                    onChange={(e) => objectstateUpdater(e, "text")}
                                    helperText={
                                        rates["b2b-additional-value"].err_msg
                                    }
                                    required={rates["b2b-additional-value"].is_require}
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="amenity value"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    disabled
                                    value={rates["b2b-amenity-value"].value}
                                    name={["b2b-amenity-value"]}
                                    error={rates["b2b-amenity-value"].error}
                                    onChange={(e) => objectstateUpdater(e, "text")}
                                    helperText={
                                        rates["b2b-amenity-value"].err_msg
                                    }
                                    required={rates["b2b-amenity-value"].is_require}
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="net value"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    disabled
                                    value={rates["b2b-net-value"].value}
                                    name={["b2b-net-value"]}
                                    error={rates["b2b-net-value"].error}
                                    onChange={(e) => objectstateUpdater(e, "text")}
                                    helperText={
                                        rates["b2b-net-value"].err_msg
                                    }
                                    required={rates["b2b-net-value"].is_require}
                                />
                            </Column>
                        </Row>
                        <Row>
                            <Column md={12} center middle>
                                <Text bold>B2C Rates</Text>
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="tax value"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    disabled
                                    value={rates["b2c-tax-value"].value}
                                    name={["b2c-tax-value"]}
                                    error={rates["b2c-tax-value"].error}
                                    onChange={(e) => objectstateUpdater(e, "text")}
                                    helperText={
                                        rates["b2c-tax-value"].err_msg
                                    }
                                    required={rates["b2c-tax-value"].is_require}
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="service value"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    disabled
                                    value={rates["b2c-service-value"].value}
                                    name={["b2c-service-value"]}
                                    error={rates["b2c-service-value"].error}
                                    onChange={(e) => objectstateUpdater(e, "text")}
                                    helperText={
                                        rates["b2c-service-value"].err_msg
                                    }
                                    required={rates["b2c-service-value"].is_require}
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="additional value"
                                    type="number"
                                    disabled
                                    inputProps={{ min: 0 }}
                                    value={rates["b2c-additional-value"].value}
                                    name={["b2c-additional-value"]}
                                    error={rates["b2c-additional-value"].error}
                                    onChange={(e) => objectstateUpdater(e, "text")}
                                    helperText={
                                        rates["b2c-additional-value"].err_msg
                                    }
                                    required={rates["b2c-additional-value"].is_require}
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="amenity value"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    disabled
                                    value={rates["b2c-amenity-value"].value}
                                    name={["b2c-amenity-value"]}
                                    error={rates["b2c-amenity-value"].error}
                                    onChange={(e) => objectstateUpdater(e, "text")}
                                    helperText={
                                        rates["b2c-amenity-value"].err_msg
                                    }
                                    required={rates["b2c-amenity-value"].is_require}
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="net value"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    disabled
                                    value={rates["b2c-net-value"].value}
                                    name={["b2c-net-value"]}
                                    error={rates["b2c-net-value"].error}
                                    onChange={(e) => objectstateUpdater(e, "text")}
                                    helperText={
                                        rates["b2c-net-value"].err_msg
                                    }
                                    required={rates["b2c-net-value"].is_require}
                                />
                            </Column>
                        </Row>
                    </Card>
                </Column>
            </Row>
        </div>
    )
}



const RoomPlanName = ({ name, value, onChange, error, helperText, label, roomplans, isDisabled }) => {
    const [defaultOptions, setDefaultOptions] = useState([]);

    useEffect(() => {
        loadStockName()
    }, [roomplans]);

    const loadStockName = () => {
        setDefaultOptions(
            roomplans.map((v) => ({
                value: v[newConstants.ROOM_PLAN_KEY],
                label: v[newConstants.ROOM_PLAN_NAME],
            }))
        )
    }


    return (
        <SingelSelectOnDemand
            defaultOptions={defaultOptions}
            value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
            name={name}
            isDisabled={isDisabled}
            loadOptions={loadStockName}
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


const HotelName = ({ name, value, onChange, error, helperText, label, isDisabled }) => {
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

const GeneratedResult = ({ basic, multiStateUpdater, classes, generatePax, setGenetatedFields }) => {
    const [paxmodal, setPaxModal] = useState(false)
    return (
        <Row>
            <Column>
                <Paper style={{ width: "100%" }}>
                    <TableContainer className={classes.TableContain}>
                        <Table className={classes.table} >
                            <TableHead className={classes.tableHead}>
                                <TableRow>
                                    <TableCell className={classes.tableHeadTuple} >SNo</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >Date</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >B2B rate</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >B2C rate</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >Room allotment</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >Room price comments</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >sold out</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >Pax wise</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >View</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {basic.map((val, index) => (
                                    <TableRow>
                                        <TableCell className={classes.tableBodyTuple}>{val[newConstants.SERIAL_NO].value != null ? val[newConstants.SERIAL_NO].value : index + 1}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>
                                            {val[newConstants.DATE].value}
                                        </TableCell>
                                        <TableCell className={classes.tableBodyTuple}>
                                            <TextField
                                                style={{ minWidth: "100px" }}
                                                inputProps={{ min: 0 }}
                                                value={val[newConstants.B2B_RATE].value}
                                                name={newConstants.B2B_RATE}
                                                error={val[newConstants.B2B_RATE].error}
                                                onChange={(e) => multiStateUpdater(e, index, 'list')}
                                                helperText={
                                                    val[newConstants.B2B_RATE].err_msg
                                                }
                                                required={val[newConstants.B2B_RATE].is_require}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableBodyTuple}>
                                            <TextField
                                                style={{ minWidth: "100px" }}
                                                inputProps={{ min: 0 }}
                                                value={val[newConstants.B2C_RATE].value}
                                                name={newConstants.B2C_RATE}
                                                error={val[newConstants.B2C_RATE].error}
                                                onChange={(e) => multiStateUpdater(e, index, 'list')}
                                                helperText={
                                                    val[newConstants.B2C_RATE].err_msg
                                                }
                                                required={val[newConstants.B2C_RATE].is_require}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableBodyTuple}>
                                            <TextField
                                                style={{ minWidth: "100px" }}
                                                type="number"
                                                inputProps={{ min: 0 }}
                                                value={val[newConstants.ROOM_ALLOTMENT].value}
                                                name={newConstants.ROOM_ALLOTMENT}
                                                error={val[newConstants.ROOM_ALLOTMENT].error}
                                                onChange={(e) => multiStateUpdater(e, index, 'list')}
                                                helperText={
                                                    val[newConstants.ROOM_ALLOTMENT].err_msg
                                                }
                                                required={val[newConstants.ROOM_ALLOTMENT].is_require}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableBodyTuple}>
                                            <RoomPriceComments
                                                value={val[newConstants.ROOM_PRICE_COMMENTS_KEY].value}
                                                name={newConstants.ROOM_PRICE_COMMENTS_KEY}
                                                error={val[newConstants.ROOM_PRICE_COMMENTS_KEY].error}
                                                onChange={(e) => multiStateUpdater(e, index, 'list')}
                                                helperText={
                                                    val[newConstants.ROOM_PRICE_COMMENTS_KEY].err_msg
                                                }
                                                required={val[newConstants.ROOM_PRICE_COMMENTS_KEY].is_require}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableBodyTuple}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={val[newConstants.IS_SOLD_OUT].value}
                                                        value={val[newConstants.IS_SOLD_OUT].value}
                                                        color="primary"
                                                        onChange={(e) => multiStateUpdater(e, index, 'list_check')}
                                                        name={newConstants.IS_SOLD_OUT}
                                                    />
                                                }
                                                label={"sold out"}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableBodyTuple}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={val[newConstants.IS_PAX_WISE_PRICE].value}
                                                        value={val[newConstants.IS_PAX_WISE_PRICE].value}
                                                        color="primary"
                                                        onChange={(e) => {
                                                            multiStateUpdater(e, index, 'list_check')
                                                            if (!val[newConstants.IS_PAX_WISE_PRICE].value) {
                                                                setPaxModal(true)
                                                                generatePax(val, index)
                                                            }
                                                            else {
                                                                generatePax(val, index)
                                                            }
                                                        }}
                                                        name={newConstants.IS_PAX_WISE_PRICE}
                                                    />
                                                }
                                                label={"pax wise"}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableBodyTuple}>
                                            <PaxView
                                                index={index}
                                                paxdetails={val[newConstants.PAX_WISE_PRICE_DETAILS].value}
                                                classes={classes}
                                                multiStateUpdater={multiStateUpdater}
                                            />
                                        </TableCell>
                                        {val[newConstants.IS_PAX_WISE_PRICE].value &&
                                            <ModalComponent open={paxmodal} setOpen={setPaxModal}>
                                                <PaxComponents
                                                    index={index}
                                                    paxdetails={val[newConstants.PAX_WISE_PRICE_DETAILS].value}
                                                    classes={classes}
                                                    multiStateUpdater={multiStateUpdater}
                                                />
                                            </ModalComponent>
                                        }
                                    </TableRow>))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Column>
        </Row>
    )
}


const PaxView = ({ index, paxdetails, classes, multiStateUpdater }) => {
    const [open,setOpen]=useState(false)
    return (
        <div>
            <Button onClick={() => setOpen(true)} className={classes.blockButton} variant="contained" color="primary">
                View
            </Button>
            <ModalComponent open={open} setOpen={setOpen}>
            <Row>
            <Column md={12}>
                <Text bold>Pax details</Text>
            </Column>
            <Column md={12}>
                <Paper style={{ width: "100%" }}>
                    <TableContainer className={classes.TableContain}>
                        <Table className={classes.table} >
                            <TableHead className={classes.tableHead}>
                                <TableRow>
                                    <TableCell className={classes.tableHeadTuple} >SNo</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >Plan Date</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >B2B rate</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >B2C rate</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >Pax adult</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >Pax child</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paxdetails.length > 0 ? paxdetails.map((value, index_) => (
                                    <TableRow>
                                        <TableCell className={classes.tableBodyTuple}>{index_ + 1}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>{value["room-plan-date"]}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>{value["b2b-net-value"]}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>{value["b2c-net-value"]}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>{value[newConstants.PAX_ADULT]}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>{value[newConstants.PAX_CHILD]}</TableCell>
                                    </TableRow>
                                )) :
                                    <TableRow>
                                        <TableCell scope="row" align="center" colSpan={6} rowSpan={2} className={classes.tableBodyTuple}>No records found</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Column>
        </Row>
        </ModalComponent>
        </div>
    )
}




const PaxComponents = ({ index, paxdetails, classes, multiStateUpdater }) => {
    return (
        <Row>
            <Column md={12}>
                <Text bold>Pax details</Text>
            </Column>
            <Column md={12}>
                <Paper style={{ width: "100%" }}>
                    <TableContainer className={classes.TableContain}>
                        <Table className={classes.table} >
                            <TableHead className={classes.tableHead}>
                                <TableRow>
                                    <TableCell className={classes.tableHeadTuple} >SNo</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >Plan Date</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >B2B rate</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >B2C rate</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >Pax adult</TableCell>
                                    <TableCell className={classes.tableHeadTuple} >Pax child</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paxdetails.length > 0 ? paxdetails.map((value, index_) => (
                                    <TableRow>
                                        <TableCell className={classes.tableBodyTuple}>{index_ + 1}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>{value["room-plan-date"]}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>{value["b2b-net-value"]}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>{value["b2c-net-value"]}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>{value[newConstants.PAX_ADULT]}</TableCell>
                                        <TableCell className={classes.tableBodyTuple}>{value[newConstants.PAX_CHILD]}</TableCell>
                                    </TableRow>
                                )) :
                                    <TableRow>
                                        <TableCell scope="row" align="center" colSpan={6} rowSpan={2} className={classes.tableBodyTuple}>No records found</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Column>
        </Row>
    )
}

const RoomPriceComments = ({ name, value, onChange, error, helperText, label }) => {
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
        else{
            setDefaultOptions([])
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
