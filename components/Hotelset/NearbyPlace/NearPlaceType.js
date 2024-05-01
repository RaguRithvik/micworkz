import React, { useState, useEffect } from 'react';
import { TextField, Text, Card, Row, Column, Loader, CustomAlert, Glyphi } from '../../../core';
import {
    Fade,
    InputBase,
    Button,
    Checkbox,
    FormControlLabel
} from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { useStore } from '../../../helper/Store';
import { validator, httpPostRequest } from '../../../helper/JsHelper';
import {
    createNearPlaceType,
} from '../../../helper/RequestPayLoad';
import { constants, newConstants } from '../../../helper/constants';
var FA = require('react-fontawesome');


const BootstrapInput = withStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 60,
    },
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    saveButton: {
        minWidth: 140,
        height: 40,
        margin: 5,
        width: '30%',
        backgroundColor: "#3c3c7b",
        color: "white",
        '&:hover': {
            backgroundColor: "#3c3c7b",
        },
    },
    addButton: {
        margin: 5
    },
    closeButton: {
        margin: 5,
        width: '30%',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        height: 30,
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '30ch',
        },
    },
    tableHead: {
        backgroundColor: '#ffffff',
        borderBottom: '1.2px solid' + theme.palette.primary.main,
    },
    tableHeadTuple: {
        color: theme.palette.grey.light,
        fontSize: '15px',
        fontWeight: '1000',
        padding: 15,
        width: 'clamp(150px,10vw,300px)',
        minWidth: 150,
    },
    actionButton: {
        margin: 3,
        backgroundColor: theme.palette.primary.main,
        minWidth: 50,
    },
    actionButtonDelete: {
        margin: 3,
        backgroundColor: theme.palette.error.main,
        minWidth: 50,
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
        },
    },
    columnCheck: {
        marginLeft: 10,
    },
    headerName: {
        borderRadius: 5,
        margin: '10px 0px',
    },
    addEdit: {
        margin: '0px 5px',
        backgroundColor: theme.palette.error.main,
    },
    searchCol: {
        alignContent: 'flex-end',
        [theme.breakpoints.down('xs')]: {
            alignContent: 'end',
            padding: 6,
        },
    },
    Bold: {
        fontWeight: 'bold',
    },
    endPadd: {
        placeContent: 'flex-end',
        padding: 8,
    },
}));

const NearPlaceType = ({ nearPlaceType, setNearPlaceType, init }) => {
    const classes = useStyles();
    const { languages, setAlertMsg } = useStore();

    return (
        <div>
            <EditContainer
                classes={classes}
                setAlertMsg={setAlertMsg}
                nearPlaceType={nearPlaceType}
                setNearPlaceType={setNearPlaceType}
                init={init}
            />
        </div>
    );
}

export default NearPlaceType

const EditContainer = ({ classes, setAlertMsg, nearPlaceType, setNearPlaceType, init }) => {
    const [localFields, setLocalFields] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {

        setLocalFields({
            [newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC]: {
                value: '',
                is_require: true,
                error: false,
                min_length: 2,
                max_length: null,
                type: 'text',
                err_msg: '',
            },
            [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE]: {
                value: '',
                is_require: false,
                error: false,
                type: 'dropdown',
                err_msg: '',
            },
        });

    }, []);
    const stateUpdater = (e) => {
        let localFields_ = _.cloneDeep(localFields);
        if (e.target.value.length == 0) {
            localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
            localFields_[e.target.name].value = e.target.value;
        } else {
            localFields_[e.target.name].value = e.target.value;
            localFields_[e.target.name].error = false;
        }
        setLocalFields(localFields_);
    };
    const save = async () => {
        let localFields_validation = _.cloneDeep(localFields);
        localFields_validation = validator(localFields_validation);
        if (localFields_validation.err) {
            setLocalFields(localFields_validation.values);
        }
        if (!localFields_validation.err) {
            setLoader(true);
            let res = await httpPostRequest(createNearPlaceType(localFields));
            if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
                setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
                setLoader(false);
                init()
                setNearPlaceType(false)
            } else {
                setLoader(false);
                setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
            }

        } else {
            setAlertMsg({ type: 'error', msg: 'Please fill all the required fields' });
        }
    };
    return (
        <div>
            {localFields.hasOwnProperty(newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC) ? (
                <Row padding={[10]}>
                    <Column>
                        <Row>
                            <Column md={3} padding={[10, 5]}>
                                <TextField
                                    label="description"
                                    name={newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC}
                                    value={localFields[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC].value}
                                    onChange={stateUpdater}
                                    error={
                                        localFields[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC].error
                                    }
                                    helperText={
                                        localFields[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC].err_msg
                                    }
                                    required={localFields[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC].is_require}
                                />
                            </Column>
                            <Column md={3} padding={[10, 5]}>
                                <Glyphi
                                    size="small"
                                    labelId="near-place-type-icon-label-id"
                                    id="near-place-type-icon-id"
                                    name={newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE}
                                    value={localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].value}
                                    error={
                                        localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].error &&
                                        localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].is_require
                                    }
                                    onChange={stateUpdater}
                                    helperText={
                                        localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].error &&
                                            localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].is_require
                                            ? localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].err_msg
                                            : ''
                                    }
                                    label="Icon"
                                />
                            </Column>
                            {/* {editData ? (
                <Column center md={3} padding={[10, 5]}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields[newConstants.IS_ACTIVE].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            [newConstants.IS_ACTIVE]: {
                              ...localFields[newConstants.IS_ACTIVE],
                              value: !localFields[newConstants.IS_ACTIVE].value,
                            },
                          })
                        }
                        name={newConstants.IS_ACTIVE}
                      />
                    }
                    label="Is Active"
                  />
                </Column>
              ) : (
                ''
              )} */}

                            <Column right>
                                <Row>
                                    <Column md={8}></Column>

                                    <Column right md={4}>
                                        <Row bottom>
                                            <Button
                                                className={classes.saveButton}
                                                variant="contained"
                                                color="primary"
                                                onClick={loader ? console.log('') : save}>
                                                <Row>
                                                    {loader ? (
                                                        <Column md={1} xs={1} sm={1} center middle>
                                                            <Loader size={14} color={'white'} />
                                                        </Column>
                                                    ) : null}
                                                    <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} center middle sm={loader ? 11 : 12}>
                                                        {'save'}
                                                    </Column>
                                                </Row>
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setNearPlaceType(false)
                                                    // setEditData(null);
                                                }}
                                                className={classes.closeButton}
                                                variant="contained">
                                                Cancel
                                            </Button>
                                        </Row>
                                    </Column>
                                </Row>
                            </Column>
                        </Row>
                    </Column>
                </Row>
            ) : (
                ''
            )}
        </div>
    );
};
