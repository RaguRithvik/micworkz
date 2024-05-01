import { constants, newConstants, baseUrl, newBaseUrl, MAPBOX_TOKEN } from './constants';

const createAttractionTicketPriceComments = (localFields, multi_language) => {
    let commentLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_PRICE_COMMENTS_TITLE]: value[newConstants.TICKET_PRICE_COMMENTS_TITLE][newConstants.VALUE],
                [newConstants.TICKET_PRICE_COMMENTS_DESC]: value[newConstants.TICKET_PRICE_COMMENTS_DESC][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-price-comments/save',
        pay_load: {
            [newConstants.TICKET_PRICE_COMMENTS_TITLE]: localFields[newConstants.TICKET_PRICE_COMMENTS_TITLE][newConstants.VALUE],
            [newConstants.TICKET_PRICE_COMMENTS_DESC]: localFields[newConstants.TICKET_PRICE_COMMENTS_DESC][newConstants.VALUE],
            [newConstants.TICKET_PRICE_COMMENTS_LANGUAGES]: commentLangPack.filter((f) => f != null),
        },
    };
};
const updateAttractionTicketPriceComments = (key, localFields, multi_language) => {
    let commentLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_PRICE_COMMENTS_TITLE]: value[newConstants.TICKET_PRICE_COMMENTS_TITLE][newConstants.VALUE],
                [newConstants.TICKET_PRICE_COMMENTS_DESC]: value[newConstants.TICKET_PRICE_COMMENTS_DESC][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-price-comments/update',
        pay_load: {
            [newConstants.TICKET_PRICE_COMMENTS_KEY]: key,
            [newConstants.TICKET_PRICE_COMMENTS_TITLE]: localFields[newConstants.TICKET_PRICE_COMMENTS_TITLE][newConstants.VALUE],
            [newConstants.TICKET_PRICE_COMMENTS_DESC]: localFields[newConstants.TICKET_PRICE_COMMENTS_DESC][newConstants.VALUE],
            [newConstants.TICKET_PRICE_COMMENTS_LANGUAGES]: commentLangPack.filter((f) => f != null),
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
        },
    };
};
const getAttractionTicketPriceCommentsByKey = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-price-comments/get-by-key',
        pay_load: {
            [newConstants.TICKET_PRICE_COMMENTS_KEY]: key,
        },
    };
};
const deleteAttractionTicketPriceComments = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-price-comments/Delete',
        pay_load: {
            [newConstants.TICKET_PRICE_COMMENTS_KEY]: key,
        },
    };
};


const getAllAttractionTicketPriceComments = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-price-comments/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
};


const getAllEvenTicketPlanPrice = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-plan-price/get',
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

const createAttractionTicketPlan = (localFields, multi_language, amenityLinks, plandescription, planrates, cancelPolicyRules) => {
    let ticketPlanLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_PLAN_NAME]: value[newConstants.TICKET_PLAN_NAME][newConstants.VALUE],
            } :
            null;
    });
    let ticketPlanAmenityPack = amenityLinks.map((value) => {
        return value[newConstants.TICKET_AMENITY_KEY][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_AMENITY_KEY]: value[newConstants.TICKET_AMENITY_KEY][newConstants.VALUE],
                [newConstants.IS_CHARGEABLE]: Number(value[newConstants.IS_CHARGEABLE][newConstants.VALUE]),
                [newConstants.TICKET_AMENITY_PRICE]: parseFloat(value[newConstants.TICKET_AMENITY_PRICE][newConstants.VALUE]),
                [newConstants.IS_SHOW]: Number(value[newConstants.IS_SHOW][newConstants.VALUE]),
            } :
            null;
    });

    let ticketPlandesc = plandescription.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_PLAN_LABEL]: value[newConstants.TICKET_PLAN_LABEL][newConstants.VALUE],
                [newConstants.TICKET_PLAN_TEXT]: value[newConstants.TICKET_PLAN_TEXT][newConstants.VALUE],
                [newConstants.IS_PRINT_VOUCHER]: Number(value[newConstants.IS_PRINT_VOUCHER][newConstants.VALUE]),
            } :
            null;
    });

    let ticketPlanpax = planrates.map((value) => {
        return value[newConstants.TICKET_TYPE_KEY][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_TYPE_KEY]: value[newConstants.TICKET_TYPE_KEY][newConstants.VALUE],
                [newConstants.IS_SHOW_ON_LISTING]: value[newConstants.IS_SHOW_ON_LISTING][newConstants.VALUE],
                [newConstants.TICKET_RATE_REGULAR_B2B]: parseFloat(value[newConstants.TICKET_RATE_REGULAR_B2B][newConstants.VALUE]),
                [newConstants.TICKET_RATE_REGULAR_B2C]: parseFloat(value[newConstants.TICKET_RATE_REGULAR_B2C][newConstants.VALUE]),
                [newConstants.IS_SOLD_OUT]: value[newConstants.IS_SOLD_OUT][newConstants.VALUE],
                [newConstants.IS_TAX_INCLUSION]: Number(value[newConstants.IS_TAX_INCLUSION][newConstants.VALUE]),
                [newConstants.RATE_COMMENTS_KEY]: value[newConstants.RATE_COMMENTS_KEY][newConstants.VALUE],
                [newConstants.MAX_ALLOWED]: parseInt(value[newConstants.MAX_ALLOWED][newConstants.VALUE]),
                [newConstants.TICKET_ALLOTMENT]: parseInt(value[newConstants.TICKET_ALLOTMENT][newConstants.VALUE]),
                [newConstants.ADDITIONAL_TYPE]: Number(value[newConstants.ADDITIONAL_TYPE][newConstants.VALUE]),
                [newConstants.SERVICE_TYPE]: Number(value[newConstants.SERVICE_TYPE][newConstants.VALUE]),
                [newConstants.TAX_TYPE]: Number(value[newConstants.TAX_TYPE][newConstants.VALUE]),
                [newConstants.AMENITY_VALUE]: parseFloat(value[newConstants.AMENITY_VALUE][newConstants.VALUE]),
                [newConstants.B2B_PRICE]: {
                    [newConstants.TAX_VALUE]: parseFloat(value["b2b-tax-value"][newConstants.VALUE]),
                    [newConstants.SERVICE_VALUE]: parseFloat(value["b2b-service-value"][newConstants.VALUE]),
                    [newConstants.ADDITION_VALUE]: parseFloat(value["b2b-addition-value"][newConstants.VALUE]),
                    [newConstants.NET_VALUE]: parseFloat(value["b2b-net-value"][newConstants.VALUE]),
                },
                [newConstants.B2C_PRICE]: {
                    [newConstants.TAX_VALUE]: parseFloat(value["b2c-tax-value"][newConstants.VALUE]),
                    [newConstants.SERVICE_VALUE]: parseFloat(value["b2c-service-value"][newConstants.VALUE]),
                    [newConstants.ADDITION_VALUE]: parseFloat(value["b2c-addition-value"][newConstants.VALUE]),
                    [newConstants.NET_VALUE]: parseFloat(value["b2c-net-value"][newConstants.VALUE]),
                }
            } :
            null;
    });

    let policyRulesPack = cancelPolicyRules.map((value) => {
        let cancelPolicyPack = value[newConstants.TICKET_PLAN_CANCEL_POLICIES][newConstants.VALUE].map((value) => {
            return value[newConstants.REFUND_TYPE_KEY][newConstants.VALUE] != '' ? {
                    [newConstants.REFUND_TYPE_KEY]: value[newConstants.REFUND_TYPE_KEY][newConstants.VALUE],
                    [newConstants.DAYS_BEFORE_CHECK_IN]: parseInt(value[newConstants.DAYS_BEFORE_CHECK_IN][newConstants.VALUE]),
                    [newConstants.CANCELATION_VALUE]: parseFloat(value[newConstants.CANCELATION_VALUE][newConstants.VALUE]),
                } :
                null;
        });
        return value[newConstants.TICKET_CANCEL_RULE_NAME][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_CANCEL_RULE_NAME]: value[newConstants.TICKET_CANCEL_RULE_NAME][newConstants.VALUE],
                [newConstants.IS_DATE_RANGE]: Number(value[newConstants.IS_DATE_RANGE][newConstants.VALUE]),
                [newConstants.EFFECTIVE_FROM]: value[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
                [newConstants.EFFECTIVE_TO]: value[newConstants.EFFECTIVE_TO][newConstants.VALUE],
                [newConstants.IS_OVERWRITE]: Number(value[newConstants.IS_OVERWRITE][newConstants.VALUE]),
                [newConstants.TICKET_PLAN_CANCEL_POLICIES]: cancelPolicyPack.filter((f) => f != null),
            } :
            null;
    });

    return {
        url: newBaseUrl + 'attraction/ticket-plan/save',
        pay_load: {
            [newConstants.TICKET_PLAN_NAME]: localFields[newConstants.TICKET_PLAN_NAME][newConstants.VALUE],
            [newConstants.TICKET_KEY]: localFields[newConstants.TICKET_KEY][newConstants.VALUE],
            [newConstants.GROUP_ALLOTMENT]: Number(localFields[newConstants.GROUP_ALLOTMENT][newConstants.VALUE]),
            [newConstants.IS_GROUP_TICKET]: Number(localFields[newConstants.IS_GROUP_TICKET][newConstants.VALUE]),
            [newConstants.IS_TERM_DATE]: Number(localFields[newConstants.IS_TERM_DATE][newConstants.VALUE]),
            [newConstants.MAX_ALLOWED]: parseInt(localFields[newConstants.MAX_ALLOWED][newConstants.VALUE]),
            [newConstants.TICKET_TERM_DATE]: localFields[newConstants.TICKET_TERM_DATE][newConstants.VALUE],
            [newConstants.IS_SOLD_OUT]: Number(localFields[newConstants.IS_SOLD_OUT][newConstants.VALUE]),
            [newConstants.IS_EXPIRE]: Number(localFields[newConstants.IS_EXPIRE][newConstants.VALUE]),
            // [newConstants.EXPIRE_DATE]: localFields[newConstants.EXPIRE_DATE][newConstants.VALUE],
            [newConstants.ACTIVE_HOURS_FROM]: localFields[newConstants.ACTIVE_HOURS_FROM][newConstants.VALUE],
            [newConstants.ACTIVE_HOURS_TO]: localFields[newConstants.ACTIVE_HOURS_TO][newConstants.VALUE],
            // [newConstants.IS_ALLDAYS_IN_WEEK]: Number(localFields[newConstants.IS_ALL_DAYS_IN_WEEK][newConstants.VALUE]),
            // [newConstants.IS_SUNDAY]: Number(localFields[newConstants.IS_SUNDAY][newConstants.VALUE]),
            // [newConstants.IS_MONDAY]: Number(localFields[newConstants.IS_MONDAY][newConstants.VALUE]),
            // [newConstants.IS_TUESDAY]: Number(localFields[newConstants.IS_TUESDAY][newConstants.VALUE]),
            // [newConstants.IS_WEDNESDAY]: Number(localFields[newConstants.IS_WEDNESDAY][newConstants.VALUE]),
            // [newConstants.IS_THURSDAY]: Number(localFields[newConstants.IS_THURSDAY][newConstants.VALUE]),
            // [newConstants.IS_FRIDAY]: Number(localFields[newConstants.IS_FRIDAY][newConstants.VALUE]),
            // [newConstants.IS_SATURDAY]: Number(localFields[newConstants.IS_SATURDAY][newConstants.VALUE]),
            [newConstants.TICKET_PLAN_LANGUAGES]: ticketPlanLangPack.filter((f) => f != null),
            [newConstants.TICKET_PLAN_AMENITY_LINKS]: ticketPlanAmenityPack.filter((f) => f != null),
            [newConstants.TICKET_PLAN_DESCRIPTION]: ticketPlandesc.filter((f) => f != null),
            [newConstants.TICKET_PLAN_RATES]: ticketPlanpax.filter((f) => f != null),
            [newConstants.TICKET_PLAN_CANCEL_POLICY_RULES]: policyRulesPack.filter((f) => f != null),
        },
    };
};


const deleteAttractionTicketPlan = (key) => {
    return {
        url: newBaseUrl + 'event/ticket-plan/delete',
        pay_load: {
            [newConstants.TICKET_PLAN_KEY]: key,
        },
    };
};


const getAllAttractionTicketY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket/get',
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


const UpdateAttractionTicketPlan = (key, localFields, multi_language, amenityLinks, plandescription, planrates, cancelPolicyRules) => {
    let ticketPlanLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_PLAN_NAME]: value[newConstants.TICKET_PLAN_NAME][newConstants.VALUE],
            } :
            null;
    });
    let ticketPlanAmenityPack = amenityLinks.map((value) => {
        return value[newConstants.TICKET_AMENITY_KEY][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_AMENITY_KEY]: value[newConstants.TICKET_AMENITY_KEY][newConstants.VALUE],
                [newConstants.IS_CHARGEABLE]: Number(value[newConstants.IS_CHARGEABLE][newConstants.VALUE]),
                [newConstants.TICKET_AMENITY_PRICE]: parseFloat(value[newConstants.TICKET_AMENITY_PRICE][newConstants.VALUE]),
                [newConstants.IS_SHOW]: Number(value[newConstants.IS_SHOW][newConstants.VALUE]),
            } :
            null;
    });

    let ticketPlandesc = plandescription.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_PLAN_LABEL]: value[newConstants.TICKET_PLAN_LABEL][newConstants.VALUE],
                [newConstants.TICKET_PLAN_TEXT]: value[newConstants.TICKET_PLAN_TEXT][newConstants.VALUE],
                [newConstants.IS_PRINT_VOUCHER]: Number(value[newConstants.IS_PRINT_VOUCHER][newConstants.VALUE]),
            } :
            null;
    });

    let ticketPlanpax = planrates.map((value) => {
        return value[newConstants.TICKET_TYPE_KEY][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_TYPE_KEY]: value[newConstants.TICKET_TYPE_KEY][newConstants.VALUE],
                [newConstants.IS_SHOW_ON_LISTING]: value[newConstants.IS_SHOW_ON_LISTING][newConstants.VALUE],
                [newConstants.TICKET_RATE_REGULAR_B2B]: parseFloat(value[newConstants.TICKET_RATE_REGULAR_B2B][newConstants.VALUE]),
                [newConstants.TICKET_RATE_REGULAR_B2C]: parseFloat(value[newConstants.TICKET_RATE_REGULAR_B2C][newConstants.VALUE]),
                [newConstants.IS_SOLD_OUT]: value[newConstants.IS_SOLD_OUT][newConstants.VALUE],
                [newConstants.IS_TAX_INCLUSION]: Number(value[newConstants.IS_TAX_INCLUSION][newConstants.VALUE]),
                [newConstants.RATE_COMMENTS_KEY]: value[newConstants.RATE_COMMENTS_KEY][newConstants.VALUE],
                [newConstants.MAX_ALLOWED]: parseInt(value[newConstants.MAX_ALLOWED][newConstants.VALUE]),
                [newConstants.TICKET_ALLOTMENT]: parseInt(value[newConstants.TICKET_ALLOTMENT][newConstants.VALUE]),
                [newConstants.ADDITIONAL_TYPE]: Number(value[newConstants.ADDITIONAL_TYPE][newConstants.VALUE]),
                [newConstants.SERVICE_TYPE]: Number(value[newConstants.SERVICE_TYPE][newConstants.VALUE]),
                [newConstants.TAX_TYPE]: Number(value[newConstants.TAX_TYPE][newConstants.VALUE]),
                [newConstants.AMENITY_VALUE]: parseFloat(value[newConstants.AMENITY_VALUE][newConstants.VALUE]),
                [newConstants.B2B_PRICE]: {
                    [newConstants.TAX_VALUE]: parseFloat(value["b2b-tax-value"][newConstants.VALUE]),
                    [newConstants.SERVICE_VALUE]: parseFloat(value["b2b-service-value"][newConstants.VALUE]),
                    [newConstants.ADDITION_VALUE]: parseFloat(value["b2b-addition-value"][newConstants.VALUE]),
                    [newConstants.NET_VALUE]: parseFloat(value["b2b-net-value"][newConstants.VALUE]),
                },
                [newConstants.B2C_PRICE]: {
                    [newConstants.TAX_VALUE]: parseFloat(value["b2c-tax-value"][newConstants.VALUE]),
                    [newConstants.SERVICE_VALUE]: parseFloat(value["b2c-service-value"][newConstants.VALUE]),
                    [newConstants.ADDITION_VALUE]: parseFloat(value["b2c-addition-value"][newConstants.VALUE]),
                    [newConstants.NET_VALUE]: parseFloat(value["b2c-net-value"][newConstants.VALUE]),
                }
            } :
            null;
    });

    let policyRulesPack = cancelPolicyRules.map((value) => {
        let cancelPolicyPack = value[newConstants.TICKET_PLAN_CANCEL_POLICIES][newConstants.VALUE].map((value) => {
            return value[newConstants.REFUND_TYPE_KEY][newConstants.VALUE] != '' ? {
                    [newConstants.REFUND_TYPE_KEY]: value[newConstants.REFUND_TYPE_KEY][newConstants.VALUE],
                    [newConstants.DAYS_BEFORE_CHECK_IN]: parseInt(value[newConstants.DAYS_BEFORE_CHECK_IN][newConstants.VALUE]),
                    [newConstants.CANCELATION_VALUE]: parseFloat(value[newConstants.CANCELATION_VALUE][newConstants.VALUE]),
                } :
                null;
        });
        return value[newConstants.TICKET_CANCEL_RULE_NAME][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_CANCEL_RULE_NAME]: value[newConstants.TICKET_CANCEL_RULE_NAME][newConstants.VALUE],
                [newConstants.IS_DATE_RANGE]: Number(value[newConstants.IS_DATE_RANGE][newConstants.VALUE]),
                [newConstants.EFFECTIVE_FROM]: value[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
                [newConstants.EFFECTIVE_TO]: value[newConstants.EFFECTIVE_TO][newConstants.VALUE],
                [newConstants.IS_OVERWRITE]: Number(value[newConstants.IS_OVERWRITE][newConstants.VALUE]),
                [newConstants.TICKET_PLAN_CANCEL_POLICIES]: cancelPolicyPack.filter((f) => f != null),
            } :
            null;
    });

    return {
        url: newBaseUrl + 'attraction/ticket-plan/update',
        pay_load: {
            [newConstants.TICKET_PLAN_KEY]: key,
            [newConstants.TICKET_PLAN_NAME]: localFields[newConstants.TICKET_PLAN_NAME][newConstants.VALUE],
            [newConstants.TICKET_KEY]: localFields[newConstants.TICKET_KEY][newConstants.VALUE],
            [newConstants.GROUP_ALLOTMENT]: Number(localFields[newConstants.GROUP_ALLOTMENT][newConstants.VALUE]),
            [newConstants.IS_GROUP_TICKET]: Number(localFields[newConstants.IS_GROUP_TICKET][newConstants.VALUE]),
            [newConstants.IS_TERM_DATE]: Number(localFields[newConstants.IS_TERM_DATE][newConstants.VALUE]),
            [newConstants.MAX_ALLOWED]: parseInt(localFields[newConstants.MAX_ALLOWED][newConstants.VALUE]),
            [newConstants.TICKET_TERM_DATE]: localFields[newConstants.TICKET_TERM_DATE][newConstants.VALUE],
            [newConstants.IS_SOLD_OUT]: Number(localFields[newConstants.IS_SOLD_OUT][newConstants.VALUE]),
            [newConstants.IS_EXPIRE]: Number(localFields[newConstants.IS_EXPIRE][newConstants.VALUE]),
            // [newConstants.EXPIRE_DATE]: localFields[newConstants.EXPIRE_DATE][newConstants.VALUE],
            [newConstants.ACTIVE_HOURS_FROM]: localFields[newConstants.ACTIVE_HOURS_FROM][newConstants.VALUE],
            [newConstants.ACTIVE_HOURS_TO]: localFields[newConstants.ACTIVE_HOURS_TO][newConstants.VALUE],
            // [newConstants.IS_ALLDAYS_IN_WEEK]: Number(localFields[newConstants.IS_ALL_DAYS_IN_WEEK][newConstants.VALUE]),
            // [newConstants.IS_SUNDAY]: Number(localFields[newConstants.IS_SUNDAY][newConstants.VALUE]),
            // [newConstants.IS_MONDAY]: Number(localFields[newConstants.IS_MONDAY][newConstants.VALUE]),
            // [newConstants.IS_TUESDAY]: Number(localFields[newConstants.IS_TUESDAY][newConstants.VALUE]),
            // [newConstants.IS_WEDNESDAY]: Number(localFields[newConstants.IS_WEDNESDAY][newConstants.VALUE]),
            // [newConstants.IS_THURSDAY]: Number(localFields[newConstants.IS_THURSDAY][newConstants.VALUE]),
            // [newConstants.IS_FRIDAY]: Number(localFields[newConstants.IS_FRIDAY][newConstants.VALUE]),
            // [newConstants.IS_SATURDAY]: Number(localFields[newConstants.IS_SATURDAY][newConstants.VALUE]),
            [newConstants.TICKET_PLAN_LANGUAGES]: ticketPlanLangPack.filter((f) => f != null),
            [newConstants.TICKET_PLAN_AMENITY_LINKS]: ticketPlanAmenityPack.filter((f) => f != null),
            [newConstants.TICKET_PLAN_DESCRIPTION]: ticketPlandesc.filter((f) => f != null),
            [newConstants.TICKET_PLAN_RATES]: ticketPlanpax.filter((f) => f != null),
            [newConstants.TICKET_PLAN_CANCEL_POLICY_RULES]: policyRulesPack.filter((f) => f != null),
        },
    };
};

const getAttractionTicketPlanByKey = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-plan/get-by-key',
        pay_load: {
            [newConstants.TICKET_PLAN_KEY]: key,
        },
    };
};



const getAttractionTicketPlan = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-plan/get',
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

const getTicketRefundTypes = () => {
    return {
        url: newBaseUrl + 'attraction/ticket-plan/get-refund-types',
        pay_load: {},
    };
};

const getAllAttractionTicketType = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-type/get',
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


const getAllAttractionTicketTypeY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-type/get',
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


const getAttractionTicketTypeByKey = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-type/get-by-key',
        pay_load: {
            [newConstants.TICKET_TYPE_KEY]: key,
        },
    };
};
const deleteAttractionTicketType = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-type/delete',
        pay_load: {
            [newConstants.TICKET_TYPE_KEY]: key,
        },
    };
};
const createAttractionTicketType = (localFields, multi_language) => {
    let ticketTypeLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_TYPE_NAME]: value[newConstants.TICKET_TYPE_NAME][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-type/save',
        pay_load: {
            [newConstants.TICKET_TYPE_NAME]: localFields[newConstants.TICKET_TYPE_NAME][newConstants.VALUE],
            [newConstants.IS_ZERO_COST]: Number(localFields[newConstants.IS_ZERO_COST][newConstants.VALUE]),
            [newConstants.TICKET_LANGUAGES]: ticketTypeLangPack.filter((f) => f != null),
        },
    };
};
const updateAttractionTicketType = (key, localFields, multi_language) => {
    let ticketTypeLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_TYPE_NAME]: value[newConstants.TICKET_TYPE_NAME][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-type/update',
        pay_load: {
            [newConstants.TICKET_TYPE_KEY]: key,
            [newConstants.TICKET_TYPE_NAME]: localFields[newConstants.TICKET_TYPE_NAME][newConstants.VALUE],
            [newConstants.IS_ZERO_COST]: Number(localFields[newConstants.IS_ZERO_COST][newConstants.VALUE]),
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.TICKET_LANGUAGES]: ticketTypeLangPack.filter((f) => f != null),
        },
    };
};

const getAllAttractionImageType = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-image-type/get',
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


const getAllAttractionTicketCategory = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-category/get',
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

const getAttractionTicketCategoryKey = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-category/get-by-key',
        pay_load: {
            [newConstants.TICKET_CATEGORY_KEY]: key,
        },
    };
};

const deleteAttractionTicketCategoryKey = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-category/delete',
        pay_load: {
            [newConstants.TICKET_CATEGORY_KEY]: key,
        },
    };
};



const updateAttractionHotelTicketCategory = (key, localFields, multi_language) => {
    let hotelTagLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_CATEGORY_NAME]: value[newConstants.TICKET_CATEGORY_NAME][newConstants.VALUE],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-category/update',
        pay_load: {
            [newConstants.TICKET_CATEGORY_KEY]: key,
            [newConstants.TICKET_CATEGORY_NAME]: localFields[newConstants.TICKET_CATEGORY_NAME][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.TICKET_CATEGORY_LANGUAGES]: hotelTagLangPacks.filter((f) => f != null),
        },
    };
};


const createAttractionTicketCategory = (localFields, multi_language) => {
    let hotelTagLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_CATEGORY_NAME]: value[newConstants.TICKET_CATEGORY_NAME][newConstants.VALUE],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-category/save',
        pay_load: {
            [newConstants.TICKET_CATEGORY_NAME]: localFields[newConstants.TICKET_CATEGORY_NAME][newConstants.VALUE],
            [newConstants.TICKET_CATEGORY_LANGUAGES]: hotelTagLangPacks.filter((f) => f != null),
        },
    };
};

const getAllAttractionTicketAmenity = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy/get',
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
const getAttractionTicketAmenityByKey = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy/get-by-key',
        pay_load: {
            [newConstants.TICKET_AMENITY_KEY]: key,
        },
    };
};
const deleteAttractionTicketAmenity = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy/delete',
        pay_load: {
            [newConstants.TICKET_AMENITY_KEY]: key,
        },
    };
};

const deleteAttractionOpenStock = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-open-stock/delete',
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: key,
        },
    };
};


const updateAttractionTicketAmenity = (amenityKey, localFields, multi_language) => {
    let amenityLangPacks = multi_language.map((value) => {
        return [newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_AMENITY_NAME]: value[newConstants.TICKET_AMENITY_NAME][newConstants.VALUE],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy/update',
        pay_load: {
            [newConstants.TICKET_AMENITY_NAME]: localFields[newConstants.TICKET_AMENITY_NAME][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_KEY]: amenityKey,
            [newConstants.TICKET_AMENITY_TYPE_KEY]: localFields[newConstants.TICKET_AMENITY_TYPE_KEY][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_DEFAULT_PRICE]: parseInt(
                localFields[newConstants.TICKET_AMENITY_DEFAULT_PRICE][newConstants.VALUE],
            ),
            [newConstants.TICKET_AMENITY_IS_TAX_AVAILABEL]: localFields[newConstants.TICKET_AMENITY_IS_TAX_AVAILABEL][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_GLYPH_ICON]: localFields[newConstants.TICKET_AMENITY_GLYPH_ICON][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_LANGUAGES]: amenityLangPacks.filter((f) => f != null),
        },
    };
};
const createAttractionTicketAmenity = (localFields, multi_language) => {
    let amenityLangPacks = multi_language.map((value) => {
        return [newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_AMENITY_NAME]: value[newConstants.TICKET_AMENITY_NAME][newConstants.VALUE],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy/save',
        pay_load: {
            [newConstants.TICKET_AMENITY_NAME]: localFields[newConstants.TICKET_AMENITY_NAME][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_TYPE_KEY]: localFields[newConstants.TICKET_AMENITY_TYPE_KEY][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_DEFAULT_PRICE]: parseInt(
                localFields[newConstants.TICKET_AMENITY_DEFAULT_PRICE][newConstants.VALUE],
            ),
            [newConstants.TICKET_AMENITY_IS_TAX_AVAILABEL]: localFields[newConstants.TICKET_AMENITY_IS_TAX_AVAILABEL][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_GLYPH_ICON]: localFields[newConstants.TICKET_AMENITY_GLYPH_ICON][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_LANGUAGES]: amenityLangPacks.filter((f) => f != null),
        },
    };
};

//new API
const getAllAttractionTicketAmenityType = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy-type/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]:"A"
        },
    };
};
const getAttractionTicketAmenityTypeByKey = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy-type/get-by-key',
        pay_load: {
            [newConstants.TICKET_AMENITY_TYPE_KEY]: key,
        },
    };
};


const deleteAttractionTicketAmenityType = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy-type/delete',
        pay_load: {
            [newConstants.TICKET_AMENITY_TYPE_KEY]: key,
        },
    };
};

const updateAttractionTicketAmenityType = (amenityTypeKey, localFields, multi_language) => {
    let amenityLangPacks = multi_language.map((value) => {
        return [newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_AMENITY_TYPE_DESC]: value[newConstants.TICKET_AMENITY_TYPE_DESC][newConstants.VALUE],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy-type/update',
        pay_load: {
            [newConstants.TICKET_AMENITY_TYPE_KEY]: amenityTypeKey,
            [newConstants.TICKET_AMENITY_TYPE_DESC]: localFields[newConstants.TICKET_AMENITY_TYPE_DESC][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_TYPE_GLYPH_ICON]: localFields[newConstants.TICKET_AMENITY_TYPE_GLYPH_ICON][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_TYPE_LANGUAGES]: amenityLangPacks.filter((f) => f != null),
        },
    };
};
const createAttractionTicketAmenityType = (localFields, multi_language) => {
    let amenityLangPacks = multi_language.map((value) => {
        return [newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_AMENITY_TYPE_DESC]: value[newConstants.TICKET_AMENITY_TYPE_DESC][newConstants.VALUE],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy-type/save',
        pay_load: {
            [newConstants.TICKET_AMENITY_TYPE_DESC]: localFields[newConstants.TICKET_AMENITY_TYPE_DESC][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_TYPE_GLYPH_ICON]: localFields[newConstants.TICKET_AMENITY_TYPE_GLYPH_ICON][newConstants.VALUE],
            [newConstants.TICKET_AMENITY_TYPE_LANGUAGES]: amenityLangPacks.filter((f) => f != null),
        },
    };
};

const LedgerAccountSupplier = () => {
    return {
        url: newBaseUrl + 'client/accounts/ledger-group/accounts-group-by-supplier',
        pay_load: {
            [newConstants.LEDGER_GROUP_TYPE]: "SUPPLIER",
        },
    };
}

const attractionSupplierTaxRule = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-supplier/tax-rule',
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

const getAttractionTicketSupplier = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-supplier/get',
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



const getAttractionTicketKey = (id) => {
    return {
        url: newBaseUrl + 'attraction/ticket-supplier/get-by-key',
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: id,
        },
    };
};

const createAttractionTicketSupplier = (fields, multi_language) => {
    let hotelCategoryLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][constants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_SUPPLIER_NAME]: value[newConstants.TICKET_SUPPLIER_NAME][newConstants.VALUE],
                [newConstants.TICKET_SUPPLIER_ADDRESS]: value[newConstants.TICKET_SUPPLIER_ADDRESS][newConstants.VALUE],
                [newConstants.TICKET_SUPPLIER_REMARK]: value[newConstants.TICKET_SUPPLIER_REMARK][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-supplier/save',
        pay_load: {
            [newConstants.TICKET_MODULE_KEY]: fields[newConstants.TICKET_MODULE_KEY][newConstants.VALUE],
            [newConstants.LEDGER_GROUP_KEY]: fields[newConstants.LEDGER_GROUP_KEY][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_REGNO]: fields[newConstants.TICKET_SUPPLIER_REGNO][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_NAME]: fields[newConstants.TICKET_SUPPLIER_NAME][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_ADDRESS]: fields[newConstants.TICKET_SUPPLIER_ADDRESS][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_CITY_KEY]: fields[newConstants.TICKET_SUPPLIER_CITY_KEY][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_STATE_KEY]: fields[newConstants.TICKET_SUPPLIER_STATE_KEY][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_COUNTRY_KEY]: fields[newConstants.TICKET_SUPPLIER_COUNTRY_KEY][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_PINCODE]: fields[newConstants.TICKET_SUPPLIER_PINCODE][newConstants.VALUE],
            // [newConstants.TICKET_SUPPLIER_REMARK]: fields[newConstants.TICKET_SUPPLIER_REMARK][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_TELENO1]: fields[newConstants.TICKET_SUPPLIER_TELENO1][newConstants.VALUE],
            // [newConstants.TICKET_SUPPLIER_TELENO2]: fields[newConstants.TICKET_SUPPLIER_TELENO2][newConstants.VALUE],
            // [newConstants.TICKET_SUPPLIER_MOBILENO1]: fields[newConstants.TICKET_SUPPLIER_MOBILENO1][newConstants.VALUE],
            // [newConstants.TICKET_SUPPLIER_MOBILENO2]: fields[newConstants.TICKET_SUPPLIER_MOBILENO2][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_FAX1]: fields[newConstants.TICKET_SUPPLIER_FAX1][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_WEBURL]: fields[newConstants.TICKET_SUPPLIER_WEBURL][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_EMAIL]: fields[newConstants.TICKET_SUPPLIER_EMAIL][newConstants.VALUE],
            // [newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE]: parseFloat(fields[newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE][newConstants.VALUE]),
            // [newConstants.SUPPLIER_SERVICE_PERCENTAGE]: parseFloat(fields[newConstants.SUPPLIER_SERVICE_PERCENTAGE][newConstants.VALUE]),
            // [newConstants.SUPPLIER_TAX_PERCENTAGE]: parseFloat(fields[newConstants.SUPPLIER_TAX_PERCENTAGE][newConstants.VALUE]),
            // [newConstants.SUPPLIER_TAX_RULE_KEY]: fields[newConstants.SUPPLIER_TAX_RULE_KEY][newConstants.VALUE],
            [newConstants.LEDGER_CURR_CODE]: fields[newConstants.LEDGER_CURR_CODE][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_LANGUAGES]: hotelCategoryLangPack.filter((f) => f != null),
            [newConstants.TICKET_SUPPLIER_LINKS]: fields[newConstants.TICKET_TYPE_KEY][newConstants.VALUE].map((value) => ({
                [newConstants.TICKET_TYPE_KEY]: value[newConstants.VALUE],
                [newConstants.TICKET_TYPE_NAME]: value.label,
            })),
        },
    };
};

const updateAttractionTicketSupplier = (id, fields, multi_language) => {
    let hotelCategoryLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][constants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_SUPPLIER_NAME]: value[newConstants.TICKET_SUPPLIER_NAME][newConstants.VALUE],
                [newConstants.TICKET_SUPPLIER_ADDRESS]: value[newConstants.TICKET_SUPPLIER_ADDRESS][newConstants.VALUE],
                [newConstants.TICKET_SUPPLIER_REMARK]: value[newConstants.TICKET_SUPPLIER_REMARK][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-supplier/update',
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: id,
            [newConstants.TICKET_MODULE_KEY]: fields[newConstants.TICKET_MODULE_KEY][newConstants.VALUE],
            [newConstants.LEDGER_GROUP_KEY]: fields[newConstants.LEDGER_GROUP_KEY][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_REGNO]: fields[newConstants.TICKET_SUPPLIER_REGNO][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_NAME]: fields[newConstants.TICKET_SUPPLIER_NAME][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_ADDRESS]: fields[newConstants.TICKET_SUPPLIER_ADDRESS][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_CITY_KEY]: fields[newConstants.TICKET_SUPPLIER_CITY_KEY][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_STATE_KEY]: fields[newConstants.TICKET_SUPPLIER_STATE_KEY][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_COUNTRY_KEY]: fields[newConstants.TICKET_SUPPLIER_COUNTRY_KEY][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_PINCODE]: fields[newConstants.TICKET_SUPPLIER_PINCODE][newConstants.VALUE],
            // [newConstants.TICKET_SUPPLIER_REMARK]: fields[newConstants.TICKET_SUPPLIER_REMARK][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_TELENO1]: fields[newConstants.TICKET_SUPPLIER_TELENO1][newConstants.VALUE],
            // [newConstants.TICKET_SUPPLIER_TELENO2]: fields[newConstants.TICKET_SUPPLIER_TELENO2][newConstants.VALUE],
            // [newConstants.TICKET_SUPPLIER_MOBILENO1]: fields[newConstants.TICKET_SUPPLIER_MOBILENO1][newConstants.VALUE],
            // [newConstants.TICKET_SUPPLIER_MOBILENO2]: fields[newConstants.TICKET_SUPPLIER_MOBILENO2][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_FAX1]: fields[newConstants.TICKET_SUPPLIER_FAX1][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_WEBURL]: fields[newConstants.TICKET_SUPPLIER_WEBURL][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_EMAIL]: fields[newConstants.TICKET_SUPPLIER_EMAIL][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: fields[newConstants.IS_ACTIVE][newConstants.VALUE],
            // [newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE]: parseFloat(fields[newConstants.SUPPLIER_ADDITIONAL_PERCENTAGE][newConstants.VALUE]),
            // [newConstants.SUPPLIER_SERVICE_PERCENTAGE]: parseFloat(fields[newConstants.SUPPLIER_SERVICE_PERCENTAGE][newConstants.VALUE]),
            // [newConstants.SUPPLIER_TAX_PERCENTAGE]: parseFloat(fields[newConstants.SUPPLIER_TAX_PERCENTAGE][newConstants.VALUE]),
            // [newConstants.SUPPLIER_TAX_RULE_KEY]: fields[newConstants.SUPPLIER_TAX_RULE_KEY][newConstants.VALUE],
            [newConstants.LEDGER_CURR_CODE]: fields[newConstants.LEDGER_CURR_CODE][newConstants.VALUE],
            [newConstants.TICKET_SUPPLIER_LANGUAGES]: hotelCategoryLangPack.filter((f) => f != null),
            [newConstants.TICKET_SUPPLIER_LINKS]: fields[newConstants.TICKET_TYPE_KEY][newConstants.VALUE].map((value) => ({
                [newConstants.TICKET_TYPE_KEY]: value[newConstants.VALUE],
                [newConstants.TICKET_TYPE_NAME]: value.label,
            })),
        },
    };
};


const getKeyAttractionTicketSupplier = (id) => {
    return {
        url: newBaseUrl + 'attraction/ticket-supplier/get-by-key',
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: id,
        },
    };
};

const deleteAttractionTicketSupplier = (id) => {
    return {
        url: newBaseUrl + 'attraction/ticket-supplier/delete',
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: id,
        },
    };
};

const getTicketModule = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-supplier/get-module',
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

const getAttractionImageTypeById = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-image-type/get-by-key',
        pay_load: {
            [newConstants.TICKET_IMAGE_TYPE_KEY]: key,
        },
    };
};

const getAllImageType = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-image-type/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
        },
    };
};



const createAttractionImageType = (localFields, multi_language) => {
    let listImageTypeLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_IMAGE_TYPE_DESC]: value[newConstants.TICKET_IMAGE_TYPE_DESC][newConstants.VALUE],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-image-type/save',
        pay_load: {
            [newConstants.TICKET_IMAGE_TYPE_DESC]: localFields[newConstants.TICKET_IMAGE_TYPE_DESC][newConstants.VALUE],
            [newConstants.TICKET_IMAGE_TYPE_LANGUAGES]: listImageTypeLangPack.filter((f) => f != null),
        },
    };
};

const updateAttractionImageType = (key, localFields, multi_language) => {
    let ImageLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_IMAGE_TYPE_DESC]: value[newConstants.TICKET_IMAGE_TYPE_DESC][newConstants.VALUE],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-image-type/update',
        pay_load: {
            [newConstants.TICKET_IMAGE_TYPE_KEY]: key,
            [newConstants.TICKET_IMAGE_TYPE_DESC]: localFields[newConstants.TICKET_IMAGE_TYPE_DESC][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.TICKET_IMAGE_TYPE_LANGUAGES]: ImageLangPacks.filter((f) => f != null),
        },
    };
};


const deleteAttractionImageType = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-image-type/delete',
        pay_load: {
            [newConstants.TICKET_IMAGE_TYPE_KEY]: key,
        },
    };
};

const getAllAttractionTicketTag = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-tag/get',
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


const getAttractionTicketTagInfoById = (id) => {
    return {
        url: newBaseUrl + 'attraction/ticket-tag/get-by-key',
        pay_load: {
            [newConstants.TICKET_TAG_KEY]: id,
        },
    };
};

// manage attractions 
const getAllAttractionTicket = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket/get',
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
const getAttractionTicketByKey = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket/get-by-key',
        pay_load: {
            [newConstants.TICKET_KEY]: key,
        },
    };
};
const deleteAttractionTicket = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket/delete',
        pay_load: {
            [newConstants.TICKET_KEY]: key,
        },
    };
};



const createAttractionTicket = (localFields, multi_language, rightAmen, ticket_images, ticket_description) => {
    let ticketLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_NAME]: value[newConstants.TICKET_NAME][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket/save',
        pay_load: {
            [newConstants.SUPPLIER_KEY]: localFields[newConstants.SUPPLIER_KEY][newConstants.VALUE],
            [newConstants.TICKET_CATEGORY_KEY]: localFields[newConstants.TICKET_CATEGORY_KEY][newConstants.VALUE],
            [newConstants.TICKET_NAME]: localFields[newConstants.TICKET_NAME][newConstants.VALUE],
            [newConstants.TICKET_CODE]: localFields[newConstants.TICKET_CODE][newConstants.VALUE],
            [newConstants.BEGIN_DATE]: localFields[newConstants.BEGIN_DATE][newConstants.VALUE],
            [newConstants.EXPIRE_DATE]: localFields[newConstants.EXPIRE_DATE][newConstants.VALUE],
            [newConstants.TICKET_FEATURED_IMAGE_KEY]: localFields[newConstants.TICKET_FEATURED_IMAGE_KEY][newConstants.VALUE],
            [newConstants.IS_EXPIRE]: Number(localFields[newConstants.IS_EXPIRE][newConstants.VALUE]),
            [newConstants.IS_STOCK_TICKET]: Number(localFields[newConstants.IS_STOCK_TICKET][newConstants.VALUE]),
            [newConstants.IS_ALL_DAYS_IN_WEEK]: Number(localFields[newConstants.IS_ALL_DAYS_IN_WEEK][newConstants.VALUE]),
            [newConstants.IS_SUNDAY]: Number(localFields[newConstants.IS_SUNDAY][newConstants.VALUE]),
            [newConstants.IS_MONDAY]: Number(localFields[newConstants.IS_MONDAY][newConstants.VALUE]),
            [newConstants.IS_TUESDAY]: Number(localFields[newConstants.IS_TUESDAY][newConstants.VALUE]),
            [newConstants.IS_WEDNESDAY]: Number(localFields[newConstants.IS_WEDNESDAY][newConstants.VALUE]),
            [newConstants.IS_THURSDAY]: Number(localFields[newConstants.IS_THURSDAY][newConstants.VALUE]),
            [newConstants.IS_FRIDAY]: Number(localFields[newConstants.IS_FRIDAY][newConstants.VALUE]),
            [newConstants.IS_SATURDAY]: Number(localFields[newConstants.IS_SATURDAY][newConstants.VALUE]),
            [newConstants.TICKET_LANGUAGES]: ticketLangPack.filter((f) => f != null),
            [newConstants.TICKET_AMENITY_LINKS]: rightAmen.map((value) => ({
                [newConstants.TICKET_AMENITY_KEY]: value[newConstants.TICKET_AMENITY_KEY],
                [newConstants.TICKET_AMENITY_NAME]: value[newConstants.TICKET_AMENITY_NAME],
            })),
            [newConstants.TICKET_TAG_LINKS]: localFields[newConstants.TICKET_TAG_KEY][newConstants.VALUE].map((value) => ({
                [newConstants.TICKET_TAG_KEY]: value[newConstants.VALUE],
                [newConstants.TICKET_TAG_NAME]: value.label,
            })),
            [newConstants.TICKET_IMAGE_LINKS]: ticket_images.map((value) => ({
                [newConstants.TICKET_IMAGE_TYPE_KEY]: value.image_type_key,
                ["ticket-image-path-key"]: value.value,
                [newConstants.TICKET_IMAGE_PATH]: value.url
            })),
            [newConstants.TICKET_DESCRIPTIONS]: ticket_description.map((value) => ({
                [newConstants.TICKET_DESCRIPTION_LABEL]: value[newConstants.TICKET_DESCRIPTION_LABEL],
                [newConstants.TICKET_DESCRIPTION_TEXT]: value[newConstants.TICKET_DESCRIPTION_TEXT],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE]
            })),
        },
    };
};


const updateAttractionTicket = (key, localFields, multi_language, rightAmen, ticket_images, ticket_description) => {
    let ticketLangPack = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
                [newConstants.TICKET_NAME]: value[newConstants.TICKET_NAME][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket/update',
        pay_load: {
            [newConstants.TICKET_KEY]: key,
            [newConstants.SUPPLIER_KEY]: localFields[newConstants.SUPPLIER_KEY][newConstants.VALUE],
            [newConstants.TICKET_CATEGORY_KEY]: localFields[newConstants.TICKET_CATEGORY_KEY][newConstants.VALUE],
            [newConstants.TICKET_NAME]: localFields[newConstants.TICKET_NAME][newConstants.VALUE],
            [newConstants.TICKET_CODE]: localFields[newConstants.TICKET_CODE][newConstants.VALUE],
            [newConstants.BEGIN_DATE]: localFields[newConstants.BEGIN_DATE][newConstants.VALUE],
            [newConstants.EXPIRE_DATE]: localFields[newConstants.EXPIRE_DATE][newConstants.VALUE],
            [newConstants.IS_ACTIVE]:localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.TICKET_FEATURED_IMAGE_KEY]: localFields[newConstants.TICKET_FEATURED_IMAGE_KEY][newConstants.VALUE],
            [newConstants.IS_EXPIRE]: Number(localFields[newConstants.IS_EXPIRE][newConstants.VALUE]),
            [newConstants.IS_STOCK_TICKET]: Number(localFields[newConstants.IS_STOCK_TICKET][newConstants.VALUE]),
            [newConstants.IS_ALL_DAYS_IN_WEEK]: Number(localFields[newConstants.IS_ALL_DAYS_IN_WEEK][newConstants.VALUE]),
            [newConstants.IS_SUNDAY]: Number(localFields[newConstants.IS_SUNDAY][newConstants.VALUE]),
            [newConstants.IS_MONDAY]: Number(localFields[newConstants.IS_MONDAY][newConstants.VALUE]),
            [newConstants.IS_TUESDAY]: Number(localFields[newConstants.IS_TUESDAY][newConstants.VALUE]),
            [newConstants.IS_WEDNESDAY]: Number(localFields[newConstants.IS_WEDNESDAY][newConstants.VALUE]),
            [newConstants.IS_THURSDAY]: Number(localFields[newConstants.IS_THURSDAY][newConstants.VALUE]),
            [newConstants.IS_FRIDAY]: Number(localFields[newConstants.IS_FRIDAY][newConstants.VALUE]),
            [newConstants.IS_SATURDAY]: Number(localFields[newConstants.IS_SATURDAY][newConstants.VALUE]),
            [newConstants.TICKET_LANGUAGES]: ticketLangPack.filter((f) => f != null),
            [newConstants.TICKET_AMENITY_LINKS]: rightAmen.map((value) => ({
                [newConstants.TICKET_AMENITY_KEY]: value[newConstants.TICKET_AMENITY_KEY],
                [newConstants.TICKET_AMENITY_NAME]: value[newConstants.TICKET_AMENITY_NAME],
            })),
            [newConstants.TICKET_TAG_LINKS]: localFields[newConstants.TICKET_TAG_KEY][newConstants.VALUE].map((value) => ({
                [newConstants.TICKET_TAG_KEY]: value[newConstants.VALUE],
                [newConstants.TICKET_TAG_NAME]: value.label,
            })),
            [newConstants.TICKET_IMAGE_LINKS]: ticket_images.map((value) => ({
                [newConstants.TICKET_IMAGE_TYPE_KEY]: value.image_type_key,
                ["ticket-image-path-key"]: value.value,
                [newConstants.TICKET_IMAGE_PATH]: value.url
            })),
            [newConstants.TICKET_DESCRIPTIONS]: ticket_description.map((value) => ({
                [newConstants.TICKET_DESCRIPTION_LABEL]: value[newConstants.TICKET_DESCRIPTION_LABEL],
                [newConstants.TICKET_DESCRIPTION_TEXT]: value[newConstants.TICKET_DESCRIPTION_TEXT],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE]
            })),
        },
    };
};



const getAllAttractionTicketTagY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-tag/get',
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


const getAttractionActiveYTicketSupplier = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-supplier/get',
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

const getAllAttractionTicketCategoryY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-category/get',
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


const AttractionticketPlanPriceSave = (localFields) => {
    return {
        url: newBaseUrl + 'attraction/ticket-plan-price/save',
        pay_load: {
            [newConstants.TICKET_PLAN_KEY]: localFields[newConstants.TICKET_PLAN_KEY][newConstants.VALUE],
            [newConstants.TICKET_KEY]: localFields[newConstants.TICKET_KEY][newConstants.VALUE],
            [newConstants.EFFECTIVE_FROM]: localFields[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
            [newConstants.EFFECTIVE_TO]: localFields[newConstants.EFFECTIVE_TO][newConstants.VALUE],
            [newConstants.TICKET_SEASONALITY_NAME]: localFields[newConstants.TICKET_SEASONALITY_NAME][newConstants.VALUE],
            [newConstants.IS_APPROVED]: Number(localFields[newConstants.IS_APPROVED][newConstants.VALUE]),
            [newConstants.IS_INCLUSIVE_PRICE]: Number(localFields[newConstants.IS_INCLUSIVE_PRICE][newConstants.VALUE]),
        },
    };
};

const eventTicketPlanPriceGetByKey = (key) => {
    return {
        url: newBaseUrl + "event/ticket-plan-price/get-by-key",
        pay_load: {
            [newConstants.TICKET_SEASONALITY_KEY]: key
        }
    }
}


const AttractionticketPlanPriceUpdate = (key, localFields) => {
    return {
        url: newBaseUrl + 'attraction/ticket-plan-price/update',
        pay_load: {
            [newConstants.TICKET_SEASONALITY_KEY]: key,
            [newConstants.TICKET_PLAN_KEY]: localFields[newConstants.TICKET_PLAN_KEY][newConstants.VALUE],
            [newConstants.TICKET_KEY]: localFields[newConstants.TICKET_KEY][newConstants.VALUE],
            [newConstants.EFFECTIVE_FROM]: localFields[newConstants.EFFECTIVE_FROM][newConstants.VALUE],
            [newConstants.EFFECTIVE_TO]: localFields[newConstants.EFFECTIVE_TO][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.TICKET_SEASONALITY_NAME]: localFields[newConstants.TICKET_SEASONALITY_NAME][newConstants.VALUE],
            [newConstants.IS_APPROVED]: Number(localFields[newConstants.IS_APPROVED][newConstants.VALUE]),
            [newConstants.IS_INCLUSIVE_PRICE]: Number(localFields[newConstants.IS_INCLUSIVE_PRICE][newConstants.VALUE]),
        },
    };
};


const attractionTicketPlanPriceGetByKey = (key) => {
    return {
        url: newBaseUrl + "attraction/ticket-plan-price/get-by-key",
        pay_load: {
            [newConstants.TICKET_SEASONALITY_KEY]: key
        }
    }
}


const deleteAttractionTicketPlanPrice = (key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-plan-price/delete',
        pay_load: {
            [newConstants.TICKET_SEASONALITY_KEY]: key,
        },
    };
};

const purchaseInvoiceProcessExcel = (file, tag, type) => {
    return {
        url: newBaseUrl + 'attraction/admin/accounts/purchaseinvoice/process-excel',
        [newConstants.UPLOAD_FILE]: file,
        [newConstants.DOC_TYPE_KEY]: type,
        [newConstants.FORM_NAME]: tag,
    };
};

const getAllAttractionOpenStock = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-open-stock/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
}


const stockInvoiceProcessExcel = (file, tag, type) => {
    return {
        url: newBaseUrl + 'attraction/ticket-open-stock/process-excel',
        [newConstants.UPLOAD_FILE]: file,
        [newConstants.DOC_TYPE_KEY]: type,
        [newConstants.FORM_NAME]: tag,
    };
};


const createAttractionTicketOpenStock = (localFields, purchaseDetails, purchaseExcelData,purchaseModule) => {
    let purchaseDetailsPack = purchaseDetails.map((value) => {
        if(purchaseModule!="MODULE_A" && purchaseModule!="MODULE_B"){
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
    }
    else{
        return {
            [newConstants.TICKET_TYPE_NAME]: value[newConstants.TICKET_TYPE_NAME][newConstants.VALUE],
            [newConstants.TICKET_QUANTITY]: parseInt(value[newConstants.TICKET_QUANTITY][newConstants.VALUE]),
            [newConstants.TICKET_TYPE_KEY]: value[newConstants.TICKET_TYPE_KEY][newConstants.VALUE],
            [newConstants.TICKET_STOCK_KEY]: value[newConstants.TICKET_STOCK_KEY][newConstants.VALUE],
            [newConstants.IS_ZERO_COST]: Number(value[newConstants.IS_ZERO_COST][newConstants.VALUE]),           
            [newConstants.TICKET_COST]: parseInt(value[newConstants.TICKET_COST][newConstants.VALUE]),
            [newConstants.TICKET_MRP]: parseInt(value[newConstants.TICKET_MRP][newConstants.VALUE])
        } 
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
        url: newBaseUrl + "attraction/ticket-open-stock/save",
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: localFields[newConstants.TICKET_SUPPLIER_KEY][newConstants.VALUE],
            [newConstants.TICKET_KEY]: localFields[newConstants.TICKET_KEY][newConstants.VALUE],
            [newConstants.TICKET_PLAN_KEY]: localFields[newConstants.TICKET_PLAN_KEY][newConstants.VALUE],
            [newConstants.TICKET_OPEN_STOCK_DETAILS]: purchaseDetailsPack.filter(f => f != null),
            [newConstants.OPEN_STOCK_EXCEL_DATA]: excelDataPack.filter(f => f != null),
        }
    }
}


const AttractionopenStockKey = (id) => {
    return {
        url: newBaseUrl + 'attraction/ticket-open-stock/get-by-key',
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: id,
        },
    };
};




const getKeyAttractionTicketKeyBYSupplier = (id) => {
    return {
        url: newBaseUrl + 'attraction/ticket-supplier/ticket-type-by-supplier',
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: id,
        },
    };
};


const AttractionTicketPlanByTicketKey = (id) => {
    return {
        url: newBaseUrl + 'attraction/ticket-plan/get-by-ticket-key',
        pay_load: {
            [newConstants.TICKET_KEY]: id,
        },
    };
};


const GetAttractionTicketComments = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-price-comments/get',
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


const createAttractionTicketTag = (localFields, multi_language) => {
    let hotelTagLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_TAG_NAME]: value[newConstants.TICKET_TAG_NAME][newConstants.VALUE],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-tag/save',
        pay_load: {
            [newConstants.TICKET_TAG_NAME]: localFields[newConstants.TICKET_TAG_NAME][newConstants.VALUE],
            [newConstants.TICKET_TAG_LANGUAGES]: hotelTagLangPacks.filter((f) => f != null),
        },
    };
};

const deleteAttractionTickeTag = (id) => {
    return {
        url: newBaseUrl + 'attraction/ticket-tag/delete',
        pay_load: {
            [newConstants.TICKET_TAG_KEY]: id,
        },
    };
};

const editAttractionTicketTag = (key, localFields, multi_language) => {
    let hotelTagLangPacks = multi_language.map((value) => {
        return value[newConstants.LANG_CODE][newConstants.VALUE] != '' ? {
                [newConstants.TICKET_TAG_NAME]: value[newConstants.TICKET_TAG_NAME][newConstants.VALUE],
                [newConstants.LANG_CODE]: value[newConstants.LANG_CODE][newConstants.VALUE],
            } :
            null;
    });
    return {
        url: newBaseUrl + 'attraction/ticket-tag/update',
        pay_load: {
            [newConstants.TICKET_TAG_KEY]: key,
            [newConstants.TICKET_TAG_NAME]: localFields[newConstants.TICKET_TAG_NAME][newConstants.VALUE],
            [newConstants.IS_ACTIVE]: localFields[newConstants.IS_ACTIVE][newConstants.VALUE],
            [newConstants.TICKET_TAG_LANGUAGES]: hotelTagLangPacks.filter((f) => f != null),
        },
    };
};


const supplyKeyByTicketKey = (supplier_key, ticket_key) => {
    return {
        url: newBaseUrl + 'attraction/ticket-open-stock/get-by-ticket-key',
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: supplier_key,
            [newConstants.TICKET_KEY]: ticket_key,
        },
    };
}


const createAttractionTicketPurchaseInvoice = (localFields, purchaseDetails, purchaseExcelData,purchaseModule) => {
    
    let purchaseDetailsPack = purchaseDetails.map((value) => {
        if(purchaseModule!="MODULE_A" && purchaseModule!="MODULE_B"){
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
    }
    else{
        return {
            [newConstants.TICKET_TYPE_NAME]: value[newConstants.TICKET_TYPE_NAME][newConstants.VALUE],
            [newConstants.TICKET_QUANTITY]: parseInt(value[newConstants.TICKET_QUANTITY][newConstants.VALUE]),
            [newConstants.TICKET_TYPE_KEY]: value[newConstants.TICKET_TYPE_KEY][newConstants.VALUE],
            [newConstants.TICKET_STOCK_KEY]: value[newConstants.TICKET_STOCK_KEY][newConstants.VALUE],
            [newConstants.IS_ZERO_COST]: Number(value[newConstants.IS_ZERO_COST][newConstants.VALUE]),           
            [newConstants.TICKET_COST]: parseInt(value[newConstants.TICKET_COST][newConstants.VALUE]),
            [newConstants.TICKET_MRP]: parseInt(value[newConstants.TICKET_MRP][newConstants.VALUE])
        } 
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
        url: newBaseUrl + "attraction/admin/accounts/purchaseinvoice/save",
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: localFields[newConstants.TICKET_SUPPLIER_KEY][newConstants.VALUE],
            [newConstants.TICKET_KEY]: localFields[newConstants.TICKET_KEY][newConstants.VALUE],
            [newConstants.TICKET_PLAN_KEY]: localFields[newConstants.TICKET_PLAN_KEY][newConstants.VALUE],
            [newConstants.INVOICE_REF_NUMBER]: localFields[newConstants.INVOICE_REF_NUMBER][newConstants.VALUE],
            [newConstants.INVOICE_DATE]: localFields[newConstants.INVOICE_DATE][newConstants.VALUE],
            [newConstants.EXPIRY_DAYS]: localFields[newConstants.EXPIRY_DAYS][newConstants.VALUE],
            [newConstants.PURCHASE_INVOICE_DETAILS]: purchaseDetailsPack.filter(f => f != null),
            [newConstants.PURCHASE_INVOICE_EXCEL_DATA]: excelDataPack.filter(f => f != null),
        }
    }
}


const getAllAttractionPurchase = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/admin/accounts/purchaseinvoice/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.SEARCH_TEXT]: search_key,
            [newConstants.IS_ACTIVE]: "A"
        },
    };
}


const AttractionTicketpurchaseinvoiceKey = (supplier_key) => {
    return {
        url: newBaseUrl + 'attraction/admin/accounts/purchaseinvoice/get-by-key',
        pay_load: {
            [newConstants.TICKET_SUPPLIER_KEY]: supplier_key,
        },
    };
}


const getAllAttractionTicketActiveY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket/seasonality-tickets',
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

const imageUploder = (file, tag, type) => {
    return {
        url: newBaseUrl + 'api/upload',
        [newConstants.UPLOAD_FILE]: file,
        [newConstants.DOC_TYPE_KEY]: type,
        [newConstants.FORM_NAME]: tag,
    };
};

const getAllAmmunityY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'attraction/ticket-amentiy/get',
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

export {
    deleteAttractionOpenStock,
    createAttractionTicketTag,
    editAttractionTicketTag,
    deleteAttractionTickeTag,
    getAttractionTicketTagInfoById,
    getAllAttractionTicketTag,
    getAllAttractionTicketTagY,
    createAttractionImageType,
    updateAttractionImageType,
    deleteAttractionImageType,
    getAttractionImageTypeById,
    getAllImageType,
    createAttractionTicketSupplier,
    updateAttractionTicketSupplier,
    deleteAttractionTicketSupplier,
    getTicketModule,
    getAllAttractionTicketAmenityType,
    getAttractionTicketAmenityTypeByKey,
    deleteAttractionTicketAmenityType,
    updateAttractionTicketAmenityType,
    createAttractionTicketAmenityType,
    getAllAttractionTicketAmenity,
    getAllAttractionTicketY,
    getAttractionTicketAmenityByKey,
    deleteAttractionTicketAmenity,
    updateAttractionTicketAmenity,
    createAttractionTicketAmenity,
    getAllAttractionImageType,
    getAttractionTicketKey,
    getAttractionTicketTypeByKey,
    deleteAttractionTicketType,
    createAttractionTicketType,
    updateAttractionTicketType,
    getAllAttractionTicket,
    getAttractionTicketSupplier,
    getAttractionTicketByKey,
    deleteAttractionTicket,
    createAttractionTicket,
    updateAttractionTicket,
    getAttractionTicketPlan,
    createAttractionTicketPlan,
    getAttractionTicketPlanByKey,
    UpdateAttractionTicketPlan,
    getTicketRefundTypes,
    createAttractionTicketPriceComments,
    updateAttractionTicketPriceComments,
    getAttractionTicketPriceCommentsByKey,
    deleteAttractionTicketPriceComments,
    getAllAttractionTicketPriceComments,
    AttractionticketPlanPriceSave,
    attractionTicketPlanPriceGetByKey,
    deleteAttractionTicketPlanPrice,
    purchaseInvoiceProcessExcel,
    getAllAttractionOpenStock,
    stockInvoiceProcessExcel,
    createAttractionTicketOpenStock,
    AttractionopenStockKey,
    createAttractionTicketCategory,
    getAllAttractionTicketCategory,
    getAllAttractionTicketCategoryY,
    getAttractionTicketCategoryKey,
    deleteAttractionTicketCategoryKey,
    updateAttractionHotelTicketCategory,
    attractionSupplierTaxRule,
    getAllAttractionTicketType,
    getAllAttractionTicketTypeY,
    getKeyAttractionTicketSupplier,
    getKeyAttractionTicketKeyBYSupplier,
    GetAttractionTicketComments,
    AttractionTicketPlanByTicketKey,
    getAllAttractionPurchase,
    AttractionTicketpurchaseinvoiceKey,
    supplyKeyByTicketKey,
    createAttractionTicketPurchaseInvoice,
    getAttractionActiveYTicketSupplier,
    getAllEvenTicketPlanPrice,
    getAllAttractionTicketActiveY,
    AttractionticketPlanPriceUpdate,
    imageUploder,
    getAllAmmunityY,
    LedgerAccountSupplier,
    deleteAttractionTicketPlan,
    eventTicketPlanPriceGetByKey
};