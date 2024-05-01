import React, { useState } from 'react';
import { Box, fade, MenuItem, TextField, Button, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CmtImage from '../../@coremat/CmtImage';
import AuthWrapper from './AuthWrapper';
import { useRouter } from 'next/router';
import { Alert } from '@material-ui/lab';
import { useAuth } from '../../authentication';
import { httpPostRequest } from "../../helper/JsHelper"
import { branchSelection } from "../../helper/RequestPayLoad";
import { constants } from '../../helper/constants';
import { NotificationLoader } from '../../@jumbo/components/ContentLoader';

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
const BranchSelection = ({ variant = 'default', wrapperVariant = 'default' }) => {
  const classes = useStyles({ variant });
  const { isLoading, error, authUser, userBranchSelection, userLogin } = useAuth();
  const [branch, setBranch] = useState({ isError: false, value: "", msg: "" });
  const [customAlert, setCustomAlert] = useState({ active: false, variant: "", msg: "" });
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  // const [open, setOpen] = React.useState(false);
  // const branches = [{ value: '2sCl2ZwWgTup1RcRV8Nf9mkgHjACWj9Lf9wirbOATSc=', label: 'HQ', }];

  const onSubmit = async e => {
    e.preventDefault();
    setCustomAlert({ active: false, variant: '', msg: '' })
    let isOK = true;
    if (!branch.value) {
      setBranch({ ...branch, isError: true, msg: "This is required field!" });
      isOK = false;
    }

    if (isOK) {
      setLoader(true);
      const res = await httpPostRequest(branchSelection(branch.value));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        userBranchSelection({ show: false, value: branch.value });
        userLogin({
          key: res.data.key,
          is_completed: res.data.isComplete,
          email: authUser.email,
          clientLoginResponse: { 'client-branches': authUser.clientLoginResponse['client-branches'] },
          userMenu: res.data.userMenu
        });
        setTimeout(() => router.push('/dashboard/').then((r) => r), 500);
      } else { setLoader(false) }
    } else { setLoader(false) }
  };

  return (
    <AuthWrapper variant={wrapperVariant}>
      {/* {variant === 'default' ? ( */}
      <Box className={classes.authThumb}>
        <CmtImage src={'/images/auth/forgot-img.png'} />
      </Box>
      {/* ) : null} */}
      <Box className={classes.authContent}>
        <Box mb={7}>
          <CmtImage src={'/images/logo.png'} />
        </Box>
        {customAlert.active && <Alert severity={customAlert.variant} style={{ marginBottom: '20px' }}>{customAlert.msg}</Alert>}
        <Typography component="div" variant="h1" className={classes.titleRoot}>
          Branch Selection
        </Typography>
        <form onSubmit={onSubmit}>
          <Box mb={5}>
            <TextField
              id="outlined-select"
              size="small"
              select
              label="Branch*"
              fullWidth
              value={branch.value}
              helperText={branch.msg}
              error={branch.isError}
              margin="normal"
              onChange={e => setBranch({ value: e.target.value, isError: e.target.value === "", msg: e.target.value === "" ? "This is required field!" : "" })}
              variant="outlined"
            >
              {authUser && authUser.clientLoginResponse && authUser.clientLoginResponse['client-branches'].map((option) => (
                <MenuItem key={option['client-branch-key']} value={option['client-branch-key']}>
                  {option['client-branch-name']}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box mb={5}>
            <Button type="submit" variant="contained" color="primary" disabled={loader}>
              Proceed
            </Button>
          </Box>
        </form>

        <NotificationLoader loading={isLoading} error={error} />
      </Box>
    </AuthWrapper>
  );
};

export default BranchSelection;
