import React, { useState, useEffect, useMemo } from 'react';
import { Text, Card, Row, Column, TextArea, Loader, CustomAlert } from '../../core';
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
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { Search, Create, Delete, ChevronLeft, ChevronRight } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest, httpGetRequest } from '../../helper/JsHelper';
import {
  createHotelType,
  getAllHotelType,
  deleteHotelType,
  getHotelTypeById,
  updateHotelType,
} from '../../helper/RequestPayLoad';
import { constants } from '../../helper/constants';

const BootstrapInput = withStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
    margin: 5, 
    width:"30%",
    
  },
  addButton: {
    margin: 5 
  },
  closeButton: {
    margin: 5,
    width:"30%"
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
    backgroundColor: '#ff8c3c',
  },
  tableHeadTuple: {
    color: '#ffffff',
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
  },
  Bold:{
    fontWeight:"bold"
  },
  searchCol: {
    alignContent: 'flex-end',
    // padding:0,
    [theme.breakpoints.down('xs')]: {
      alignContent: 'end',
      padding: 6,
    },
  },
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const { setAlertMsg } = useStore();
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState('');

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    type_id: true,
    type_desc: true,
    pi_code: true,
    pi_last_updated_on: true,
    status: true,
    updated_on: true,
  });
  const loadData = async () => {
    setLoader(true)
    let res = await httpPostRequest(getAllHotelType());
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA]);
      setLoader(false);
    } else {
      setLoader(false);
      setAlertMsg({ type: 'error', msg: 'Please try again later.' });
    }
  };
  useEffect(() => {
    loadData();
  }, [addEdit]);

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
    .filter((f) => (search_key.length && f.hotelTypeDesc.search(search_key) > -1) || search_key.length == 0)
    .map((value, index) => ((currIndex - 1) * pageSize <= index && currIndex * pageSize > index ? value : null))
    .filter((f) => f != null);

  useMemo(() => {
    let count = data.length / pageSize;
    count = count == parseInt(count) ? count : parseInt(count) + 1;
    setMaxPage(count);
  }, [data, pageSize]);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };

  const editHotelType = async(data) => {
    let res = await httpPostRequest(getHotelTypeById(data.hotelTypeId));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
    } else {
      setEditData({
        HotelTypeId: data.hotelTypeId,
        ProductTypeProviderId: data.productTypeProviderId,
        HotelTypeDesc: data.hotelTypeDesc,
      });
    }
    setAddEdit(true);
  };
  async function delHotelType() {
    if (deleteId != '') {
      const res = await httpPostRequest(deleteHotelType(deleteId));
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
  }
  const updateShowCol = (e) => {
    setShowCol({ ...showCol, [e.target.name]: e.target.checked });
  };
  return (
    <div>
      <AppBar position="static" elevation={0} className={classes.headerName}>
        <Toolbar variant="dense">
          <Text variant="h4" color="inherit">
            Hotel Types
          </Text>
        </Toolbar>
      </AppBar>
      <Card noShadow >
        <CustomAlert
          message={'Are you sure, you are deleting a recoard.'}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delHotelType}
        />
        <Row>
          {addEdit ? (
            <Column padding={[10]}>
              <Fade in={addEdit}>
                <EditContainer
                  classes={classes}
                  editData={editData}
                  setEditData={setEditData}
                  addEdit={addEdit}
                  setAddEdit={setAddEdit}
                  setAlertMsg={setAlertMsg}
                />
              </Fade>
            </Column>
          ) : null}
            <Column left padding={[10]} md={6} xs={6} sm={6}>
            <FormControl className={classes.margin}>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={['']}
                onChange={(v) => console.log(v)}
                multiple={true}
                label={'Select Column To Hide'}
                input={<BootstrapInput />}>
                <MenuItem value={''}>Select Column to Hide</MenuItem>
                <FormGroup>
                  {Object.keys(showCol).map((key) => (
                    <FormControlLabel
                      className={classes.columnCheck}
                      control={<Checkbox checked={showCol[key]} onChange={updateShowCol} name={key} />}
                      label={key.replace(/_/g, ' ')}
                    />
                  ))}
                </FormGroup>
              </Select>
            </FormControl>
          </Column>
          {!addEdit ? (
            <Column right padding={[10]} md={6} xs={6} sm={6}>
              <Button variant="contained" color="primary" className={classes.addButton} onClick={() => setAddEdit(true)}>
                Add
              </Button>
            </Column>
          ) : null}
        
          <Column >
            <Row>
              <Column md={6} xs={6} sm={6} padding={[5,10,5,10]}>
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
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                  <Text size={14} medium style={{ marginLeft: 5 }}>
                    Entries
                  </Text>
                </Row>
              </Column>
              <Column md={6} xs={6} sm={6} className={classes.searchCol} padding={[5]}>
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
          <Column padding={[5,0,5,0]}>
            <TableContainer component={Paper}>
              <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    {showCol.type_id ? <TableCell className={classes.tableHeadTuple}>Type Id</TableCell> : null}
                    {showCol.type_desc ? <TableCell className={classes.tableHeadTuple}>Type Desc</TableCell> : null}
                    {showCol.pi_code ? <TableCell className={classes.tableHeadTuple}>PI Code</TableCell> : null}
                    {showCol.pi_last_updated_on ? (
                      <TableCell className={classes.tableHeadTuple}>PI Last Updated On</TableCell>
                    ) : null}
                    {showCol.provider_id ? <TableCell className={classes.tableHeadTuple}>Provider Id</TableCell> : null}
                    {showCol.status ? <TableCell className={classes.tableHeadTuple}>Status</TableCell> : null}
                    {showCol.updated_on ? <TableCell className={classes.tableHeadTuple}>Updated On</TableCell> : null}
                    <TableCell align="center" className={classes.tableHeadTuple}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filter_data.length > 0 ? (
                    filter_data.map((res, index) => (
                      <TableRow key={index + '_type'}>
                        {showCol.type_id ? <TableCell scope="row">{res.hotelTypeId}</TableCell> : null}
                        {showCol.type_desc ? <TableCell>{res.hotelTypeDesc}</TableCell> : null}
                        {showCol.pi_code ? <TableCell>{res.hotelTypePiCode}</TableCell> : null}
                        {showCol.pi_last_updated_on ? <TableCell>{res.hotelTypePiLastUpdatedDate}</TableCell> : null}
                        {showCol.provider_id ? <TableCell>{res.productTypeProviderId}</TableCell> : null}
                        {showCol.status ? <TableCell>{res.isActive == 1 ? 'Active' : 'Inactive'}</TableCell> : null}
                        {showCol.updated_on ? <TableCell>{res.updatedDate}</TableCell> : null}
                        <TableCell>
                          <Row style={{placeContent:"flex-end"}}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.actionButton}
                            onClick={() => editHotelType(res)}>
                            <Create />
                          </Button>

                          <Button
                            variant="contained"
                            color="default"
                            size="small"
                            onClick={() => setDeleteId(res.hotelTypeId)}
                            className={classes.actionButtonDelete}>
                            {deleteLoader ? <Loader size={14} color={'primary'} /> : <Delete />}
                          </Button>
                          </Row>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : loader ? (
                    <TableRow>
                      <TableCell scope="row">
                        <Loader size={16} color={'primary'} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell scope="row">
                        <Text medium sizs={14}>
                          {'No recoard Found.'}
                        </Text>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Column>
          <Column>
            <Row margin={[10, 5]}>
              <Column md={9} xs={7} sm={7}>
              <Text medium size={14} style={{  paddingLeft: 7 }}>
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
const EditContainer = ({ classes, editData, setEditData, addEdit, setAddEdit, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [loader, setLoader] = useState(false);
  const [prodTypeProvider, setProdTypeProvider] = useState([{ value: 1, label: 'MANUAL ENTRY' }]);
  useEffect(() => {
    if (!editData) {
      setLocalFields({
        HotelTypeId: {
          value: '',
          is_require: false,
          error: false,
        },
        ProductTypeProviderId: {
          value: '',
          is_require: true,
          error: false,
        },
        HotelTypeDesc: {
          value: '',
          is_require: true,
          error: false,
        },
      });
    } else {
      setLocalFields({
        HotelTypeId: {
          value: editData.HotelTypeId,
          is_require: true,
          error: false,
        },
        ProductTypeProviderId: {
          value: editData.ProductTypeProviderId,
          is_require: true,
          error: false,
        },
        HotelTypeDesc: {
          value: editData.HotelTypeDesc,
          is_require: true,
          error: false,
        },
      });
    }
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
      if (editData == null) {
        let res = await httpPostRequest(createHotelType(localFields));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: 'Try again later.' });
        }
      } else {
        let res = await httpPostRequest(updateHotelType(editData.HotelTypeId, localFields));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: 'Try again later.' });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: 'Please fill all the required fields' });
    }
  };
  return (
    <div>
      {localFields.hasOwnProperty('HotelTypeId') ? (
        <Row>
          <Column padding={[8]}>
            <Text bold size={16}>
              {editData ? 'Edit Hotel Type' : 'Add Hotel Type'}
            </Text>
          </Column>
          <Column >
            <Row>
              {editData ? (
                <Column md={3} padding={[0, 5, 10, 5]}>
                  <TextField
                    error={false}
                    id="hotel-type-id"
                    label="Type Id"
                    name="HotelTypeId"
                    value={localFields.HotelTypeId.value}
                    onChange={stateUpdater}
                    error={localFields.HotelTypeId.error && localFields.HotelTypeId.is_require}
                    helperText={
                      localFields.HotelTypeId.error && localFields.HotelTypeId.is_require ? 'Incorrect entry.' : ''
                    }
                    variant="outlined"
                    required={localFields.HotelTypeId.is_require ? true : false}
                    disabled={editData ? true : false}
                  />
                </Column>
              ) : (
                ''
              )}

              <Column md={3} padding={[0, 5, 10, 5]}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">Type Provider ID</InputLabel>
                  <Select
                    size="small"
                    labelId="product-type-provider-id-label"
                    id="product-type-provider-id"
                    label="Type Provider Id"
                    name="ProductTypeProviderId"
                    defaultValue="None"
                    value={localFields.ProductTypeProviderId.value}
                    onChange={stateUpdater}
                    error={localFields.ProductTypeProviderId.error && localFields.ProductTypeProviderId.is_require}
                    helperText={
                      localFields.ProductTypeProviderId.error && localFields.ProductTypeProviderId.is_require
                        ? 'Incorrect entry.'
                        : ''
                    }
                    required={localFields.ProductTypeProviderId.is_require ? true : false}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {prodTypeProvider.map((data, index) => (
                      <MenuItem key={index} value={data.value}>
                        {data.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Column>
              <Column md={6}>
                <TextArea
                  error={false}
                  id="outlined-error-helper-text"
                  label="Type Description"
                  name="HotelTypeDesc"
                  multiline
                  row={'3'}
                  rowsMax={'20'}
                  variant="outlined"
                  value={localFields.HotelTypeDesc.value}
                  onChange={stateUpdater}
                  error={localFields.HotelTypeDesc.error && localFields.HotelTypeDesc.is_require}
                  helperText={
                    localFields.HotelTypeDesc.error && localFields.HotelTypeDesc.is_require ? 'Incorrect entry.' : ''
                  }
                  required={localFields.HotelTypeDesc.is_require ? true : false}
                />
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
                            {editData ? 'Update' : 'Add'}
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
      ) : (
        ''
      )}
    </div>
  );
};
