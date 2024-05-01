import React, { useState, useEffect } from 'react';
import { TextField, Card, Row, Column, Loader } from '../../../core';
import { Fade, Button } from '@material-ui/core';
import { useStore } from '../../../helper/Store';
import { validator, httpPostRequest } from '../../../helper/JsHelper';
import { createHotelCategory } from '../../../helper/RequestPayLoad';
import { constants, newConstants } from '../../../helper/constants';
import GeneralLanguageContainer from '../../GeneralLanguageContainer';
import LanguageConfig from "../../../helper/LanguageConfig";



const CategoryContainer = ({ classes, setAlertMsg ,setCategoryTag,loadTicketCategory}) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const { languages } = useStore();
  useEffect(() => {
      setLocalFields({
        [newConstants.TICKET_CATEGORY_NAME]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
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
        [newConstants.TICKET_CATEGORY_NAME]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      setMultiLanguage(Tab_multi)
    
  }, [languages]);

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

  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    let multi_lang_ = multi_language.filter(f => f[newConstants.TICKET_CATEGORY_NAME].value != "")
    if (!localFields_validation.err) {
      setLoader(true);
        let res = await httpPostRequest(createEventTicketCategory(localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setLoader(false);
          setCategoryTag(false)
          loadTicketCategory()
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }     
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.fillrequired" /> });
    }
  };

  return (
    <div>
      {localFields.hasOwnProperty(newConstants.TICKET_CATEGORY_NAME) ? (
        <Row padding={[10]}>
          <Column>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id={"event.categoryname"} />}
                  name={newConstants.TICKET_CATEGORY_NAME}
                  value={localFields[newConstants.TICKET_CATEGORY_NAME].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_CATEGORY_NAME].error}
                  helperText={localFields[newConstants.TICKET_CATEGORY_NAME].err_msg}
                  required={localFields[newConstants.TICKET_CATEGORY_NAME].is_require}
                />
              </Column>

              {/* {editData &&
                localFields[newConstants.IS_ACTIVE] &&
                localFields[newConstants.IS_ACTIVE].hasOwnProperty('value') && (
                  <Column md={3} padding={[10, 20]} center>
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
                      label={<LanguageConfig id={"general.isactive"} />}
                    />
                  </Column>
                )} */}
              <Row>
                <Column md={6} padding={[7]}>
                  <GeneralLanguageContainer
                    multi_language={multi_language}
                    multiStateUpdater={multiStateUpdater}
                    constant={newConstants.TICKET_CATEGORY_NAME}
                    fieldLabel='event.categoryname'
                  />
                </Column>
              </Row>
              <Column right>
                <Row>
                  <Column md={8}></Column>

                  <Column right md={4}>
                    <Row style={{ placeContent: 'flex-end' }}>
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
                        //   setAddEdit(false);
                        //   setEditData(null);
                        setCategoryTag(false)
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
      ) : null}
    </div>
  );
};

export default CategoryContainer
