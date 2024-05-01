import { constants, newConstants, baseUrl, newBaseUrl, MAPBOX_TOKEN } from './constants';

const b2bClientPagesGetAll = (lang = "en-US") => {
    return {
        url: newBaseUrl + 'b2b/client-pages/get-all',
        [constants.HEADERS]: {
            [newConstants.ACCEPT_LANGUAGE]: lang,
            "Accept": 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'api-key': process.env.NEXT_PUBLIC_API_KEY,
        }
    }
}

const b2bClientPagesApprovedGetAll = (lang = "en-US") => {
    return {
        url: newBaseUrl + 'b2b/client-pages/approved-get-all',
        [constants.HEADERS]: {
            [newConstants.ACCEPT_LANGUAGE]: lang,
            "Accept": 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'api-key': process.env.NEXT_PUBLIC_API_KEY,
            'formname': 'Dashboard'
        }
    }
}

const getHotelsList = (query) => {
    return {
        url: newBaseUrl + 'hotel/get-hotels-list/',
        pay_load: {
            [constants.CHECK_IN_DATE]: query['ci'],
            [constants.CHECK_OUT_DATE]: query['co'],
            [query['cg'] == 'City' ? constants.CITY_ID : constants.HOTEL_ID]: query['cg'] == 'City' ? query['cid'] : query['hid'],
            [constants.ROOM_INFO]: query['rd'],
            language: 'en-US',
        },
        skip_headers: ['AuthorizationKey'],
    };
};

const autoComplete = (value) => {
    return {
        url: newBaseUrl + 'hotel/hotel-auto-complete',
        pay_load: {
            [newConstants.SEARCH_KEYWORD]: value,
        },
        skip_headers: ['AuthorizationKey'],
    };
};
const getRoomListByHotel = (query) => {
    return {
        url: newBaseUrl + 'hotel/get-room-list-by-hotel/',
        pay_load: {
            [constants.CHECK_IN_DATE]: query['ci'],
            [constants.CHECK_OUT_DATE]: query['co'],
            [constants.ROOM_INFO]: query['rd'],
            [constants.HOTEL_KEY]: (query.hotelKey),
            language: 'en-US',
        },
        skip_headers: ['AuthorizationKey'],
    };
};

const getReCheckRate = (query) => {
    return {
        url: newBaseUrl + 'hotel/get-book-prepare-by-hotel',
        pay_load: {
            [constants.SESSION_ID]: '',
            [constants.CHECK_IN_DATE]: query.ci,
            [constants.CHECK_OUT_DATE]: query.co,
            [constants.ROOM_INFO]: query.rd,
            [constants.HOTEL_KEY]: (query[constants.HOTEL_KEY]),
            [constants.rate_KEY]: (query[constants.RATE_KEY]),
            language: 'en-US',
        },
        skip_headers: ['AuthorizationKey'],
    };
};

const getCountryList = () => {
    return {
        url: baseUrl + 'hotel/get-country-list',
    };
};

const createBooking = (GUEST_ONFO, data, payvendorid, query) => {
    return {
        url: baseUrl + 'hotel/create-booking',
        pay_load: {
            [constants.HOTEL_ID]: data.hotel.hotelId,
            [constants.HOTEL_KEY]: (query.hotelKey),
            [constants.PRODUCT_PROVIDER_TYPE_ID]: data.hotel.productProviderTypeId,
            [constants.CLIENT_ID]: 4,
            [constants.PAY_VENDOR_ID]: payvendorid,
            [constants.room_ID]: parseInt(data.hotel.rooms.roomId),
            [constants.room_CODE]: data.hotel.rooms.roomCode,
            [constants.check_in_date]: query.ci,
            [constants.check_out_date]: query.co,
            [constants.HOTEL_NAME]: data.hotel.hotelName,
            [constants.ROOM_NAME]: data.hotel.rooms.roomCode,
            [constants.IMAGE_URL]: data.hotel.rooms.images.baseUrl.lg + data.hotel.rooms.images.featureImageUrl,
            [constants.rate_KEY]: data.hotel.rooms.rates.rateKey,
            [constants.GUEST_ONFO]: GUEST_ONFO,
        },
        skip_headers: ['AuthorizationKey'],
    };
};

// Hotel category 
const getAllHotelCategory = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-category/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
};


const createHotelCategory = (localFields, multi_language) => {
    let hotelCategoryLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][constants.VALUE] != '' ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.HOTEL_CATEGORY_NAME]: value[newConstants.HOTEL_CATEGORY_NAME][newConstants.VALUE],
        } :
            null;
    });

    return {
        url: newBaseUrl + 'hotel-category/save',
        pay_load: {
            [newConstants.HOTEL_CATEGORY_NAME]: localFields[newConstants.HOTEL_CATEGORY_NAME][newConstants.VALUE],
            [newConstants.HOTEL_CATEGORY_GLYP_CSS]: localFields[newConstants.HOTEL_CATEGORY_GLYP_CSS][newConstants.VALUE],
            [newConstants.HOTEL_TYPE_KEY]: localFields[newConstants.HOTEL_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_CATEGORY_LANGUAGES]: hotelCategoryLangPack.filter((f) => f != null),
        },
    };
};
const editHotelCategory = (id, localFields, multi_language) => {
    let hotelCategoryLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][constants.VALUE] != '' ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.HOTEL_CATEGORY_NAME]: value[newConstants.HOTEL_CATEGORY_NAME][newConstants.VALUE],
        } :
            null;
    });

    return {
        url: newBaseUrl + 'hotel-category/update',
        pay_load: {
            [newConstants.HOTEL_CATEGORY_KEY]: id,
            [newConstants.HOTEL_CATEGORY_NAME]: localFields[newConstants.HOTEL_CATEGORY_NAME][newConstants.VALUE],
            [newConstants.HOTEL_CATEGORY_GLYP_CSS]: localFields[newConstants.HOTEL_CATEGORY_GLYP_CSS][newConstants.VALUE],
            [newConstants.HOTEL_TYPE_KEY]: localFields[newConstants.HOTEL_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_CATEGORY_LANGUAGES]: hotelCategoryLangPack.filter((f) => f != null),
        },
    };
};
const deleteHotelCategory = (id) => {
    return {
        url: newBaseUrl + 'hotel-category/Delete',
        pay_load: {
            [newConstants.HOTEL_CATEGORY_KEY]: id,
        },
    };
};
const getHotelCategoryInfoById = (id) => {
    return {
        url: newBaseUrl + 'hotel-category/get-by-key',
        pay_load: {
            [newConstants.HOTEL_CATEGORY_KEY]: id,
        },
    };
};


const getHotelTypeY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-type/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};


const createHotelType = (localFields) => {
    return {
        url: newBaseUrl + 'hotel-type/save',
        pay_load: {
            [newConstants.HOTEL_TYPE_DESC]: localFields[newConstants.HOTEL_TYPE_DESC][newConstants.VALUE],
            ["hotel-type-languages"]: [],
        },
    };
}

// Hotel tag 
const getAllHotelTag = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-tag/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
};


const getHotelTagByKey = (key) => {
    return {
        url: newBaseUrl + 'hotel-tag/get-by-key',
        pay_load: {
            [newConstants.HOTEL_TAG_KEY]: key,
        },
    };
};


const deleteHotelTag = (key) => {
    return {
        url: newBaseUrl + 'hotel-tag/Delete',
        pay_load: {
            [newConstants.HOTEL_TAG_KEY]: key,
        },
    };
};


const createHotelTag = (localFields, multi_language) => {
    let hotelTagLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.HOTEL_TAG_NAME]: value[newConstants.HOTEL_TAG_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'hotel-tag/save',
        pay_load: {
            [newConstants.HOTEL_TAG_NAME]: localFields[newConstants.HOTEL_TAG_NAME][newConstants.VALUE],
            [newConstants.HOTEL_TAG_LANGUAGES]: hotelTagLangPacks.filter((f) => f != null),
        },
    };
};


const updateHotelTag = (key, localFields, multi_language) => {
    let hotelTagLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.HOTEL_TAG_NAME]: value[newConstants.HOTEL_TAG_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'hotel-tag/update',
        pay_load: {
            [newConstants.HOTEL_TAG_KEY]: key,
            [newConstants.HOTEL_TAG_NAME]: localFields[newConstants.HOTEL_TAG_NAME][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.HOTEL_TAG_LANGUAGES]: hotelTagLangPacks.filter((f) => f != null),
        },
    };
};


// Hotel image type
const getAllHotelImageType = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-image-type/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
};


const getHotelImageTypeByKey = (key) => {
    return {
        url: newBaseUrl + 'hotel-image-type/get-by-key',
        pay_load: {
            [newConstants.HOTEL_IMAGE_TYPE_KEY]: key,
        },
    };
};
const deleteHotelImageType = (key) => {
    return {
        url: newBaseUrl + 'hotel-image-type/Delete',
        pay_load: {
            [newConstants.HOTEL_IMAGE_TYPE_KEY]: key,
        },
    };
};
const updateHotelImageType = (key, localFields, multi_language) => {
    let hotelImageLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.HOTEL_IMAGE_TYPE_DESC]: value[newConstants.HOTEL_IMAGE_TYPE_DESC][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'hotel-image-type/update',
        pay_load: {
            [newConstants.HOTEL_IMAGE_TYPE_KEY]: key,
            [newConstants.HOTEL_IMAGE_TYPE_DESC]: localFields[newConstants.HOTEL_IMAGE_TYPE_DESC][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON]: localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON][newConstants.VALUE],
            [newConstants.HOTEL_IMAGE_TYPE_LANGUAGES]: hotelImageLangPacks.filter((f) => f != null),
        },
    };
};
const createHotelImageType = (localFields, multi_language) => {
    let hotelImageLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.HOTEL_IMAGE_TYPE_DESC]: value[newConstants.HOTEL_IMAGE_TYPE_DESC][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'hotel-image-type/save',
        pay_load: {
            [newConstants.HOTEL_IMAGE_TYPE_DESC]: localFields[newConstants.HOTEL_IMAGE_TYPE_DESC][newConstants.VALUE],
            [newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON]: localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON][newConstants.VALUE],
            [newConstants.HOTEL_IMAGE_TYPE_LANGUAGES]: hotelImageLangPacks.filter((f) => f != null),
        },
    };
};

// Hotel issue 
const getAllHotelIssues = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-issues/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
};


const createHotelIssues = (masterHotelIssues, masterHotelIssuesLangPacks) => {
    let hotelIssuesLangPacks = masterHotelIssuesLangPacks.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.HOTEL_ISSUES_TITLE]: value[newConstants.HOTEL_ISSUES_TITLE][newConstants.VALUE],
            [newConstants.HOTEL_ISSUES_DESC]: value[newConstants.HOTEL_ISSUES_DESC][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'hotel-issues/save',
        pay_load: {
            [newConstants.HOTEL_ISSUES_TITLE]: masterHotelIssues[newConstants.HOTEL_ISSUES_TITLE][newConstants.VALUE],
            [newConstants.HOTEL_ISSUES_DESC]: masterHotelIssues[newConstants.HOTEL_ISSUES_DESC][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: masterHotelIssues[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.HOTEL_ISSUES_LANGUAGES]: hotelIssuesLangPacks.filter((f) => f != null),
        },
    };
};
const updateHotelIssues = (key, masterHotelIssues, masterHotelIssuesLangPacks) => {
    let hotelIssuesLangPacks = masterHotelIssuesLangPacks.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.HOTEL_ISSUES_TITLE]: value[newConstants.HOTEL_ISSUES_TITLE][newConstants.VALUE],
            [newConstants.HOTEL_ISSUES_DESC]: value[newConstants.HOTEL_ISSUES_DESC][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'hotel-issues/update',
        pay_load: {
            [newConstants.HOTEL_ISSUES_KEY]: key,
            [newConstants.HOTEL_ISSUES_TITLE]: masterHotelIssues[newConstants.HOTEL_ISSUES_TITLE][newConstants.VALUE],
            [newConstants.HOTEL_ISSUES_DESC]: masterHotelIssues[newConstants.HOTEL_ISSUES_DESC][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: masterHotelIssues[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.HOTEL_ISSUES_LANGUAGES]: hotelIssuesLangPacks.filter((f) => f != null),
        },
    };
};
const deleteHotelIssues = (key) => {
    return {
        url: newBaseUrl + 'hotel-issues/Delete',
        pay_load: {
            [newConstants.HOTEL_ISSUES_KEY]: key,
        },
    };
};
const getHotelIssuesByKey = (key) => {
    return {
        url: newBaseUrl + 'hotel-issues/get-by-key',
        pay_load: {
            [newConstants.HOTEL_ISSUES_KEY]: key,
        },
    };
};


// Hotel room link 
const getAllRoomsY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'room/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};


const hotelMasterGetY = (search_key = '', start = 1, length = 25) => {
    return {
        url: newBaseUrl + 'hotel-master/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            ["is-active"]: "Y"
        },
    };
};


const hotelMasterGetId = (key) => {
    return {
        url: newBaseUrl + 'hotel-master/get-by-key',
        pay_load: {
            [newConstants.HOTEL_KEY]: key,
        },
    };
};


const getAllAmmunityY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-amentiy/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};


const getAllHotelImageTypeY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-image-type/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};

const getAllHotelRoomLink = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-room-link/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
};

const getHotelRoomLinkByKey = (hotelKey, roomKey) => {
    return {
        url: newBaseUrl + 'hotel-room-link/get-by-key',
        pay_load: {
            [newConstants.HOTEL_KEY]: hotelKey,
            [newConstants.ROOM_KEY]: roomKey,
        },
    };
};
const deleteHotelRoomLink = (hotelKey, roomKey) => {
    return {
        url: newBaseUrl + 'hotel-room-link/delete',
        pay_load: {
            [newConstants.HOTEL_KEY]: hotelKey,
            [newConstants.ROOM_KEY]: roomKey,
        },
    };
};

const createHotelRoomLink = (localFields, generate, rightAmen, multi_images) => {

    return {
        url: newBaseUrl + 'hotel-room-link/save',
        pay_load: {
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.ROOM_ALLOTMENT]: parseInt(localFields[newConstants.ROOM_ALLOTMENT][newConstants.VALUE]),
            [newConstants.ROOM_MIN_PAX]: parseInt(generate[newConstants.ROOM_MIN_PAX][newConstants.VALUE]),
            [newConstants.ROOM_MAX_PAX]: parseInt(generate[newConstants.ROOM_MAX_PAX][newConstants.VALUE]),
            [newConstants.ROOM_MIN_ADULTS]: parseInt(generate[newConstants.ROOM_MIN_ADULTS][newConstants.VALUE]),
            [newConstants.ROOM_MAX_ADULTS]: parseInt(generate[newConstants.ROOM_MAX_ADULTS][newConstants.VALUE]),
            [newConstants.ROOM_MAX_CHILDS]: parseInt(generate[newConstants.ROOM_MAX_CHILDS][newConstants.VALUE]),
            [newConstants.CHILD_AGE_LIMIT]: parseInt(localFields[newConstants.CHILD_AGE_LIMIT][newConstants.VALUE]),
            [newConstants.IS_CHILD_ALLOWED]: localFields[newConstants.IS_CHILD_ALLOWED][newConstants.VALUE],
            [newConstants.HOTEL_ROOM_AMENITY_LINKS]: rightAmen.map((value) => ({
                [newConstants.HOTEL_AMENITY_KEY]: value[newConstants.HOTEL_AMENITY_KEY],
                [newConstants.HOTEL_ROOM_AMENITY_NAME]: value[newConstants.HOTEL_ROOM_AMENITY_NAME],
                [newConstants.IS_SHOW]: true,
            })),
            [newConstants.HOTEL_ROOM_IMAGE_PATH_LINKS]: multi_images.map((value) => ({
                [newConstants.HOTEL_IMAGE_TYPE_KEY]: value.image_type_key,
                [newConstants.HOTEL_IMAGE_PATH_KEY]: value.value,
            })),
        },
    };
};

const updateHotelRoomLink = (localFields, generate, rightAmen, multi_images) => {

    return {
        url: newBaseUrl + 'hotel-room-link/update',
        pay_load: {
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.ROOM_ALLOTMENT]: parseInt(localFields[newConstants.ROOM_ALLOTMENT][newConstants.VALUE]),
            [newConstants.ROOM_MIN_PAX]: parseInt(generate[newConstants.ROOM_MIN_PAX][newConstants.VALUE]),
            [newConstants.ROOM_MAX_PAX]: parseInt(generate[newConstants.ROOM_MAX_PAX][newConstants.VALUE]),
            [newConstants.ROOM_MIN_ADULTS]: parseInt(generate[newConstants.ROOM_MIN_ADULTS][newConstants.VALUE]),
            [newConstants.ROOM_MAX_ADULTS]: parseInt(generate[newConstants.ROOM_MAX_ADULTS][newConstants.VALUE]),
            [newConstants.ROOM_MAX_CHILDS]: parseInt(generate[newConstants.ROOM_MAX_CHILDS][newConstants.VALUE]),
            [newConstants.CHILD_AGE_LIMIT]: parseInt(localFields[newConstants.CHILD_AGE_LIMIT][newConstants.VALUE]),
            [newConstants.IS_CHILD_ALLOWED]: localFields[newConstants.IS_CHILD_ALLOWED][newConstants.VALUE],
            [newConstants.HOTEL_ROOM_AMENITY_LINKS]: rightAmen.map((value) => ({
                [newConstants.HOTEL_AMENITY_KEY]: value[newConstants.HOTEL_AMENITY_KEY],
                [newConstants.HOTEL_ROOM_AMENITY_NAME]: value[newConstants.HOTEL_ROOM_AMENITY_NAME],
                [newConstants.IS_SHOW]: true,
            })),
            [newConstants.HOTEL_ROOM_IMAGE_PATH_LINKS]: multi_images.map((value) => ({
                [newConstants.HOTEL_IMAGE_TYPE_KEY]: value.image_type_key,
                [newConstants.HOTEL_IMAGE_PATH_KEY]: value.value,
                [newConstants.IMAGE_PATH]:value.url
            })),
        },
    };
};


const GetRoomByHotelKey = (id) => {
    return {
        url: newBaseUrl + 'hotel-room-link/get-rooms-by-hotel-key',
        pay_load: {
            [newConstants.HOTEL_KEY]: id,
        },
    };
};


// Hotel master
const getAllHotelCategoryY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-category/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};


const getHotelTax = () => {
    return {
        url: newBaseUrl + 'get-common-data/tax-rule',
    };
}


const getAllHotelTagY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-tag/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};


const getAllNearPlaceY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-near-place/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};

const getAllHotelIssuesY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-issues/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};


const hotelMasterGet = (search_key = '', start = 1, length = 25) => {
    return {
        url: newBaseUrl + 'hotel-master/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            ["is-active"]: "A"
        },
    };
};



const hotelMasterGetByKey = (hotel_id) => {
    return {
        url: newBaseUrl + 'hotel-master/get-by-key',
        pay_load: {
            [newConstants.HOTEL_KEY]: hotel_id,
        },
    };
};

const hotelMasterUpdate = (hotel_key, localFields, multi_images, hotel_languages, hotel_description, hotelIssues, near_place, rightAmen) => {
    return {
        url: newBaseUrl + 'hotel-master/update',
        pay_load: {
            [newConstants.HOTEL_KEY]: hotel_key,
            [newConstants.HOTEL_ADDRESS]: localFields[newConstants.HOTEL_ADDRESS][newConstants.VALUE],
            [newConstants.HOTEL_NAME]: localFields[newConstants.HOTEL_NAME][newConstants.VALUE],
            [newConstants.HOTEL_CATEGORY_KEY]: localFields[newConstants.HOTEL_CATEGORY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_CITY_KEY]: localFields[newConstants.HOTEL_CITY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_CONTACT_PERSON]: localFields[newConstants.HOTEL_CONTACT_PERSON][newConstants.VALUE],
            [newConstants.HOTEL_PHONE1]: localFields[newConstants.HOTEL_PHONE1][newConstants.VALUE],
            [newConstants.HOTEL_COUNTRY_KEY]: localFields[newConstants.HOTEL_COUNTRY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_EMAIL1]: localFields[newConstants.HOTEL_EMAIL1][newConstants.VALUE],
            [newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY]: localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY][newConstants.VALUE],
            [newConstants.HOTEL_LATITUDE]: localFields[newConstants.HOTEL_LATITUDE][newConstants.VALUE],
            [newConstants.HOTEL_LONGITUDE]: localFields[newConstants.HOTEL_LONGITUDE][newConstants.VALUE],
            [newConstants.HOTEL_OFFICE_PHONE1]: localFields[newConstants.HOTEL_OFFICE_PHONE1][newConstants.VALUE],
            [newConstants.HOTEL_OFFICE_PHONE2]: localFields[newConstants.HOTEL_OFFICE_PHONE2][newConstants.VALUE],
            [newConstants.HOTEL_POSTAL_CODE]: localFields[newConstants.HOTEL_POSTAL_CODE][newConstants.VALUE],
            [newConstants.HOTEL_PROVINCE_KEY]: localFields[newConstants.HOTEL_PROVINCE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_REGNO]: localFields[newConstants.HOTEL_REGNO][newConstants.VALUE],
            [newConstants.HOTEL_TYPE_KEY]: localFields[newConstants.HOTEL_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_WEB_SITE]: localFields[newConstants.HOTEL_WEB_SITE][newConstants.VALUE],
            [newConstants.TAX_TYPE]: localFields[newConstants.TAX_TYPE][newConstants.VALUE],
            [newConstants.SERVICE_TYPE]: localFields[newConstants.SERVICE_TYPE][newConstants.VALUE],
            [newConstants.ADDITIONAL_TYPE]: localFields[newConstants.ADDITIONAL_TYPE][newConstants.VALUE],
            [newConstants.HOTEL_TAX_VALUE]: parseFloat(localFields[newConstants.HOTEL_TAX_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_SERVICE_VALUE]: parseFloat(localFields[newConstants.HOTEL_SERVICE_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_ADDITIONAL_VALUE]: parseFloat(localFields[newConstants.HOTEL_ADDITIONAL_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_TAX_RULE_KEY]: localFields[newConstants.HOTEL_TAX_RULE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_AMENITIES]: rightAmen.map((value) => ({
                [newConstants.HOTEL_AMENITY_KEY]: value[newConstants.HOTEL_AMENITY_KEY],
                [newConstants.HOTEL_AMENITY_NAME]: value[newConstants.HOTEL_AMENITY_NAME],
                [newConstants.IS_SHOW]: true,
            })),
            [newConstants.HOTEL_TAGS]: localFields[newConstants.HOTEL_TAGS][newConstants.VALUE].map((value) => ({
                [newConstants.HOTEL_TAG_KEY]: value[newConstants.VALUE],
                [newConstants.HOTEL_TAG_NAME]: value.label,
            })),
            [newConstants.HOTEL_NEAR_PLACES]: near_place.map((value) => ({
                [newConstants.NEAR_PLACE_KEY]: value[newConstants.NEAR_PLACE_KEY],
                [newConstants.NEAR_PLACE_DESC]: value[newConstants.NEAR_PLACE_DESC],
                [newConstants.LATTITUDE]: value[newConstants.LATTITUDE],
                [newConstants.LONGITUDE]: value[newConstants.LONGITUDE],
            })),
            [newConstants.HOTEL_DESCRIPTIONS]: hotel_description,
            [newConstants.HOTEL_LANGUAGES]: hotel_languages.map((value) => ({
                [newConstants.CLANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.C_HOTEL_ADDRESS]: value[newConstants.HOTEL_ADDRESS][newConstants.VALUE],
                [newConstants.C_HOTEL_NAME]: value[newConstants.HOTEL_NAME][newConstants.VALUE],
                [newConstants.HOTEL_CONTACT_PERSON]: value[newConstants.HOTEL_CONTACT_PERSON][newConstants.VALUE],
            })),
            [newConstants.HOTEL_ISSUES]: hotelIssues.map((value) => ({
                [newConstants.HOTEL_ISSUES_KEY]: value[newConstants.HOTEL_ISSUES_KEY],
                [newConstants.EFFECTIVE_FROM]: value[newConstants.EFFECTIVE_FROM],
                [newConstants.EFFECTIVE_TO]: value[newConstants.EFFECTIVE_TO],
            })),
            [newConstants.HOTEL_IMAGES]: multi_images.map((value) => ({
                [newConstants.IMAGE_TYPE_KEY]: value.image_type_key,
                [newConstants.IMAGE_PATH_KEY]: value.value,
                [newConstants.IMAGE_PATH]: value.url
            })),
        },
    };
};

const hotelMasterSave = (localFields, multi_images, hotel_languages, hotel_description, hotelIssues, near_place, rightAmen) => {
    return {
        url: newBaseUrl + 'hotel-master/save',
        pay_load: {
            [newConstants.HOTEL_ADDRESS]: localFields[newConstants.HOTEL_ADDRESS][newConstants.VALUE],
            [newConstants.HOTEL_NAME]: localFields[newConstants.HOTEL_NAME][newConstants.VALUE],
            [newConstants.HOTEL_CATEGORY_KEY]: localFields[newConstants.HOTEL_CATEGORY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_CITY_KEY]: localFields[newConstants.HOTEL_CITY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_COUNTRY_KEY]: localFields[newConstants.HOTEL_COUNTRY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_EMAIL1]: localFields[newConstants.HOTEL_EMAIL1][newConstants.VALUE],
            [newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY]: localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY][newConstants.VALUE],
            [newConstants.HOTEL_LATITUDE]: localFields[newConstants.HOTEL_LATITUDE][newConstants.VALUE],
            [newConstants.HOTEL_LONGITUDE]: localFields[newConstants.HOTEL_LONGITUDE][newConstants.VALUE],
            [newConstants.HOTEL_OFFICE_PHONE1]: localFields[newConstants.HOTEL_OFFICE_PHONE1][newConstants.VALUE],
            [newConstants.HOTEL_OFFICE_PHONE2]: localFields[newConstants.HOTEL_OFFICE_PHONE2][newConstants.VALUE],
            [newConstants.HOTEL_CONTACT_PERSON]: localFields[newConstants.HOTEL_CONTACT_PERSON][newConstants.VALUE],
            [newConstants.HOTEL_PHONE1]: localFields[newConstants.HOTEL_PHONE1][newConstants.VALUE],
            [newConstants.HOTEL_POSTAL_CODE]: localFields[newConstants.HOTEL_POSTAL_CODE][newConstants.VALUE],
            [newConstants.HOTEL_PROVINCE_KEY]: localFields[newConstants.HOTEL_PROVINCE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_REGNO]: localFields[newConstants.HOTEL_REGNO][newConstants.VALUE],
            [newConstants.HOTEL_TYPE_KEY]: localFields[newConstants.HOTEL_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_WEB_SITE]: localFields[newConstants.HOTEL_WEB_SITE][newConstants.VALUE],
            [newConstants.TAX_TYPE]: localFields[newConstants.TAX_TYPE][newConstants.VALUE],
            [newConstants.SERVICE_TYPE]: localFields[newConstants.SERVICE_TYPE][newConstants.VALUE],
            [newConstants.ADDITIONAL_TYPE]: localFields[newConstants.ADDITIONAL_TYPE][newConstants.VALUE],
            [newConstants.HOTEL_TAX_VALUE]: parseFloat(localFields[newConstants.HOTEL_TAX_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_SERVICE_VALUE]: parseFloat(localFields[newConstants.HOTEL_SERVICE_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_ADDITIONAL_VALUE]: parseFloat(localFields[newConstants.HOTEL_ADDITIONAL_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_TAX_RULE_KEY]: localFields[newConstants.HOTEL_TAX_RULE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_AMENITIES]: rightAmen.map((value) => ({
                [newConstants.HOTEL_AMENITY_KEY]: value[newConstants.HOTEL_AMENITY_KEY],
                [newConstants.HOTEL_AMENITY_NAME]: value[newConstants.HOTEL_AMENITY_NAME],
                [newConstants.IS_SHOW]: true,
            })),
            [newConstants.HOTEL_TAGS]: localFields[newConstants.HOTEL_TAGS][newConstants.VALUE].map((value) => ({
                [newConstants.HOTEL_TAG_KEY]: value[newConstants.VALUE],
                [newConstants.HOTEL_TAG_NAME]: value.label,
            })),
            [newConstants.HOTEL_NEAR_PLACES]: near_place.map((value) => ({
                [newConstants.NEAR_PLACE_KEY]: value[newConstants.NEAR_PLACE_KEY],
                [newConstants.NEAR_PLACE_DESC]: value[newConstants.NEAR_PLACE_DESC],
                [newConstants.LATTITUDE]: value[newConstants.LATTITUDE],
                [newConstants.LONGITUDE]: value[newConstants.LONGITUDE],
            })),
            [newConstants.HOTEL_DESCRIPTIONS]: hotel_description,
            [newConstants.HOTEL_LANGUAGES]: hotel_languages.map((value) => ({
                [newConstants.CLANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.C_HOTEL_ADDRESS]: value[newConstants.HOTEL_ADDRESS][newConstants.VALUE],
                [newConstants.C_HOTEL_NAME]: value[newConstants.HOTEL_NAME][newConstants.VALUE],
                [newConstants.HOTEL_CONTACT_PERSON]: value[newConstants.HOTEL_CONTACT_PERSON][newConstants.VALUE],
            })),
            [newConstants.HOTEL_ISSUES]: hotelIssues.map((value) => ({
                [newConstants.HOTEL_ISSUES_KEY]: value[newConstants.HOTEL_ISSUES_KEY],
                [newConstants.EFFECTIVE_FROM]: value[newConstants.EFFECTIVE_FROM],
                [newConstants.EFFECTIVE_TO]: value[newConstants.EFFECTIVE_TO],
            })),
            [newConstants.HOTEL_IMAGES]: multi_images.map((value) => ({
                [newConstants.IMAGE_TYPE_KEY]: value.image_type_key,
                [newConstants.IMAGE_PATH_KEY]: value.value,
                [newConstants.IMAGE_PATH]: value.url
            })),
        },
    };
};

const hotelMasterSaves = (localFields, hotel_languages, hotel_description, multi_images, storeAmenity, storeNearbyPlaces, storeIssuesHotel ,storeTag) => {
    return {
        url: newBaseUrl + 'hotel-master/save',
        pay_load: {
            [newConstants.HOTEL_ADDRESS]: localFields[newConstants.HOTEL_ADDRESS][newConstants.VALUE],
            [newConstants.HOTEL_NAME]: localFields[newConstants.HOTEL_NAME][newConstants.VALUE],
            [newConstants.HOTEL_CATEGORY_KEY]: localFields[newConstants.HOTEL_CATEGORY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_CITY_KEY]: localFields[newConstants.HOTEL_CITY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_COUNTRY_KEY]: localFields[newConstants.HOTEL_COUNTRY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_EMAIL1]: localFields[newConstants.HOTEL_EMAIL1][newConstants.VALUE],
            [newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY]: localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY][newConstants.VALUE],
            [newConstants.HOTEL_LATITUDE]: localFields[newConstants.HOTEL_LATITUDE][newConstants.VALUE],
            [newConstants.HOTEL_LONGITUDE]: localFields[newConstants.HOTEL_LONGITUDE][newConstants.VALUE],
            [newConstants.HOTEL_OFFICE_PHONE1]: localFields[newConstants.HOTEL_OFFICE_PHONE1][newConstants.VALUE],
            [newConstants.HOTEL_OFFICE_PHONE2]: localFields[newConstants.HOTEL_OFFICE_PHONE2][newConstants.VALUE],
            [newConstants.HOTEL_CONTACT_PERSON]: localFields[newConstants.HOTEL_CONTACT_PERSON][newConstants.VALUE],
            [newConstants.HOTEL_PHONE1]: localFields[newConstants.HOTEL_PHONE1][newConstants.VALUE],
            [newConstants.HOTEL_POSTAL_CODE]: localFields[newConstants.HOTEL_POSTAL_CODE][newConstants.VALUE],
            [newConstants.HOTEL_PROVINCE_KEY]: localFields[newConstants.HOTEL_PROVINCE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_REGNO]: localFields[newConstants.HOTEL_REGNO][newConstants.VALUE],
            [newConstants.HOTEL_TYPE_KEY]: localFields[newConstants.HOTEL_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_WEB_SITE]: localFields[newConstants.HOTEL_WEB_SITE][newConstants.VALUE],
            [newConstants.TAX_TYPE]: localFields[newConstants.TAX_TYPE][newConstants.VALUE],
            [newConstants.SERVICE_TYPE]: localFields[newConstants.SERVICE_TYPE][newConstants.VALUE],
            [newConstants.ADDITIONAL_TYPE]: localFields[newConstants.ADDITIONAL_TYPE][newConstants.VALUE],
            [newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP]: localFields[newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP][newConstants.VALUE],
            [newConstants.CLIENT_MARGIN_VALUE]: parseFloat(localFields[newConstants.CLIENT_MARGIN_VALUE][newConstants.VALUE]),
            [newConstants.CLIENT_MARGIN_TYPE]: localFields[newConstants.CLIENT_MARGIN_TYPE][newConstants.VALUE],
            [newConstants.HOTEL_TAX_VALUE]: parseFloat(localFields[newConstants.HOTEL_TAX_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_SERVICE_VALUE]: parseFloat(localFields[newConstants.HOTEL_SERVICE_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_ADDITIONAL_VALUE]: parseFloat(localFields[newConstants.HOTEL_ADDITIONAL_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_TAX_RULE_KEY]: localFields[newConstants.HOTEL_TAX_RULE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_AMENITIES]: storeAmenity.map((value) => ({
                [newConstants.HOTEL_AMENITY_KEY]: value.key,
                [newConstants.HOTEL_AMENITY_NAME]: value.label,
                [newConstants.IS_SHOW]: true,
            })),

            [newConstants.HOTEL_TAGS]: storeTag.map((value) => ({
                [newConstants.HOTEL_TAG_KEY]: value[newConstants.HOTEL_TAG_KEY],
                [newConstants.HOTEL_TAG_NAME]: value[newConstants.HOTEL_TAG_NAME],
            })),
            [newConstants.HOTEL_NEAR_PLACES]: storeNearbyPlaces.map((value) => ({
                [newConstants.NEAR_PLACE_KEY]: value[newConstants.HOTEL_NEAR_BY_PLACE_KEY],
                [newConstants.NEAR_PLACE_DESC]: value[newConstants.HOTEL_NEAR_BY_PLACE_DESC],
                [newConstants.LATTITUDE]: value[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE],
                [newConstants.LONGITUDE]: value[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE],
            })),
            [newConstants.HOTEL_DESCRIPTIONS]: hotel_description,
            [newConstants.HOTEL_LANGUAGES]: hotel_languages.map((value) => ({
                [newConstants.CLANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.C_HOTEL_ADDRESS]: value[newConstants.HOTEL_ADDRESS][newConstants.VALUE],
                [newConstants.C_HOTEL_NAME]: value[newConstants.HOTEL_NAME][newConstants.VALUE],
                [newConstants.HOTEL_CONTACT_PERSON]: value[newConstants.HOTEL_CONTACT_PERSON][newConstants.VALUE],
            })),
            [newConstants.HOTEL_ISSUES]: storeIssuesHotel.map((value) => ({
                [newConstants.HOTEL_ISSUES_KEY]: value[newConstants.HOTEL_ISSUES_KEY],
                [newConstants.HOTEL_ISSUES_DESC]: value[newConstants.HOTEL_ISSUES_DESC],
                [newConstants.HOTEL_ISSUES_TITLE]: value[newConstants.HOTEL_ISSUES_TITLE],
                [newConstants.EFFECTIVE_FROM]: value[newConstants.EFFECTIVE_FROM],
                [newConstants.EFFECTIVE_TO]: value[newConstants.EFFECTIVE_TO],
            })),
            [newConstants.HOTEL_IMAGES]: multi_images.map((value) => ({
                [newConstants.IMAGE_TYPE_KEY]: value.image_type_key,
                [newConstants.IMAGE_PATH_KEY]: value.value,
                [newConstants.IMAGE_PATH]: value.url
            })),
        },
    };
    
};

const hotelMasterUpdates = (hotel_key, localFields, hotel_languages, hotel_description, multi_images, storeAmenity, storeNearbyPlaces, storeIssuesHotel, storeTag) => {
    return {
        url: newBaseUrl + 'hotel-master/update',
        pay_load: {
            [newConstants.HOTEL_KEY]: hotel_key,
            [newConstants.HOTEL_ADDRESS]: localFields[newConstants.HOTEL_ADDRESS][newConstants.VALUE],
            [newConstants.HOTEL_NAME]: localFields[newConstants.HOTEL_NAME][newConstants.VALUE],
            [newConstants.HOTEL_CATEGORY_KEY]: localFields[newConstants.HOTEL_CATEGORY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_CITY_KEY]: localFields[newConstants.HOTEL_CITY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_CONTACT_PERSON]: localFields[newConstants.HOTEL_CONTACT_PERSON][newConstants.VALUE],
            [newConstants.HOTEL_PHONE1]: localFields[newConstants.HOTEL_PHONE1][newConstants.VALUE],
            [newConstants.HOTEL_COUNTRY_KEY]: localFields[newConstants.HOTEL_COUNTRY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_EMAIL1]: localFields[newConstants.HOTEL_EMAIL1][newConstants.VALUE],
            [newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY]: localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY][newConstants.VALUE],
            [newConstants.HOTEL_LATITUDE]: localFields[newConstants.HOTEL_LATITUDE][newConstants.VALUE],
            [newConstants.HOTEL_LONGITUDE]: localFields[newConstants.HOTEL_LONGITUDE][newConstants.VALUE],
            [newConstants.HOTEL_OFFICE_PHONE1]: localFields[newConstants.HOTEL_OFFICE_PHONE1][newConstants.VALUE],
            [newConstants.HOTEL_OFFICE_PHONE2]: localFields[newConstants.HOTEL_OFFICE_PHONE2][newConstants.VALUE],
            [newConstants.HOTEL_POSTAL_CODE]: localFields[newConstants.HOTEL_POSTAL_CODE][newConstants.VALUE],
            [newConstants.HOTEL_PROVINCE_KEY]: localFields[newConstants.HOTEL_PROVINCE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_REGNO]: localFields[newConstants.HOTEL_REGNO][newConstants.VALUE],
            [newConstants.HOTEL_TYPE_KEY]: localFields[newConstants.HOTEL_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_WEB_SITE]: localFields[newConstants.HOTEL_WEB_SITE][newConstants.VALUE],
            [newConstants.TAX_TYPE]: localFields[newConstants.TAX_TYPE][newConstants.VALUE],
            [newConstants.SERVICE_TYPE]: localFields[newConstants.SERVICE_TYPE][newConstants.VALUE],
            [newConstants.ADDITIONAL_TYPE]: localFields[newConstants.ADDITIONAL_TYPE][newConstants.VALUE],
            [newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP]: localFields[newConstants.IS_SHOW_PRICE_WITH_TAX_BREAKUP][newConstants.VALUE],
            [newConstants.CLIENT_MARGIN_VALUE]: parseFloat(localFields[newConstants.CLIENT_MARGIN_VALUE][newConstants.VALUE]),
            [newConstants.CLIENT_MARGIN_TYPE]: localFields[newConstants.CLIENT_MARGIN_TYPE][newConstants.VALUE],
            [newConstants.HOTEL_TAX_VALUE]: parseFloat(localFields[newConstants.HOTEL_TAX_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_SERVICE_VALUE]: parseFloat(localFields[newConstants.HOTEL_SERVICE_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_ADDITIONAL_VALUE]: parseFloat(localFields[newConstants.HOTEL_ADDITIONAL_VALUE][newConstants.VALUE]),
            [newConstants.HOTEL_TAX_RULE_KEY]: localFields[newConstants.HOTEL_TAX_RULE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_AMENITIES]: storeAmenity.map((value) => ({
                [newConstants.HOTEL_AMENITY_KEY]: value.key,
                [newConstants.HOTEL_AMENITY_NAME]: value.label,
                [newConstants.IS_SHOW]: true,
            })),
            [newConstants.HOTEL_TAGS]: storeTag.map((value) => ({
                [newConstants.HOTEL_TAG_KEY]: value[newConstants.HOTEL_TAG_KEY],
                [newConstants.HOTEL_TAG_NAME]: value[newConstants.HOTEL_TAG_NAME],
            })),
            [newConstants.HOTEL_NEAR_PLACES]: storeNearbyPlaces.map((value) => ({
                [newConstants.NEAR_PLACE_KEY]: value[newConstants.HOTEL_NEAR_BY_PLACE_KEY],
                [newConstants.NEAR_PLACE_DESC]: value[newConstants.HOTEL_NEAR_BY_PLACE_DESC],
                [newConstants.LATTITUDE]: value[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE],
                [newConstants.LONGITUDE]: value[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE],
            })),
            [newConstants.HOTEL_DESCRIPTIONS]: hotel_description,
            [newConstants.HOTEL_LANGUAGES]: hotel_languages.map((value) => ({
                [newConstants.CLANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.C_HOTEL_ADDRESS]: value[newConstants.HOTEL_ADDRESS][newConstants.VALUE],
                [newConstants.C_HOTEL_NAME]: value[newConstants.HOTEL_NAME][newConstants.VALUE],
                [newConstants.HOTEL_CONTACT_PERSON]: value[newConstants.HOTEL_CONTACT_PERSON][newConstants.VALUE],
            })),
            [newConstants.HOTEL_ISSUES]: storeIssuesHotel.map((value) => ({
                [newConstants.HOTEL_ISSUES_KEY]: value[newConstants.HOTEL_ISSUES_KEY],
                [newConstants.HOTEL_ISSUES_DESC]: value[newConstants.HOTEL_ISSUES_DESC],
                [newConstants.HOTEL_ISSUES_TITLE]: value[newConstants.HOTEL_ISSUES_TITLE],
                [newConstants.EFFECTIVE_FROM]: value[newConstants.EFFECTIVE_FROM],
                [newConstants.EFFECTIVE_TO]: value[newConstants.EFFECTIVE_TO],
            })),
            [newConstants.HOTEL_IMAGES]: multi_images.map((value) => ({
                [newConstants.IMAGE_TYPE_KEY]: value.image_type_key,
                [newConstants.IMAGE_PATH_KEY]: value.value,
                [newConstants.IMAGE_PATH]: value.url
            })),
        },
    };
};

const deleteByHotel = (key) => {
    return {
        url: newBaseUrl + "hotel-master/Delete",
        pay_load: {
            [newConstants.HOTEL_KEY]: key
        }
    }
}


// Room category
const getAllRoomCategory = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'room-category/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
};
const getRoomCategoryByKey = (key) => {
    return {
        url: newBaseUrl + 'room-category/get-by-key',
        pay_load: {
            [newConstants.ROOM_CATEGORY_KEY]: key,
        },
    };
};
const deleteRoomCategory = (key) => {
    return {
        url: newBaseUrl + 'room-category/delete',
        pay_load: {
            [newConstants.ROOM_CATEGORY_KEY]: key,
        },
    };
};
const updateRoomCategory = (key, localFields, multi_language) => {
    let roomCategoryLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.ROOM_CATEGORY_NAME]: value[newConstants.ROOM_CATEGORY_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'room-category/update',
        pay_load: {
            [newConstants.ROOM_CATEGORY_KEY]: key,
            [newConstants.ROOM_CATEGORY_NAME]: localFields[newConstants.ROOM_CATEGORY_NAME][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.ROOM_CATEGORY_LANGUAGES]: roomCategoryLangPacks.filter((f) => f != null),
        },
    };
};
const createRoomCategory = (localFields, multi_language) => {
    let roomCategoryLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.ROOM_CATEGORY_NAME]: value[newConstants.ROOM_CATEGORY_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'room-category/save',
        pay_load: {
            [newConstants.ROOM_CATEGORY_NAME]: localFields[newConstants.ROOM_CATEGORY_NAME][newConstants.VALUE],
            [newConstants.ROOM_CATEGORY_LANGUAGES]: roomCategoryLangPacks.filter((f) => f != null),
        },
    };
};


// Manage room 
const getAllRoomCategoryY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'room-category/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};


const getAllRooms = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'room/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
};
const getRoomByKey = (key) => {
    return {
        url: newBaseUrl + 'room/get-by-key',
        pay_load: {
            [newConstants.ROOM_KEY]: key,
        },
    };
};
const deleteRoom = (key) => {
    return {
        url: newBaseUrl + 'room/delete',
        pay_load: {
            [newConstants.ROOM_KEY]: key,
        },
    };
};
const updateRoom = (roomKey, localFields, multi_language) => {
    let roomLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.ROOM_NAME]: value[newConstants.ROOM_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'room/update',
        pay_load: {
            [newConstants.ROOM_KEY]: roomKey,
            [newConstants.ROOM_NAME]: localFields[newConstants.ROOM_NAME][newConstants.VALUE],
            [newConstants.ROOM_CATEGORY_KEY]: localFields[newConstants.ROOM_CATEGORY_KEY][newConstants.VALUE],
            [newConstants.ROOM_CATEGORY_NAME]: localFields[newConstants.ROOM_CATEGORY_NAME][newConstants.VALUE],
            [newConstants.ROOM_MIN_PAX]: parseInt(localFields[newConstants.ROOM_MIN_PAX][newConstants.VALUE]),
            [newConstants.ROOM_MAX_PAX]: parseInt(localFields[newConstants.ROOM_MAX_PAX][newConstants.VALUE]),
            [newConstants.ROOM_MIN_ADULTS]: parseInt(localFields[newConstants.ROOM_MIN_ADULTS][newConstants.VALUE]),
            [newConstants.ROOM_MAX_ADULTS]: parseInt(localFields[newConstants.ROOM_MAX_ADULTS][newConstants.VALUE]),
            [newConstants.ROOM_MAX_CHILDS]: parseInt(localFields[newConstants.ROOM_MAX_CHILDS][newConstants.VALUE]),
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.ROOM_LANGUAGES]: roomLangPacks.filter((f) => f != null),
        },
    };
};
const createRoom = (localFields, multi_language) => {
    let roomLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.ROOM_NAME]: value[newConstants.ROOM_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'room/save',
        pay_load: {
            [newConstants.ROOM_NAME]: localFields[newConstants.ROOM_NAME][newConstants.VALUE],
            [newConstants.ROOM_CATEGORY_KEY]: localFields[newConstants.ROOM_CATEGORY_KEY][newConstants.VALUE],
            [newConstants.ROOM_CATEGORY_NAME]: localFields[newConstants.ROOM_CATEGORY_NAME][newConstants.VALUE],
            [newConstants.ROOM_MIN_PAX]: parseInt(localFields[newConstants.ROOM_MIN_PAX][newConstants.VALUE]),
            [newConstants.ROOM_MAX_PAX]: parseInt(localFields[newConstants.ROOM_MAX_PAX][newConstants.VALUE]),
            [newConstants.ROOM_MIN_ADULTS]: parseInt(localFields[newConstants.ROOM_MIN_ADULTS][newConstants.VALUE]),
            [newConstants.ROOM_MAX_ADULTS]: parseInt(localFields[newConstants.ROOM_MAX_ADULTS][newConstants.VALUE]),
            [newConstants.ROOM_MAX_CHILDS]: parseInt(localFields[newConstants.ROOM_MAX_CHILDS][newConstants.VALUE]),
            [newConstants.ROOM_LANGUAGES]: roomLangPacks.filter((f) => f != null),
        },
    };
};

// Room night setup 
const getAllRoomNightSetup = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'room-night-setup/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
};

const getRoomNightSetupByKey = (key) => {
    return {
        url: newBaseUrl + 'room-night-setup/get-by-key',
        pay_load: {
            [newConstants.ROOM_NIGHT_SETUP_KEY]: key,
        },
    };
};
const deleteRoomNightSetup = (key) => {
    return {
        url: newBaseUrl + 'room-night-setup/Delete',
        pay_load: {
            [newConstants.ROOM_NIGHT_SETUP_KEY]: key,
        },
    };
};
// doing boolean conversion with Number() other option is implicit adding '+' in front
const updateRoomNightSetup = (key, localFields) => {
    return {
        url: newBaseUrl + 'room-night-setup/update',
        pay_load: {
            [newConstants.ROOM_NIGHT_SETUP_KEY]: key,
            [newConstants.ROOM_PLAN_KEY]: localFields[newConstants.ROOM_PLAN_KEY][newConstants.VALUE],
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.ROOM_NIGHT]: parseInt(localFields[newConstants.ROOM_NIGHT][newConstants.VALUE]),
            [newConstants.IS_DATERANGE]: Number(localFields[newConstants.IS_DATERANGE][newConstants.VALUE]),
            [newConstants.EFFECTIVE_FROM]: localFields[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
            [newConstants.EFFECTIVE_TO]: localFields[newConstants.EFFECTIVE_TO][newConstants.VALUE],
            [newConstants.IS_OVERWRITE]: parseInt(Number(localFields[newConstants.IS_OVERWRITE][newConstants.VALUE])),
            [newConstants.IS_ALL_DAYS_IN_WEEK]: Number(localFields[newConstants.IS_ALL_DAYS_IN_WEEK][newConstants.VALUE]),
            [newConstants.IS_SUNDAY]: Number(localFields[newConstants.IS_SUNDAY][newConstants.VALUE]),
            [newConstants.IS_MONDAY]: Number(localFields[newConstants.IS_MONDAY][newConstants.VALUE]),
            [newConstants.IS_TUESDAY]: Number(localFields[newConstants.IS_TUESDAY][newConstants.VALUE]),
            [newConstants.IS_WEDNESDAY]: Number(localFields[newConstants.IS_WEDNESDAY][newConstants.VALUE]),
            [newConstants.IS_THURSDAY]: Number(localFields[newConstants.IS_THURSDAY][newConstants.VALUE]),
            [newConstants.IS_FRIDAY]: Number(localFields[newConstants.IS_FRIDAY][newConstants.VALUE]),
            [newConstants.IS_SATURDAY]: Number(localFields[newConstants.IS_SATURDAY][newConstants.VALUE]),
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
        },
    };
};
// doing boolean conversion with Number() other option is implicit adding '+' in front
const createRoomNightSetup = (localFields) => {
    return {
        url: newBaseUrl + 'room-night-setup/save',
        pay_load: {
            [newConstants.ROOM_PLAN_KEY]: localFields[newConstants.ROOM_PLAN_KEY][newConstants.VALUE],
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.ROOM_NIGHT]: parseInt(localFields[newConstants.ROOM_NIGHT][newConstants.VALUE]),
            [newConstants.IS_DATERANGE]: Number(localFields[newConstants.IS_DATERANGE][newConstants.VALUE]),
            [newConstants.EFFECTIVE_FROM]: localFields[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
            [newConstants.EFFECTIVE_TO]: localFields[newConstants.EFFECTIVE_TO][newConstants.VALUE],
            [newConstants.IS_OVERWRITE]: Number(localFields[newConstants.IS_OVERWRITE][newConstants.VALUE]),
            [newConstants.IS_ALL_DAYS_IN_WEEK]: Number(localFields[newConstants.IS_ALL_DAYS_IN_WEEK][newConstants.VALUE]),
            [newConstants.IS_SUNDAY]: Number(localFields[newConstants.IS_SUNDAY][newConstants.VALUE]),
            [newConstants.IS_MONDAY]: Number(localFields[newConstants.IS_MONDAY][newConstants.VALUE]),
            [newConstants.IS_TUESDAY]: Number(localFields[newConstants.IS_TUESDAY][newConstants.VALUE]),
            [newConstants.IS_WEDNESDAY]: Number(localFields[newConstants.IS_WEDNESDAY][newConstants.VALUE]),
            [newConstants.IS_THURSDAY]: Number(localFields[newConstants.IS_THURSDAY][newConstants.VALUE]),
            [newConstants.IS_FRIDAY]: Number(localFields[newConstants.IS_FRIDAY][newConstants.VALUE]),
            [newConstants.IS_SATURDAY]: Number(localFields[newConstants.IS_SATURDAY][newConstants.VALUE]),
        },
    };
};


const getRoomPlanPriceKey = (roomkey, hotelkey) => {
    return {
        url: newBaseUrl + 'room-plan/get-room-plans-by-room-key',
        pay_load: {
            [newConstants.ROOM_KEY]: roomkey,
            [newConstants.HOTEL_KEY]: hotelkey,
        },
    };
}


// Room plan 
const getAllRoomPlan = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'room-plan/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
};
const getAllRefundTypes = () => {
    return {
        url: newBaseUrl + 'room-plan/get-refund-types',
        pay_load: {},
    };
};
const getRoomPlanByKey = (key) => {
    return {
        url: newBaseUrl + 'room-plan/get-by-key',
        pay_load: {
            [newConstants.ROOM_PLAN_KEY]: key,
        },
    };
};
const deleteRoomPlan = (key) => {
    return {
        url: newBaseUrl + 'room-plan/delete',
        pay_load: {
            [newConstants.ROOM_PLAN_KEY]: key,
        },
    };
};


const generateRoomPlan = (localFields) => {
    return {
        url: newBaseUrl + 'room-plan/generate-room-plan-pax-price-list',
        pay_load: {
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.PRICE_COMMENTS_KEY]: localFields[newConstants.PRICE_COMMENTS_KEY][newConstants.VALUE],
            [newConstants.B2B_PRICE]: {
                [newConstants.NET_VALUE]: parseFloat(localFields["b2b-net-value"][newConstants.VALUE]),
            },
            [newConstants.B2C_PRICE]: {
                [newConstants.NET_VALUE]: parseFloat(localFields["b2c-net-value"][newConstants.VALUE]),
            },
        },
    };
};

const createRoomPlan = (localFields, multi_language, amenityLinks, cancelPolicyRules, generate) => {
    let roomPlanLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.ROOM_PLAN_NAME]: value[newConstants.ROOM_PLAN_NAME][newConstants.VALUE],
        } :
            null;
    });
    let roomPlanAmenityPack = amenityLinks.map((value) => {
        return value[newConstants.ROOM_AMENITY_KEY][newConstants.VALUE] != '' ? {
            [newConstants.ROOM_AMENITY_KEY]: value[newConstants.ROOM_AMENITY_KEY][newConstants.VALUE],
            [newConstants.ROOM_AMENITY_PRICE]: parseFloat(value[newConstants.ROOM_AMENITY_PRICE][newConstants.VALUE]),
            [newConstants.IS_SHOW]: value[newConstants.IS_SHOW][newConstants.VALUE],
        } :
            null;
    });


    let generateField = generate.map((value) => {
        return value[newConstants.PAX_ADULT][newConstants.VALUE] != '' ? {
            [newConstants.PAX_ADULT]: parseFloat(value[newConstants.PAX_ADULT][newConstants.VALUE]),
            [newConstants.PAX_CHILD]: parseFloat(value[newConstants.PAX_CHILD][newConstants.VALUE]),
            ["b2b-net-value"]: parseFloat(localFields["b2b-net-value"][newConstants.VALUE]),
            ["b2c-net-value"]: parseFloat(localFields["b2c-net-value"][newConstants.VALUE]),
        } :
            null;
    });

    let policyRulesPack = cancelPolicyRules.map((value) => {
        let cancelPolicyPack = value[newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE].map((value) => {
            return value[newConstants.REFUND_TYPE_KEY][newConstants.VALUE] != '' ? {
                [newConstants.REFUND_TYPE_KEY]: value[newConstants.REFUND_TYPE_KEY][newConstants.VALUE],
                [newConstants.DAYS_BEFORE_CHECK_IN]: parseInt(value[newConstants.DAYS_BEFORE_CHECK_IN][newConstants.VALUE]),
                [newConstants.CANCELATION_VALUE]: parseFloat(value[newConstants.CANCELATION_VALUE][newConstants.VALUE]),
            } :
                null;
        });
        return value[newConstants.ROOM_CANCEL_RULE_NAME][newConstants.VALUE] != '' ? {
            [newConstants.ROOM_CANCEL_RULE_NAME]: value[newConstants.ROOM_CANCEL_RULE_NAME][newConstants.VALUE],
            [newConstants.IS_DATE_RANGE]: value[newConstants.IS_DATE_RANGE][newConstants.VALUE],
            [newConstants.EFFECTIVE_FROM]: value[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
            [newConstants.EFFECTIVE_TO]: value[newConstants.EFFECTIVE_TO][newConstants.VALUE],
            [newConstants.ROOM_PLAN_CANCEL_POLICIES]: cancelPolicyPack.filter((f) => f != null),
        } :
            null;
    });

    return {
        url: newBaseUrl + 'room-plan/save',
        pay_load: {
            [newConstants.ROOM_PLAN_NAME]: localFields[newConstants.ROOM_PLAN_NAME][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.B2B_PRICE]: {
                [newConstants.TAX_VALUE]: parseFloat(localFields["b2b-tax-value"][newConstants.VALUE]),
                [newConstants.SERVICE_VALUE]: parseFloat(localFields["b2b-service-value"][newConstants.VALUE]),
                [newConstants.ADDITION_VALUE]: parseFloat(localFields["b2b-additional-value"][newConstants.VALUE]),
                [newConstants.AMENITY_VALUE]: parseFloat(localFields["b2b-amenity-value"][newConstants.VALUE]),
                [newConstants.NET_VALUE]: parseFloat(localFields["b2b-net-value"][newConstants.VALUE]),
            },
            [newConstants.B2C_PRICE]: {
                [newConstants.TAX_VALUE]: parseFloat(localFields["b2c-tax-value"][newConstants.VALUE]),
                [newConstants.SERVICE_VALUE]: parseFloat(localFields["b2c-service-value"][newConstants.VALUE]),
                [newConstants.ADDITION_VALUE]: parseFloat(localFields["b2c-additional-value"][newConstants.VALUE]),
                [newConstants.AMENITY_VALUE]: parseFloat(localFields["b2c-amenity-value"][newConstants.VALUE]),
                [newConstants.NET_VALUE]: parseFloat(localFields["b2c-net-value"][newConstants.VALUE]),
            },
            [newConstants.TAX_TYPE]: localFields[newConstants.TAX_TYPE][newConstants.VALUE],
            [newConstants.SERVICE_TYPE]: localFields[newConstants.SERVICE_TYPE][newConstants.VALUE],
            [newConstants.ADDITIONAL_TYPE]: localFields[newConstants.ADDITIONAL_TYPE][newConstants.VALUE],
            [newConstants.ROOM_ALLOTMENT]: parseFloat(localFields[newConstants.ROOM_ALLOTMENT][newConstants.VALUE]),
            [newConstants.IS_SOLD_OUT]: localFields[newConstants.IS_SOLD_OUT][newConstants.VALUE],
            [newConstants.PRICE_COMMENTS_KEY]: localFields[newConstants.PRICE_COMMENTS_KEY][newConstants.VALUE],
            [newConstants.IS_PAX_WISE]: localFields[newConstants.IS_PAX_WISE][newConstants.VALUE],
            [newConstants.IS_ALLDAYS_IN_WEEK]: localFields[newConstants.IS_ALL_DAYS_IN_WEEK][newConstants.VALUE],
            [newConstants.IS_SUNDAY]: localFields[newConstants.IS_SUNDAY][newConstants.VALUE],
            [newConstants.IS_MONDAY]: localFields[newConstants.IS_MONDAY][newConstants.VALUE],
            [newConstants.IS_TUESDAY]: localFields[newConstants.IS_TUESDAY][newConstants.VALUE],
            [newConstants.IS_WEDNESDAY]: localFields[newConstants.IS_WEDNESDAY][newConstants.VALUE],
            [newConstants.IS_THURSDAY]: localFields[newConstants.IS_THURSDAY][newConstants.VALUE],
            [newConstants.IS_FRIDAY]: localFields[newConstants.IS_FRIDAY][newConstants.VALUE],
            [newConstants.IS_SATURDAY]: localFields[newConstants.IS_SATURDAY][newConstants.VALUE],
            [newConstants.ROOM_PLAN_LANGUAGES]: roomPlanLangPack.filter((f) => f != null),
            [newConstants.ROOM_PLAN_AMENITY_LINKS]: roomPlanAmenityPack.filter((f) => f != null),
            [newConstants.ROOM_PLAN_CANCEL_POLICY_RULES]: policyRulesPack.filter((f) => f != null),
            [newConstants.ROOM_PLAN_PAX_PRICE]: generateField.filter((f) => f != null),
        },
    };
};

const updateRoomPlan = (key, localFields, multi_language, amenityLinks, cancelPolicyRules, generate) => {
    let roomPlanLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.ROOM_PLAN_NAME]: value[newConstants.ROOM_PLAN_NAME][newConstants.VALUE],
        } :
            null;
    });
    let roomPlanAmenityPack = amenityLinks.map((value) => {
        return value[newConstants.ROOM_AMENITY_KEY][newConstants.VALUE] != '' ? {
            [newConstants.ROOM_AMENITY_KEY]: value[newConstants.ROOM_AMENITY_KEY][newConstants.VALUE],
            [newConstants.ROOM_AMENITY_PRICE]: parseFloat(value[newConstants.ROOM_AMENITY_PRICE][newConstants.VALUE]),
            [newConstants.IS_SHOW]: value[newConstants.IS_SHOW][newConstants.VALUE],
        } :
            null;
    });

    let policyRulesPack = cancelPolicyRules.map((value) => {
        let cancelPolicyPack = value[newConstants.ROOM_PLAN_CANCEL_POLICIES][newConstants.VALUE].map((value) => {
            return value[newConstants.REFUND_TYPE_KEY][newConstants.VALUE] != '' ? {
                [newConstants.REFUND_TYPE_KEY]: value[newConstants.REFUND_TYPE_KEY][newConstants.VALUE],
                [newConstants.DAYS_BEFORE_CHECK_IN]: parseInt(value[newConstants.DAYS_BEFORE_CHECK_IN][newConstants.VALUE]),
                [newConstants.CANCELATION_VALUE]: parseFloat(value[newConstants.CANCELATION_VALUE][newConstants.VALUE]),
            } :
                null;
        });
        return value[newConstants.ROOM_CANCEL_RULE_NAME][newConstants.VALUE] != '' ? {
            [newConstants.ROOM_CANCEL_RULE_NAME]: value[newConstants.ROOM_CANCEL_RULE_NAME][newConstants.VALUE],
            [newConstants.IS_DATE_RANGE]: value[newConstants.IS_DATE_RANGE][newConstants.VALUE],
            [newConstants.EFFECTIVE_FROM]: value[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
            [newConstants.EFFECTIVE_TO]: value[newConstants.EFFECTIVE_TO][newConstants.VALUE],
            [newConstants.ROOM_PLAN_CANCEL_POLICIES]: cancelPolicyPack.filter((f) => f != null),
        } :
            null;
    });

    let generateField = generate.map((value) => {
        return value[newConstants.PAX_ADULT][newConstants.VALUE] != '' ? {
            [newConstants.PAX_ADULT]: parseFloat(value[newConstants.PAX_ADULT][newConstants.VALUE]),
            [newConstants.PAX_CHILD]: parseFloat(value[newConstants.PAX_CHILD][newConstants.VALUE]),
            ["b2b-net-value"]: parseFloat(localFields["b2b-net-value"][newConstants.VALUE]),
            ["b2c-net-value"]: parseFloat(localFields["b2c-net-value"][newConstants.VALUE]),
        } :
            null;
    });

    return {
        url: newBaseUrl + 'room-plan/update',
        pay_load: {
            [newConstants.ROOM_PLAN_KEY]: key,
            [newConstants.ROOM_PLAN_NAME]: localFields[newConstants.ROOM_PLAN_NAME][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.B2B_PRICE]: {
                [newConstants.TAX_VALUE]: parseFloat(localFields["b2b-tax-value"][newConstants.VALUE]),
                [newConstants.SERVICE_VALUE]: parseFloat(localFields["b2b-service-value"][newConstants.VALUE]),
                [newConstants.ADDITION_VALUE]: parseFloat(localFields["b2b-additional-value"][newConstants.VALUE]),
                [newConstants.AMENITY_VALUE]: parseFloat(localFields["b2b-amenity-value"][newConstants.VALUE]),
                [newConstants.NET_VALUE]: parseFloat(localFields["b2b-net-value"][newConstants.VALUE]),
            },
            [newConstants.B2C_PRICE]: {
                [newConstants.TAX_VALUE]: parseFloat(localFields["b2c-tax-value"][newConstants.VALUE]),
                [newConstants.SERVICE_VALUE]: parseFloat(localFields["b2c-service-value"][newConstants.VALUE]),
                [newConstants.ADDITION_VALUE]: parseFloat(localFields["b2c-additional-value"][newConstants.VALUE]),
                [newConstants.AMENITY_VALUE]: parseFloat(localFields["b2c-amenity-value"][newConstants.VALUE]),
                [newConstants.NET_VALUE]: parseFloat(localFields["b2c-net-value"][newConstants.VALUE]),
            },
            [newConstants.TAX_TYPE]: localFields[newConstants.TAX_TYPE][newConstants.VALUE],
            [newConstants.SERVICE_TYPE]: localFields[newConstants.SERVICE_TYPE][newConstants.VALUE],
            [newConstants.ADDITIONAL_TYPE]: localFields[newConstants.ADDITIONAL_TYPE][newConstants.VALUE],
            [newConstants.ROOM_ALLOTMENT]: parseFloat(localFields[newConstants.ROOM_ALLOTMENT][newConstants.VALUE]),
            [newConstants.IS_SOLD_OUT]: localFields[newConstants.IS_SOLD_OUT][newConstants.VALUE],
            [newConstants.PRICE_COMMENTS_KEY]: localFields[newConstants.PRICE_COMMENTS_KEY][newConstants.VALUE],
            [newConstants.IS_PAX_WISE]: localFields[newConstants.IS_PAX_WISE][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.IS_ALLDAYS_IN_WEEK]: localFields[newConstants.IS_ALL_DAYS_IN_WEEK][newConstants.VALUE],
            [newConstants.IS_SUNDAY]: localFields[newConstants.IS_SUNDAY][newConstants.VALUE],
            [newConstants.IS_MONDAY]: localFields[newConstants.IS_MONDAY][newConstants.VALUE],
            [newConstants.IS_TUESDAY]: localFields[newConstants.IS_TUESDAY][newConstants.VALUE],
            [newConstants.IS_WEDNESDAY]: localFields[newConstants.IS_WEDNESDAY][newConstants.VALUE],
            [newConstants.IS_THURSDAY]: localFields[newConstants.IS_THURSDAY][newConstants.VALUE],
            [newConstants.IS_FRIDAY]: localFields[newConstants.IS_FRIDAY][newConstants.VALUE],
            [newConstants.IS_SATURDAY]: localFields[newConstants.IS_SATURDAY][newConstants.VALUE],
            [newConstants.ROOM_PLAN_LANGUAGES]: roomPlanLangPack.filter((f) => f != null),
            [newConstants.ROOM_PLAN_AMENITY_LINKS]: roomPlanAmenityPack.filter((f) => f != null),
            [newConstants.ROOM_PLAN_CANCEL_POLICY_RULES]: policyRulesPack.filter((f) => f != null),
            [newConstants.ROOM_PLAN_PAX_PRICE]: generateField.filter((f) => f != null),
        },
    };
};



const getRoomPriceY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'room-price-comments/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};


// Room plan price 
const generatePlanPaxList = (localFields, pax) => {
    return {
        url: newBaseUrl + 'room-plan-price/generate-room-plan-pax-price-list',
        pay_load: {
            [newConstants.ROOM_PLAN_KEY]: localFields[newConstants.ROOM_PLAN_KEY][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.DATE]: pax[newConstants.DATE][newConstants.VALUE],
            [newConstants.B2B_RATE]: pax[newConstants.B2B_RATE][newConstants.VALUE],
            [newConstants.B2C_RATE]: pax[newConstants.B2C_RATE][newConstants.VALUE],
            [newConstants.ROOM_PRICE_COMMENTS_KEY]: pax[newConstants.ROOM_PRICE_COMMENTS_KEY][newConstants.VALUE],
        },
    };
};


const generateRoomPlanPriceList = (localFields, rates) => {
    return {
        url: newBaseUrl + 'room-plan-price/generate-room-plan-price-list',
        pay_load: {
            [newConstants.ROOM_PLAN_KEY]: localFields[newConstants.ROOM_PLAN_KEY][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.EFFECTIVE_FROM]: localFields[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
            [newConstants.EFFECTIVE_TO]: localFields[newConstants.EFFECTIVE_TO][newConstants.VALUE],
            // [newConstants.PRICE_COMMENTS_KEY]:localFields[newConstants.PRICE_COMMENTS_KEY][newConstants.VALUE],
            [newConstants.ROOM_RATE_B2B]: {
                [newConstants.NET_VALUE]: parseFloat(rates["b2b-net-value"][newConstants.VALUE]),
            },
            [newConstants.ROOM_RATE_B2C]: {
                [newConstants.NET_VALUE]: parseFloat(rates["b2c-net-value"][newConstants.VALUE]),
            },
            [newConstants.IS_INCLUSIVE_PRICE]: localFields[newConstants.IS_INCLUSIVE_PRICE][newConstants.VALUE],
        },
    };
};



const getRoomPlanPrice = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'room-plan-price/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            ["is-active"]: "A"
        },
    };
};
const roomPlanPriceGetByKey = (key) => {
    return {
        url: newBaseUrl + 'room-plan-price/get-by-key',
        pay_load: {
            [newConstants.HOTEL_SEASONALITY_KEY]: key
        },
    };
};

const deleteRoomPlanPrice = (key) => {
    return {
        url: newBaseUrl + 'room-plan-price/delete',
        pay_load: {
            [newConstants.HOTEL_SEASONALITY_KEY]: key,
        },
    };
};

const roomPlanPriceSave = (localFields, rates, gson) => {
    let seasionalties = gson.map((value) => {
        let paxDetails = value[newConstants.PAX_WISE_PRICE_DETAILS][newConstants.VALUE].map((value) => {
            return value[newConstants.ROOM_PLAN_DATE] != '' ? {
                [newConstants.ROOM_PLAN_DATE]: value[newConstants.ROOM_PLAN_DATE],
                [newConstants.B2B_NET_VALUE]: parseInt(value[newConstants.B2B_NET_VALUE]),
                [newConstants.B2C_NET_VALUE]: parseFloat(value[newConstants.B2C_NET_VALUE]),
                [newConstants.PAX_ADULT]: value[newConstants.PAX_ADULT],
                [newConstants.PAX_CHILD]: value[newConstants.PAX_CHILD],
                [newConstants.ROOM_PLAN_PRICE_KEY]: value[newConstants.ROOM_PLAN_PRICE_KEY],
                [newConstants.ROOM_PRICE_COMMENTS_KEY]: value[newConstants.ROOM_PRICE_COMMENTS_KEY],
            } :
                null;
        });
        return value[newConstants.DATE][newConstants.VALUE] != '' ? {
            [newConstants.SERIAL_NO]: value[newConstants.SERIAL_NO][newConstants.VALUE],
            [newConstants.DATE]: value[newConstants.DATE][newConstants.VALUE],
            [newConstants.B2B_RATE]: parseFloat(value[newConstants.B2B_RATE][newConstants.VALUE]),
            [newConstants.B2C_RATE]: parseFloat(value[newConstants.B2C_RATE][newConstants.VALUE]),
            [newConstants.ROOM_ALLOTMENT]: parseFloat(value[newConstants.ROOM_ALLOTMENT][newConstants.VALUE]),
            [newConstants.IS_SOLD_OUT]: value[newConstants.IS_SOLD_OUT][newConstants.VALUE],
            [newConstants.IS_PAX_WISE_PRICE]: value[newConstants.IS_PAX_WISE_PRICE][newConstants.VALUE],
            [newConstants.SEASONALITY_KEY]: value[newConstants.SEASONALITY_KEY][newConstants.VALUE],
            [newConstants.ROOM_PRICE_COMMENTS_KEY]: value[newConstants.ROOM_PRICE_COMMENTS_KEY][newConstants.VALUE],
            [newConstants.PAX_WISE_PRICE_DETAILS]: paxDetails.filter((f) => f != null),
        } :
            null;
    });
    return {
        url: newBaseUrl + 'room-plan-price/save',
        pay_load: {
            [newConstants.ROOM_PLAN_KEY]: localFields[newConstants.ROOM_PLAN_KEY][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.EFFECTIVE_FROM]: localFields[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
            [newConstants.EFFECTIVE_TO]: localFields[newConstants.EFFECTIVE_TO][newConstants.VALUE],
            [newConstants.HOTEL_SEASONALITY_NAME]: localFields[newConstants.HOTEL_SEASONALITY_NAME][newConstants.VALUE],
            [newConstants.IS_SOLD_OUT]: localFields[newConstants.IS_SOLD_OUT][newConstants.VALUE],
            [newConstants.IS_INCLUSIVE_PRICE]: localFields[newConstants.IS_INCLUSIVE_PRICE][newConstants.VALUE],
            [newConstants.ROOM_RATE_B2B]: {
                [newConstants.TAX_VALUE]: parseFloat(rates["b2b-tax-value"][newConstants.VALUE]),
                [newConstants.SERVICE_VALUE]: parseFloat(rates["b2b-service-value"][newConstants.VALUE]),
                [newConstants.ADDITIONAL_VALUE]: parseFloat(rates["b2b-additional-value"][newConstants.VALUE]),
                [newConstants.AMENITY_VALUE]: parseFloat(rates["b2b-amenity-value"][newConstants.VALUE]),
                [newConstants.NET_VALUE]: parseFloat(rates["b2b-net-value"][newConstants.VALUE]),
            },
            [newConstants.ROOM_RATE_B2C]: {
                [newConstants.TAX_VALUE]: parseFloat(rates["b2c-tax-value"][newConstants.VALUE]),
                [newConstants.SERVICE_VALUE]: parseFloat(rates["b2c-service-value"][newConstants.VALUE]),
                [newConstants.ADDITIONAL_VALUE]: parseFloat(rates["b2c-additional-value"][newConstants.VALUE]),
                [newConstants.AMENITY_VALUE]: parseFloat(rates["b2c-amenity-value"][newConstants.VALUE]),
                [newConstants.NET_VALUE]: parseFloat(rates["b2c-net-value"][newConstants.VALUE]),
            },
            [newConstants.TAX_TYPE]: rates[newConstants.TAX_TYPE][newConstants.VALUE],
            [newConstants.SERVICE_TYPE]: rates[newConstants.SERVICE_TYPE][newConstants.VALUE],
            [newConstants.ADDITIONAL_TYPE]: rates[newConstants.ADDITIONAL_TYPE][newConstants.VALUE],
            [newConstants.ROOM_ALLOTMENT]: parseFloat(rates[newConstants.ROOM_ALLOTMENT][newConstants.VALUE]),
            [newConstants.IS_PAX_WISE]: localFields[newConstants.IS_PAX_WISE][newConstants.VALUE],
            [newConstants.ROOM_PLAN_PRICE_DETAILS]: seasionalties.filter((f) => f != null),
        },
    };
};


const roomPlanPriceUpdate = (id, localFields, rates, gson) => {
    let seasionalties = gson.map((value) => {
        let paxDetails = value[newConstants.PAX_WISE_PRICE_DETAILS][newConstants.VALUE].map((value) => {
            return value[newConstants.ROOM_PLAN_DATE] != '' ? {
                [newConstants.ROOM_PLAN_DATE]: value[newConstants.ROOM_PLAN_DATE],
                [newConstants.B2B_NET_VALUE]: parseInt(value[newConstants.B2B_NET_VALUE]),
                [newConstants.B2C_NET_VALUE]: parseFloat(value[newConstants.B2C_NET_VALUE]),
                [newConstants.PAX_ADULT]: value[newConstants.PAX_ADULT],
                [newConstants.PAX_CHILD]: value[newConstants.PAX_CHILD],
                [newConstants.ROOM_PLAN_PRICE_KEY]: value[newConstants.ROOM_PLAN_PRICE_KEY],
                [newConstants.ROOM_PRICE_COMMENTS_KEY]: value[newConstants.ROOM_PRICE_COMMENTS_KEY],
            } :
                null;
        });
        return value[newConstants.DATE][newConstants.VALUE] != '' ? {
            [newConstants.SERIAL_NO]: value[newConstants.SERIAL_NO][newConstants.VALUE],
            [newConstants.DATE]: value[newConstants.DATE][newConstants.VALUE],
            [newConstants.B2B_RATE]: parseFloat(value[newConstants.B2B_RATE][newConstants.VALUE]),
            [newConstants.B2C_RATE]: parseFloat(value[newConstants.B2C_RATE][newConstants.VALUE]),
            [newConstants.ROOM_ALLOTMENT]: parseFloat(value[newConstants.ROOM_ALLOTMENT][newConstants.VALUE]),
            [newConstants.IS_SOLD_OUT]: value[newConstants.IS_SOLD_OUT][newConstants.VALUE],
            [newConstants.IS_PAX_WISE_PRICE]: value[newConstants.IS_PAX_WISE_PRICE][newConstants.VALUE],
            [newConstants.SEASONALITY_KEY]: value[newConstants.SEASONALITY_KEY][newConstants.VALUE],
            [newConstants.ROOM_PRICE_COMMENTS_KEY]: value[newConstants.ROOM_PRICE_COMMENTS_KEY][newConstants.VALUE],
            [newConstants.PAX_WISE_PRICE_DETAILS]: paxDetails.filter((f) => f != null),
        } :
            null;
    });
    return {
        url: newBaseUrl + 'room-plan-price/update',
        pay_load: {
            [newConstants.HOTEL_SEASONALITY_KEY]: id,
            [newConstants.ROOM_PLAN_KEY]: localFields[newConstants.ROOM_PLAN_KEY][newConstants.VALUE],
            [newConstants.ROOM_KEY]: localFields[newConstants.ROOM_KEY][newConstants.VALUE],
            [newConstants.HOTEL_KEY]: localFields[newConstants.HOTEL_KEY][newConstants.VALUE],
            [newConstants.EFFECTIVE_FROM]: localFields[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
            [newConstants.EFFECTIVE_TO]: localFields[newConstants.EFFECTIVE_TO][newConstants.VALUE],
            [newConstants.HOTEL_SEASONALITY_NAME]: localFields[newConstants.HOTEL_SEASONALITY_NAME][newConstants.VALUE],
            [newConstants.IS_SOLD_OUT]: localFields[newConstants.IS_SOLD_OUT][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.IS_INCLUSIVE_PRICE]: localFields[newConstants.IS_INCLUSIVE_PRICE][newConstants.VALUE],
            [newConstants.ROOM_RATE_B2B]: {
                [newConstants.TAX_VALUE]: parseFloat(rates["b2b-tax-value"][newConstants.VALUE]),
                [newConstants.SERVICE_VALUE]: parseFloat(rates["b2b-service-value"][newConstants.VALUE]),
                [newConstants.ADDITIONAL_VALUE]: parseFloat(rates["b2b-additional-value"][newConstants.VALUE]),
                [newConstants.AMENITY_VALUE]: parseFloat(rates["b2b-amenity-value"][newConstants.VALUE]),
                [newConstants.NET_VALUE]: parseFloat(rates["b2b-net-value"][newConstants.VALUE]),
            },
            [newConstants.ROOM_RATE_B2C]: {
                [newConstants.TAX_VALUE]: parseFloat(rates["b2c-tax-value"][newConstants.VALUE]),
                [newConstants.SERVICE_VALUE]: parseFloat(rates["b2c-service-value"][newConstants.VALUE]),
                [newConstants.ADDITIONAL_VALUE]: parseFloat(rates["b2c-additional-value"][newConstants.VALUE]),
                [newConstants.AMENITY_VALUE]: parseFloat(rates["b2c-amenity-value"][newConstants.VALUE]),
                [newConstants.NET_VALUE]: parseFloat(rates["b2c-net-value"][newConstants.VALUE]),
            },
            [newConstants.TAX_TYPE]: rates[newConstants.TAX_TYPE][newConstants.VALUE],
            [newConstants.SERVICE_TYPE]: rates[newConstants.SERVICE_TYPE][newConstants.VALUE],
            [newConstants.ADDITIONAL_TYPE]: rates[newConstants.ADDITIONAL_TYPE][newConstants.VALUE],
            [newConstants.ROOM_ALLOTMENT]: parseFloat(rates[newConstants.ROOM_ALLOTMENT][newConstants.VALUE]),
            [newConstants.IS_PAX_WISE]: localFields[newConstants.IS_PAX_WISE][newConstants.VALUE],
            [newConstants.ROOM_PLAN_PRICE_DETAILS]: seasionalties.filter((f) => f != null),
        },
    };
};


// Room price comments 
const getRoomPriceComments = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'room-price-comments/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
};


const createRoomPriceComments = (basicinfo, multi_language) => {
    let listAmmunityTypeLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.ROOM_PRICE_COMMENTS_DESC]: value[newConstants.ROOM_PRICE_COMMENTS_DESC][newConstants.VALUE],
            [newConstants.ROOM_PRICE_COMMENTS_TITLE]: value[newConstants.ROOM_PRICE_COMMENTS_TITLE][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });

    return {
        url: newBaseUrl + 'room-price-comments/save',
        pay_load: {
            [newConstants.ROOM_PRICE_COMMENTS_TITLE]: basicinfo[newConstants.ROOM_PRICE_COMMENTS_TITLE][newConstants.VALUE],
            [newConstants.ROOM_PRICE_COMMENTS_DESC]: basicinfo[newConstants.ROOM_PRICE_COMMENTS_DESC][newConstants.VALUE],
            [newConstants.ROOM_PRICE_COMMENTS_LANGUAGES]: listAmmunityTypeLangPack.filter((f) => f != null),
        },
    };
};

const RoomPriceCommentsInfoById = (id) => {
    return {
        url: newBaseUrl + 'room-price-comments/get-by-key',
        pay_load: {
            [newConstants.ROOM_PRICE_COMMENTS_KEY]: id,
        },
    };
};

const deleteRoomPriceComments = (id) => {
    return {
        url: newBaseUrl + 'room-price-comments/Delete',
        pay_load: {
            [newConstants.ROOM_PRICE_COMMENTS_KEY]: id,
        },
    };
};

const editRoomPriceComments = (id, basicinfo, multi_language) => {
    let listAmmunityTypeLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.ROOM_PRICE_COMMENTS_DESC]: value[newConstants.ROOM_PRICE_COMMENTS_DESC][newConstants.VALUE],
            [newConstants.ROOM_PRICE_COMMENTS_TITLE]: value[newConstants.ROOM_PRICE_COMMENTS_TITLE][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });

    return {
        url: newBaseUrl + 'room-price-comments/update',
        pay_load: {
            [newConstants.ROOM_PRICE_COMMENTS_KEY]: id,
            [newConstants.ROOM_PRICE_COMMENTS_TITLE]: basicinfo[newConstants.ROOM_PRICE_COMMENTS_TITLE][newConstants.VALUE],
            [newConstants.ROOM_PRICE_COMMENTS_DESC]: basicinfo[newConstants.ROOM_PRICE_COMMENTS_DESC][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: basicinfo[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.ROOM_PRICE_COMMENTS_LANGUAGES]: listAmmunityTypeLangPack,
        },
    };
};


// Hotel amenity 
const getAllAmmunity = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-amentiy/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
};

const createAmunity = (basicinfo, multi_language) => {
    let listAmmunityTypeLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.HOTEL_AMENITY_NAME]: value[newConstants.HOTEL_AMENITY_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });

    return {
        url: newBaseUrl + 'hotel-amentiy/save',
        pay_load: {
            [newConstants.HOTEL_AMENITY_NAME]: basicinfo[newConstants.HOTEL_AMENITY_NAME][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_TYPE_KEY]: basicinfo[newConstants.HOTEL_AMENITY_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_DEFAULT_PRICE]: parseFloat(
                basicinfo[newConstants.HOTEL_AMENITY_DEFAULT_PRICE][newConstants.VALUE],
            ),
            [newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE]: basicinfo[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE][
                newConstants.VALUE
            ] ?
                true : false,
            [newConstants.HOTEL_AMENITY_GLYPH_ICON]: basicinfo[newConstants.HOTEL_AMENITY_GLYPH_ICON][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_LANGUAGES]: listAmmunityTypeLangPack.filter((f) => f != null),
        },
    };
};

const editAmunity = (id, basicinfo, multi_language) => {
    let listAmmunityTypeLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.HOTEL_AMENITY_NAME]: value[newConstants.HOTEL_AMENITY_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });

    return {
        url: newBaseUrl + 'hotel-amentiy/update',
        pay_load: {
            [newConstants.HOTEL_AMENITY_KEY]: id,
            [newConstants.HOTEL_AMENITY_NAME]: basicinfo[newConstants.HOTEL_AMENITY_NAME][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_TYPE_KEY]: basicinfo[newConstants.HOTEL_AMENITY_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_DEFAULT_PRICE]: parseFloat(
                basicinfo[newConstants.HOTEL_AMENITY_DEFAULT_PRICE][newConstants.VALUE],
            ),
            [newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE]: basicinfo[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: basicinfo[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_GLYPH_ICON]: basicinfo[newConstants.HOTEL_AMENITY_GLYPH_ICON][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_LANGUAGES]: listAmmunityTypeLangPack.filter((f) => f != null),
        },
    };
};

const getAmmunityInfoById = (id) => {
    return {
        url: newBaseUrl + 'hotel-amentiy/get-by-key',
        pay_load: {
            [newConstants.HOTEL_AMENITY_KEY]: id,
        },
    };
};

const deleteAmmunity = (id) => {
    return {
        url: newBaseUrl + 'hotel-amentiy/delete',
        pay_load: {
            [newConstants.HOTEL_AMENITY_KEY]: id,
        },
    };
};

const getAmmunityTypeY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-amentiy-type/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};

// Hotel amenity type
const createAmmunityType = (localFields, multi_language) => {
    let listAmmunityTypeLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.HOTEL_AMENITY_TYPE_DESC]: value[newConstants.HOTEL_AMENITY_TYPE_DESC][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });

    return {
        url: newBaseUrl + 'hotel-amentiy-type/save',
        pay_load: {
            [newConstants.HOTEL_AMENITY_TYPE_DESC]: localFields[newConstants.HOTEL_AMENITY_TYPE_DESC][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON]: localFields[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_TYPE_LANGUAGES]: listAmmunityTypeLangPack.filter((f) => f != null),
        },
    };
};

const updateAmmunityType = (id, localFields, multi_language) => {
    let listAmmunityTypeLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_TYPE_DESC]: value[newConstants.HOTEL_AMENITY_TYPE_DESC][newConstants.VALUE],
        } :
            null;
    });

    return {
        url: newBaseUrl + 'hotel-amentiy-type/update',
        pay_load: {
            [newConstants.HOTEL_AMENITY_TYPE_KEY]: id,
            [newConstants.HOTEL_AMENITY_TYPE_DESC]: localFields[newConstants.HOTEL_AMENITY_TYPE_DESC][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON]: localFields[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.HOTEL_AMENITY_TYPE_LANGUAGES]: listAmmunityTypeLangPack.filter((f) => f != null),
        },
    };
};

const getAmmunityType = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-amentiy-type/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
};

const deleteAmmunityType = (id) => {
    return {
        url: newBaseUrl + 'hotel-amentiy-type/delete',
        pay_load: {
            [newConstants.HOTEL_AMENITY_TYPE_KEY]: id,
        },
    };
};

const getAmmunityTypeById = (id) => {
    return {
        url: newBaseUrl + 'hotel-amentiy-type/get-by-key',
        pay_load: {
            [newConstants.HOTEL_AMENITY_TYPE_KEY]: id,
        },
    };
};


// Near Place 
const getAllNearPlace = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-near-place/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
};
const getNearPlaceByKey = (key) => {
    return {
        url: newBaseUrl + 'hotel-near-place/get-by-key',
        pay_load: {
            [newConstants.HOTEL_NEAR_BY_PLACE_KEY]: key,
        },
    };
};
const deleteNearPlace = (key) => {
    return {
        url: newBaseUrl + 'hotel-near-place/Delete',
        pay_load: {
            [newConstants.HOTEL_NEAR_BY_PLACE_KEY]: key,
        },
    };
};
const createNearPlace = (localFields, multi_language) => {
    let nearPlaceLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: value[newConstants.HOTEL_NEAR_BY_PLACE_DESC][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'hotel-near-place/save',
        pay_load: {
            [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_DESC][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_PLACE_TYPE_KEY]: localFields[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE]: localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE][newConstants.VALUE],
            [newConstants.CITY_KEY]: localFields[newConstants.CITY_KEY][newConstants.VALUE],
            [newConstants.PROVINCE_KEY]: localFields[newConstants.PROVINCE_KEY][newConstants.VALUE],
            [newConstants.COUNTRY_KEY]: localFields[newConstants.COUNTRY_KEY][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_LANGUAGES]: nearPlaceLangPack.filter((f) => f != null),
        },
    };
};
const updateNearPlace = (key, localFields, multi_language) => {
    let nearPlaceLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: value[newConstants.HOTEL_NEAR_BY_PLACE_DESC][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'hotel-near-place/update',
        pay_load: {
            [newConstants.HOTEL_NEAR_BY_PLACE_KEY]: key,
            [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_DESC][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_PLACE_TYPE_KEY]: localFields[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE]: localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE][newConstants.VALUE],
            [newConstants.CITY_KEY]: localFields[newConstants.CITY_KEY][newConstants.VALUE],
            [newConstants.PROVINCE_KEY]: localFields[newConstants.PROVINCE_KEY][newConstants.VALUE],
            [newConstants.COUNTRY_KEY]: localFields[newConstants.COUNTRY_KEY][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_LANGUAGES]: nearPlaceLangPack.filter((f) => f != null),
        },
    };
};

const createClientForm = (key, localFields, multi_language) => {
    let nearPlaceLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: value[newConstants.HOTEL_NEAR_BY_PLACE_DESC][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'product-provider-type-link/update',
        pay_load: {
            [newConstants.HOTEL_NEAR_BY_PLACE_KEY]: key,
            [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_DESC][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_PLACE_TYPE_KEY]: localFields[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY][newConstants.VALUE],
            [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE]: localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.HOTEL_NEAR_BY_PLACE_LANGUAGES]: nearPlaceLangPack.filter((f) => f != null),
        },
    };
    console.log()
};


const getAllNearPlaceTypeY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-near-place-type/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
};



const deleteHotelInfo = (hotel_id) => {
    return {
        url: baseUrl + 'hotelmaster/delete-hotel-info',
        pay_load: {
            [constants.MASTER_HOTEL]: {
                [constants.HOTEL_ID]: hotel_id,
            },
        },
    };
};

const getAllHotelInfo = (id) => {
    return {
        url: baseUrl + 'hotelmaster/get-all-hotel-info',
        pay_load: {},
    };
};
// const createHotelType = (localFields) => {
//     return {
//         url: baseUrl + 'hotelmaster/create-hotel-type',
//         pay_load: {
//             [constants.PRODUCT_TYPE_PROVIDER_ID]: localFields[constants.PRODUCT_TYPE_PROVIDER_ID][constants.VALUE],
//             [constants.HOTEL_TYPE_DESC]: localFields[constants.HOTEL_TYPE_DESC][constants.VALUE],
//         },
//     };
// };
const updateHotelType = (id, localFields) => {
    return {
        url: baseUrl + 'hotelmaster/update-hotel-type',
        pay_load: {
            [constants.HOTEL_TYPE_ID]: id,
            [constants.PRODUCT_TYPE_PROVIDER_ID]: localFields[constants.PRODUCT_TYPE_PROVIDER_ID][constants.VALUE],
            [constants.HOTEL_TYPE_DESC]: localFields[constants.HOTEL_TYPE_DESC][constants.VALUE],
        },
    };
};
const deleteHotelType = (id) => {
    return {
        url: baseUrl + 'hotelmaster/delete-hotel-type-by-id',
        pay_load: {
            [constants.HOTEL_TYPE_ID]: id,
        },
    };
};
const getHotelTypeById = (id) => {
    return {
        url: baseUrl + 'hotelmaster/get-hotel-type-by-id',
        pay_load: {
            [constants.HOTEL_TYPE_ID]: id,
        },
    };
};
const getAllHotelType = () => {
    return {
        url: baseUrl + 'hotelmaster/get-hotel-type',
    };
};


const getProdcutProviderType = () => {
    return {
        url: baseUrl + '/hotelmaster/get-hotel-product-provider-type',
    };
};





// admin merge


const getHotelProductProviderType = () => {
    return {
        url: baseUrl + 'hotelmaster/get-hotel-product-provider-type',
        pay_load: {},
    };
};










const getCountry = (key) => {
    return {
        url: newBaseUrl + 'country/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: 25,
            [newConstants.DISPLAY_START]: 1,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: key ? key : '',
        },
    };
};
const countryGetByKey = (key) => {
    return {
        url: newBaseUrl + 'country/get-by-key',
        pay_load: {
            [newConstants.COUNTRY_KEY]: key,
        },
    };
};
const getCityByCountryKey = (key) => {
    return {
        url: newBaseUrl + 'city/get-by-country-key',
        pay_load: {
            [newConstants.COUNTRY_KEY]: key,
        },
    };
};
const cityGetByKey = (key) => {
    return {
        url: newBaseUrl + 'city/get-by-key',
        pay_load: {
            [newConstants.CITY_KEY]: key,
        },
    };
};
const provinceGetByCountryKey = (key) => {
    return {
        url: newBaseUrl + 'province/get-by-country-key',
        pay_load: {
            [newConstants.COUNTRY_KEY]: key,
        },
    };
};
const provinceGetByKey = (key) => {
    return {
        url: newBaseUrl + 'province/get-by-key',
        pay_load: {
            [newConstants.PROVINCE_KEY]: key,
        },
    };
};

const currencyGet = (search_key = '', start = 1, length = 250) => {
    return {
        url: newBaseUrl + 'currency/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
};


const imageUploder = (file, tag, type) => {
    return {
        url: newBaseUrl + 'api/upload',
        [newConstants.UPLOAD_FILE]: file,
        [newConstants.DOC_TYPE_KEY]: type,
        [newConstants.FORM_NAME]: tag,
    };
};



const getDocumentType = () => {
    return {
        url: newBaseUrl + 'api/getdocumenttype',
        pay_load: {
            [newConstants.DOCUMENT_TYPE_FLAG]: 'Jy5J7g07kKNVut9MJzsZcxJpbpGvOzAJ1aZfVQ4/NSE=',
        },
    };
};

const apiDownload = (key) => {
    return {
        url: newBaseUrl + 'api/download',
        [constants.HEADERS]: {
            [newConstants.C_FILE_KEY]: key,
            ['Response-Type']: 'blob',
        },
    };
};

const getAllNearPlaceType = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-near-place-type/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
};
const getHotelType = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'hotel-type/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
};

const getHotelId = (key) => {
    return {
        url: newBaseUrl + 'hotel-type/get-by-key',
        pay_load: {
            [newConstants.HOTEL_TYPE_KEY]: key,
        },
    };
};

const getNearPlaceTypeByKey = (key) => {
    return {
        url: newBaseUrl + 'hotel-near-place-type/get-by-key',
        pay_load: {
            [newConstants.HOTEL_NEAR_PLACE_TYPE_KEY]: key,
        },
    };
};
const deleteNearPlaceType = (key) => {
    return {
        url: newBaseUrl + 'hotel-near-place-type/Delete',
        pay_load: {
            [newConstants.HOTEL_NEAR_PLACE_TYPE_KEY]: key,
        },
    };
};
const createNearPlaceType = (localFields) => {
    return {
        url: newBaseUrl + 'hotel-near-place-type/save',
        pay_load: {
            [newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC][newConstants.VALUE],
            [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE]: localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE][newConstants.VALUE],
        },
    };
};
const updateNearPlaceType = (key, localFields) => {
    return {
        url: newBaseUrl + 'hotel-near-place-type/update',
        pay_load: {
            [newConstants.HOTEL_NEAR_PLACE_TYPE_KEY]: key,
            [newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC]: localFields[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC][newConstants.VALUE],
            [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE]: localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
        },
    };
};


const getLanguage = () => {
    return {
        url: newBaseUrl + 'language/get',
        pay_load: {},
    };
};

const languageGetByKey = (key) => {
    return {
        url: newBaseUrl + 'language/get-by-key',
        pay_load: {
            [newConstants.LANGUAGE_CODE]: key,
        },
    };
};


const mapSearchAutoComplete = (key) => {
    return {
        url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + key + '.json?access_token=' + MAPBOX_TOKEN,
    };
};

const getAllAccounts = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'client/accounts/ledger/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
};

const createAccounts = (localFields, multi_langauage) => {
    let ledgerLangPack = multi_langauage.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LEDGER_NAME]: value[newConstants.LEDGER_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'client/accounts/ledger/save',
        pay_load: {
            [newConstants.LEDGER_NAME]: localFields[newConstants.LEDGER_NAME][newConstants.VALUE],
            [newConstants.LEDGER_GROUP_KEY]: localFields[newConstants.LEDGER_GROUP_KEY][newConstants.VALUE],
            [newConstants.LEDGER_OPENING_BALANCE]: parseFloat(localFields[newConstants.LEDGER_OPENING_BALANCE][newConstants.VALUE]),
            [newConstants.LEDGER_CURRENCY_CODE]: localFields[newConstants.LEDGER_CURRENCY_CODE][newConstants.VALUE],
            [newConstants.LEDGER_BALANCE]: parseFloat(localFields[newConstants.LEDGER_BALANCE][newConstants.VALUE]),
            [newConstants.LEDGER_OPENING_DATE]: localFields[newConstants.LEDGER_OPENING_DATE][newConstants.VALUE],
            [newConstants.LEDGER_LANGUAGES]: ledgerLangPack.filter((f) => f != null),
        },
    };
};

const updateAccounts = (key, localFields, multi_langauage) => {
    let ledgerLangPack = multi_langauage.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LEDGER_NAME]: value[newConstants.LEDGER_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + 'client/accounts/ledger/update',
        pay_load: {
            [newConstants.LEDGER_KEY]: key,
            [newConstants.LEDGER_NAME]: localFields[newConstants.LEDGER_NAME][newConstants.VALUE],
            [newConstants.LEDGER_GROUP_KEY]: localFields[newConstants.LEDGER_GROUP_KEY][newConstants.VALUE],
            [newConstants.LEDGER_OPENING_BALANCE]: parseFloat(localFields[newConstants.LEDGER_OPENING_BALANCE][newConstants.VALUE]),
            [newConstants.LEDGER_CURRENCY_CODE]: localFields[newConstants.LEDGER_CURRENCY_CODE][newConstants.VALUE],
            [newConstants.LEDGER_OPENING_DATE]: localFields[newConstants.LEDGER_OPENING_DATE][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.LEDGER_LANGUAGES]: ledgerLangPack.filter((f) => f != null),
        },
    };
};
const getAccountsByKey = (key) => {
    return {
        url: newBaseUrl + 'client/accounts/ledger/get-by-key',
        pay_load: {
            [newConstants.LEDGER_KEY]: key,
        },
    };
};
const deleteAccounts = (key) => {
    return {
        url: newBaseUrl + 'client/accounts/ledger/delete',
        pay_load: {
            [newConstants.LEDGER_KEY]: key,
        },
    };
};


const getAllAccountsGroup = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'client/accounts/ledger-group/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
};
const getAllAccountsGroupY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'client/accounts/ledger-group/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y",
        },
    };
};
const createAccountsGroup = (localFields, multi_language) => {
    let ledgerGroupLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LEDGER_GROUP_NAME]: value[newConstants.LEDGER_GROUP_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + "client/accounts/ledger-group/save",
        pay_load: {
            [newConstants.LEDGER_GROUP_NAME]: localFields[newConstants.LEDGER_GROUP_NAME][newConstants.VALUE],
            [newConstants.LEDGER_GROUP_PARENT_KEY]: localFields[newConstants.LEDGER_GROUP_PARENT_KEY][newConstants.VALUE],
            [newConstants.LEDGER_GROUP_LANGUAGES]: ledgerGroupLangPack.filter((f) => f != null)
        }
    }
}
const updateAccountsGroup = (key, localFields, multi_language) => {
    let ledgerGroupLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.LEDGER_GROUP_NAME]: value[newConstants.LEDGER_GROUP_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });
    return {
        url: newBaseUrl + "client/accounts/ledger-group/update",
        pay_load: {
            [newConstants.LEDGER_GROUP_KEY]: key,
            [newConstants.LEDGER_GROUP_NAME]: localFields[newConstants.LEDGER_GROUP_NAME][newConstants.VALUE],
            [newConstants.LEDGER_GROUP_PARENT_KEY]: localFields[newConstants.LEDGER_GROUP_PARENT_KEY][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.LEDGER_GROUP_LANGUAGES]: ledgerGroupLangPack.filter((f) => f != null)
        }
    }
}
const getAccountsGroupByKey = (key) => {
    return {
        url: newBaseUrl + "client/accounts/ledger-group/get-by-key",
        pay_load: {
            [newConstants.LEDGER_GROUP_KEY]: key
        }
    }
}
const deleteAccountsGroup = (key) => {
    return {
        url: newBaseUrl + "client/accounts/ledger-group/delete",
        pay_load: {
            [newConstants.LEDGER_GROUP_KEY]: key
        }
    }
}
const getAllAccountsGroupParent = () => {
    return {
        url: newBaseUrl + "client/accounts/ledger-group/ledger-group-by-parent",
        pay_load: {}
    }
}

const getAllAccountsGroupParentBankCash = () => {
    return {
        url: newBaseUrl + "client/accounts/ledger-group/ledger-group-by-parent-bank-cash",
        pay_load: {}
    }
}


const getLedgerAccountKey = (key) => {
    return {
        url: newBaseUrl + "client/accounts/ledger/ledger-by-ledger-group",
        pay_load: {
            [newConstants.LEDGER_GROUP_KEY]: key
        }
    }
}

const getMopeAccount = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'client/accounts/mop/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
}


const getMopRemark = () => {
    return {
        url: newBaseUrl + "client/accounts/mop/remark-fields",
        pay_load: {}
    }
}


const createAccountMop = (localFields, multi_language, detail) => {
    let ledgerPaymentLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.MOP_NAME]: value[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });

    let mopDetail = detail.map((value) => {
        return value[newConstants.LEDGER_KEY][newConstants.VALUE] != '' ? {
            [newConstants.LEDGER_KEY]: value[newConstants.LEDGER_KEY][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_TYPE]: value[newConstants.MOP_REMARK_FIELD1_TYPE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_CAPTION]: value[newConstants.MOP_REMARK_FIELD1_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_TYPE]: value[newConstants.MOP_REMARK_FIELD2_TYPE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_CAPTION]: value[newConstants.MOP_REMARK_FIELD2_CAPTION][newConstants.VALUE],
        } :
            null;
    });

    return {
        url: newBaseUrl + "client/accounts/mop/save",
        pay_load: {
            [newConstants.MOP_NAME]: localFields[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.MOP_DETAIL]: mopDetail,
            [newConstants.MODEOF_PAYMASTER_LANGUAGES]: ledgerPaymentLangPack.filter((f) => f != null)
        }
    }
}

const getMopKey = (key) => {
    return {
        url: newBaseUrl + "client/accounts/mop/get-by-key",
        pay_load: {
            [newConstants.MOP_MASTER_KEY]: key
        }
    }
}

const deleteAccountMop = (key) => {
    return {
        url: newBaseUrl + "client/accounts/mop/delete",
        pay_load: {
            [newConstants.MOP_MASTER_KEY]: key
        }
    }
}


const updateAccountMop = (id, localFields, multi_language, detail) => {
    let ledgerPaymentLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
            [newConstants.MOP_NAME]: value[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
        } :
            null;
    });

    let mopDetail = detail.map((value) => {
        return value[newConstants.LEDGER_KEY][newConstants.VALUE] != '' ? {
            [newConstants.LEDGER_KEY]: value[newConstants.LEDGER_KEY][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_TYPE]: value[newConstants.MOP_REMARK_FIELD1_TYPE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_CAPTION]: value[newConstants.MOP_REMARK_FIELD1_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_TYPE]: value[newConstants.MOP_REMARK_FIELD2_TYPE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_CAPTION]: value[newConstants.MOP_REMARK_FIELD2_CAPTION][newConstants.VALUE],
        } :
            null;
    });

    return {
        url: newBaseUrl + "client/accounts/mop/update",
        pay_load: {
            [newConstants.MOP_MASTER_KEY]: id,
            [newConstants.MOP_NAME]: localFields[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.MOP_DETAIL]: mopDetail,
            [newConstants.MODEOF_PAYMASTER_LANGUAGES]: ledgerPaymentLangPack.filter((f) => f != null)
        }
    }
}


const generateTicketPlanPriceList = (localFields) => {
    return {
        url: newBaseUrl + 'ticket-plan-price/generate-ticket-plan-price-list',
        pay_load: {
            [newConstants.TICKET_PLAN_KEY]: localFields[newConstants.TICKET_PLAN_KEY][newConstants.VALUE],
            [newConstants.TICKET_KEY]: localFields[newConstants.TICKET_KEY][newConstants.VALUE],
            [newConstants.TICKET_TYPE_KEY]: localFields[newConstants.TICKET_TYPE_KEY][newConstants.VALUE],
            [newConstants.EFFECTIVE_FROM]: localFields[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
            [newConstants.EFFECTIVE_TO]: localFields[newConstants.EFFECTIVE_TO][newConstants.VALUE],
            [newConstants.TICKET_RATE_B2C]: parseFloat(localFields[newConstants.TICKET_RATE_B2C][newConstants.VALUE]),
            [newConstants.TICKET_RATE_B2B]: parseFloat(localFields[newConstants.TICKET_RATE_B2B][newConstants.VALUE]),
            [newConstants.TAX_VALUE]: parseFloat(localFields[newConstants.TAX_VALUE][newConstants.VALUE]),
            [newConstants.SERVICE_VALUE]: parseFloat(localFields[newConstants.SERVICE_VALUE][newConstants.VALUE]),
            [newConstants.ADDITIONAL_VALUE]: parseFloat(localFields[newConstants.ADDITIONAL_VALUE][newConstants.VALUE]),
            [newConstants.IS_FLAT_TAX_RATE]: Number(localFields[newConstants.IS_FLAT_TAX_RATE][newConstants.VALUE]),
            [newConstants.IS_FLAT_SERVICE_RATE]: Number(localFields[newConstants.IS_FLAT_SERVICE_RATE][newConstants.VALUE]),
            [newConstants.IS_FLAT_ADDITIONAL_RATE]: Number(localFields[newConstants.IS_FLAT_ADDITIONAL_RATE][newConstants.VALUE]),
            [newConstants.IS_INCLUSIVE_PRICE]: Number(localFields[newConstants.IS_INCLUSIVE_PRICE][newConstants.VALUE]),
        },
    };
};


const TicketPlanGetKey = (key) => {
    return {
        url: newBaseUrl + "ticket-plan/get-by-ticket-key",
        pay_load: {
            [newConstants.TICKET_KEY]: key
        }
    }
}


const getAllBankMaster = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'admin/accounts/bank/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
}
const getBankMasterByKey = (key) => {
    return {
        url: newBaseUrl + "admin/accounts/bank/get-by-key",
        pay_load: {
            [newConstants.BANK_KEY]: key
        }
    }
}
const deleteBankMaster = (key) => {
    return {
        url: newBaseUrl + "admin/accounts/bank/delete",
        pay_load: {
            [newConstants.BANK_KEY]: key
        }
    }
}
const createBankMaster = (localFields, multi_language) => {
    let bankLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != "" ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.BANK_NAME]: value[newConstants.BANK_NAME][newConstants.VALUE],
            [newConstants.BANK_BRANCH_NAME]: value[newConstants.BANK_BRANCH_NAME][newConstants.VALUE],
        } : null
    })
    return {
        url: newBaseUrl + "admin/accounts/bank/save",
        pay_load: {
            [newConstants.BANK_NAME]: localFields[newConstants.BANK_NAME][newConstants.VALUE],
            [newConstants.LEDGER_GROUP_KEY]: localFields[newConstants.LEDGER_GROUP_KEY][newConstants.VALUE],
            [newConstants.BANK_ACCOUNT_NO]: localFields[newConstants.BANK_ACCOUNT_NO][newConstants.VALUE],
            [newConstants.BANK_ADDRESS]: localFields[newConstants.BANK_ADDRESS][newConstants.VALUE],
            [newConstants.LEDGER_CURRENCY_CODE]: localFields[newConstants.LEDGER_CURRENCY_CODE][newConstants.VALUE],
            [newConstants.BANK_CITY_KEY]: localFields[newConstants.BANK_CITY_KEY][newConstants.VALUE],
            [newConstants.BANK_PROVINCE_KEY]: localFields[newConstants.BANK_PROVINCE_KEY][newConstants.VALUE],
            [newConstants.BANK_COUNTRY_KEY]: localFields[newConstants.BANK_COUNTRY_KEY][newConstants.VALUE],
            [newConstants.BANK_POSTCODE]: localFields[newConstants.BANK_POSTCODE][newConstants.VALUE],
            [newConstants.BANK_FAX]: localFields[newConstants.BANK_FAX][newConstants.VALUE],
            [newConstants.BANK_TEL]: localFields[newConstants.BANK_TEL][newConstants.VALUE],
            [newConstants.BANK_EMAIL]: localFields[newConstants.BANK_EMAIL][newConstants.VALUE],
            [newConstants.BANK_BRANCH_NAME]: localFields[newConstants.BANK_BRANCH_NAME][newConstants.VALUE],
            [newConstants.BANK_LANGUAGES]: bankLangPack.filter((f) => f != null)
        }
    }
}
const updateBankMaster = (key, localFields, multi_language) => {
    let bankLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != "" ? {
            [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            [newConstants.BANK_NAME]: value[newConstants.BANK_NAME][newConstants.VALUE],
            [newConstants.BANK_BRANCH_NAME]: value[newConstants.BANK_BRANCH_NAME][newConstants.VALUE],
        } : null
    })
    return {
        url: newBaseUrl + "admin/accounts/bank/update",
        pay_load: {
            [newConstants.BANK_KEY]: key,
            [newConstants.BANK_NAME]: localFields[newConstants.BANK_NAME][newConstants.VALUE],
            [newConstants.LEDGER_GROUP_KEY]: localFields[newConstants.LEDGER_GROUP_KEY][newConstants.VALUE],
            [newConstants.BANK_ACCOUNT_NO]: localFields[newConstants.BANK_ACCOUNT_NO][newConstants.VALUE],
            [newConstants.BANK_ADDRESS]: localFields[newConstants.BANK_ADDRESS][newConstants.VALUE],
            [newConstants.LEDGER_CURRENCY_CODE]: localFields[newConstants.LEDGER_CURRENCY_CODE][newConstants.VALUE],
            [newConstants.BANK_CITY_KEY]: localFields[newConstants.BANK_CITY_KEY][newConstants.VALUE],
            [newConstants.BANK_PROVINCE_KEY]: localFields[newConstants.BANK_PROVINCE_KEY][newConstants.VALUE],
            [newConstants.BANK_COUNTRY_KEY]: localFields[newConstants.BANK_COUNTRY_KEY][newConstants.VALUE],
            [newConstants.BANK_POSTCODE]: localFields[newConstants.BANK_POSTCODE][newConstants.VALUE],
            [newConstants.BANK_FAX]: localFields[newConstants.BANK_FAX][newConstants.VALUE],
            [newConstants.BANK_TEL]: localFields[newConstants.BANK_TEL][newConstants.VALUE],
            [newConstants.BANK_EMAIL]: localFields[newConstants.BANK_EMAIL][newConstants.VALUE],
            [newConstants.BANK_BRANCH_NAME]: localFields[newConstants.BANK_BRANCH_NAME][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.BANK_LANGUAGES]: bankLangPack.filter((f) => f != null)
        }
    }
}
const getLedgerGroupByParentBank = () => {
    return {
        url: newBaseUrl + "admin/accounts/bank/ledger-group-by-parent-bank-cash",
        pay_load: {}
    }
}



const getAllLedgerJournal = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'client/accounts/ledgerjournal/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
}
const getLedgerJournalByKey = (key) => {
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/get-by-key",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key
        }
    }
}
const deleteLedgerJournal = (key) => {
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/delete",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key
        }
    }
}
const createLedgerJournal = (localFields, transDetails, generate, generateLedger, generateAccountName) => {
    let trans_details = {
        [newConstants.LEDGER_KEY]: transDetails[newConstants.LEDGER_KEY][newConstants.VALUE],
        [newConstants.LEDGER_NAME]: generateLedger[newConstants.LEDGER_NAME][newConstants.VALUE],
        [newConstants.ACCOUNT_KEY]: transDetails[newConstants.ACCOUNT_KEY][newConstants.VALUE],
        [newConstants.ACCOUNT_NAME]: generateAccountName[newConstants.ACCOUNT_NAME][newConstants.VALUE],
        [newConstants.TXN_AMOUNT]: parseFloat(transDetails[newConstants.TXN_AMOUNT][newConstants.VALUE]),
    }
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/save",
        pay_load: {
            [newConstants.TXN_DATE]: localFields[newConstants.TXN_DATE][newConstants.VALUE],
            [newConstants.TXN_TYPE]: localFields[newConstants.TXN_TYPE][newConstants.VALUE],
            [newConstants.MOP_MASTER_KEY]: localFields[newConstants.MOP_MASTER_KEY][newConstants.VALUE],
            [newConstants.MOP_NAME]: generate[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_CAPTION]: generate[newConstants.MOP_REMARK_FIELD1_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD1_VALUE]: generate[newConstants.MOP_REMARKS_FIELD1_VALUE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_CAPTION]: generate[newConstants.MOP_REMARK_FIELD2_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD2_VALUE]: generate[newConstants.MOP_REMARKS_FIELD2_VALUE][newConstants.VALUE],
            [newConstants.TXN_REC_AMOUNT]: parseFloat(localFields[newConstants.TXN_REC_AMOUNT][newConstants.VALUE]),
            [newConstants.TXN_REMARKS]: localFields[newConstants.TXN_REMARKS][newConstants.VALUE],
            [newConstants.LEDGER_TRANS_DETAILS]: trans_details
        }
    }
}
const updateLedgerJournal = (key, localFields, transDetails, generate, generateLedger, generateAccountName) => {
    let trans_details = {
        [newConstants.LEDGER_KEY]: transDetails[newConstants.LEDGER_KEY][newConstants.VALUE],
        [newConstants.LEDGER_NAME]: generateLedger[newConstants.LEDGER_NAME][newConstants.VALUE],
        [newConstants.ACCOUNT_KEY]: transDetails[newConstants.ACCOUNT_KEY][newConstants.VALUE],
        [newConstants.ACCOUNT_NAME]: generateAccountName[newConstants.ACCOUNT_NAME][newConstants.VALUE],
        [newConstants.TXN_AMOUNT]: parseFloat(transDetails[newConstants.TXN_AMOUNT][newConstants.VALUE]),
    }
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/update",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key,
            [newConstants.TXN_DATE]: localFields[newConstants.TXN_DATE][newConstants.VALUE],
            [newConstants.TXN_TYPE]: localFields[newConstants.TXN_TYPE][newConstants.VALUE],
            [newConstants.MOP_MASTER_KEY]: localFields[newConstants.MOP_MASTER_KEY][newConstants.VALUE],
            [newConstants.MOP_NAME]: generate[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_CAPTION]: generate[newConstants.MOP_REMARK_FIELD1_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD1_VALUE]: generate[newConstants.MOP_REMARKS_FIELD1_VALUE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_CAPTION]: generate[newConstants.MOP_REMARK_FIELD2_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD2_VALUE]: generate[newConstants.MOP_REMARKS_FIELD2_VALUE][newConstants.VALUE],
            [newConstants.TXN_REC_AMOUNT]: parseFloat(localFields[newConstants.TXN_REC_AMOUNT][newConstants.VALUE]),
            [newConstants.TXN_REMARKS]: localFields[newConstants.TXN_REMARKS][newConstants.VALUE],
            [newConstants.LEDGER_TRANS_DETAILS]: trans_details
        }
    }

}

const getAllAccountsExpense = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'client/accounts/expense/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
}
const getAccountsExpenseByKey = (key) => {
    return {
        url: newBaseUrl + "client/accounts/expense/get-by-key",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key
        }
    }
}
const deleteAccountsExpense = (key) => {
    return {
        url: newBaseUrl + "client/accounts/expense/delete",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key
        }
    }
}
const getExpenseByKey = (key) => {
    return {
        url: newBaseUrl + 'client/accounts/ledger/get-by-key',
        pay_load: {
            [newConstants.LEDGER_KEY]: key,
        },
    };
};
const createAccountsExpense = (localFields, transDetails, generate, generateLedger, generateAccountName) => {
    let trans_details = {
        [newConstants.LEDGER_KEY]: transDetails[newConstants.LEDGER_KEY][newConstants.VALUE],
        [newConstants.LEDGER_NAME]: generateLedger[newConstants.LEDGER_NAME][newConstants.VALUE],
        [newConstants.ACCOUNT_KEY]: transDetails[newConstants.ACCOUNT_KEY][newConstants.VALUE],
        [newConstants.ACCOUNT_NAME]: generateAccountName[newConstants.ACCOUNT_NAME][newConstants.VALUE],
        [newConstants.TXN_AMOUNT]: parseFloat(transDetails[newConstants.TXN_AMOUNT][newConstants.VALUE]),
    }
    return {
        url: newBaseUrl + "client/accounts/expense/save",
        pay_load: {
            [newConstants.TXN_DATE]: localFields[newConstants.TXN_DATE][newConstants.VALUE],
            [newConstants.TXN_TYPE]: localFields[newConstants.TXN_TYPE][newConstants.VALUE],
            [newConstants.MOP_MASTER_KEY]: localFields[newConstants.MOP_MASTER_KEY][newConstants.VALUE],
            [newConstants.MOP_NAME]: generate[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_CAPTION]: generate[newConstants.MOP_REMARK_FIELD1_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD1_VALUE]: generate[newConstants.MOP_REMARKS_FIELD1_VALUE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_CAPTION]: generate[newConstants.MOP_REMARK_FIELD2_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD2_VALUE]: generate[newConstants.MOP_REMARKS_FIELD2_VALUE][newConstants.VALUE],
            [newConstants.TXN_REC_AMOUNT]: parseFloat(localFields[newConstants.TXN_REC_AMOUNT][newConstants.VALUE]),
            [newConstants.TXN_REMARKS]: localFields[newConstants.TXN_REMARKS][newConstants.VALUE],
            [newConstants.LEDGER_TRANS_DETAILS]: trans_details
        }
    }
}
const updateAccountsExpense = (key, localFields, transDetails, generate, generateLedger, generateAccountName) => {
    let trans_details = {
        [newConstants.LEDGER_KEY]: transDetails[newConstants.LEDGER_KEY][newConstants.VALUE],
        [newConstants.LEDGER_NAME]: generateLedger[newConstants.LEDGER_NAME][newConstants.VALUE],
        [newConstants.ACCOUNT_KEY]: transDetails[newConstants.ACCOUNT_KEY][newConstants.VALUE],
        [newConstants.ACCOUNT_NAME]: generateAccountName[newConstants.ACCOUNT_NAME][newConstants.VALUE],
        [newConstants.TXN_AMOUNT]: parseFloat(transDetails[newConstants.TXN_AMOUNT][newConstants.VALUE]),
    }
    return {
        url: newBaseUrl + "client/accounts/expense/update",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key,
            [newConstants.TXN_DATE]: localFields[newConstants.TXN_DATE][newConstants.VALUE],
            [newConstants.TXN_TYPE]: localFields[newConstants.TXN_TYPE][newConstants.VALUE],
            [newConstants.MOP_MASTER_KEY]: localFields[newConstants.MOP_MASTER_KEY][newConstants.VALUE],
            [newConstants.MOP_NAME]: generate[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_CAPTION]: generate[newConstants.MOP_REMARK_FIELD1_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD1_VALUE]: generate[newConstants.MOP_REMARKS_FIELD1_VALUE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_CAPTION]: generate[newConstants.MOP_REMARK_FIELD2_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD2_VALUE]: generate[newConstants.MOP_REMARKS_FIELD2_VALUE][newConstants.VALUE],
            [newConstants.TXN_REC_AMOUNT]: parseFloat(localFields[newConstants.TXN_REC_AMOUNT][newConstants.VALUE]),
            [newConstants.TXN_REMARKS]: localFields[newConstants.TXN_REMARKS][newConstants.VALUE],
            [newConstants.LEDGER_TRANS_DETAILS]: trans_details
        }
    }
}
const getAllTransType = () => {
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/trans-types",
        pay_load: {}
    }
}

const getAllTnxType = () => {
    return {
        url: newBaseUrl + "client/accounts/expense/trans-types",
        pay_load: {}
    }
}

const getAccountByMopKey = (key) => {
    return {
        url: newBaseUrl + "client/accounts/mop/ledger-accounts-by-mopkey",
        pay_load: {
            [newConstants.MOP_MASTER_KEY]: key
        }
    }
}
const getAccountsByAccountsGroupType = () => {
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/ledger-by-ledger-group-types",
        pay_load: {}
    }
}
const getAccountsByExpenseGroupType = () => {
    return {
        url: newBaseUrl + "client/accounts/expense/ledger-by-ledger-group-types",
        pay_load: {}
    }
}
const getCurrencyByKey = (key) => {
    return {
        url: newBaseUrl + "currency/get-by-key",
        pay_load: {
            [newConstants.BASE_CURRENCY]: key
        }
    }
}
const updateCurrency = (currencyArray) => {
    let currencyPack = currencyArray.map((value) => {
        return value[newConstants.CURRENCY_CODE][newConstants.VALUE] != "" ? {
            [newConstants.CURRENCY_CODE]: value[newConstants.CURRENCY_CODE][newConstants.VALUE],
            [newConstants.BASE_CURRENCY]: value[newConstants.BASE_CURRENCY][newConstants.VALUE],
            [newConstants.MARGIN_TYPE_VALUE]: value[newConstants.MARGIN_TYPE_VALUE][newConstants.VALUE],
            [newConstants.MARGIN_RATE]: value[newConstants.MARGIN_RATE][newConstants.VALUE],
            [newConstants.BUY_MARGIN_TYPE_VALUE]: value[newConstants.BUY_MARGIN_TYPE_VALUE][newConstants.VALUE],
            [newConstants.BUY_MARGIN_RATE]: value[newConstants.BUY_MARGIN_RATE][newConstants.VALUE]
        } :
            null
    })
    return {
        url: newBaseUrl + "currency/update",
        pay_load: currencyPack.filter((f) => f != null)

    }
}
const getAllPurchaseInvoice = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'admin/accounts/purchaseinvoice/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
}
const createPurchaseInvoice = (localFields, purchaseDetails, purchaseExcelData) => {
    let purchaseDetailsPack = purchaseDetails.map((value) => {
        return {
            [newConstants.TICKET_TYPE_NAME]: value[newConstants.TICKET_TYPE_NAME][newConstants.VALUE],
            [newConstants.TICKET_QUANTITY]: parseInt(value[newConstants.TICKET_QUANTITY][newConstants.VALUE]),
            [newConstants.TICKET_TYPE_KEY]: value[newConstants.TICKET_TYPE_KEY][newConstants.VALUE],
            [newConstants.TICKET_STOCK_KEY]: value[newConstants.TICKET_STOCK_KEY][newConstants.VALUE],
            [newConstants.IS_ZERO_COST]: Number(value[newConstants.IS_ZERO_COST][newConstants.VALUE]),
            [newConstants.TICKET_PREFIX]: value[newConstants.TICKET_PREFIX][newConstants.VALUE],
            [newConstants.TICKET_CODE_LENGTH]: parseInt(value[newConstants.TICKET_CODE_LENGTH][newConstants.VALUE]),
            [newConstants.TICKET_SUFFIX]: value[newConstants.TICKET_SUFFIX][newConstants.VALUE],
            [newConstants.TICKET_START_NUMBER]: value[newConstants.TICKET_START_NUMBER][newConstants.VALUE],
            [newConstants.TICKET_END_NUMBER]: value[newConstants.TICKET_END_NUMBER][newConstants.VALUE],
            [newConstants.TICKET_COST]: parseInt(value[newConstants.TICKET_COST][newConstants.VALUE]),
            [newConstants.TICKET_MRP]: parseInt(value[newConstants.TICKET_MRP][newConstants.VALUE])
        }
    })
    let excelDataPack = purchaseExcelData.map((value) => {
        return {
            [newConstants.SNO]: parseInt(value[newConstants.SNO]),
            [newConstants.TICKET_TYPE_NAME]: value[newConstants.TICKET_TYPE_NAME],
            [newConstants.SERIAL_NUMBER]: value[newConstants.SERIAL_NUMBER],
            [newConstants.QR_OR_BARCODE_DATA]: value[newConstants.QR_OR_BARCODE_DATA],
            [newConstants.COMMENTS]: value[newConstants.COMMENTS],

        }
    })
    return {
        url: newBaseUrl + "admin/accounts/purchaseinvoice/save",
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: localFields[newConstants.TICKET_SUPPLIER_KEY][newConstants.VALUE],
            [newConstants.TICKET_KEY]: localFields[newConstants.TICKET_KEY][newConstants.VALUE],
            [newConstants.TICKET_PLAN_KEY]: localFields[newConstants.TICKET_PLAN_KEY][newConstants.VALUE],
            [newConstants.INVOICE_REF_NUMBER]: localFields[newConstants.INVOICE_REF_NUMBER][newConstants.VALUE],
            [newConstants.INVOICE_DATE]: localFields[newConstants.INVOICE_DATE][newConstants.VALUE],
            [newConstants.EXPIRY_DAYS]: localFields[newConstants.EXPIRY_DAYS][newConstants.VALUE],
            [newConstants.PURCHASE_INVOICE_DETAILS]: purchaseDetailsPack,
            [newConstants.PURCHASE_INVOICE_EXCEL_DATA]: excelDataPack,
        }
    }
}
const getPurchaseInvoiceByKey = (key) => {
    return {
        url: newBaseUrl + "admin/accounts/purchaseinvoice/get-by-key",
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: key
        }
    }
}
// dashboard data fetching
//Date Sales c
const getDashDailySales = (dateValue) => {
    return {
        url: newBaseUrl + "dashboard/sales/daily-sales/",
        pay_load: {
            [newConstants.SEARCH_VALUE]: dateValue
        }
    }
}
//Hourly Sales 
const getHourlySales = (dateValue) => {
    return {
        url: newBaseUrl + "dashboard/sales/hourly-sales/",
        pay_load: {
            [newConstants.SEARCH_VALUE]: dateValue
        }
    }
}
// monthly sale c
const getMothlySales = (dateValue) => {
    return {
        url: newBaseUrl + "dashboard/sales/monthly-sales/",
        pay_load: {
            [newConstants.SEARCH_VALUE]: dateValue
        }
    }
}
//Yearly Sales in 
const getYearlySales = (dateValue) => {
    return {
        url: newBaseUrl + "dashboard/sales/yearly-sales/",
        pay_load: {
            [newConstants.SEARCH_VALUE]: dateValue
        }
    }
}
// Recent Booking c
const getRecentBooking = (dateValue) => {
    return {
        url: newBaseUrl + "dashboard/sales/recent-bookings/",
        pay_load: {
            [newConstants.SEARCH_VALUE]: dateValue
        }
    }
}


const LedgerAccountSupplier = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'client/accounts/ledger-group/accounts-group-by-supplier',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "Y"
        },
    };
}



//agent login
const agentLogin = (UserName, Password, lang = "en-US") => {
    return {
        url: newBaseUrl + 'client/user/login',
        // [constants.HEADERS]: {
        //   [newConstants.ACCEPT_LANGUAGE]: lang
        // },
        pay_load: {
            [newConstants.USER_NAME]: UserName,
            [newConstants.PASSWORD]: Password,
        },
    };
};

const isEmailExist = (EmailId) => {
    return {
        url: newBaseUrl + 'client/user/is-email-exist',
        pay_load: {
            [newConstants.EMAIL_ID]: EmailId,
        },
    };
};

const verifyEmail = (email) => {
    return {
        url: newBaseUrl + 'client/user/verify-email',
        pay_load: {
            [newConstants.ENCRYPT_EMAIL]: email,
        },
    };
};

const getAllCityByCountryId = (id) => {
    return {
        url: baseUrl + 'marketmaster/get-all-city-by-country-id',
        pay_load: {
            [constants.COUNTRY_CITY_DTO]: {
                [constants.COUNTRY_ID]: parseInt(id)
            },
        },
    };
};

const getAllStateByCountryId = (id) => {
    return {
        url: baseUrl + 'marketmaster/get-all-state-by-country-id',
        pay_load: {
            [constants.COUNTRY_ID]: parseInt(id),
        },
    };
};

const createAgentBySignup = ({ email, cname, phone }) => {
    return {
        url: newBaseUrl + 'client/user/clientsimplesignup',
        pay_load: {
            [newConstants.EMAIL_ID]: email,
            [newConstants.COMPANY_NAME]: cname,
            [newConstants.CONTACT_NO]: phone
        },
    };
};

const forgotPasswordRequest = ({ email }) => {
    return {
        url: newBaseUrl + 'client/user/forgotpassword',
        pay_load: {
            [newConstants.EMAIL_ID]: email
        },
    };
};

const updatePassword = (email, pass, cpass) => {
    return {
        url: newBaseUrl + 'client/user/updatepassword',
        pay_load: {
            [newConstants.EMAIL_ID]: email,
            [newConstants.PASSWORD]: pass,
            [newConstants.CPASSWORD]: cpass,
        },
    };
};

const resetPassword = (email, pass, cpass) => {
    return {
        url: newBaseUrl + 'client/user/resetpassword',
        pay_load: {
            [newConstants.EMAIL_ID]: email,
            [newConstants.PASSWORD]: pass,
            [newConstants.CPASSWORD]: cpass,
        },
    };
};
const agentSaveClientInfo = (basic_info, branch_info, documents) => {
    let CLIENT_BRANCH_INFOS = [];
    branch_info.forEach((value, index) => {
        CLIENT_BRANCH_INFOS.push({
            ["clientBranchRegNo"]: value[newConstants.CLIENT_BRANCH_REG_NO][newConstants.VALUE],
            ["clientBranchName"]: value[newConstants.CLIENT_BRANCH_NAME][newConstants.VALUE],
            ["clientBranchAddress"]: value[newConstants.CLIENT_BRANCH_ADDRESS][newConstants.VALUE],
            ["clientBranchCity"]: value[newConstants.CLIENT_BRANCH_CITY][newConstants.VALUE],
            ["clientBranchState"]: value[newConstants.CLIENT_BRANCH_STATE][newConstants.VALUE],
            ["clientBranchCountry"]: value[newConstants.CLIENT_BRANCH_COUNTRY][newConstants.VALUE],
            ["clientBranchPostCode"]: value[newConstants.CLIENT_BRANCH_POST_CODE][newConstants.VALUE],
            ["clientBranchRemark"]: value[newConstants.CLIENT_BRANCH_REMARK][newConstants.VALUE],
            ["clientBranchTeleNo1"]: value[newConstants.CLIENT_BRANCH_TELE_NO1][newConstants.VALUE],
            ["clientBranchTeleNo2"]: value[newConstants.CLIENT_BRANCH_TELE_NO2][newConstants.VALUE],
            ["clientBranchMobileNo1"]: value[newConstants.CLIENT_BRANCH_MOBILE_NO1][newConstants.VALUE],
            ["clientBranchMobileNo2"]: value[newConstants.CLIENT_BRANCH_MOBILE_NO2][newConstants.VALUE],
            ["clientBranchEmail"]: value[newConstants.CLIENT_BRANCH_EMAIL][newConstants.VALUE],
            ["isHeadOffice"]: value[newConstants.IS_HEAD_OFFICE][newConstants.VALUE],
            ["fileInfos"]: documents.length > index ?
                documents[index]
                    .map((v) => ({ fileKey: v.file.value, documentTypeName: v.file.documentTypeName }))
                    .filter((f) => f.FileKey != '') : [],
        });
    });
    return {
        // url: newBaseUrl + 'api/agent/saveclientinfo',
        url: newBaseUrl + 'client/user/create-client-info',
        pay_load: {
            ["ClientLicenseNo"]: basic_info[newConstants.CLIENT_LICENSE_NO][newConstants.VALUE],
            ["ClientRegisterationNo"]: basic_info[newConstants.CLIENT_REG_NO][newConstants.VALUE],
            ["ClientName"]: basic_info[newConstants.CLIENT_NAME][newConstants.VALUE],
            ["baseCurrency"]: basic_info[newConstants.BASECURRENCY][newConstants.VALUE],
            ["defaultLangCode"]: basic_info[newConstants.CLIENT_LANGUAGE][newConstants.VALUE],
            ["ClientEmail"]: basic_info[newConstants.CLIENT_EMAIL][newConstants.VALUE],
            ["ClientWebsite"]: basic_info[newConstants.CLIENT_WEB_SITE][newConstants.VALUE],
            ["UserName"]: basic_info[newConstants.CLIENT_EMAIL][newConstants.VALUE],
            ["ClientRemarks"]: basic_info[newConstants.CLIENT_REMARKS][newConstants.VALUE],
            [newConstants.CLIENT_BRANCH_INFOS]: CLIENT_BRANCH_INFOS,
        },
    };
};

const getclientinfo = (email) => {
    return {
        url: newBaseUrl + 'client/user/getclientinfo',
        pay_load: {
            [newConstants.EMAIL_ID]: email,
        },
    };
};

const updateClientInfo = (basic_info, branch_info, documents) => {
    let CLIENT_BRANCH_INFOS = [];
    branch_info.forEach((value, index) => {
        let clientBranchInfoObj = {
            ["clientBranchRegNo"]: value[newConstants.CLIENT_BRANCH_REG_NO][newConstants.VALUE],
            ["clientBranchName"]: value[newConstants.CLIENT_BRANCH_NAME][newConstants.VALUE],
            ["clientBranchAddress"]: value[newConstants.CLIENT_BRANCH_ADDRESS][newConstants.VALUE],
            ["clientBranchCity"]: value[newConstants.CLIENT_BRANCH_CITY][newConstants.VALUE],
            ["clientBranchState"]: value[newConstants.CLIENT_BRANCH_STATE][newConstants.VALUE],
            ["clientBranchCountry"]: value[newConstants.CLIENT_BRANCH_COUNTRY][newConstants.VALUE],
            ["clientBranchPostCode"]: value[newConstants.CLIENT_BRANCH_POST_CODE][newConstants.VALUE],
            ["clientBranchRemark"]: value[newConstants.CLIENT_BRANCH_REMARK][newConstants.VALUE],
            ["clientBranchTeleNo1"]: value[newConstants.CLIENT_BRANCH_TELE_NO1][newConstants.VALUE],
            ["clientBranchTeleNo2"]: value[newConstants.CLIENT_BRANCH_TELE_NO2][newConstants.VALUE],
            ["clientBranchMobileNo1"]: value[newConstants.CLIENT_BRANCH_MOBILE_NO1][newConstants.VALUE],
            ["clientBranchMobileNo2"]: value[newConstants.CLIENT_BRANCH_MOBILE_NO2][newConstants.VALUE],
            ["clientBranchEmail"]: value[newConstants.CLIENT_BRANCH_EMAIL][newConstants.VALUE],
            ["isHeadOffice"]: value[newConstants.IS_HEAD_OFFICE][newConstants.VALUE],
            ["fileInfos"]: documents.length > index ?
                documents[index]
                    .map((v) => ({ fileKey: v.file.value, documentTypeName: v.file.documentTypeName }))
                    .filter((f) => f.FileKey != '') : [],
        };
        if (value[newConstants.CLIENT_BRANCH_ID]) {
            clientBranchInfoObj["clientBranchId"] = value[newConstants.CLIENT_BRANCH_ID][newConstants.VALUE];
        }

        if (value[newConstants.CLIENT_ID]) {
            clientBranchInfoObj["clientId"] = value[newConstants.CLIENT_ID][newConstants.VALUE];
        }
        CLIENT_BRANCH_INFOS.push(clientBranchInfoObj);
    });
    return {
        url: newBaseUrl + 'client/user/create-client-info?',
        pay_load: {
            ["ClientLicenseNo"]: basic_info[newConstants.CLIENT_LICENSE_NO][newConstants.VALUE],
            ["ClientRegisterationNo"]: basic_info[newConstants.CLIENT_REG_NO][newConstants.VALUE],
            ["ClientName"]: basic_info[newConstants.CLIENT_NAME][newConstants.VALUE],
            ["baseCurrency"]: basic_info[newConstants.BASECURRENCY][newConstants.VALUE],
            ["defaultLangCode"]: basic_info[newConstants.CLIENT_LANGUAGE][newConstants.VALUE],
            ["ClientEmail"]: basic_info[newConstants.CLIENT_EMAIL][newConstants.VALUE],
            ["ClientWebsite"]: basic_info[newConstants.CLIENT_WEB_SITE][newConstants.VALUE],
            ["UserName"]: basic_info[newConstants.CLIENT_EMAIL][newConstants.VALUE],
            ["ClientRemarks"]: basic_info[newConstants.CLIENT_REMARKS][newConstants.VALUE],
            ["clientId"]: basic_info[newConstants.CLIENT_ID][newConstants.VALUE],
            [newConstants.CLIENT_BRANCH_INFOS]: CLIENT_BRANCH_INFOS,
        },
    };
};

const branchSelection = key => {
    return {
        url: newBaseUrl + 'client/user/client-branch-authenticate',
        pay_load: {
            [newConstants.CLIENT_BRANCH_KEY]: key,
        },
    };
};

const getProviderProduct = () => {
    return {
        url: newBaseUrl + 'product-provider-type-link/get',
    };
};


const updateProductProvider = (key, hbe, hcm, rhk) => {
    let Hbedata = hbe !== null ? {
        ["product-provider-key"]: hbe["product-provider-key"].value,
        ["product-key"]: hbe["product-key"].value,
        ["product-name"]: hbe["product-name"].value,
        ["api-key"]: {
            ["b2b"]: hbe["b2b-api-key"].value,
            ["b2c"]: hbe["b2c-api-key"].value,
        },
        ["api-secret-key"]: {
            ["b2b"]: hbe["b2b-api-secret-key"].value,
            ["b2c"]: hbe["b2c-api-secret-key"].value,
        }
    } : null
    let Hcmdata = hcm !== null ? {
        ["product-provider-key"]: hcm["product-provider-key"].value,
        ["product-key"]: hcm["product-key"].value,
        ["product-name"]: hcm["product-name"].value,
        ["interface-key"]: {
            ["b2b"]: hcm["b2b-interface-key"].value,
            ["b2c"]: hcm["b2c-interface-key"].value,
        },
        ["sid"]: {
            ["b2b"]: hcm["b2b-sid-key"].value,
            ["b2c"]: hcm["b2c-sid-key"].value,
        },
        ["aid"]: {
            ["b2b"]: hcm["b2b-aid-key"].value,
            ["b2c"]: hcm["b2c-aid-key"].value
        }
    } : null

    let Rhkdata = rhk !== null ? {
        ["product-provider-key"]: rhk["product-provider-key"].value,
        ["product-key"]: rhk["product-key"].value,
        ["product-name"]: rhk["product-name"].value,
        ["user-name"]: {
            ["b2b"]: rhk["b2b-user-name"].value,
            ["b2c"]: rhk["b2c-user-name"].value,
        },
        ["pass-word"]: {
            ["b2b"]: rhk["b2b-pass-word"].value,
            ["b2c"]: rhk["b2c-pass-word"].value,
        }
    } : null

    return {
        url: newBaseUrl + 'product-provider-type-link/update',
        pay_load: {
            ["client-key"]: key,
            ["hbe"]: Hbedata,
            ["hcm"]: Hcmdata,
            ["rhk"]: Rhkdata
        },
    };
}


export {
    updateProductProvider,
    agentLogin,
    createBooking,
    getCountryList,
    getHotelsList,
    autoComplete,
    getRoomListByHotel,
    getReCheckRate,
    createHotelCategory,
    editHotelCategory,
    deleteHotelCategory,
    getHotelCategoryInfoById,
    getAllHotelCategory,
    getAllHotelCategoryY,
    hotelMasterGetY,
    getHotelTypeY,
    hotelMasterSave,
    hotelMasterUpdate,
    hotelMasterGetByKey,
    deleteHotelInfo,
    getAllHotelInfo,
    // createHotelType,
    updateHotelType,
    deleteHotelType,
    getHotelTypeById,
    getAllHotelType,
    isEmailExist,
    getAllCityByCountryId,
    getAllStateByCountryId,
    // b2bClientPagesApprovedGetAll,
    createAgentBySignup,
    getProdcutProviderType,
    createAmunity,
    editAmunity,
    getAllAmmunity,
    getAllAmmunityY,
    getAllHotelImageTypeY,
    getAmmunityTypeById,
    getAmmunityInfoById,
    deleteAmmunity,
    updateAmmunityType,
    deleteAmmunityType,
    getAmmunityType,
    getAmmunityTypeY,
    createAmmunityType,
    getHotelProductProviderType,
    getAllRoomCategory,
    getAllRoomCategoryY,
    getRoomCategoryByKey,
    deleteRoomCategory,
    updateRoomCategory,
    createRoomCategory,
    getAllRooms,
    getAllRoomsY,
    getRoomByKey,
    deleteRoom,
    updateRoom,
    createRoom,
    getAllHotelIssues,
    getAllHotelIssuesY,
    getHotelIssuesByKey,
    deleteHotelIssues,
    updateHotelIssues,
    createHotelIssues,
    getHotelImageTypeByKey,
    deleteHotelImageType,
    updateHotelImageType,
    createHotelImageType,
    getAllHotelTag,
    getAllHotelTagY,
    getHotelTagByKey,
    deleteHotelTag,
    updateHotelTag,
    createHotelTag,
    getAllRoomNightSetup,
    getRoomNightSetupByKey,
    deleteRoomNightSetup,
    updateRoomNightSetup,
    createRoomNightSetup,
    getRoomPriceComments,
    getRoomPriceY,
    createRoomPriceComments,
    RoomPriceCommentsInfoById,
    editRoomPriceComments,
    deleteRoomPriceComments,
    getCountry,
    countryGetByKey,
    createClientForm,
    getCityByCountryKey,
    cityGetByKey,
    provinceGetByCountryKey,
    provinceGetByKey,
    verifyEmail,
    updatePassword,
    resetPassword,
    forgotPasswordRequest,
    agentSaveClientInfo,
    getclientinfo,
    updateClientInfo,
    currencyGet,
    hotelMasterGet,
    imageUploder,
    getDocumentType,

    apiDownload,
    getAllNearPlaceType,
    getAllNearPlaceTypeY,
    getNearPlaceTypeByKey,
    deleteNearPlaceType,
    createNearPlaceType,
    updateNearPlaceType,
    getAllNearPlace,
    getAllNearPlaceY,
    getNearPlaceByKey,
    deleteNearPlace,
    createNearPlace,
    updateNearPlace,
    getHotelType,
    hotelMasterGetId,
    getHotelId,
    getLanguage,
    languageGetByKey,
    getAllRoomPlan,
    getRoomPlanByKey,
    getAllRefundTypes,
    deleteRoomPlan,
    createRoomPlan,
    updateRoomPlan,
    getAllHotelRoomLink,
    getHotelRoomLinkByKey,
    deleteHotelRoomLink,
    createHotelRoomLink,
    updateHotelRoomLink,
    mapSearchAutoComplete,
    getRoomPlanPrice,
    generateRoomPlanPriceList,
    getAllAccounts,
    createAccounts,
    updateAccounts,
    deleteAccounts,
    getAccountsByKey,
    roomPlanPriceSave,
    roomPlanPriceUpdate,
    getAllAccountsGroupParent,
    getAllAccountsGroupParentBankCash,
    getAllAccountsGroup,
    createAccountsGroup,
    updateAccountsGroup,
    getAccountsGroupByKey,
    deleteAccountsGroup,
    roomPlanPriceGetByKey,
    b2bClientPagesGetAll,
    getMopeAccount,
    getMopRemark,
    createAccountMop,
    getMopKey,
    updateAccountMop,
    deleteAccountMop,
    getLedgerAccountKey,
    generateTicketPlanPriceList,
    TicketPlanGetKey,
    createBankMaster,
    updateBankMaster,
    getBankMasterByKey,
    deleteBankMaster,
    getAllBankMaster,
    getLedgerGroupByParentBank,
    deleteByHotel,
    deleteRoomPlanPrice,
    getAllLedgerJournal,
    getLedgerJournalByKey,
    deleteLedgerJournal,
    createLedgerJournal,
    updateLedgerJournal,
    getAllAccountsExpense,
    getAccountsExpenseByKey,
    deleteAccountsExpense,
    createAccountsExpense,
    updateAccountsExpense,
    getAllTransType,
    getAccountByMopKey,
    getAccountsByAccountsGroupType,
    getCurrencyByKey,
    updateCurrency,
    getAllPurchaseInvoice,
    createPurchaseInvoice,
    getPurchaseInvoiceByKey,
    getDashDailySales,
    getMothlySales,
    getRecentBooking,
    getHourlySales,
    getYearlySales,
    getRoomPlanPriceKey,
    generateRoomPlan,
    getHotelTax,
    GetRoomByHotelKey,
    generatePlanPaxList,
    getAllHotelImageType,
    LedgerAccountSupplier,
    getAccountsByExpenseGroupType,
    getAllTnxType,
    getExpenseByKey,
    getAllAccountsGroupY,
    b2bClientPagesApprovedGetAll,
    createHotelType,
    getProviderProduct,
    branchSelection,
    hotelMasterSaves,
    hotelMasterUpdates
};
