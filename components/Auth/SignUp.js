import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import IntlMessages from '../../@jumbo/utils/IntlMessages';
import { Box, fade, Typography, Button } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CmtImage from '../../@coremat/CmtImage';
import AuthWrapper from './AuthWrapper';;
import { createAgentBySignup, isEmailExist } from "../../helper/RequestPayLoad";
import { httpPostRequest } from "../../helper/JsHelper"
import { newConstants } from '../../helper/constants';
import { Loader, Row, Column, Text, DemandDropDown } from '../../core';
import { useRouter } from 'next/router';
import LanguageConfig from "../../helper/LanguageConfig";
import Link from 'next/link';
import * as EmailValidator from 'email-validator';
import Alert from '@material-ui/lab/Alert';
import { useAuth } from '../../authentication';
import { useStore } from '../../helper/Store';

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

const SignUp = ({ variant = 'default', wrapperVariant = 'default' }) => {
  const classes = useStyles({ variant });
  const { clearStorage } = useAuth();
  const [email, setEmail] = useState({ isError: false, value: "", msg: "", checking: false });
  const [phone, setPhone] = useState({ isError: false, value: null, msg: "", country: 'us', code: '1' });
  const [companyName, setCompanyName] = useState({ isError: false, value: "", msg: "" });
  const [customAlert, setCustomAlert] = useState({ active: false, variant: "", msg: "" });

  const [loader, setLoader] = useState(false);
  const { loadMultiLanguageBefore } = useStore()
  const [userNameAvilablity, setUserNameAvilablity] = useState(false);
  const [tag, setTag] = useState(1);
  const router = useRouter();
  const { ContactNumber } = DemandDropDown;

  const onSubmit = async (e) => {
    e.preventDefault();
    setCustomAlert({ ...customAlert, active: false });
    let isOK = true;
    if (!email.value.trim()) {
      setEmail({ ...email, isError: true, msg: "This is required field!" });
      isOK = false;
    }

    if (email.value.trim() && !EmailValidator.validate(email.value.trim())) {
      setEmail({ ...email, isError: true, msg: "Invalid email" });
      isOK = false;
    }

    if (email.value.trim() && EmailValidator.validate(email.value.trim()) && !userNameAvilablity) {
      setEmail({ ...email, isError: true, msg: "Email already registered." });
      isOK = false;
    }

    if (!companyName.value.trim()) {
      setCompanyName({ ...companyName, isError: true, msg: "This is required field!" });
      isOK = false;
    }

    if (!phone.value || phone.value === phone.code) {
      setPhone({ ...phone, isError: true, msg: "This is required field!" });
      isOK = false;
    }

    if (isOK) {
      setLoader(true);
      const res = await httpPostRequest(createAgentBySignup({ email: email.value, cname: companyName.value, phone: phone.value }));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        if (res.data) {
          // setAlertMsg({ type: 'success', msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
          setTag(2);
          setCustomAlert({ active: true, variant: "success", msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
          setPhone({ isError: false, value: null, msg: "", country: 'us', code: '1' });
          setEmail({ isError: false, value: "", msg: "", checking: false });
          setCompanyName({ isError: false, value: "", msg: "" });
        } else {
          setCustomAlert({ active: true, variant: "success", msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
          // setAlertMsg({ type: 'success', msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
        }
        setLoader(false);
      } else {
        setCustomAlert({ active: true, variant: "error", msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
        setLoader(false)
        // setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
      }
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    loadMultiLanguageBefore();
    return () => {
      clearStorage();
    }
  }, []);

  return (
    <AuthWrapper variant={wrapperVariant}>
      <Box className={classes.authContent}>
        <Box mb={5}>
          <CmtImage src="/images/logo.png" />
        </Box>
        {customAlert.active && <Alert severity={customAlert.variant} style={{marginBottom: '20px'}}>{customAlert.msg}</Alert>}
        {tag == 1 ?
          <Typography component="div" variant="h1" className={classes.titleRoot}>
            Register
          </Typography> : null}
        {tag == 1 ?
          <form onSubmit={onSubmit}>
            <Box>
              <EmailId
                label={<IntlMessages id="Email" />}
                fullWidth
                setEmail={setEmail}
                name="EmailId"
                value={EmailId.value}
                setUserNameAvilablity={setUserNameAvilablity}
                userNameAvilablity={userNameAvilablity}
                email={email}
                margin="normal"
                variant="outlined"
                className={classes.textFieldRoot}
                style={{ marginBottom: 0 }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                type="text"
                label={<IntlMessages id="Company Name" />}
                fullWidth
                name={"CompanyName"}
                value={companyName.value}
                helperText={companyName.msg}
                error={companyName.isError}
                onChange={e => setCompanyName({ isError: e.target.value === "", value: e.target.value, msg: e.target.value === "" ? "This is required field!" : "" })}
                margin="normal"
                variant="outlined"
                className={classes.textFieldRoot}
              />
            </Box>
            <Box mb={2}>
              <ContactNumber
                type="number"
                name="ContactNo"
                label={<IntlMessages id="Contact Number" />}
                fullWidth
                setValue={setPhone}
                value={phone}
                margin="normal"
                variant="outlined"
                className={classes.textFieldRoot}
              />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" m={5}>
              <Button type="submit" variant="contained" color="primary" className={classes.submitBtn} disabled={loader}>
                <Row>
                  {loader ? <Column md={1} xs={1} sm={1} center middle><Loader size={14} color={"white"} /></Column> : null}
                  <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} sm={loader ? 11 : 12} center middle ><IntlMessages id="SignUp" /></Column>
                </Row>
              </Button>
            </Box>
            <Box component="p" fontSize={{ xs: 12, sm: 16 }}>
              <span>Already have an account?</span>
              <Link href="/signin">
                <a>
                  <LanguageConfig id=" Sign In" />
                </a>
              </Link>
            </Box>
          </form> :
          <Row center middle padding={[0, 0, 20, 0]}>
            <Typography component="div" variant="h2" className={classes.titleRoot}>
              Thank you for registration
            </Typography>
            <Text component="div" variant="h4" className={classes.verifyContent} color="#006400">
              We have sent a E-mail verification link to the registered email address, click the link and set password for your account.
            </Text>
            <Button onClick={() => router.push("/signin")} type="submit" variant="contained" color="primary" className={classes.signInBtn}>
              <IntlMessages id="SignIn" />
            </Button>
          </Row>
        }
      </Box>
    </AuthWrapper>
  );
};

export default SignUp;

const EmailId = ({ setUserNameAvilablity, setEmail, email, userNameAvilablity, ...props }) => {
  const change = async (e) => {
    setUserNameAvilablity(false);
    let value = e.target.value;
    if (!value) {
      setEmail({ value: value, isError: true, msg: "This is required field!" })
    } else if (!EmailValidator.validate(value)) {
      setEmail({ isError: false, msg: "Waiting for valid email...", value: value })
    } else {
      setEmail({ value: value, checking: true, msg: 'checking...' });
      let res = await httpPostRequest(isEmailExist(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200 && !res[newConstants.DATA]) {
        setUserNameAvilablity(true);
        setEmail({ value: value, isError: false, msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG], checking: false })
      } else {
        setUserNameAvilablity(false);
        setEmail({ value: value, isError: true, msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG], checking: false })
      }
    }
  }
  return <TextField error={email.isError} onChange={change} helperText={!email.isError && userNameAvilablity ? <p style={{ color: "green", fontSize: 14, fontWeight: 'bold' }}>{email.msg}</p> : email.msg} {...props} />
}
