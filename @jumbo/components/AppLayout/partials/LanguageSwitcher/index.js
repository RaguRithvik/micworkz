import React, { useContext, useState } from 'react';
import { IconButton, Popover, useTheme, ListItem, Box } from '@material-ui/core';
import AppContext from '../../../contextProvider/AppContextProvider/AppContext';
import LanguageItem from './LanguageItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CmtCard from '../../../../../@coremat/CmtCard';
import CmtCardHeader from '../../../../../@coremat/CmtCard/CmtCardHeader';
import CmtList from '../../../../../@coremat/CmtList';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CmtImage from '../../../../../@coremat/CmtImage'; 
import {useStore} from "../../../../../helper/Store";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    '& .Cmt-header-root': {
      paddingTop: 14,
      paddingBottom: 14,
    },
  },
  perfectScrollbarLanguage: {
    height: 324,
  },
  menuItemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  popoverRoot: {
    '& .MuiPopover-paper': {
      width: 205,
    },
  },
  navCollapseBtnInner: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '9px 16px 9px 32px',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    '&:hover, &:focus': {
      color: theme.palette.sidebar.textDarkColor,
      backgroundColor: theme.palette.sidebar.navHoverBgColor,
      '& $iconRoot': {
        color: theme.palette.sidebar.textDarkColor,
      },
    },
    '.Cmt-miniLayout &': {
      paddingRight: 13,
      paddingLeft: 5,
    },
    '.Cmt-miniLayout .Cmt-sidebar-content:hover &': {
      paddingRight: 16,
      paddingLeft: 32,
    },
    navText: {
      flex: 1,
      fontSize: 14,
      letterSpacing: 0.25,
      whiteSpace: 'nowrap',
      '.Cmt-miniLayout .Cmt-sidebar-content:not(:hover) &': {
        display: 'none',
      },
    }
  }
}));

const LanguageSwitcher = () => {
  const classes = useStyles(); 
  const [anchorEl, setAnchorEl] = useState(null);
  const {languages,locale, updateLocale,language_image} = useStore(); //language-code"],label:v["language-desc
  const theme = useTheme();
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'language' : undefined;

  const switchLanguage = (item) => {
    updateLocale(item);
    handleClose();
  }; 
  return (
    <React.Fragment>
      <ListItem onClick={handleClick} >
        <Box component="span" className={classes.navCollapseBtnInner}>
          <IconButton size="small" data-tut="reactour__localization">
            <CmtImage src={language_image[locale.value]} /> 
          </IconButton>
          {/* <Box component="span" className={classes.navText}>{locale.label}</Box> */}
        </Box>
      </ListItem>
      <Popover
        className={classes.popoverRoot}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <CmtCard className={classes.cardRoot}>
          <CmtCardHeader
            title="Language"
            separator={{
              color: theme.palette.borderColor.dark,
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          />
          <PerfectScrollbar className={classes.perfectScrollbarLanguage}>
            <CmtList
              data={languages}
              renderRow={(item, index) => <LanguageItem key={index} language={{...item,flag:language_image[item.value]}} onClick={switchLanguage} />}
            />
          </PerfectScrollbar>
        </CmtCard>
      </Popover>
    </React.Fragment>
  );
};

export default LanguageSwitcher;
