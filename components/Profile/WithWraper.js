import React from 'react';
import AuthWrapper from "../Auth/AuthWrapper"
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import Profile from "./index"


const useStyles = makeStyles((theme) => ({
    authContent: { 
    width: '100%',
    [theme.breakpoints.up('md')]: { 
      order: 1,
    },
    [theme.breakpoints.up('xl')]: {
      padding: 50,
    },
  } 
}));


export default function WithWraper() {
  const classes = useStyles();
  return(<AuthWrapper><Profile/></AuthWrapper>)
}