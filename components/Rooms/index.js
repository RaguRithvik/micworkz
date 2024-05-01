import React, { useState, useRef, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { LocalOffer, ContactPhone, AccountBalance, Room, InsertPhoto, CheckCircle, AddBox } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import { Row, Column, Image, Card, Text, Touchable } from '../../core';
import { Paper, Tabs, Tab, AppBar, Box } from '@material-ui/core';
import Rooms from './Rooms';
import Amenities from './Amenities';
import Gallery from './Gallery';
import Information from './Information';
import Location from './Location';
import RoomsSkeleton from './RoomsSkeleton';
import Carousel from 'react-material-ui-carousel';
import { getRoomListByHotel } from '../../helper/RequestPayLoadBookings';
import { useRouter } from 'next/router';
import { constants } from '../../helper/constants';
import { httpPostRequest } from '../../helper/JsHelper';
import Error from '../Error';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // maxWidth: 500,
  },
  label: {
    marginLeft: 5,
    fontSize: 12,
    paddingTop: 4,
  },
  carouselImage: {
    height: 247,
    width: '100%',
    borderRadius: 8,
  },
}));

export default function RoomsInfo() {
  const classes = useStyles();
  const ref = useRef(null);
  const { query } = useRouter();
  const [tab, setTab] = useState(0);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const getHotels = async () => {
    setLoader(true);
    if (query && query.hasOwnProperty('ci')) {
      const req = getRoomListByHotel(query);
      const res = await httpPostRequest(req);
      if (
        res &&
        res[constants.DATA_EXCEPTION] &&
        res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200 &&
        res[constants.DATA]
      ) {
        setData(res[constants.DATA]);
        setLoader(false);
      } else {
        setLoader(404);
      }
    }
  };

  useEffect(() => {
    getHotels();
  }, []);

  const merge = (left, right) => {
    let arr = [];

    while (left.length && right.length) {
      if (left[0] > right[0]) {
        arr.push(right.shift());
      } else {
        arr.push(left.shift());
      }
    }
    return [...arr, ...left, ...right];
  };
  const mergeSort = (value) => {
    let half = value.length / 2;
    if (value.length < 2) {
      return value;
    }
    return merge(mergeSort(value.splice(0, half)), mergeSort(value));
  };

  const getPriceRange = (values) => {
    let rates = [];
    let currency = '';
    for (let val of values) {
      for (let rate of val.rates) {
        currency = val.currency;
        rates.push(rate.netRate ? rate.netRate : 0);
      }
    }
    let price_range = mergeSort(rates);

    return price_range.length > 1
      ? currency +
          ' ' +
          (price_range.length > 1 ? price_range[0] + ' ~ ' + price_range[price_range.length - 1] : price_range[0])
      : false;
  };

  return (
    <div>
      {!loader ? (
        <Row>
          <Column>
            <Row>
              <Column md={5} padding={[5]}>
                <Carousel indicatorContainerProps={{ style: { position: 'absolute', bottom: 20 } }}>
                  {data.hotelImages.imageUrls.splice(1, 5).map((imageUrl, i) => (
                    <Image
                      className={classes.carouselImage}
                      src={data.hotelImages.baseUrl.lg + imageUrl}
                      key={'main_slicer' + i}
                    />
                  ))}
                </Carousel>
              </Column>
              <Column md={7}>
                <Row>
                  <Column md={6} padding={[5]}>
                    <Card noShadow padding={[5]}>
                      <Row>
                        <Column padding={[4]}>
                          <Text bold size={15}>
                            Amenities & Services
                          </Text>
                        </Column>
                        <Column>
                          <Divider />
                        </Column>
                        <Column padding={[5, 10]}>
                          {data.amenity.hotel.map(
                            (amenities, amenities_index) =>
                              amenities_index < 5 &&
                              amenities.amenityName.length < 23 && (
                                <TextWidthIcon
                                  key={'amenities' + amenities_index}
                                  icon={<CheckCircle style={{ fontSize: 16 }} color="primary" />}
                                  label={amenities.amenityName}
                                />
                              ),
                          )}
                          <Touchable
                            onClick={() => {
                              setTab(4);
                              ref.current.scrollIntoView('smooth');
                            }}>
                            View all amenities
                          </Touchable>
                        </Column>
                        <Column>
                          <Divider />
                        </Column>
                        <Column padding={[10]}>
                          <Row>
                            <Column md={6} xs={6} sm={6}>
                              <Text medium color="grey" size={12}>
                                Check-In
                              </Text>
                              <Text bold>{data.checkinHour ? data.checkinHour : query.ci}</Text>
                            </Column>
                            <Column md={6} xs={6} sm={6}>
                              <Text medium color="grey" size={12}>
                                Check-Out
                              </Text>
                              <Text bold>{data.checkoutHour ? data.checkoutHour : query.co}</Text>
                            </Column>
                          </Row>
                        </Column>
                      </Row>
                    </Card>
                  </Column>
                  <Column md={6} padding={[5]}>
                    <Card noShadow padding={[10]} margin={[5, 0]}>
                      <TextWidthIcon
                        fcolor="#347536"
                        padding={[2]}
                        icon={<AccountBalance style={{ fontSize: 16, color: '#347536' }} />}
                        medium
                        size={14}
                        label={"It's " + data.hotelCategory.categoryName + ' Hotel'}
                      />
                    </Card>
                    <Card noShadow borderRadius={8} padding={[10]}>
                      <Row>
                        <Column md={12} xs={12} sm={12} padding={[10]}>
                          <Text size={14} medium>
                            price start at
                          </Text>
                          <Text
                            size={getPriceRange(data.rooms.listing) ? 23 : 18}
                            color={getPriceRange(data.rooms.listing) ? '#003399' : '#ff0000'}
                            bold>
                            {getPriceRange(data.rooms.listing)
                              ? getPriceRange(data.rooms.listing)
                              : 'Unavailable at the moment '}
                          </Text>
                        </Column>
                        <Column>
                          <Button variant="outlined" color="primary" onClick={() => setTab(0)}>
                            View Room Options
                          </Button>
                        </Column>
                      </Row>
                    </Card>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Column>
          <Column>
            <Paper square className={classes.root} color="default">
              <Tabs
                value={tab}
                indicatorColor="primary"
                textColor="primary"
                onChange={(event, newValue) => setTab(newValue)}
                aria-label="simple tabs example">
                <Tab
                  label={
                    <Row>
                      <LocalOffer style={{ color: tab == 0 ? '' : 'grey' }} />
                      <Text className={classes.label} semibold color={tab == 0 ? 'primary' : 'grey'}>
                        Room Rate
                      </Text>
                    </Row>
                  }
                />
                <Tab
                  label={
                    <Row>
                      <ContactPhone style={{ color: tab == 1 ? '' : 'grey' }} />
                      <Text className={classes.label} semibold color={tab == 1 ? 'primary' : 'grey'}>
                        Information
                      </Text>
                    </Row>
                  }
                />
                <Tab
                  label={
                    <Row>
                      <Room style={{ color: tab == 2 ? '' : 'grey' }} />
                      <Text className={classes.label} semibold color={tab == 2 ? 'primary' : 'grey'}>
                        Location
                      </Text>
                    </Row>
                  }
                />
                <Tab
                  label={
                    <Row>
                      <InsertPhoto style={{ color: tab == 3 ? '' : 'grey' }} />
                      <Text className={classes.label} semibold color={tab == 3 ? '' : 'grey'}>
                        Gallery
                      </Text>
                    </Row>
                  }
                />
                <Tab
                  label={
                    <Row>
                      <AddBox style={{ color: tab == 4 ? '' : 'grey' }} />
                      <Text className={classes.label} semibold color={tab == 4 ? 'primary' : 'grey'}>
                        Amenities{' '}
                      </Text>
                    </Row>
                  }
                />
              </Tabs>
            </Paper>
            <div ref={ref}>
              <TabPanel value={tab} index={0}>
                <Rooms data={data} />
              </TabPanel>

              <TabPanel value={tab} index={1}>
                <Information data={data} />
              </TabPanel>
              <TabPanel value={tab} index={2}>
                <Location data={data.hotelAddress} />
              </TabPanel>

              <TabPanel value={tab} index={3}>
                <Gallery data={data.hotelImages} />
              </TabPanel>
              <TabPanel value={tab} index={4}>
                <Amenities data={data.amenity} />
              </TabPanel>
            </div>
          </Column>
        </Row>
      ) : loader == 404 ? (
        <Error />
      ) : (
        <RoomsSkeleton />
      )}
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

const TextWidthIcon = ({ fcolor, icon, padding, size, bold, medium, label, ...props }) => {
  return (
    <Row middle padding={padding ? padding : [3, 5]} {...props}>
      {icon}
      <Text color={fcolor ? fcolor : ''} bold={bold} medium={medium} size={size ? size : 15} style={{ marginLeft: 10 }}>
        {label}
      </Text>
    </Row>
  );
};
