import React, { useContext, useEffect } from 'react';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme, jssPreset, StylesProvider } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import { create } from 'jss';
import rtl from 'jss-rtl';
import AppContext from '../contextProvider/AppContextProvider/AppContext';
import AppLayout from '../AppLayout';
import CssBaseline from '@material-ui/core/CssBaseline'; 

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const AppWrapper = ({ children }) => {
  const { theme,  direction } = useContext(AppContext);

  useEffect(() => {
    if (direction === 'rtl') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }
  }, [direction]);


  return (
      <ThemeProvider theme={createMuiTheme(theme)}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <StylesProvider jss={jss}>
            <CssBaseline />
            <AppLayout>
              {children}
            </AppLayout>
          </StylesProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
  );
};

export default AppWrapper;
