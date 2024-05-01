import React, { useState, useRef, useEffect } from 'react';
import { Row, Column, Text, Card, Touchable, Loader } from '../../../core';
import { fade, Button, Divider, InputBase, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Search, ConfirmationNumber, LocationCity } from '@material-ui/icons';
import { httpPostRequest } from '../../../helper/JsHelper';
import { getEventsAutoComplete } from '../../../helper/RequestPayLoadBookings';
import { constants } from '../../../helper/constants';
import useOutsideClick from '../../../core/OutsideClickListener';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  searchLoader: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: 5,
    padding: theme.spacing(2, 4, 3),
  },
  autoCompleteContainer: {
    position: 'absolute',
    top: 44,
    maxHeight: '60vh',
    zIndex: 1,
    overflowY: 'scroll',
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
    width: '100%',
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 1),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 1),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    color: 'black',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    width: '100%',
    // color: 'inherit',
  },
  appBar: {
    padding: 10,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    width: '30ch',
    height: 34,
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    textAlign: 'left',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      width: '23ch',
    },
  },
  submitButton: {
    paddingTop: 9,
    paddingBottom: 9,
  },

  borderstartDater: { borderRadius: '20px' },
}));

const EventSearchBar = () => {
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const [key, setKey] = useState('');
  const [selected, setSelected] = useState({});
  const ref = useRef();
  const router = useRouter();

  useEffect(() => {
    setSelected(router.query && router.query.cg ? router.query : {});
    setKey(router.query.name ? decodeURI(router.query.name) : '');
    setSelected({
      cg: router.query.cg ? router.query.cg : '',
      conid: router.query.conid ? router.query.conid : '',
      stid: router.query.stid ? router.query.stid : '',
      cid: router.query.cid ? router.query.cid : '',
      pkey: router.query.pkey ? router.query.pkey : '',
      lang: router.query.lang ? router.query.lang : 'en-US',
      ppti: router.query.ppti ? router.query.ppti : '',
    });
  }, [router.query]);

  useOutsideClick(ref, () => {
    setAutoCompleteResult([]);
  });

  const onKeying = async (e) => {
    setKey(e.target.value);
    if (e.target.value.length > 2) {
      setLoader(true);
      const res = await httpPostRequest(getEventsAutoComplete(e.target.value));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setAutoCompleteResult(res[constants.DATA]);
        setLoader(false);
      } else {
        setKey('');
        setLoader(false);
      }
    }
  };

  const submit = (val) => {
    setKey(val.name);
    if (val && val.category == 'EVENTS') {
      val = {
        name: encodeURI(val.name),
        cg: val.category,
        conid: val.country_Id,
        stid: val.state_Id,
        cid: val.city_Id,
        pkey: val.productKey,
        ppti: val.productProviderTypeId,
        lang: 'en-US',
      };
    } else {
      val = {
        name: encodeURI(val.name),
        cg: val.category,
        conid: val.country_Id,
        stid: val.state_Id,
        cid: val.city_Id,
        pkey: val.productKey,
        ppti: val.productProviderTypeId,
        lang: 'en-US',
      };
    }

    setSelected(val);
    setAutoCompleteResult([]);
  };

  const onFilter = () => {
    if (selected.cg == '' || selected.cg == null) {
      alert('please search and select events or city');
    } else {
      setLoader(true);
      router.push({
        pathname:
          selected && selected.cg && selected.cg == 'City'
            ? '/dashboard/Bookings/EventBooking/'
            : '/dashboard/Bookings/EventBooking/EventRates/',
        query: {
          name: selected.name,
          cg: selected.cg,
          conid: selected.conid,
          stid: selected.stid,
          cid: selected.cid,
          pkey: selected.pkey,
          ppti: selected.ppti,
          curr: 'SGD',
        },
      });
      setLoader(false);
    }
  };

  return (
    <AppBar position="static" ref={ref} elevation="0" color="inherit">
      <Row>
        <Column md={4} xs={0} sm={1} center padding={[10]}>
          <Text size={24} color={'#000'} bold>
            Event Booking
          </Text>
        </Column>
        <Column md sm xs>
          <Row variant="dense" className={classes.appBar} middle center>
            <Column md={10} xs={12} sm={8} padding={[5]}>
              <Card>
                <div className={classes.search} style={{ alignItems: 'center', position: 'relative' }}>
                  <div className={classes.searchIcon}>
                    <Search style={{ fontSize: 20 }} />
                  </div>
                  <InputBase
                    onChange={onKeying}
                    value={key}
                    placeholder="Enter City or Destination"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search', autoComplete: 'new-password' }}
                  />
                  {loader && <Loader className={classes.searchLoader} size={20} />}
                  {autoCompleteResult && autoCompleteResult.length ? (
                    <Card className={classes.autoCompleteContainer}>
                      {autoCompleteResult.map((val, index) => (
                        <Result onClick={submit} key={'autocomplete' + index} value={val} />
                      ))}
                    </Card>
                  ) : null}
                </div>
              </Card>
            </Column>
            <Column md={2} xs={12} sm={4} padding={[5]} right>
              <Row>
                <Column md={12} xs={12} sm={12}>
                  <Button variant="contained" color="primary" className={classes.submitButton} onClick={onFilter}>
                    <Text color="#ffffff" bold>
                      Search
                    </Text>
                  </Button>
                </Column>
              </Row>
            </Column>
          </Row>
        </Column>
      </Row>
    </AppBar>
  );
};

const Result = ({ value, onClick, ...props }) => {
  return (
    <Touchable onClick={() => onClick(value)}>
      <Row padding={[5, 0]} {...props}>
        <Column md={1} xs={1} sm={1} center middle padding={[5]}>
          {value.category == 'City' ? (
            <LocationCity style={{ fontWeight: 20 }} />
          ) : (
            <ConfirmationNumber style={{ fontWeight: 20 }} />
          )}
        </Column>
        <Column md={9} xs={9} sm={9} center padding={[5]}>
          <Text>{value.name}</Text>
        </Column>

        <Column md={2} xs={2} sm={2} center padding={[5]}>
          <Text>{value.category == 'City' ? 'City' : 'Events'}</Text>
        </Column>
        <Column>
          <Divider gutterBottom />
        </Column>
      </Row>
    </Touchable>
  );
};

export default EventSearchBar;
