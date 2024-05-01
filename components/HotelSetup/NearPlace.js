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
} from '../../core';
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
} from '../../helper/RequestPayLoad';
import { httpPostRequest, validator } from '../../helper/JsHelper';
import { constants, newConstants } from '../../helper/constants';
import { useStore } from '../../helper/Store';
import PrimaryContainer from '../PrimaryContainer';
import LanguageConfig from "../../helper/LanguageConfig";
var FA = require('react-fontawesome');



const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    width: '40%',
    margin: 5,
    backgroundColor:"rgb(26, 43, 71);",
    color:"white",
    '&:hover': {
      backgroundColor:"rgb(26, 43, 71);",
    },
  },
  addButton: {
    margin: 5
  },
  closeButton: {
    margin: 5,
    width: '40%',
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

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [data, setData] = useState([]);

  const [loader, setLoader] = useState(false);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg } = useStore();
  const [deleteLoader, setDeleteLoader] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [formname,setFormname]=useState("")
  
  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: "SNo" },
    [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: { is_hide: false, bool: true, label: "Desc" },
    [newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE]: { is_hide: false, bool: true, label: "Lat" },
    [newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE]: { is_hide: false, bool: true, label: "Lng" },
    [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE]: { is_hide: false, bool: true, label: "Icon " },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: "Status" },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: "LastUpdatedBy" },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: "LastUpdatedOn" },
    action: { is_hide: true, show: false, bool: true, label: "Action" }
  });

  const loadData = async () => {
    if (!addEdit) {
      setLoader(true);
      let res = await httpPostRequest(getAllNearPlace(search_key, (currIndex - 1) * pageSize + 1, pageSize));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setData(res[constants.DATA]["hotel-near-places"]);
        setMaxPage(
          res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
            parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
            0
            ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
            : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
        );
        setLoader(false);
      } else {
        setLoader(false);
        setCurrIndex(1);
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  useMemo(() => {
    setFormname(window.location.pathname.split("/")[3])
  }, [formname])

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };

  const edit = async (key) => {
    setAddEdit(false);
    let res = await httpPostRequest(getNearPlaceByKey(key));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    else {
      setAddEdit(false);
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  const delNearPlace = async () => {
    if (deleteId != '') {
      const res = await httpPostRequest(deleteNearPlace(deleteId));
      setDeleteLoader(deleteId);
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
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
      <Card margin={[0, 0, 10, 0]}>
        {addEdit &&
          <EditContainer
            loadData={loadData}
            languages={languages}
            setAlertMsg={setAlertMsg}
            editData={editData}
            setEditData={setEditData}
            setAddEdit={setAddEdit}
            addEdit={addEdit}
            classes={classes}
          />
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
        action_key={newConstants.HOTEL_NEAR_BY_PLACE_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={'Are you sure, you are deleting a recoard.'}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delNearPlace}
        />

      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, setEditData, setAddEdit, editData, setAlertMsg, loadData }) => {
  const [localFields, setLocalFields] = useState([]);

  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [latLong, setLatLong] = useState(null);
  const { languages, copylanguages } = useStore();
  const { Country, City, Province, Currency, ContactNumber, Language } = DemandDropDown;
  useEffect(() => {
    if (!editData) {
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
          value: '',
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
        [newConstants.CITY_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.PROVINCE_KEY]: {
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
        }
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
        [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: {
          value: "",
          is_require: true,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      setMultiLanguage(Tab_multi)
    } else {
      setLocalFields({
        [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: {
          value: editData[newConstants.HOTEL_NEAR_BY_PLACE_DESC],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE]: {
          value: editData[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE],
          is_require: false,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.HOTEL_NEAR_PLACE_TYPE_KEY]: {
          value: editData[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE]: {
          value: editData[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE],
          is_require: true,
          error: false,
        },
        [newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE]: {
          value: editData[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE],
          is_require: true,
          error: false,
        },
        [newConstants.IS_ACTIVE]: {
          value: editData[newConstants.IS_ACTIVE],
          is_require: false,
          error: false,
          type: 'boolean',
          err_msg: '',
        },
        [newConstants.CITY_KEY]: {
          value: editData[newConstants.CITY_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.PROVINCE_KEY]: {
          value: editData[newConstants.PROVINCE_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.COUNTRY_KEY]: {
          value: editData[newConstants.COUNTRY_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        }
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
        [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: {
          value: "",
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },

      }))
      let multi_language_ = [];
      if (editData && 
        editData[newConstants.HOTEL_NEAR_BY_PLACE_LANGUAGES] &&
        editData[newConstants.HOTEL_NEAR_BY_PLACE_LANGUAGES].length
      ) {
        editData[newConstants.HOTEL_NEAR_BY_PLACE_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.HOTEL_NEAR_BY_PLACE_DESC]: {
              value: value[newConstants.HOTEL_NEAR_BY_PLACE_DESC],
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
          });
        });
      } else {
        multi_language_.push(...Tab_multi);
      }
      setMultiLanguage(multi_language_.concat(Tab_multi.filter(f => !(multi_language_.map(v => v["lang-code"].value).includes(f["lang-code"].value)))))
    }
  }, [editData, languages]);

  useMemo(() => {
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
    let multi_lang_ = multi_language.filter(f => f[newConstants.HOTEL_NEAR_BY_PLACE_DESC].value != "")
    if (!localFields_validation.err) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createNearPlace(localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(
          updateNearPlace(editData[newConstants.HOTEL_NEAR_BY_PLACE_KEY], localFields, multi_lang_),
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
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
              helperText={localFields[newConstants.COUNTRY_KEY].error ? localFields[newConstants.COUNTRY_KEY].err_msg : ""}
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <Province
              name={newConstants.PROVINCE_KEY}
              error={localFields[newConstants.PROVINCE_KEY].error}
              value={localFields[newConstants.PROVINCE_KEY].value}
              country_key={localFields[newConstants.COUNTRY_KEY].value}
              onChange={stateUpdater}
              helperText={localFields[newConstants.PROVINCE_KEY].error ? localFields[newConstants.PROVINCE_KEY].err_msg : ""}
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <City
              name={newConstants.CITY_KEY}
              error={localFields[newConstants.CITY_KEY].error}
              value={localFields[newConstants.CITY_KEY].value}
              onChange={stateUpdater}
              helperText={localFields[newConstants.CITY_KEY].error ? localFields[newConstants.CITY_KEY].err_msg : ""}
              country_key={localFields[newConstants.COUNTRY_KEY].value}
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <TextField
              label="Near Place Latitude"
              onClick={() => setOpenMap(!openMap)}
              name={newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE}
              value={localFields[newConstants.HOTEL_NEAR_BY_PLACE_LATITUDE].value}
              // onChange={stateUpdater}
              disabled
              InputProps={{
                style:{
                  fontWeight:600
                }
              }}
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
              // onChange={stateUpdater}
              disabled
              InputProps={{
                style:{
                  fontWeight:600
                }
              }}
              error={
                localFields[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE].error
              }
              helperText={
                localFields[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE].err_msg
              }
              required={localFields[newConstants.HOTEL_NEAR_BY_PLACE_LONGITUDE].is_require}
              onClick={() => setOpenMap(!openMap)}
            />
            <> 
            <MapSelect openMap={openMap} setOpenMap={setOpenMap} latLong={latLong} setLatLong={setLatLong} />
            </>
          </Column>
          {/* <Column md={3} padding={[10, 5]} middle center>
                <Button variant="contained" color="primary" onClick={() => setOpenMap(!openMap)}>
                  Select on Map
                </Button>
              </Column> */}          
          {editData ? (
            <Column md={3} padding={[0, 10]} center>
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
          )}
          <Column>
            <Row>
              <Column md={6}>
                <LanguageContainer copylanguages={copylanguages} classes={classes} languages={languages} multi_language={multi_language} multiStateUpdater={multiStateUpdater} />
              </Column>
            </Row>
          </Column>
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
                        {editData ? 'Update' : 'save'}
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
          res[newConstants.DATA][newConstants.HOTEL_NEAR_PLACE_TYPE].map((v) => ({
            value: v[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY],
            label: v[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.HOTEL_NEAR_PLACE_TYPE].map((v) => ({
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
const LanguageContainer = ({ classes, multi_language, multiStateUpdater, copylanguages, languages }) => {
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
                              <Text>{languages.filter(f => f.value == val[newConstants.LANG_CODE].value).length ? languages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label :
                                copylanguages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label}</Text>
                            </TableCell>
                            <TableCell className={classes.tableBodyTuple}>
                              <TextField
                                label={"Near Place Desc"}
                                type="text"
                                value={val[newConstants.HOTEL_NEAR_BY_PLACE_DESC].value}
                                name={newConstants.HOTEL_NEAR_BY_PLACE_DESC}
                                error={val[newConstants.HOTEL_NEAR_BY_PLACE_DESC].error}
                                onChange={(e) => multiStateUpdater(e, index)}
                                helperText={val[newConstants.HOTEL_NEAR_BY_PLACE_DESC].err_msg}
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
