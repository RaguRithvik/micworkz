import React, { useState, useEffect, useRef ,useCallback, useMemo} from 'react';
import { TextField, Text, Card, Row, Column, Glyphi, Loader, CustomAlert, SingelSelectOnDemand, DemandDropDown } from '../../core';
import {
  Fade,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Create, Delete, Edit } from '@material-ui/icons';
import {
  getAmmunityTypeById,
  getAllAmmunity,
  getAmmunityType,
  createAmunity,
  getAmmunityInfoById,
  editAmunity,
  deleteAmmunity,
} from '../../helper/RequestPayLoad';
import { httpPostRequest, validator ,useFocusNext} from '../../helper/JsHelper';
import { constants, newConstants } from '../../helper/constants';
import { useStore } from '../../helper/Store';
var FA = require('react-fontawesome');
import PrimaryContainer from '../PrimaryContainer';
import LanguageConfig from "../../helper/LanguageConfig";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    minWidth: 140,
    height: 40,
    margin: 5,
    width: '30%',
    backgroundColor:"rgb(26, 43, 71);",
    color:"white",
    '&:hover': {
      backgroundColor:"rgb(26, 43, 71);",
    },
  },
  AddBtn: {
    padding: 10,
    backgroundColor:"rgb(26, 43, 71);",
    color:"white",
    '&:hover': {
      backgroundColor:"rgb(26, 43, 71);",
    },
  },
  addButton: {
    margin: 5,
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
  editContainer: {
    margin: '0 0 10px 0px',
  },
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [data, setData] = useState([]);
  const [ammunity, setAmmunity] = useState([]);
  const [loader, setLoader] = useState(false);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg, formname } = useStore();
  const [deleteLoader, setDeleteLoader] = useState('');
  const [deleteId, setDeleteId] = useState('');
  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: <LanguageConfig id="amenity.sno" /> },
    [newConstants.HOTEL_AMENITY_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="amenity.amenityname" /> },
    [newConstants.HOTEL_AMENITY_TYPE_DESC]: { is_hide: false, bool: true, label: <LanguageConfig id="amenity.amenitydescription" /> },
    [newConstants.HOTEL_AMENITY_DEFAULT_PRICE]: { is_hide: false, bool: true, label: <LanguageConfig id="amenity.amenitydefaultprice" /> },
    [newConstants.HOTEL_AMENITY_GLYPH_ICON]: { is_hide: false, bool: true, label: <LanguageConfig id="amenity.icon"  />},
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="amenity.status" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="amenity.lastupdatedby"  />},
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="amenity.lastupdatedon"  />},
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="amenity.action" /> }
  });

  const loadData = async () => {
    if(!addEdit){
    setLoader(true);
    let res = await httpPostRequest(getAllAmmunity(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.HOTEL_AMENITIES]);
      setLoader(false);
      setMaxPage(
        res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
          parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
          0
          ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
          : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
      );
    } else {
      setLoader(false);
      setCurrIndex(1);
      setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
    }
  }
};

  useEffect(() => {
    loadData();
    
  }, [addEdit, search_key, pageSize, currIndex]);


  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };
  const edit = async (id) => {
    setAddEdit(false);
    let res = await httpPostRequest( getAmmunityInfoById(id));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
   else{
    setAddEdit(false);
    setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
   }
  };

 const deleteAmmunityCall = async () => {
    if (deleteId != '') {
      const res = await httpPostRequest(deleteAmmunity(deleteId));
      setDeleteLoader(deleteId);
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setDeleteId('');
        setDeleteLoader('');
        loadData();
        setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
      } else {
        setDeleteId('');
        setDeleteLoader('');
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    } else {
      setDeleteId('');
    }
  };

  return (
    <div>
      <Card margin={[0,0,10,0]}>
        {addEdit &&
          <Fade in={addEdit}>
            <EditContainer
             loadData={loadData}
              ammunity={ammunity}
              setAlertMsg={setAlertMsg}
              editData={editData}
              setEditData={setEditData}
              setAddEdit={setAddEdit}
              addEdit={addEdit}
              classes={classes}
              languages={languages}
            />
          </Fade>
        }
        </Card>
      <PrimaryContainer
        formName={ editData!=null && addEdit==true ?formname +"-"+"(Update)":editData==null && addEdit==true?formname +"-"+"(Save)":formname}
        search_key={search_key}
        search={search}
        addEdit={addEdit}
        setAddEdit={setAddEdit}
        currIndex={currIndex}
        maxPage={maxPage}
        setCurrIndex={setCurrIndex}
        setPageSize={setPageSize}
        pageSize={pageSize}
        showCol={showCol}
        setShowCol={setShowCol}
        loadData={loadData}
        data={data}
        filter_object={newConstants.ROW_NUMBER}
        editRow={edit}
        deleteRow={setDeleteId}
        action_key={newConstants.HOTEL_AMENITY_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="amenity.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={deleteAmmunityCall}
        />
      
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, editData, setEditData, addEdit, setAddEdit, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const { languages,copylanguages } = useStore();
  const focusNextRef = useFocusNext();
  
  useEffect(() => {
    if (!editData) {
      setLocalFields({
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
          value: '',
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
          is_require: true,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: ''
        },
      });
      var Tab_multi = languages.map(val => ({
        [newConstants.LANG_CODE]:
        {
          value: val.value,
          is_require: true,
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
        [newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE]: {
          value: false,
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_AMENITY_TYPE_KEY]: {
          value: '',
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
          is_require: true,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: ''
        },    
      }))
      setMultiLanguage(Tab_multi)
    } else {
      setLocalFields({
        [newConstants.HOTEL_AMENITY_NAME]: {
          value: editData[newConstants.HOTEL_AMENITY_NAME],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE]: {
          value: editData[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_AMENITY_TYPE_KEY]: {
          value: editData[newConstants.HOTEL_AMENITY_TYPE_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.HOTEL_AMENITY_DEFAULT_PRICE]: {
          value: editData[newConstants.HOTEL_AMENITY_DEFAULT_PRICE],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.HOTEL_AMENITY_GLYPH_ICON]: {
          value: editData[newConstants.HOTEL_AMENITY_GLYPH_ICON],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.IS_ACTIVE]: {
          value: editData[newConstants.IS_ACTIVE],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },       
      });
      var Tab_multi = languages.map(val => ({
        [newConstants.LANG_CODE]:
        {
          value: val.value,
          is_require: true,
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
        [newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE]: {
          value: false,
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_AMENITY_TYPE_KEY]: {
          value: '',
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
          is_require: true,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: ''
        },    
      }))

      let multi_language_ = [];
      if (editData[newConstants.HOTEL_AMENITY_LANGUAGES] && editData[newConstants.HOTEL_AMENITY_LANGUAGES].length) {
        editData[newConstants.HOTEL_AMENITY_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.HOTEL_AMENITY_NAME]: {
              value: value[newConstants.HOTEL_AMENITY_NAME],
              is_require: true,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: true,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE]: {
              value: editData[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE],
              is_require: true,
              error: false,
            },
            [newConstants.HOTEL_AMENITY_TYPE_KEY]: {
              value: editData[newConstants.HOTEL_AMENITY_TYPE_KEY],
              is_require: true,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.HOTEL_AMENITY_DEFAULT_PRICE]: {
              value: editData[newConstants.HOTEL_AMENITY_DEFAULT_PRICE],
              is_require: true,
              error: false,
              type: 'price',
              err_msg: '',
            },
            [newConstants.HOTEL_AMENITY_GLYPH_ICON]: {
              value: editData[newConstants.HOTEL_AMENITY_GLYPH_ICON],
              is_require: true,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.IS_ACTIVE]: {
              value: editData[newConstants.IS_ACTIVE],
              is_require: false,
              error: false,
              type: 'boolean',
              err_msg: '',
            },
          });
        });
      } else {
        multi_language_.push(...Tab_multi);
      }
      setMultiLanguage(multi_language_.concat(Tab_multi.filter(f => !(multi_language_.map(v => v["lang-code"].value).includes(f["lang-code"].value)))))
    }
  }, [editData,languages]);

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
    let multi_lang_ = multi_language.filter(f => f[newConstants.HOTEL_AMENITY_NAME].value != "")
    if (!localFields_validation.err) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createAmunity(localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(editAmunity(editData[newConstants.HOTEL_AMENITY_KEY], localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    } else {
      setAlertMsg({ type: 'error',  msg: <LanguageConfig id="amenity.fillrequired" /> });
    }
  };

  

  return localFields.hasOwnProperty(newConstants.HOTEL_AMENITY_NAME) ? (
    <Row padding={[10]}>
      <Column >
        <Row>
          <Column md={3} padding={[10, 5]}>
            <TextField
              label={<LanguageConfig id="amenity.amenityname" />}
              name={newConstants.HOTEL_AMENITY_NAME}
              value={localFields[newConstants.HOTEL_AMENITY_NAME].value}
              onChange={stateUpdater}
              inputRef={focusNextRef}
              error={
                localFields[newConstants.HOTEL_AMENITY_NAME].error
              }
              helperText={
                localFields[newConstants.HOTEL_AMENITY_NAME].err_msg
              }
              required={localFields[newConstants.HOTEL_AMENITY_NAME].is_require}
            />
          </Column>

          <Column md={3} padding={[10, 5]}>
            <TextField
              type="number"
              label={<LanguageConfig id="amenity.amenitydefaultprice" />}
              inputProps={{ min: 1 }}
              name={newConstants.HOTEL_AMENITY_DEFAULT_PRICE}
              value={localFields[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].value}
              onChange={stateUpdater}
              inputRef={focusNextRef}
              error={
                localFields[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].error
              }
              helperText={localFields[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].err_msg }
              required={localFields[newConstants.HOTEL_AMENITY_DEFAULT_PRICE].is_require}
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <AmenityName
              name={newConstants.HOTEL_AMENITY_TYPE_KEY}
              value={localFields[newConstants.HOTEL_AMENITY_TYPE_KEY].value}
              onChange={stateUpdater}
              error={
                localFields[newConstants.HOTEL_AMENITY_TYPE_KEY].error &&
                localFields[newConstants.HOTEL_AMENITY_TYPE_KEY].is_require
              }
              helperText={localFields[newConstants.HOTEL_AMENITY_TYPE_KEY].err_msg}
              label={<LanguageConfig id="amenity.amenitytype" />}
            />
          </Column>

          <Column md={3} padding={[10, 5]}>
            <Glyphi
              name={newConstants.HOTEL_AMENITY_GLYPH_ICON}
              value={localFields[newConstants.HOTEL_AMENITY_GLYPH_ICON].value}
              error={localFields[newConstants.HOTEL_AMENITY_GLYPH_ICON].error }
              onChange={stateUpdater}
              helperText={localFields[newConstants.HOTEL_AMENITY_GLYPH_ICON].err_msg }
              label={<LanguageConfig id="amenity.icon" />}
            />
          </Column>
          {/* <Column md={3}padding={[10, 5]} center>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localFields[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE].value}
                  color="primary"
                  inputRef={focusNextRef}
                  onChange={() =>
                    setLocalFields({
                      ...localFields,
                      [newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE]: {
                        ...localFields[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE],
                        value: !localFields[newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE].value,
                      },
                    })
                  }
                  name={newConstants.HOTEL_AMENITY_IS_TAX_AVAILABLE}
                />
              }
              label={<LanguageConfig id="amenity.istaxavailable" />}
            />
          </Column> */}
          {editData ? (
            <Column md={3} padding={[10, 5]} center>
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
                label={<LanguageConfig id="amenity.isactive" />}
              />
            </Column>
          ) : (
            ''
          )}
            <Row>
          <Column md={6}>
          <LanguageContainer focusNextRef={focusNextRef} copylanguages={copylanguages} classes={classes} languages={languages} multi_language={multi_language} multiStateUpdater={multiStateUpdater} />
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
                        <LanguageConfig id={editData?"amenity.update":"save"}/>
                      </Column>
                    </Row>
                  </Button>
                  <Button
                    onClick={() => {
                      setAddEdit(false);
                      setEditData(null);
                    }}
                    className={classes.closeButton}
                    variant="contained">
                    <LanguageConfig id={"amenity.cancel"}/>
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

const AmenityName = ({ name, value, onChange, error, helperText, label ,myref}) => {
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
      myref={myref}
    />
  );
};

const LanguageContainer = ({ classes, multi_language, multiStateUpdater ,languages, copylanguages,focusNextRef}) => {
  const ref = useRef();
  return (
    <div ref={ref}>
      <Row>
        <Column>
          <div className={classes.scrollContainer}>
            <Row>
              <Paper style={{ width: "100%" }}>
                <TableContainer className={classes.TableContain}>
                  <Table>
                    <TableHead>
                      <TableRow>                                
                        <TableCell className={classes.tableHeadTuple}>Language</TableCell>
                        <TableCell className={classes.tableHeadTuple}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {multi_language.map(
                        (val, index) => (
                          <TableRow>
                            <TableCell className={classes.tableBodyTuple}>
                              <Text>{languages.filter(f=>f.value==val[newConstants.LANG_CODE].value).length?languages.filter(f=>f.value==val[newConstants.LANG_CODE].value)[0].label:
                            copylanguages.filter(f=>f.value==val[newConstants.LANG_CODE].value)[0].label}</Text>
                            </TableCell>
                            <TableCell className={classes.tableBodyTuple}>
                              <TextField
                                label={"Amenity Name"}
                                type="text"
                                inputRef={focusNextRef}
                                value={val[newConstants.HOTEL_AMENITY_NAME].value}
                                name={newConstants.HOTEL_AMENITY_NAME}
                                error={val[newConstants.HOTEL_AMENITY_NAME].error}
                                onChange={(e) => multiStateUpdater(e, index)}
                                helperText={val[newConstants.HOTEL_AMENITY_NAME].err_msg}
                              />
                            </TableCell>
                          </TableRow>)
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Row>
          </div>
        </Column>
      </Row>
    </div>
  )
}