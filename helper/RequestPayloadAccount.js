import { constants, newConstants, baseUrl, newBaseUrl, MAPBOX_TOKEN } from './constants';
//Account Group
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
//Account
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
const getAllAccountsGroupY = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'client/accounts/ledger-group/get',
        pay_load: {
            [newConstants.DISPLAY_LENGTH]: length,
            [newConstants.DISPLAY_START]: start,
            [newConstants.SORT_COLUMN]: 0,
            [newConstants.SORT_DIRECTION]: 'ASC',
            [newConstants.IS_ACTIVE]: "Y",
        },
    };
};

//ModeofPay
const getAllAccountsGroupParentBankCash = () => {
    return {
        url: newBaseUrl + "client/accounts/ledger-group/ledger-group-by-parent-bank-cash",
        pay_load: {}
    }
}
const geAccountsLedgerGroupKey = (key) => {
    return {
        url: newBaseUrl + "client/accounts/ledger/ledger-by-ledger-group",
        pay_load: {
            [newConstants.LEDGER_GROUP_KEY]: key
        }
    }
}
const getModeOfPayRemark = () => {
    return {
        url: newBaseUrl + "client/accounts/mop/remark-fields",
        pay_load: {}
    }
}
const getModeOfPay = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
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
const createModeOfPay = (localFields, multi_language, detail) => {
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
const updateModeOfPay = (id, localFields, multi_language, detail) => {
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
const getModeOfPayKey = (key) => {
    return {
        url: newBaseUrl + "client/accounts/mop/get-by-key",
        pay_load: {
            [newConstants.MOP_MASTER_KEY]: key
        }
    }
}
const deleteModeOfPay = (key) => {
    return {
        url: newBaseUrl + "client/accounts/mop/delete",
        pay_load: {
            [newConstants.MOP_MASTER_KEY]: key
        }
    }
}

//Expense
const getAllExpenseTnxType = () => {
    return {
        url: newBaseUrl + "client/accounts/expense/trans-types",
        pay_load: {}
    }
}
const getExpenseLedgerGroupType = () => {
    return {
        url: newBaseUrl + "client/accounts/expense/ledger-by-ledger-group-types",
        pay_load: {}
    }
}
//getAccountsByKey
//getModeOfPay
const getMopKeyModeOfPayExpense = (key) => {
    return {
        url: newBaseUrl + "client/accounts/mop/ledger-accounts-by-mopkey",
        pay_load: {
            [newConstants.MOP_MASTER_KEY]: key
        }
    }
}
const getAllExpense = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
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
const createExpense = (localFields, transDetails, mopFields) => {
    let trans_details = {
        [newConstants.LEDGER_KEY]:transDetails[newConstants.LEDGER_KEY][newConstants.VALUE],
        [newConstants.LEDGER_NAME]:transDetails[newConstants.LEDGER_NAME][newConstants.VALUE],
        [newConstants.ACCOUNT_KEY]:transDetails[newConstants.ACCOUNT_KEY][newConstants.VALUE],
        [newConstants.ACCOUNT_NAME]:transDetails[newConstants.ACCOUNT_NAME][newConstants.VALUE],
        [newConstants.TXN_AMOUNT]:parseFloat(transDetails[newConstants.TXN_AMOUNT][newConstants.VALUE]),
    }
    return {
        url: newBaseUrl + "client/accounts/expense/save",
        pay_load: {
            [newConstants.TXN_DATE]: localFields[newConstants.TXN_DATE][newConstants.VALUE],
            [newConstants.TXN_TYPE]: localFields[newConstants.TXN_TYPE][newConstants.VALUE],
            [newConstants.MOP_MASTER_KEY]: localFields[newConstants.MOP_MASTER_KEY][newConstants.VALUE],
            [newConstants.MOP_NAME]: mopFields[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_CAPTION]: mopFields[newConstants.MOP_REMARK_FIELD1_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD1_VALUE]: mopFields[newConstants.MOP_REMARKS_FIELD1_VALUE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_CAPTION]: mopFields[newConstants.MOP_REMARK_FIELD2_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD2_VALUE]: mopFields[newConstants.MOP_REMARKS_FIELD2_VALUE][newConstants.VALUE],
            [newConstants.TXN_REC_AMOUNT]: parseFloat(localFields[newConstants.TXN_REC_AMOUNT][newConstants.VALUE]),
            [newConstants.TXN_REMARKS]: localFields[newConstants.TXN_REMARK][newConstants.VALUE],
            [newConstants.LEDGER_TRANS_DETAILS]: trans_details
        }
    }
}
const updateExpense = (key,localFields, transDetails, mopFields) => {
    let trans_details = {
        [newConstants.LEDGER_KEY]:transDetails[newConstants.LEDGER_KEY][newConstants.VALUE],
        [newConstants.LEDGER_NAME]:transDetails[newConstants.LEDGER_NAME][newConstants.VALUE],
        [newConstants.ACCOUNT_KEY]:transDetails[newConstants.ACCOUNT_KEY][newConstants.VALUE],
        [newConstants.ACCOUNT_NAME]:transDetails[newConstants.ACCOUNT_NAME][newConstants.VALUE],
        [newConstants.TXN_AMOUNT]:parseFloat(transDetails[newConstants.TXN_AMOUNT][newConstants.VALUE]),
    }
    return {
        url: newBaseUrl + "client/accounts/expense/update",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key,
            [newConstants.TXN_DATE]: localFields[newConstants.TXN_DATE][newConstants.VALUE],
            [newConstants.TXN_TYPE]: localFields[newConstants.TXN_TYPE][newConstants.VALUE],
            [newConstants.MOP_MASTER_KEY]: localFields[newConstants.MOP_MASTER_KEY][newConstants.VALUE],
            [newConstants.MOP_NAME]: mopFields[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_CAPTION]: mopFields[newConstants.MOP_REMARK_FIELD1_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD1_VALUE]: mopFields[newConstants.MOP_REMARKS_FIELD1_VALUE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_CAPTION]: mopFields[newConstants.MOP_REMARK_FIELD2_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD2_VALUE]: mopFields[newConstants.MOP_REMARKS_FIELD2_VALUE][newConstants.VALUE],
            [newConstants.TXN_REC_AMOUNT]: parseFloat(localFields[newConstants.TXN_REC_AMOUNT][newConstants.VALUE]),
            [newConstants.TXN_REMARKS]: localFields[newConstants.TXN_REMARK][newConstants.VALUE],
            [newConstants.LEDGER_TRANS_DETAILS]: trans_details
        }
    }
}
const getExpenseByKey = (key) => {
    return {
        url: newBaseUrl + "client/accounts/expense/get-by-key",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key
        }
    }
}
const deleteExpense = (key) => {
    return {
        url: newBaseUrl + "client/accounts/expense/delete",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key
        }
    }
}

//Journal
const getAllJournalTransType = () => {
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/trans-types",
        pay_load: {}
    }
}
const getJournalLedgerGroupType = () => {
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/ledger-by-ledger-group-types",
        pay_load: {}
    }
}
//getAccountsByKey
//getModeOfPay
const getMopKeyModeOfPayJournal = (key) => {
    return {
        url: newBaseUrl + "client/accounts/mop/ledger-accounts-by-mopkey",
        pay_load: {
            [newConstants.MOP_MASTER_KEY]: key
        }
    }
}
const getAllJournal = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
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
const createJournal = (localFields, transDetails, mopFields) => {
    let trans_details = {
        [newConstants.LEDGER_KEY]:transDetails[newConstants.LEDGER_KEY][newConstants.VALUE],
        [newConstants.LEDGER_NAME]:transDetails[newConstants.LEDGER_NAME][newConstants.VALUE],
        [newConstants.ACCOUNT_KEY]:transDetails[newConstants.ACCOUNT_KEY][newConstants.VALUE],
        [newConstants.ACCOUNT_NAME]:transDetails[newConstants.ACCOUNT_NAME][newConstants.VALUE],
        [newConstants.TXN_AMOUNT]:parseFloat(transDetails[newConstants.TXN_AMOUNT][newConstants.VALUE]),
    }
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/save",
        pay_load: {
            [newConstants.TXN_DATE]: localFields[newConstants.TXN_DATE][newConstants.VALUE],
            [newConstants.TXN_TYPE]: localFields[newConstants.TXN_TYPE][newConstants.VALUE],
            [newConstants.MOP_MASTER_KEY]: localFields[newConstants.MOP_MASTER_KEY][newConstants.VALUE],
            [newConstants.MOP_NAME]: mopFields[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_CAPTION]: mopFields[newConstants.MOP_REMARK_FIELD1_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD1_VALUE]: mopFields[newConstants.MOP_REMARKS_FIELD1_VALUE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_CAPTION]: mopFields[newConstants.MOP_REMARK_FIELD2_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD2_VALUE]: mopFields[newConstants.MOP_REMARKS_FIELD2_VALUE][newConstants.VALUE],
            [newConstants.TXN_REC_AMOUNT]: parseFloat(localFields[newConstants.TXN_REC_AMOUNT][newConstants.VALUE]),
            [newConstants.TXN_REMARKS]: localFields[newConstants.TXN_REMARK][newConstants.VALUE],
            [newConstants.LEDGER_TRANS_DETAILS]: trans_details
        }
    }
}
const updateJournal = (key,localFields, transDetails, mopFields) => {
    let trans_details = {
        [newConstants.LEDGER_KEY]:transDetails[newConstants.LEDGER_KEY][newConstants.VALUE],
        [newConstants.LEDGER_NAME]:transDetails[newConstants.LEDGER_NAME][newConstants.VALUE],
        [newConstants.ACCOUNT_KEY]:transDetails[newConstants.ACCOUNT_KEY][newConstants.VALUE],
        [newConstants.ACCOUNT_NAME]:transDetails[newConstants.ACCOUNT_NAME][newConstants.VALUE],
        [newConstants.TXN_AMOUNT]:parseFloat(transDetails[newConstants.TXN_AMOUNT][newConstants.VALUE]),
    }
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/update",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key,
            [newConstants.TXN_DATE]: localFields[newConstants.TXN_DATE][newConstants.VALUE],
            [newConstants.TXN_TYPE]: localFields[newConstants.TXN_TYPE][newConstants.VALUE],
            [newConstants.MOP_MASTER_KEY]: localFields[newConstants.MOP_MASTER_KEY][newConstants.VALUE],
            [newConstants.MOP_NAME]: mopFields[newConstants.MOP_NAME][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD1_CAPTION]: mopFields[newConstants.MOP_REMARK_FIELD1_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD1_VALUE]: mopFields[newConstants.MOP_REMARKS_FIELD1_VALUE][newConstants.VALUE],
            [newConstants.MOP_REMARK_FIELD2_CAPTION]: mopFields[newConstants.MOP_REMARK_FIELD2_CAPTION][newConstants.VALUE],
            [newConstants.MOP_REMARKS_FIELD2_VALUE]: mopFields[newConstants.MOP_REMARKS_FIELD2_VALUE][newConstants.VALUE],
            [newConstants.TXN_REC_AMOUNT]: parseFloat(localFields[newConstants.TXN_REC_AMOUNT][newConstants.VALUE]),
            [newConstants.TXN_REMARKS]: localFields[newConstants.TXN_REMARK][newConstants.VALUE],
            [newConstants.LEDGER_TRANS_DETAILS]: trans_details
        }
    }

}
const getJournalByKey = (key) => {
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/get-by-key",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key
        }
    }
}
const deleteJournal = (key) => {
    return {
        url: newBaseUrl + "client/accounts/ledgerjournal/delete",
        pay_load: {
            [newConstants.TXN_MASTER_KEY]: key
        }
    }
}

export {
    getAllAccountsGroup,
    createAccountsGroup,
    updateAccountsGroup,
    getAccountsGroupByKey,
    deleteAccountsGroup,
    getAllAccountsGroupParent,
    getAllAccounts,
    createAccounts,
    updateAccounts,
    getAccountsByKey,
    deleteAccounts,
    getAllAccountsGroupY,
    getAllAccountsGroupParentBankCash,
    geAccountsLedgerGroupKey,
    getModeOfPayRemark,
    getModeOfPay,
    createModeOfPay,
    updateModeOfPay,
    getModeOfPayKey,
    deleteModeOfPay,
    getAllExpenseTnxType,
    getExpenseLedgerGroupType,
    getMopKeyModeOfPayExpense,
    getAllExpense,
    createExpense,
    updateExpense,
    getExpenseByKey,
    deleteExpense,
    getAllJournalTransType,
    getJournalLedgerGroupType,
    getMopKeyModeOfPayJournal,
    getAllJournal,
    createJournal,
    updateJournal,
    getJournalByKey,
    deleteJournal
}