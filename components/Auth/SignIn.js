import React, { useState, useEffect } from 'react';
// import IntlMessages from '../../@jumbo/utils/IntlMessages';
import { Box, fade, Button, TextField, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CmtImage from '../../@coremat/CmtImage';
import Link from 'next/link';
import AuthWrapper from './AuthWrapper';
import { useAuth } from '../../authentication';
import { agentLogin, branchSelection } from "../../helper/RequestPayLoad";
import { httpPostRequest } from "../../helper/JsHelper"
import { constants } from '../../helper/constants';
import { Loader, Row, Column, Text } from '../../core';
import { useStore } from '../../helper/Store';
import LanguageConfig from "../../helper/LanguageConfig"
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  submitBtn: {
    minWidth: 160,
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

const SignIn = ({ variant = 'default', wrapperVariant = 'default' }) => {
  const classes = useStyles({ variant });
  const { userLogin, userBranchSelection, clearStorage } = useAuth();
  const [email, setEmail] = useState({ isError: false, value: "", msg: "" });
  const [password, setPassword] = useState({ isError: false, value: "", msg: "" });
  const [customAlert, setCustomAlert] = useState({ active: false, variant: "", msg: "" });
  const [isDone, setIsDone] = useState(false);
  const [loader, setLoader] = useState(false);
  const { loadMultiLanguageBefore } = useStore();

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

    if (isOK) {
      setLoader(true);
      const res = await httpPostRequest(agentLogin(email.value.trim(), password.value.trim()));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        let isApprovedUser = res.data.isComplete;
        let loginResponse = res.data.clientLoginResponse
        setIsDone(true);

        if (!isApprovedUser) {
          userBranchSelection({ show: false, value: null });
          userLogin({
            key: res.data.key,
            is_completed: isApprovedUser,
            email: email.value.trim(),
            clientLoginResponse: loginResponse,
            userMenu: []
          });
        }
        // else if (isApprovedUser && loginResponse && loginResponse["client-branches"].length === 1) {
        //   const res1 = await httpPostRequest(branchSelection(loginResponse["client-branches"][0]["client-branch-key"]), res.data.key);
        //   if (res1 && res1[constants.DATA_EXCEPTION] && res1[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        //     userBranchSelection({ show: false, value: loginResponse["client-branches"][0]["client-branch-key"] });
        //     userLogin({
        //       key: res1.data.key,
        //       is_completed: res1.data.isComplete,
        //       email: email.value.trim(),
        //       clientLoginResponse: loginResponse,
        //       userMenu: res1.data.userMenu
        //     });
        //   } else {
        //     console.log('error on branch selection', res1);
        //     alert('error occurs on branch selection. please check console...');
        //   }
        // } 
        else {
          userBranchSelection({ show: true, value: null });
          userLogin({
            key: res.data.key,
            is_completed: isApprovedUser,
            email: email.value.trim(),
            clientLoginResponse: loginResponse,
            userMenu: []
          });
        }

        setCustomAlert({ active: true, variant: "success", msg: res[constants.DATA_EXCEPTION][constants.ERR_MSG] })
        setEmail({ isError: false, value: "", msg: "" });
        setPassword({ isError: false, value: "", msg: "" });
        // setAlertMsg({ type: 'success', msg: <LanguageConfig id={res[constants.DATA_EXCEPTION][constants.ERR_MSG]} /> })
        setLoader(false)
      } else {
        setCustomAlert({ active: true, variant: "error", msg: res[constants.DATA_EXCEPTION][constants.ERR_MSG] })
        setLoader(false)
        // setAlertMsg({ type: 'error', msg: <LanguageConfig id={res[constants.DATA_EXCEPTION][constants.ERR_MSG]} /> })
      }
    } else { setLoader(false) }
  };

  useEffect(() => {
    loadMultiLanguageBefore();
    return () => {
      console.log('is done', isDone)
      if(!isDone){
        clearStorage();
      }
    }
  }, []);

  return (
    <AuthWrapper variant={wrapperVariant}>
      <Box className={classes.authContent}>
        <Box mb={5}>
          <CmtImage src="/images/logo.png" />
        </Box>
        {customAlert.active && <Alert severity={customAlert.variant} style={{ marginBottom: '20px' }}>{customAlert.msg}</Alert>}
        <Typography component="div" variant="h1" className={classes.titleRoot}>
          <LanguageConfig id="login.login" />
        </Typography>
        <form onSubmit={onSubmit}>
          <Box mb={2}>
            <TextField
              label={<LanguageConfig id="login.email" />}
              fullWidth
              onChange={e => setEmail({ value: e.target.value, isError: e.target.value === "", msg: e.target.value === "" ? "This is required field!" : "" })}
              value={email.value}
              helperText={email.msg}
              error={email.isError}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
            />
          </Box>
          <Box mb={2}>
            <TextField
              type="password"
              label={<LanguageConfig id="login.password" />}
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
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
            <FormControlLabel
              className={classes.formcontrolLabelRoot}
              control={<Checkbox name="checkedA" />}
              label={<LanguageConfig id="login.rememberme" />}
            />

            <Link href="/forgotPassword">
              <a>
                <LanguageConfig id="Forgot your password?" />
              </a>
            </Link>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" mb={5}>
            <Button type="submit" variant="contained" color="primary" className={classes.submitBtn} disabled={loader}>
              <Row>
                {loader ? <Column md={1} xs={1} sm={1} center middle><Loader size={14} color={"white"} /></Column> : null}
                <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} sm={loader ? 11 : 12} center middle ><LanguageConfig id="login.signin" /></Column>
              </Row>
            </Button>
          </Box>
          <Box component="p" fontSize={{ xs: 12, sm: 16 }}>
            <Link href="/signup">
              <a>
                <LanguageConfig id="No account yet? Sign up now!" />
              </a>
            </Link>
          </Box>
        </form>
        {/* {renderSocialMediaLogin()} */}
      </Box>
    </AuthWrapper>
  );
};

export default SignIn;
