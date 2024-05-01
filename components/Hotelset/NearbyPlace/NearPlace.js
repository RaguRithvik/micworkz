import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Text,
  TextField,
  Card,
  Row,
  Column,
  Glyphi,
  Loader,
  CustomAlert,
  MapSelect,
  SingelSelectOnDemand,
  DemandDropDown
} from '../../../core';
import {
  Fade,
  FormControlLabel,
  Checkbox,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Add, Remove } from '@material-ui/icons';
import {
  getAllNearPlaceTypeY,
  getAllNearPlace,
  getNearPlaceByKey,
  deleteNearPlace,
  updateNearPlace,
  createNearPlace,
  getNearPlaceTypeByKey,
} from '../../../helper/RequestPayLoad';
import { httpPostRequest, validator } from '../../../helper/JsHelper';
import { constants, newConstants } from '../../../helper/constants';
import { useStore } from '../../../helper/Store';
import LanguageConfig from "../../../helper/LanguageConfig";
var FA = require('react-fontawesome');



const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    width: '30%',
    margin: 5,
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
    // padding:0,
    [theme.breakpoints.down('xs')]: {
      alignContent: 'end',
      padding: '6px 0px',
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

const NearPlace = ({ setNearplace, nearPlace, init, nearkey }) => {
  const classes = useStyles();
  const { languages, setAlertMsg } = useStore();


  return (
    <div>
      {/* <Card margin={[0,0,10,0]}> */}
      <EditContainer
        languages={languages}
        setAlertMsg={setAlertMsg}
        classes={classes}
        setNearplace={setNearplace}
        nearPlace={nearPlace}
        init={init}
        nearkey={nearkey}
      />
      {/* </Card> */}
    </div>
  );
}


export default NearPlace

const EditContainer = ({ classes, setAlertMsg, setNearplace, nearPlace, init, nearkey }) => {
  const [localFields, setLocalFields] = useState([]);
  const [loader, setLoader] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [latLong, setLatLong] = useState(null);
  const { Country, City, Province } = DemandDropDown;

  useEffect(() => {
    setLocalFields({
      [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: {
        value: '',
        is_require: true,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.HOTEL_NEAR_PLACE_TYPE_KEY]: {
        value: nearkey && nearkey,
        is_require: true,
        error: false,
        type: 'dropdown',
        err_msg: '',
      },
      [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE]: {
        value: '',
        is_require: false,
        error: false,
        type: 'dropdown',
        err_msg: '',
      },
      [newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.PROVINCE_KEY]: {
        value: '',
        is_require: true,
        error: false,
        type: 'dropdown',
        err_msg: '',
      },
      [newConstants.CITY_KEY]: {
        value: '',
        is_require: true,
        error: false,
        type: 'dropdown',
        err_msg: '',
      },
      [newConstants.COUNTRY_KEY]: {
        value: '',
        is_require: true,
        error: false,
        type: 'dropdown',
        err_msg: '',
      },
    })
  }, [nearkey]);

  useMemo(() => {
    // console.log(latLong);
    if (latLong != null) {
      setLocalFields({
        ...localFields,
        [newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE]: {
          value: latLong.latitude.toString(),
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE]: {
          value: latLong.longitude.toString(),
          is_require: true,
          error: false,
        },
      });
    } else {
      setLocalFields({
        ...localFields,
        [newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE]: {
          value: '',
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE]: {
          value: '',
          is_require: true,
          error: false,
        },
      });
    }
  }, [latLong]);

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
      let res = await httpPostRequest(createNearPlace(localFields, []));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
        setLoader(false);
        init()
        setNearplace(false)
      } else {
        setLoader(false);
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    } else {
      setAlertMsg({ type: 'error', msg: 'Please fill all the require fileds.' });
    }
  };

  return localFields.hasOwnProperty(newConstants.HOTEL_NEAR_BY_PLACE_DESC) ? (
    <Row padding={[10]}>
      <Column padding={[10]}>
        <Row>
          <Column md={3} padding={[10, 5]}>
            <TextField
              label="Near Place Desc"

              name={newConstants.HOTEL_NEAR_BY_PLACE_DESC}
              value={localFields[newConstants.HOTEL_NEAR_BY_PLACE_DESC].value}
              onChange={stateUpdater}
              error={
                localFields[newConstants.HOTEL_NEAR_BY_PLACE_DESC].error
              }
              helperText={
                localFields[newConstants.HOTEL_NEAR_BY_PLACE_DESC].err_msg
              }
              required={localFields[newConstants.HOTEL_NEAR_BY_PLACE_DESC].is_require}
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <NearPlaceType
              name={newConstants.HOTEL_NEAR_PLACE_TYPE_KEY}
              value={localFields[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY].value}
              onChange={stateUpdater}
              error={
                localFields[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY].error &&
                localFields[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY].is_require
              }
              helperText={
                localFields[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY].error &&
                  localFields[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY].is_require
                  ? localFields[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY].err_msg
                  : ''
              }
              label="Near Place Type"
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <Glyphi
              size="small"
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              name={newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE}
              value={localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE].value}
              error={
                localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE].error &&
                localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE].is_require
              }
              onChange={stateUpdater}
              helperText={
                localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE].error &&
                  localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE].is_require
                  ? localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE].err_msg
                  : ''
              }
              label="Icon"
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <Country
              name={newConstants.COUNTRY_KEY}
              error={localFields[newConstants.COUNTRY_KEY].error}
              value={localFields[newConstants.COUNTRY_KEY].value}
              onChange={stateUpdater}
              helperText={localFields[newConstants.COUNTRY_KEY].error ? 'Incorrect entry.' : ''}
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <Province
              name={newConstants.PROVINCE_KEY}
              value={localFields[newConstants.PROVINCE_KEY].value}
              country_key={localFields[newConstants.COUNTRY_KEY].value}
              error={localFields[newConstants.PROVINCE_KEY].error}
              onChange={stateUpdater}
              helperText={localFields[newConstants.PROVINCE_KEY].error ? 'Incorrect entry.' : ''}
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <City
              name={newConstants.CITY_KEY}
              value={localFields[newConstants.CITY_KEY].value}
              country_key={localFields[newConstants.COUNTRY_KEY].value}
              error={localFields[newConstants.CITY_KEY].error}
              onChange={stateUpdater}
              helperText={localFields[newConstants.CITY_KEY].error ? 'Incorrect entry.' : ''}
            />
          </Column>
          {/* <Column> */}
          <Column md={3} padding={[10, 5]}>
            <TextField
              label="Near Place Latitude"
              name={newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE}
              value={localFields[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE].value}
              onChange={stateUpdater}
              onClick={() => setOpenMap(true)}
              error={
                localFields[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE].error
              }
              helperText={
                localFields[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE].err_msg
              }
              required={localFields[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE].is_require}
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <TextField
              label="Near Place Longitude"
              name={newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE}
              value={localFields[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE].value}
              onChange={stateUpdater}
              onClick={() => setOpenMap(true)}
              error={
                localFields[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE].error
              }
              helperText={
                localFields[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE].err_msg
              }
              required={localFields[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE].is_require}
            />
          </Column>

          <MapSelect
            openMap={openMap} setOpenMap={setOpenMap} latLong={latLong} setLatLong={setLatLong}
          />
          {/* </Row> */}
          {/* </Column> */}
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
                      setNearplace(false)
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
  ) : null
};

const NearPlaceType = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);

  useEffect(() => {
    nearPlaceTypeByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadeNearPlaceType();
  }, []);

  const nearPlaceTypeByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getNearPlaceTypeByKey(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.TICKET_AMENITY_TYPE_DESC],
          value: res[newConstants.DATA][newConstants.TICKET_AMENITY_TYPE_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadeNearPlaceType = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllNearPlaceTypeY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][["hotel-near-place-types"]].map((v) => ({
            value: v[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY],
            label: v[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][["hotel-near-place-types"]].map((v) => ({
            value: v[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY],
            label: v[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC],
          })),
        );
      }
    }
  };
  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions.concat(selectValue ? [selectValue] : [])}
      value={selectValue}
      name={name}
      loadOptions={loadeNearPlaceType}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};