import React, { cloneElement, isValidElement } from 'react';
import { List } from '@material-ui/core';
import Link from 'next/link';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  navMenuItem: {
    padding: '0 16px 0 0',
    position: 'relative',
    '.Cmt-miniLayout .Cmt-sidebar-content:not(:hover) &': {
      paddingLeft: 16,
    },
  },
  navMenuLink: {
    display: 'flex',
    alignItems: 'center',
    marginTop:3,
    padding: '12px 16px 12px 32px',
    borderRadius: 5, 
    color: theme.palette.sidebar.textColor,
    '&:hover, &:focus': {
      color: theme.palette.sidebar.textDarkColor,
      backgroundColor: theme.palette.sidebar.navHoverBgColor,
      '& .Cmt-icon-root, & .Cmt-nav-text': {
        color: theme.palette.sidebar.textDarkColor,
      },
    },
    '&.active': {
      color: theme.palette.sidebar.textActiveColor,
      backgroundColor: theme.palette.sidebar.navActiveBgColor,
      '& .Cmt-icon-root, & .Cmt-nav-text': {
        color: theme.palette.sidebar.textActiveColor,
      },
      '&:hover, &:focus': {
        '& .Cmt-nav-text, & .Cmt-icon-root': {
          color: theme.palette.sidebar.textActiveColor,
        },
      },
    },
    '.Cmt-miniLayout .Cmt-sidebar-content:not(:hover) &': {
      justifyContent: 'center',
      padding: 0,
      height: 40,
      width: 40,
      borderRadius: '50%',
      marginLeft: 4,
      marginRight: 4,
    },
  },
  navText: {
    color:'#ffffff',
    flex: 1,
    fontSize: 14,
    '.Cmt-miniLayout .Cmt-sidebar-content:not(:hover) &': {
      display: 'none',
    },
  },
  iconRoot: {
    color:'#ffffff',
    marginRight: 16,
    fontSize: 20,
    '.Cmt-miniLayout .Cmt-sidebar-content:not(:hover) &': {
      marginRight: 0 
    },
  },
}));

const NavMenuItem = (props) => {
  const { name, icon, link } = props;
  const classes = useStyles();
  const router = useRouter();

  const renderIcon = () => {
    if (icon && isValidElement(icon)) {
      return cloneElement(icon, {
        className: clsx(classes.iconRoot, 'Cmt-icon-root'),
      });
    }

    return null;
  };

  return (
    <List component="div" className={clsx(classes.navMenuItem, 'Cmt-nav-menu-item')}>
      <Link href={link}>
        <a
          className={clsx(
            classes.navMenuLink,
            {
              active: link === router.pathname,
            },
            'Cmt-nav-menu-link',
          )}>
          {/* Display an icon if any */}
          {renderIcon()}
          <Box component="span" className={clsx(classes.navText, 'Cmt-nav-text')}>
            {name}
          </Box>
        </a>
      </Link>
    </List>
  );
};

export default NavMenuItem;
