import React, { useState, useEffect } from 'react';
import BannerEventRate from './BannerEventRate';
import EventCarousel from './EventCarousel';
import { makeStyles } from '@material-ui/core/styles';
import EventToggleTab from './EventToggleTab';
import EventRating from './EventRating';
import { getEventsDetails } from '../../../../helper/RequestPayLoadBookings';
import { httpPostRequest } from '../../../../helper/JsHelper';
import { constants } from '../../../../helper/constants';
import { useRouter } from 'next/router';
import { Container, Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { Row, Column, Card } from '../../../../core';

const useStyles = makeStyles((theme) => ({
  ContentCreaterPost: { width: '100%', height: '170px' },
  postContentCreation: { margin: 'auto 0' },
}));

const SingleEvent = () => {
  const [loader, setLoader] = useState(true);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(50);
  const [eventData, setEventData] = useState([]);
  const { query } = useRouter();
  const getEvent = async () => {
    if (query && query.hasOwnProperty('pkey')) {
      setLoader(true);
      const req = getEventsDetails(query, end, start);
      const res = await httpPostRequest(req);
      if (
        res &&
        res[constants.DATA_EXCEPTION] &&
        res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200 &&
        res.hasOwnProperty(constants.DATA) &&
        res[constants.DATA] !== null
      ) {
        setEventData(res[constants.DATA]);
        setLoader(false);
      } else {
        setLoader(false);
      }
    }
  };
  useEffect(() => {
    getEvent();
  }, [query]);
  return (
    <>
      {!loader ? (
        <div>
          <BannerEventRate eventData={eventData} />
          <EventCarousel />
          <EventToggleTab eventData={eventData} />
          <EventRating eventData={eventData} />
        </div>
      ) : (
        <EventSkeleton />
      )}
    </>
  );
};

const EventSkeleton = ({ padding }) => {
  const classes = useStyles();
  return (
    <Column>
      <Container>
        <Skeleton variant="rect" width="78%" height="300px" style={{ margin: '0 auto' }} />
      </Container>

      <Container maxWidth="md" style={{ padding: '10px 0px' }}>
        <Card>
          <Row>
            <Column md={12} padding={[10, 10]}>
              <Skeleton variant="text" width="25%" style={{ fontSize: '35px' }} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
            </Column>
          </Row>
        </Card>

        <Card margin={[10, 0, 0, 0]}>
          <Row>
            <Column md={12} padding={[10, 10]}>
              <Skeleton variant="text" width="20%" style={{ fontSize: '35px' }} />
            </Column>
          </Row>
        </Card>

        <Card margin={[10, 0, 0, 0]}>
          <Row>
            <Column md={12} padding={[10, 10]}>
              <Skeleton variant="text" width="25%" style={{ fontSize: '35px' }} />
            </Column>
          </Row>
        </Card>
      </Container>

      <Container maxWidth="md" style={{ padding: '10px 0px' }}>
        <Card>
          <Row padding={[10, 10]}>
            <Column md={8} padding={[10, 10]}>
              <Skeleton variant="text" width="25%" style={{ fontSize: '35px' }} />
              <Skeleton variant="text" width="20%" />
              <Row>
                <Column md={6} sm={12} xs={12}>
                  <Skeleton variant="react" width="100%" height="20px" />
                </Column>
                <Column md={6} sm={12} xs={12}></Column>
              </Row>
              <Skeleton variant="text" width="100%" height="2px" />
              <Row>
                <Column md={6} sm={12} xs={12}>
                  <Skeleton variant="react" width="100%" height="20px" />
                </Column>
                <Column md={6} sm={12} xs={12}></Column>
              </Row>
              <Skeleton variant="text" width="20%" />

              <Row>
                <Column md={2} padding={[2, 3]}>
                  <Skeleton variant="react" width="100%" height="25px"></Skeleton>
                </Column>
                <Column md={2} padding={[2, 3]}>
                  <Skeleton variant="react" width="100%" height="25px"></Skeleton>
                </Column>
                <Column md={4} padding={[2, 3]}>
                  <Skeleton variant="react" width="100%" height="25px"></Skeleton>
                </Column>
                <Column md={4}></Column>
              </Row>
              <Row>
                <Column md={4} padding={[2, 3]}>
                  <Skeleton variant="react" width="100%"></Skeleton>
                </Column>
                <Column md={8} padding={[2, 3]}></Column>
              </Row>
              <Row>
                <Column md={8}>
                  <Skeleton variant="text" width="25%" style={{ fontSize: '35px' }} />
                  <Skeleton variant="text" width="100%"></Skeleton>
                </Column>
                <Column md={4}></Column>
              </Row>
              <Row padding={[3, 0]}>
                <Column md={6} sm={6} xs={6}>
                  <Skeleton variant="text" width="100%" style={{ fontSize: '35px' }} />
                </Column>
                <Column md={6} sm={6} xs={6}>
                  <Skeleton variant="text" width="100%" style={{ fontSize: '35px' }} />
                </Column>
              </Row>
              <Row padding={[3, 0]}>
                <Column md={6} sm={6} xs={6}>
                  <Skeleton variant="text" width="100%" style={{ fontSize: '35px' }} />
                </Column>
                <Column md={6} sm={6} xs={6}>
                  <Skeleton variant="text" width="100%" style={{ fontSize: '35px' }} />
                </Column>
              </Row>
              <Row padding={[3, 0]}>
                <Column md={6} sm={6} xs={6}>
                  <Skeleton variant="text" width="100%" style={{ fontSize: '35px' }} />
                </Column>
                <Column md={6} sm={6} xs={6}>
                  <Skeleton variant="text" width="100%" style={{ fontSize: '35px' }} />
                </Column>
              </Row>
              <Row padding={[3, 0]}>
                <Column md={6} sm={6} xs={6}>
                  <Skeleton variant="text" width="100%" style={{ fontSize: '35px' }} />
                </Column>
                <Column md={6} sm={6} xs={6}>
                  <Skeleton variant="text" width="100%" style={{ fontSize: '35px' }} />
                </Column>
              </Row>
              <Row padding={[3, 0]}>
                <Column md={6} sm={6} xs={6}>
                  <Skeleton variant="text" width="100%" style={{ fontSize: '35px' }} />
                </Column>
                <Column md={6} sm={6} xs={6}>
                  <Skeleton variant="text" width="100%" style={{ fontSize: '35px' }} />
                </Column>
              </Row>
              <Row padding={[3, 0]}>
                <Column md={6} sm={6} xs={8}>
                  <Skeleton variant="text" width="50%" style={{ fontSize: '35px' }} />
                  <Skeleton variant="text" width="100%" />
                </Column>
                <Column md={4} sm={4} xs={12}>
                  <Skeleton variant="react" width="70%" height="25px" style={{ fontSize: '35px', textAlign: 'right' }} />
                </Column>
              </Row>
            </Column>
            <Column md={4} padding={[5, 5]}>
              <Skeleton variant="text" width="80%" style={{ fontSize: '14px' }} />
              <Skeleton variant="text" width="70%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="80%" style={{ fontSize: '16px', marginTop: '5px' }} />
              <Skeleton variant="text" width="80%" style={{ fontSize: '14px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="80%" style={{ fontSize: '14px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="80%" style={{ fontSize: '14px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="80%" style={{ fontSize: '14px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="80%" style={{ fontSize: '14px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="80%" style={{ fontSize: '14px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="80%" style={{ fontSize: '14px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
              <Skeleton variant="text" width="100%" style={{ fontSize: '11px' }} />
            </Column>
          </Row>
        </Card>
      </Container>
    </Column>
  );
};

export default SingleEvent;
