import { newConstants, newBaseUrl, userConstants } from './constants';

const getAllUsers = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'client/users/get',
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

const createUser = body => {
    return {
        url: newBaseUrl + 'client/users/save',
        pay_load: body,
    };
};

const updateUser = (body) => {
    return {
        url: newBaseUrl + 'client/users/update',
        pay_load: body
    };
};

const deleteUser = key => {
    return {
        url: newBaseUrl + 'client/users/delete',
        pay_load: { [userConstants.USER_KEY]: key }
    };
};

const getClientByKey = key => {
    return {
        url: newBaseUrl + 'client/users/get-by-key',
        pay_load: { [userConstants.USER_KEY]: key }
    };
};

const getClientBranchMenuMas = () => {
    return { url: newBaseUrl + 'client/users/get-client-branch-menu-mas' };
};


// User Role (Menu Rights)

const getAllUsersRole = (search_key = '', start = 1, length = newConstants.PAGE_SIZE) => {
    return {
        url: newBaseUrl + 'client-menu-master/get',
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

const createUserRole = body => {
    return {
        url: newBaseUrl + 'client-menu-master/save',
        pay_load: body,
    };
};

// const updateUserRole = body => {
//     return {
//         url: newBaseUrl + 'client/users/update',
//         pay_load: {
//             [userConstants.USER_KEY]: body[userConstants.USER_KEY].value,
//             [userConstants.USER_NAME]: body[userConstants.USER_NAME].value,
//             [userConstants.IS_ACTIVE]: body[userConstants.IS_ACTIVE].value,
//             [userConstants.USER_BRANCHES]: body[userConstants.USER_BRANCHES].value
//         },
//     };
// };

const deleteUserRole = key => {
    return {
        url: newBaseUrl + 'client-menu-master/delete',
        pay_load: { [userConstants.MENU_RIGHTS_MASTER_KEY]: key }
    };
};

const getClientMenuByKey = key => {
    return {
        url: newBaseUrl + 'client-menu-master/get-by-key',
        pay_load: { [userConstants.MENU_RIGHTS_MASTER_KEY]: key }
    };
};

const getAllMenu = () => {
    return { url: newBaseUrl + 'client-menu-master/get-all-menu' };
};


export {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getClientByKey,
    getClientBranchMenuMas,

    getAllUsersRole,
    createUserRole,
    deleteUserRole,
    getClientMenuByKey,
    getAllMenu
};
