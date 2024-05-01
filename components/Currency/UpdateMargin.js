import React, { useState, useEffect } from 'react';
import { TextField, Text, Card, Row, Column, Loader, DemandDropDown,CustomAlert } from '../../core';
import {
  Fade,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  Checkbox,
  Tooltip,
  MenuItem,
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Create, Delete } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { Add, Remove } from '@material-ui/icons';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import {
  updateCurrency,
  getCurrencyByKey,
} from '../../helper/RequestPayLoad';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from '../PrimaryContainer';
import async from 'react-select/async';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  addEdit: {
    marginLeft: 4,
    marginRight: 4,
  },
  saveButton: {
    width: '40%',
    margin: 5,
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
    borderBottom: '1.2px solid #003399',
  },
  tableHeadTuple: {
    color: '#003399',
    fontSize: '.8rem',
    fontWeight: '1000',
    padding: 15,
    textTransform: 'uppercase',
    width: 'clamp(150px,10vw,300px)',
    minWidth:150,
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
  currencyAction:{
    padding:12,
  }
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg } = useStore();

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [loadClicked,setLoadClicked]=useState('')
  const [baseCurrency,setBaseCurrency]=useState("INR")
  const [localFields,setLocalFields]=useState([]);
  // temparory solution to reduce payload
  const [originalData,setOriginalData]=useState([]);

  const [marginTypes,setMarginTypes]=useState([
    {
        "margin-type-name": "Flat",
        "margin-type-value": "F"
    },
    {
        "margin-type-name": "Percentage",
        "margin-type-value": "P"
    }
])

  const [showCol, setShowCol] = useState({
    currency_code: true,
    currency_name: true,
    exchange_rate: true,
    base_currency: true,
    margin_type:true,
    margin_rate:true,
    board_rate:true,
    buy_margin_type:true,
    buy_margin_value:true,
    buy_margin_rate:true,
    buy_board_rate:true,
    last_update_date: true,
  });

  const {Currency}=DemandDropDown
  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getCurrencyByKey(baseCurrency));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.CURRENCY_RATE]);
      setMarginTypes(res[newConstants.DATA][newConstants.MARGIN_TYPES])
      let resData_=res[newConstants.DATA][newConstants.CURRENCY_RATE].map((data)=>{
        return data[newConstants.BASE_CURRENCY]!=""
        ?
        {
          [newConstants.CURRENCY_CODE]:{
            value:data[newConstants.CURRENCY_CODE],
            is_require: true,
            error: false,
            min_length: 1,
            max_length: 5,
            type: 'text',
            err_msg: '',
          },
          [newConstants.BASE_CURRENCY]:{
            value:data[newConstants.BASE_CURRENCY],
            is_require: true,
            error: false,
            min_length: 1,
            max_length: 5,
            type: 'text',
            err_msg: '',
          },
          [newConstants.MARGIN_TYPE_VALUE]:{
            value:data[newConstants.MARGIN_TYPE_VALUE],
            is_require:true,
            error:false,
            type:"dropdown",
            err_msg:"",
          },
          [newConstants.MARGIN_RATE]:{
            value:data[newConstants.MARGIN_RATE],
            is_require:true,
            error:false,
            type:"price",
            err_msg:"",
          },
          [newConstants.BUY_MARGIN_TYPE_VALUE]:{
            value:data[newConstants.BUY_MARGIN_TYPE_VALUE],
            is_require:true,
            error:false,
            type:"dropdown",
            err_msg:"",
          },
          [newConstants.BUY_MARGIN_RATE]:{
            value:data[newConstants.BUY_MARGIN_RATE],
            is_require:true,
            error:false,
            type:"price",
            err_msg:"",
          }
        }
        :null
      })
      setLocalFields(resData_)
      setOriginalData(resData_)
      setLoader(false);
    } else {
      setLoader(false);
      setAlertMsg({ type: 'error', msg: 'Please try again later.' });

    }
    setLoadClicked("")
  };

  useEffect(() => {
    loadData();
  }, []);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };
  const updateShowCol = (e) => {
    setShowCol({ ...showCol, [e.target.name]: e.target.checked });
  };
  const getChanges =(oldArray, newArray)=>{
    var changes, i, item, j, len;
    if (JSON.stringify(oldArray) === JSON.stringify(newArray)) {
      return false;
    }
    changes = [];
    for (i = j = 0, len = newArray.length; j < len; i = ++j) {
      item = newArray[i];
      if (JSON.stringify(item) !== JSON.stringify(oldArray[i])) {
        changes.push(item);
      }
    }
    return changes;
  };
  const stateUpdater = (e,index) => {
    let localFields_ = _.cloneDeep(localFields);
    if (e.target.value.length == 0) {
      localFields_[index][e.target.name].error = localFields_[index][e.target.name].is_require ? true : false;
      localFields_[index][e.target.name].value = e.target.value;
    } else {
      localFields_[index][e.target.name].value = e.target.value;
      localFields_[index][e.target.name].error = false;
    }
    setLocalFields(localFields_);
  };
  const updateCurrencyMargin=async()=>{
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      // update only changed values
      setLocalFields(localFields_validation.values);
    }
    if (!localFields_validation.err) {
      setLoader(true);
        let res = await httpPostRequest(
          updateCurrency(getChanges(originalData,localFields))
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          loadData();
          setLoader(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: 'Try again later.' });
        }
      
    } else {
      setAlertMsg({ type: 'error', msg: 'Please fill all the require fileds.' });
    }
  }

  

  return (
    <div>
      <PrimaryContainer
        formName="Currency Margin"
        search_key={search_key}
        search={search}
        setAddEdit={setAddEdit}
        currIndex={currIndex}
        maxPage={maxPage}
        setCurrIndex={setCurrIndex}
        setPageSize={setPageSize}
        pageSize={pageSize}
        showCol={showCol}
        updateShowCol={updateShowCol}
        loadData={loadData}
        setEditData={setEditData}
        hideAdd={true}
        hidePagination={true}
        >
        <Card noShadow>
        <CustomAlert
            message={'Changes will be lost if not updated, Load Currency?'}
            open={loadClicked}
            setOpen={setLoadClicked}
            action={loadData}
          />
          <Row>
            <Column margin={[15]}>
              <Row>
                  <Column md={4}>
                    <Currency
                      currency={baseCurrency}
                      onChange={(e)=>setBaseCurrency(e.target.value)}
                    />
                  </Column>
                  <Column md={1} margin={[0,5]}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.currencyAction}
                        onClick={() => setLoadClicked(baseCurrency)}>
                        {'Load'}
                      </Button>
                  </Column>
                  <Column md={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.currencyAction}
                        onClick={() => updateCurrencyMargin()}>
                        {'Update'}
                        
                      </Button>
                  </Column>
                </Row>
            </Column>
            <Column>
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                  <TableHead className={classes.tableHead}>
                    <TableRow>
                      {showCol.currency_code ? <TableCell className={classes.tableHeadTuple}>Currency Code</TableCell> : null}
                      {showCol.currency_name ? <TableCell className={classes.tableHeadTuple}>Currency Name</TableCell> : null}
                      {showCol.exchange_rate ? <TableCell className={classes.tableHeadTuple}>Exchange Rate</TableCell> : null}
                      {showCol.base_currency ? <TableCell className={classes.tableHeadTuple}>Base Currency </TableCell> : null}
                      {showCol.margin_type ? <TableCell className={classes.tableHeadTuple}>Margin Type</TableCell> : null}
                      {showCol.margin_rate ? <TableCell className={classes.tableHeadTuple} style={{minWidth:200}}>Margin Rate</TableCell> : null}
                      {showCol.board_rate ? <TableCell className={classes.tableHeadTuple}>Board Rate</TableCell> : null}
                      {showCol.buy_margin_type ? <TableCell className={classes.tableHeadTuple} style={{minWidth:180}}>Buy Margin Type</TableCell> : null}
                      {showCol.buy_margin_rate ? <TableCell className={classes.tableHeadTuple} style={{minWidth:200}}>Buy Margin Rate</TableCell> : null}
                      {showCol.buy_board_rate ? <TableCell className={classes.tableHeadTuple}>Buy Board Rate</TableCell> : null}
                      {showCol.last_update_date ? (
                        <TableCell className={classes.tableHeadTuple}>Last Updated On</TableCell>
                      ) : null}

                     
                    </TableRow>
                  </TableHead>
                  {loader ? (
                    <TableBody>
                      <TableRow>
                        <TableCell scope="row" align="center" colSpan={7} rowSpan={2}>
                          <Loader size={25} color={'primary'} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <TableBody>
                      {data.length > 0 ? (
                        data.map((row, index) => (
                          <TableRow key={'currency_margin_'+index}>
                            {showCol.currency_code ? <TableCell >{row[newConstants.CURRENCY_CODE]}</TableCell> : null}
                            {showCol.currency_name ? <TableCell >{row[newConstants.CURRENCY_NAME]}</TableCell> : null}
                            {showCol.exchange_rate ? <TableCell >{row[newConstants.EXCHANGE_RATE]}</TableCell> : null}
                            {showCol.base_currency ? <TableCell >{row[newConstants.BASE_CURRENCY]}</TableCell> : null}
                            {showCol.margin_type ? 
                              <TableCell >
                              <TextField
                                  id="margin-type-value-id"
                                  select
                                  name={newConstants.MARGIN_TYPE_VALUE}
                                  value={localFields[index][newConstants.MARGIN_TYPE_VALUE].value}
                                  onChange={(e)=>stateUpdater(e,index)}
                                  error={localFields[index][newConstants.MARGIN_TYPE_VALUE].error}
                                  helperText={
                                    localFields[index][newConstants.MARGIN_TYPE_VALUE].error
                                      ? localFields[index][newConstants.MARGIN_TYPE_VALUE].err_msg
                                      : ''
                                  }
                                  variant="filled"
                                >
                                  {marginTypes.map((option,index)=>(
                                    <MenuItem key={"margin_types_"+index} value={option[newConstants.MARGIN_TYPE_VALUE]}>
                                      {option[newConstants.MARGIN_TYPE_NAME]}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </TableCell> 
                            : null}
                            {showCol.margin_rate ? 
                              <TableCell>
                                <TextField
                                    type="number"
                                    inputProps={{min:0,step:".01"}}
                                    name={newConstants.MARGIN_RATE}
                                    value={localFields[index][newConstants.MARGIN_RATE].value}
                                    onChange={(e)=>stateUpdater(e,index)}
                                    error={localFields[index][newConstants.MARGIN_RATE].error}
                                    helperText={localFields[index][newConstants.MARGIN_RATE].err_msg}
                                    required={localFields[index][newConstants.MARGIN_RATE].is_require}
                                    variant="filled"
                                    />
                              </TableCell> 
                            : null}
                            {showCol.board_rate ? <TableCell>{row[newConstants.BOARD_RATE]}</TableCell> : null}
                            {showCol.buy_margin_type ? 
                              <TableCell>
                                <TextField
                                  id="buy-margin-type-value-id"
                                  select
                                  name={newConstants.BUY_MARGIN_TYPE_VALUE}
                                  value={localFields[index][newConstants.BUY_MARGIN_TYPE_VALUE].value}
                                  onChange={(e)=>stateUpdater(e,index)}
                                  error={localFields[index][newConstants.BUY_MARGIN_TYPE_VALUE].error}
                                  helperText={
                                    localFields[index][newConstants.BUY_MARGIN_TYPE_VALUE].error
                                      ? localFields[index][newConstants.BUY_MARGIN_TYPE_VALUE].err_msg
                                      : ''
                                  }
                                  variant="filled"
                                >
                                  {marginTypes.map((option,index)=>(
                                    <MenuItem key={"buy_margin_types_"+index} value={option[newConstants.MARGIN_TYPE_VALUE]}>
                                      {option[newConstants.MARGIN_TYPE_NAME]}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </TableCell> 
                            : null}
                            {showCol.buy_margin_rate ? 
                              <TableCell> 
                                <TextField
                                  type="number"
                                  inputProps={{min:0,step:".01"}}
                                  name={newConstants.BUY_MARGIN_RATE}
                                  value={localFields[index][newConstants.BUY_MARGIN_RATE].value}
                                  onChange={(e)=>stateUpdater(e,index)}
                                  error={localFields[index][newConstants.BUY_MARGIN_RATE].error}
                                  helperText={localFields[index][newConstants.BUY_MARGIN_RATE].err_msg}
                                  required={localFields[index][newConstants.BUY_MARGIN_RATE].is_require}
                                  variant="filled"
                                  />
                              </TableCell> 
                              : null}
                            {showCol.buy_board_rate ? <TableCell>{row[newConstants.BUY_BOARD_RATE]}</TableCell> : null}

                            {showCol.last_update_date ? (
                              <TableCell>Last Updated On</TableCell>
                            ) : null}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell scope="row" align="center" colSpan={7} rowSpan={2}>
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
            <Column margin={[15]}>
              <Row>
                  <Column md={4}>
                    <Currency
                      currency={baseCurrency}
                      onChange={(e)=>setBaseCurrency(e.target.value)}
                    />
                  </Column>
                  <Column md={1} margin={[0,5]}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.currencyAction}
                        onClick={() => setLoadClicked(baseCurrency)}>
                        {'Load'}
                      </Button>
                  </Column>
                  <Column md={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.currencyAction}
                        onClick={() => updateCurrencyMargin()}>
                        {'Update'}
                      </Button>
                  </Column>
                </Row>
            </Column>
            </Row>
        </Card>
      </PrimaryContainer>
    </div>
  );
}

