import React, { useState, useEffect, useRef } from 'react';
import { ListItem, fade, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Row, Column, Text, Card, Touchable, CustomTooltip } from '../../../core';
import { useRouter } from 'next/router';
import { constants } from '../../../helper/constants';
import { httpPostRequest } from '../../../helper/JsHelper';
import { getEventsList } from '../../../helper/RequestPayLoadBookings';
import Events from './Events';
import EventSkeleton from './EventSkeleton';
import { Star } from '@material-ui/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import Error from '../../Error';
import Filter from './Filter';
import { FilterList } from '@material-ui/icons';
import useOutsideClick from '../../../Core/OutsideClickListener';
import { useStore } from '../../../helper/Store';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  filterButton: {
    backgroundColor: theme.palette.primary.main,
    position: 'fixed',
    bottom: 60,
    right: 60,
    zIndex: 2,
    size: 23,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  filterIcon: {
    color: 'white',
  },
  filterToolPick: {
    width: 300,
    zIndex: 200,
    overflowY: 'scroll',
    maxHeight: '80vh',
    [theme.breakpoints.up('md')]: {
      width: 275,
    },
    [theme.breakpoints.up('xs')]: {
      width: 275,
    },
    [theme.breakpoints.down('sm')]: {
      width: 220,
    },
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
  fab: {
    position: 'absolute',
    zIndex: 1000,
    top: 100,
    right: 70,
    height: 55,
    borderRadius: 30,
    [theme.breakpoints.down('sm')]: {
      top: 270,
      right: 20,
    },
  },
  filterWidth: {
    minWidth: 400,
    maxWidth: 450,
    [theme.breakpoints.down('sm')]: {
      minWidth: 200,
      maxWidth: 350,
    },
  },
}));

export default function SearchEvents() {
  const ref = useRef();
  const classes = useStyles();
  const { query } = useRouter();
  const [eventItems, setEventItems] = useState([]);
  const [auditData, setAuditData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [demandLoader, setDemandLoader] = useState(false);
  const [viewing_item_count, setViewingItem] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currency, setCurrency] = useState('');
  const [Start, setStart] = useState(1);
  const [End, setEnd] = useState(30);
  const [totalRecords, setTotalRecords] = useState(100);
  const { setFilterItems, setFilter, filter } = useStore();
  function des(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }

  const getEvents = async () => {
    setLoader(true);
    if (query && query.hasOwnProperty('pkey')) {
      const req = getEventsList(query, Start, End);
      const res = await httpPostRequest(req);
      if (
        res &&
        res[constants.DATA_EXCEPTION] &&
        res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200 &&
        res[constants.DATA]
      ) {
        setAuditData(res[constants.DATA]['audit-data']);
        setEventItems(res[constants.DATA]['products']);
        setTotalRecords(parseInt(res[constants.DATA]['audit-data']['no-of-hotels-found']));
        // let ammenities = [];
        // let sortStar = [];
        // let starRatings = [];
        // if (res[constants.DATA]['products']) {
        //   res[constants.DATA]['products'].forEach((val) => {
        //     if (val['hotel-amenity']) {
        //       val['hotel-amenity'].forEach((value) => {
        //         if (ammenities.filter((f) => f['amenity-name'] == value['amenity-name']).length == 0) {
        //           ammenities.push(value);
        //         }
        //       });
        //     }
        //     if (val['hotel-category']) {
        //       if (sortStar.filter((f) => f['category-name'] == val['hotel-category']['category-name']).length == 0) {
        //         sortStar.push(val['hotel-category']);
        //       }
        //     }
        //   });
        // }
        // starRatings = sortStar.sort((a, b) => des(a['category-name'], b['category-name']));
        // setFilterItems({
        //   ammenities,
        //   starRatings,
        //   priceRanges: { from: 0, to: 0 },
        // });
        setLoader(false);
        setCurrency(res[constants.DATA]['currency-code'] ? res[constants.DATA]['currency-code'] : 'SGD');
        // setFilter({});
        setLoader(false);
      } else {
        setLoader(404);
      }
    } else {
      setLoader('PLS_SEARCH');
      // setFilter({});
    }
  };

  useEffect(() => {
    getEvents();
  }, [query]);

  const fetchMoreData = () => {
    setDemandLoader(true);
    setViewingItem(viewing_item_count + 10 <= eventItems.length ? viewing_item_count + 10 : eventItems.length);
    setDemandLoader(false);
  };

  const filterHotel = (value) => {
    const checkAmmunityExist = (v) => {
      if (filter && filter.ammunitiesm && filter.ammunitiesm.length) {
        for (let obj of filter.ammunitiesm) {
          if (v.includes(obj)) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    };
    const ratingFilter = (v) => {
      if (filter && filter.starRating && filter.starRating.length > 0) {
        return filter.starRating.map((c) => c == v).filter((f) => f).length > 0;
      }
      return true;
    };
    const priceFilter = (f) => {
      if (filter && filter.price_range && filter.price_range.length) {
        console.log(
          filter.price_range
            .map((c) => (c.length == 2 ? f >= c[0] && f <= c[1] : f <= c[0] && f >= c[0] - 100))
            .filter((l) => l).length > 0,
        );
        return (
          filter.price_range
            .map((c) => (c.length == 2 ? f >= c[0] && f <= c[1] : f <= c[0] && f >= c[0] - 100))
            .filter((l) => l).length > 0
        );
      }
      return true;
    };

    value = value.filter(
      (v) =>
        ratingFilter(v.hotelCategoryGroup?.hotelCategoryGroupId) &&
        checkAmmunityExist(v['hotel-amenity'].map((vl, index) => index)) &&
        priceFilter(v.rate['net-rate']),
    );
    return value;
  };

  useOutsideClick(ref, () => {
    setFilterOpen(false);
  });

  return (
    <div className={classes.root}>
      {/* {eventItems.length ? (
        <div ref={ref}>
          <IconButton
            variant="contained"
            color="primary"
            className={classes.filterButton}
            onClick={() => setFilterOpen(true)}>
            <FilterList className={classes.filterIcon} />
          </IconButton>
          <Row>
            <Column md={9} xs={5} sm={5}></Column>
            <Column md={3} xs={7} sm={7}>
              <CustomTooltip open={filterOpen} onClose={() => setFilterOpen(false)} className={classes.filterToolPick}>
                <Filter currency={currency} />
              </CustomTooltip>
            </Column>
          </Row>
        </div>
      ) : null} */}
      {!loader ? (
        <Card>
          {eventItems.length ? (
            <InfiniteScroll
              dataLength={eventItems.length}
              next={fetchMoreData}
              hasMore={eventItems.length > viewing_item_count}
              loader={demandLoader ? <SkeletonContainer classes={classes} /> : <p></p>}
              style={{ overflow: 'hidden' }}>
              {eventItems.map((data, index) => (
                <ListItem component="div" className={classes.newsListRoot} key={'event_list' + index}>
                  <Events
                    data={data}
                    setEventItems={setEventItems}
                    startCount={Start}
                    endCount={End}
                    query={query}
                    auditData={auditData}
                    totalRecords={totalRecords}
                  />
                </ListItem>
              ))}
            </InfiniteScroll>
          ) : query && query.cin ? (
            <Card padding={[20, 10]} center middle>
              <Text center>{'No hotels found. '}</Text>
            </Card>
          ) : null}
        </Card>
      ) : [404, 'PLS_SEARCH'].includes(loader) ? (
        <Error search={loader != 404} />
      ) : (
        <SkeletonContainer classes={classes} />
      )}
    </div>
  );
}

const Stars = ({ value, onChange }) => {
  return (
    <Row>
      {[1, 2, 3, 4, 5].map((val, index) => (
        <Touchable onClick={() => onChange(val)}>
          {
            <Star
              style={{ borderColor: '#003399', color: val <= value ? '#003399' : '#D3D3D3', fontSize: 35, marginLeft: 2 }}
            />
          }
        </Touchable>
      ))}
    </Row>
  );
};

const SkeletonContainer = ({ classes }) => {
  return (
    <Card>
      {[1, 2, 3, 4].map((val, index) => (
        <ListItem component="div" className={classes.newsListRoot} key={'skelton_hotel_list' + index}>
          <EventSkeleton />
        </ListItem>
      ))}
    </Card>
  );
};
