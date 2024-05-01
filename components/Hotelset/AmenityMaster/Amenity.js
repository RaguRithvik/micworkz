import React, { useState, useEffect } from 'react';
import { Container, Box, Checkbox, Button, FormControlLabel } from "@material-ui/core";
import { Row, Column, Text, ModalComponent, Glyphi, Loader, TextField, SingelSelectOnDemand } from "../../../Core";
import { makeStyles } from "@material-ui/core/styles";
import { useStore } from '../../../helper/Store';
import { getDateYYYYMMDD, validator, httpPostRequest, httpPostRequestWithForm } from '../../../helper/JsHelper';
import {
  createAmmunityType,
  createAmunity,
  getAmmunityTypeById,
  getAmmunityType,
  getAllAmmunity,
  getAmmunityTypeY
} from '../../../helper/RequestPayLoad';
import GeneralLanguageContainer from "../../GeneralLanguageContainer"
import { newConstants, constants } from '../../../helper/constants';
import PropTypes from 'prop-types';
import LanguageConfig from "../../../helper/LanguageConfig";

const useStyles = makeStyles((theme) => ({
  RoomAmenitiesSection: { width: '100%', float: 'left', },
  Roomcommonheader: { fontSize: '30px', marginBottom: '11px', },
  RoomCategoryre: { width: '100%', position: 'relative', },
  RoomCategoryservices: { position: 'absolute', right: '10px', top: '10px', },
  RoomAmenityAdded: { fontWeight: '700', width: "70%" },
  RoomAmenitiesInformation: { listStyleType: 'none', fontSize: '14px', position: 'relative', marginTop: '10px', },
  HotelCheckernow: { position: 'absolute', left: '0px', top: '10px', padding: '0px 0px 0px 40px', },
  saveButton: {
    width: '30%',
    margin: 5,
    color: "white",
    backgroundColor: "rgb(26, 43, 71)",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    }
  },
}));

const Amenity = ({ amenity, setAmenity, init, setAlertMsg, amenityKey }) => {
  const classes = useStyles()
  const [loader, setLoader] = useState(false);
  const [amenityField, setAmenityField] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const { languages } = useStore();


  function multiStateUpdater(e, index) {
    let multi_language_ = _.cloneDeep(multi_language);
    if (e.target.value.length == 0) {
      multi_language_[index][e.target.name].error = multi_language_[index][e.target.name].is_require ? true : false;
      multi_language_[index][e.target.name].value = e.target.value;
    } else {
      multi_language_[index][e.target.name].value = e.target.value;
      multi_language_[index][e.target.name].error = false;
    }
    setMultiLanguage(multi_language_);
  }

  const stateUpdater = (e) => {
    let amenityField_ = _.cloneDeep(amenityField);
    if (e.target.value.length == 0) {
      amenityField_[e.target.name].error = amenityField_[e.target.name].is_require ? true : false;
      amenityField_[e.target.name].value = e.target.value;
    } else {
      amenityField_[e.target.name].value = e.target.value;
      amenityField_[e.target.name].error = false;
    }
    setAmenityField(amenityField_);
  };


  const save = async () => {
    let amenityField_validation = _.cloneDeep(amenityField);
    amenityField_validation = validator(amenityField_validation);
    if (amenityField_validation.err) {
      setAmenityField(amenityField_validation.values);
    }
    let multi_lang_ = multi_language.filter(f => f[newConstants.HOTEL_AMENITY_NAME].value != "")
    let flag = !amenityField_validation.err;
    if (flag) {
      setLoader(true);
      let res = await httpPostRequest(createAmunity(amenityField, multi_lang_));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setLoader(false);
        setAmenity(false);
        init()
        // loadCateory()
        setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
      } else {
        setLoader(false);
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="managehotel.fillrequired" /> });
    }
  };


  useEffect(() => {
    setAmenityField({
      [newConstants.HOTEL_AMENITY_NAME]: {
        value: '',
        is_require: true,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE]: {
        value: false,
        is_require: true,
        error: false,
        type: 'boolean',
        err_msg: '',
      },
      [newConstants.HOTEL_AMENITY_TYPE_KEY]: {
        value: amenityKey,
        is_require: true,
        error: false,
        type: 'dropdown',
        err_msg: '',
      },
      [newConstants.HOTEL_AMENITY_DEFAULT_PRICE]: {
        value: '',
        is_require: true,
        error: false,
        type: 'price',
        err_msg: '',
      },
      [newConstants.HOTEL_AMENITY_GLYPH_ICON]: {
        value: '',
        is_require: false,
        error: false,
        type: 'dropdown',
        err_msg: '',
      },
    });
    var Tab_multi = languages.map(val => ({
      [newConstants.LANG_CODE]:
      {
        value: val.value,
        is_require: false,
        error: false,
        type: 'text',
        err_msg: '',
      },
      [newConstants.HOTEL_AMENITY_NAME]: {
        value: '',
        is_require: true,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
    }))
    setMultiLanguage(Tab_multi)

  }, [languages, amenityKey]);

  return amenityField.hasOwnProperty(newConstants.HOTEL_AMENITY_NAME) ? (
    <Row padding={[10]}>
      <Column padding={[10, 5]}>
        <Row>
          <Column md={3} padding={[10, 5]}>
            <TextField
              label={<LanguageConfig id="amenity.amenityname" />}
              name={newConstants.HOTEL_AMENITY_NAME}
              value={amenityField[newConstants.HOTEL_AMENITY_NAME].value}
              onChange={stateUpdater}
              error={
                amenityField[newConstants.HOTEL_AMENITY_NAME].error
              }
              helperText={
                amenityField[newConstants.HOTEL_AMENITY_NAME].err_msg
              }
              required={amenityField[newConstants.HOTEL_AMENITY_NAME].is_require}
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <TextField
              type="number"
              label={<LanguageConfig id="amenity.amenitydefaultprice" />}
              inputProps={{ min: 1 }}
              name={newConstants.HOTEL_AMENITY_DEFAULT_PRICE}
              value={amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].value}
              onChange={stateUpdater}
              error={
                amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].error
              }
              helperText={amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].err_msg}
              required={amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].is_require}
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <AmenityName
              name={newConstants.HOTEL_AMENITY_TYPE_KEY}
              value={amenityField[newConstants.HOTEL_AMENITY_TYPE_KEY].value}
              onChange={stateUpdater}
              error={
                amenityField[newConstants.HOTEL_AMENITY_TYPE_KEY].error &&
                amenityField[newConstants.HOTEL_AMENITY_TYPE_KEY].is_require
              }
              helperText={amenityField[newConstants.HOTEL_AMENITY_TYPE_KEY].err_msg}
              label={<LanguageConfig id="amenity.amenitytype" />}
            />
          </Column>

          <Column md={3} padding={[10, 5]}>
            <Glyphi
              name={newConstants.HOTEL_AMENITY_GLYPH_ICON}
              value={amenityField[newConstants.HOTEL_AMENITY_GLYPH_ICON].value}
              error={amenityField[newConstants.HOTEL_AMENITY_GLYPH_ICON].error}
              onChange={stateUpdater}
              helperText={amenityField[newConstants.HOTEL_AMENITY_GLYPH_ICON].err_msg}
              label={<LanguageConfig id="amenity.icon" />}
            />
          </Column>

          <Row>
            <Column md={6} padding={[7]}>
              <GeneralLanguageContainer
                multi_language={multi_language}
                multiStateUpdater={multiStateUpdater}
                constant={newConstants.HOTEL_AMENITY_NAME}
                fieldLabel='hotel.amenityname'
              />
            </Column>
          </Row>
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
                        <LanguageConfig id={"general.save"} />
                      </Column>
                    </Row>
                  </Button>
                  <Button
                    onClick={() => {
                      setAmenity(false)
                    }}
                    className={classes.closeButton}
                    variant="contained">
                    <LanguageConfig id={"general.cancel"} />
                  </Button>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      </Column>
    </Row>
  ) : (
    <p>A</p>
  );
};



const AmenityName = ({ name, value, onChange, error, helperText, label, myref }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);
  useEffect(() => {
    amenityByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadAmenity();
  }, []);

  const amenityByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getAmmunityTypeById(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.HOTEL_AMENITY_TYPE_DESC],
          value: res[newConstants.DATA][newConstants.HOTEL_AMENITY_TYPE_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadAmenity = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAmmunityTypeY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.HOTEL_AMENITY_TYPES].map((v) => ({
            value: v[newConstants.HOTEL_AMENITY_TYPE_KEY],
            label: v[newConstants.HOTEL_AMENITY_TYPE_DESC],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.HOTEL_AMENITY_TYPES].map((v) => ({
            value: v[newConstants.HOTEL_AMENITY_TYPE_KEY],
            label: v[newConstants.HOTEL_AMENITY_TYPE_DESC],
          })),
        );
      }
    }
  };
  return (
    <SingelSelectOnDemand
      defaultOptions={selectValue ? [selectValue].concat(defaultOptions.filter(f => f.value != selectValue.value)) : defaultOptions}
      value={selectValue}
      name={name}
      loadOptions={loadAmenity}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

export default Amenity;