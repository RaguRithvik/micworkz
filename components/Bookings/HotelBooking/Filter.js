import React, { useState, useEffect } from 'react';
import { Row, Column, Card, Text } from '../../../core';
import { FormControlLabel, Checkbox, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import { useStore } from '../../../helper/Store';

const useStyles = makeStyles((theme) => ({
  filterButton: {
    backgroundColor: 'black',
  },
  skelition: {
    width: '100%',
    height: 14,
  },
  ckeckBoxLabel: {
    fontStyle: 'bold',
    color: 'black',
  },
  optionLabel: {
    color: '#15830B',
    fontWeight: '700',
  },
  DesFilter: {
    padding: '10px 15px',
  },
}));

const HotelListSidebar = ({ loader }) => {
  const classes = useStyles();
  const [ammunitiesm, setAmmunities] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [priceIndex, setPriceIndex] = useState([]);
  const [starRating, setStarRating] = useState([]);
  const [shower, setShownow] = useState(false);

  const { filterItems: filtersList, setFilter } = useStore();


  useEffect(() => {
    let price_range = [];
    if (filtersList && filtersList.priceRanges && filtersList.priceRanges.from) {
      let inc = (filtersList.priceRanges.to - filtersList.priceRanges.from) / 8;
      for (let i = filtersList.priceRanges.from; i <= filtersList.priceRanges.to; i = i + inc) {
        price_range.push([
          parseInt(i),
          i + inc <= filtersList.priceRanges.to ? parseInt(i + inc) : parseInt(filtersList.priceRanges.to),
        ]);
      }
      setPriceRange(price_range);
    }
  }, [filtersList]);

  useEffect(() => {
    window.scrollTo({
      top: 10,
      behavior: 'smooth',
    });
    if (priceIndex != null || ammunitiesm.length > 0 || starRating.length) {
      setFilter({
        price_range: priceRange.map((val, index) => (priceIndex.includes(index) ? val : null)).filter((f) => f != null),
        starRating: starRating,
        ammunitiesm: ammunitiesm,
      });
    }
  }, [priceIndex, starRating, ammunitiesm]);

  function addToAmmunities(index) {
    let i = ammunitiesm.findIndex((f) => f == index);
    if (i > -1) {
      ammunitiesm[i] = null;
      setAmmunities(ammunitiesm.filter((f) => f != null));
    } else {
      setAmmunities([...ammunitiesm, index]);
    }
  }
  function selectPrices(index) {
    let i = priceIndex.findIndex((f) => f == index);
    if (i > -1) {
      priceIndex[i] = null;
      setPriceIndex(priceIndex.filter((f) => f != null));
    } else {
      setPriceIndex([...priceIndex, index]);
    }
  }

  function selectRating(index) {
    let i = starRating.findIndex((f) => f == index);
    if (i > -1) {
      starRating[i] = null;
      setStarRating(starRating.filter((f) => f != null));
    } else {
      setStarRating([...starRating, index]);
    }
  }

  return priceRange.length > 0 || (filtersList && (filtersList.starRatings || filtersList.ammenities)) ? (
    <div className={classes.filterWrapper}>
      <div className={classes.DesFilter}>
        <Box className={classes.Sidebarbox}>
          {filtersList &&
            filtersList.ammenities &&
            filtersList.ammenities.filter((f) => f['amenity-name'].toLowerCase().includes('covid')).length > 0 && (
              <Box className={classes.safety_first}>
                <img src="/images/icons_new/corona.png" style={{ width: '23px', padding: '5px 5px 0px 0px' }} />{' '}
                <Text variant="span">Safety First</Text>
                <Box className={classes.safety_handwash}>
                  <img src="/images/icons_new/hand_wash.png" style={{ width: '20px' }} />
                </Box>
              </Box>
            )}
          {filtersList &&
            filtersList.ammenities &&
            filtersList.ammenities
              .filter((f) => f['amenity-name'].toLowerCase().includes('covid'))
              .map((amenity, index) => (
                <Box className={classes.safety_first} key={'covid_19_' + index}>
                  <Checkbox
                    size="small"
                    color="primary"
                    inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                    checked={ammunitiesm.includes(amenity['amenity-name'])}
                    onChange={(e) => addToAmmunities(amenity['amenity-name'])}
                  />
                  <Text
                    variant="p"
                    style={{
                      color: '#878787',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>
                    {amenity['amenity-name']}
                  </Text>
                  <Box className={classes.safety_handwash}></Box>
                </Box>
              ))}
          {priceRange.length > 0 && (
            <Box className={classes.ratingproduct}>
              <Text variant="h3" className={classes.hotelfirst}>
                Hotel's Price
              </Text>
            </Box>
          )}
          {priceRange.map((value, index) => (
            <Box className={classes.safety_first} key={'price_' + index}>
              <Checkbox
                size="small"
                color="primary"
                inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                checked={priceIndex.includes(index)}
                onChange={(e) => selectPrices(index)}
              />
              <Text
                variant="p"
                style={{
                  color: '#878787',
                  fontSize: '12px',
                  fontWeight: '400',
                }}>
                {value.length > 1 ? value[0] + ' - ' + value[1] : value[0]}
              </Text>
              <Box className={classes.safety_handwash}></Box>
            </Box>
          ))}

          {filtersList &&
            filtersList.starRatings &&
            filtersList.starRatings.filter((f) => f['category-name'] != '').length > 0 && (
              <Box className={classes.ratingproduct}>
                <Text variant="h3" className={classes.hotelfirst}>
                  {'Hotel Ratings'}
                </Text>
              </Box>
            )}
          {filtersList &&
            filtersList.starRatings &&
            filtersList.starRatings.filter((f) => f['category-name'] != '').length > 0 &&
            filtersList.starRatings.map((value, index) => (
              <Box className={classes.ratingproduct} key={'rating_' + index}>
                {value['category-name'] != '0 STAR' ? (
                  <Box className={classes.safety_first}>
                    <Checkbox
                      size="small"
                      color="primary"
                      inputProps={{ 'aria-label': value['category-name'] }}
                      checked={starRating.includes(value['category-name'])}
                      onChange={() => selectRating(value['category-name'])}
                    />
                    <Text
                      variant="p"
                      style={{
                        color: '#878787',
                        fontSize: '12px',
                        fontWeight: '400',
                      }}>
                      {value['category-name']}
                    </Text>
                    <Box className={classes.safety_handwash}></Box>
                  </Box>
                ) : null}
              </Box>
            ))}
          {filtersList && filtersList.ammenities && filtersList.ammenities.length && (
            <Box className={classes.ratingproduct}>
              <Text variant="h3" className={classes.hotelfirst}>
                {'Amenities'}
              </Text>
            </Box>
          )}
          {filtersList &&
            filtersList.ammenities &&
            filtersList.ammenities
              .filter((_, index) => (shower ? index >= 0 : index < 7))
              .map((amenity, index) => (
                <Box className={classes.ratingproduct} key={'amenity_' + index}>
                  <Box className={classes.safety_first}>
                    <Checkbox
                      size="small"
                      color="primary"
                      inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
                      checked={ammunitiesm.includes(amenity['amenity-name'])}
                      onChange={(e) => addToAmmunities(amenity['amenity-name'])}
                    />
                    <Text
                      variant="p"
                      style={{
                        color: '#878787',
                        fontSize: '12px',
                        fontWeight: '400',
                      }}>
                      {amenity['amenity-name']}
                    </Text>
                    <Box className={classes.safety_handwash}></Box>
                  </Box>
                </Box>
              ))}
          {
            <p
              onClick={() => setShownow(!shower)}
              style={{
                color: '#287cbc',
                fontSize: '10px',
                fontWeight: '600',
                padding: '5px 15px',
              }}>
              {shower ? 'Hide ' : 'Show More'}
            </p>
          }
        </Box>
      </div>
    </div>
  ) : (
    <SkelitonContainer classes={classes} loader={loader} />
  );
};

export default HotelListSidebar;

const SkelitonContainer = ({ classes }) => {
  return (
    <Card>
      <Row padding={[10]}>
        <Column padding={[5]}>
          <Skeleton variant="rect" className={classes.skelition} />
        </Column>
        <Column padding={[5]}>
          {[1, 2, 3, 4, 5].map((value, index) => (
            <Row padding={[5]} key={'Pricce_range_' + index}>
              <Column md={1} xs={1} sm={1} padding={[2]}>
                <Skeleton variant="rect" className={classes.skelition} />
              </Column>
              <Column md={11} xs={11} sm={11} padding={[2]}>
                <Skeleton variant="rect" className={classes.skelition} />
              </Column>
            </Row>
          ))}
        </Column>
        <Column padding={[5]}>
          <Skeleton variant="rect" className={classes.skelition} />
        </Column>
        <Column padding={[5]}>
          {[1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5].map((value, index) => (
            <Row padding={[5]} key={'ammunity_' + index}>
              <Column md={1} xs={1} sm={1} padding={[2]}>
                <Skeleton variant="rect" className={classes.skelition} />
              </Column>
              <Column md={11} xs={11} sm={11} padding={[2]}>
                <Skeleton variant="rect" className={classes.skelition} />
              </Column>
            </Row>
          ))}
        </Column>
      </Row>
    </Card>
  );
};
