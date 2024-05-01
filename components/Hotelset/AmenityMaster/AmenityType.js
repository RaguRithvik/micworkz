import React, { useState, useEffect } from 'react';
import { Container, Box, Checkbox, Button, FormControlLabel } from "@material-ui/core";
import { Row, Column, Text, ModalComponent, Glyphi, Loader, TextField, SingelSelectOnDemand } from "../../../Core";
import { makeStyles } from "@material-ui/core/styles";
import { useStore } from '../../../helper/Store';
import { getDateYYYYMMDD, validator, httpPostRequest, httpPostRequestWithForm } from '../../../helper/JsHelper';
import {
  createAmmunityType,
} from '../../../helper/RequestPayLoad';
import { newConstants, constants } from '../../../helper/constants';
import PropTypes from 'prop-types';
import LanguageConfig from "../../../helper/LanguageConfig";
import GeneralLanguageContainer from "../../GeneralLanguageContainer"

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


const AmenityType = ({ amenityType, setAmenityType ,init,setAlertMsg}) => {
  const classes = useStyles()
  const [loader, setLoader] = useState(false);
  const [amenityTypeField, setAmenityTypeField] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const {languages}=useStore()

  const stateUpdater = (e) => {
    let amenityTypeField_ = _.cloneDeep(amenityTypeField);
    if (e.target.value.length == 0) {
      amenityTypeField_[e.target.name].error = amenityTypeField_[e.target.name].is_require ? true : false;
      amenityTypeField_[e.target.name].value = e.target.value;
    } else {
      amenityTypeField_[e.target.name].value = e.target.value;
      amenityTypeField_[e.target.name].error = false;
    }
    setAmenityTypeField(amenityTypeField_);
  };


  const save = async () => {
    let amenityTypeField_validation = _.cloneDeep(amenityTypeField);
    amenityTypeField_validation = validator(amenityTypeField_validation);
    if (amenityTypeField_validation.err) {
      setAmenityTypeField(amenityTypeField_validation.values);
    }
    let flag = !amenityTypeField_validation.err;
    let multi_lang_ = multi_language.filter(f => f[newConstants.HOTEL_AMENITY_TYPE_DESC].value != "")
    if (flag) {
      setLoader(true);
      let res = await httpPostRequest(createAmmunityType(amenityTypeField, multi_lang_));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setLoader(false);
        setAmenityType(false);
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

  useEffect(() => {
    setAmenityTypeField({
      [newConstants.HOTEL_AMENITY_TYPE_DESC]: {
        value: '',
        is_require: true,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON]: {
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
        [newConstants.HOTEL_AMENITY_TYPE_DESC]: {
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
  }, [])
  return (
    <div>
      {amenityTypeField.hasOwnProperty(newConstants.HOTEL_AMENITY_TYPE_DESC) ? (
        <Row padding={[10]}>
          <Column padding={[10]}>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id={"hotel.amenitytypedescription"} />}
                  name={newConstants.HOTEL_AMENITY_TYPE_DESC}
                  value={amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC].value}
                  onChange={stateUpdater}
                  error={
                    amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC].error
                  }
                  helperText={
                    amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC].err_msg
                  }
                  required={amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC].is_require}
                />
              </Column>

              <Column md={3} padding={[10, 5]}>
                <Glyphi
                  size="small"
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  name={newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON}
                  value={amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON].value}
                  error={
                    amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON].error &&
                    amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON].is_require
                  }
                  onChange={stateUpdater}
                  helperText={amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON].err_msg}
                  label={<LanguageConfig id="amenitytype.icon" />}
                />
              </Column>
              <Row>
                <Column md={6} padding={[7]}>
                  <GeneralLanguageContainer
                    multi_language={multi_language}
                    multiStateUpdater={multiStateUpdater}
                    constant={newConstants.HOTEL_AMENITY_TYPE_DESC}
                    fieldLabel='hotel.amenitytypedescription'
                  />
                </Column>
              </Row>
              <Column right>
                <Row>
                  <Column md={9}></Column>
                  <Column right md={3}>
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
                            <LanguageConfig id={ "general.save"} />
                          </Column>
                        </Row>
                      </Button>
                      <Button
                        onClick={() => {
                        setAmenityType(false)
                        }} className={classes.closeButton} variant="contained"
                      >
                        <LanguageConfig id={"general.cancel"} />
                      </Button>
                    </Row>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      ) : null}
    </div>
  );
};

export default AmenityType;