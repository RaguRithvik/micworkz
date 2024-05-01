import React, { useState, useEffect } from 'react';
import { Container, Box, Checkbox, Button, FormControlLabel } from "@material-ui/core";
import { Row, Column, Text, ModalComponent, Glyphi, Loader, TextField, SingelSelectOnDemand } from "../../../../Core";
import { makeStyles } from "@material-ui/core/styles";
import { useStore } from '../../../../helper/Store';
import { getDateYYYYMMDD, validator, httpPostRequest, httpPostRequestWithForm } from '../../../../helper/JsHelper';
import {
  createAmmunityType,
  createAmunity,
  getAmmunityTypeById,
  getAmmunityType,
  getAllAmmunity
} from '../../../../helper/RequestPayLoad';
import AmenityType from "./AmenityTpe"
import { newConstants, constants } from '../../../../helper/constants';
import PropTypes from 'prop-types';
import LanguageConfig from "../../../../helper/LanguageConfig";

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



const Amenity = ({ amenity, setAmenity ,init,setAlertMsg,amenityKey}) => {
  const classes = useStyles()
  const [loader, setLoader] = useState(false);
  const [amenityField, setAmenityField] = useState([]);
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
    let flag = !amenityField_validation.err;
    if (flag) {
      setLoader(true);
      let res = await httpPostRequest(createAmunity(amenityField, []));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setLoader(false);
        setAmenity(false);
        // loadCateory()
        init()
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
      }
    });
  }, [amenityKey])
  return (
    <div>
      <Row padding={[10]}>
        <Column md={3} padding={[10, 5]}>
          <TextField
            label={<LanguageConfig id="amenity.amenityname" />}
            name={newConstants.HOTEL_AMENITY_NAME}
            value={amenityField[newConstants.HOTEL_AMENITY_NAME] && amenityField[newConstants.HOTEL_AMENITY_NAME].value}
            onChange={stateUpdater}
            error={
              amenityField[newConstants.HOTEL_AMENITY_NAME] && amenityField[newConstants.HOTEL_AMENITY_NAME].error
            }
            helperText={
              amenityField[newConstants.HOTEL_AMENITY_NAME] && amenityField[newConstants.HOTEL_AMENITY_NAME].err_msg
            }
            required={amenityField[newConstants.HOTEL_AMENITY_NAME] && amenityField[newConstants.HOTEL_AMENITY_NAME].is_require}
          />
        </Column>

        <Column md={3} padding={[10, 5]}>
          <TextField
            type="number"
            label={<LanguageConfig id="amenity.amenitydefaultprice" />}
            inputProps={{ min: 1 }}
            name={newConstants.HOTEL_AMENITY_DEFAULT_PRICE}
            value={amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE] && amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].value}
            onChange={stateUpdater}
            error={
              amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE] && amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].error
            }
            helperText={amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE] && amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].err_msg}
            required={amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE] && amenityField[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].is_require}
          />
        </Column>
        <Column md={3} padding={[10, 5]}>
          <AmenityName
            name={newConstants.HOTEL_AMENITY_TYPE_KEY}
            value={amenityField[newConstants.HOTEL_AMENITY_TYPE_KEY] && amenityField[newConstants.HOTEL_AMENITY_TYPE_KEY].value}
            onChange={stateUpdater}
            error={
              amenityField[newConstants.HOTEL_AMENITY_TYPE_KEY] && amenityField[newConstants.HOTEL_AMENITY_TYPE_KEY].error
            }
            helperText={amenityField[newConstants.HOTEL_AMENITY_TYPE_KEY] && amenityField[newConstants.HOTEL_AMENITY_TYPE_KEY].err_msg}
            label={<LanguageConfig id="amenity.amenitytype" />}
          />
        </Column>

        <Column md={3} padding={[10, 5]}>
          <Glyphi
            name={newConstants.HOTEL_AMENITY_GLYPH_ICON}
            value={amenityField[newConstants.HOTEL_AMENITY_GLYPH_ICON] && amenityField[newConstants.HOTEL_AMENITY_GLYPH_ICON].value}
            error={amenityField[newConstants.HOTEL_AMENITY_GLYPH_ICON] && amenityField[newConstants.HOTEL_AMENITY_GLYPH_ICON].error}
            onChange={stateUpdater}
            helperText={amenityField[newConstants.HOTEL_AMENITY_GLYPH_ICON] && amenityField[newConstants.HOTEL_AMENITY_GLYPH_ICON].err_msg}
            label={<LanguageConfig id="amenity.icon" />}
          />
        </Column>
        <Column md={3} padding={[10, 5]} center>
          <FormControlLabel
            control={
              <Checkbox
                checked={amenityField[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE] && amenityField[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE].value}
                color="primary"
                onChange={() =>
                  setAmenityField({
                    ...amenityField,
                    [newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE]: {
                      ...amenityField[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE],
                      value: !amenityField[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE].value,
                    },
                  })
                }
                name={newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE}
              />
            }
            label={<LanguageConfig id="amenity.istaxavailable" />}
          />
        </Column>
        <Row>
          <Column md={10}>
            {/* <Button>Save</Button> */}
          </Column>
          <Column md={2} right>
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
                  <LanguageConfig id={"save"} />
                </Column>
              </Row>
            </Button>
          </Column>
        </Row>
      </Row>
    </div>
  )
}



const AmenityName = ({ name, value, onChange, error, helperText, label }) => {
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
    const res = await httpPostRequest(getAmmunityType(inputValue));
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
      defaultOptions={defaultOptions.concat(selectValue ? [selectValue] : [])}
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