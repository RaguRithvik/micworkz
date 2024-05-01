import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { wrapper } from '../redux/store/index';
import AppWrapper from '../@jumbo/components/AppWrapper';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-notifications/lib/notifications.css';
import 'prismjs/themes/prism-okaidia.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "react-daterange-picker/dist/css/react-calendar.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';  //react big calendar css//
import 'react-phone-input-2/lib/material.css';
import AppContextProvider from '../@jumbo/components/contextProvider/AppContextProvider';
import { AuthProvider } from '../authentication';
import { StoreProvider } from "../helper/Store";

const MainApp = (props) => {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Tripwerkz - Agent Dashboard</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <AuthProvider>
        <AppContextProvider>
          <StoreProvider>
            <AppWrapper>
              <Component {...pageProps} />
            </AppWrapper>
          </StoreProvider>
        </AppContextProvider>
      </AuthProvider>
    </React.Fragment>
  );
};

MainApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default wrapper.withRedux(MainApp);
