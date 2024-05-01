import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Text, Card, Row, Column, Loader, CustomAlert, Glyphi } from '../../core';
import {
  Fade,
  InputBase,
  Button,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import {
  getAllNearPlaceType,
  getNearPlaceTypeByKey,
  deleteNearPlaceType,
  updateNearPlaceType,
  createNearPlaceType,
} from '../../helper/RequestPayLoad';
import { constants, newConstants } from '../../helper/constants';
var FA = require('react-fontawesome');
import PrimaryContainer from '../PrimaryContainer';


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
  const { languages, setAlertMsg, formname } = useStore();
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
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: "SNO" },
    [newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC]: { is_hide: false, bool: true, label: "Description" },
    [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE]: { is_hide: false, bool: true, label: "Icon" },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: "Status" },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: "Last Updated By" },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: "Last Updated On" },
    action: { is_hide: true, show: false, bool: true, label: "Action" }
  });

  const loadData = async () => {
    setLoader(true);
    let res = await httpPostRequest(getAllNearPlaceType(search_key, (currIndex - 1) * pageSize + 1, pageSize));
    console.log(res)
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setData(res[constants.DATA][newConstants.HOTEL_NEAR_PLACE_TYPE]);
      setLoader(false);
      setMaxPage(
        res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
          parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
          0
          ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
          : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
      );
    } else {
      setLoader(false);
      setCurrIndex(1);
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  }

  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };

  const editNearPlaceType = async (key) => {
    setAddEdit(false);
    let res = await httpPostRequest(getNearPlaceTypeByKey(key));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    else {
      setAddEdit(false);
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  async function delNearPlaceType() {
    if (deleteId != '') {
      const res = await httpPostRequest(deleteNearPlaceType(deleteId));
      setDeleteLoader(deleteId);
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
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
  }

  return (
    <div>
      <Card margin={[0, 0, 10, 0]}>
        {addEdit &&
          <Fade in={addEdit}>
            <EditContainer
              languages={languages}
              classes={classes}
              editData={editData}
              setEditData={setEditData}
              addEdit={addEdit}
              setAddEdit={setAddEdit}
              setAlertMsg={setAlertMsg}
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
        editRow={editNearPlaceType}
        deleteRow={setDeleteId}
        action_key={newConstants.HOTEL_NEAR_PLACE_TYPE_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={'Are you sure, you are deleting a recoard.'}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delNearPlaceType}
        />

      </PrimaryContainer>
    </div>
  );
}


const EditContainer = ({ classes, languages, editData, setEditData, addEdit, setAddEdit, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [loader, setLoader] = useState(false);
  const descRef = React.useRef();
  const iconRef = React.useRef();
  const saveRef = React.useRef();

  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE]: {
          value: '',
          is_require: false,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
      });
    } else {
      setLocalFields({
        [newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC]: {
          value: editData[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE]: {
          value: editData[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE],
          is_require: false,
          error: false,
          type: 'dropdown',
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
  const save = async () => {
    let localFields_validation = _.cloneDeep(localFields);
    localFields_validation = validator(localFields_validation);
    if (localFields_validation.err) {
      setLocalFields(localFields_validation.values);
    }
    if (!localFields_validation.err) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createNearPlaceType(localFields));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(updateNearPlaceType(editData[newConstants.HOTEL_NEAR_PLACE_TYPE_KEY], localFields));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: 'Please fill all the required fields' });
    }
  };

  return (
    <div>
      {localFields.hasOwnProperty(newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC) ? (
        <Row padding={[10]}>
          <Column>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  autoFocus={true}
                  label="description"
                  name={newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC}
                  value={localFields[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC].value}
                  onChange={stateUpdater}
                  error={
                    localFields[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC].error
                  }
                  helperText={
                    localFields[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC].err_msg
                  }
                  required={localFields[newConstants.HOTEL_NEAR_BY_PLACE_TYPE_DESC].is_require}
                  inputRef={descRef}
                  onKeyPress={(event)=>{
                    const { key } = event;
                    if (key === "Enter") {
                      iconRef.current.focus();
                    }
                  }}
                />
              </Column>

              <Column md={3} padding={[10, 5]}>
                <Glyphi
                  size="small"
                  labelId="near-place-type-icon-label-id"
                  id="near-place-type-icon-id"
                  name={newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE}
                  value={localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].value}
                  error={
                    localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].error &&
                    localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].is_require
                  }
                  onChange={stateUpdater}
                  helperText={
                    localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].error &&
                      localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].is_require
                      ? localFields[newConstants.HOTEL_GLYPH_ICON_NEAR_PLACE_TYPE].err_msg
                      : ''
                  }
                  label="Icon"
                  myref={iconRef}
                  keyPressed={e => { if (e.keyCode === 13) saveRef.current.focus() }}
                />
              </Column>
              {editData ? (
                <Column center md={3} padding={[10, 5]}>
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

              <Column right>
                <Row>
                  <Column md={8}></Column>

                  <Column right md={4}>
                    <Row bottom>
                      <Button
                        className={classes.saveButton}
                        buttonRef={saveRef}
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
      ) : (
        ''
      )}
    </div>
  );
};
