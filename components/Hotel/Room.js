import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TextField, Text, Card, Row, Column, Loader, CustomAlert, SingelSelectOnDemand, DemandDropDown} from '../../core';
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
import { Delete, Edit } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import {
  getAllRoomCategoryY,
  getRoomCategoryByKey,
  getAllRooms,
  getRoomByKey,
  deleteRoom,
  updateRoom,
  createRoom,
} from '../../helper/RequestPayLoad';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from "../PrimaryContainer"
import LanguageConfig from "../../helper/LanguageConfig";


const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    width: '40%',
    margin: 5,
    backgroundColor: "rgb(26, 43, 71);",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71);",
    },
  },
  AddBtn: {
    padding: 10,
    backgroundColor: "rgb(26, 43, 71);",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71);",
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
    color: '#003399',
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
  tableHead: {
    backgroundColor: '#ffffff',
    borderBottom: '1.2px solid' + theme.palette.primary.main,
  },
  tableHeadTuple: {
    // color: theme.palette.primary.main,
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    textTransform: 'uppercase',
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
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const { setAlertMsg, formname } = useStore();
  const [deleteId, setDeleteId] = useState('');
  const [editData, setEditData] = useState(null);

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUM]: { is_hide: true, bool: true, label: <LanguageConfig id="managerooms.sno" /> },
    [newConstants.ROOM_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="managerooms.roomname" /> },
    [newConstants.ROOM_CATEGORY_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="managerooms.categoryname" /> },
    [newConstants.ROOM_MIN_PAX]: { is_hide: false, bool: true, label: <LanguageConfig id="managerooms.minpax" /> },
    [newConstants.ROOM_MAX_PAX]: { is_hide: false, bool: true, label: <LanguageConfig id="managerooms.maxpax" /> },
    [newConstants.ROOM_MIN_ADULTS]: { is_hide: true, bool: true, label: <LanguageConfig id="managerooms.minadult" /> },
    [newConstants.ROOM_MAX_ADULTS]: { is_hide: false, bool: true, label: <LanguageConfig id="managerooms.maxadult" /> },
    [newConstants.ROOM_MAX_CHILDS]: { is_hide: false, bool: true, label: <LanguageConfig id="managerooms.maxchilds" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="managerooms.lastupdatedby" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="managerooms.lastupdatedon" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="managerooms.action" /> }
  });

  const loadData = async () => {
    if (!addEdit) {
      setLoader(true);
      let res = await httpPostRequest(getAllRooms(search_key, (currIndex - 1) * pageSize + 1, pageSize));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setData(res[constants.DATA][newConstants.ROOM_CATEGORIES]);
        setLoader(false);
        setMaxPage(
          res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
            parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
            0
            ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
            : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
        );
      }else {
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
  const editRoomInfo = async (key) => {
    setAddEdit(false)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let res = await httpPostRequest(getRoomByKey(key));
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

  const delRoomInfo = async () => {
    if (deleteId != '') {
      const res = await httpPostRequest(deleteRoom(deleteId));
      setDeleteLoader(deleteId);
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setDeleteId('');
        setDeleteLoader('');
        loadData();
        setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });
      } else {
        setDeleteId('');
        setDeleteLoader('');
        setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
      }
    } else {
      setDeleteId('');
    }
  }

  return (
    <div>
       <Card margin={[0,0,10,0]}>
             {addEdit &&
          <Fade in={addEdit}>
            <EditContainer
              classes={classes}
              loadData={loadData}
              editData={editData}
              setEditData={setEditData}
              addEdit={addEdit}
              setAddEdit={setAddEdit}
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
        filter_object={newConstants.ROW_NUM}
        editRow={editRoomInfo}
        deleteRow={setDeleteId}
        action_key={newConstants.ROOM_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}
      >
        <CustomAlert
          message={<LanguageConfig id="managerooms.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delRoomInfo}
        />
 
      </PrimaryContainer>
    </div>
  );
}
const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit }) => {
  const [localFields, setLocalFields] = useState(null);
  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const { setAlertMsg } = useStore();
  const { languages ,copylanguages} = useStore();
  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.ROOM_NAME]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.ROOM_CATEGORY_NAME]: {
          value: '',
          is_require: false,
          error: false,
        },
        [newConstants.ROOM_CATEGORY_KEY]: {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ROOM_MIN_PAX]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.ROOM_MAX_PAX]: {
          value: '',
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.ROOM_MIN_ADULTS]: {
          value: '',
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.ROOM_MAX_ADULTS]: {
          value: '',
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.ROOM_MAX_CHILDS]: {
          value: '',
          is_require: true,
          error: false,
          type: 'number',
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
        [newConstants.LANGUAGE_DESC]:
        {
          value: val.label,
          is_require: true,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.ROOM_NAME]: {
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
    }
    else {
      setLocalFields({
        [newConstants.ROOM_CATEGORY_NAME]: {
          value: editData[newConstants.ROOM_CATEGORY_NAME],
          is_require: false,
          error: false,
        },
        [newConstants.ROOM_CATEGORY_KEY]: {
          value: editData[newConstants.ROOM_CATEGORY_KEY],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.ROOM_NAME]: {
          value: editData[newConstants.ROOM_NAME],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.ROOM_MIN_PAX]: {
          value: editData[newConstants.ROOM_MIN_PAX],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.ROOM_MAX_PAX]: {
          value: editData[newConstants.ROOM_MAX_PAX],
          is_require: true,
          error: false,
          type: 'price',
          err_msg: '',
        },
        [newConstants.ROOM_MIN_ADULTS]: {
          value: editData[newConstants.ROOM_MIN_ADULTS],
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.ROOM_MAX_ADULTS]: {
          value: editData[newConstants.ROOM_MAX_ADULTS],
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        [newConstants.ROOM_MAX_CHILDS]: {
          value: editData[newConstants.ROOM_MAX_CHILDS],
          is_require: true,
          error: false,
          type: 'number',
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
        [newConstants.LANGUAGE_DESC]:
        {
          value: val.label,
          is_require: true,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.ROOM_NAME]: {
          value: "",
          is_require: true,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))

      let room_lang_ = [];
      if (editData[newConstants.ROOM_LANGUAGES] && editData[newConstants.ROOM_LANGUAGES].length) {
        editData[newConstants.ROOM_LANGUAGES].forEach((value) => {
          room_lang_.push({
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: true,
              error: false,
              type: 'text',
              err_msg: '',
            },
            [newConstants.LANGUAGE_DESC]:{
              value: value[newConstants.LANGUAGE_DESC],
              is_require: true,
              error: false,
              type: 'text',
              err_msg: '',
            },
            [newConstants.ROOM_NAME]: {
              value: value[newConstants.ROOM_NAME],
              is_require: true,
              error: false,
              min_length: 2,
              max_length: null,
              type: 'text',
              err_msg: '',
            },
          });
        });
      } else {
        room_lang_.push(...Tab_multi);
      }
      setMultiLanguage(room_lang_.concat(Tab_multi.filter(f => !(room_lang_.map(v => v[newConstants.LANG_CODE].value).includes(f[newConstants.LANG_CODE].value)))))
    }
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

  const multiStateUpdater = (e, index) =>{
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
    let multi_lang_ = multi_language.filter(f => f[newConstants.ROOM_NAME].value != "")
    if (!localFields_validation.err) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createRoom(localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          loadData();
          setLoader(false);
          setAddEdit(false);
          setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(updateRoom(editData['room-key'], localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
          setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="managerooms.fillrequired" /> });
    }
  };

  return (
    <div>
      {localFields ? (
        <Row padding={[10]}>
          <Column>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="managerooms.roomname" />}
                  name={newConstants.ROOM_NAME}
                  value={localFields[newConstants.ROOM_NAME].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.ROOM_NAME].error}
                  helperText={
                    localFields[newConstants.ROOM_NAME].err_msg
                  }
                  required={localFields[newConstants.ROOM_NAME].is_require}
                />
              </Column>

              <Column md={3} padding={[10, 5]}>
                <RoomCategory
                  name={newConstants.ROOM_CATEGORY_KEY}
                  onChange={stateUpdater}
                  value={localFields[newConstants.ROOM_CATEGORY_KEY].value}
                  error={
                    localFields[newConstants.ROOM_CATEGORY_KEY].error &&
                    localFields[newConstants.ROOM_CATEGORY_KEY].is_require
                  }
                  helperText={
                    localFields[newConstants.ROOM_CATEGORY_KEY].error &&
                      localFields[newConstants.ROOM_CATEGORY_KEY].is_require
                      ? localFields[newConstants.ROOM_CATEGORY_KEY].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="managerooms.categoryname" />}
                />
              </Column>

              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="managerooms.roomminpax" />}
                  name={newConstants.ROOM_MIN_PAX}
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields[newConstants.ROOM_MIN_PAX].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.ROOM_MIN_PAX].error}
                  helperText={
                    localFields[newConstants.ROOM_MIN_PAX].err_msg
                  }
                  required={localFields[newConstants.ROOM_MIN_PAX].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="managerooms.roommaxpax" />}
                  name={newConstants.ROOM_MAX_PAX}
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields[newConstants.ROOM_MAX_PAX].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.ROOM_MAX_PAX].error}
                  helperText={
                    localFields[newConstants.ROOM_MAX_PAX].err_msg
                  }
                  required={localFields[newConstants.ROOM_MAX_PAX].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="managerooms.roomminadult" />}
                  name={newConstants.ROOM_MIN_ADULTS}
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields[newConstants.ROOM_MIN_ADULTS].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.ROOM_MIN_ADULTS].error
                  }
                  helperText={
                    localFields[newConstants.ROOM_MIN_ADULTS].err_msg
                  }
                  required={localFields[newConstants.ROOM_MIN_ADULTS].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="managerooms.roommaxadult" />}
                  name={newConstants.ROOM_MAX_ADULTS}
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields[newConstants.ROOM_MAX_ADULTS].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.ROOM_MAX_ADULTS].error
                  }
                  helperText={
                    localFields[newConstants.ROOM_MAX_ADULTS].err_msg
                  }
                  required={localFields[newConstants.ROOM_MAX_ADULTS].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="managerooms.roommaxchilds" />}
                  name={newConstants.ROOM_MAX_CHILDS}
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields[newConstants.ROOM_MAX_CHILDS].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.ROOM_MAX_CHILDS].error
                  }
                  helperText={'Incorrect entry.'}
                  required={localFields[newConstants.ROOM_MAX_CHILDS].is_require}
                />
              </Column>
              {editData ? (
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
                    label={<LanguageConfig id="managerooms.isactive" />}
                  />
                </Column>
              ) : (
                ''
              )}
              <Row>
                <Column md={6}>
                <LanguageContainer copylanguages={copylanguages} classes={classes} languages={languages} multi_language={multi_language} multiStateUpdater={multiStateUpdater} />
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
                            <LanguageConfig id={editData ? "managerooms.update" : "save"} />
                          </Column>
                        </Row>
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setAddEdit(false);
                          setEditData(null);
                        }}
                        className={classes.closeButton}
                        variant="contained">
                        <LanguageConfig id="managerooms.cancel" />
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

const RoomCategory = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);

  useEffect(() => {
    rooomCategoryByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadRoomCategory();
  }, []);

  const rooomCategoryByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(getRoomCategoryByKey(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.ROOM_CATEGORY_NAME],
          value: res[newConstants.DATA][newConstants.ROOM_CATEGORY_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadRoomCategory = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(getAllRoomCategoryY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.ROOM_CATEGORIES].map((v) => ({
            value: v[newConstants.ROOM_CATEGORY_KEY],
            label: v[newConstants.ROOM_CATEGORY_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.ROOM_CATEGORIES].map((v) => ({
            value: v[newConstants.ROOM_CATEGORY_KEY],
            label: v[newConstants.ROOM_CATEGORY_NAME],
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
      loadOptions={loadRoomCategory}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};



const LanguageContainer = ({ classes, multi_language, multiStateUpdater ,languages ,copylanguages}) => {

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
                              {/* <Text>{val[newConstants.LANGUAGE_DESC].value} {val[newConstants.LANG_CODE].value}</Text> */}
                              <Text>{languages.filter(f=>f.value==val[newConstants.LANG_CODE].value).length?languages.filter(f=>f.value==val[newConstants.LANG_CODE].value)[0].label:
                            copylanguages.filter(f=>f.value==val[newConstants.LANG_CODE].value)[0].label}</Text>
                            </TableCell>
                            <TableCell className={classes.tableBodyTuple}>
                              <TextField
                                label={"Room Name"}
                                type="text"
                                value={val[newConstants.ROOM_NAME].value}
                                name={newConstants.ROOM_NAME}
                                error={val[newConstants.ROOM_NAME].error}
                                onChange={(e) => multiStateUpdater(e, index)}
                                helperText={val[newConstants.ROOM_NAME].err_msg}
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