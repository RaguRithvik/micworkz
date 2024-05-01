import React, { useState, useEffect } from 'react';
import { TextField, Card, Row, Column, Loader, CustomAlert, Glyphi } from '../../../core';
import { Fade, Button, FormControlLabel, Checkbox, } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useStore } from '../../../helper/Store';
import { validator, httpPostRequest } from '../../../helper/JsHelper';
import { createHotelImageType } from '../../../helper/RequestPayLoad';
import { constants, newConstants } from '../../../helper/constants';

import GeneralLanguageContainer from "../../GeneralLanguageContainer"
import LanguageConfig from "../../../helper/LanguageConfig";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    minWidth: 100,
    height: 40,
    margin: 5,
    backgroundColor: "rgb(26, 43, 71)",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    },
  },
  addButton: {
    margin: 5
  },
  closeButton: {
    margin: 5,
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
    borderBottom: '1.2px solid #003399',
  },
  tableHeadTuple: {
    color: theme.palette.grey.light,
    fontSize: '15px',
    fontWeight: '1000',
    padding: 15,
    width: 'clamp(150px,10vw,300px)',
    minWidth: 150,
    // width: 'clamp(150px,10vw,300px)',
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
    alignContent: "flex-end",
    [theme.breakpoints.down('xs')]: {
      alignContent: "end",
      padding: 6
    },
  },
  Bold: {
    fontWeight: "bold"
  },
  endPadd: {
    placeContent: "flex-end",
    padding: 8
  },
  add: {
    backgroundColor: "rgb(26, 43, 71)",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    },
  },
}));

export default function Setup({ imageData, setImageData, setImageflag, loadData }) {
  const classes = useStyles();
  const { languages, setAlertMsg, formname } = useStore();

  return (
    <div>
      <Fade>
        <EditContainer
          classes={classes}
          loadData={loadData}
          languages={languages}
          setAlertMsg={setAlertMsg}
          setImageflag={setImageflag}
        /></Fade>
    </div>
  );
}
const EditContainer = ({ classes, loadData, setAlertMsg, setImageflag }) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const { languages } = useStore();

  useEffect(() => {
    setLocalFields({
      [newConstants.HOTEL_IMAGE_TYPE_DESC]: {
        value: '',
        is_require: true,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON]: {
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
      [newConstants.HOTEL_IMAGE_TYPE_DESC]: {
        value: '',
        is_require: false,
        error: false,
        min_length: 2,
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
    let multi_lang_ = multi_language.filter(f => f[newConstants.HOTEL_IMAGE_TYPE_DESC].value != "")
    if (!localFields_validation.err) {
      setLoader(true);
      let res = await httpPostRequest(createHotelImageType(localFields, multi_lang_));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
        setLoader(false);
        setImageflag(false)
        loadData();
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
      {localFields.hasOwnProperty(newConstants.HOTEL_IMAGE_TYPE_DESC) ? (
        <Row padding={[10]}>
          <Column>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  error={false}
                  id="outlined-error-helper-text"
                  label={<LanguageConfig id="general.description" />}
                  name={newConstants.HOTEL_IMAGE_TYPE_DESC}
                  value={localFields[newConstants.HOTEL_IMAGE_TYPE_DESC].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.HOTEL_IMAGE_TYPE_DESC].error &&
                    localFields[newConstants.HOTEL_IMAGE_TYPE_DESC].is_require
                  }
                  helperText={
                    localFields[newConstants.HOTEL_IMAGE_TYPE_DESC].error &&
                      localFields[newConstants.HOTEL_IMAGE_TYPE_DESC].is_require
                      ? localFields[newConstants.HOTEL_IMAGE_TYPE_DESC].err_msg
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
                <Column md={3} padding={[10, 5]}>
                <Glyphi
                  size="small"
                  labelId="hotel-image-type-glyph-icon-label-id"
                  id="hotel-image-type-glyph-icon-id"
                  name={newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON}
                  value={localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON].value}
                  error={
                    localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON].error && localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON].is_require
                  }
                  onChange={stateUpdater}
                  helperText={
                    localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON].error && localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON].is_require
                      ? 'Incorrect entry.'
                      : ''
                  }
                  label={<LanguageConfig id="hotelimagetype.icon" />}
                />
              </Column>
              <Row>
                <Column md={6} padding={[7]}>
                  <GeneralLanguageContainer
                    multi_language={multi_language}
                    multiStateUpdater={multiStateUpdater}
                    constant={newConstants.HOTEL_IMAGE_TYPE_DESC}
                    fieldLabel='general.description'
                  />
                </Column>
              </Row>
              <Column right>
                <Row>
                  <Column md={9}></Column>

                  <Column right md={3}>
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
                        onClick={() => {setImageflag(false)}}
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
  )
}