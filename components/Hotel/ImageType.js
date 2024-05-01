import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TextField, Text, Card, Row, Column, Loader, Glyphi, CustomAlert, DemandDropDown } from '../../core';
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
import { makeStyles } from '@material-ui/core/styles';
import { Delete, Edit } from '@material-ui/icons';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import {
  getAllHotelImageType,
  getHotelImageTypeByKey,
  deleteHotelImageType,
  updateHotelImageType,
  createHotelImageType,
} from '../../helper/RequestPayLoad';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from '../PrimaryContainer';
import LanguageConfig from "../../helper/LanguageConfig";
var FA = require('react-fontawesome');

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    minWidth: 100,
    height: 40,
    margin: 5,
    backgroundColor:"rgb(26, 43, 71);",
    color:"white",
    '&:hover': {
      backgroundColor:"rgb(26, 43, 71);",
    },
  },
  AddBtn: {
    padding: 10,
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
  },
  tableHead: {
    backgroundColor: '#ffffff',
    borderBottom: '1.2px solid' + theme.palette.primary.main,
  },
  tableHeadTuple: {
    color: theme.palette.grey.light,
    fontSize: '15px',
    fontWeight: '800',
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
    // padding:0,
    [theme.breakpoints.down('xs')]: {
      alignContent: 'end',
      padding: 6,
    },
  },
  Bold: {
    fontWeight: 'bold',
  },
  editContainer: {
    margin: '0 0 10px 0px',
    width: '100%',
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
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: <LanguageConfig id="hotelimagetype.sno" /> },
    [newConstants.HOTEL_IMAGE_TYPE_DESC]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelimagetype.typedescription" /> }
    ,
    [newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelimagetype.icon" /> },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelimagetype.status" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelimagetype.lastupdatedby" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="hotelimagetype.lastupdatedon" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="hotelimagetype.action" /> }
  });

  const loadData = async () => {
    if (!addEdit) {
      setLoader(true);
      let res = await httpPostRequest(getAllHotelImageType(search_key, (currIndex - 1) * pageSize + 1, pageSize));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setData(res[newConstants.DATA][newConstants.HOTEL_IMAGE_TYPES]);
        setMaxPage(
          res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
            parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
            0
            ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
            : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
        );
        setLoader(false);
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

  const editImageType = async (key) => {
    setAddEdit(false);
    let res = await httpPostRequest(getHotelImageTypeByKey(key));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
   else{
    setAddEdit(false);
    setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
   }
  };

  const delImageType = async () => {
    if (deleteId != '') {
      const res = await httpPostRequest(deleteHotelImageType(deleteId));
      setDeleteLoader(deleteId);
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setDeleteId('');
        setDeleteLoader('');
        loadData();
        setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });
      } else {
        setCurrIndex(1);
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
              classes={classes}
              loadData={loadData}
              editData={editData}
              setEditData={setEditData}
              setAlertMsg={setAlertMsg}
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
        filter_object={newConstants.ROW_NUMBER}
        editRow={editImageType}
        deleteRow={setDeleteId}
        action_key={newConstants.HOTEL_IMAGE_TYPE_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}
      >
        <CustomAlert
          message={<LanguageConfig id={"hotelimagetype.deletemsg"} />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delImageType}
        />

      </PrimaryContainer>
    </div>
  );
}
const EditContainer = ({ classes, editData, setEditData, addEdit, setAddEdit, setAlertMsg  }) => {
  const [loader, setLoader] = useState(false);
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([])
  const { languages,copylanguages } = useStore();
  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.HOTEL_IMAGE_TYPE_DESC]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON]: {
          value: '',
          is_require: true,
          error: false, 
          type: 'dropdown',
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
        [newConstants.HOTEL_IMAGE_TYPE_DESC]: {
          value: "",
          is_require: true,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      setMultiLanguage(Tab_multi)   
    } else {
      setLocalFields({
        [newConstants.HOTEL_IMAGE_TYPE_DESC]: {
          value: editData[newConstants.HOTEL_IMAGE_TYPE_DESC],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON]: {
          value: editData[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON],
          is_require: true,
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
      var Tab_multi = languages.map(val => ({
        [newConstants.LANG_CODE]:
        {
          value: val.value,
          is_require: true,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.HOTEL_IMAGE_TYPE_DESC]: {
          value: "",
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))

      let multi_language_ = [];
      if (editData[newConstants.HOTEL_IMAGE_TYPE_LANGUAGES] && editData[newConstants.HOTEL_IMAGE_TYPE_LANGUAGES].length) {
        editData[newConstants.HOTEL_IMAGE_TYPE_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: true,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.HOTEL_IMAGE_TYPE_DESC]: {
              value: value[newConstants.HOTEL_IMAGE_TYPE_DESC],
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
        multi_language_.push(...Tab_multi);
      }
      setMultiLanguage(multi_language_.concat(Tab_multi.filter(f => !(multi_language_.map(v => v["lang-code"].value).includes(f["lang-code"].value)))))
    }
  }, [editData,languages]);

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

  function multiStateUpdater(e, index) {
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
    let multi_lang_ = multi_language.filter(f => f[newConstants.HOTEL_IMAGE_TYPE_DESC].value != "")
    if (!localFields_validation.err) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createHotelImageType(localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setLoader(false);
          setAddEdit(false);
          setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(updateHotelImageType(editData[newConstants.HOTEL_IMAGE_TYPE_KEY], localFields,  multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
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
      setAlertMsg({ type: 'error', msg: <LanguageConfig id={"hotelimagetype.fillrequired"} /> });
    }
  };
  return (
    <div>
      {localFields.hasOwnProperty(newConstants.HOTEL_IMAGE_TYPE_DESC) ? (
        <Row padding={[10]}>
          <Column>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id="hotelimagetype.typedescription" />}
                  name={newConstants.HOTEL_IMAGE_TYPE_DESC}
                  value={localFields[newConstants.HOTEL_IMAGE_TYPE_DESC].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.HOTEL_IMAGE_TYPE_DESC].error}
                  helperText={localFields[newConstants.HOTEL_IMAGE_TYPE_DESC].err_msg}
                  required={localFields[newConstants.HOTEL_IMAGE_TYPE_DESC].is_require}
                />
              </Column>
              <Column md={3} padding={[10, 5]}>
                <Glyphi
                  size="small"
                  labelId="hotel-image-type-glyph-icon-label-id"
                  id="hotel-image-type-glyph-icon-id"
                  name={newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON}
                  value={localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON].value}
                  error={
                    localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON].error && localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON].is_require
                  }
                  onChange={stateUpdater}
                  helperText={
                    localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON].error && localFields[newConstants.HOTEL_IMAGE_TYPE_GLYPH_ICON].is_require
                      ? 'Incorrect entry.'
                      : ''
                  }
                  label={<LanguageConfig id="hotelimagetype.icon" />}
                />
              </Column>
              {editData && localFields[newConstants.IS_ACTIVE] && localFields[newConstants.IS_ACTIVE].hasOwnProperty('value') && (
                <Column md={3} padding={[10, 5]} center>
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
                        name="is-active"
                      />
                    }
                    label={<LanguageConfig id="hotelimagetype.isactive" />}
                  />
                </Column>
              )}
              <Row>
              <Column md={6} padding={[7]}>
                <LanguageContainer copylanguages={copylanguages} classes={classes} languages={languages} multi_language={multi_language} multiStateUpdater={multiStateUpdater} />
              </Column>
           </Row>
              <Column right>
                <Row>
                  <Column md={9}></Column>
                  <Column right md={3}>
                    <Row style={{ placeContent: 'flex-end' }}>
                      <Button
                        size="small"
                        className={classes.saveButton}
                        variant="contained"
                        color="primary"
                        style={{ width: '30%' }}
                        onClick={loader ? console.log('') : save}>
                        <Row>
                          {loader ? (
                            <Column md={1} xs={1} sm={1} center middle>
                              <Loader size={14} color={'white'} />
                            </Column>
                          ) : null}
                          <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} center middle sm={loader ? 11 : 12}>
                            <LanguageConfig id={editData ? "hotelimagetype.update" : "save"} />
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
                        style={{ width: '30%' }}
                        variant="contained">
                        <LanguageConfig id={"hotelimagetype.cancel"} />
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

const LanguageContainer = ({ classes, multi_language, multiStateUpdater,languages , copylanguages}) => {
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
                            <Text>{languages.filter(f=>f.value==val[newConstants.LANG_CODE].value).length?languages.filter(f=>f.value==val[newConstants.LANG_CODE].value)[0].label:
                            copylanguages.filter(f=>f.value==val[newConstants.LANG_CODE].value)[0].label}</Text>
                            </TableCell>
                            <TableCell className={classes.tableBodyTuple}>
                              <TextField
                                label={"Type Description"}
                                type="text"
                               value={val[newConstants.HOTEL_IMAGE_TYPE_DESC].value}
                                name={newConstants.HOTEL_IMAGE_TYPE_DESC}
                                error={val[newConstants.HOTEL_IMAGE_TYPE_DESC].error}
                                onChange={(e) => multiStateUpdater(e, index)}
                                helperText={val[newConstants.HOTEL_IMAGE_TYPE_DESC].err_msg}
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