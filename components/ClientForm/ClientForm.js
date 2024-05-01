import React, { useState, useEffect, useRef } from 'react';
import { TextField, Text, Card, Row, Column, Glyphi, Loader, CustomAlert, SingelSelectOnDemand, DemandDropDown } from '../../core';
import {
    Fade,
    FormControlLabel,
    Checkbox,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Create, Delete, Add, Remove } from '@material-ui/icons';
import { httpPostRequest, validator } from '../../helper/JsHelper';
import { constants, newConstants } from '../../helper/constants';
import { useStore } from '../../helper/Store';
import LanguageConfig from "../../helper/LanguageConfig";
import {
    updateProductProvider,
    getProviderProduct
} from '../../helper/RequestPayLoad';
import { database } from 'firebase';


const useStyles = makeStyles((theme) => ({
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
}));



export default function Setup() {
    const { setAlertMsg, setHeaderConfig } = useStore()
    const classes = useStyles()
    useEffect(() => {
        setHeaderConfig("ClientForm")
    }, [])
    return (
        <div>
            <Card margin={[0, 0, 10, 0]} padding={[2]}>
                 <ClientChildren classes={classes} setAlertMsg={setAlertMsg} />
            </Card>
        </div>
    )
}



const ClientChildren = ({ classes, setAlertMsg }) => {
    const [localFields, setLocalFields] = useState(null);
    const [loader, setLoader] = useState(false);
    const [hbe, setHbe] = useState(null)
    const [hcm, setHcm] = useState(null)
    const [rhk,setRhk]=useState(null)
    const [key,setKey]=useState("")
    const [screen,setScreen]=useState(false)
    const loadData = async () => {
        let res = await httpPostRequest(getProviderProduct());
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
            setLocalFields(res[newConstants.DATA])
            setKey(res[newConstants.DATA]["client-key"])
        } else {
            setLocalFields(null)
            setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
    };


    console.log(localFields)

    useEffect(() => {
        loadData()
    }, [])


    useEffect(() => {
        if( localFields && localFields.hbe!=null){
        setHbe({
            ["b2b-api-key"]: {
                value: localFields && localFields.hbe["api-key"].b2b,
                is_require: false,                
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2c-api-key"]: {
                value: localFields && localFields.hbe["api-key"].b2c,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2b-api-secret-key"]: {
                value: localFields && localFields.hbe["api-secret-key"].b2b,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2c-api-secret-key"]: {
                value: localFields && localFields.hbe["api-secret-key"].b2c,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["product-key"]: {
                value: localFields && localFields.hbe["product-key"],
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["product-name"]: {
                value: localFields && localFields.hbe["product-name"],
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["product-provider-key"]: {
                value: localFields && localFields.hbe["product-provider-key"],
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            }
        })
    }
    else if(localFields && localFields.hbe===null){
        setHbe(null)
    }
    else if(localFields && localFields.hcm!=null){
        setHcm({
            ["b2b-interface-key"]: {
                value: localFields && localFields.hcm["interface-key"].b2b,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2c-interface-key"]: {
                value: localFields && localFields.hcm["interface-key"].b2c,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2b-sid-key"]: {
                value: localFields && localFields.hcm["sid"].b2b,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2c-sid-key"]: {
                value: localFields && localFields.hcm["sid"].b2c,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2b-aid-key"]: {
                value: localFields && localFields.hcm["aid"].b2b,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2c-aid-key"]: {
                value: localFields && localFields.hcm["aid"].b2c,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["product-key"]: {
                value: localFields && localFields.hcm["product-key"],
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["product-name"]: {
                value: localFields && localFields.hcm["product-name"],
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["product-provider-key"]: {
                value: localFields && localFields.hcm["product-provider-key"],
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            }
        })
    }
    else if(localFields && localFields.hcm===null){
        setHcm(null)
    }
    else if(localFields && localFields.rhk!=null){
        setRhk({
            ["b2b-user-name"]: {
                value: localFields && localFields.rhk["user-name"].b2b,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2c-user-name"]: {
                value: localFields && localFields.rhk["user-name"].b2c,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2b-pass-word"]: {
                value: localFields && localFields.rhk["pass-word"].b2b,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["b2c-pass-word"]: {
                value: localFields && localFields.rhk["pass-word"].b2c,
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["product-key"]: {
                value: localFields && localFields.rhk["product-key"],
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["product-name"]: {
                value: localFields && localFields.rhk["product-name"],
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["product-provider-key"]: {
                value: localFields && localFields.rhk["product-provider-key"],
                is_require: false,
                error: false,
                type: 'text',
                err_msg: '',
            }
        })
    }
    else if(localFields && localFields.rhk===null){
        setRhk(null)
    }
    }, [localFields])


    const stateUpdater = (e,tag) => {
        if(tag==="hbe"){
        let hbe_ = _.cloneDeep(hbe);
        if (e.target.value.length == 0) {
            hbe_[e.target.name].error = hbe_[e.target.name].is_require ? true : false;
            hbe_[e.target.name].value = e.target.value;
        } else {
            hbe_[e.target.name].value = e.target.value;
            hbe_[e.target.name].error = false;
        }
        setHbe(hbe_);
    }
    else if(tag=="hcm"){
        let hcm_ = _.cloneDeep(hcm);
        if (e.target.value.length == 0) {
            hcm_[e.target.name].error = hcm_[e.target.name].is_require ? true : false;
            hcm_[e.target.name].value = e.target.value;
        } else {
            hcm_[e.target.name].value = e.target.value;
            hcm_[e.target.name].error = false;
        }
        setHcm(hcm_);
    }
    else{
        let rhk_ = _.cloneDeep(rhk);
        if (e.target.value.length == 0) {
            rhk_[e.target.name].error = rhk_[e.target.name].is_require ? true : false;
            rhk_[e.target.name].value = e.target.value;
        } else {
            rhk_[e.target.name].value = e.target.value;
            rhk_[e.target.name].error = false;
        }
        setRhk(rhk_); 
    }
    };


    const save = async () => {
        setLoader(true) 
        let res = await httpPostRequest(updateProductProvider(key,hbe,hcm,rhk));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
            setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
            setScreen(true)
            setLoader(false)
        } else {
            setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }       
    };

    return (
        <Row padding={[10]}>
            {screen?
            <Column middle center>
            <Text size={24} bold>You are updated the provider successfully</Text>
            </Column>:            
            <Column padding={[10, 5]}>
                <Row>
                    {localFields && localFields.hbe != null ?
                        <Column>
                            <HbeComponent data={hbe} stateUpdater={stateUpdater}/>
                        </Column> : null}
                    {localFields && localFields.hcm != null ?
                        <Column margin={[15, 0, 0, 0]}>
                            <HcmComponent data={hcm} stateUpdater={stateUpdater}  />
                        </Column> : null}
                    {localFields && localFields.rhh != null ?
                        <Column margin={[15, 0, 0, 0]}>
                            <RhkComponent data={rhk} stateUpdater={stateUpdater}  />
                        </Column>
                        : null}
                    <Column right>
                        <Row>
                            <Column md={8}></Column>
                            <Column right md={4}>
                                <Row bottom>
                                    <Button
                                        className={classes.saveButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={loader ? console.log('') : save}
                                    >
                                        <Row>
                                            {loader ? (
                                                <Column md={1} xs={1} sm={1} center middle>
                                                    <Loader size={14} color={'white'} />
                                                </Column>
                                            ) : null}
                                            <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} center middle sm={loader ? 11 : 12}>
                                                <LanguageConfig id={"save"} />
                                            </Column>
                                        </Row>
                                    </Button>
                                    {/* <Button
                                          onClick={() => {
                                            setAddEdit(false);
                                            setEditData(null);
                                          }}
                                        className={classes.closeButton}
                                        variant="contained">
                                        <LanguageConfig id={"ticketamenity.cancel"} />
                                    </Button> */}
                                </Row>
                            </Column>
                        </Row>
                    </Column>
                </Row>
            </Column>}
        </Row>
    )
};


const HbeComponent = ({ data, stateUpdater }) => {
    return (
        <div>
            <Card padding={[10]}>
                <Row>
                    <Column padding={[7]}>
                    <Text size={18} bold>Hbe</Text>
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2b api key"} />}
                            name={["b2b-api-key"]}
                            value={data && data["b2b-api-key"].value}
                            onChange={(e) => stateUpdater(e,"hbe")}
                            // inputProps={{ maxLength: data["b2b-api-key"] && data["b2b-api-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["b2b-api-key"].error
                            }
                            helperText={
                                data && data["b2b-api-key"].err_msg
                            }
                            required={data && data["b2b-api-key"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2b api secret"} />}
                            name={["b2b-api-secret-key"]}
                            value={data && data["b2b-api-secret-key"].value}
                            onChange={(e) => stateUpdater(e,"hbe")}
                            // inputProps={{ maxLength: data["b2b-api-secret-key"] && data["b2b-api-secret-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["b2b-api-secret-key"].error
                            }
                            helperText={
                                data && data["b2b-api-secret-key"].err_msg
                            }
                            required={data && data["b2b-api-secret-key"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2c api key"} />}
                            name={["b2c-api-key"]}
                            value={data && data["b2c-api-key"].value}
                            onChange={(e) => stateUpdater(e,"hbe")}
                            // inputProps={{ maxLength: data["b2c-api-key"]&& data["b2c-api-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["b2c-api-key"].error
                            }
                            helperText={
                                data && data["b2c-api-key"].err_msg
                            }
                            required={data && data["b2c-api-key"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2c api secret"} />}
                            name={["b2c-api-secret-key"]}
                            value={data && data["b2c-api-secret-key"].value}
                            onChange={(e) => stateUpdater(e,"hbe")}
                            InputLabelProps={{ shrink: true }}
                            // inputProps={{ maxLength: data["b2b-api-secret-key"] && data["b2b-api-secret-key"].max_length }}
                            error={
                                data && data["b2c-api-secret-key"].error
                            }
                            helperText={
                                data && data["b2c-api-secret-key"].err_msg
                            }
                            required={data && data["b2c-api-secret-key"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"product name"} />}
                            name={["product-name"]}
                            value={data && data["product-name"].value}
                            onChange={(e) => stateUpdater(e,"hbe")}
                            // inputProps={{ maxLength: data["b2b-api-secret-key"] && data["b2b-api-secret-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["product-name"].error
                            }
                            helperText={
                                data  && data["product-name"].err_msg
                            }
                            required={data && data["product-name"].is_require}
                        />
                    </Column>
                </Row>
            </Card>
        </div>
    )
}

const HcmComponent = ({ data, stateUpdater }) => {
    return (
        <div>
            <Card padding={[10]}>
                <Row>
                <Column>
                    <Text size={18} bold>Hcm</Text>
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2b interface key"} />}
                            name={["b2b-interface-key"]}
                            value={data && data["b2b-interface-key"].value}
                            onChange={(e) => stateUpdater(e,"hcm")}
                            // inputProps={{ maxLength: data["b2b-api-key"] && data["b2b-api-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["b2b-interface-key"].error
                            }
                            helperText={
                                data && data["b2b-interface-key"].err_msg
                            }
                            required={data && data["b2b-interface-key"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2c interface key"} />}
                            name={["b2c-interface-key"]}
                            value={data && data["b2c-interface-key"].value}
                            onChange={(e) => stateUpdater(e,"hcm")}
                            // inputProps={{ maxLength: data["b2b-api-secret-key"] && data["b2b-api-secret-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["b2c-interface-key"].error
                            }
                            helperText={
                                data && data["b2c-interface-key"].err_msg
                            }
                            required={data && data["b2c-interface-key"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2b sid key"} />}
                            name={["b2b-sid-key"]}
                            value={data && data["b2b-sid-key"].value}
                            onChange={(e) => stateUpdater(e,"hbe")}
                            // inputProps={{ maxLength: data["b2c-api-key"]&& data["b2c-api-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["b2b-sid-key"].error
                            }
                            helperText={
                                data && data["b2b-sid-key"].err_msg
                            }
                            required={data && data["b2b-sid-key"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2c sid key"} />}
                            name={["b2c-sid-key"]}
                            value={data && data["b2c-sid-key"].value}
                            onChange={(e) => stateUpdater(e,"hcm")}
                            InputLabelProps={{ shrink: true }}
                            // inputProps={{ maxLength: data["b2b-api-secret-key"] && data["b2b-api-secret-key"].max_length }}
                            error={
                                data && data["b2c-sid-key"].error
                            }
                            helperText={
                                data && data["b2c-sid-key"].err_msg
                            }
                            required={data && data["b2c-sid-key"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2b aid key"} />}
                            name={["b2b-aid-key"]}
                            value={data && data["b2b-aid-key"].value}
                            onChange={(e) => stateUpdater(e,"hbe")}
                            // inputProps={{ maxLength: data["b2c-api-key"]&& data["b2c-api-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["b2b-aid-key"].error
                            }
                            helperText={
                                data && data["b2b-aid-key"].err_msg
                            }
                            required={data && data["b2b-aid-key"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2c aid key"} />}
                            name={["b2c-aid-key"]}
                            value={data && data["b2c-aid-key"].value}
                            onChange={(e) => stateUpdater(e,"hcm")}
                            InputLabelProps={{ shrink: true }}
                            // inputProps={{ maxLength: data["b2b-api-secret-key"] && data["b2b-api-secret-key"].max_length }}
                            error={
                                data && data["b2c-aid-key"].error
                            }
                            helperText={
                                data && data["b2c-aid-key"].err_msg
                            }
                            required={data && data["b2c-aid-key"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"product name"} />}
                            name={["product-name"]}
                            value={data && data["product-name"].value}
                            onChange={(e) => stateUpdater(e,"hcm")}
                            // inputProps={{ maxLength: data["b2b-api-secret-key"] && data["b2b-api-secret-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["product-name"].error
                            }
                            helperText={
                                data && data["product-name"].err_msg
                            }
                            required={data && data["product-name"].is_require}
                        />
                    </Column>
                </Row>
            </Card>
        </div>
    )
}


const RhkComponent = ({ data, stateUpdater }) => {
    return (
        <div>
            <Card padding={[10]}>
                <Row>
                <Column padding={[7]}>
                    <Text size={18} bold>Rhk</Text>
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2b user name"} />}
                            name={["b2b-user-name"]}
                            value={data && data["b2b-user-name"].value}
                            onChange={(e) => stateUpdater(e,"rhk")}
                            // inputProps={{ maxLength: data["b2b-api-key"] && data["b2b-api-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["b2b-user-name"].error
                            }
                            helperText={
                                data && data["b2b-user-name"].err_msg
                            }
                            required={data && data["b2b-user-name"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2c user name"} />}
                            name={["b2c-user-name"]}
                            value={data && data["b2c-user-name"].value}
                            onChange={(e) => stateUpdater(e,"rhk")}
                            // inputProps={{ maxLength: data["b2b-api-secret-key"] && data["b2b-api-secret-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data  && data["b2c-user-name"] .error
                            }
                            helperText={
                                data && data["b2c-user-name"] .err_msg
                            }
                            required={data && data["b2c-user-name"] .is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2b password"} />}
                            name={["b2b-pass-word"]}
                            value={data && data["b2b-pass-word"].value}
                            onChange={(e) => stateUpdater(e,"rhk")}
                            // inputProps={{ maxLength: data["b2c-api-key"]&& data["b2c-api-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["b2b-pass-word"].error
                            }
                            helperText={
                                data && data["b2b-pass-word"].err_msg
                            }
                            required={data && data["b2b-pass-word"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"b2c password"} />}
                            name={["b2c-pass-word"]}
                            value={data && data["b2c-pass-word"].value}
                            onChange={(e) => stateUpdater(e,"rhk")}
                            InputLabelProps={{ shrink: true }}
                            // inputProps={{ maxLength: data["b2b-api-secret-key"] && data["b2b-api-secret-key"].max_length }}
                            error={
                                data && data["b2c-pass-word"].error
                            }
                            helperText={
                                data && data["b2c-pass-word"].err_msg
                            }
                            required={data && data["b2c-pass-word"].is_require}
                        />
                    </Column>
                    <Column md={3} padding={[10, 5]}>
                        <TextField
                            label={<LanguageConfig id={"product name"} />}
                            name={["product-name"]}
                            value={data && data["product-name"].value}
                            onChange={(e) => stateUpdater(e,"rhk")}
                            // inputProps={{ maxLength: data["b2b-api-secret-key"] && data["b2b-api-secret-key"].max_length }}
                            InputLabelProps={{ shrink: true }}
                            error={
                                data && data["product-name"].error
                            }
                            helperText={
                                data && data["product-name"].err_msg
                            }
                            required={data && data["product-name"].is_require}
                        />
                    </Column>
                </Row>
            </Card>
        </div>
    )
}


