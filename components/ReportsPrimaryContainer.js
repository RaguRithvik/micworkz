import React, { useState, useRef, useEffect } from 'react';
import { FilterList, Refresh, Search, ChevronRight, ChevronLeft } from '@material-ui/icons';
import { Row, Column, Text, Card, CustomTooltip, Loader } from '../core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  InputBase,
  Button,
  Select,
  FormControl,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField
} from '@material-ui/core';
import useOutsideClick from '../core/OutsideClickListener';
import { useStore } from "../helper/Store";
import { newConstants } from "../helper/constants";
import LanguageConfig, { LanguageConfigFn } from "../helper/LanguageConfig";
import { KeyboardDatePicker } from '@material-ui/pickers';
var FA = require('react-fontawesome');

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: '#ffffff',
    borderBottom: '1.2px solid ' + theme.palette.primary.main,
  },
  tableHeadTuple: {
    color: theme.palette.primary.main,
    fontSize: '.8rem',
    fontWeight: '1000',
    // padding: 15,
    textTransform: 'uppercase',
    width: 'clamp(150px,10vw,300px)',
  },
  actionButton1: {
    margin: 3,
    backgroundColor: "#336f6e",
    color: "white",
    '&:hover': {
      backgroundColor: "transparent",
      color: "#336f6e",
    },
  },
  actionButton2: {
    margin: 3,
    backgroundColor: "transparent",
    color: "#336f6e",
    border: '1px solid #336f6e',
    '&:hover': {
      backgroundColor: "#336f6e",
      color: "white"
    },
  },
  searchAndActionContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  filterContainer: {
    flexDirection: 'row'
  },
  btn: {
    margin: 2,
    // backgroundImage: "linear-gradient(to right top, #214d92, #006ba7, #0087ae, #00a0aa, #40b7a2)",
    backgroundColor: "#336f6e",
    color: "white",
    '&:hover': {
      backgroundColor: "#336f6e",
    },
  },
  Bold: {
    fontWeight: 'bold',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.2),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '50% !important',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    color: fade(theme.palette.common.black, 0.3),
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: fade(theme.palette.common.black, 0.9),
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    height: 30,
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '31ch',
    },
  },
  searchCol: {
    alignContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      alignContent: 'end',
      padding: 6,
    },
  },
  footer: {
    flexFlow: 'row',
    height: 40,
    justifyContent: 'flex-end'
  }
}));


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgb(26, 43, 71)",
    color: theme.palette.common.white,
    padding: 15,
    whiteSpace: "nowrap !important",
  },
  body: {
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: "nowrap !important",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const ReportsPrimaryContainer = (props) => {
  const { children, data, columnsSpan, filter_object, loader, currIndex, maxPage, setCurrIndex, setPageSize, pageSize, showCol, hidePagination } = props;
  const classes = useStyles();

  const filter_data = data && data
    .map((value, index) =>
      (currIndex - 1) * pageSize <= value[filter_object] - 1 && currIndex * pageSize > value[filter_object] - 1
        ? value
        : null,
    )
    .filter((f) => f != null);

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

  return (
    <Card>
      <Row>
        <Column margin={[0, 0, 0, 5]}>{children}</Column>
        <Column><Divider /> </Column>
        <Column padding={[15, 10, 10]}>
          <Header classes={classes} {...props} />
        </Column>
        <Column>
          {data ? <TableContainer>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead className={classes.tableHead}>
                <TableRow>
                  {
                    Object.keys(showCol).map((key) => showCol[key].bool && <StyledTableCell className={classes.tableHeadTuple} style={{ paddingRight: 50 }}>{showCol[key].label}</StyledTableCell>)
                  }
                </TableRow>
              </TableHead>
              {loader ?
                <TableBody>
                  <TableRow>
                    {/* <TableCell scope="row" align="center" colSpan={Object.keys(showCol).length > 8 ? 10 : 6} rowSpan={2}> */}
                    <TableCell scope="row" align="center" colSpan={columnsSpan} rowSpan={2}>
                      <Loader size={25} color={'primary'} />
                    </TableCell>
                  </TableRow>
                </TableBody> :
                <TableBody>
                  {filter_data.length > 0 ? (
                    filter_data.map((res, index) => (
                      <StyledTableRow hover key={index + 'table_data'}>
                        {Object.keys(showCol).map((key) => showCol[key].bool && <StyledTableCell key={key}>{(key.toLowerCase().search("icon") > -1 || key.toLowerCase().search("glyphcss") > -1) ? <FA name={res[key]} /> : typeof res[key] == "boolean" ? res[key] === false ? "false" : "true" : res[key]}</StyledTableCell >)}
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell scope="row" align="center" colSpan={columnsSpan} rowSpan={5}>
                        <Text medium size={14}>
                          {'No record Found.'}
                        </Text>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              }
            </Table>
          </TableContainer>
            : null}
        </Column>
        <Column>
          {!hidePagination ?
            <Card padding={[10]}>
              <Row >
                <Column md={6} xs={6} sm={6} middle style={{ flexFlow: 'row' }} >
                  <Text size={14} bold style={{ marginRight: 5 }}>
                    <LanguageConfig id="roompricecomment.show" />
                  </Text>
                  <FormControl className={classes.margin}>
                    <Select
                      labelId="demo-customized-select-label"
                      id="demo-customized-select"
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value)}
                      label={'Select Column To Hide'}>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={30}>30</MenuItem>
                    </Select>
                  </FormControl>
                  <Text size={14} bold style={{ marginLeft: 5 }}>
                    <LanguageConfig id="roompricecomment.entries" />
                  </Text>
                </Column>
                <Column md={6} xs={6} sm={6} middle className={classes.footer} >
                  <Text medium size={16}>
                    <span className={classes.Bold}> {currIndex}</span> of
                    <span className={classes.Bold}> {maxPage}</span>
                  </Text>
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
                </Column>
              </Row>
            </Card>
            : null}
        </Column>
      </Row>

    </Card>
  );
};

export default ReportsPrimaryContainer;

const Header = (props) => {
  const { classes,
    search_key,
    search,
    setShowCol,
    showCol,
    updateShowCol,
    loadData,
    startDate,
    setStartDate,
    branch,
    setBranch,
    allBranches,
    genLoader,
    viewLoader,
    viewBtnHandler,
    generateBtnHandler,
    legderCumm = false,
    salesReportFlag = false,
    endDate,
    setEndDate,
    searchLedger,
    setSearchLedger,
    selectedLedger,
    setSelectedLedger,
    allLedgers,
    formName,
    reportStatus,
    setStatus
  } = props;
  const [filter, setFilter] = useState(false);
  const filterRef = useRef();
  const { setHeaderConfig } = useStore();

  const statuses = [
    { value: 'N', label: 'Pending', },
    { value: 'Y', label: 'Confirm', }
  ];

  useOutsideClick(filterRef, () => {
    setFilter(false);
  });
  const updateShow = (e) => {
    setShowCol({ ...showCol, [e.target.name]: { ...showCol[e.target.name], bool: e.target.checked } });
  };

  useEffect(() => {
    setHeaderConfig(formName)
  }, [formName])

  return (
    <Row>
      <Column md={9} className={classes.filterContainer}>
        <KeyboardDatePicker
          autoOk
          variant="inline"
          inputVariant="outlined"
          label="Start Date*"
          format="DD/MM/YYYY"
          size="small"
          style={{ width: '250px', marginRight: "10px" }}
          value={startDate}
          InputAdornmentProps={{ position: 'start' }}
          onChange={date => setStartDate(date['_d'])}
        />

        {legderCumm &&
          <>
            <KeyboardDatePicker
              autoOk
              variant="inline"
              inputVariant="outlined"
              label="End Date*"
              format="DD/MM/YYYY"
              size="small"
              style={{ width: '250px', marginRight: "10px" }}
              value={endDate}
              InputAdornmentProps={{ position: 'start' }}
              onChange={date => setEndDate(date['_d'])}
            />

            <Autocomplete
              style={{ display: "inline-flex", width: 250, marginRight: "10px" }}
              size="small"
              value={selectedLedger}
              getOptionLabel={option => option["ledger-name"]}
              onChange={(event, newValue) => {
                setSelectedLedger(newValue);
              }}
              inputValue={searchLedger}
              onInputChange={(event, newInputValue) => {
                setSearchLedger(newInputValue);
              }}
              id="controllable-states-demo"
              options={allLedgers}
              renderInput={(params) => <TextField {...params} label="Ledger*" variant="outlined" className="input_height" />}
            />
          </>
        }

        {salesReportFlag &&
          <>
            <KeyboardDatePicker
              autoOk
              variant="inline"
              inputVariant="outlined"
              label="End Date*"
              format="DD/MM/YYYY"
              size="small"
              style={{ width: '250px', marginRight: "10px" }}
              value={endDate}
              InputAdornmentProps={{ position: 'start' }}
              onChange={date => setEndDate(date['_d'])}
            />
            <TextField
              id="outlined-select-currency"
              size="small"
              select
              label="Select"
              style={{ width: '250px', marginRight: "10px" }}
              value={reportStatus}
              onChange={e => setStatus(e.target.value)}
              // helperText="Please select your currency"
              variant="outlined"
            >
              {statuses.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </>
        }

        <TextField
          id="outlined-select"
          size="small"
          select
          label="Branch*"
          style={{ width: '250px', marginRight: "10px" }}
          value={branch}
          onChange={e => setBranch(e.target.value)}
          variant="outlined"
        >
          {allBranches.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" color="primary" disabled={genLoader} className={classes.actionButton1} onClick={generateBtnHandler}>
          <Row>
            {genLoader ? <Column md={1} xs={1} sm={1} center left><Loader size={14} color={"white"} /></Column> : null}
            <Column md={genLoader ? 11 : 12} xs={genLoader ? 11 : 12} sm={genLoader ? 11 : 12} center middle >Generate</Column>
          </Row>
        </Button>

        <Button variant="outlined" color="primary" disabled={viewLoader} className={classes.actionButton2} startIcon={!viewLoader && <VisibilityIcon />} onClick={viewBtnHandler}>
          <Row>
            {viewLoader ? <Column md={1} xs={1} sm={1} center left><Loader size={14} color={"grey"} /></Column> : null}
            <Column md={viewLoader ? 11 : 12} xs={viewLoader ? 11 : 12} sm={viewLoader ? 11 : 12} center middle >View</Column>
          </Row>
        </Button>
      </Column>
      <Column md={3} right>
        <Row className={classes.searchAndActionContainer}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              placeholder={LanguageConfigFn("roompricecomment.search")}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={search_key}
              onChange={search}
            />
          </div>
          <div ref={filterRef}>
            <Button
              variant="contained"
              className={classes.btn}
              onClick={() => {
                loadData();
                setFilter(false);
              }}>
              <Refresh />
            </Button>
            <Button variant="contained" className={classes.btn} onClick={() => setFilter(true)}>
              <FilterList />
            </Button>
            <CustomTooltip open={filter} onClose={() => setFilter(false)}>
              {updateShowCol ?
                <Row>
                  <Column padding={[5, 10]}>
                    <FormGroup>
                      {Object.keys(showCol).map((key) => (
                        <FormControlLabel
                          control={<Checkbox color="primary" checked={showCol[key]} onChange={updateShowCol} name={key} />}
                          label={key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        />
                      ))}
                    </FormGroup>
                  </Column>
                </Row> :
                <Row>
                  <Column padding={[5, 10]}>
                    <FormGroup>
                      {Object.keys(showCol).map((key) => ((!showCol[key].is_hide) &&
                        <FormControlLabel
                          control={<Checkbox color="primary" checked={showCol[key].bool} onChange={updateShow} name={key} />}
                          label={showCol[key].label}
                        />
                      ))}
                    </FormGroup>
                  </Column>
                </Row>}
            </CustomTooltip>
          </div>
        </Row>
      </Column>
    </Row>)
}