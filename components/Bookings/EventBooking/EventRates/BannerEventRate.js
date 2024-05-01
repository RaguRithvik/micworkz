import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Row, Column, Text, Image } from '../../../../core';
import { Container, Button, Box } from '@material-ui/core';
import styles from './event.module.css';
import Rating from '@material-ui/lab/Rating';
import { addBookmark } from '../../../../helper/JsHelper';
const FA = require('react-fontawesome');
const useStyles = makeStyles((theme) => ({
  Reactpath_continuse: {
    width: '100%',
    height: '320px',
  },
  hotel_pather: {
    width: '100%',
    padding: '30px 0px',
  },
  hotels_head: {
    fontWeight: '800',
    textAlign: 'center',
    color: '#fff',
    fontSize: '50px',
  },
  TwinsedRevtangle: {
    width: '100%',
    float: 'left',
    padding: '15px',
    backgroundImage: 'url(/images/upcomingevents/eventsbanner.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderRadius: 5,
  },
  TwillighterImager: { width: '100%' },
  ExperienceHeaderPath: {
    width: '100%',
    float: 'left',
    position: 'relative',
    margin: 'auto 0px',
  },
  TwilightMusic: {
    color: '#fff',
    fontWeight: '600',
    fontSize: '30px',
    maxWidth: '25ch',
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px',
      marginTop: '30px',
    },
  },
  ratingProperty: {
    fontSize: '13px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
      marginTop: '10px',
    },
  },
  Springthispath: { padding: '5px 0px' },
  reviewedInformation: {
    color: '#fff',
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
    },
  },
  AttractionPoster: {
    position: 'absolute',
    top: '10px',
    listStyleType: 'none',
    right: '10px',
    color: '#fff',
  },
}));

const BannerEventRate = ({ eventData, ...props }) => {
  const classes = useStyles();
  const [starRating, setStarRating] = useState(4);
  return (
    <div>
      <section className={classes.Reactpath_continuse}>
        <Container maxWidth="md">
          <Box className={classes.TwinsedRevtangle}>
            <Row>
              <Column md={3} sm={3} lg={3} xs={3} padding={[0, 10]}>
                <Box className={classes.TwinlightMagicInform}>
                  <Image src="/images/upcomingevents/twilighter.jpg" className={classes.TwillighterImager} />
                </Box>
              </Column>
              <Column md={9} sm={9} lg={9} xs={9} margin={[10, 0]} padding={[10, 10]}>
                <Box className={classes.ExperienceHeaderPath}>
                  <Text component="h3" variant="h3" className={classes.TwilightMusic}>
                    {eventData['product-name']}
                  </Text>
                  {/* <Box className={classes.Springthispath}>
                    <Rating
                      name="simple-controlled"
                      value={starRating}
                      onChange={(event, newValue) => {
                        setStarRating(newValue);
                      }}
                      className={classes.ratingProperty}
                    />{" "}
                    <span className={classes.reviewedInformation}>
                      1234 reviews
                    </span>
                  </Box> */}
                  <Box className={styles.Nocanellation}>
                    <ul>
                      <li>
                        <FA name="comments-dollar" /> No Cancellation
                      </li>
                      <li>
                        <FA name="calendar-day" /> Open Date Ticket: 23-08-2021
                      </li>
                    </ul>
                  </Box>
                  <Box className={classes.AttractionPoster}>
                    <li>
                      {/* <a href="/"> Add to Bookmark</a> */}
                      <Button
                        style={{ fontSize: 11, color: '#fff' }}
                        onClick={() => addBookmark(window.location, eventData['product-name'] + '| Tripwerkz | Events')}
                        startIcon={<FA name="copy" />}>
                        Add to Bookmark
                      </Button>
                    </li>
                  </Box>
                </Box>
              </Column>
            </Row>
          </Box>
        </Container>
      </section>
    </div>
  );
};

export default BannerEventRate;
