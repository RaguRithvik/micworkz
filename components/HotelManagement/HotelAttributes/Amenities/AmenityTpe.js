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


const AmenityType = ({ amenityType, setAmenityType ,init,setAlertMsg}) => {
  const classes = useStyles()
  const [loader, setLoader] = useState(false);
  const [amenityTypeField, setAmenityTypeField] = useState([]);
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
    if (flag) {
      setLoader(true);
      let res = await httpPostRequest(createAmmunityType(amenityTypeField, []));
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
  }, [])
  return (
    <div>
      <Row padding={[10]}>
        <Column md={3} padding={[10, 5]}>
          <TextField
            label={<LanguageConfig id={"description"} />}
            name={newConstants.HOTEL_AMENITY_TYPE_DESC}
            value={amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC] && amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC].value}
            onChange={stateUpdater}
            error={amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC] && amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC].error}
            helperText={amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC] && amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC].err_msg}
            required={amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC] && amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_DESC].is_require}
          />
        </Column>
        <Column md={3} padding={[10, 5]}>
          <Glyphi
            size="small"
            labelId="category_icon"
            id="hotel-cat-icon"
            name={newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON}
            value={amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON] && amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON].value}
            error={
              amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON] &&
              amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON].error
            }
            onChange={stateUpdater}
            helperText={
              amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON] && amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON].err_msg

            }
            label={<LanguageConfig id={"hotelcategory.icon"} />}
            required={amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON] && amenityTypeField[newConstants.HOTEL_AMENITY_TYPE_GLYPH_ICON].is_require ? true : false}
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




export default AmenityType;