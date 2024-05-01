import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Button, IconButton } from '@material-ui/core';
import { Row, Column, Text, Loader } from '../../../../core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CurrencyFormat from 'react-currency-format';
import { useStore } from '../../../../helper/Store';
import { getDateYYYYMMDD, getDateddMMMyyyy, httpPostRequest } from '../../../../helper/JsHelper';
import { getEventPackageDetails } from '../../../../helper/RequestPayLoadBookings';
import { constants } from '../../../../helper/constants';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  AttractionRatingInformation: {
    width: '100%',
    float: 'left',
    padding: '10px 0px',
  },
  MoneyInformation: {
    width: '100%',
    float: 'left',
    padding: '20px 20px',
    boxShadow: '0px 0px 20px #ccc',
    backgroundColor: '#fff',
    borderRadius: '10px',
  },
  fromInformation: { fontSize: '12px', color: '#333' },
  NumberofGdInformation: { fontSize: '25px', color: '#333' },
  BookNowfor: { listStyleType: 'none', padding: '5px 0px', fontSize: '13px' },
  BoltInformation: {
    color: '#287cbc',
    fontSize: '11px',
    marginTop: '5px',
    listStyleType: 'none',
  },
  SelectOptioned: {
    width: '250px',
    color: '#fff',
    padding: '5px 30px',
    color: '#fff',
    marginTop: '10px',
    textTransform: 'unset',
  },
  selectIndentborder: {
    borderBottom: '1px solid #ccc',
    width: '100%',
    padding: '5px 0px',
  },
  CheckAvailability: {
    width: '250px',
    backgroundColor: '#f78a1d',
    color: '#fff',
    textTransform: 'unset',
    marginTop: '10px',
    '&:hover': { background: '#f78a1d', color: '#fff' },
  },
  categoryInformation: { marginTop: '10px' },
  ChildInformation: {
    width: '100%',
    float: 'left',
    padding: '0px 10px',
    border: '1px solid #ccc',
    marginTop: '10px',
  },
  ChildInfocount: { fontSize: '15px' },
  CountounStart: {
    cursor: 'pointer',
    padding: '5px 10px',
    margin: '0px 10px',
    backgroundColor: '#d7d7d7',
    border: '1px solid #d7d7d7',
  },
  ChildInformerCounter: {
    width: '100%',
    float: 'left',
    textAlign: 'right',
    padding: 10,
    borderRadius: 4,
  },
  sgdAmountInformation: { width: '100%', float: 'left', padding: '10px 0px' },
  sgdAmountInformationnew: {
    fontWeight: '600',
    fontSize: '25px',
    padding: '10px 0px',
  },
  CompletelyAll: { fontSize: '13px', color: '#333' },
  AddtoCartInform: {
    width: '140px',
    backgroundColor: '#f78a1d',
    marginTop: '20px',
    textTransform: 'unset',
    marginLeft: '5px',
    color: '#fff',
    '&:hover': { background: '#f78a1d', color: '#fff' },
  },
  BookNowInform: {
    width: '120px',
    color: '#fff',
    marginTop: '20px',
    marginLeft: '5px',
    textTransform: 'unset',
  },
  selectPackage: {
    width: '100%',
    float: 'left',
    boxShadow: '0px 0px 20px #ccc',
    padding: '10px 15px',
    backgroundColor: '#fff',
    borderRadius: '10px',
  },
  OpenDataTicket: {
    fontSize: '13px',
    color: '#333',
    listStyleType: 'none',
    margin: '5px 0px',
  },
  OpenDataTicketInformation: {
    listStyleType: 'none',
    fontSize: '11px',
    marginTop: '3px',
  },
  SelectPackaged: {
    borderBottom: '1px solid #ccc',
    width: '100%',
    padding: '5px 0px 5px 0px',
  },
  PackageDetail: { width: '100%', float: 'left', padding: '10px 0px' },
  PackageLogeddetail: { fontWeight: '600', fontSize: '20px', color: '#333' },
  InclusiveOfNow: {
    fontSize: '14px',
    fontWeight: '600 !important',
    color: '#333',
  },
  nightStacation: {
    fontSize: '11px',
    color: '#333',
    fontWeight: '400 !important',
    margin: '3px 0px',
  },
  ViewMoreInform: { textAlign: 'center', padding: '5px 0px' },
  viewMoreInformLink: { color: '#287cbc' },
}));
const EventRating = ({ eventData }) => {
  const classes = useStyles();
  const router = useRouter();
  const { setAlertMsg } = useStore();
  const [packageList, setPackageList] = useState(eventData['package-list']);
  const [eventList, setEventList] = useState(eventData['package-list'][0]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [packageInfo, setPackageInfo] = useState([]);
  const [loader, setLoader] = useState(false);
  const [checkoutData, setCheckoutData] = useState(undefined);
  const [packageCount, setPackageCount] = useState(Array.from({ length: eventList['pax-info'].length }, () => 0));
  const [currentPaxCount, setCurrentPaxCount] = useState(packageCount.reduce((p, v) => p + v)); //for checking currnect total with max-pax

  const handleChange = (event, newCatagory) => {
    if (newCatagory !== null) {
      setEventList(newCatagory);
      setTotalPrice(0);
      setPackageCount(Array.from({ length: newCatagory['pax-info'].length }, () => 0));
      setPackageInfo([]);
      setCheckoutData(undefined);
    } else {
      return;
    }
  };
  const checkAvailability = async () => {
    // get number of repeated packages
    setLoader(true);
    const counts = [...packageInfo].reduce(
      (acc, value) => ({
        ...acc,
        [value['pax-key']]: (acc[value['pax-key']] || 0) + 1,
      }),
      {},
    );
    // map repeated packges to no-of-pax and populate other values
    let finalPax = [...packageInfo].map((val, index) => {
      if (counts.hasOwnProperty(val['pax-key'])) {
        return {
          'pax-key': val['pax-key'],
          'no-of-pax': counts[val['pax-key']],
          'book-date-from': getDateYYYYMMDD(new Date(eventList['event-start-date'])),
          'book-date-to': getDateYYYYMMDD(new Date(eventList['event-end-date'])),
        };
      }
    });
    //filter out repeated values and store  result
    let PAX_LIST = finalPax.filter((ele, index) => finalPax.findIndex((obj) => obj['pax-key'] === ele['pax-key']) === index);

    let data = {
      pkey: eventData['product-key'],
      packey: eventList['package-key'],
      curr: eventList['currency'],
    };
    const req = getEventPackageDetails(data, PAX_LIST);
    const res = await httpPostRequest(req);

    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setCheckoutData(res[constants.DATA]);
      setAlertMsg({
        msg: 'Event Available for Booking, Redirecting to Booking Page',
        type: 'success',
      });
      setLoader(false);
      if (res[constants.DATA] && res[constants.DATA].hasOwnProperty('package-info')) {
        router.push({
          pathname: '/dashboard/Bookings/EventBooking/EventCheckout',
          query: {
            packey: res[constants.DATA]['package-info']['package-key'],
            event_rate: res[constants.DATA]['package-info']['rate-key'],
            curr: res[constants.DATA]['currency'],
            rd: '1-1-0',
            // rd:`1-${currentPaxCount}-0`
            total_rate: res[constants.DATA]['total-rate'],
          },
        });
      } else {
        setAlertMsg({
          msg: 'Somethign Went Wrong! Please try again later!',
          type: 'warning',
        });
      }
    } else {
      setLoader(false);
      setAlertMsg({
        msg: 'Event Not Available for Booking, Please try again later!',
        type: 'error',
      });
    }
  };
  const goToCheckoutPage = (e) => {
    e.preventDefault();
    if (packageInfo && packageInfo.length) {
      checkAvailability();
    } else {
      setLoader(false);
      setAlertMsg({ msg: 'Please select packages to proceed', type: 'error' });
    }
  };
  useMemo(() => {
    setCurrentPaxCount(packageCount.reduce((p, v) => p + v));
    setCheckoutData(null);
  }, [packageCount]);

  return (
    <div>
      <section className={classes.AttractionRatingInformation}>
        <Container maxWidth="md">
          <Row>
            <Column md="8" padding={[10, 10, 10, 0]}>
              <Box className={classes.MoneyInformation}>
                <Text component="h3" variant="h3" className={classes.NumberofGdInformation}>
                  <span className={classes.fromInformation}>Starting from</span> {eventData['currency']}{' '}
                  <CurrencyFormat value={eventData['net-rate']} displayType={'text'} thousandSeparator={true} />
                </Text>
                <li className={classes.BookNowfor}>
                  <i class="far fa-clock"></i> Book Now for Today
                </li>
                <li className={classes.BoltInformation}>
                  <i class="fas fa-bolt"></i> Instant Confirmation
                </li>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.SelectOptioned}
                  onClick={() => document.getElementById('package-options').scrollIntoView({ behavior: 'smooth' })}>
                  Select Package
                </Button>
                <Box className={classes.selectIndentborder}></Box>
                {/* <Button
                  id={"check-avail"}
                  variant="contained"
                  className={classes.CheckAvailability}
                  onClick={() => checkAvailability()}
                  endIcon={
                    loader && (
                      <Loader margin="10 0 0 0 " size={20} color={"#fff"} />
                    )
                  }
                >
                  Check availability
                </Button> */}
                <Row>
                  <Column margin={[10, 0]}>
                    <Text component="p" variant="h6" className={classes.categoryInformation}>
                      Category:{' '}
                    </Text>
                  </Column>
                  <Column>
                    <ToggleButtonGroup
                      value={eventList}
                      color="primary"
                      size="small"
                      exclusive
                      onChange={handleChange}
                      style={{ 'flex-wrap': 'wrap' }}>
                      {packageList.map((pack, index) => (
                        <ToggleButton
                          value={pack}
                          aria-label={pack.packageName}
                          style={{
                            margin: 2,
                            padding: '5px 10px',
                            border: '1px solid #287cbc',
                            borderRadius: 5,
                          }}>
                          {pack.packageName}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Column>
                </Row>
                <Row margin={[10, 0]} id={'package-options'}>
                  <Column>
                    <Text component="p" variant="p" className={classes.categoryInformation}>
                      Packages :
                    </Text>
                  </Column>
                  <Column margin={[2]}>
                    <Text style={{ fontSize: 11 }}>
                      You must select no more than{' '}
                      <span style={{ color: '#287cbc', fontSize: 14 }}>{eventList['max-pax']}</span> for this package
                    </Text>
                  </Column>
                  <Column>
                    {eventList['pax-info'].map((event, index) => (
                      <EventPackage
                        key={index}
                        index={index}
                        classes={classes}
                        event={event}
                        currency={eventList['currency']}
                        currentPaxCount={currentPaxCount}
                        setCurrentPaxCount={setCurrentPaxCount}
                        packageCount={packageCount}
                        setPackageCount={setPackageCount}
                        packageInfo={packageInfo}
                        setPackageInfo={setPackageInfo}
                        maxAllowed={eventList['max-pax']}
                        totalPrice={totalPrice}
                        setTotalPrice={setTotalPrice}
                      />
                    ))}
                  </Column>
                </Row>
                <Box className={classes.sgdAmountInformation}>
                  <Row>
                    <Column md={7}>
                      <Text component="h3" variant="h3" className={classes.sgdAmountInformationnew}>
                        {eventList['currency']}{' '}
                        {totalPrice && packageInfo && packageInfo.length ? (
                          <CurrencyFormat
                            value={totalPrice}
                            displayType={'text'}
                            allowNegative={false}
                            thousandSeparator={true}
                            decimalScale={2}
                          />
                        ) : (
                          '-'
                        )}
                      </Text>
                      <Text component="p" variant="p" className={classes.CompletelyAll}>
                        Complete all required fields to continue
                      </Text>
                    </Column>
                    <Column md={5} right>
                      <Box className={classes.AddtoCart}>
                        {/* <Button
                          variant="contained"
                          color="primary"
                          className={classes.AddtoCartInform}
                        >
                          Add to Cart
                        </Button> */}
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.BookNowInform}
                          onClick={(e) => goToCheckoutPage(e)}
                          endIcon={loader && <Loader margin="10 0 0 0 " size={20} color={'#fff'} />}>
                          Book Now
                        </Button>
                      </Box>
                    </Column>
                  </Row>
                </Box>
              </Box>
            </Column>
            <Column md="4" padding={[10, 0, 0, 10]}>
              <PackageDetail classes={classes} eventList={eventList} />
            </Column>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default EventRating;

const EventPackage = ({
  index,
  classes,
  event,
  currency,
  currentPaxCount,
  setCurrentPaxCount,
  packageCount,
  setPackageCount,
  packageInfo,
  setPackageInfo,
  maxAllowed,
  totalPrice,
  setTotalPrice,
}) => {
  // console.log("max allowed", maxAllowed);
  // console.log("curr pax", currentPaxCount);
  // console.log("cal pax", packageCount);
  // console.log("index of element", index);
  // console.log("package info", packageInfo);
  // console.log("\n");
  const addPaxInfo = (event) => {
    let paxCountArr = [...packageCount];
    if (currentPaxCount < maxAllowed) {
      paxCountArr[index] = paxCountArr[index] + 1;
      setPackageCount(paxCountArr);
      setPackageInfo([...packageInfo, event]);
      setTotalPrice(totalPrice + event['pax-rate']['net-rate']);
    } else {
      return;
    }
  };
  const removePaxInfo = (event) => {
    let paxCountArr = [...packageCount];
    let packInfoArr = [...packageInfo];
    if (packageInfo.length == 0 || packageCount[index] == 0) {
      return;
    } else {
      paxCountArr[index] = paxCountArr[index] - 1;
      packInfoArr.splice(packInfoArr.indexOf(event), 1);
      setPackageCount(paxCountArr);
      setPackageInfo(packInfoArr);
      setTotalPrice(totalPrice - event['pax-rate']['net-rate']);
    }
  };
  return (
    <Box className={classes.ChildInformation}>
      <Row middle>
        <Column md={6} sm={6} lg={6} xs={5}>
          <Text component="h3" variant="h3" className={classes.ChildInfocount}>
            {event['pax-title']}
            {event['is-age-limit'] ? (
              <span style={{ margin: '0px 5px' }}>
                ({event['age-from']} - {event['age-to']})
              </span>
            ) : null}
          </Text>
        </Column>
        <Column md={3} sm={3} lg={3} xs={3} right>
          <Row>
            <Text>{currency}</Text>&nbsp;&nbsp;
            <Text>
              <CurrencyFormat value={event['pax-rate']['net-rate']} displayType={'text'} thousandSeparator={true} />
            </Text>
          </Row>
        </Column>
        <Column md={3} sm={3} lg={3} xs={4} right>
          <Row padding={[0, 10]} middle center>
            <Column lg={4} md={4} sm={4} xs={4} middle>
              <IconButton
                color="primary"
                aria-label="remove package"
                component="span"
                style={{ padding: '0px !important' }}
                onClick={() => removePaxInfo(event)}
                disabled={packageInfo.length == 0 || packageCount[index] == 0 ? true : false}>
                <RemoveIcon fontSize="small" />
              </IconButton>
            </Column>
            <Column lg={4} md={4} sm={4} xs={4} middle>
              {packageCount[index]}
            </Column>
            <Column lg={4} md={4} sm={4} xs={4} middle>
              <IconButton
                color="primary"
                aria-label="add package"
                style={{ padding: '0px !important' }}
                component="span"
                onClick={() => addPaxInfo(event)}
                disabled={currentPaxCount < maxAllowed ? false : true}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Column>
          </Row>
        </Column>
      </Row>
    </Box>
  );
};

const PackageDetail = ({ classes, eventList }) => {
  return (
    <Box className={classes.selectPackage}>
      <Text variant="h3" component="h3">
        Selected package details
      </Text>
      <li className={classes.BoltInformation}>
        <i class="fas fa-bolt"></i> Instant Confirmation
      </li>
      {eventList['cancelation-policy'] ? (
        <li className={classes.OpenDataTicketInformation}>
          <i class="fas fa-comments-dollar"></i>{' '}
          {eventList['cancelation-policy']['is-free-cancelation']
            ? 'Free Cancelation'
            : 'Cancelation Charges : ' + eventList['currency'] + ' ' + eventList['cancelation-policy']['deduction-amount']}
        </li>
      ) : (
        ''
      )}
      <li className={classes.OpenDataTicketInformation}>
        <i class="fas fa-calendar-day"></i> Event Dates : {getDateddMMMyyyy(new Date(eventList['event-start-date']))} -{' '}
        {getDateddMMMyyyy(new Date(eventList['event-end-date']))}
      </li>
      <Box className={classes.SelectPackaged}></Box>
      <Row margin={[10, 0]}>
        <Column>
          {eventList['list-package-desc'].map((details, index) => (
            <Row>
              <Column margin={[5, 0]}>
                <Text variant="h3" component="h3" className={classes.InclusiveOfNow}>
                  {details['heading-title']}
                </Text>
              </Column>
              <Column>
                <Text variant="p" component="p" className={classes.nightStacation}>
                  <div dangerouslySetInnerHTML={{ __html: details['detail'] }} />
                </Text>
              </Column>
            </Row>
          ))}
        </Column>
      </Row>
    </Box>
  );
};
