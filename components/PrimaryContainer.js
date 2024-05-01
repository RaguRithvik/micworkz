import React, { useState, useRef, useEffect } from 'react';
import { Create, Delete, AddCircleOutline, FilterList, Refresh, Search, ChevronRight, ChevronLeft } from '@material-ui/icons';
import { Row, Column, Text, Card, CustomTooltip, Loader } from '../core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
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
  Checkbox
} from '@material-ui/core';
import useOutsideClick from '../core/OutsideClickListener';
import { useStore } from "../helper/Store";
import { newConstants } from "../helper/constants";
import { getHeaders } from '../helper/JsHelper';
import LanguageConfig, { LanguageConfigFn } from "../helper/LanguageConfig"
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
  actionButton: {
    margin: 3,
    backgroundColor: theme.palette.primary.main,
    minWidth: 50,
    // backgroundImage: "linear-gradient(to right top, #2061ed, #364fc1, #393e97, #332f70, #29214c)"
    backgroundColor: "#3c3c7b",
    '&:hover': {
      backgroundColor: "#3c3c7b",
    },
  },
  actionButtonDelete: {
    margin: 3,
    // backgroundImage: " linear-gradient(to right top, #5b5552, #7f533f, #a14d30, #c34023, #e71c1c)",
    backgroundColor: "#8e3735",
    minWidth: 50,
    color: '#fff',
    '&:hover': {
      backgroundColor: "#8e3735",
    },
  },
  headerTitle: {
    color: theme.palette.primary.main
  },
  searchAndActionContainer: {
    justifyContent: 'flex-end',
    margin: '5px 0'
  },
  btnMargin: {
    margin: '5px 0'
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
  AddBtns: {
    padding: 10,
    backgroundImage: "linear-gradient(to right top, #214d92, #006ba7, #0087ae, #00a0aa, #40b7a2)",
    color: "white",
    '&:hover': {
      backgroundImage: "linear-gradient(to right top, #214d92, #006ba7, #0087ae, #00a0aa, #40b7a2)",
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
    // marginRight: theme.spacing(2),
    // marginLeft: 0,
    width: '100%',
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

const PrimaryContainer = (props) => {
  const { children, data, editRow, deleteRow, deleteLoader, action_key, filter_object, loader, currIndex, maxPage, setCurrIndex, setPageSize, pageSize, showCol, hidePagination, editData, addEdit } = props;
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

  const getAction = (res) => {
    let action = {}
    if (typeof action_key == 'string') {
      action = res[action_key]
    }
    else {
      action_key.forEach((act_key) => {
        action[act_key] = res[act_key]
      })
    }
    return action;
  }
  // console.log(Object.keys(showCol).length)
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
                    Object.keys(showCol).map((key) => showCol[key].bool && <StyledTableCell className={classes.tableHeadTuple} align={key == "action" ? "right" : ""} style={{ paddingRight: 50 }}>{showCol[key].label}</StyledTableCell>)
                  }
                </TableRow>
              </TableHead>
              {loader ?
                <TableBody>
                  <TableRow>
                    <TableCell scope="row" align="center" colSpan={Object.keys(showCol).length > 8 ? 10 : 6} rowSpan={2}>
                      <Loader size={25} color={'primary'} />
                    </TableCell>
                  </TableRow>
                </TableBody> :
                <TableBody>
                  {filter_data.length > 0 ? (
                    filter_data.map((res, index) => (
                      <StyledTableRow hover key={index + 'table_data'}>
                        {Object.keys(showCol).map((key) => key != "action" ?
                          (showCol[key].bool && <StyledTableCell key={key}>{(key.toLowerCase().search("icon") > -1 || key.toLowerCase().search("glyphcss") > -1) ? <FA name={res[key]} /> : typeof res[key] == "boolean" ? res[key] === false ? "false" : "true" : res[key]}</StyledTableCell >) :
                          (<StyledTableCell >
                            <Row style={{ placeContent: 'flex-end', display: 'block', textAlign: 'right' }}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.actionButton}
                                onClick={() => editRow(getAction(res))}>
                                {' '}
                                <Create />
                              </Button>

                              <Button
                                variant="contained"
                                color="default"
                                size="small"
                                onClick={() => deleteRow(getAction(res))}
                                className={classes.actionButtonDelete}>
                                {deleteLoader ? <Loader size={14} color={'primary'} /> : <Delete />}
                              </Button>
                            </Row>
                          </StyledTableCell >))}
                      </StyledTableRow>

                    ))
                  ) : (
                    <TableRow>
                      <TableCell scope="row" align="center" colSpan={7} rowSpan={2}>
                        <Text medium size={14}>
                          <LanguageConfig id="bookingreport.norecordsfound" />
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
                <Column md={6} xs={12} sm={6} middle style={{ flexFlow: 'row' }} >
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
                <Column md={6} xs={12} sm={6} middle className={classes.footer} >
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

export default PrimaryContainer;

const Header = (props) => {
  const { classes, formName, search_key, search, addEdit, setAddEdit, setShowCol, showCol, updateShowCol, loadData, setEditData, hideAdd, editData } = props;
  const [filter, setFilter] = useState(false);
  const filterRef = useRef();
  const { setHeaderConfig } = useStore();

  useEffect(() => {
    setHeaderConfig(formName)
  }, [editData, addEdit])


  useOutsideClick(filterRef, () => {
    setFilter(false);
  });
  const updateShow = (e) => {
    setShowCol({ ...showCol, [e.target.name]: { ...showCol[e.target.name], bool: e.target.checked } });
  };

  return (
    <Row>
      <Column sm={6} center className={classes.btnMargin}>
        <Row >
          <div ref={filterRef}>
            {!hideAdd && !addEdit ? <Button
              variant="contained"
              className={classes.btn}
              onClick={() => {
                setAddEdit(true);
                setFilter(false);
                setEditData(null);
              }}>
              <AddCircleOutline />
            </Button> : ""}
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
      <Column sm={6} right className={classes.searchAndActionContainer}>
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
      </Column>
    </Row>)
}