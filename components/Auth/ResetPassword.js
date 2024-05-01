import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import IntlMessages from '../../@jumbo/utils/IntlMessages';
import { Box, fade, Typography, Button } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CmtImage from '../../@coremat/CmtImage';
import AuthWrapper from './AuthWrapper';
import { verifyEmail, resetPassword } from "../../helper/RequestPayLoad";
import { httpPostRequest } from "../../helper/JsHelper"
import { newConstants } from '../../helper/constants';
import { Loader, Row, Column } from '../../core';
import { useRouter } from 'next/router'
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    submitBtn: {
        minWidth: 160,
    },
    signInBtn: {
        marginTop: 20
    },
    authThumb: {
        backgroundColor: fade(theme.palette.primary.main, 0.12),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '50%',
            order: 2,
        },
    },
    authContent: {
        padding: 30,
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: (props) => (props.variant === 'default' ? '50%' : '100%'),
            order: 1,
        },
        [theme.breakpoints.up('xl')]: {
            padding: 50,
        },
    },
    titleRoot: {
        marginBottom: 14,
        color: theme.palette.text.primary,
    },
    verifyContent: {
        paddingTop: 10,
        paddingBottom: 10
    },
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: fade(theme.palette.common.dark, 0.12),
        },
    },
    formcontrolLabelRoot: {
        '& .MuiFormControlLabel-label': {
            [theme.breakpoints.down('xs')]: {
                fontSize: 12,
            },
        },
    },
}));

const ResetPassword = ({ variant = 'default', wrapperVariant = 'default' }) => {
    const classes = useStyles({ variant });
    const [email, setEmail] = useState({ isError: false, value: "", msg: "" });
    const [password, setPassword] = useState({ isError: false, value: "", msg: "" });
    const [cpassword, setCPassword] = useState({ isError: false, value: "", msg: "" });
    const [customAlert, setCustomAlert] = useState({ active: false, variant: "", msg: "" });
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const getEmailId = async () => {
        let id = router.asPath.replace("/resetpassword/?id=", "");
        if (id) {
            setEmail({ isError: false, value: "", msg: "" });
            const res = await httpPostRequest(verifyEmail(id));
            if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200 && res.data.isExist) {
                setEmail({ isError: false, value: res.data.emailId, msg: "" });
            } else {
                setCustomAlert({ active: true, variant: "error", msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
                router.push("/signin");
            }
        }
        else {
            router.push("/signin");
        }
    }
    useEffect(() => {
        getEmailId();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        setCustomAlert({ ...customAlert, active: false });
        let isOK = true;
        if (!email.value.trim()) {
            setEmail({ ...email, isError: true, msg: "This is required field!" });
            isOK = false;
        }

        if (!password.value.trim()) {
            setPassword({ ...password, isError: true, msg: "This is required field!" });
            isOK = false;
        }

        if (!cpassword.value.trim()) {
            setCPassword({ ...cpassword, isError: true, msg: "This is required field!" });
            isOK = false;
        }

        if (password.value.trim() && cpassword.value.trim() && (password.value.trim() !== cpassword.value.trim())) {
            setCPassword({ ...cpassword, isError: true, msg: "Password and confirm password doesn't match." });
            isOK = false;
        }

        if (isOK) {
            setLoader(true);
            const res = await httpPostRequest(resetPassword(email.value.trim(), password.value.trim(), cpassword.value.trim()))
            if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
                setCustomAlert({ active: true, variant: "success", msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
                setEmail({ isError: false, value: "", msg: "" });
                setPassword({ isError: false, value: "", msg: "" });
                setCPassword({ isError: false, value: "", msg: "" });
                setLoader(false);
                router.push("/signin");
            } else {
                setLoader(false)
                setCustomAlert({ active: true, variant: "error", msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
            }
        } else { setLoader(false) }
    };

    return (
        <AuthWrapper variant={wrapperVariant}>
            <Box className={classes.authContent}>
                <Box mb={7}>
                    <CmtImage src="/images/logo.png" />
                </Box>
                {customAlert.active && <Alert severity={customAlert.variant} style={{ marginBottom: '20px' }}>{customAlert.msg}</Alert>}
                <Typography component="div" variant="h1" className={classes.titleRoot}>
                    Set Password
                </Typography>
                <form onSubmit={onSubmit}>
                    <Box mb={1}>
                        <TextField
                            type="text"
                            label={<IntlMessages id="Email" />}
                            fullWidth
                            name={"Email"}
                            disabled={true}
                            onChange={e => setEmail({ value: e.target.value, isError: e.target.value === "", msg: e.target.value === "" ? "This is required field!" : "" })}
                            value={email.value}
                            helperText={email.msg}
                            error={email.isError}
                            margin="normal"
                            variant="outlined"
                            className={classes.textFieldRoot}
                        />
                    </Box>
                    <Box mb={1}>
                        <TextField
                            type="password"
                            name="Password"
                            label={<IntlMessages id="Password" />}
                            fullWidth
                            helperText={password.msg}
                            error={password.isError}
                            onChange={e => setPassword({ value: e.target.value, isError: e.target.value === "", msg: e.target.value === "" ? "This is required field!" : "", checking: false })}
                            value={password.value}
                            margin="normal"
                            variant="outlined"
                            className={classes.textFieldRoot}
                        />
                    </Box>
                    <Box mb={4}>
                        <TextField
                            type="password"
                            name="Con_Password"
                            label={<IntlMessages id="Confirm Password" />}
                            fullWidth
                            helperText={cpassword.msg}
                            error={cpassword.isError}
                            onChange={e => setCPassword({ value: e.target.value, isError: e.target.value === "", msg: e.target.value === "" ? "This is required field!" : "", checking: false })}
                            value={cpassword.value}
                            margin="normal"
                            variant="outlined"
                            className={classes.textFieldRoot}
                        />
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={5}>
                        <Button type="submit" variant="contained" color="primary" className={classes.submitBtn}>
                            <Row>
                                {loader ? <Column md={1} xs={1} sm={1} center middle><Loader size={14} color={"white"} /></Column> : null}
                                <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} sm={loader ? 11 : 12} center middle ><IntlMessages id="Submit" /></Column>
                            </Row>
                        </Button>
                    </Box>
                </form>
            </Box>
        </AuthWrapper>
    );
};

export default ResetPassword;

