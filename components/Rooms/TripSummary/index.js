import React, { useState, useEffect } from 'react';
import 'react-phone-input-2/lib/high-res.css';
import {
  Button,
  FormControlLabel,
  Checkbox,
  fade,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  InputBase,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { TextField, Row, Column, Text, Card, Touchable, Image, Loader, DemandDropDown } from '../../../core';
import { useRouter } from 'next/router';
import { constants } from '../../../helper/constants';
import { httpPostRequest, isEmail } from '../../../helper/JsHelper';
import { getReCheckRate, createBooking } from '../../../helper/RequestPayLoadBookings';
import { Payment, DoneAll } from '@material-ui/icons';
import { useStore } from '../../../helper/Store';
import Skeleton from '@material-ui/lab/Skeleton';
import PhoneInput from 'react-phone-input-2';
var FA = require('react-fontawesome');
import Error from '../../Error';

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  hotelImage: {
    width: '100%',
    height: 230,
    borderRadius: 4,
    [theme.breakpoints.down('sm')]: {
      height: 180,
    },
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
  newsListRoot: {
    padding: 10,
    transition: 'all .2s',
    '&:not(:first-child)': {
      borderTop: `solid 1px ${theme.palette.borderColor.main}`,
    },
    '& .fav-btn': {
      opacity: 0,
      visibility: 'hidden',
    },
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
      transform: 'translateY(-4px)',
      boxShadow: `0 3px 10px 0 ${fade(theme.palette.common.dark, 0.2)}`,
      '& .fav-btn': {
        opacity: 1,
        visibility: 'visible',
      },
    },
    [theme.breakpoints.down('sm')]: {
      padding: 5,
    },
  },
  paymentImage: {
    width: 150,
    height: 40,
  },
  bold: {
    fontWeight: 1000,
  },
  box: {
    padding: 10,
    paddingRight: 20,
    paddingLeft: 20,
    [theme.breakpoints.down('sm')]: {
      padding: 5,
    },
  },
}));

export default function SearchHotels() {
  const classes = useStyles();
  const [reCheckData, setReCheckData] = useState();
  const [loader, setLoader] = useState(true);
  const { countries, dial_codes, setAlertMsg } = useStore();
  const [adults, setAdults] = useState([]);
  const [childrens, setChildren] = useState([]);
  const [contactPerson, setContactPerson] = useState('');
  const [countryOfResident, setCountryOfResident] = useState('SG');
  const [contactNoCode, setContactNoCode] = useState('+65');
  const [contactNo, setContactNo] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [nationalty, setNationalty] = useState('SG');
  const [phoneNoCode, setPhoneNoCode] = useState('+65');
  const [phoneNo, setPhoneNo] = useState('');
  const [error, setError] = useState([]);
  const [paymentProvider, setPaymentProvider] = useState(1);
  const [is_guest, setIsGuest] = useState(true);
  const [bookingLoader, setBookingLoader] = useState(false);
  const [terms_conditions, setTermsAndCond] = useState(false);
  const { query } = useRouter();

  const getRate = async () => {
    if (query && query.hasOwnProperty(constants.RATE_KEY) && query[constants.RATE_KEY] != null) {
      const req = getReCheckRate(query);
      const res = await httpPostRequest(req);
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setReCheckData(res[constants.DATA]);
        setLoader(false);
      } else {
        setReCheckData(res[constants.DATA]);
        setLoader(502);
        setAlertMsg({
          type: 'error',
          msg:
            res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_MSG]
              ? res[constants.DATA_EXCEPTION][constants.ERR_MSG]
              : 'Please try again later.',
        });
      }
    }
  };

  useEffect(() => {
    getRate();
    if (query && query.rd) {
      let adult_conf = query.rd.split('-').length > 1 ? query.rd.split('-')[1] : 1;
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
      let children_conf = query.rd.split('_');
      children_conf = children_conf
        .map((val, index) =>
          index > 0
            ? {
                guestTitle: '',
                guestTitleErr: false,
                guestFirstName: '',
                guestFirstNameErr: false,
                guestLastName: '',
                guestLastNameErr: false,
                guestAge: val,
                ageGroup: 'Children',
                guestAgeErr: false,
                is_mandatory: false,
              }
            : null,
        )
        .filter((f) => f != null);
      setChildren(children_conf);
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
    console.log(reCheckData);
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
        if (adult_loc.guestAge.trim() == '') {
          adult_loc.guestAgeErr = true;
          error_.push('guestAgeErr');
        }
      }
      adults_.push(adult_loc);
    }
    if (contactPerson.trim() == '') {
      error_.push('contactPerson');
    }
    if (contactNo.trim() == '') {
      error_.push('contactNo');
    }
    if (!isEmail(emailAddress)) {
      error_.push('emailAddress');
    }
    // if (phoneNo.trim() == "") {
    //   error_.push("phoneNo");
    // }
    if (error_.length == 0) {
      let guestInfo = [];
      for (let a of adults) {
        if (a.guestFirstName.trim() != '') {
          guestInfo.push({
            guestTitle: a.guestTitle,
            ageGroup: a.ageGroup,
            guestAge: a.guestAge.trim() == '' ? 0 : parseInt(a.guestAge),
            contactPersonName: contactPerson,
            guestFirstName: a.guestFirstName,
            guestLastName: a.guestLastName,
            guestContactNumber1: contactNoCode + ' ' + contactNo,
            guestContactNumber2: phoneNoCode + ' ' + phoneNo,
            guestEmail1: emailAddress,
            guestEmail2: '',
            guestNationality: nationalty,
            guestCountry: countryOfResident,
            isBookingPerson: contactPerson.toLowerCase().trim().indexOf(a.guestFirstName.trim().toLowerCase()) > -1 ? 1 : 0,
            isGuest:
              is_guest && contactPerson.toLowerCase().trim().indexOf(a.guestFirstName.trim().toLowerCase()) > -1 ? 1 : 1,
          });
        }
      }
      for (let a of childrens) {
        guestInfo.push({
          guestTitle: a.guestTitle,
          ageGroup: a.ageGroup,
          guestAge: a.guestAge.trim() == '' ? 0 : parseInt(a.guestAge),
          contactPersonName: contactPerson,
          guestFirstName: a.guestFirstName,
          guestLastName: a.guestLastName,
          guestContactNumber1: contactNoCode + ' ' + contactNo,
          guestContactNumber2: phoneNoCode + ' ' + phoneNo,
          guestEmail1: emailAddress,
          guestEmail2: '',
          guestNationality: nationalty,
          guestCountry: countryOfResident,
          isBookingPerson: 0,
          isGuest: 1,
        });
      }
      if (terms_conditions) {
        setBookingLoader(true);
        const req = createBooking(guestInfo, reCheckData, paymentProvider, query);
        const res = await httpPostRequest(req);
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          window.location = res[constants.DATA]['payment-page-url'];
          // let sessionId = res.data.stripeSessionId;
          // let stripKey =
          //   'pk_test_51HuDzuKt18HqSbGerCqjY4en5xVkUNEPtMDTZZ9zBLwv0vlGGF7m2NQj7wyR8vw4GcxamXDrQ0v9JJ1o9Aup8GOY00DD9cbuKL';
          // // console.log(sessionId)
          // var stripe = Stripe(stripKey);
          // stripe.redirectToCheckout({ sessionId: sessionId });
          // setBookingLoader(false);
          // setAlertMsg({msg:"Hotel booked Successfully.",type:"success"})
        } else {
          setBookingLoader(false);
          setAlertMsg({ msg: res[constants.DATA_EXCEPTION].err_msg, type: 'error' });
        }
      } else {
        setAlertMsg({ msg: 'Please accept the terms and conditions.', type: 'error' });
      }
    } else {
      setBookingLoader(false);
      setAlertMsg({ msg: 'Please Fill all the require Fields.', type: 'error' });
      setError(error_);
      setAdults(adults_);
    }
  };
  const hasError = (key) => error.includes(key);

  return !loader && loader != 502 ? (
    <div>
      <Card padding={[0, 0, 20, 0]}>
        <Row>
          <Column>
            <SummaryContainer query={query} data={reCheckData?.hotel} classes={classes} />
          </Column>
          <Column>
            <Row>
              <Column padding={[10]} color="#505ccb">
                <Text variant={'h3'} semibold component="h6" color="white">
                  GUEST DETAILS
                </Text>
              </Column>
              <Column padding={[10]}>
                <GuestParentContainer
                  adults={adults}
                  childrens={childrens}
                  updateAdultchildrens={updateAdultchildrens}
                  classes={classes}
                />
              </Column>
            </Row>
          </Column>

          <Column>
            <Row>
              <Column padding={[10]} color="#505ccb">
                <Text variant={'h3'} semibold component="h6" color="white">
                  CONTACT DETAILS
                </Text>
              </Column>

              <Column padding={[10]}>
                <GuestDetails
                  countries={countries}
                  dial_codes={dial_codes}
                  hasError={hasError}
                  stateUpdater={stateUpdater}
                  is_guest={is_guest}
                  phoneNo={phoneNo}
                  phoneNoCode={phoneNoCode}
                  nationalty={nationalty}
                  emailAddress={emailAddress}
                  contactNo={contactNo}
                  contactNoCode={contactNoCode}
                  countryOfResident={countryOfResident}
                  contactPerson={contactPerson}
                  classes={classes}
                  setContactNo={setContactNo}
                  setContactNoCode={setContactNoCode}
                />
              </Column>
            </Row>
          </Column>

          <Column>
            <Row>
              <Column padding={[10]} color="#505ccb">
                <Text variant={'h3'} semibold component="h6" color="white">
                  HOW WOULD YOU LIKE TO PAY?
                </Text>
              </Column>
              <Column padding={[15, 10]}>
                <PaymentComponent
                  paymentProvider={paymentProvider}
                  reCheckData={reCheckData}
                  setPaymentProvider={setPaymentProvider}
                  classes={classes}
                />
              </Column>
            </Row>
          </Column>

          <Column>
            <Row>
              <Column padding={[15, 10]} middle>
                <FormControl className={classes.margin}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={terms_conditions}
                        onChange={() => setTermsAndCond(!terms_conditions)}
                        name="Yes"
                        color="primary"
                      />
                    }
                    label="By Selecting to complete this booking I acknowledge that I have read and accept the following"
                  />
                </FormControl>
                <Touchable>
                  <Text bold>Disclaimer, Terms & Conditions & User Agreement </Text>
                </Touchable>
              </Column>

              <Column padding={[10]}>
                <Row>
                  <Column md={4}>
                    <Row>
                      {/* <Column md={12} xs={6} sm={6}>
                                                <Touchable><Text>Privacy Policy</Text></Touchable> 
                                            </Column>
                                            <Column md={12} xs={6} sm={6}>
                                                <Touchable><Text>User Agreement</Text></Touchable>
                                            </Column> */}
                    </Row>
                  </Column>

                  <Column md={4} center middle>
                    <Button
                      variant="contained"
                      style={{ width: '100%' }}
                      color="primary"
                      size="large"
                      onClick={!bookingLoader ? confirmBooking : () => console.log('Your request is processing.')}>
                      <Row padding={[5, 0]}>
                        {bookingLoader ? (
                          <Column md={1} xs={1} sm={1} center middle>
                            <Loader size={16} color="white" />
                          </Column>
                        ) : null}
                        <Column
                          padding={[0, 5]}
                          md={bookingLoader ? 11 : 12}
                          xs={bookingLoader ? 11 : 12}
                          sm={bookingLoader ? 11 : 12}
                          center
                          middle>
                          <Text color="white" variant={'h3'} component={'h3'} bold>
                            {' Confirm Booking'}
                          </Text>
                        </Column>{' '}
                      </Row>
                    </Button>
                  </Column>

                  <Column md={4}></Column>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      </Card>
    </div>
  ) : loader == 502 ? (
    <Error />
  ) : (
    <SkeletonContainer />
  );
}

const GuestParentContainer = ({ adults, childrens, updateAdultchildrens, classes, ...props }) => {
  return (
    <Row>
      <Column>
        {adults.map((value, index) => (
          <GuestContainer
            onChange={(value) => updateAdultchildrens(value, index, 'adult')}
            key={'adult_' + index}
            value={value}
            tag={'Adult'}
            index={index}
            classes={classes}
          />
        ))}
        {childrens.map((value, index) => (
          <GuestContainer
            onChange={(value) => updateAdultchildrens(value, index, 'child')}
            key={'Children _' + index}
            value={value}
            tag={'Children'}
            index={index}
            classes={classes}
          />
        ))}
      </Column>
    </Row>
  );
};

const GuestDetails = ({
  countries,
  dial_codes,
  hasError,
  stateUpdater,
  is_guest,
  phoneNo,
  phoneNoCode,
  nationalty,
  emailAddress,
  contactNo,
  contactNoCode,
  countryOfResident,
  contactPerson,
  classes,
  setContactNo,
  setContactNoCode,
  ...props
}) => {
  const { ContactNumber } = DemandDropDown;
  return (
    <Row>
      <Column padding={[0, 10]}>
        <Row padding={[20, 0]} spacing={1} middle>
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
                className={classes.fieldMargin}
                id="country-of-res"
                options={countries}
                defaultValue={countries.find((val) => val.country_Code.toLowerCase() == countryOfResident.toLowerCase())}
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
                    size={'small'}
                    margin={'dense'}
                    placeholder="Country of Resident"
                    value={countryOfResident}
                    error={hasError('countryOfResident')}
                    name="countryOfResident"
                    style={{ maxHeight: 45 }}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                      style: { marginTop: -5 },
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
        <Row spacing={1} middle>
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
                id="nationality-country"
                options={countries}
                autoHighlight
                defaultValue={countries.find((val) => val.country_Code.toLowerCase() == nationalty.toLowerCase())}
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
                    size={'small'}
                    margin={'dense'}
                    variant="outlined"
                    placeholder="Nationalty"
                    error={hasError('nationalty')}
                    name="nationalty"
                    style={{ maxHeight: 45 }}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                      style: { marginTop: -5 },
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
          <Column lg={12} md={12} xs={12} padding={[5, 0]}>
            <FormControl className={classes.margin}>
              <Text component="h6" variant="h6" bold>
                Is contact person is guest ?
              </Text>
              <Row>
                <FormControlLabel
                  control={
                    <Checkbox checked={!is_guest} onChange={() => setIsGuest(!is_guest)} name="Yes" color="primary" />
                  }
                  label="No"
                />
                <FormControlLabel
                  control={<Checkbox checked={is_guest} onChange={() => setIsGuest(!is_guest)} name="Yes" color="primary" />}
                  label="Yes"
                />
              </Row>
            </FormControl>
          </Column>
        </Row>
      </Column>
    </Row>
  );
};

const PaymentComponent = ({ setPaymentProvider, reCheckData, paymentProvider, classes, ...props }) => {
  return (
    <Row {...props}>
      <Column md={6} xs={6} sm={6} padding={[10, 0]}>
        <Text size={16} bold>
          We accept the following payment methods:
        </Text>
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
      <Column md={6} xs={6} sm={6} padding={[10, 0]} right>
        <Row>
          <Column>
            <Row>
              <Column md={4}></Column>

              <Column md={8}>
                <Row>
                  <Column md={1} xs={1} sm={1}>
                    <DoneAll style={{ color: 'blue' }} />
                  </Column>
                  <Column md={11} xs={11} sm={11}>
                    <Text size={16}>We use secure transmission.</Text>
                  </Column>
                </Row>
                <Row>
                  <Column md={1} xs={1} sm={1}>
                    <DoneAll style={{ color: 'blue' }} />
                  </Column>
                  <Column md={11} xs={11} sm={11}>
                    <Text size={16}>We protect your permission inform.</Text>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      </Column>
      <Column paddding={[10, 0]}>
        <Row>
          {reCheckData && reCheckData.hasOwnProperty(constants.PAYMENT_PROVIDERS) ? (
            <Column md={3}>
              <FormControl className={classes.margin}>
                <Text size={16} bold>
                  Card Type:*
                </Text>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={paymentProvider}
                  name="paymentProvider"
                  onChange={(e) => setPaymentProvider(e.target.value)}
                  input={<BootstrapInput />}>
                  {reCheckData[constants.PAYMENT_PROVIDERS].map((value, index) => (
                    <MenuItem key={'payment_type' + index} value={value.payVendorId}>
                      {value.payVendorName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Column>
          ) : null}

          {/* <Column md={3}>
                        <Row>
                            <Column>
                                <Text size={16} bold>Card Number:*</Text>
                            </Column>

                            <Column padding={[4]}>
                                <TextField
                                    size={"small"}
                                    error={false}
                                    id="outlined-helperText"
                                    label="Valid Card Number"
                                    defaultValue=""
                                    helperText={false ? "Some important text" : ""}
                                    variant="outlined"
                                />
                            </Column>
                        </Row>

                    </Column>
                    <Column md={2} xs={6} sm={6}>
                        <Row>
                            <Column>
                                <Text size={16} bold>Expiration  Date:*</Text>
                            </Column>

                            <Column padding={[4]}>
                                <TextField
                                    size={"small"}
                                    error={false}
                                    id="outlined-helperText"
                                    label="MM/YY"
                                    defaultValue=""
                                    helperText={false ? "Some important text" : ""}
                                    variant="outlined"
                                />
                            </Column>
                        </Row>

                    </Column>
                    <Column md={1} xs={6} sm={6} >
                        <Row>
                            <Column>
                                <Text size={16} bold>CV Code:*</Text>
                            </Column>

                            <Column padding={[4]}>
                                <TextField
                                    size={"small"}
                                    error={false}
                                    id="outlined-helperText"
                                    label="CV"
                                    defaultValue=""
                                    helperText={false ? "Some important text" : ""}
                                    variant="outlined"
                                />
                            </Column>
                        </Row>

                    </Column>
                    <Column md={4}>
                        <Row>
                            <Column>
                                <Text size={16} bold>Card Owner:*</Text>
                            </Column>

                            <Column padding={[4]}>
                                <TextField
                                    size={"small"}
                                    error={false}
                                    id="outlined-helperText"
                                    label="Name on Card"
                                    defaultValue=""
                                    helperText={false ? "Some important text" : ""}
                                    variant="outlined"
                                />
                            </Column>
                        </Row> 
                    </Column> */}
        </Row>
      </Column>
    </Row>
  );
};

const SummaryContainer = ({ classes, data, query }) => {
  return data ? (
    <Row>
      <Column md={4} padding={[5]}>
        <Image src={data.rooms.images.baseUrl.lg + data.rooms.images.featureImageUrl} className={classes.hotelImage} />
      </Column>
      <Column md={8} padding={[15]}>
        <Row>
          <Column md={5}>
            <Box className={classes.box} borderRight={1} borderColor={'#CDCECD'}>
              <Row>
                <Column>
                  <h2>{data.hotelName} </h2>
                  <h4>{data.rooms.roomName} </h4>
                </Column>
                <Column padding={[10]}>
                  <Row>
                    <Column padding={[3, 0]}>
                      <Text variant={'h5'} component="h6" medium size={15}>
                        <span className={classes.bold}>Check In : </span>
                        {query && query.ci ? query.ci : 'Not mension'}
                      </Text>
                    </Column>
                    <Column padding={[3, 0]}>
                      <Text variant={'h5'} component="h6" medium size={15}>
                        <span className={classes.bold}>Check Out : </span> {query && query.ci ? query.co : 'Not mension'}
                      </Text>
                    </Column>
                    <Column padding={[3, 0]}>
                      <Text variant={'h5'} component="h6" medium size={15}>
                        <span className={classes.bold}>No of night : </span> {data.rooms.rates.occupancy.nights} Nights
                      </Text>
                    </Column>
                    <Column padding={[5, 0, 0, 0]}>
                      <Text variant={'h5'} component="h6" medium size={14}>
                        <span className={classes.bold}>Room </span> : {data.rooms.rates.occupancy.adults} Adult
                      </Text>

                      <Text variant={'h5'} component="h6" medium size={14}>
                        <span className={classes.bold}>Children </span>: {data.rooms.rates.occupancy.childs}
                      </Text>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Box>
          </Column>
          <Column md={7} padding={[10]}>
            <Row padding={[10]}>
              <Row>
                <Column>
                  <Row>
                    <Column>
                      <Row>
                        <Column>
                          <h3>Cancellation Policy </h3>
                        </Column>
                        <Column padding={[0, 5]}>
                          {data.rooms.rates.hasOwnProperty('cancelationPolicy') ? (
                            <Text variant={'p'} size={14} component="h6" color="#505ccb" medium>
                              {data.rooms.rates.cancelationPolicy && data.rooms.rates.cancelationPolicy.isFreeCancelation
                                ? 'Free cancellation.'
                                : 'Free Cancelletion not available'}
                            </Text>
                          ) : (
                            ''
                          )}
                          {/* {data.rooms.rates.cancelationPolicy.deductionAmount ? <Text variant={"h4"} component="p" color="#505ccb" size={14} ><h4>{data.rooms.currency + " " + data.rooms.rates.cancelationPolicy.deductionAmount + " is cancellation charges"}</h4></Text> : <p></p>}
                          {data.rooms.rates.cancelationPolicy.untilDate ? <Text variant={"p"} component="h6" color="green" size={14} medium >{"cancellation till " + data.rooms.rates.cancelationPolicy.untilDate}</Text> : <p></p>} */}
                          {data.rooms.rates.isRefundable ? (
                            <Text variant={'p'} component="h6" color="green" size={14} medium>
                              Refund Included
                            </Text>
                          ) : (
                            <Text variant={'p'} component="h6" color="red" size={14} medium>
                              Refund not Included
                            </Text>
                          )}
                        </Column>
                      </Row>
                    </Column>
                    <Column padding={[5, 0]}>
                      <Row>
                        <Column padding={[5, 0, 0, 0]}>
                          {/* <h3>Avg charge per {data.rooms.rates.occupancy.nights} night</h3> */}
                        </Column>
                        <Column padding={[0, 5]}>{/* <h3>{data.rooms.currency} {data.rooms.rates.netRate} </h3> */}</Column>
                      </Row>
                    </Column>

                    <Column padding={[5, 0]} center bottom>
                      <h2>Total Hotel Price</h2>
                      <h2 style={{ color: '#505ccb', marginLeft: 5 }}>
                        {data.rooms.currency + ' ' + data.rooms.rates.netRate}
                      </h2>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Row>
          </Column>
        </Row>
      </Column>
      <Column padding={[10, 15]}>
        <Row>
          <Column>
            <h3>Important Notes</h3>
          </Column>
          <Column padding={[0, 10]}>
            <Text variant={'p'} component="h6" size={16}>
              {
                "Please provide the traveller's English name as per passport and don't use other special characters (%#+!@$()^*=:/?|<>). If you are reserving multiple rooms at same hotel for the same dates, please use different names for each reservation."
              }
            </Text>
          </Column>
        </Row>
      </Column>
    </Row>
  ) : null;
};

const SkeletonContainer = () => {
  return (
    <Card padding={[5]}>
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
    </Card>
  );
};

const GuestContainer = ({ onChange, value, tag, index, classes, ...props }) => {
  return (
    <Row>
      <Column>
        <Row>
          <Column padding={[0, 10]}>
            <Text component="h6" variant="h6" bold>
              {tag + ' ' + (index + 1)}
            </Text>
          </Column>
        </Row>
        <Row padding={[0, 10]}>
          {value.guestTitle != '' ? (
            <Column md={1} padding={[3, 0]}>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                style={{ height: 50 }}
                value={value.guestTitle}
                name={'guestTitle'}
                onChange={onChange}
                input={<BootstrapInput />}>
                <MenuItem value={'Mr'}>Mr</MenuItem>
                <MenuItem value={'Mrs'}>Mrs</MenuItem>
                <MenuItem value={'Ms'}>Ms</MenuItem>
              </Select>
            </Column>
          ) : null}

          <Column md={3} padding={[5]}>
            <TextField
              size={'small'}
              error={value.guestFirstNameErr && value.is_mandatory}
              id="outlined-helperText"
              label={'First Name ' + (value.is_mandatory ? '*' : '')}
              value={value.guestFirstName}
              onChange={onChange}
              name="guestFirstName"
              variant="outlined"
              margin=""
            />
          </Column>

          <Column md={3} padding={[5]}>
            <TextField
              size={'small'}
              error={value.guestLastNameErr && value.is_mandatory}
              value={value.guestLastName}
              name="guestLastName"
              onChange={onChange}
              id="outlined-helperText"
              label={'Last Name' + (value.is_mandatory ? '*' : '')}
              defaultValue=""
              variant="outlined"
              margin=""
            />
          </Column>

          <Column md={2} padding={[5]}>
            <TextField
              size={'small'}
              error={value.guestAgeErr && value.is_mandatory}
              id="outlined-helperText"
              value={value.guestAge}
              name="guestAge"
              type="number"
              onChange={onChange}
              label={'Age' + (value.is_mandatory ? '*' : '')}
              defaultValue=""
              variant="outlined"
              margin=""
            />
          </Column>
        </Row>
      </Column>
    </Row>
  );
};
