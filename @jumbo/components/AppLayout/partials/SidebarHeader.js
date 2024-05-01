import React,{useState} from 'react';
import { Box, MenuItem, MenuList, Paper, Popover, Typography } from '@material-ui/core';
import CmtAvatar from '../../../../@coremat/CmtAvatar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person'; 
import CropFreeIcon from '@material-ui/icons/CropFree';
import CropIcon from '@material-ui/icons/Crop';
import { useAuth } from '../../../../authentication';
import { useRouter } from 'next/router'; 
import SidebarToggleHandler from '../../../../@coremat/CmtLayouts/Vertical/SidebarToggleHandler';
import LanguageConfig from "../../../../helper/LanguageConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '30px 16px 12px 16px',
    borderBottom: `solid 1px ${theme.palette.sidebar.borderColor}`,
  },
  userInfo: {
    paddingTop: 24,
    transition: 'all 0.1s ease',
    height: 75,
    opacity: 1,
    '.Cmt-miniLayout .Cmt-sidebar-content:not(:hover) &': {
      height: 0,
      paddingTop: 0,
      opacity: 0,
      transition: 'all 0.3s ease',
    },
  },
  
  nailButton: {
    transition: 'all 0.1s ease', 
    color:'#ffffff',
    opacity: 1,
    '.Cmt-miniLayout .Cmt-sidebar-content:not(:hover) &': {
      height: 0,
      paddingTop: 0,
      opacity: 0,
      transition: 'all 0.3s ease',
    }
  },
  userTitle: {
    color: '#ffffff',
    marginBottom: 8,
  },
  userSubTitle: {
    fontSize: 14,
    color:'#ffffff',
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: 0.25,
  },
  userDownArrow:{
    color:'#ffffff' 
  }
}));

const SidebarHeader = () => {
  const classes = useStyles();
  const { userSignOut,authUser } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null); 

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onLogoutClick = () => {
    handlePopoverClose();
    userSignOut(() => {
      router.push('/').then((r) => r);
      localStorage.clear();
    });
  };

  return (
    <Box className={classes.root}>
      <div style={{position:'absolute',top:5,right:5}}>
          <SidebarToggleHandler className={classes.nailButton} iconOpen={<CropFreeIcon/>} iconClose={<CropIcon/>}/>
      </div>
      <CmtAvatar src={'/logo192.png'} alt="R" />
      <Box className={classes.userInfo} onClick={handlePopoverOpen}>
        <Box className="pointer" display="flex" justifyContent="space-between" alignItems="flex-end">
          <Box mr={2}>
            <Typography className={classes.userTitle} component="h3" variant="h6">
              {authUser&&authUser.email?authUser.email:""}
            </Typography>
            <Typography className={classes.userSubTitle}>@<LanguageConfig id="agent" /></Typography>
          </Box>
          <ArrowDropDownIcon className={classes.userDownArrow}/>
        </Box>  
      </Box>

      {open && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          container={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}>
          <Paper elevation={8}>
            <MenuList>
              <MenuItem onClick={()=>{ 
                router.push('/dashboard/profile/');
                handlePopoverClose
              }
                }>
                <PersonIcon />
                <Box ml={2}><LanguageConfig id="menus.profile" /></Box>
              </MenuItem> 
              <MenuItem onClick={onLogoutClick}>
                <ExitToAppIcon />
                <Box ml={2}><LanguageConfig id="menus.logout" /></Box>
              </MenuItem>
            </MenuList>
          </Paper>
        </Popover>
      )}
    </Box>
  );
};

export default SidebarHeader;
