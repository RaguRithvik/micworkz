import React, { useState, useEffect } from 'react';
import { TextField, Card, Row, Column, Loader, CustomAlert } from '../../core';
import { Fade, FormControlLabel, Checkbox, Button, } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { getAllAttractionTicketPriceComments, createAttractionTicketPriceComments, getAttractionTicketPriceCommentsByKey, updateAttractionTicketPriceComments, deleteAttractionTicketPriceComments, } from '../../helper/RequestPayLoadAttractions';
import { httpPostRequest, validator } from '../../helper/JsHelper';
import { constants, newConstants } from '../../helper/constants';
import { useStore } from '../../helper/Store';
import PrimaryContainer from "../PrimaryContainer"
import LanguageConfig from "../../helper/LanguageConfig";
import GeneralLanguageContainer from '../GeneralLanguageContainer';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    minWidth: 140,
    height: 40,
    margin: 5,
    width: '30%',
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
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerAttractions: 'none',
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
  endPadd: {
    placeContent: 'flex-end',
    padding: 8,
  },
  add: {
    backgroundColor: "rgb(26, 43, 71)",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    },
  },
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg, formname } = useStore();
  const [deleteLoader, setDeleteLoader] = useState('');
  const [deleteId, setDeleteId] = useState('');

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: <LanguageConfig id="general.sno" /> },
    [newConstants.TICKET_PRICE_COMMENTS_TITLE]: { is_hide: false, bool: true, label: <LanguageConfig id="event.ticketpricecomment" /> },
    [newConstants.TICKET_PRICE_COMMENTS_DESC]: { is_hide: false, bool: true, label: <LanguageConfig id="general.description" /> },
    [newConstants.ACTIVE_STATUS]: { is_hide: false, bool: true, label: <LanguageConfig id="general.status" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="general.lastupdatedon" /> },
    [newConstants.LAST_UPDATED_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="general.lastupdatedby" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="general.action" /> }
  });

  const getData = async () => {
    if (!addEdit) {
      setLoader(true);
      let res = await httpPostRequest(getAllAttractionTicketPriceComments(search_key, (currIndex - 1) * pageSize + 1, pageSize));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setData(res[constants.DATA][newConstants.TICKET_PRICE_COMMENTS]);
        setLoader(false);
        setMaxPage(
          res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize -
            parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) >
            0
            ? parseInt(res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize) + 1
            : res[newConstants.DATA][newConstants.TOTAL_ROWS] / pageSize,
        );
      } else {
        setCurrIndex(1);
        setLoader(false);
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    }
  };

  useEffect(() => {
    getData();
  }, [addEdit, search_key, pageSize, currIndex]);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };

  async function edit(id) {
    setAddEdit(false);
    let res = await httpPostRequest(getAttractionTicketPriceCommentsByKey(id));
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const deleteRoomCall = async () => {
    const res = await httpPostRequest(deleteAttractionTicketPriceComments(deleteId));
    setDeleteLoader(deleteId);
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setDeleteLoader('');
      getData();
      setDeleteId('');
      setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
    } else {
      setDeleteLoader('');
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  return (
    <div>
      <Card margin={[0, 0, 10, 0]}>
        {addEdit &&
          <Fade in={addEdit}>
            <EditContainer
              getData={getData}
              setAlertMsg={setAlertMsg}
              editData={editData}
              setEditData={setEditData}
              setAddEdit={setAddEdit}
              addEdit={addEdit}
              classes={classes}
              languages={languages}
            />
          </Fade>}
      </Card>
      <PrimaryContainer
        formName={editData != null && addEdit == true ? formname + "-" + "(Update)" : editData == null && addEdit == true ? formname + "-" + "(Save)" : formname}
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
        loadData={getData}
        data={data}
        filter_object={newConstants.ROW_NUMBER}
        editRow={edit}
        deleteRow={setDeleteId}
        action_key={newConstants.TICKET_PRICE_COMMENTS_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="general.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={deleteRoomCall}
        />
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ getData, classes, editData, setEditData, addEdit, setAddEdit, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const { languages } = useStore();
  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.TICKET_PRICE_COMMENTS_TITLE]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_PRICE_COMMENTS_DESC]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      });
      var Tab_multi = languages.map(val => ({
        [newConstants.LANG_CODE]:
        {
          value: val.value,
          is_require: false,
          error: false,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_PRICE_COMMENTS_TITLE]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_PRICE_COMMENTS_DESC]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      setMultiLanguage(Tab_multi)
    } else {
      setLocalFields({
        [newConstants.TICKET_PRICE_COMMENTS_TITLE]: {
          value: editData[newConstants.TICKET_PRICE_COMMENTS_TITLE],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_PRICE_COMMENTS_DESC]: {
          value: editData[newConstants.TICKET_PRICE_COMMENTS_DESC],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
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
          is_require: false,
          error: false,
          type: 'dropdown',
          err_msg: '',
        },
        [newConstants.TICKET_PRICE_COMMENTS_TITLE]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.TICKET_PRICE_COMMENTS_DESC]: {
          value: '',
          is_require: false,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))


      let multi_language_ = [];
      if (editData[newConstants.TICKET_PRICE_COMMENTS_LANGUAGES] && editData[newConstants.TICKET_PRICE_COMMENTS_LANGUAGES].length) {
        editData[newConstants.TICKET_PRICE_COMMENTS_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.TICKET_PRICE_COMMENTS_TITLE]: {
              value: value[newConstants.TICKET_PRICE_COMMENTS_TITLE],
              is_require: true,
              error: false,
              type: 'text',
              err_msg: '',
            },
            [newConstants.TICKET_PRICE_COMMENTS_DESC]: {
              value: value[newConstants.TICKET_PRICE_COMMENTS_DESC],
              is_require: true,
              error: false,
              type: 'text',
              err_msg: '',
            },
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: false,
              error: false,
              type: 'dropdown',
              err_ms: '',
            },
          });
        });
      } else {
        multi_language_.push(...Tab_multi);
      }
      setMultiLanguage(multi_language_.concat(Tab_multi.filter(f => !(multi_language_.map(v => v["lang-code"].value).includes(f["lang-code"].value)))))
    }
  }, [editData, languages]);

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
    let multi_lang_ = multi_language.filter(f => f[newConstants.TICKET_PRICE_COMMENTS_TITLE].value != "")
    if (!localFields_validation.err) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createAttractionTicketPriceComments(localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          getData();
          setLoader(false);
          setAddEdit(false);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(updateAttractionTicketPriceComments(editData[newConstants.TICKET_PRICE_COMMENTS_KEY], localFields, multi_lang_),
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
          getData();
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.fillrequired" /> });
    }
  };

  return localFields.hasOwnProperty(newConstants.TICKET_PRICE_COMMENTS_DESC) ? (
    <Row padding={[10]}>
      <Column>
        <Row>
          <Column md={3} padding={[10, 5]}>
            <TextField
              error={false}
              id="outlined-error-helper-text"
              label={<LanguageConfig id="event.tickettitle" />}
              name={newConstants.TICKET_PRICE_COMMENTS_TITLE}
              value={localFields[newConstants.TICKET_PRICE_COMMENTS_TITLE].value}
              onChange={stateUpdater}
              error={
                localFields[newConstants.TICKET_PRICE_COMMENTS_TITLE].error &&
                localFields[newConstants.TICKET_PRICE_COMMENTS_TITLE].is_require
              }
              helperText={
                localFields[newConstants.TICKET_PRICE_COMMENTS_TITLE].error &&
                  localFields[newConstants.TICKET_PRICE_COMMENTS_TITLE].is_require
                  ? localFields[newConstants.TICKET_PRICE_COMMENTS_TITLE].err_msg
                  : ''
              }
              variant="outlined"
            />
          </Column>
          <Column md={3} padding={[10, 5]}>
            <TextField
              error={false}
              id="outlined-error-helper-text"
              label={<LanguageConfig id="general.description" />}
              name={newConstants.TICKET_PRICE_COMMENTS_DESC}
              value={localFields[newConstants.TICKET_PRICE_COMMENTS_DESC].value}
              onChange={stateUpdater}
              error={
                localFields[newConstants.TICKET_PRICE_COMMENTS_DESC].error &&
                localFields[newConstants.TICKET_PRICE_COMMENTS_DESC].is_require
              }
              helperText={
                localFields[newConstants.TICKET_PRICE_COMMENTS_DESC].error &&
                  localFields[newConstants.TICKET_PRICE_COMMENTS_DESC].is_require
                  ? localFields[newConstants.TICKET_PRICE_COMMENTS_DESC].err_msg
                  : ''
              }
              variant="outlined"
            />
          </Column>
          {editData ? (
            <Column md={3} padding={[0, 10]} center>
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
                label={<LanguageConfig id="general.isactive" />}
              />
            </Column>
          ) : (
            ''
          )}
          <Row>
            <Column md={6} padding={[7]}>
              <GeneralLanguageContainer
                multi_language={multi_language}
                multiStateUpdater={multiStateUpdater}
                constant={newConstants.TICKET_PRICE_COMMENTS_TITLE}
                fieldLabel='event.tickettitle'
                isMoreFields={{ type: 'text', constant: newConstants.TICKET_PRICE_COMMENTS_DESC, fieldLabel: 'general.description' }}
              />
            </Column>
          </Row>
          <Column right>
            <Row>
              <Column md={8}></Column>
              <Column right md={4}>
                <Row style={{ placeContent: 'flex-end' }}>
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
                        <LanguageConfig id={editData ? "general.update" : "general.save"} />
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
                    <LanguageConfig id={"general.cancel"} />
                  </Button>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      </Column>
    </Row>
  ) : (
    <p>A</p>
  );
};