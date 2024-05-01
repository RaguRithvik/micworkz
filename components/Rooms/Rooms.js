import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import {
  LocalOffer,
  ContactPhone,
  InsertPhoto,
  LocalHotel,
  CheckCircle,
  AddBox,
  CancelPresentation,
  CreditCard,
} from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import { Row, Column, Image, Card, Text, Touchable } from '../../core';
import { toLowerCase, callToMobile, openEmail, splitNumberText } from '../../helper/JsHelper';
import { Paper, Tabs, Tab, AppBar, Box } from '@material-ui/core';
import { getDateddMMMyyyy } from '../../helper/JsHelper';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  roomImage: {
    width: '100%',
    height: 250,
    borderRadius: 5,
  },
  roomImageNail: {
    height: 60,
    width: 65,
    borderRadius: 5,
    margin: 3,
  },
  optionsIcon: {
    color: '#347536',
  },
  optionsPrimary: {
    color: '#347536',
  },
  optionsSecondary: {},
  hotelRoomCard: {
    minHeight: 250,
  },
  hotelRoomCardScroll: {
    minHeight: 250,
  },
  hotelRoomCardScrollBody: {
    // height: 250
  },
  amenities: {
    display: 'flex',
  },
  stickey: {},
}));

const Rooms = ({ data, ...props }) => {
  const classes = useStyles();
  const { hotelKey, clientId, productProviderTypeId, hotelId, rooms } = data;
  const { listing, selected } = rooms;
  return (
    <Row>
      {listing
        .sort((a, b) => (a.rates.length < b.rates.length ? 1 : -1))
        .map((value, index) => (
          <Column key={'Room' + index}>
            <Room
              value={value}
              hotelKey={hotelKey}
              clientId={clientId}
              productProviderTypeId={productProviderTypeId}
              hotelId={hotelId}
              classes={classes}
            />
          </Column>
        ))}
    </Row>
  );
};

export default Rooms;

const Room = ({ classes, value, hotelId, hotelKey, clientId, productProviderTypeId, ...prop }) => {
  const router = useRouter();
  const [mainImage, setMainImage] = useState(null);
  useEffect(() => {
    setMainImage(value.images.baseUrl.lg + value.images.featureImageUrl);
  }, []);

  function selectRoom(rates) {
    let params = {
      name: router.query.name,
      ci: router.query.ci,
      co: router.query.co,
      rd: router.query.rd,
      RoomCode: value.roomCode,
      RoomId: value.roomId,
      RateKey: rates.rateKey,
      hotelKey: rates.hotelKey,
      clientId: clientId,
      productProviderTypeId: productProviderTypeId,
      hotelId: hotelId,
    };
    router.push({
      pathname: '/dashboard/Bookings/HotelBooking/TripSummary',
      query: params,
    });
  }

  return (
    <Card padding={[5]} margin={[5, 0, 0, 0]} className={classes.hotelRoomCard} {...prop}>
      <Row>
        <Column md={4} padding={[5]}>
          <Row>
            <Column>
              <Row>
                <Column padding={[5, 0]}>
                  <Text variant={'h3'} component={'h3'} color="#003399" semibold>
                    {value.roomName}
                  </Text>
                </Column>

                <Column padding={[5, 0]}>
                  <div className={classes.stickey}>
                    <Image src={mainImage} className={classes.roomImage} />
                  </div>
                </Column>
              </Row>

              <Row>
                {value.images.imageUrls.map((val, index) => (
                  <Touchable key={'nail_key_' + index} onClick={() => setMainImage(value.images.baseUrl.lg + val)}>
                    <Image src={value.images.baseUrl.sm + val} className={classes.roomImageNail} />
                  </Touchable>
                ))}
              </Row>
            </Column>
            {/* <Column>
                            <Row>
                                <Column padding={[5]}>
                                    <Text variant={"h4"} component={"h3"} semibold>Maximum Occupancy ( {value.roomMaxPax} )</Text> 
                                </Column>
                                <Column padding={[0,10]}>
                                    <Text variant={"p"} component={"h3"} size={14} semibold>{value.roomMaxAdults}  Adult {1} Room</Text>
                                    <Text variant={"h1"} component={"h3"} size={14}  medium>{value.roomMaxChilds} Children</Text>
                                </Column>
                            </Row> 
                        </Column> */}
          </Row>
        </Column>
        <Column md={8} className={classes.hotelRoomCardScroll}>
          <Row>
            {value.rates && value.rates.length ? (
              value.rates.map((rates, rates_index) => (
                <Column key={'rates_' + rates_index} className={classes.hotelRoomCardScrollBody}>
                  <Row>
                    <Column md={5} bottom>
                      <Row padding={[5]}>
                        <Column>
                          {rates.cancelationPolicy && (
                            <Row padding={[5]} key={'cancellationPolicies'}>
                              <Column md={1} xs={1} sm={1} center>
                                <CheckCircle className={classes.optionsIcon} />
                              </Column>
                              <Column md={11} xs={11} sm={11} padding={[0, 0, 0, 5]}>
                                <Text size={13} className={classes.optionsPrimary} bold>
                                  Cancellation till {rates.cancelationPolicy.untilDate}
                                </Text>
                                <Text size={11} className={classes.optionsSecondary} medium>
                                  {rates.cancelationPolicy.isFreeCancelation
                                    ? 'Free cancellation.'
                                    : 'No free cancellation.'}{' '}
                                  <strong> </strong>
                                </Text>
                              </Column>
                            </Row>
                          )}
                        </Column>
                        <Column>
                          <Row padding={[5]} key={'cancellationPolicies_'}>
                            <Column md={1} xs={1} sm={1} center>
                              <LocalHotel className={classes.optionsIcon} />
                            </Column>
                            <Column md={11} xs={11} sm={11} padding={[0, 0, 0, 5]}>
                              <Text size={13} className={classes.optionsPrimary} bold>
                                {rates.occupancy.adults} Adult, {rates.occupancy.childs} Child
                              </Text>
                              <Text size={11} className={classes.optionsSecondary} medium>
                                {rates.occupancy.rooms} room / {rates.occupancy.nights} night <strong> </strong>
                              </Text>
                            </Column>
                          </Row>
                        </Column>
                      </Row>
                    </Column>
                    <Column md={7} padding={[10]}>
                      <Row>
                        <Column md={6} center middle className={classes.amenities}>
                          <Text size={20} color="#003399" bold>
                            {value.currency + ' ' + rates.netRate}
                          </Text>
                          {rates.tax.taxValue > 0 ? (
                            <Text size={12} medium color="#066E0B" bold>
                              {rates.tax.included
                                ? 'No Taxes'
                                : value.currency + ' ' + rates.tax.taxValue + ' tax & services'}
                            </Text>
                          ) : null}
                        </Column>
                        <Column md={6} padding={[10]}>
                          <Row>
                            <Column padding={[10, 0, 0, 0]}>
                              <Button variant="contained" color="primary" onClick={() => selectRoom(rates)}>
                                Select room
                              </Button>
                            </Column>
                          </Row>
                        </Column>
                      </Row>
                    </Column>
                  </Row>
                  <Divider />
                </Column>
              ))
            ) : (
              <Column middle center>
                <Row padding={[10, 15]}>
                  <Column md={8} bottom>
                    <Text size={20} color={'#003399'} bold>
                      {'Unavailable, Please Try Again Later or Select Different Room '}
                    </Text>
                  </Column>
                </Row>
              </Column>
            )}
          </Row>
        </Column>
      </Row>
    </Card>
  );
};
