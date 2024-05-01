import React, { useState, useEffect, useMemo  } from 'react';
import { TextField, Text, Card, Row, Column, Loader, CustomAlert, SingelSelectOnDemand } from '../../core';
import {
  Fade, 
  Button,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest ,getDateYYYYMMDD} from '../../helper/JsHelper';
import {
  hotelMasterGetId,
  hotelMasterGetY,
  getAllRooms,
  createRoomNightSetup,
  updateRoomNightSetup,
  deleteRoomNightSetup,
  getAllRoomNightSetup,
  getRoomNightSetupByKey,
  getRoomPlanPriceKey,
  getRoomPlanByKey,
  getAllRoomPlan,
  GetRoomByHotelKey
} from '../../helper/RequestPayLoad';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from "../PrimaryContainer"
import LanguageConfig from "../../helper/LanguageConfig"


const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  addEdit: {
    marginLeft: 4,
    marginRight: 4,
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
    [theme.breakpoints.down('xs')]: {
      alignContent: 'end',
      padding: 6,
    },
  },
  Bold: {
    fontWeight: 'bold',
  },
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg, formname } = useStore();
  const [deleteId, setDeleteId] = useState('');

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: <LanguageConfig id="roomnightsetup.sno" /> },
    [newConstants.HOTEL_NAME]: { is_hide: true, bool: true, label: <LanguageConfig id="roomnightsetup.hotelname" /> },
    [newConstants.ROOM_NAME]: { is_hide: true, bool: true, label: <LanguageConfig id="roomnightsetup.roomname" /> },
    [newConstants.ROOM_PLAN_NAME]: { is_hide: true, bool: true, label: <LanguageConfig id="roomnightsetup.roomplanname" /> },
    ['room-night']: { bool: true, label: <LanguageConfig id="roomnightsetup.roomnight" /> },
    ['is-daterange']: { bool: true, label: <LanguageConfig id="roomnightsetup.isdaterange" /> },
    ['effective-from']: { bool: true, label: <LanguageConfig id="roomnightsetup.effectivefrom" /> },
    ['effective-to']: { bool: true, label: <LanguageConfig id="roomnightsetup.effectiveto" /> },
    ['is-all-days-in-week']: { bool: true, label: <LanguageConfig id="roomnightsetup.isalldaysinweek" /> },
    ['is-sunday']: { bool: true, label: <LanguageConfig id="roomnightsetup.issunday" /> },
    ['is-monday']: { bool: true, label: <LanguageConfig id="roomnightsetup.ismonday" /> },
    ['is-tuesday']: { bool: true, label: <LanguageConfig id="roomnightsetup.istuesday" /> },
    ['is-wednesday']: { bool: true, label: <LanguageConfig id="roomnightsetup.iswednesday" /> },
    ['is-thursday']: { bool: true, label: <LanguageConfig id="roomnightsetup.isthursday" /> },
    ['is-friday']: { bool: true, label: <LanguageConfig id="roomnightsetup.isfriday" /> },
    ['is-saturday']: { bool: true, label: <LanguageConfig id="roomnightsetup.issaturday" /> },
    ['active-status']: { bool: true, label: <LanguageConfig id="roomnightsetup.status" /> },
    ['last-update-by']: { bool: true, label: <LanguageConfig id="roomnightsetup.lastupdatedby" /> },
    ['last-update-on']: { bool: true, label: <LanguageConfig id="roomnightsetup.lastupdatedon" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="roomnightsetup.action" /> }
  });
  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getAllRoomNightSetup(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.DTO_MASTER_ROOM_NIGHT_SETUPS_GRID]);
      setLoader(false);
      setMaxPage(
        res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
          parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
          0
          ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
          : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
      );
    }
    else {
      setLoader(false);
      setCurrIndex(1);
      setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  
  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };
  const editRoomNightSetup = async (key) => {
    setAddEdit(false);
    let res = await httpPostRequest(getRoomNightSetupByKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    else{
      setAddEdit(false);
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  const delRoomNightSetup = async () => {
    if (deleteId != '') {
      const res = await httpPostRequest(deleteRoomNightSetup(deleteId));
      setDeleteLoader(deleteId);
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setDeleteId('');
        setDeleteLoader('');
        loadData();
        setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg});
      } else {
        setDeleteId('');
        setDeleteLoader('');
        setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
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
              editData={editData}
              setEditData={setEditData}
              languages={languages}
              setAlertMsg={setAlertMsg}
              addEdit={addEdit}
              setAddEdit={setAddEdit}
              classes={classes}
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
        editRow={editRoomNightSetup}
        deleteRow={setDeleteId}
        action_key={'room-night-setup-key'}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="roomnightsetup.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delRoomNightSetup}
        />
        
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit, languages, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [loader, setLoader] = useState(false);
  const [hotelname, setHotelname] = useState(editData ? editData[newConstants.HOTEL_KEY] : "")
  const [room,setRoom]=useState([])
  const [roomplans,setRoomplans]=useState([])
  const [roomname, setRoomname] = useState(editData ? editData[newConstants.ROOM_KEY] : "")

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        'hotel-key': {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        'room-key': {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        'room-plan-key': {
          value: '',
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        'room-night': {
          value: '',
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        'is-daterange': {
          value: true,
          is_require: true,
          error: false,
        },
        'effective-from': {
          value: '',
          is_require: true,
          error: false,
        },
        'effective-to': {
          value: '',
          is_require: true,
          error: false,
        },
        'is-overwrite': {
          value: true,
          is_require: true,
          error: false,
        },
        'is-all-days-in-week': {
          value: true,
          is_require: false,
          error: false,
        },
        'is-sunday': {
          value: true,
          is_require: false,
          error: false,
        },
        'is-monday': {
          value: true,
          is_require: false,
          error: false,
        },
        'is-tuesday': {
          value: true,
          is_require: false,
          error: false,
        },
        'is-wednesday': {
          value: true,
          is_require: false,
          error: false,
        },
        'is-thursday': {
          value: true,
          is_require: false,
          error: false,
        },
        'is-friday': {
          value: true,
          is_require: false,
          error: false,
        },
        'is-saturday': {
          value: true,
          is_require: false,
          error: false,
        },
      });
    } else {
      setLocalFields({
        'hotel-key': {
          value: editData['hotel-key'],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        'room-key': {
          value: editData['room-key'],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        'room-plan-key': {
          value: editData['room-plan-key'],
          is_require: true,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        'room-night': {
          value: editData['room-night'],
          is_require: true,
          error: false,
          type: 'number',
          err_msg: '',
        },
        'is-daterange': {
          value: editData['is-daterange'],
          is_require: true,
          error: false,
        },
        'effective-from': {
          value: getDateYYYYMMDD(editData['effective-from']),
          is_require: true,
          error: false,
        },
        'effective-to': {
          value: getDateYYYYMMDD(editData['effective-to']),
          is_require: true,
          error: false,
        },
        'is-overwrite': {
          value: editData['is-overwrite'],
          is_require: true,
          error: false,
        },
        'is-all-days-in-week': {
          value: editData['is-all-days-in-week'],
          is_require: false,
          error: false,
        },
        'is-sunday': {
          value: editData['is-sunday'],
          is_require: false,
          error: false,
        },
        'is-monday': {
          value: editData['is-monday'],
          is_require: false,
          error: false,
        },
        'is-tuesday': {
          value: editData['is-tuesday'],
          is_require: false,
          error: false,
        },
        'is-wednesday': {
          value: editData['is-wednesday'],
          is_require: false,
          error: false,
        },
        'is-thursday': {
          value: editData['is-thursday'],
          is_require: false,
          error: false,
        },
        'is-friday': {
          value: editData['is-friday'],
          is_require: false,
          error: false,
        },
        'is-saturday': {
          value: editData['is-saturday'],
          is_require: false,
          error: false,
        },
        'is-active': {
          value: editData['is-active'],
          is_require: true,
          error: false,
        },
      });
    }
  }, [editData]);

  const RoomKeyApi = async (hotelname) => {
    let res = await httpPostRequest(GetRoomByHotelKey(hotelname));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setRoom(res[newConstants.DATA][newConstants.ROOM_CATEGORIES])
    }
    else {
      setRoom([])
      setAlertMsg({ type: 'error', msg: res[newConstants.DATA_EXCEPTION].err_msg });
    }
  }

  useEffect(() => {
    if (hotelname) {
      RoomKeyApi(hotelname)
    }
  }, [hotelname])

  const RoomPlanKey = async (roomname, hotelname) => {
    let res = await httpPostRequest(getRoomPlanPriceKey(roomname, hotelname));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setRoomplans(res[newConstants.DATA][newConstants.ROOM_PLANS])
    }
    else {
        setRoomplans([])
        setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
    }
}


useEffect(() => {
    if (roomname.length && hotelname.length) {
        RoomPlanKey(roomname, hotelname)
    }
}, [roomname, hotelname])

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
      if (editData == null) {
        let res = await httpPostRequest(createRoomNightSetup(localFields));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {

          setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg }); loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(updateRoomNightSetup(editData['room-night-setup-key'], localFields));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {

          setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg }); loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="roomnightsetup.fillrequired" /> });
    }
  };

  return (
    <div>
      {localFields.hasOwnProperty([newConstants.ROOM_NIGHT]) ? (
        <Row padding={[10]}>
          <Column>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="number"
                  label={<LanguageConfig id="roomnightsetup.roomnight" />}
                  name="room-night"
                  inputProps={{ min: 1 }}
                  value={localFields['room-night'].value}
                  onChange={stateUpdater}
                  error={localFields['room-night'].error}
                  helperText={localFields['room-night'].err_msg}
                  required={localFields['room-night'].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <HotelName
                  name="hotel-key"
                  value={localFields['hotel-key'].value}
                  onChange={(e) => {
                    setHotelname(e.target.value)
                    stateUpdater(e)
                  }}
                  error={localFields['hotel-key'].error && localFields['hotel-key'].is_require}
                  helperText={localFields['hotel-key'].error ? localFields['hotel-key'].err_msg : ''}
                  label={<LanguageConfig id="roomnightsetup.hotelname" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <RoomName
                  room={room}
                  name="room-key"
                  value={localFields['room-key'].value}
                  onChange={(e) => {
                    setRoomname(e.target.value)
                    stateUpdater(e)
                  }}
                  error={localFields['room-key'].error && localFields['room-key'].is_require}
                  helperText={
                    localFields['room-key'].error && localFields['room-key'].is_require
                      ? localFields['room-key'].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="roomnightsetup.roomname" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <RoomPlan
                  roomplans={roomplans}
                  name="room-plan-key"
                  value={localFields['room-plan-key'].value}
                  onChange={stateUpdater}
                  error={localFields['room-plan-key'].error && localFields['room-plan-key'].is_require}
                  helperText={
                    localFields['room-plan-key'].error && localFields['room-plan-key'].is_require
                      ? localFields['room-plan-key'].err_msg
                      : ''
                  }
                  label={<LanguageConfig id="roomnightsetup.roomplanname" />}
                />
              </Column>

              <Column md={3} padding={[10, 5]}>
                <TextField
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="effective-from"
                  disabled={localFields['is-daterange'].value==1?false:true}
                  value={localFields['is-daterange'].value==1?localFields['effective-from'].value:localFields['effective-from'].value=""}
                  onChange={stateUpdater}
                  error={localFields['effective-from'].error}
                  helperText={'Incorrect entry.'}
                  required={localFields['effective-from'].is_require}
                  label={<LanguageConfig id="roomnightsetup.effectivefrom" />}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="date"
                  disabled={localFields['is-daterange'].value==1?false:true}
                  label={<LanguageConfig id="roomnightsetup.effectiveto" />}
                  name="effective-to"
                  value={localFields['is-daterange'].value==1?localFields['effective-to'].value:localFields['effective-to'].value=""}
                  onChange={stateUpdater}
                  error={localFields['effective-to'].error}
                  helperText={'Incorrect entry.'}
                  required={localFields['effective-to'].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 20]} center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={localFields['is-daterange'].value}
                      color="primary"
                      onChange={() =>
                        setLocalFields({
                          ...localFields,
                          'is-daterange': {
                            ...localFields['is-daterange'],
                            value: !localFields['is-daterange'].value,
                          },
                        })
                      }
                      name="is-daterange"
                    />
                  }
                  label="Is Date Range"
                />
              </Column>
              {editData ? (
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields['is-active'].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            'is-active': {
                              ...localFields['is-active'],
                              value: !localFields['is-active'].value,
                            },
                          })
                        }
                        name="is-active"
                      />
                    }
                    label={<LanguageConfig id="roomnightsetup.isactive" />}
                  />
                </Column>
              ) : null}

              <Row>
                <Column>
                  <Text size={14} bold style={{ margin: 10 }}>
                    {<LanguageConfig id="roomnightsetup.selectdays" />}
                  </Text>
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields['is-all-days-in-week'].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            'is-all-days-in-week': {
                              ...localFields['is-all-days-in-week'],
                              value: !localFields['is-all-days-in-week'].value,
                            },
                          })
                        }
                        name="is-all-days-in-week"
                      />
                    }
                    label={<LanguageConfig id="roomnightsetup.isalldaysinweek" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields['is-all-days-in-week'].value?localFields['is-sunday'].value=true:localFields['is-sunday'].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            'is-sunday': {
                              ...localFields['is-sunday'],
                              value: !localFields['is-sunday'].value,
                            },
                          })
                        }
                        name="is-sunday"
                      />
                    }
                    label={<LanguageConfig id="roomnightsetup.sunday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields['is-all-days-in-week'].value?localFields['is-monday'].value=true:localFields['is-monday'].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            'is-monday': {
                              ...localFields['is-monday'],
                              value: !localFields['is-monday'].value,
                            },
                          })
                        }
                        name="is-monday"
                      />
                    }
                    label={<LanguageConfig id="roomnightsetup.monday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields['is-all-days-in-week'].value?localFields['is-tuesday'].value=true:localFields['is-tuesday'].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            'is-tuesday': {
                              ...localFields['is-tuesday'],
                              value: !localFields['is-tuesday'].value,
                            },
                          })
                        }
                        name="is-tuesday"
                      />
                    }
                    label={<LanguageConfig id="roomnightsetup.tuesday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields['is-all-days-in-week'].value?localFields['is-wednesday'].value=true:localFields['is-wednesday'].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            'is-wednesday': {
                              ...localFields['is-wednesday'],
                              value: !localFields['is-wednesday'].value,
                            },
                          })
                        }
                        name="is-wednesday"
                      />
                    }
                    label={<LanguageConfig id="roomnightsetup.wednesday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields['is-all-days-in-week'].value?localFields['is-thursday'].value=true:localFields['is-thursday'].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            'is-thursday': {
                              ...localFields['is-thursday'],
                              value: !localFields['is-thursday'].value,
                            },
                          })
                        }
                        name="is-thursday"
                      />
                    }
                    label={<LanguageConfig id="roomnightsetup.thursday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields['is-all-days-in-week'].value?localFields['is-friday'].value=true:localFields['is-friday'].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            'is-friday': {
                              ...localFields['is-friday'],
                              value: !localFields['is-friday'].value,
                            },
                          })
                        }
                        name="is-friday"
                      />
                    }
                    label={<LanguageConfig id="roomnightsetup.friday" />}
                  />
                </Column>
                <Column md={3} padding={[10, 20]} center>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={localFields['is-all-days-in-week'].value?localFields['is-saturday'].value=true:localFields['is-saturday'].value}
                        color="primary"
                        onChange={() =>
                          setLocalFields({
                            ...localFields,
                            'is-saturday': {
                              ...localFields['is-saturday'],
                              value: !localFields['is-saturday'].value,
                            },
                          })
                        }
                        name="is-saturday"
                      />
                    }
                    label={<LanguageConfig id="roomnightsetup.saturday" />}
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
                            <LanguageConfig id={editData ? "roomnightsetup.update" : "save"} />
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
                        <LanguageConfig id="roomnightsetup.cancel" />
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

const RoomName = ({ name, value, onChange, error, helperText, label, room, isDisabled }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  useEffect(() => {
    setDefaultOptions(
      room.map((v) => ({
        value: v[newConstants.ROOM_KEY],
        label: v[newConstants.ROOM_NAME],
      }))
    )
  }, [room, value]);



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


const HotelName = ({ name, value, onChange, error, helperText, label }) => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [selectValue, setSetectedValue] = useState(null);
  useEffect(() => {
    hotelByKey();
  }, [value, defaultOptions]);
  useEffect(() => {
    loadHotel();
  }, []);

  const hotelByKey = async () => {
    if (value && defaultOptions.length > 0 && defaultOptions.filter((f) => f.value == value).length == 0) {
      const res = await httpPostRequest(hotelMasterGetId(value));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setSetectedValue({
          label: res[newConstants.DATA][newConstants.HOTEL_NAME],
          value: res[newConstants.DATA][newConstants.HOTEL_KEY],
        });
      }
    } else {
      setSetectedValue(defaultOptions.filter((f) => f.value == value)[0]);
    }
  };

  const loadHotel = async (inputValue = '', callback = null) => {
    const res = await httpPostRequest(hotelMasterGetY(inputValue));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      if (callback) {
        callback(
          res[newConstants.DATA][newConstants.HOTELS].map((v) => ({
            value: v[newConstants.HOTEL_KEY],
            label: v[newConstants.HOTEL_NAME],
          })),
        );
      } else {
        setDefaultOptions(
          res[newConstants.DATA][newConstants.HOTELS].map((v) => ({
            value: v[newConstants.HOTEL_KEY],
            label: v[newConstants.HOTEL_NAME],
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
      loadOptions={loadHotel}
      onChange={(e) => onChange({ target: { name: name, value: e.value } })}
      placeholder={label}
      helperText={helperText}
      error={error}
    />
  );
};

const RoomPlan = ({ name, value, onChange, error, helperText, label ,roomplans}) => {
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
      loadStockName()
  }, [roomplans]);

  const loadStockName = () => {
      setDefaultOptions(
          roomplans.map((v) => ({
              value: v[newConstants.ROOM_PLAN_KEY],
              label: v[newConstants.ROOM_PLAN_NAME],
          }))
      )
  }


  return (
      <SingelSelectOnDemand
          defaultOptions={defaultOptions}
          value={defaultOptions.filter((f) => f.value == value).length ? defaultOptions.filter((f) => f.value == value)[0] : null}
          name={name}
          loadOptions={loadStockName}
          onChange={(e) => onChange({ target: { name: name, value: e.value } })}
          placeholder={label}
          helperText={helperText}
          error={error}
      />
  );
};
