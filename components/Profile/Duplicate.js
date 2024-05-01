import React, { useState, useEffect } from 'react';
import { Text, Card, Loader, DocumentUpload, Row, Column, DemandDropDown } from "../../core"
import { AppBar, Toolbar, Tabs, Tab, Box, FormControlLabel, Checkbox, Fade, InputLabel, InputBase, TextField, Select, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, FormControl, Divider, FormGroup } from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { Search, Create, Delete, Add, Remove, ChevronLeft, ChevronRight } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { DropzoneArea } from 'material-ui-dropzone';
import { agentSaveClientInfo, getclientinfo, updateClientInfo, getDocumentType } from '../../helper/RequestPayLoad';
import { httpPostRequest, httpGetRequest, getMaxPageNumber, paginate } from '../../helper/JsHelper';
import { useStore } from '../../helper/Store';
import { newConstants } from "../../helper/constants";
import { useAuth } from '../../authentication';
import { NotificationsActive } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    logOut: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'red'
    },
    headerName: {
        borderRadius: 5,
        margin: '10px 0px',
    },
    authContent: {
        width: '100%',
        [theme.breakpoints.up('md')]: {
            //   width: (props) => (props.variant === 'default' ? '50%' : '100%'),
            order: 1,
        },
        [theme.breakpoints.up('xl')]: {
            padding: 50,
        },
    },
    table: {
        minWidth: 650,
    },
    saveButton: {
        minWidth: 140,
        height: 40,
        margin: 5
    },
    addButton: {
        margin: 5
    },
    closeButton: {
        margin: 5
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
            marginLeft: theme.spacing(3),
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
        backgroundColor: '#003399'
    },
    tableHeadTuple: {
        color: '#ffffff'
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
    currentPage: {
        paddingLeft: 10,
        paddingRight: 10
    },
    columnCheck: {
        marginLeft: 10,
    },
    searchCol: {
        alignContent: "flex-end",
        // padding:0,
        [theme.breakpoints.down('xs')]: {
            alignContent: "end",
            padding: 6
        },
    },
    remHover: {
        backgroundColor: 'red',
        color: 'white'
    }
}));

const basicInfo = {
    ClientLicenseNo: { value: "", is_require: true, error: false, msg: "" },
    ClientRegisterationNo: { value: "", is_require: true, error: false, msg: "" },
    ClientName: { value: "", is_require: true, error: false, msg: "" },
    ClientEmail: { value: "", is_require: true, error: false, msg: "" },
    ClientWebsite: { value: "", is_require: false, error: false, msg: "" },
    ClientRemarks: { value: "", is_require: false, error: false, msg: "" },
    baseCurrency: { value: "", is_require: false, error: false, msg: "" },
    defaultLangCode: { value: "", is_require: false, error: false, msg: "" },
    clientAddress: { value: "", is_require: false, error: false, msg: "" },
    clientCityKey: { value: "", is_require: false, error: false, msg: "" },
    clientStateKey: { value: "", is_require: false, error: false, msg: "" },
    clientCountryKey: { value: "", is_require: false, error: false, msg: "" },
    ClientCon1: { value: "", is_require: false, error: false, msg: "" },
    ClientCon2: { value: "", is_require: false, error: false, msg: "" },
    ClientConPersonName: { value: "", is_require: false, error: false, msg: "" },
    ClientConPersonCon1: { value: "", is_require: false, error: false, msg: "" },
    ClientConPersonCon2: { value: "", is_require: false, error: false, msg: "" },
    UserName: { value: "", is_require: false, error: false, msg: "" },

}

const branch = {
    clientBranchRegNo: { value: "", is_require: true, error: false, msg: "" },
    clientBranchName: { value: "", is_require: true, error: false, msg: "" },
    clientBranchAddress: { value: "", is_require: true, error: false, msg: "" },
    clientBranchCity: { value: "", is_require: true, error: false, msg: "" },
    clientBranchState: { value: "", is_require: true, error: false, msg: "" },
    clientBranchCountry: { value: "", is_require: true, error: false, msg: "" },
    ClientBranchPostCode: { value: "", is_require: true, error: false, msg: "" },
    clientBranchRemark: { value: "", is_require: false, error: false, msg: "" },
    clientBranchTeleNo1: { value: "", is_require: true, error: false, msg: "" },
    clientBranchTeleNo2: { value: "", is_require: false, error: false, msg: "" },
    clientBranchMobileNo1: { value: "", is_require: true, error: false, msg: "" },
    clientBranchMobileNo2: { value: "", is_require: false, error: false, msg: "" },
    clientBranchEmail: { value: "", is_require: true, error: false, msg: "" },
    isHeadOffice: { value: true, is_require: true, error: false, msg: "" }
}

export default function AgentProfile() {
    const classes = useStyles();
    const [editData, setEditData] = useState(null);
    const { authUser, userSignOut } = useAuth();
    const [loader, setLoader] = useState(true);

    const loadAgents = async () => {
        let res = await httpPostRequest(getclientinfo(authUser.email));
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200 &&
            res.data[newConstants.CLIENT_ID] && res.data[newConstants.CLIENT_ID].length) {
            setEditData(res[newConstants.DATA])
            setLoader(false);
        } else {
            setLoader(false);
        }
    }


    useEffect(() => {
        loadAgents()
    }, [])


    return (
        <Row padding={[0, 10]}>
            {loader ?
                <Column center middle>
                    <Loader color="blue" size={20} />
                </Column> :
                <Column>
                    <AppBar position="relative" elevation={0} className={classes.headerName}>
                        <Toolbar variant="dense">
                            <Row>
                                <Column md={6} sm={6} xs={6} center ><Text variant="h4" color="inherit"> Profile </Text></Column>
                                <Column md={6} sm={6} xs={6} right><Button variant="contained" color="secondary" onClick={() => userSignOut()} className={classes.logOut}>Logout</Button></Column>
                            </Row>
                        </Toolbar>
                    </AppBar>
                    <Card noShadow padding={[20]}>
                        <EditContainer loadAgents={loadAgents} editData={editData} classes={classes} />
                    </Card>
                </Column>
            }
        </Row>
    )
}

const EditContainer = ({ loadAgents, editData, addEdit, setAddEdit, classes, ...props }) => {
    const [basicDetails, setBasicDetails] = useState(null);
    const [branchInfo, setBranchInfo] = useState([]);
    const [files, setFiles] = useState([]);
    const [loader, setLoader] = useState(false);
    const { setAlertMsg } = useStore();
    const { authUser } = useAuth();
    const [msg, setMessage] = useState("");
    const [documentsConfig, setDocumentsConfig] = useState([]);
    const [documents, setDocuments] = useState([]);

    const getDocumentConfig = async () => {
        let res = await httpPostRequest(getDocumentType());
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
            setDocumentsConfig(res[newConstants.DATA].map((val) => ({ file: { value: "", [newConstants.FILE_NAME]: "", [newConstants.DOCUMENT_TYPE_KEY]: val[newConstants.DOCUMENT_TYPE_KEY], documentTypeName: val[newConstants.DOCUMENT_TYPE_NAME], is_require: val[newConstants.IS_MANDATORY] ? true : false, error: false } })))
        }
    }


    useEffect(() => {
        getDocumentConfig()
    }, []);

    const initConfig = () => {
        if (!editData) {
            let basicInfo_ = _.cloneDeep(basicInfo)
            basicInfo_.ClientEmail.value = authUser.email
            setBasicDetails(basicInfo_);
            let hbr = _.cloneDeep(branch);
            hbr.clientBranchEmail.value = authUser.email;
            setBranchInfo([hbr]);
            let document_ = _.cloneDeep(documentsConfig);
            setDocuments([document_]);
            setMessage("");
        }
        else {
            let basicInfo_ = _.cloneDeep(basicInfo)
            basicInfo_.ClientEmail.value = editData.clientEmail ? editData.clientEmail : ""
            basicInfo_.ClientLicenseNo.value = editData.clientLicenseNo ? editData.clientLicenseNo : ""
            basicInfo_.ClientRegisterationNo.value = editData.clientRegisterationNo ? editData.clientRegisterationNo : ""
            basicInfo_.ClientName.value = editData.clientName ? editData.clientName : ""
            basicInfo_.ClientWebsite.value = editData.clientWebsite ? editData.clientWebsite : ""
            basicInfo_.ClientRemarks.value = editData.clientRemarks ? editData.clientRemarks : ""
            basicInfo_.baseCurrency.value = editData.baseCurrency && editData.baseCurrency != null ? editData.baseCurrency : ""
            basicInfo_.defaultLangCode.value = editData.defaultLangCode && editData.defaultLangCode != null ? editData.defaultLangCode : ""
            basicInfo_.clientAddress.value = editData.clientAddress && editData.clientAddress != null ? editData.clientAddress : ""
            basicInfo_.clientCityKey.value = editData.clientCityKey && editData.clientCityKey != null ? editData.clientCityKey : ""
            basicInfo_.clientStateKey.value = editData.clientStateKey && editData.clientStateKey != null ? editData.clientStateKey : ""
            basicInfo_.clientCountryKey.value = editData.clientCountryKey && editData.clientCountryKey != null ? editData.clientCountryKey : ""
            basicInfo_.ClientCon1.value = editData.ClientCon1 && editData.ClientCon1 != null ? editData.ClientCon1 : ""
            basicInfo_.ClientCon2.value = editData.ClientCon2 && editData.ClientCon2 != null ? editData.ClientCon2 : ""
            basicInfo_.ClientConPersonName.value = editData.ClientConPersonName && editData.ClientConPersonName != null ? editData.ClientConPersonName : ""
            basicInfo_.ClientConPersonCon1.value = editData.ClientConPersonCon1 && editData.ClientConPersonCon1 != null ? editData.ClientConPersonCon1 : ""
            basicInfo_.ClientConPersonCon2.value = editData.ClientConPersonCon2 && editData.ClientConPersonCon2 != null ? editData.ClientConPersonCon2 : ""
            basicInfo_.UserName.value = editData.UserName && editData.UserName != null ? editData.UserName : ""
            basicInfo_[newConstants.CLIENT_ID] = { value: editData[newConstants.CLIENT_ID], is_require: false, error: false };
            setBasicDetails(basicInfo_);
            setMessage(1);
            let branch_infos = [];
            let documents_ = [];
            if (editData.clientBranchInfos && editData.clientBranchInfos.length) {
                editData.clientBranchInfos.forEach((value, index) => {
                    let hbr = _.cloneDeep(branch);
                    let document_ = _.cloneDeep(documentsConfig);
                    hbr.clientBranchRegNo.value = value.clientBranchRegNo ? value.clientBranchRegNo : "";
                    hbr.clientBranchName.value = value.clientBranchName ? value.clientBranchName : "";
                    hbr.clientBranchAddress.value = value.clientBranchAddress ? value.clientBranchAddress : "";
                    hbr.clientBranchCity.value = value.clientBranchCity ? value.clientBranchCity : "";
                    hbr.clientBranchState.value = value.clientBranchState ? value.clientBranchState : "";
                    hbr.clientBranchCountry.value = value.clientBranchCountry ? value.clientBranchCountry : "";
                    hbr.ClientBranchPostCode.value = value.clientBranchPostCode ? value.clientBranchPostCode : "";
                    hbr.clientBranchRemark.value = value.clientBranchRemark ? value.clientBranchRemark : "";
                    hbr.clientBranchTeleNo1.value = value.clientBranchTeleNo1 ? value.clientBranchTeleNo1 : "";
                    hbr.clientBranchTeleNo2.value = value.clientBranchTeleNo2 ? value.clientBranchTeleNo2 : "";
                    hbr.clientBranchMobileNo1.value = value.clientBranchMobileNo1 ? value.clientBranchMobileNo1 : "";
                    hbr.clientBranchMobileNo2.value = value.clientBranchMobileNo2 ? value.clientBranchMobileNo2 : "";
                    hbr.clientBranchEmail.value = value.clientBranchEmail ? value.clientBranchEmail : "";
                    hbr.isHeadOffice.value = value.isHeadOffice;
                    hbr[newConstants.CLIENT_ID] = { value: value[newConstants.CLIENT_ID], is_require: false, error: false };
                    hbr[newConstants.CLIENT_BRANCH_ID] = { value: value[newConstants.CLIENT_BRANCH_ID], is_require: false, error: false };

                    if (document_.length) {
                        for (let doc of document_) {
                            doc.file.value = value.fileInfos.filter(f => f.documentTypeName == doc.file.documentTypeName).length ? value.fileInfos.filter(f => f.documentTypeName == doc.file.documentTypeName)[0].fileKey : ""
                            doc.file.is_require = value.isHeadOffice;
                            doc.file[newConstants.FILE_NAME] = value.fileInfos.filter(f => f.documentTypeName == doc.file.documentTypeName).length ? value.fileInfos.filter(f => f.documentTypeName == doc.file.documentTypeName)[0][newConstants.FILE_NAME] : ""
                        }
                    }
                    documents_.push(document_);
                    branch_infos.push(hbr);
                })
            }
            else {
                let hbr = _.cloneDeep(branch);
                hbr.clientBranchEmail.value = authUser.email
                branch_infos.push(hbr)
                let document_ = _.cloneDeep(documentsConfig);
                documents_.push(document_);
            }
            setBranchInfo(branch_infos);
            setDocuments(documents_);
        }
    }

    useEffect(() => {
        if (documentsConfig.length && authUser && authUser.email) {
            initConfig();
        }
    }, [editData, documentsConfig, authUser])

    useEffect(() => {
        let branchInfo_ = _.cloneDeep(branchInfo)
        if (branchInfo.length) {
            branchInfo_[0].clientBranchName.value = basicDetails.ClientName.value
            branchInfo_[0].clientBranchRegNo.value = basicDetails.ClientRegisterationNo.value
            setBranchInfo(branchInfo_);
        }
    }, [basicDetails])

    const addBranch = () => {
        let branchs = _.cloneDeep(branchInfo)
        let new_branch = _.cloneDeep(branch)
        new_branch.isHeadOffice.value = false;
        branchs.push(new_branch)
        setBranchInfo(branchs)

        let document_ = _.cloneDeep(documentsConfig);
        let documents_ = _.cloneDeep(documents);
        for (let doc of document_) {
            doc.file.is_require = false;
        }
        documents_.push(document_)
        setDocuments(documents_);
    }

    function removeBranch(index) {
        let branchs = _.cloneDeep(branchInfo)
        let documents_ = _.cloneDeep(documents);
        if (branchs[index].isHeadOffice.value) {
            if (index == 0) {
                branchs[1].isHeadOffice.value = true;
                let document_ = documents_[1]
                for (let doc of document_) {
                    doc.file.is_require = true;
                }
                documents_[1] = document_;
            }
            else {
                branchs[0].isHeadOffice.value = true;
                let document_ = documents_[0]
                for (let doc of document_) {
                    doc.file.is_require = true;
                }
                documents_[0] = document_;
            }
        }
        branchs[index] = false;
        documents_[index] = false;
        setBranchInfo(branchs.filter(f => f))
        setDocuments(documents_.filter(f => f));
    }

    const validator = (values) => {
        let err = false;
        for (let obj in values) {
            if ((typeof values[obj]['value'] != "boolean") && (values[obj]['is_require'] && values[obj]['error'] || values[obj]['is_require'] && (values[obj]['value'] == null || values[obj]['value'] == "" || (typeof values[obj]['value'] == "string") && values[obj]['value'] && values[obj]['value'].trim() == ""))) {
                values[obj]['error'] = true;
                err = true
            }
        }
        return { values, err }
    }

    const basicDetailsStateUpdater = (e) => {
        let basicDetails_ = { ...basicDetails };
        basicDetails_[e.target.name].value = e.target.value;
        if ((e.target.value + "").length > 0) {
            basicDetails_[e.target.name].error = false
        }
        else {
            if (basicDetails_[e.target.name].is_require) {
                basicDetails_[e.target.name].error = true
            }
        }
        setBasicDetails(basicDetails_);
    }

    function branchInfoStateUpdater(e, index) {
        let branchInfo_ = [...branchInfo];
        if (e.target.name === "isHeadOffice") {
            if (branchInfo_.length > 1) {
                let true_index = branchInfo_.findIndex(f => f.isHeadOffice.value);
                if (true_index == index) {
                    if (branchInfo_[index].isHeadOffice) {
                        branchInfo_[index].isHeadOffice.value = false;
                        if (index != 0) {
                            branchInfo_[0].isHeadOffice.value = true;
                        }
                        else {
                            branchInfo_[index + 1].isHeadOffice.value = true;
                        }
                    }
                    else {
                    }
                }
                else {
                    branchInfo_[true_index].isHeadOffice.value = false;
                    branchInfo_[index].isHeadOffice.value = true;
                }
            }
        }
        else {
            branchInfo_[index][e.target.name].value = e.target.value;
            if ((e.target.value + "").length > 0) {
                branchInfo_[index][e.target.name].error = false
            }
            else {
                if (branchInfo_[index][e.target.name].is_require) {
                    branchInfo_[index][e.target.name].error = true
                }
            }
        }
        setBranchInfo(branchInfo_);
    }
    function fileStateUpdater(e, index, index1) {
        let documents_ = [...documents];
        documents_[index][index1].file.value = e.target.value;
        documents_[index][index1].file.error = false;
        setDocuments(documents_);
    }




    const submit = async () => {
        let basicDetails_validation = _.cloneDeep(basicDetails)
        basicDetails_validation = validator(basicDetails_validation);
        if (basicDetails_validation.err) {
            setBasicDetails(basicDetails_validation.values)
        }
        let branchInfo_validation = _.cloneDeep(branchInfo)
        branchInfo_validation = branchInfo_validation.map((value) => validator(value))
        if (branchInfo_validation.filter(f => f.err).length) {
            setBranchInfo(branchInfo_validation.map((value) => value.values))
        }
        let documents_validation = _.cloneDeep(documents);
        documents_validation = documents_validation.map((value) => value.map((val) => validator(val)))
        if (documents_validation.filter(f => f.filter(ff => ff.err).length > 0).length) {
            setDocuments(documents_validation.map((value) => value.map((v) => v.values)))
        }
        let files_validation = _.cloneDeep(files)
        files_validation = files_validation.map((value) => validator(value))
        if (files_validation.filter(f => f.err).length) {
            setFiles(files_validation.map((value) => value.values))
        }
        if (!basicDetails_validation.err && branchInfo_validation.filter(f => f.err).length == 0 && documents_validation.filter(f => f.filter(ff => ff.err).length > 0).length == 0) {
            if (!editData) {
                setLoader(true);
                const res = await httpPostRequest(agentSaveClientInfo(basicDetails, branchInfo, documents));
                if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
                    setAlertMsg({ type: 'success', msg: "Your account is sent for verification. Once approved, you'll notify by your registered email address." })
                    setLoader(false);
                    setMessage(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    loadAgents();
                }
                else {
                    setLoader(false)
                    setAlertMsg({ type: 'error', msg: "Try again later." })
                }
            }
            else {
                setLoader(true);
                const res = await httpPostRequest(updateClientInfo(basicDetails, branchInfo, documents));
                if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
                    setAlertMsg({ type: 'success', msg: "Your account is sent for verification. Once approved, you'll notify by your registered email address.." })
                    setLoader(false);
                    setMessage(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    loadAgents();
                }
                else {
                    setLoader(false)
                    setAlertMsg({ type: 'error', msg: "Try again later." })
                }
            }
        }
        else {
            setAlertMsg({ type: 'error', msg: "Please fill out require fields." })
        }
    }


    return (
        <Row {...props}>
            {msg == 1 || msg == 2 ?
                <Column padding={[10, 0]}>
                    <Card>
                        <Row padding={[20, 10, 10, 10]}>
                            <Column md={2} xs={2} sm={2} center right padding={[0, 10, 0, 0]}>
                                <NotificationsActive style={{ color: 'green', fontSize: 25 }} />
                            </Column>
                            <Column md={10} xs={10} sm={10} center>
                                <Text variant="h3" color="green" component="h2">{msg == 1 ? "Your account is under verification. Once approved, you'll notify by your registered email address." : "Your account is sent for verification. Once approved, you'll notify by your registered email address."}</Text>
                            </Column>
                        </Row>
                    </Card>
                </Column> : null}
            <Column>
                <Row>
                    <Column padding={[8, 8, 13, 8]}>
                        <Text variant="h3" color="primary" component="h2" color="#003399">My Company Profile :</Text>
                        {basicInfo ? <Card padding={[5]} margin={[10, 0, 0, 0]}><BasicDetails basicDetails={basicDetails} basicDetailsStateUpdater={basicDetailsStateUpdater} classes={classes} /></Card> : null}
                    </Column>
                    <Column padding={[8, 0]}>
                        <Text style={{ marginLeft: 5 }} variant="h3" color="primary" component="h2" color="#003399">Outlets :</Text>
                        <BranchDetails classes={classes} fileStateUpdater={fileStateUpdater} documents={documents} removeBranch={removeBranch} addBranch={addBranch} branchInfoStateUpdater={branchInfoStateUpdater} branchInfo={branchInfo} />
                    </Column>
                    <Column right padding={[10, 0]}>
                        <Button className={classes.saveButton} variant="contained" color="primary" onClick={loader ? console.log("") : submit}>
                            <Row>
                                {loader ? <Column md={1} xs={1} sm={1} center middle><Loader size={14} color={"white"} /></Column> : null}
                                <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} center middle sm={loader ? 11 : 12}>{editData ? "Update" : "Add"}</Column>
                            </Row>
                        </Button>
                    </Column>
                </Row>
            </Column>
        </Row>
    )
}

const BasicDetails = ({ basicDetails, basicDetailsStateUpdater, classes }) => {
    const { Country, City, Province, Currency, ContactNum, Language } = DemandDropDown;
    const { languages } = useStore()
    return (
        <>
            {basicDetails ?
                <Row>
                    <Column md={3} padding={[15, 5]}>
                        <TextField
                            error={false}
                            label="Agent Name*"
                            name="ClientName"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.ClientName.value}
                            error={basicDetails.ClientName.error && basicDetails.ClientName.is_require}
                            helperText={basicDetails.ClientName.error && basicDetails.ClientName.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                            size="small"
                        />
                    </Column>
                    <Column md={3} padding={[15, 5]}>
                        <TextField
                            size="small"
                            error={false}
                            label="Registration Number*"
                            name="ClientRegisterationNo"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.ClientRegisterationNo.value}
                            error={basicDetails.ClientRegisterationNo.error && basicDetails.ClientRegisterationNo.is_require}
                            helperText={basicDetails.ClientRegisterationNo.error && basicDetails.ClientRegisterationNo.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={3} padding={[15, 5]}>
                        <TextField
                            size="small"
                            error={false}
                            label="License Number*"
                            name="ClientLicenseNo"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.ClientLicenseNo.value}
                            error={basicDetails.ClientLicenseNo.error && basicDetails.ClientLicenseNo.is_require}
                            helperText={basicDetails.ClientLicenseNo.error && basicDetails.ClientLicenseNo.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={3} padding={[15, 5]}>
                        <TextField
                            size="small"
                            error={false}
                            disabled={true}
                            label="Email*"
                            name="ClientEmail"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.ClientEmail.value}
                            error={basicDetails.ClientEmail.error && basicDetails.ClientEmail.is_require}
                            helperText={basicDetails.ClientEmail.error && basicDetails.ClientEmail.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <TextField
                            size="small"
                            error={false}
                            label="Website URL"
                            name="ClientWebsite"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.ClientWebsite.value}
                            error={basicDetails.ClientWebsite.is_require && basicDetails.ClientWebsite.is_require}
                            helperText={basicDetails.ClientWebsite.error && basicDetails.ClientWebsite.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <TextField
                            size="small"
                            error={false}
                            label="Address"
                            multiline
                            rows={2}
                            name="clientAddress"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.clientAddress.value}
                            error={basicDetails.clientAddress.error && basicDetails.clientAddress.is_require}
                            helperText={basicDetails.clientAddress.error && basicDetails.clientAddress.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <ContactNum
                            inputClass="small-height-field"
                            type="number"
                            label="Contact no.1"
                            name="ClientCon1"
                            value={basicDetails.ClientCon1.value}
                            error={basicDetails.ClientCon1.error}
                            onChange={basicDetailsStateUpdater}
                            helperText={basicDetails.ClientCon1.error ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <ContactNum
                            inputClass="small-height-field"
                            type="number"
                            label="Contact no.2"
                            name="ClientCon2"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.ClientCon2.value}
                            error={basicDetails.ClientCon2.error && basicDetails.ClientCon2.is_require}
                            helperText={basicDetails.ClientCon2.error && basicDetails.ClientCon2.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <TextField
                            size="small"
                            error={false}
                            label="Person name"
                            name="ClientConPersonName"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.ClientConPersonName.value}
                            error={basicDetails.ClientConPersonName.error && basicDetails.ClientConPersonName.is_require}
                            helperText={basicDetails.ClientConPersonName.error && basicDetails.ClientConPersonName.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <ContactNum
                            inputClass="small-height-field"
                            type="number"
                            label="Person contact no.1"
                            name="ClientConPersonCon1"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.ClientConPersonCon1.value}
                            error={basicDetails.ClientConPersonCon1.error && basicDetails.ClientConPersonCon1.is_require}
                            helperText={basicDetails.ClientConPersonCon1.error && basicDetails.ClientConPersonCon1.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <ContactNum
                            inputClass="small-height-field"
                            type="number"
                            label="Person contact no.2"
                            name="ClientConPersonCon2"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.ClientConPersonCon2.value}
                            error={basicDetails.ClientConPersonCon2.error && basicDetails.ClientConPersonCon2.is_require}
                            helperText={basicDetails.ClientConPersonCon2.error && basicDetails.ClientConPersonCon2.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <TextField
                            size="small"
                            error={false}
                            label="UserName"
                            name="UserName"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.UserName.value}
                            error={basicDetails.UserName.error && basicDetails.UserName.is_require}
                            helperText={basicDetails.UserName.error && basicDetails.UserName.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <TextField
                            size="small"
                            error={false}
                            label="Remarks"
                            name="ClientRemarks"
                            onChange={basicDetailsStateUpdater}
                            value={basicDetails.ClientRemarks.value}
                            error={basicDetails.ClientRemarks.error && basicDetails.ClientRemarks.is_require}
                            helperText={basicDetails.ClientRemarks.error && basicDetails.ClientRemarks.is_require ? "Incorrect entry." : ""}
                            variant="outlined"
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <Country
                            name="clientCountryKey"
                            error={basicDetails.clientCountryKey.error}
                            value={basicDetails.clientCountryKey.value}
                            onChange={basicDetailsStateUpdater}
                            helperText={basicDetails.clientCountryKey.error ? "Incorrect entry." : ""}
                        />
                    </Column>

                    <Column md={6} padding={[15, 5]}>
                        <Province
                            name="clientStateKey"
                            value={basicDetails.clientStateKey.value}
                            country_key={basicDetails.clientCountryKey.value}
                            error={basicDetails.clientStateKey.error}
                            onChange={basicDetailsStateUpdater}
                            helperText={basicDetails.clientStateKey.error ? "Incorrect entry." : ""}
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <City
                            name="clientCityKey"
                            value={basicDetails.clientCityKey.value}
                            country_key={basicDetails.clientCountryKey.value}
                            error={basicDetails.clientCityKey.error}
                            onChange={basicDetailsStateUpdater}
                            helperText={basicDetails.clientCityKey.error ? "Incorrect entry." : ""}
                        />
                    </Column>
                    <Column md={6} padding={[15, 5]}>
                        <Language
                            options={languages}
                            value={basicDetails.defaultLangCode.value}
                            name={"defaultLangCode"}
                            error={basicDetails.defaultLangCode.error}
                            onChange={basicDetailsStateUpdater}
                            helperText={basicDetails.defaultLangCode.error ? 'require field' : ''}
                            label={"defaultLangCode"}
                        />
                    </Column>
                </Row> : null
            }
        </>
    )
}

const BranchDetails = ({ branchInfoStateUpdater, fileStateUpdater, documents, removeBranch, branchInfo, classes, addBranch }) => {
    return (
        <Row padding={[10]}>
            <Column>
                <Row>
                    <Column>
                        {
                            branchInfo.map((value, index) => (
                                <NBranchDetails fileStateUpdater={fileStateUpdater} document={documents.length > index ? documents[index] : []} is_removeable={branchInfo.length > 1} value={value} removeBranch={removeBranch} branchInfoStateUpdater={branchInfoStateUpdater} index={index} classes={classes} key={"NBranchDetails_" + index} />
                            ))
                        }
                    </Column>
                    <Column right padding={[10]}>
                        <Button onClick={addBranch} variant="contained" color="primary" startIcon={<Add />}>Add</Button>
                    </Column>
                </Row>
            </Column>
        </Row>
    )
}

const NBranchDetails = ({ fileStateUpdater, document = [], is_removeable, branchInfoStateUpdater, removeBranch, value, index, classes, ...props }) => {
    const { Country, City, Province, Currency, ContactNum, Language } = DemandDropDown;

    return (
        <Card padding={[10]} {...props} margin={[5, 0]}>
            <Row>
                <Column md={3} padding={[15, 5]}>
                    <TextField
                        label="Outlet Name*"
                        name="clientBranchName"
                        // disabled={index == 0}
                        value={value.clientBranchName && value.clientBranchName.value}
                        error={value.clientBranchName && value.clientBranchName.error}
                        onChange={(e) => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchName && value.clientBranchName.error ? "Incorrect entry." : ""}
                        variant="outlined"
                        size="small"
                    />
                </Column>
                <Column md={3} padding={[15, 5]}>
                    <TextField
                        label="Registration Number*"
                        // disabled={index == 0}
                        name="clientBranchRegNo"
                        value={value.clientBranchRegNo.value}
                        error={value.clientBranchRegNo.error}
                        onChange={(e) => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchRegNo.error ? "Incorrect entry." : ""}
                        variant="outlined"
                        size="small"
                    />
                </Column>
                <Column md={3} padding={[15, 5]}>
                    <ContactNum
                        inputClass="small-height-field"
                        type="number"
                        label="Contact No.1 (Office)*"
                        name="clientBranchTeleNo1"
                        value={value.clientBranchTeleNo1.value}
                        error={value.clientBranchTeleNo1.error}
                        onChange={(e) => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchTeleNo1.error ? "Incorrect entry." : ""}
                        variant="outlined"
                    />
                </Column>
                <Column md={3} padding={[15, 5]}>
                    <ContactNum
                        inputClass="small-height-field"
                        type="number"
                        label="Contact No.2 (Office)"
                        name="clientBranchTeleNo2"
                        value={value.clientBranchTeleNo2.value}
                        error={value.clientBranchTeleNo2.error}
                        onChange={(e) => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchTeleNo2.error ? "Incorrect entry." : ""}
                        variant="outlined"
                    />
                </Column>
                <Column md={6} padding={[0, 5]}>
                    <TextField
                        name="clientBranchRemark"
                        variant="outlined"
                        size="small"
                        label="Remarks"
                        multiline
                        rows={2}
                        value={value.clientBranchRemark.value}
                        error={value.clientBranchRemark.error}
                        onChange={(e) => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchRemark.error ? "Incorrect entry." : ""}
                    />
                </Column>
                <Column md={6} padding={[0, 5]}>
                    <TextField
                        variant="outlined"
                        label="Address*"
                        size="small"
                        multiline
                        rows={2}
                        name="clientBranchAddress"
                        value={value.clientBranchAddress.value}
                        error={value.clientBranchAddress.error}
                        onChange={(e) => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchAddress.error ? "Incorrect entry." : ""}
                    />
                </Column>
                <Column md={3} padding={[15, 5]}>
                    <Country
                        name="clientBranchCountry"
                        error={value.clientBranchCountry.error}
                        value={value.clientBranchCountry.value}
                        onChange={e => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchCountry.error ? "Incorrect entry." : ""}
                    />
                </Column>

                <Column md={3} padding={[15, 5]}>
                    <Province
                        name="clientBranchState"
                        value={value.clientBranchState.value}
                        country_key={value.clientBranchCountry.value}
                        error={value.clientBranchState.error}
                        onChange={e => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchState.error ? "Incorrect entry." : ""}
                    />
                </Column>
                <Column md={3} padding={[15, 5]}>
                    <City
                        name="clientBranchCity"
                        value={value.clientBranchCity.value}
                        country_key={value.clientBranchCountry.value}
                        error={value.clientBranchCity.error}
                        onChange={e => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchCity.error ? "Incorrect entry." : ""}
                    />
                </Column>
                <Column md={3} padding={[15, 5]}>
                    <TextField
                        size="small"
                        label="Postal Code*"
                        name="ClientBranchPostCode"
                        value={value.ClientBranchPostCode.value}
                        error={value.ClientBranchPostCode.error}
                        onChange={(e) => branchInfoStateUpdater(e, index)}
                        helperText={value.ClientBranchPostCode.error ? "Incorrect entry." : ""}
                        variant="outlined"
                    />
                </Column>
                <Column md={3} padding={[15, 5]}>
                    <ContactNum
                        label="Mobile No.1 (office)*"
                        name="clientBranchMobileNo1"
                        value={value.clientBranchMobileNo1.value}
                        error={value.clientBranchMobileNo1.error}
                        onChange={(e) => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchMobileNo1.error ? "Incorrect entry." : ""}
                        variant="outlined"
                        inputClass="small-height-field"
                    />
                </Column>
                <Column md={3} padding={[15, 5]}>
                    <ContactNum
                        label="Mobile No.2 (office)"
                        name="clientBranchMobileNo2"
                        value={value.clientBranchMobileNo2.value}
                        error={value.clientBranchMobileNo2.error}
                        onChange={(e) => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchMobileNo2.error ? "Incorrect entry." : ""}
                        variant="outlined"
                        inputClass="small-height-field"
                    />
                </Column>
                <Column md={3} padding={[15, 5]}>
                    <TextField
                        label="Email*"
                        name="clientBranchEmail"
                        value={value.clientBranchEmail.value}
                        error={value.clientBranchEmail.error}
                        onChange={(e) => branchInfoStateUpdater(e, index)}
                        helperText={value.clientBranchEmail.error ? "Incorrect entry." : ""}
                        variant="outlined"
                        size="small"
                    />
                </Column>
                {document && document.length ?
                    <Column>
                        <Row>
                            <Column md={12}><Text style={{ marginLeft: 5 }} variant="h3" color="primary" component="h2" color="#003399">Documents :</Text></Column>
                            {
                                document.map((value_, index2) => (
                                    <Column md={3} xs={6} sm={6} padding={[10, 5]} key={"file_upload_" + index + "_" + index2}>
                                        <DocumentUpload
                                            key_={index + "_" + index2 + "file"}
                                            label="Image"
                                            tag="CLIENT_OTHER_DOC"
                                            document_name={value_.file["documentTypeName"]}
                                            type={value_.file[newConstants.DOCUMENT_TYPE_KEY]}
                                            file={value_.file[newConstants.FILE_NAME]}
                                            value={value_.file.value}
                                            name="FileInfo1"
                                            error={value_.file.error}
                                            onChange={(e) => fileStateUpdater(e, index, index2)}
                                        />
                                    </Column>
                                ))
                            }
                        </Row>
                    </Column> : null}
                <Column padding={[15, 5]} md={9} xs={5} sm={5} ></Column>
                <Column md={3} xs={7} sm={7} padding={[0, 5]} >
                    <Row >
                        <Column md={8} xs={8} sm={8} right>
                            <FormControlLabel
                                control={<Checkbox checked={value.isHeadOffice.value} color="primary" onChange={(e) => branchInfoStateUpdater(e, index)} name="isHeadOffice" />}
                                label="Head office"
                            />
                        </Column>
                        <Column md={4} xs={4} sm={4} padding={[5, 0]}>
                            {is_removeable ?
                                <Button onClick={() => removeBranch(index)} variant="contained" className={classes.remHover} size="small" startIcon={<Remove style={{ color: 'white' }} />}>Remove</Button>
                                : null}
                        </Column>
                    </Row>
                </Column>
            </Row>
        </Card>
    )
}

const FilesUpload = ({ classes, addFile, removeFile, fileInfoStateUpdater, files }) => {
    return (
        <Row padding={[10, 5]}>
            {files.map((value, index) => (
                <Column md={3} xs={6} sm={6} padding={[5]} key={index + 'images'}>
                    <Card padding={[10]}>
                        <Row>
                            <Column padding={[5]}>
                                <DropzoneArea
                                    label="Image"
                                    tag="CLIENT_OTHER_DOC"
                                    type={"Wo95BI9zQRE"}
                                    value={value.file.value}
                                    name="file"
                                    error={value.file.is_require && value.file.error}
                                    onChange={(e) => fileInfoStateUpdater(e, index)}
                                />
                            </Column>
                            <Column md={6} xs={5} sm={5}></Column>
                            <Column md={6} xs={7} sm={7} center>
                                <Row>
                                    <Column md={6} padding={[0, 5]} xs={6} sm={6}>
                                        {files.length - 1 == index && index != 0 ? (
                                            <Button
                                                onClick={() => removeFile(index)}
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                className={classes.addEdit}>
                                                <Remove />
                                            </Button>
                                        ) : null}
                                    </Column>
                                    <Column md={6} padding={[0, 5]} xs={6} sm={6}>
                                        <Button
                                            onClick={
                                                files.length - 1 == index ? () => addFile() : () => removeFile(index)
                                            }
                                            size="small"
                                            variant="contained"
                                            color="primary">
                                            {files.length - 1 == index ? <Add /> : <Remove />}
                                        </Button>
                                    </Column>
                                </Row>
                            </Column>
                            <Column>{value.file.error ? <Text bold color="red">Require field</Text> : null}</Column>

                        </Row>
                    </Card>
                </Column>
            ))}
        </Row>)
}
