import React, { useState, useEffect } from 'react';
import { Row, Column, Card, Image, Text, Loader } from '../../../../core';
import ErrorPage from '../../../Error';
import styles from './EventCheckout.module.css';
import { constants } from '../../../../helper/constants';

import { getBookPrepareEvent, createEventBooking } from '../../../../helper/RequestPayLoadBookings';
import { httpPostRequest, isEmail } from '../../../../helper/JsHelper';
import { useStore } from '../../../../helper/Store';
import { useRouter } from 'next/router';
import { Autocomplete } from '@material-ui/lab';
import {
  Button,
  Container,
  FormControlLabel,
  Checkbox,
  fade,
  Box,
  MenuItem,
  FormControl,
  Select,
  InputBase,
  TextField,
  Divider,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Link from 'next/Link';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import CurrencyFormat from 'react-currency-format';
const FA = require('react-fontawesome');

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  featuredImage: {
    width: '100%',
    objectFit: 'contain',
    objectPosition: 'top',
  },
  hotelImage: {
    width: '100%',
    height: 220,
    [theme.breakpoints.down('sm')]: {
      height: 230,
    },
  },
  platinum_events: { width: '100%', float: 'left' },
  platinumSpeical: {
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 20px #ccc',
    borderRadius: 10,
    padding: '20px 15px',
  },
  typesEvents: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#595959',
  },
  typesEventsnow: {
    fontWeight: '600',
    color: '#287cbc',
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
    },
  },
  PackagerInformer: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px',
    },
  },
  confirm_booking: { fontSize: '17px' },
  adualtInfromation: {
    width: '100%',
    height: '30px',
    float: 'left',
    padding: '5px 0px',
    backgroundColor: '#287cbc',
    borderRadius: '10px 10px 0px 0px',
  },
  adualtNowcollect: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 10px 20px  #ccc',
    padding: '20px',
    borderRadius: '10px',
    [theme.breakpoints.down('xs')]: {
      padding: '10px',
      height: '224px !important',
    },
  },
  Adualtnamer: {
    width: '100%',
    float: 'left',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 20px  #ccc',
    padding: '10px',
  },
  adualtInform: { position: 'relative' },
  adualtagaint: {
    fontSize: '20px',
    marginTop: '7px',
    fontWeight: '600',
    color: '#595959',
  },
  dualtAdualt: {
    position: 'absolute',
    top: '0px',
    right: '5px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      position: 'unset !important',
    },
  },
  dualtAdualtnow: { position: 'absolute', top: '0px', right: '5px' },
  adualtagaintcolor: {
    fontSize: '20px',
    marginTop: '7px',
    fontWeight: '600',
    color: '#287cbc',
  },
  Importadualt: {
    width: '100%',
    float: 'left',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 20px #ccc',
    padding: '10px',
  },
  boxes_infilater: {
    width: '100%',
    float: 'left',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 20px #ccc',
    padding: '10px 20px',
    marginTop: '10px',
  },
  roomInputHeader: {
    width: '100%',
    float: 'left',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 20px #ccc',
    padding: '10px 20px',
  },
  hcAction: {
    '&:hover': {
      backgroundColor: '#287cbc',
    },
    color: 'var(--clr-primary-white)',
    backgroundColor: '#287cbc',
    fontWeight: 'bold',
    width: '200px',
  },
  margin: {
    margin: theme.spacing(1),
    marginTop: 0,
    marginBottom: 0,
  },
  fieldMargin: {
    marginTop: 5,
    marginBottom: 5,
  },
  fieldMargin: {
    marginTop: 5,
    marginBottom: 5,
  },
  newsListRoot: {
    padding: 10,
    transition: 'all .2s',
    '&:not(:first-child)': {
      borderTop: `solid 1px ${theme.palette.primary.main}`,
    },
    '& .fav-btn': {
      opacity: 0,
      visibility: 'hidden',
    },
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
      transform: 'translateY(-4px)',
      boxShadow: `0 3px 10px 0 ${fade('#000', 0.2)}`,
      '& .fav-btn': {
        opacity: 1,
        visibility: 'visible',
      },
    },
    [theme.breakpoints.down('sm')]: {
      padding: 5,
    },
  },
  margin: {
    margin: theme.spacing(1),
    marginTop: 0,
    marginBottom: 0,
  },
  paymentImage: {
    width: 150,
    height: 40,
  },
  hcAction: {
    '&:hover': {
      backgroundColor: '#287cbc',
    },
    color: 'var(--clr-primary-white)',
    backgroundColor: '#287cbc',
    fontWeight: 'bold',
    width: '200px',
  },
  Importadualt: {
    width: '100%',
    float: 'left',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 20px #ccc',
    padding: '10px',
  },
  boxes_infilater: {
    width: '100%',
    float: 'left',
    backgroundColor: '#fff',
    boxShadow: '0px 20px 30px #ccc',
    padding: '10px 15px',
    borderRadius: '0 0 10px 10px',
    // marginTop: "10px",
  },
  roomInputHeader: {
    width: '100%',
    float: 'left',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 20px #ccc',
    marginTop: '10px',
    borderRadius: '10px 10px 0 0',
    padding: '10px 15px !important',
  },
}));

const Checkbookconfirm = () => {
  const classes = useStyles();
  const { countries, setAlertMsg, selectedLanguage } = useStore();
  const [reCheckData, setReCheckData] = useState({});
  const [loader, setLoader] = useState(true);
  const [adults, setAdults] = useState([]);
  const [childrens, setChildren] = useState([]);
  const [contactPerson, setContactPerson] = useState('');
  const [conPerCountry, setConPerCountry] = useState({
    name: 'Singapore',
    dialCode: '65',
    countryCode: 'sg',
    format: '+.. ....-....',
  });
  const [countryOfResident, setCountryOfResident] = useState('sg');
  const [contactNoCode, setContactNoCode] = useState('sg');
  const [contactNo, setContactNo] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [nationalty, setNationalty] = useState('sg');
  const [phoneNoCode, setPhoneNoCode] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [error, setError] = useState([]);
  const [paymentProvider, setPaymentProvider] = useState(1);
  const [is_guest, setIsGuest] = useState(true);
  const [bookingLoader, setBookingLoader] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [userAgree, setUserAgree] = useState(false);

  const { query } = useRouter();

  const getRate = async () => {
    if (query && query.hasOwnProperty('event_rate') && query['event_rate'] != null) {
      const req = getBookPrepareEvent(query);
      const res = await httpPostRequest(req);
      if (
        res &&
        res[constants.DATA_EXCEPTION] &&
        res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200 &&
        res[constants.DATA] != null
      ) {
        setReCheckData(res[constants.DATA]);
        setLoader(false);
      } else {
        setLoader(false);
      }
    }
  };
  useEffect(() => {
    getRate();
    if (query && query.rd) {
      // let adult_conf =
      //   query.rd.split("-").length > 1 ? query.rd.split("-")[1] : 1;
      let adult_conf = 1;
      adult_conf = Array.from(Array(parseInt(adult_conf ? adult_conf : 1)).keys()).map((val, index) => ({
        guestTitle: 'Mr',
        guestTitleErr: false,
        guestFirstName: '',
        guestFirstNameErr: false,
        guestLastName: '',
        ageGroup: 'Adult',
        guestLastNameErr: false,
        guestAge: '',
        guestAgeErr: false,
        is_mandatory: index == 0,
      }));
      setAdults(adult_conf);
      // let children_conf = query.rd.split("_");
      // children_conf = children_conf
      //   .map((val, index) =>
      //     index > 0
      //       ? {
      //           guestTitle: "",
      //           guestTitleErr: false,
      //           guestFirstName: "",
      //           guestFirstNameErr: false,
      //           guestLastName: "",
      //           guestLastNameErr: false,
      //           guestAge: val,
      //           ageGroup: "Children",
      //           guestAgeErr: false,
      //           is_mandatory: false,
      //         }
      //       : null,
      //   )
      //   .filter((f) => f != null);
      // setChildren(children_conf);
    }
  }, [query]);
  function updateAdultchildrens(value, index, tag) {
    if (tag == 'adult') {
      let adults_update = [...adults];
      adults_update[index][value.target.name] = value.target.value;
      adults_update[index][value.target.name + 'Err'] =
        adults_update[index].is_mandatory && value.target.value.length == 0 ? true : false;
      setAdults(adults_update);
    } else {
      let childrens_update = [...childrens];
      childrens_update[index][value.target.name] = value.target.value;
      setChildren(childrens_update);
    }
  }
  const stateUpdater = (value) => {
    let _error = [...error];
    if (value.target.value.length == 0) {
      if (!_error.includes(value.target.name)) {
        _error.push(value.target.name);
      }
    } else {
      if (_error.includes(value.target.name)) {
        _error[_error.findIndex((f) => f == value.target.name)] = '';
        _error = _error.filter((f) => f != '');
      }
    }
    if (value.target.name == 'contactPerson') {
      setContactPerson(value.target.value);
    } else if (value.target.name == 'countryOfResident') {
      setCountryOfResident(value.target.value);
    } else if (value.target.name == 'contactNoCode') {
      setContactNoCode(value.target.value);
    } else if (value.target.name == 'contactNo') {
      setContactNo(value.target.value);
    } else if (value.target.name == 'emailAddress') {
      if (!isEmail(value.target.value) && !_error.includes('emailAddress')) {
        _error.push('emailAddress');
      } else if (_error.includes('emailAddress')) {
        _error[_error.findIndex((f) => f == 'emailAddress')] = '';
      }
      setEmailAddress(value.target.value);
    } else if (value.target.name == 'nationalty') {
      setNationalty(value.target.value);
    } else if (value.target.name == 'phoneNoCode') {
      setPhoneNoCode(value.target.value);
    } else if (value.target.name == 'phoneNo') {
      setPhoneNo(value.target.value);
    }

    setError(_error);
  };

  const confirmBooking = async () => {
    let error_ = [];
    let adults_ = [];
    for (let a of adults) {
      let adult_loc = { ...a };
      if (adult_loc.is_mandatory) {
        if (adult_loc.guestTitle.trim() == '') {
          adult_loc.guestTitleErr = true;
          error_.push('guestTitleErr');
        }
        if (adult_loc.guestFirstName.trim() == '') {
          adult_loc.guestFirstNameErr = true;
          error_.push('guestFirstNameErr');
        }
        if (adult_loc.guestLastName.trim() == '') {
          adult_loc.guestLastNameErr = true;
          error_.push('guestLastNameErr');
        }
        if (adult_loc.guestAge.trim() == '' || adult_loc.guestAge < 0) {
          adult_loc.guestAgeErr = true;
          error_.push('guestAgeErr');
        }
      }
      adults_.push(adult_loc);
    }
    if (countryOfResident.trim() == '') {
      error_.push('countryOfResident');
    }
    if (contactNoCode.trim() == '') {
      error_.push('contactNoCode');
    }
    if (nationalty.trim() == '') {
      error_.push('nationalty');
    }
    if (contactPerson.trim() == '') {
      error_.push('contactPerson');
    }
    if (contactNo.trim() == '' && contactNo.slice(conPerCountry.dialCode.length) == '') {
      error_.push('contactNo');
    }

    if (!isEmail(emailAddress)) {
      error_.push('emailAddress');
    }

    // if (phoneNo.trim() == "") {
    //   error_.push("phoneNo")
    // }
    if (error_.length == 0) {
      let contactDetails = {
        'contact-Person-Name': contactPerson,
        'contact-Number1': contactNo,
        'contact-Number2': phoneNoCode + ' ' + phoneNo,
        'contact-Email': emailAddress,
        'contact-Nationality': nationalty,
        'contact-Country': countryOfResident,
      };
      let data = {
        'currency-code': reCheckData['currency'],
        'total-rate': reCheckData['total-rate'],
        'product-name': reCheckData['package-info']['product-name'],
        'package-name': reCheckData['package-info']['package-name'],
        'image-url': reCheckData['package-info']['images']['feature-image-url'],
      };
      let guestInfo = [];
      for (let a of adults) {
        if (a.guestFirstName.trim() != '') {
          guestInfo.push({
            'guest-Title': a.guestTitle,
            'age-Group': a.ageGroup,
            'guest-Age': a.guestAge.trim() == '' ? 0 : parseInt(a.guestAge),
            // contactPersonName: contactPerson,
            'guest-First-Name': a.guestFirstName,
            'guest-Last-Name': a.guestLastName,
            // guestContactNumber1: "+" + contactNo,
            // guestContactNumber2: phoneNoCode + " " + phoneNo,
            // guestEmail1: emailAddress,
            // guestEmail2: "",
            // guestNationality: nationalty,
            // guestCountry: countryOfResident,f
            'is-Booking-Person':
              contactPerson.toLowerCase().trim().indexOf(a.guestFirstName.trim().toLowerCase()) > -1 ? 1 : 0,
            'is-Guest':
              is_guest && contactPerson.toLowerCase().trim().indexOf(a.guestFirstName.trim().toLowerCase()) > -1 ? 1 : 1,
          });
        }
      }
      // for (let a of childrens) {
      //   guestInfo.push({
      //     guestTitle: a.guestTitle,
      //     ageGroup: a.ageGroup,
      //     guestAge: a.guestAge.trim() == "" ? 0 : parseInt(a.guestAge),
      //     contactPersonName: contactPerson,
      //     guestFirstName: a.guestFirstName,
      //     guestLastName: a.guestLastName,
      //     guestContactNumber1: "+" + contactNo,
      //     guestContactNumber2: phoneNoCode + " " + phoneNo,
      //     guestEmail1: emailAddress,
      //     guestEmail2: "",
      //     guestNationality: nationalty,
      //     guestCountry: countryOfResident,
      //     isBookingPerson: 0,
      //     isGuest: 1,
      //   });
      // }
      if (userAgree) {
        setBookingLoader(true);
        const req = createEventBooking(data, paymentProvider, guestInfo, contactDetails, query);
        const res = await httpPostRequest(req);

        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          window.location = res[constants.DATA]['payment-page-url'];
        } else {
          setBookingLoader(false);
          setAlertMsg({
            msg: 'Booking Failed Try Again Later!',
            type: 'warning',
          });
        }
      } else {
        setBookingLoader(false);
        setAlertMsg({
          msg: 'Please,Check to Agree with User Agreement and T&C',
          type: 'error',
        });
      }
    } else {
      setBookingLoader(false);
      setAlertMsg({
        msg: 'Please Fill all the require Fields with Correct Details.',
        type: 'error',
      });
      setError(error_);
      setAdults(adults_);
    }
  };
  const hasError = (key) => error.includes(key);
  useEffect(() => {
    setAdults([
      {
        guestTitle: 'Mr',
        guestTitleErr: false,
        guestFirstName: '',
        guestFirstNameErr: false,
        guestLastName: '',
        ageGroup: 'Adult',
        guestLastNameErr: false,
        guestAge: '',
        guestAgeErr: false,
        is_mandatory: false,
      },
    ]);
  }, []);

  return !loader ? (
    <div>
      {(reCheckData && reCheckData.hasOwnProperty('package-info')) || true ? (
        <Container>
          <Row>
            <Column md={8} margin={[10, 0]}>
              <Box className={classes.platinumSpeical}>
                <Row>
                  <Column md={6} padding={[10]}>
                    <Image
                      src={reCheckData['package-info']['images']['feature-image-url']}
                      className={classes.featuredImage}
                    />
                  </Column>
                  <Column md={6} padding={[10]}>
                    <Column>
                      <Text variant="h3" className={classes.typesEvents} left>
                        {reCheckData['package-info']['product-name']}
                      </Text>
                      <Text variant="p" light left style={{ fontSize: 11 }}>
                        {reCheckData['package-info']['product-address']['address']}
                      </Text>
                    </Column>
                    <Row>
                      <Column md={12} xs={12} margin={[15, 0]} center>
                        <Text variant="h3" className={classes.PackagerInformer}>
                          Package:{' '}
                          <span className={classes.typesEventsnow}>{reCheckData['package-info']['package-name']}</span>
                        </Text>
                        <Divider orientation="vertical" />
                        <Text variant="p" className={classes.typesEventsnow}>
                          {reCheckData['package-info']['cancelation-policy']['is-free-cancelation']
                            ? 'Free Cancelation'
                            : 'Non-Refundable'}
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Box>
              <section className={styles.importantNotes}>
                <h3>{'Important Notes'}</h3>
                <ul style={{ margin: '10px 0 0 15px' }}>
                  <li>Please provide your name in English, as stated in your passport</li>
                  <li>Do not use special characters, such as %#+!@$()^*=:/?|&lt;&gt;</li>
                  <li>
                    If reservations are made for multiple rooms at the same hotel for the same date(s), please make the
                    reservation under different names
                  </li>
                </ul>
              </section>
            </Column>
            <Column md={4} padding={[10, 0, 10, 10]}>
              <Box className={classes.adualtNowcollect}>
                <Row style={{ height: '80%' }}>
                  <Column style={{ height: '10%' }}>
                    <Text variant="h6" component="h3" className={classes.typesEvents}>
                      Selected Events
                    </Text>
                  </Column>
                  <Column margin={[0, 0, 10, 0]} style={{ alignSelf: 'center' }}>
                    {reCheckData['package-info']['pax-rate-info'] && reCheckData['package-info']['pax-rate-info'].length
                      ? reCheckData['package-info']['pax-rate-info'].map((pack, index) => (
                          <Box className={classes.adualtInform} key={index}>
                            <Row>
                              <Column md={8} sm={6} xs={12} center>
                                <Text variant="p" component="p">{`${pack['pax-title']} (${pack['max-pax']} Tickets)`}</Text>
                              </Column>

                              <Column md={4} sm={6} xs={12}>
                                <Box className={classes.dualtAdualt}>
                                  <Text variant="p" component="p">
                                    <span style={{ fontSize: '0.8rem' }}>{reCheckData['package-info']['currency']}</span>
                                    &nbsp;
                                    <CurrencyFormat
                                      value={pack['pax-rate']['net-rate']}
                                      displayType={'text'}
                                      thousandSeparator={true}
                                    />{' '}
                                  </Text>
                                </Box>
                              </Column>
                            </Row>
                          </Box>
                        ))
                      : ''}
                    {/* <Row>
                      <Text variant="p" light style={{ fontSize: 10 }}>
                        {
                          reCheckData["package-info"]["cancelation-policy"][
                            "title"
                          ]
                        }
                      </Text>
                    </Row> */}
                  </Column>
                </Row>
                <Divider />

                <Box className={classes.adualtInform}>
                  <Row middle margin={[10, 0, 0, 0]}>
                    <Column lg={7} md={7} sm={7} xs={12} center>
                      <Text variant="h3" className={classes.adualtagaint}>
                        Total
                      </Text>
                    </Column>
                    <Column md={5} sm={5} xs={12} center>
                      <Box className={classes.dualtAdualtnow}>
                        <Text variant="h3" className={classes.adualtagaintcolor}>
                          <span style={{ fontSize: '0.8rem' }}>{reCheckData['package-info']['currency']}</span>
                          &nbsp;
                          <CurrencyFormat
                            value={reCheckData['total-rate']}
                            displayType={'text'}
                            thousandSeparator={true}
                          />{' '}
                        </Text>
                      </Box>
                    </Column>
                  </Row>
                </Box>
              </Box>
            </Column>
          </Row>
          <Row>
            <Column>
              <Row className={styles.rcHeading}>
                <Column className={classes.roomInputHeader} padding={[10, 10]}>
                  <Row middle>
                    <Column md={2} sm={3} xs={12}>
                      <h3>{'Guest Details'}</h3>
                    </Column>
                  </Row>
                </Column>
                <Column>
                  <Box className={classes.boxes_infilater}>
                    {adults.map((value, index) => (
                      <GuestContainer
                        onChange={(value) => updateAdultchildrens(value, index, 'adult')}
                        key={'adult_' + index}
                        value={value}
                        tag={'Adult'}
                        index={index}
                        classes={classes}
                        label={'Adult'}
                      />
                    ))}
                    {/* {childrens.map((value, index) => (
                      <GuestContainer
                        onChange={(value) =>
                          updateAdultchildrens(value, index, "child")
                        }
                        key={"Children _" + index}
                        value={value}
                        tag={"Children"}
                        index={index}
                        classes={classes}
                        label={translatedValues.children}
                        translatedValues={translatedValues}
                      />
                    ))} */}
                  </Box>
                </Column>
              </Row>
              <Row>
                <Column className={classes.roomInputHeader} padding={[10, 10]}>
                  <Row middle>
                    <Column md={2} sm={3} xs={12}>
                      <h3>{'Contact Details'}</h3>
                    </Column>
                    <Column md sm xs>
                      <FormControl className={classes.margin}>
                        <Row middle>
                          <Text component="h6" variant="h6" light style={{ marginRight: 10 }}>
                            {'Is contact person is guest ?'}
                          </Text>

                          <FormControlLabel
                            label={'Yes'}
                            control={
                              <Checkbox
                                checked={is_guest}
                                onChange={() => setIsGuest(!is_guest)}
                                name="Yes"
                                color="primary"
                              />
                            }
                          />
                          <FormControlLabel
                            label={'No'}
                            control={
                              <Checkbox
                                checked={!is_guest}
                                onChange={() => setIsGuest(!is_guest)}
                                name="Yes"
                                color="primary"
                              />
                            }
                          />
                        </Row>
                      </FormControl>
                    </Column>
                  </Row>
                </Column>
                <Column>
                  <Box className={classes.boxes_infilater}>
                    <Row spacing={1} middle>
                      <Column lg={3} md={3} sm={6}>
                        <FormControl className={classes.margin}>
                          <Text component="h6" variant="h6">
                            {'Contact Person'}
                          </Text>
                          <TextField
                            className={classes.fieldMargin}
                            size={'small'}
                            error={hasError('contactPerson')}
                            id="outlined-helperText"
                            value={contactPerson}
                            name="contactPerson"
                            onChange={stateUpdater}
                            placeholder={'eg: John Doe'}
                            defaultValue=""
                            variant="outlined"
                            InputLabelProps={{
                              style: {
                                color: 'black',
                              },
                            }}
                          />
                        </FormControl>
                      </Column>
                      <Column lg={3} md={3} sm={6}>
                        <FormControl className={classes.margin}>
                          <Text component="h6" variant="h6">
                            {'Country of Residency'}
                          </Text>
                          <Autocomplete
                            size="small"
                            className={classes.fieldMargin}
                            id="country-of-res"
                            options={countries}
                            defaultValue={countries.find(
                              (val) => val.country_Code.toLowerCase() == countryOfResident.toLowerCase(),
                            )}
                            onChange={(e, newVal) =>
                              stateUpdater({
                                target: {
                                  value: newVal ? newVal.country_Code : '',
                                  name: 'countryOfResident',
                                },
                              })
                            }
                            autoHighlight
                            getOptionLabel={(option) => option.country_Name}
                            renderOption={(option) => (
                              <React.Fragment>
                                ({option.country_Code}) {option.country_Name}
                              </React.Fragment>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Country of Resident"
                                value={countryOfResident}
                                error={hasError('countryOfResident')}
                                name="countryOfResident"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                              />
                            )}
                          />
                        </FormControl>
                      </Column>
                      <Column lg={5} md={5} xs={12}>
                        <FormControl className={classes.margin}>
                          <Text component="h6" variant="h6" style={{ marginTop: -5, marginBottom: 5 }}>
                            {'Contact Number'}
                          </Text>
                          <PhoneInput
                            country={contactNoCode}
                            value={contactNo}
                            onChange={(phone, country) => {
                              setContactNo(phone);
                              setContactNoCode(country.countryCode);
                              setConPerCountry(country);
                            }}
                            enableSearch={true}
                            inputProps={{
                              name: 'contactNo',
                            }}
                            containerStyle={{
                              minHeight: 40,
                            }}
                            inputStyle={{
                              minHeight: 40,
                              border: hasError('contactNo') ? '1.5px solid red' : '1px solid #CACACA',
                            }}
                            error={true}
                          />
                        </FormControl>
                      </Column>
                    </Row>
                    <Row padding={[10, 0]} spacing={1} className={styles.rcMobMargin} style={{ alignItems: 'flex-end' }}>
                      <Column lg={3} md={3} sm={6}>
                        <FormControl className={classes.margin}>
                          <Text component="h6" variant="h6">
                            {'Email Address'}
                          </Text>
                          <TextField
                            className={classes.fieldMargin}
                            size={'small'}
                            error={hasError('emailAddress')}
                            id="outlined-helperText"
                            value={emailAddress}
                            name="emailAddress"
                            onChange={stateUpdater}
                            placeholder={'eg : user@tripwerkz.com'}
                            defaultValue=""
                            variant="outlined"
                            InputLabelProps={{
                              style: {
                                color: 'black',
                              },
                            }}
                          />
                        </FormControl>
                      </Column>
                      <Column lg={3} md={3} sm={6}>
                        <FormControl className={classes.margin}>
                          <Text component="h6" variant="h6">
                            {'Nationality'}
                          </Text>
                          <Autocomplete
                            className={classes.fieldMargin}
                            size="small"
                            id="nationality-country"
                            options={countries}
                            autoHighlight
                            defaultValue={countries.find(
                              (val) => val.country_Code.toLowerCase() == nationalty.toLowerCase(),
                            )}
                            onChange={(e, newVal) =>
                              stateUpdater({
                                target: {
                                  value: newVal ? newVal.country_Code : '',
                                  name: 'nationalty',
                                },
                              })
                            }
                            getOptionLabel={(option) => option.country_Name}
                            renderOption={(option) => (
                              <React.Fragment>
                                ({option.country_Code}) {option.country_Name}
                              </React.Fragment>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Nationalty"
                                error={hasError('nationalty')}
                                name="nationalty"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                              />
                            )}
                          />
                          {/* <Select
                            className={classes.fieldMargin}
                            labelId="demo-customized-select-label"
                            id="demo-customized-select"
                            value={nationalty}
                            error={hasError("nationalty")}
                            name="nationalty"
                            onChange={stateUpdater}
                            input={<BootstrapInput />}
                          >
                            {countries.map((value, index) => (
                              <MenuItem
                                key={"countries_" + index}
                                value={value.country_Code}
                              >
                                {value.country_Name}
                              </MenuItem>
                            ))}
                          </Select> */}
                        </FormControl>
                      </Column>
                    </Row>
                  </Box>
                </Column>
              </Row>
              <Row>
                <Column className={classes.roomInputHeader} padding={[10, 10]}>
                  <h3>{'How Would you like to pay?'}</h3>
                </Column>
                <Box className={classes.boxes_infilater}>
                  <Column>
                    <Row>
                      <Column lg={8} md={8}>
                        <p className={styles.rcAlignCenter}>{'We Accept the following payment Methods:'}</p>
                        <Row style={{ maxWidth: '15%', justifyContent: 'space-between' }}>
                          <div>
                            <FA name="cc-stripe" aria-hidden="true" style={{ fontSize: 30, color: '#287cbc' }} />
                          </div>
                          <div>
                            <FA name="cc-visa" aria-hidden="true" style={{ fontSize: 30, color: '#287cbc' }} />
                          </div>
                          <div>
                            <FA name="alipay" aria-hidden="true" style={{ fontSize: 30, color: '#287cbc' }} />
                          </div>
                        </Row>
                      </Column>
                      <Column lg md className={styles.rcAlignCenter}>
                        <div>
                          <i className="fa fa-check" aria-hidden="true"></i>
                          &nbsp; {'We Proctect your personal information'}
                        </div>
                      </Column>
                    </Row>
                    <Row margin={[20, 0]} spacing={2} className={styles.rcMobMargin}>
                      {reCheckData &&
                      reCheckData.hasOwnProperty('payment-provider-list') &&
                      reCheckData['payment-provider-list'] != null ? (
                        <Column md={3}>
                          <FormControl className={classes.margin}>
                            <Text variant="p" component="h3" style={{ marginBottom: 5 }}>
                              {'Card Type'}
                            </Text>
                            <Select
                              labelId="card-type-label-id"
                              id="card-type-id"
                              value={paymentProvider}
                              name="paymentProvider"
                              onChange={(e) => setPaymentProvider(e.target.value)}
                              input={<BootstrapInput />}>
                              {reCheckData &&
                                reCheckData['payment-provider-list'].map((value, index) => (
                                  <MenuItem dense key={'payment_type' + index} value={value['payment-provider-id']}>
                                    {value['payment-provider-name']}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Column>
                      ) : null}
                    </Row>
                  </Column>
                </Box>
              </Row>
              <Row margin={[20, 0]}>
                <Column middle>
                  <Row center>
                    <FormControlLabel
                      control={
                        <Checkbox checked={userAgree} onChange={() => setUserAgree(!userAgree)} name="Yes" color="primary" />
                      }
                      label={
                        <Text variant="h6" component="h6" size={'0.7rem'} color="#000">
                          {'By Selecting to complete this booking I acknowledge that I have read and accept the following'}{' '}
                          <Link href={'/user-agreement'} passHref target="_blank">
                            <a
                              target="_blank"
                              style={{
                                fontWeight: 'bold',
                                textDecoration: 'underline',
                              }}>
                              <br />
                              {'Disclaimer, Terms & Conditions & User Agreement'}
                            </a>
                          </Link>{' '}
                          {/* pertaining to my booking(s) and use of this site */}
                        </Text>
                      }
                    />
                  </Row>
                  <Button
                    variant="contained"
                    style={{ width: 260, margin: '10px auto' }}
                    color="primary"
                    size="large"
                    className={classes.hcAction}
                    onClick={!bookingLoader ? confirmBooking : () => console.log('Your request is processing.')}>
                    <Row padding={[5, 0]}>
                      {bookingLoader ? (
                        <Column md={1} xs={1} sm={1} center middle>
                          <Loader size={25} color="white" />
                        </Column>
                      ) : null}
                      <Column
                        padding={[0, 5]}
                        md={bookingLoader ? 11 : 12}
                        xs={bookingLoader ? 11 : 12}
                        sm={bookingLoader ? 11 : 12}
                        center
                        middle>
                        <Text color="#fff" variant={'p'} component={'p'}>
                          <span style={{ fontWeight: 'bold' }}>{'Confirm Booking'}</span>
                        </Text>
                      </Column>{' '}
                    </Row>
                  </Button>
                </Column>
              </Row>
            </Column>
          </Row>
        </Container>
      ) : (
        <Row margin={[10, 0]}>
          <ErrorPage subHead="Error Finding Event Data" />
        </Row>
      )}
    </div>
  ) : (
    <SkeletonContainer />
  );
};

const GuestContainer = ({ onChange, value, tag, index, classes, label, ...props }) => {
  return (
    <Row>
      <Column>
        {/* <Row>
            <Column padding={[0, 10]}>
              <Text component="h6" variant="h6">
                {label + " " + (index + 1)}
              </Text>
            </Column>
          </Row> */}
        <Row padding={[0, 10]}>
          {value.guestTitle != '' ? (
            <Column md={1}>
              <FormControl className={classes.margin}>
                <Select
                  className={classes.fieldMargin}
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={value.guestTitle}
                  name={'guestTitle'}
                  onChange={onChange}
                  input={<BootstrapInput />}>
                  <MenuItem value={'Mr'}>Mr</MenuItem>
                  <MenuItem value={'Mrs'}>Mrs</MenuItem>
                  <MenuItem value={'Ms'}>Ms</MenuItem>
                </Select>
              </FormControl>
            </Column>
          ) : null}
          <Column md={3}>
            <FormControl className={classes.margin}>
              <TextField
                className={classes.fieldMargin}
                size={'small'}
                error={value.guestFirstNameErr && value.is_mandatory}
                id="outlined-helperText"
                label={'First Name' + (value.is_mandatory ? '*' : '')}
                value={value.guestFirstName}
                onChange={onChange}
                name="guestFirstName"
                variant="outlined"
                InputLabelProps={{
                  style: {
                    color: 'black',
                  },
                }}
              />
            </FormControl>
          </Column>

          <Column md={3}>
            <FormControl className={classes.margin}>
              <TextField
                className={classes.fieldMargin}
                size={'small'}
                error={value.guestLastNameErr && value.is_mandatory}
                value={value.guestLastName}
                name="guestLastName"
                onChange={onChange}
                id="outlined-helperText"
                label={'Last Name' + (value.is_mandatory ? '*' : '')}
                defaultValue=""
                variant="outlined"
                InputLabelProps={{
                  style: {
                    color: 'black',
                  },
                }}
              />
            </FormControl>
          </Column>

          <Column md={2}>
            <FormControl className={classes.margin}>
              <TextField
                className={classes.fieldMargin}
                size={'small'}
                error={value.guestAgeErr && value.is_mandatory}
                id="outlined-helperText"
                value={value.guestAge}
                name="guestAge"
                type="number"
                inputProps={{ min: 0 }}
                onChange={onChange}
                label={'Age' + (value.is_mandatory ? '*' : '')}
                defaultValue=""
                variant="outlined"
                disabled={tag === 'Children' ? true : false}
                InputLabelProps={{
                  style: {
                    color: 'black',
                  },
                }}
              />
            </FormControl>
          </Column>
        </Row>
      </Column>
    </Row>
  );
};
const SkeletonContainer = () => {
  return (
    <Row>
      <Column padding={[10]}>
        <Row>
          <Column padding={[5]}>
            <Skeleton variant="rect" width={'60%'} height={20} />
          </Column>

          <Column padding={[5]} md={4}>
            <Skeleton variant="rect" width={'100%'} height={200} />
          </Column>
          <Column padding={[5]} md={8}>
            <Row>
              <Column md={8}>
                <Row>
                  <Column md={6}>
                    <Row>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'60%'} height={10} />
                      </Column>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'40%'} height={10} />
                      </Column>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'40%'} height={8} />
                      </Column>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'55%'} height={8} />
                      </Column>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'70%'} height={10} />
                      </Column>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'60%'} height={10} />
                      </Column>
                      <Column padding={[10]} md={6} xs={6} sm={6} center middle>
                        <Skeleton variant="rect" width={'70%'} height={30} />
                      </Column>
                      <Column padding={[10]} md={6} xs={6} sm={6} center middle>
                        <Skeleton variant="rect" width={'70%'} height={30} />
                      </Column>
                      <Column padding={[10]} center middle>
                        <Skeleton variant="rect" width={'70%'} height={20} />
                      </Column>
                    </Row>
                  </Column>
                  <Column md={6}>
                    <Row>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'60%'} height={10} />
                      </Column>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'40%'} height={10} />
                      </Column>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'40%'} height={8} />
                      </Column>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'55%'} height={8} />
                      </Column>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'70%'} height={10} />
                      </Column>
                      <Column padding={[4, 0]}>
                        <Skeleton variant="rect" width={'60%'} height={10} />
                      </Column>
                      <Column padding={[10]} md={6} xs={6} sm={6} center middle>
                        <Skeleton variant="rect" width={'70%'} height={30} />
                      </Column>
                      <Column padding={[10]} md={6} xs={6} sm={6} center middle>
                        <Skeleton variant="rect" width={'70%'} height={30} />
                      </Column>
                      <Column padding={[10]} center middle>
                        <Skeleton variant="rect" width={'70%'} height={20} />
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Column>

              <Column md={4}>
                <Row>
                  <Column padding={[10]}>
                    <Skeleton variant="rect" width={'70%'} height={15} />
                  </Column>
                  <Column padding={[10]}>
                    <Skeleton variant="rect" width={'45%'} height={10} />
                  </Column>
                  <Column padding={[10]} center middle>
                    <Skeleton variant="rect" width={'45%'} height={25} />
                  </Column>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
        {[1, 2, 3].map((value, key) => (
          <Row padding={[10]} key={'it_is_loader_' + key}>
            <Column padding={[5]}>
              <Skeleton variant="rect" width={'45%'} height={13} />
            </Column>
            <Column column md={3}>
              <Row>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'45%'} height={13} />
                </Column>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'60%'} height={25} />
                </Column>
              </Row>
            </Column>
            <Column column md={3}>
              <Row>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'45%'} height={13} />
                </Column>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'60%'} height={25} />
                </Column>
              </Row>
            </Column>
            <Column column md={3}>
              <Row>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'45%'} height={13} />
                </Column>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'60%'} height={25} />
                </Column>
              </Row>
            </Column>
            <Column column md={3}>
              <Row>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'45%'} height={13} />
                </Column>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'60%'} height={25} />
                </Column>
              </Row>
            </Column>
            <Column column md={3}>
              <Row>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'45%'} height={13} />
                </Column>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'60%'} height={25} />
                </Column>
              </Row>
            </Column>
            <Column column md={3}>
              <Row>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'45%'} height={13} />
                </Column>
                <Column padding={[5]}>
                  <Skeleton variant="rect" width={'60%'} height={25} />
                </Column>
              </Row>
            </Column>
          </Row>
        ))}
      </Column>
    </Row>
  );
};
export default Checkbookconfirm;
