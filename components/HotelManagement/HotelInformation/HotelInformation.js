import React, { useState, useEffect, useRef } from 'react';
import {
  Touchable,
  MapSelect,
  Accordian,
  TextField,
  Text,
  Card,
  Row,
  Column,
  Loader,
  Glyphi,
  CustomAlert,
  SingelSelectOnDemand,
  DemandDropDown,
  ModalComponent,
} from '../../../core';
import {
  IconButton,
  Tabs,
  Tab,
  Typography,
  Box,
  Fade,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  FormControl, TextareaAutosize
} from '@material-ui/core';
// import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { fade, makeStyles } from '@material-ui/core/styles';
import { RadioButtonUnchecked, CheckCircle, Cancel, Edit, Delete, AddAPhoto, Create } from '@material-ui/icons';
import { useStore } from '../../../helper/Store';
import { getDateYYYYMMDD, validator, httpPostRequest, httpPostRequestWithForm } from '../../../helper/JsHelper';
import {
  hotelMasterUpdate,
  createHotelType,
  getHotelTypeY,
  getAllHotelCategoryY,
  getHotelCategoryInfoById,
  getAllHotelIssuesY,
  getAllNearPlaceY,
  getAllHotelTagY,
  getAllAmmunityY,
  hotelMasterGet,
  imageUploder,
  createHotelCategory,
  hotelMasterSave,
  deleteByHotel,
  getHotelTax
} from '../../../helper/RequestPayLoad';
import { newConstants, constants } from '../../../helper/constants';
import PropTypes from 'prop-types';
import LanguageConfig from "../../../helper/LanguageConfig";
// import HotelTagsNew from "./HotelTagsNew";
const useStyles = makeStyles((theme) => ({
  blockButton: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    width: "180px",
    backgroundColor: "rgb(26, 43, 71)",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    }
  },
  primaryImageSelect: {
    color: '#008000',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  scrollContainer: {
    overflowY: 'scroll',
    maxHeight: 300,
  },
  imageSelectContainer: {
    position: 'absolute',
    top: -5,
    left: -5,
  },
  primaryImageUnSelect: {
    color: '#000',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  closeImageContainer: {
    position: 'absolute',
    bottom: 5,
    right: 3,
  },
  closeImage: {
    color: 'red',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    zIndex: 2,
  },
  modalScrollContainer: {
    overflowY: 'scroll',
    height: '50vh',
  },
  hotelImage: {
    borderRadius: 10,
    height: 140,
    width: 150,
  },
  tabContainer: {
    width: '100%',
  },
  addPhotos: {
    fontSize: 35,
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  inputSelect: {
    display: 'none',
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '70vh',
  },
  paper: {
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
    width: 216,
    height: 230,
    overflow: "auto"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  dropZone: {
    height: 100,
  },
  table: {
    minWidth: 650,
  },
  addEdit: {
    backgroundColor: theme.palette.error.main,
  },
  saveButton: {
    width: '30%',
    margin: 5,
    color: "white",
    backgroundColor: "rgb(26, 43, 71)",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    }
  },
  modalBtn: {
    color: "white",
    padding: '10px',
    backgroundColor: "rgb(26, 43, 71)",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    }
  },
  LanguageHoredcheckup: { position: 'absolute', top: '10px', right: '0px', },
  tableHead: {
    backgroundColor: '#ffffff',
    borderBottom: '1.2px solid' + theme.palette.primary.main,
  },
  tableHeadTuple: {
    color: 'black',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    textTransform: 'uppercase',
    width: 'clamp(150px,10vw,300px)',
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
  headerName: {
    borderRadius: 5,
    margin: '10px 0px',
  },
  Bold: {
    fontWeight: 'bold',
  },
  editContainer: {
    margin: '0 0 10px 0px',
    width: '100%',
  },
  TransferButtton: {
    margin: theme.spacing(0.5, 0)
  },
  tableBodyTuple: {
    color: 'black',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    width: 'clamp(150px,10vw,300px)',
  },
  TableContain: {
    maxWidth: "300px",
    minWidth: "100%"
  },
  Languageheadernow: { fontSize: '30px', marginBottom: '11px', },
}));

export default function Setup() {
  const classes = useStyles();
  const { setAlertMsg } = useStore();
  const [category, setCategory] = useState(false)
  const [type, setType] = useState(false)
  const [categoryValue, setCategoryValue] = useState([]);
  const [typeValue, setTypeValue] = useState([]);


  const loadHotelType = async () => {
    let res = await httpPostRequest(getHotelTypeY('', 1, 200));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setTypeValue(
        res.data[newConstants.HOTEL_TYPES].map((v) => ({
          value: v[newConstants.HOTEL_TYPE_KEY],
          label: v[newConstants.HOTEL_TYPE_DESC],
        })),
      );
    }
  };

  const loadCateory = async (inputValue = '', callback = null) => {
    let res = await httpPostRequest(getAllHotelCategoryY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res.data[newConstants.HOTEL_CATEGORIES].map((v) => ({
            value: v[newConstants.HOTEL_CATEGORY_KEY],
            label: v[newConstants.HOTEL_CATEGORY_NAME],
          })),
        );
      } else {
        setCategoryValue(
          res.data[newConstants.HOTEL_CATEGORIES].map((v) => ({
            value: v[newConstants.HOTEL_CATEGORY_KEY],
            label: v[newConstants.HOTEL_CATEGORY_NAME],
          })),
        );
      }
    }
  };

  return (
    <div>
      <Column>
        <h3 className={classes.Languageheadernow}>Hotel Management</h3>
      </Column>

      <Card margin={[0, 0, 10, 0]}>
        <Row margin={[0, 0, -31, 0]}>
          <Column md={3} padding={[15, 15]} >
            <Box >
              <Button variant="outlined" color="primary" style={{ width: "65%" }} onClick={() => setCategory(true)}>Add Category</Button>
            </Box>
          </Column>
          <Column md={3} padding={[15, 15]} >
            <Box >
              <Button variant="outlined" color="primary" style={{ width: "65%" }} onClick={() => setType(true)}>Add Type</Button>
            </Box>
          </Column>
        </Row>
        <ModalComponent open={category} setOpen={setCategory}>
          <AddCategory setCategory={setCategory} category={category} setAlertMsg={setAlertMsg} loadCateory={loadCateory} typeValue={typeValue}
            loadHotelType={loadHotelType} />
        </ModalComponent>
        <ModalComponent open={type} setOpen={setType}>
          <AddType type={type} setType={setType} setAlertMsg={setAlertMsg} loadHotelType={loadHotelType} />
        </ModalComponent>
        <Row>
          <Fade >
            <EditContainer
              loadCateory={loadCateory}
              categoryValue={categoryValue}
              setCategoryValue={setCategoryValue}
              loadHotelType={loadHotelType} typeValue={typeValue}
              classes={classes}
            />
          </Fade>
        </Row>
      </Card>

    </div>
  );
}


const AddCategory = ({ category, setCategory, setAlertMsg, loadCateory, typeValue,
  loadHotelType }) => {
  const classes = useStyles()
  const [loader, setLoader] = useState(false);
  const [categoryField, setCategoryField] = useState([]);
  const stateUpdater = (e) => {
    let categoryField_ = _.cloneDeep(categoryField);
    if (e.target.value.length == 0) {
      categoryField_[e.target.name].error = categoryField_[e.target.name].is_require ? true : false;
      categoryField_[e.target.name].value = e.target.value;
    } else {
      categoryField_[e.target.name].value = e.target.value;
      categoryField_[e.target.name].error = false;
    }
    setCategoryField(categoryField_);
  };


  const save = async () => {
    let categoryField_validation = _.cloneDeep(categoryField);
    categoryField_validation = validator(categoryField_validation);
    if (categoryField_validation.err) {
      setCategoryField(categoryField_validation.values);
    }
    let flag = !categoryField_validation.err;
    if (flag) {
      setLoader(true);
      let res = await httpPostRequest(createHotelCategory(categoryField, []));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setLoader(false);
        setCategory(false);
        loadCateory()
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
    setCategoryField({
      [newConstants.HOTEL_TYPE_KEY]: {
        value: '',
        is_require: true,
        error: false,
        type: 'dropdown',
        err_msg: '',
      },
      [newConstants.HOTEL_CATEGORY_NAME]: {
        value: '',
        is_require: true,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.HOTEL_CATEGORY_GLYP_CSS]: {
        value: '',
        is_require: true,
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
            label={<LanguageConfig id={"hotelcategory.categoryname"} />}
            name={newConstants.HOTEL_CATEGORY_NAME}
            value={categoryField[newConstants.HOTEL_CATEGORY_NAME] && categoryField[newConstants.HOTEL_CATEGORY_NAME].value}
            onChange={stateUpdater}
            error={categoryField[newConstants.HOTEL_CATEGORY_NAME] && categoryField[newConstants.HOTEL_CATEGORY_NAME].error}
            helperText={categoryField[newConstants.HOTEL_CATEGORY_NAME] && categoryField[newConstants.HOTEL_CATEGORY_NAME].err_msg}
            required={categoryField[newConstants.HOTEL_CATEGORY_NAME] && categoryField[newConstants.HOTEL_CATEGORY_NAME].is_require}
          />
        </Column>
        <Column md={3} padding={[10, 5]}>
          <HotelType
            typeValue={typeValue}
            loadHotelType={loadHotelType}
            name={newConstants.HOTEL_TYPE_KEY}
            error={categoryField[newConstants.HOTEL_TYPE_KEY] && categoryField[newConstants.HOTEL_TYPE_KEY].error}
            value={categoryField[newConstants.HOTEL_TYPE_KEY] && categoryField[newConstants.HOTEL_TYPE_KEY].value}
            onChange={stateUpdater}
            helperText={categoryField[newConstants.HOTEL_TYPE_KEY] && categoryField[newConstants.HOTEL_TYPE_KEY].error ? 'Incorrect entry.' : ''}
          />
        </Column>
        <Column md={3} padding={[10, 5]}>
          <Glyphi
            size="small"
            labelId="category_icon"
            id="hotel-cat-icon"
            name={newConstants.HOTEL_CATEGORY_GLYP_CSS}
            value={categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS] && categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS].value}
            error={
              categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS] &&
              categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS].error
            }
            onChange={stateUpdater}
            helperText={
              categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS] && categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS].err_msg

            }
            label={<LanguageConfig id={"hotelcategory.icon"} />}
            required={categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS] && categoryField[newConstants.HOTEL_CATEGORY_GLYP_CSS].is_require ? true : false}
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


const AddType = ({ type, setType, loadHotelType, setAlertMsg }) => {
  const classes = useStyles()
  const [loader, setLoader] = useState(false);
  const [typeField, setTypeField] = useState([]);
  const stateUpdater = (e) => {
    let typeField_ = _.cloneDeep(typeField);
    if (e.target.value.length == 0) {
      typeField_[e.target.name].error = typeField_[e.target.name].is_require ? true : false;
      typeField_[e.target.name].value = e.target.value;
    } else {
      typeField_[e.target.name].value = e.target.value;
      typeField_[e.target.name].error = false;
    }
    setTypeField(typeField_);
  };


  const save = async () => {
    let typeField__validation = _.cloneDeep(typeField);
    typeField__validation = validator(typeField__validation);
    if (typeField__validation.err) {
      setTypeField(typeField__validation.values);
    }
    let flag = !typeField__validation.err;
    if (flag) {
      setLoader(true);
      let res = await httpPostRequest(createHotelType(typeField));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setLoader(false);
        setType(false);
        loadHotelType()
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
    setTypeField({
      [newConstants.HOTEL_TYPE_DESC]: {
        value: '',
        is_require: true,
        error: false,
        min_length: 2,
        max_length: null,
        type: 'text',
        err_msg: '',
      }
    });
  }, [])
  return (
    <div>
      <Row padding={[10]}>
        <Column md={3} padding={[10, 5]}>
          <TextField
            label={<LanguageConfig id={"hotelcategory.categoryname"} />}
            name={newConstants.HOTEL_TYPE_DESC}
            value={typeField[newConstants.HOTEL_TYPE_DESC] && typeField[newConstants.HOTEL_TYPE_DESC].value}
            onChange={stateUpdater}
            error={typeField[newConstants.HOTEL_TYPE_DESC] && typeField[newConstants.HOTEL_TYPE_DESC].error}
            helperText={typeField[newConstants.HOTEL_TYPE_DESC] && typeField[newConstants.HOTEL_TYPE_DESC].err_msg}
            required={typeField[newConstants.HOTEL_TYPE_DESC] && typeField[newConstants.HOTEL_TYPE_DESC].is_require}
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

const EditContainer = ({ classes, loadCateory,
  categoryValue,
  setCategoryValue, loadHotelType, typeValue }) => {
  const [localFields, setLocalFields] = useState(null);
  const [loader, setLoader] = useState(false);
  const [multi_images, setMultiImages] = useState([]);
  const [hotel_languages, setHotelLanguages] = useState([]);
  const [near_place, setNearplace] = useState([]);
  const [hotelIssues, setHotelIssues] = useState([]);
  const [hotel_description, setHotelDescription] = useState([]);
  const [leftAmen, setLeftamen] = useState([])
  const [rightAmen, setRightamen] = useState([])
  const { languages, setAlertMsg } = useStore();
  const [saveFlag, setSaveFlag] = useState(false);

  useEffect(() => {

    setLocalFields({
      [newConstants.HOTEL_NAME]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_ADDRESS]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_EMAIL1]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_WEB_SITE]: {
        value: '',
        is_require: false,
        error: false,
      },
      [newConstants.HOTEL_OFFICE_PHONE1]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_OFFICE_PHONE2]: {
        value: '',
        is_require: false,
        error: false,
      },
      [newConstants.HOTEL_PHONE1]: {
        value: "",
        is_require: false,
        error: false,
      },
      [newConstants.HOTEL_REGNO]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_CONTACT_PERSON]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_CATEGORY_KEY]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_TYPE_KEY]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_POSTAL_CODE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_LATITUDE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_LONGITUDE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_PROVINCE_KEY]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_CITY_KEY]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_COUNTRY_KEY]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.TAX_TYPE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.SERVICE_TYPE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.ADDITIONAL_TYPE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_TAX_VALUE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_SERVICE_VALUE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_ADDITIONAL_VALUE]: {
        value: '',
        is_require: true,
        error: false,
      },
      [newConstants.HOTEL_TAX_RULE_KEY]: {
        value: '',
        is_require: true,
        error: false,
      },

      [newConstants.HOTEL_TAGS]: {
        value: [],
        is_require: true,
        error: false,
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
      [newConstants.HOTEL_NAME]: {
        value: "",
        is_require: false,
        error: false,
        min_length: 1,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.HOTEL_ADDRESS]: {
        value: "",
        is_require: false,
        error: false,
        min_length: 1,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
      [newConstants.HOTEL_CONTACT_PERSON]: {
        value: "",
        is_require: false,
        error: false,
        min_length: 1,
        max_length: null,
        type: 'text',
        err_msg: '',
      },
    }))
    setHotelLanguages(Tab_multi)
    setRightamen([])
    setNearplace([]);
    setMultiImages([]);
    setHotelIssues([]);
    setHotelDescription([]);

  }, []);

  const AmenityLoad = async () => {
    let res = await httpPostRequest(getAllAmmunityY(""));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {

      let leftAmen_ = res[newConstants.DATA][newConstants.HOTEL_AMENITIES].map((val, index) => ({
        [newConstants.HOTEL_AMENITY_KEY]: val[newConstants.HOTEL_AMENITY_KEY],
        [newConstants.HOTEL_AMENITY_NAME]: val[newConstants.HOTEL_AMENITY_NAME],
      }))
      setLeftamen(leftAmen_.filter(f => (!rightAmen.map(v => v[newConstants.HOTEL_AMENITY_KEY]).includes(f[newConstants.HOTEL_AMENITY_KEY]))))
    }
  };


  useEffect(() => {
    AmenityLoad()
  }, [rightAmen])

  const stateUpdater = (e) => {
    setSaveFlag(true);
    let localFields_ = _.cloneDeep(localFields);
    if (e.target.value.length == 0) {
      localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
      localFields_[e.target.name].value = e.target.value;
    } else if (typeof e.target.value == 'object' && typeof e.target.name == 'object') {
      e.target.value.forEach((value, index) => {
        localFields_[e.target.name[index]].value = value;
        localFields_[e.target.name[index]].error = false;
      });
    } else {
      localFields_[e.target.name].value = e.target.value;
      localFields_[e.target.name].error = false;
    }
    setLocalFields(localFields_);
  };



  return (
    <div>
      {localFields ? (
        <Row>
          <Column padding={[10]}>
            <Row>
              <Column>
                <HotelInformation
                  loadCateory={loadCateory}
                  categoryValue={categoryValue}
                  typeValue={typeValue}
                  loadHotelType={loadHotelType}
                  setCategoryValue={setCategoryValue} stateUpdater={stateUpdater} localFields={localFields} classes={classes} />
              </Column>
              <Column>
                {/* <HotelTags
                  name={newConstants.HOTEL_TAGS}
                  values={localFields[newConstants.HOTEL_TAGS]}
                  classes={classes}
                  stateUpdater={stateUpdater}
                  addMulti={addMulti}
                  removeMulti={removeMulti}
                /> */}
                {/* <HotelTagsNew/> */}
              </Column>
              <Column md={12}>
                <Row padding={[10, 0]}>
                  <Column padding={[5, 0]} md={2}>
                    <Row>
                      <Column padding={[0, 0, 0, 15]}>
                        <Text size={11.5} color="#e00202">
                          {multi_images.length > 0
                            ? localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY].error
                              ? 'Select a  Image as primary.'
                              : ''
                            : localFields[newConstants.HOTEL_FEATURED_IMAGE_PATH_KEY].error
                              ? 'Require Field.'
                              : ''}
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Column>
              <Column right>
                <Row>
                  <Column md={8}></Column>
                  <Column right md={4} padding={[10, 0]}>
                    <Row bottom>
                      {/* <Button
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
                            <LanguageConfig id={"Save"} />
                          </Column>
                        </Row>
                      </Button>
                      <Button
                        // onClick={() => {
                        //   setAddEdit(false);
                        //   setEditData(null);
                        // }}
                        className={classes.closeButton}
                        variant="contained">
                        <LanguageConfig id="managehotel.cancel" />
                      </Button> */}
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

const HotelInformation = ({ stateUpdater, localFields, classes, loadCateory,
  categoryValue,
  setCategoryValue, typeValue,
  loadHotelType }) => {
  const { Country, City, Province } = DemandDropDown;
  const [mapPicker, setMapPicker] = useState(false);
  const [percentage, setPercentage] = useState([
    { value: 'Percentage', label: 'Percentage' },
  ]);
  const [taxrule, setTaxrule] = useState([
    { value: "pXsP+kp6Mv1mRKilSNBSzxNDSU/+lpYsloMzgzQ2ml0=", label: 'manual entry' },
  ]);

  const setLatLong = (e) => {
    if (e && e['longitude']) {
      stateUpdater({
        target: {
          value: [e['longitude'] + '', e['latitude'] + ''],
          name: [newConstants.HOTEL_LONGITUDE, newConstants.HOTEL_LATITUDE],
        },
      });
    }
  };

  return (
    <Row>
      <Column >
        {/* <Text bold><LanguageConfig id="managehotel.hotelinformation" /></Text> */}
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={<LanguageConfig id="managehotel.hotelname" />}
          name={newConstants.HOTEL_NAME}
          value={localFields[newConstants.HOTEL_NAME].value}
          onChange={stateUpdater}
          error={localFields[newConstants.HOTEL_NAME].error}
          helperText={
            localFields[newConstants.HOTEL_NAME].err_msg
          }
          required={localFields[newConstants.HOTEL_NAME].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <HotelCategory
          loadCateory={loadCateory}
          categoryValue={categoryValue}
          setCategoryValue={setCategoryValue}
          name={newConstants.HOTEL_CATEGORY_KEY}
          error={localFields[newConstants.HOTEL_CATEGORY_KEY].error}
          value={localFields[newConstants.HOTEL_CATEGORY_KEY].value}
          onChange={stateUpdater}
          helperText={localFields[newConstants.HOTEL_CATEGORY_KEY].error ? 'Incorrect entry.' : ''}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <HotelType
          typeValue={typeValue}
          loadHotelType={loadHotelType}
          name={newConstants.HOTEL_TYPE_KEY}
          error={localFields[newConstants.HOTEL_TYPE_KEY].error}
          value={localFields[newConstants.HOTEL_TYPE_KEY].value}
          onChange={stateUpdater}
          helperText={localFields[newConstants.HOTEL_TYPE_KEY].error ? 'Incorrect entry.' : ''}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={<LanguageConfig id="managehotel.registrationno" />}
          name={newConstants.HOTEL_REGNO}
          value={localFields[newConstants.HOTEL_REGNO].value}
          onChange={stateUpdater}
          error={localFields[newConstants.HOTEL_REGNO].error}
          helperText={
            localFields[newConstants.HOTEL_REGNO].err_msg
          }
          required={localFields[newConstants.HOTEL_REGNO].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={<LanguageConfig id="managehotel.email" />}
          name={newConstants.HOTEL_EMAIL1}
          value={localFields[newConstants.HOTEL_EMAIL1].value}
          onChange={stateUpdater}
          error={localFields[newConstants.HOTEL_EMAIL1].error}
          helperText={
            localFields[newConstants.HOTEL_EMAIL1].err_msg
          }
          required={localFields[newConstants.HOTEL_EMAIL1].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={<LanguageConfig id="managehotel.website" />}
          name={newConstants.HOTEL_WEB_SITE}
          value={localFields[newConstants.HOTEL_WEB_SITE].value}
          onChange={stateUpdater}
          error={localFields[newConstants.HOTEL_WEB_SITE].error}
          helperText={
            localFields[newConstants.HOTEL_WEB_SITE].err_msg
          }
          required={localFields[newConstants.HOTEL_WEB_SITE].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={<LanguageConfig id="managehotel.contactperson" />}
          name={newConstants.HOTEL_CONTACT_PERSON}
          value={localFields[newConstants.HOTEL_CONTACT_PERSON].value}
          onChange={stateUpdater}
          error={
            localFields[newConstants.HOTEL_CONTACT_PERSON].error}
          helperText={
            localFields[newConstants.HOTEL_CONTACT_PERSON].err_msg
          }
          required={localFields[newConstants.HOTEL_CONTACT_PERSON].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={<LanguageConfig id="managehotel.officephone1" />}
          name={newConstants.HOTEL_OFFICE_PHONE1}
          value={localFields[newConstants.HOTEL_OFFICE_PHONE1].value}
          onChange={stateUpdater}
          error={
            localFields[newConstants.HOTEL_OFFICE_PHONE1].error}
          helperText={
            localFields[newConstants.HOTEL_OFFICE_PHONE1].err_msg
          }
          required={localFields[newConstants.HOTEL_OFFICE_PHONE1].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={<LanguageConfig id="managehotel.officephone2" />}
          name={newConstants.HOTEL_OFFICE_PHONE2}
          value={localFields[newConstants.HOTEL_OFFICE_PHONE2].value}
          onChange={stateUpdater}
          error={
            localFields[newConstants.HOTEL_OFFICE_PHONE2].error}
          helperText={
            localFields[newConstants.HOTEL_OFFICE_PHONE2].err_msg
          }
          required={localFields[newConstants.HOTEL_OFFICE_PHONE2].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={"hotel phoneno 1"}
          name={newConstants.HOTEL_PHONE1}
          value={localFields[newConstants.HOTEL_PHONE1].value}
          onChange={stateUpdater}
          error={
            localFields[newConstants.HOTEL_PHONE1].error}
          helperText={
            localFields[newConstants.HOTEL_PHONE1].err_msg
          }
          required={localFields[newConstants.HOTEL_PHONE1].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={"hotel tax value"}
          type="number"
          name={newConstants.HOTEL_TAX_VALUE}
          value={localFields[newConstants.HOTEL_TAX_VALUE].value}
          onChange={stateUpdater}
          error={
            localFields[newConstants.HOTEL_TAX_VALUE].error}
          helperText={
            localFields[newConstants.HOTEL_TAX_VALUE].err_msg
          }
          required={localFields[newConstants.HOTEL_TAX_VALUE].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={"hotel service value"}
          type="number"
          name={newConstants.HOTEL_SERVICE_VALUE}
          value={localFields[newConstants.HOTEL_SERVICE_VALUE].value}
          onChange={stateUpdater}
          error={
            localFields[newConstants.HOTEL_SERVICE_VALUE].error}
          helperText={
            localFields[newConstants.HOTEL_SERVICE_VALUE].err_msg
          }
          required={localFields[newConstants.HOTEL_SERVICE_VALUE].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={"hotel additional value"}
          type="number"
          name={newConstants.HOTEL_ADDITIONAL_VALUE}
          value={localFields[newConstants.HOTEL_ADDITIONAL_VALUE].value}
          onChange={stateUpdater}
          error={
            localFields[newConstants.HOTEL_ADDITIONAL_VALUE].error}
          helperText={
            localFields[newConstants.HOTEL_ADDITIONAL_VALUE].err_msg
          }
          required={localFields[newConstants.HOTEL_ADDITIONAL_VALUE].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <HotelTaxRule
          name={newConstants.HOTEL_TAX_RULE_KEY}
          error={localFields[newConstants.HOTEL_TAX_RULE_KEY].error}
          value={localFields[newConstants.HOTEL_TAX_RULE_KEY].value}
          onChange={stateUpdater}
          helperText={localFields[newConstants.HOTEL_TAX_RULE_KEY].error ? 'Incorrect entry.' : ''}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TypeRates
          name={newConstants.TAX_TYPE}
          value={localFields[newConstants.TAX_TYPE].value}
          onChange={stateUpdater}
          error={localFields[newConstants.TAX_TYPE].error && localFields[newConstants.TAX_TYPE].is_require}
          helperText={
            localFields[newConstants.TAX_TYPE].error && localFields[newConstants.TAX_TYPE].is_require
              ? localFields[newConstants.TAX_TYPE].err_msg
              : ''
          }
          label={"Tax Type"}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TypeRates
          name={newConstants.SERVICE_TYPE}
          value={localFields[newConstants.SERVICE_TYPE].value}
          onChange={stateUpdater}
          error={localFields[newConstants.SERVICE_TYPE].error && localFields[newConstants.SERVICE_TYPE].is_require}
          helperText={
            localFields[newConstants.SERVICE_TYPE].error && localFields[newConstants.SERVICE_TYPE].is_require
              ? localFields[newConstants.SERVICE_TYPE].err_msg
              : ''
          }
          label={"Service Type"}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TypeRates
          name={newConstants.ADDITIONAL_TYPE}
          value={localFields[newConstants.ADDITIONAL_TYPE].value}
          onChange={stateUpdater}
          error={localFields[newConstants.ADDITIONAL_TYPE].error && localFields[newConstants.ADDITIONAL_TYPE].is_require}
          helperText={
            localFields[newConstants.ADDITIONAL_TYPE].error && localFields[newConstants.ADDITIONAL_TYPE].is_require
              ? localFields[newConstants.ADDITIONAL_TYPE].err_msg
              : ''
          }
          label={"Additional Type"}
        />
      </Column>
      <Column padding={[5, 0]}>
        <Text bold><LanguageConfig id="managehotel.address" /></Text>
      </Column>
      <Column md={6} padding={[10, 5]}>
        <TextField
          label={<LanguageConfig id="managehotel.hoteladdress" />}
          name={newConstants.HOTEL_ADDRESS}
          value={localFields[newConstants.HOTEL_ADDRESS].value}
          onChange={stateUpdater}
          error={localFields[newConstants.HOTEL_ADDRESS].error}
          helperText={
            localFields[newConstants.HOTEL_ADDRESS].err_msg
          }
          InputProps={{
            style: {
              height: "auto",
            }
          }}
          rows={3}
          multiline
          id="outlined-multiline-static"
          required={localFields[newConstants.HOTEL_ADDRESS].is_require}
        />
      </Column>
      <Column md={6}>
        <Row>
          <Column md={6} padding={[10, 5]}>
            <Country
              name={newConstants.HOTEL_COUNTRY_KEY}
              error={localFields[newConstants.HOTEL_COUNTRY_KEY].error}
              value={localFields[newConstants.HOTEL_COUNTRY_KEY].value}
              onChange={stateUpdater}
              helperText={localFields[newConstants.HOTEL_COUNTRY_KEY].error ? 'Incorrect entry.' : ''}
            />
          </Column>
          <Column md={6} padding={[10, 5]}>
            <Province
              name={newConstants.HOTEL_PROVINCE_KEY}
              value={localFields[newConstants.HOTEL_PROVINCE_KEY].value}
              country_key={localFields[newConstants.HOTEL_COUNTRY_KEY].value}
              error={localFields[newConstants.HOTEL_PROVINCE_KEY].error}
              onChange={stateUpdater}
              helperText={localFields[newConstants.HOTEL_PROVINCE_KEY].error ? 'Incorrect entry.' : ''}
            />
          </Column>
          <Column md={6} padding={[10, 5]}>
            <City
              name={newConstants.HOTEL_CITY_KEY}
              value={localFields[newConstants.HOTEL_CITY_KEY].value}
              country_key={localFields[newConstants.HOTEL_COUNTRY_KEY].value}
              error={localFields[newConstants.HOTEL_CITY_KEY].error}
              onChange={stateUpdater}
              helperText={localFields[newConstants.HOTEL_CITY_KEY].error ? 'Incorrect entry.' : ''}
            />
          </Column>
          <Column md={6} padding={[10, 5]}>
            <TextField
              label={<LanguageConfig id="managehotel.postalcode" />}
              name={newConstants.HOTEL_POSTAL_CODE}
              value={localFields[newConstants.HOTEL_POSTAL_CODE].value}
              onChange={stateUpdater}
              error={localFields[newConstants.HOTEL_POSTAL_CODE].error}
              helperText={localFields[newConstants.HOTEL_POSTAL_CODE].err_msg}
              required={localFields[newConstants.HOTEL_POSTAL_CODE].is_require}
            />
          </Column>
        </Row>
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={<LanguageConfig id="managehotel.latitude" />}
          onClick={() => setMapPicker(true)}
          name={newConstants.HOTEL_LATITUDE}
          value={localFields[newConstants.HOTEL_LATITUDE].value}
          onChange={stateUpdater}
          error={localFields[newConstants.HOTEL_LATITUDE].error}
          helperText={
            localFields[newConstants.HOTEL_LATITUDE].err_msg
          }
          required={localFields[newConstants.HOTEL_LATITUDE].is_require}
        />
      </Column>
      <Column md={3} padding={[10, 5]}>
        <TextField
          label={<LanguageConfig id="managehotel.longitude" />}
          onClick={() => setMapPicker(true)}
          name={newConstants.HOTEL_LONGITUDE}
          value={localFields[newConstants.HOTEL_LONGITUDE].value}
          onChange={stateUpdater}
          error={localFields[newConstants.HOTEL_LONGITUDE].error}
          helperText={
            localFields[newConstants.HOTEL_LONGITUDE].err_msg
          }
          required={localFields[newConstants.HOTEL_LONGITUDE].is_require}
        />
      </Column>

      <MapSelect
        openMap={mapPicker}
        setOpenMap={setMapPicker}
        latLong={{
          longitude: parseFloat(localFields[newConstants.HOTEL_LONGITUDE].value),
          latitude: parseFloat(localFields[newConstants.HOTEL_LATITUDE].value),
        }}
        setLatLong={setLatLong}
      />
    </Row>
  );
};



const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const HotelCategory = ({ error, name, value: hotel_category_key, helperText, onChange, loadCateory,
  categoryValue,
  setCategoryValue }) => {
  const [value, setValue] = useState(null);
  const getCategoryByKey = async () => {
    if (hotel_category_key) {
      let res = await httpPostRequest(getHotelCategoryInfoById(hotel_category_key));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setValue({ value: hotel_category_key, label: res.data[newConstants.HOTEL_CATEGORY_NAME] });
      }
    }
  };
  useEffect(() => {
    getCategoryByKey();
  }, [hotel_category_key, categoryValue]);

  useEffect(() => {
    loadCateory();
  }, []);


  return (
    <SingelSelectOnDemand
      defaultOptions={value ? [value].concat(categoryValue.filter((f) => f.value != value.value)) : categoryValue}
      value={value}
      loadOptions={loadCateory}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={<LanguageConfig id="managehotel.hotelcategory" />}
      helperText={helperText}
      error={error}
    />
  );
};

const HotelType = ({ error, name, value: hotel_type_key, helperText, onChange, typeValue, loadHotelType }) => {
  const [value, setValue] = useState(null);

  const getCategoryByKey = async () => {
    if (hotel_type_key && typeValue.length) {
      setValue(
        typeValue.filter((f) => f.value == hotel_type_key).length
          ? typeValue.filter((f) => f.value == hotel_type_key)[0]
          : null,
      );
    }
  };
  useEffect(() => {
    getCategoryByKey();
  }, [hotel_type_key, typeValue]);

  useEffect(() => {
    loadHotelType();
  }, []);


  const loadCateory = async (inputValue = '', callback = null) => {
    callback(typeValue.filter((f) => f.value.includes(inputValue)));
  };

  return (
    <SingelSelectOnDemand
      defaultOptions={typeValue}
      value={value}
      loadOptions={loadCateory}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={<LanguageConfig id="managehotel.hoteltype" />}
      helperText={helperText}
      error={error}
    />
  );
};





const HotelTaxRule = ({ error, name, value: hotel_tax_key, helperText, onChange }) => {
  const [value, setValue] = useState(null);
  const [defaultValue, setDefaultValue] = useState([]);

  const getCategoryByKey = async () => {
    if (hotel_tax_key && defaultValue.length) {
      setValue(
        defaultValue.filter((f) => f.value == hotel_tax_key).length
          ? defaultValue.filter((f) => f.value == hotel_tax_key)[0]
          : null,
      );
    }
  };
  useEffect(() => {
    getCategoryByKey();
  }, [hotel_tax_key, defaultValue]);

  useEffect(() => {
    loadHotelTax();
  }, []);

  const loadHotelTax = async () => {
    let res = await httpPostRequest(getHotelTax());
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultValue(
        res.data.map((v) => ({
          value: v[newConstants.TAX_RULE_KEY],
          label: v[newConstants.TAX_RULE_NAME],
        })),
      );
    }
  };

  const loadCateory = async (inputValue = '', callback = null) => {
    callback(defaultValue.filter((f) => f.value.includes(inputValue)));
  };

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultValue}
      value={value}
      loadOptions={loadCateory}
      onChange={(e) => onChange({ target: { value: e.value, name: name } })}
      placeholder={"Hotel tax rule"}
      helperText={helperText}
      error={error}
    />
  );
};
const TypeRates = ({ name, value, onChange, error, helperText, label, isDisabled }) => {
  const [defaultOptions, setDefaultOptions] = useState([
    { value: 'P', label: 'Percentage' },
    { value: 'F', label: 'Flat rate' }
  ]);

  return (
    <SingelSelectOnDemand
      defaultOptions={defaultOptions}
      value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
      name={name}
      isDisabled={isDisabled}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};
