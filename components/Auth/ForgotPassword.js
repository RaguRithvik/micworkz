import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Box, Collapse, fade, IconButton } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CmtImage from '../../@coremat/CmtImage';
import Typography from '@material-ui/core/Typography';
import AuthWrapper from './AuthWrapper';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import { useAuth } from '../../authentication';
import { httpPostRequest } from "../../helper/JsHelper"
import { forgotPasswordRequest } from "../../helper/RequestPayLoad";
import { newConstants } from '../../helper/constants';
import Link from 'next/link';
import { NotificationLoader } from '../../@jumbo/components/ContentLoader';
import * as EmailValidator from 'email-validator';
import { useStore } from '../../helper/Store';

const useStyles = makeStyles((theme) => ({
  authThumb: {
    backgroundColor: fade(theme.palette.primary.main, 0.12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    [theme.breakpoints.up('md')]: {
      width: '50%',
      order: 2,
    },
  },
  authContent: {
    padding: 30,
    [theme.breakpoints.up('md')]: {
      order: 1,
      width: (props) => (props.variant === 'default' ? '50%' : '100%'),
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
  alertRoot: {
    marginBottom: 10,
  },
}));

//variant = 'default', 'standard', 'bgColor'
// eslint-disable-next-line react/prop-types
const ForgotPassword = ({ variant = 'default', wrapperVariant = 'default' }) => {
  const classes = useStyles({ variant });
  const { isLoading, error, clearStorage } = useAuth();
  const [email, setEmail] = useState({ isError: false, value: "", msg: "" });
  const [customAlert, setCustomAlert] = useState({ active: false, variant: "", msg: "" });
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = React.useState(false);
  const { loadMultiLanguageBefore } = useStore();

  const onSubmit = async e => {
    e.preventDefault();
    setCustomAlert({ active: false, variant: '', msg: '' })
    let isOK = true;
    if (!email.value.trim()) {
      setEmail({ ...email, isError: true, msg: "This is required field!" });
      isOK = false;
    }

    if (email.value.trim() && !EmailValidator.validate(email.value.trim())) {
      setEmail({ ...email, isError: true, msg: "Invalid email" });
      isOK = false;
    }

    if (isOK) {
      setLoader(true);
      const res = await httpPostRequest(forgotPasswordRequest({ email: email.value }));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        if (res.data) {
          setEmail({ isError: false, value: "", msg: "" });
        }
        setCustomAlert({ active: true, variant: "success", msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
        setLoader(false);
      } else {
        setCustomAlert({ active: true, variant: "error", msg: res[newConstants.DATA_EXCEPTION][newConstants.ERR_MSG] })
        setLoader(false);
      }
    } else { setLoader(false) }
  };

  useEffect(() => {
    loadMultiLanguageBefore();
    return () => {
      clearStorage();
    }
  }, []);

  return (
    <AuthWrapper variant={wrapperVariant}>
      {variant === 'default' ? (
        <Box className={classes.authThumb}>
          <CmtImage src={'/images/auth/forgot-img.png'} />
        </Box>
      ) : null}
      <Box className={classes.authContent}>
        <Box mb={7}>
          <CmtImage src={'/images/logo.png'} />
        </Box>
        {customAlert.active && <Alert severity={customAlert.variant} style={{marginBottom: '20px'}}>{customAlert.msg}</Alert>}
        <Typography component="div" variant="h1" className={classes.titleRoot}>
          Account Recovery
        </Typography>
        <Collapse in={open}>
          <Alert
            variant="outlined"
            severity="success"
            className={classes.alertRoot}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }>
            A mail has been sent on your email address with reset password link.
          </Alert>
        </Collapse>
        <form onSubmit={onSubmit}>
          <Box mb={5}>
            <TextField
              label='Email Address'
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
          <Box mb={5}>
            <Button type="submit" variant="contained" color="primary">
              Send Recovery Email
            </Button>
          </Box>

          <Box>
            <Typography>
              {"Already have an account?"}
              <Box component="span" ml={2}>
                <Link href="/signin">Sign In</Link>
              </Box>
            </Typography>
          </Box>
        </form>

        <NotificationLoader loading={isLoading} error={error} />
      </Box>
    </AuthWrapper>
  );
};

export default ForgotPassword;
