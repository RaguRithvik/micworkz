import React, { useState, useRef, useEffect } from 'react';
import { Row, Column, Text, Card, Touchable, Loader, CustomTooltip } from "../../core";
import { fade, Button, AppBar, Divider, IconButton, TextField, InputBase, Paper } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Search, SupervisorAccount, Today, Add, Remove, LocationCity, Hotel } from '@material-ui/icons';
import DateRangePicker from "react-daterange-picker";
import originalMoment from "moment";
import { extendMoment } from "moment-range";
import { getDateddMMMyyyy,  httpPostRequest, getDateYYYYMMDD, ddMMYYYYtoStamp } from '../../helper/JsHelper';
import { autoComplete } from '../../helper/RequestPayLoad';
import { constants } from '../../helper/constants';
import useOutsideClick from "../../core/OutsideClickListener";
import { useRouter } from 'next/router'
import LanguageConfig,{LanguageConfigFn} from "../../helper/LanguageConfig"
import {useStore} from "../../helper/Store";

const moment = extendMoment(originalMoment);
const useStyles = makeStyles((theme) => ({
    searchLoader: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        borderRadius: 5,
        padding: theme.spacing(2, 4, 3),
    },
    autoCompleteContainer: {
        position: 'absolute',
        top: 43,
        maxHeight: '70vh',
        zIndex: 1,
        overflowY: "scroll",
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 1),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 1),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        color: 'black',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        // color: 'inherit',
        width: '100%'
    },
    appBar: {
        padding: 5
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        height: 34,
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        // width: '30ch',
        [theme.breakpoints.down('sm')]: {
            // width: '20ch'
        },
    },
    submitButton: { 
        paddingTop: 9,
        paddingBottom: 9
    },
    startDateEndDateContainer: {
        '&:hover': {
            backgroundColor: '#F2F2F2',
            borderRadius: 5
        }
    },
    occupancyContainer: {
        '&:hover': {
            backgroundColor: '#F2F2F2',
            borderRadius: 5
        }
    },
    rooms: {
        fontSize: 14,
        color: 'grey'
    },
    occupancyToolpic: {
        maxWidth: 400
    }
}));
 

export default function SearchBar() {
    const classes = useStyles();
    const [value, setValue] = useState(moment.range(moment().clone().add(1, "days"), moment().clone().add(2, "days")));
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [autoCompleteResult, setAutoCompleteResult] = useState([]);
    const [key, setKey] = useState("");
    const [selected, setSelected] = useState({});
    const [occup, setOccup] = useState(false);
    const [occup_string, setOccupString] = useState("1-2-0");
    const { setAlertMsg } = useStore()
    const ref = useRef();
    const router = useRouter()

    useEffect(() => {
        if (router.query && router.query.ci && router.query.ci) {
            setValue(moment.range(router.query.ci ? ddMMYYYYtoStamp(router.query.ci) : new Date(), router.query.co ? ddMMYYYYtoStamp(router.query.co) : new Date()))
        }
        setOccupString(router.query && router.query.rd && router.query.rd.split("-").length == 3 && router.query.rd.split("-")[2] && (router.query.rd.split("-")[2].length == 1 || router.query.rd.split("-")[2].split("_").length > 1) ? router.query.rd : "1-2-0")
        setSelected(router.query && router.query.cg ? router.query : {});

    }, [router.query]);

    useOutsideClick(ref, () => {
        setAutoCompleteResult([])
        setOccup(false)
        setOpen(false)
    });

    const onKeying = async (e) => {
        setKey(e.target.value);
        if (e.target.value.length > 2) {
            setLoader(true);
            const res = await httpPostRequest(autoComplete(e.target.value));
            if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
                setAutoCompleteResult(res[constants.DATA])
                setLoader(false);
            }
            else {
                setKey("");
                setLoader(false);
            }
        }
    }

    const submit = (val) => {
        setKey(val.name)
        if (val && val.category == "HOTEL") {
            val = {
                hid: val.hotel_Id,
                cg: val.category,
                hotelKey: (val.hotelKey),
                clientId: val.clientId,
                productProviderTypeId: val.productProviderTypeId
            };

        }
        else {
            val = { cid: val.city_Id, hid: val.hotel_Id, cg: val.category };
        }
        setSelected(val);
        setAutoCompleteResult([]);
    }

    const onFilter = () => {
        const CheckinDate = getDateYYYYMMDD(value?.start?._d)
        const CheckoutDate = getDateYYYYMMDD(value?.end?._d)
        const RoomInfo = occup_string;
        if (CheckinDate == null || CheckoutDate == null) {
            setAlertMsg({ type: 'error', msg: "Please select check in & out dates." });
        }
        else if (RoomInfo && RoomInfo.split("-").length != 3) {
            setAlertMsg({ type: 'error', msg: "Invalid occupicy, please full fill" });
        }
        else if (selected.cg == "" || selected.cg == null) {
            setAlertMsg({ type: 'error', msg: "please search and select city or hotels" });
        }
        else {
            router.push({
                pathname: selected && selected.cg && selected.cg == "City" ? '/dashboard/searchhotels' : '/dashboard/searchhotels/Rooms',
                query: {
                    ci: CheckinDate,
                    hid: selected.hid,
                    cg: selected.cg,
                    cid: selected.cid,
                    co: CheckoutDate,
                    rd: RoomInfo,
                    hotelKey: selected.hotelKey,
                    clientId: selected.clientId,
                    productProviderTypeId: selected.productProviderTypeId
                },
            })
        }
    }  
    return (
        <AppBar position="static" ref={ref} elevation="0" color="inherit">
            <Row variant="dense" className={classes.appBar}>
                <Column md={5} xl={5} xs={12} sm={12} padding={[5]}>
                  <Card> 
                     <div className={classes.search} style={{ alignItems: 'center', position: 'relative' }}>
                        <div className={classes.searchIcon}>
                            <Search style={{ fontSize: 20 }} />
                        </div>  
                        <InputBase
                            onChange={onKeying}
                            value={key}
                            placeholder={LanguageConfigFn("hotels.search")}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                        {loader && <Loader className={classes.searchLoader} size={20} />}
                        <Card className={classes.autoCompleteContainer}>
                            {
                                autoCompleteResult && autoCompleteResult.map((val, index) => <Result onClick={submit} key={"autocomplete" + index} value={val} />)
                            }
                        </Card>
                    </div>
                  </Card>  
                </Column>
                <Column md={7} xl={7} xs={12} sm={12} right>
                    <Row>
                        <Column md={5} xl={5} xs={12} sm={12} padding={[5]}>
                            <Card>
                                <Touchable onClick={() => setOpen(true)} className={classes.startDateEndDateContainer} >
                                    <Row padding={[2, 0]}>
                                        <Column xs={2} sm={2} md={2} center middle>
                                            <Today />
                                        </Column>
                                        <Column xs={10} sm={10} md={10}>
                                            <Row>
                                                <Column padding={[0, 5]}>
                                                    <Text color="#003399" size={12} bold>{<LanguageConfig id="hotels.startandenddate"/>}</Text>
                                                </Column>
                                                <Column >
                                                    <Row center>
                                                        <Text size={12} semibold color="black">{getDateddMMMyyyy(value?.start?._d)}</Text>
                                                        <Text size={14} color={"#003399"} bold style={{ paddingLeft: 5, paddingRight: 5 }}><LanguageConfig id="hotels.to"/></Text>
                                                        <Text size={12} semibold color="black">{getDateddMMMyyyy(value?.end?._d)}</Text>
                                                    </Row>
                                                </Column>
                                            </Row>
                                        </Column>
                                    </Row>
                                </Touchable>

                                <CustomTooltip open={open} onClose={() => setOpen(false)}>
                                    <DateRangePicker
                                        value={value}
                                        onSelect={(value, states) => {
                                            setValue(value)
                                            setOpen(false)
                                        }}
                                        singleDateRange={true}
                                    />
                                </CustomTooltip>
                            </Card>
                        </Column>
                        <Column md={4} xl={4} xs={8} sm={8} padding={[5]}>
                            <Card className={classes.occupancyContainer} center >
                                <Touchable onClick={() => setOccup(true)}>
                                    <Row >
                                        <Column md={2} xs={2} sm={2} center middle>
                                            <SupervisorAccount />
                                        </Column>
                                        <Column md={10} xs={10} sm={10} >
                                            <Row>
                                                <Column><Text size={14} medium> {occup_string.split("-").length == 3 ? occup_string.split("-")[1] : ""} <LanguageConfig id="hotels.adults"/> {occup_string.split("-").length == 3 ? occup_string.split("-")[2].split("_").length > 0 ? occup_string.split("-")[2].split("_")[0] : "" : ""} <LanguageConfig id="hotels.children"/> </Text></Column>
                                                <Column><Text className={classes.rooms} medium> {occup_string.split("-").length == 3 ? occup_string.split("-")[0] : ""} <LanguageConfig id="hotels.room"/> </Text></Column>
                                            </Row>
                                        </Column>
                                    </Row>
                                </Touchable>
                                <Occupancy setOccup={setOccup} occup={occup} classes={classes} occup_string={occup_string} setOccupString={setOccupString} />
                            </Card>
                        </Column>
                        <Column md={3} xl={3} xs={4} sm={4} right center padding={[4, 5]}>
                            <Button variant="contained" color="primary" className={classes.submitButton} onClick={onFilter}><Text color="#ffffff" bold>Search</Text></Button>
                        </Column>
                    </Row>
                </Column>
            </Row>
        </AppBar>
    )
}

const Result = ({ value, onClick, ...props }) => {
    return (
        <Touchable onClick={() => onClick(value)}>
            <Row padding={[5, 0]}  {...props} >
                <Column md={1} xs={1} sm={1} center middle padding={[5]}>
                    {value.category == "City" ? <LocationCity style={{ fontWeight: 20 }} /> : <Hotel style={{ fontWeight: 20 }} />}
                </Column>
                <Column md={9} xs={9} sm={9} center padding={[5]}>
                    <Text>{value.name}</Text>
                </Column>

                <Column md={2} xs={2} sm={2} center padding={[5]}>
                    <Text >{value.category == "City" ? "City" : "Hotel"}</Text>
                </Column>
                <Column>
                    <Divider gutterBottom />
                </Column>
            </Row>
        </Touchable>)

}

const Occupancy = ({ occup, setOccup, occup_string, setOccupString, classes, ...props }) => {
    const [room, setRoom] = useState(1);
    const [adult, setAdult] = useState(2);
    const [children, setChildren] = useState(0);
    const [children_ages, setChildrenAges] = useState([]);
    useEffect(() => {
        const occup_array = occup_string.split("-");
        setRoom(occup_array.length == 3 ? occup_array[0] : 1)
        setAdult(occup_array.length == 3 ? occup_array[1] : 2)
        setChildren(occup_array.length == 3 ? occup_array[2].split("_")[0] : 0);
        setChildrenAges(occup_array.length == 3 ? occup_array[2].split("_").length > 1 ? occup_array[2].split("_").map((val, index) => index > 0 && { value: val, error: false }).filter(f => f) : [] : []);
    }, [occup_string])

    function updateChildrens(val) {
        val = parseInt(val)
        setChildren(val)
        if (val > children_ages.length) {
            setChildrenAges([...children_ages, { value: "", error: false }])
        }
        else {
            if (children_ages.length > 0) {
                setChildrenAges(children_ages.slice(0, val))
            }
        }
    }

    function ageSelect(value, index) {
        var arr = [...children_ages];
        arr[index] = { value: value, error: false }
        setChildrenAges(arr);
    }
    const submit = () => {
        let arr = [...children_ages];
        if (children > 0) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value == "" || arr[i].value == 0) {
                    arr[i].error = true;
                }
            }
        }
        if (arr.filter(f => f.error).length == 0) {
            let childrens_ages = arr.map((val) => val.value).join("_");
            let return_string = room + "-" + adult + "-" + children + (children != 0 ? "_" + childrens_ages : "")
            setOccupString(return_string);
            setOccup(false);
        }
        else {
            setChildrenAges(arr)
            alert("error")
        }
    }

    return (
        <CustomTooltip open={occup} onClose={() => setOccup(false)} className={classes.occupancyToolpic}  {...props}>

            <Row padding={[15]}>
                <Column>
                    <IncDecContainer defaultValue={1} label={<LanguageConfig id="hotels.room"/>} value={room} setState={val => setRoom(val)} />
                </Column>

                <Column>
                    <Divider gutterBottom />
                </Column>
                <Column>
                    <IncDecContainer defaultValue={2} label={<LanguageConfig id="hotels.Adult"/>} value={adult} setState={val => setAdult(val)} />
                </Column>

                <Column>
                    <Divider gutterBottom />
                </Column>
                <Column>
                    <IncDecContainer defaultValue={0} label={<LanguageConfig id="hotels.children"/>} value={children} setState={val => updateChildrens(val)} />
                </Column>

                <Column>
                    <Divider gutterBottom />
                </Column>
            </Row>
            {children_ages && children_ages.length > 0 ?
                <Row >
                    <Column padding={[10]}><Text bold>Age of children</Text></Column>
                    <Column>
                        <Row padding={[0, 5]}>
                            {
                                children_ages.map((val, index) =>
                                (<Column key={index} md={4} xs={6} sm={6} padding={[5]}>
                                    <AgeSelect value={val} index={index} onSelect={(v, i) => ageSelect(v, i)} />
                                </Column>))
                            }
                        </Row>
                    </Column>
                </Row> : null}
            <Row padding={[0, 0, 10, 0]}>
                <Column md={2}>
                </Column>

                <Column md={8} padding={[20]}>
                    <Button variant="contained" color="primary" onClick={submit}><LanguageConfig id="hotels.submit"/></Button>
                </Column>
                <Column md={2}>
                </Column>
            </Row>
        </CustomTooltip>
    )
}

const IncDecContainer = ({ value, defaultValue, setState, label, ...prop }) => {
    value = parseInt(value);
    const inc = () => {
        setState(value + 1);
    }
    const dec = () => {
        setState(value - 1 >= defaultValue ? value - 1 : value);
    }
    return (
        <Row {...prop}>
            <Column md={7} xs={6} sm={6} center>
                <Text size={18} bold>{label}</Text>
            </Column>
            <Column md={5} xs={8} sm={8}>
                <Paper variant="outlined" style={{ borderRadius: 8, margin: 5 }}>
                    <Row>
                        <Column md={4} xs={4} sm={4}><IconButton onClick={dec}><Remove /></IconButton></Column>
                        <Column md={4} xs={4} sm={4} center middle><Text center color="#003399" size={18} bold>{value}</Text></Column>
                        <Column md={4} xs={4} sm={4}><IconButton onClick={inc}><Add /></IconButton></Column>
                    </Row>
                </Paper>
            </Column>
        </Row>
    )
}

const AgeSelect = ({ value, onSelect, index }) => {
    return (
        <TextField
            id="outlined-basic"
            label="Outlined"
            value={value.value}
            error={value.error}
            type={"number"}
            onChange={(val) => onSelect(val.target.value < 19 ? val.target.value : 0, index)}
            label="Age"
            variant="outlined"
        />)
}