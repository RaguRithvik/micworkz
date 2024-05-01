import { constants, baseUrl, b2cBaseUrl, MAPBOX_TOKEN } from './constants';
const autoComplete = (value) => {
  return {
    url: b2cBaseUrl + 'hotel/hotel-auto-complete',
    pay_load: {
      [constants.SEARCH_KEY]: value,
    },
    skip_headers: ['AuthorizationKey'],
  };
};
const getHotelsList = (query, start, end) => {
  return {
    url: b2cBaseUrl + 'hotel/get-hotels-list/',
    pay_load: {
      'display-length': end,
      'display-start': start,
      'checkin-date': query['ci'],
      'checkout-date': query['co'],
      'search-key': query['cg'] == 'City' ? query['cid'] : query['hid'],
      'room-info': query['rd'],
      language: 'en-US',
      'currency-code': 'SGD',
    },
    skip_headers: ['AuthorizationKey'],
  };
};

const getRoomListByHotel = (query) => {
  return {
    url: b2cBaseUrl + 'hotel/get-room-list-by-hotel/',
    pay_load: {
      'checkin-date': query['ci'],
      'checkout-date': query['co'],
      'room-info': query['rd'],
      'search-key': query.hotelKey,
      language: 'en-US',
    },
    skip_headers: ['AuthorizationKey'],
  };
};
const getReCheckRate = (query) => {
  return {
    url: b2cBaseUrl + 'hotel/get-book-prepare-by-hotel',
    pay_load: {
      [constants.SESSION_ID]: '',
      'checkin-date': query.ci,
      'checkout-date': query.co,
      'room-info': query.rd,
      [constants.HOTEL_KEY]: query[constants.HOTEL_KEY],
      [constants.rate_KEY]: query[constants.RATE_KEY],
      language: 'en-US',
    },
    skip_headers: ['AuthorizationKey'],
  };
};
const createBooking = (GUEST_ONFO, data, payvendorid, query) => {
  return {
    url: b2cBaseUrl + 'booking/create-booking/',
    pay_load: {
      hotelId: data.hotel.hotelId,
      [constants.HOTEL_KEY]: decodeURI(query.hotelKey),
      [constants.PRODUCT_PROVIDER_TYPE_ID]: data.hotel.productProviderTypeId,
      [constants.CLIENT_ID]: 4,
      [constants.PAY_VENDOR_ID]: payvendorid,
      'room-info': query['rd'],
      [constants.room_ID]: data.hotel.rooms.roomId,
      [constants.room_CODE]: data.hotel.rooms.roomCode,
      [constants.check_in_date]: query.ci,
      [constants.check_out_date]: query.co,
      [constants.HOTEL_NAME]: data.hotel.hotelName,
      roomname: data.hotel.rooms.roomCode,
      [constants.IMAGE_URL]: data.hotel.rooms.images.baseUrl.lg + data.hotel.rooms.images.featureImageUrl,
      [constants.rate_KEY]: data.hotel.rooms.rates.rateKey,
      [constants.GUEST_ONFO]: GUEST_ONFO,
    },
    skip_headers: ['AuthorizationKey'],
  };
};
const getEventsAutoComplete = (value) => {
  return {
    url: b2cBaseUrl + 'event/event-auto-complete',
    pay_load: {
      [constants.SEARCH_KEY]: value,
    },
    skip_headers: ['AuthorizationKey'],
  };
};
const getEventsList = (query, start, end) => {
  return {
    url: b2cBaseUrl + 'event/get-events-list',
    pay_load: {
      'display-length': end,
      'display-start': start,
      'search-key': query['cid'],
      language: 'en-US',
      'currency-code': 'SGD',
    },
    skip_headers: ['AuthorizationKey'],
  };
};
const getEventsDetails = (query, start, end) => {
  return {
    url: b2cBaseUrl + 'event/get-event-details',
    pay_load: {
      'display-length': end,
      'display-start': start,
      'search-key': query['pkey'],
      'currency-code': 'SGD',
    },
    skip_headers: ['AuthorizationKey'],
  };
};
const getEventPackageDetails = (data, PAX_LIST) => {
  return {
    url: b2cBaseUrl + 'event/get-package-details',
    pay_load: {
      'product-key': data['pkey'],
      'package-key': data['packey'],
      'currency-code': 'SGD',
      'pax-list': PAX_LIST,
    },
    skip_headers: ['AuthorizationKey'],
  };
};
const getBookPrepareEvent = (query) => {
  return {
    url: b2cBaseUrl + 'event/get-book-prepare-by-event',
    pay_load: {
      'event-rate-key': query['event_rate'],
      'total-rate': parseFloat(query['total_rate']),
      'currency-code': query['curr'],
    },
    skip_headers: ['AuthorizationKey'],
  };
};
const createEventBooking = (data, paymentProvider, GUEST_ONFO, CONTACT_DETAILS, query) => {
  return {
    url: b2cBaseUrl + 'booking/event-create-booking',
    pay_load: {
      'package-key': query.packey,
      'rate-key': query.event_rate,
      'pay-vendor-id': paymentProvider,
      'currency-code': data['currency'],
      'total-rate': data['total-rate'],
      'product-name': data['product-name'],
      'package-name': data['package-name'],
      'image-url': data['image-url'],
      'guest-Info': GUEST_ONFO,
      'contact-person-detail': CONTACT_DETAILS,
    },
    skip_headers: ['AuthorizationKey'],
  };
};
export {
  autoComplete,
  getHotelsList,
  getRoomListByHotel,
  getReCheckRate,
  createBooking,
  //b2c events
  getEventsAutoComplete,
  getEventsList,
  getEventsDetails,
  getEventPackageDetails,
  getBookPrepareEvent,
  createEventBooking,
};
