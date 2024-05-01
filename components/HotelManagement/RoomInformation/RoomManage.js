import React, { useState, useEffect, useRef } from 'react';
import { TextField, Text, Card, Row, Column, Loader, CustomAlert, SingelSelectOnDemand, DemandDropDown} from  "../../../Core";
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
import { useStore } from '../../../helper/Store';
import { validator, httpPostRequest } from '../../../helper/JsHelper';
import {
  getAllRoomCategoryY,
  getRoomCategoryByKey,
  getAllRooms,
  getRoomByKey,
  deleteRoom,
  updateRoom,
  createRoom,
} from '../../../helper/RequestPayLoad';
import { constants, newConstants } from '../../../helper/constants';
import PrimaryContainer from "../../PrimaryContainer"
import LanguageConfig from "../../../helper/LanguageConfig";


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
  Bold: {
    fontWeight: 'bold',
  },
  Languageheadernow: {fontSize: '30px', marginBottom: '11px',},
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

const RoomManage=({manageRoom,setManageroom,loadRooms})=> {
  const classes = useStyles();

  return (
    <div>
       <Card margin={[0,0,10,0]}>            
          <Fade >
            <EditContainer
              classes={classes}
              manageRoom={manageRoom} setManageroom={setManageroom} loadRooms={loadRooms}
            />
          </Fade>       
        </Card>
    </div>
  );
}
const EditContainer = ({ classes,manageRoom,setManageroom,loadRooms}) => {
  const [localFields, setLocalFields] = useState(null);
  const [loader, setLoader] = useState(false);
  const { setAlertMsg } = useStore();
  useEffect(() => {   
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
    
  }, []);

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

  

  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    if (!localFields_validation.err) {
      setLoader(true);
        let res = await httpPostRequest(createRoom(localFields, []));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {         
          setLoader(false);
          setManageroom(false)
          loadRooms()
          setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
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
                            <LanguageConfig id={"save"} />
                          </Column>
                        </Row>
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          setManageroom(false);
                          // setEditData(null);
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
export default RoomManage


