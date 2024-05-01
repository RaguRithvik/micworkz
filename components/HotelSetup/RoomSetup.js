import React, { useState, useEffect, useMemo } from 'react';
import { Text, Card, Row, Column, TextArea, Loader, Glyphi, CustomAlert, ImageUpload } from '../../core';
import {
  AppBar,
  Toolbar,
  Fade,
  InputLabel,
  InputBase,
  TextField,
  Select,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { Search, Create, Delete, Add, Remove, ChevronLeft, ChevronRight } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest, httpGetRequest } from '../../helper/JsHelper';
import {
  getAllRoomCategory,
  getAllRooms,
  getRoomByKey,
  deleteRoom,
  updateRoom,
  createRoom,
} from '../../helper/RequestPayLoad';
import { constants, newConstants } from '../../helper/constants';
var FA = require('react-fontawesome');

const BootstrapInput = withStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 60,
  },
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    width: '40%',
    margin: 5,
    backgroundColor:"#3c3c7b",
    color:"white",
    '&:hover': {
      backgroundColor:"#3c3c7b",
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
    backgroundColor: '#003399',
  },
  tableHeadTuple: {
    color: '#ffffff',
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
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const { languages, setAlertMsg } = useStore();
  const [deleteId, setDeleteId] = useState('');
  const [editData, setEditData] = useState(null);
  const [hotels, setHotels] = useState([{ value: 'newhotel', label: 'MANUAL ENTRY' }]);
  const [rooms, setRooms] = useState([{ value: 'newroom', label: 'MANUAL ENTRY' }]);

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    room_name: true,
    category_name: true,
    min_pax: true,
    max_pax: true,
    min_adults: true,
    max_adults: true,
    max_childs: true,
    status: true,
    last_updated_by: true,
    last_updated_on: true,
  });

  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getAllRooms(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      let res_room_cat = await httpPostRequest(getAllRoomCategory());
      if (
        res_room_cat &&
        res_room_cat[constants.DATA_EXCEPTION] &&
        res_room_cat[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200
      ) {
        setRoomCategory(
          res_room_cat[constants.DATA][newConstants.ROOM_CATEGORIES].map((value) => ({
            'room-category-key': value['room-category-key'],
            'room-category-name': value['room-category-name'],
          })),
        );
      }
      setData(res[constants.DATA][newConstants.ROOM_CATEGORIES]);
      setLoader(false);
      setMaxPage(
        res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
          parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
          0
          ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
          : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
      );
    } else if (res[constants.DATA][newConstants.ROOM_CATEGORIES].length == 0) {
      setLoader(false);
      setAlertMsg({ type: 'info', msg: 'Nothing Found, Try Diffrent Keywords' });
    } else {
      setLoader(false);
      setAlertMsg({ type: 'error', msg: 'Please try again later.' });
    }
  };
  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  const nextPage = () => {
    if (currIndex + 1 <= maxPage) {
      setCurrIndex(currIndex + 1);
    }
  };
  const previousPage = () => {
    if (currIndex - 1 !== 0) {
      setCurrIndex(currIndex - 1);
    }
  };
  const filter_data = data
    .map((value, index) =>
      (currIndex - 1) * pageSize <= value[newConstants.ROW_NUM] - 1 && currIndex * pageSize > value[newConstants.ROW_NUM] - 1
        ? value
        : null,
    )
    .filter((f) => f != null);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };
  const editRoomInfo = async (key) => {
    let res = await httpPostRequest(getRoomByKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
    }
    setAddEdit(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const delRoomInfo = async () => {
    if (deleteId != '') {
      const res = await httpPostRequest(deleteRoom(deleteId));
      setDeleteLoader(deleteId);
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setDeleteId('');
        setDeleteLoader('');
        loadData();
      } else {
        setDeleteId('');
        setDeleteLoader('');
        setAlertMsg({ type: 'error', msg: 'Please try again later.' });
      }
    } else {
      setDeleteId('');
    }
  };
  const updateShowCol = (e) => {
    setShowCol({ ...showCol, [e.target.name]: e.target.checked });
  };

  return (
    <div>
      <AppBar position="static" elevation={0} className={classes.headerName}>
        <Toolbar variant="dense">
          <Text variant="h4" color="inherit">
            Manage Rooms
          </Text>
        </Toolbar>
      </AppBar>
      <Card noShadow>
        <CustomAlert
          message={'Are you sure, you are deleting a recoard.'}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delRoomInfo}
        />
        <Row>
          {addEdit ? (
            <Column padding={[10]}>
              <Fade in={addEdit}>
                <EditContainer
                  classes={classes}
                  loadData={loadData}
                  editData={editData}
                  setEditData={setEditData}
                  addEdit={addEdit}
                  setAddEdit={setAddEdit}
                  roomCategory={roomCategory}
                />
              </Fade>
            </Column>
          ) : null}
          <Column left center padding={[10]} md={6} xs={6} sm={6}>
            <FormControl className={classes.margin}>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={['']}
                multiple={true}
                label={'Select Column To Hide'}
                input={<BootstrapInput />}>
                <MenuItem value={''}>Select Column to Hide</MenuItem>
                <FormGroup>
                  {Object.keys(showCol).map((key) => (
                    <FormControlLabel
                      className={classes.columnCheck}
                      control={<Checkbox checked={showCol[key]} onChange={updateShowCol} name={key} />}
                      label={key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    />
                  ))}
                </FormGroup>
              </Select>
            </FormControl>
          </Column>
          {!addEdit ? (
            <Column right center padding={[10]} md={6} xs={6} sm={6}>
              <Button variant="contained" color="primary" className={classes.addButton} onClick={() => setAddEdit(true)}>
                Add
              </Button>
            </Column>
          ) : null}

          <Column>
            <Row>
              <Column md={6} xs={12} sm={6} padding={[5, 10, 5, 13]}>
                <Row middle>
                  <Text size={14} bold style={{ marginRight: 5 }}>
                    Show
                  </Text>
                  <FormControl className={classes.margin}>
                    <Select
                      labelId="demo-customized-select-label"
                      id="demo-customized-select"
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value)}
                      label={'Select Column To Hide'}
                      input={<BootstrapInput />}>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={30}>30</MenuItem>
                    </Select>
                  </FormControl>
                  <Text size={14} medium style={{ marginLeft: 5 }}>
                    Entries
                  </Text>
                </Row>
              </Column>
              <Column center md={6} xs={12} sm={6} padding={[5]} className={classes.searchCol}>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <Search />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    value={search_key}
                    onChange={search}
                  />
                </div>
              </Column>
            </Row>
          </Column>
          <Column>
            <TableContainer component={Paper}>
              <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell className={classes.tableHeadTuple} style={{ minWidth: 50 }}>
                      SNo.
                    </TableCell>
                    {showCol.room_name ? <TableCell className={classes.tableHeadTuple}>Room Name</TableCell> : null}
                    {showCol.category_name ? <TableCell className={classes.tableHeadTuple}>Category Name</TableCell> : null}
                    {showCol.min_pax ? <TableCell className={classes.tableHeadTuple}>Min Pax</TableCell> : null}
                    {showCol.max_pax ? <TableCell className={classes.tableHeadTuple}>Max Pax</TableCell> : null}
                    {showCol.min_adults ? <TableCell className={classes.tableHeadTuple}>Min Adults</TableCell> : null}
                    {showCol.max_adults ? <TableCell className={classes.tableHeadTuple}>Max Adults</TableCell> : null}
                    {showCol.max_childs ? <TableCell className={classes.tableHeadTuple}>Max Childs</TableCell> : null}
                    {showCol.status ? <TableCell className={classes.tableHeadTuple}>Status</TableCell> : null}
                    {showCol.last_updated_by ? (
                      <TableCell className={classes.tableHeadTuple}>Last Updated By</TableCell>
                    ) : null}
                    {showCol.last_updated_on ? (
                      <TableCell className={classes.tableHeadTuple}>Last Updated On</TableCell>
                    ) : null}
                    <TableCell className={classes.tableHeadTuple} align="center" style={{ minWidth: 200 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                {loader ? (
                  <TableBody>
                    <TableRow>
                      <TableCell scope="row" align="center" colSpan={8} rowSpan={2}>
                        <Loader size={25} color={'primary'} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {filter_data.length > 0 ? (
                      filter_data.map((res, index) => (
                        <TableRow key={index + '_category'}>
                          <TableCell>{res['row-num']}</TableCell>
                          {showCol.room_name ? <TableCell>{res['room-name']}</TableCell> : null}
                          {showCol.category_name ? <TableCell>{res['room-category-name']}</TableCell> : null}
                          {showCol.min_pax ? <TableCell>{res['room-min-pax']}</TableCell> : null}
                          {showCol.max_pax ? <TableCell>{res['room-max-pax']}</TableCell> : null}
                          {showCol.min_adults ? <TableCell>{res['room-min-adults']}</TableCell> : null}
                          {showCol.max_adults ? <TableCell>{res['room-max-adults']}</TableCell> : null}
                          {showCol.max_childs ? <TableCell>{res['room-max-childs']}</TableCell> : null}
                          {showCol.status ? <TableCell>{res['active-status']}</TableCell> : null}
                          {showCol.last_updated_by ? <TableCell>{res['last-update-by']}</TableCell> : null}
                          {showCol.last_updated_on ? <TableCell>{res['last-update-on']}</TableCell> : null}
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              className={classes.actionButton}
                              onClick={() => editRoomInfo(res['room-key'])}>
                              <Create />
                            </Button>

                            <Button
                              variant="contained"
                              color="default"
                              size="small"
                              onClick={() => setDeleteId(res['room-key'])}
                              className={classes.actionButtonDelete}>
                              {deleteLoader ? <Loader size={14} color={'primary'} /> : <Delete />}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell scope="row">
                          <Text medium size={14}>
                            {'No recoard Found.'}
                          </Text>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Column>
          <Column>
            <Row margin={[10, 5]}>
              <Column md={9} xs={7} sm={7} center bold padding={[0, 10]}>
                <Text medium size={16}>
                  <span className={classes.Bold}> {currIndex}</span> of
                  <span className={classes.Bold}> {maxPage}</span>
                </Text>
              </Column>
              <Column md={3} xs={5} sm={5} padding={[0, 10]}>
                <Row middle bottom>
                  <Button onClick={previousPage} variant="text" color="primary" disabled={currIndex - 1 == 0 ? true : false}>
                    <ChevronLeft />
                  </Button>
                  <Text bold size={17} className={classes.currentPage}>
                    {currIndex}
                  </Text>
                  <Button
                    onClick={nextPage}
                    variant="text"
                    color="primary"
                    disabled={currIndex + 1 == maxPage + 1 ? true : false}>
                    <ChevronRight />
                  </Button>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      </Card>
    </div>
  );
}
const EditContainer = ({ classes, loadData, editData, setEditData, addEdit, setAddEdit, roomCategory, hotels, rooms }) => {
  const [localFields, setLocalFields] = useState(null);
  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const { languages, setAlertMsg } = useStore();

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        'room-name': {
          value: '',
          is_require: true,
          error: false,
        },
        'room-category-name': {
          value: '',
          is_require: false,
          error: false,
        },
        'room-category-key': {
          value: '',
          is_require: true,
          error: false,
        },
        'room-min-pax': {
          value: '',
          is_require: true,
          error: false,
        },
        'room-max-pax': {
          value: '',
          is_require: true,
          error: false,
        },
        'room-min-adults': {
          value: '',
          is_require: true,
          error: false,
        },
        'room-max-adults': {
          value: '',
          is_require: true,
          error: false,
        },
        'room-max-childs': {
          value: '',
          is_require: true,
          error: false,
        },
      });
      setMultiLanguage([
        {
          'lang-code': {
            value: '',
            is_require: false,
            error: false,
          },
          'room-name': {
            value: '',
            is_require: false,
            error: false,
          },
        },
      ]);
    } else {
      setLocalFields({
        'room-key': {
          value: editData['room-key'],
          is_require: true,
          error: false,
        },
        'room-category-name': {
          value: '',
          is_require: false,
          error: false,
        },
        'room-category-key': {
          value: '',
          is_require: true,
          error: false,
        },
        'room-name': {
          value: editData['room-name'],
          is_require: true,
          error: false,
        },
        'room-min-pax': {
          value: editData['room-min-pax'],
          is_require: true,
          error: false,
        },
        'room-max-pax': {
          value: editData['room-max-pax'],
          is_require: true,
          error: false,
        },
        'room-min-adults': {
          value: editData['room-min-adults'],
          is_require: true,
          error: false,
        },
        'room-max-adults': {
          value: editData['room-max-adults'],
          is_require: true,
          error: false,
        },
        'room-max-childs': {
          value: editData['room-max-childs'],
          is_require: true,
          error: false,
        },
        'is-active': {
          value: editData['is-active'],
          is_require: false,
          error: false,
        },
      });

      let room_lang_ = [];
      if (editData['room-languages'] && editData['room-languages'].length) {
        editData['room-languages'].forEach((value) => {
          room_lang_.push({
            'lang-code': {
              value: value['lang-code'],
              is_require: false,
              error: false,
            },
            'room-name': {
              value: value['room-name'],
              is_require: false,
              error: false,
            },
          });
        });
      } else {
        room_lang_.push({
          'lang-code': {
            value: editData['lang-code'],
            is_require: false,
            error: false,
          },
          'room-name': {
            value: editData['room-name'],
            is_require: false,
            error: false,
          },
        });
      }
      setMultiLanguage(room_lang_);
    }
  }, [editData]);
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

  function languageStateUpdater(e, index) {
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

  function removeMultiLanguage(index_) {
    let multi_language_ = _.cloneDeep(multi_language);
    if (multi_language_.length > 1) {
      multi_language_ = multi_language_.map((val, index) => (index != index_ ? val : null));
      setMultiLanguage(multi_language_.filter((f) => f != null));
    }
  }

  const addMultiLanguage = () => {
    let multi_language_ = _.cloneDeep(multi_language);
    if (
      languages.filter((f) => !multi_language.map((val) => val['lang-code'].value).includes(f.code)).length &&
      multi_language.length < languages.length
    ) {
      multi_language_.push({
        'room-name': {
          value: '',
          is_require: false,
          error: false,
        },
        'lang-code': {
          value: '',
          is_require: false,
          error: false,
        },
      });
      setMultiLanguage(multi_language_);
    }
  };

  const save = async () => {
    let multi_language_validator = _.cloneDeep(multi_language);
    multi_language_validator = multi_language_validator.map((value) => validator(value));

    if (multi_language_validator.filter((f) => f.err == true).length) {
      setMultiLanguage(multi_language_validator.map((value) => value.values));
    }

    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }

    if (!localFields_validation.err && multi_language_validator.filter((f) => f.err).length == 0) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createRoom(localFields, multi_language));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: 'Try again later.' });
        }
      } else {
        let res = await httpPostRequest(updateRoom(editData['room-key'], localFields, multi_language));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: 'Try again later.' });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: 'Please fill all the require fileds.' });
    }
  };

  return (
    <div>
      {localFields ? (
        <Row padding={[10]}>
          <Column padding={[8]}>
            <Text bold size={16}>
              {editData ? 'Edit Room Information ' : 'Add Room Information '}
            </Text>
          </Column>
          <Column>
            <Row>
              <Column md={6} padding={[10, 5]}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="hotels-id">Hotels</InputLabel>
                  <Select
                    size="small"
                    labelId="hotels"
                    id="hotels"
                    name={'hotels'}
                    value={'hotels'}
                    onChange={(e) => console.log(e)}
                    label="Hotels">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {hotels.map((value, index) => (
                      <MenuItem key={'hotels_' + index} value={value.value}>
                        {value.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Column>
              <Column md={6} padding={[10, 5]}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="rooms-id">Rooms</InputLabel>
                  <Select
                    size="small"
                    labelId="rooms"
                    id="rooms"
                    name={'rooms'}
                    value={'rooms'}
                    onChange={(e) => console.log(e)}
                    label="Rooms">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {rooms.map((value, index) => (
                      <MenuItem key={'hotels_' + index} value={value.value}>
                        {value.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Column>

              <Column md={6} padding={[10, 5]}>
                <ImageUpload label="Image Upload" />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="room-min-pax"
                  label="Room Min Pax"
                  name="room-min-pax"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields['room-min-pax'].value}
                  onChange={stateUpdater}
                  error={localFields['room-min-pax'].error && localFields['room-min-pax'].is_require}
                  helperText={
                    localFields['room-min-pax'].error && localFields['room-min-pax'].is_require ? 'Incorrect entry.' : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="room-max-pax"
                  label="Room Max Pax"
                  name="room-max-pax"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields['room-max-pax'].value}
                  onChange={stateUpdater}
                  error={localFields['room-max-pax'].error && localFields['room-max-pax'].is_require}
                  helperText={
                    localFields['room-max-pax'].error && localFields['room-max-pax'].is_require ? 'Incorrect entry.' : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="room-min-adults"
                  label="Room Min Adults"
                  name="room-min-adults"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields['room-min-adults'].value}
                  onChange={stateUpdater}
                  error={localFields['room-min-adults'].error && localFields['room-min-adults'].is_require}
                  helperText={
                    localFields['room-min-adults'].error && localFields['room-min-adults'].is_require
                      ? 'Incorrect entry.'
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="room-max-adults"
                  label="Room Max Adults"
                  name="room-max-adults"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields['room-max-adults'].value}
                  onChange={stateUpdater}
                  error={localFields['room-max-adults'].error && localFields['room-max-adults'].is_require}
                  helperText={
                    localFields['room-max-adults'].error && localFields['room-max-adults'].is_require
                      ? 'Incorrect entry.'
                      : ''
                  }
                  variant="outlined"
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  id="room-max-childs"
                  label="Room Max Childs"
                  name="room-max-childs"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={localFields['room-max-childs'].value}
                  onChange={stateUpdater}
                  error={localFields['room-max-childs'].error && localFields['room-max-childs'].is_require}
                  helperText={
                    localFields['room-max-childs'].error && localFields['room-max-childs'].is_require
                      ? 'Incorrect entry.'
                      : ''
                  }
                  variant="outlined"
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
                    label="Is Active"
                  />
                </Column>
              ) : (
                ''
              )}

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
                            {editData ? 'Update' : 'Add'}
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
                        Cancel
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
