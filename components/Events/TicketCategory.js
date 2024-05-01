import React, { useState, useEffect } from 'react';
import { TextField, Card, Row, Column, Loader, CustomAlert } from '../../core';
import { Fade, Button, Checkbox, FormControlLabel, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useStore } from '../../helper/Store';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import { createEventTicketCategory, getAllEventTicketCategory, deleteEventTicketCategoryKey, updateEventHotelTicketCategory, getEventTicketCategoryKey, } from '../../helper/RequestPayLoadEvents';
import { constants, newConstants } from '../../helper/constants';
import PrimaryContainer from '../PrimaryContainer';
import GeneralLanguageContainer from '../GeneralLanguageContainer';
import LanguageConfig from "../../helper/LanguageConfig";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
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
    fontWeight: '1000',
    padding: 15,
    width: 'clamp(150px,10vw,300px)',
    minWidth: 150,
    // width: 'clamp(150px,10vw,300px)',
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
  addEdit: {
    margin: '0px 5px',
    backgroundColor: theme.palette.error.main,
  },
  endPadd: {
    placeContent: 'flex-end',
    padding: 8,
  },
  AddBtn: {
    padding: 10,
    backgroundColor: "rgb(26, 43, 71);",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71);",
    },
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
    [newConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: <LanguageConfig id="general.sno" /> },
    [newConstants.TICKET_CATEGORY_NAME]: { is_hide: false, bool: true, label: <LanguageConfig id="event.categoryname" /> },
    [newConstants.LAST_UPDATED_ON]: { is_hide: false, bool: true, label: <LanguageConfig id="general.lastupdatedon" /> },
    [newConstants.LAST_UPDATE_BY]: { is_hide: false, bool: true, label: <LanguageConfig id="general.lastupdatedby" /> },
    action: { is_hide: true, show: false, bool: true, label: <LanguageConfig id="general.action" /> }
  });

  const loadData = async () => {
    if (!addEdit) {
      setLoader(true);
      let res = await httpPostRequest(getAllEventTicketCategory(search_key, (currIndex - 1) * pageSize + 1, pageSize));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setData(res[newConstants.DATA][newConstants.TICKET_CATEGORYS]);
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
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };

  const editHotelCat = async (key) => {
    let res = await httpPostRequest(getEventTicketCategoryKey(key));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setEditData(res[newConstants.DATA]);
    }
    setAddEdit(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const delHotelCat = async () => {
    if (deleteId != '') {
      const res = await httpPostRequest(deleteEventTicketCategoryKey(deleteId));
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
  };


  return (
    <div>
      <Card margin={[0, 0, 10, 0]}>
        {addEdit &&
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
        }
      </Card>
      <PrimaryContainer
        formName={editData != null && addEdit == true ? formname + "-" + "(Update)" : editData == null && addEdit == true ? formname + "-" + "(Save)" : formname}
        search_key={search_key}
        search={search}
        addEdit={addEdit}
        setAddEdit={setAddEdit}
        currIndex={currIndex}
        maxPage={maxPage}
        addEdit={addEdit}
        setCurrIndex={setCurrIndex}
        setPageSize={setPageSize}
        pageSize={pageSize}
        showCol={showCol}
        setShowCol={setShowCol}
        loadData={loadData}
        data={data}
        filter_object={newConstants.ROW_NUMBER}
        editRow={editHotelCat}
        deleteRow={setDeleteId}
        action_key={newConstants.TICKET_CATEGORY_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="general.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={delHotelCat}
        />
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, editData, setEditData, addEdit, setAddEdit, setAlertMsg }) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const { languages } = useStore();
  useEffect(() => {
    if (!editData) {
      setLocalFields({
        [newConstants.TICKET_CATEGORY_NAME]: {
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
        [newConstants.TICKET_CATEGORY_NAME]: {
          value: "",
          is_require: false,
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
        [newConstants.TICKET_CATEGORY_NAME]: {
          value: editData[newConstants.TICKET_CATEGORY_NAME],
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.IS_ACTIVE]: {
          value: editData[newConstants.IS_ACTIVE],
          is_require: true,
          error: false,
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
        [newConstants.TICKET_CATEGORY_NAME]: {
          value: "",
          is_require: false,
          error: false,
          min_length: 1,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      let multi_language_ = [];
      if (editData[newConstants.TICKET_CATEGORY_LANGUAGES] && editData[newConstants.TICKET_CATEGORY_LANGUAGES].length) {
        editData[newConstants.TICKET_CATEGORY_LANGUAGES].forEach((value) => {
          multi_language_.push({
            [newConstants.LANG_CODE]: {
              value: value[newConstants.LANG_CODE],
              is_require: true,
              error: false,
              type: 'dropdown',
              err_msg: '',
            },
            [newConstants.TICKET_CATEGORY_NAME]: {
              value: value[newConstants.TICKET_CATEGORY_NAME],
              is_require: false,
              error: false,
              min_length: 1,
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
    let multi_lang_ = multi_language.filter(f => f[newConstants.TICKET_CATEGORY_NAME].value != "")
    if (!localFields_validation.err) {
      setLoader(true);
      if (editData == null) {
        let res = await httpPostRequest(createEventTicketCategory(localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setLoader(false);
          setAddEdit(false);
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
      } else {
        let res = await httpPostRequest(updateEventHotelTicketCategory(editData[newConstants.TICKET_CATEGORY_KEY], localFields, multi_lang_),
        );
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setLoader(false);
          setAddEdit(false);
          setEditData(null);
          setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
        }
      }
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="general.fillrequired" /> });
    }
  };

  return (
    <div>
      {localFields.hasOwnProperty(newConstants.TICKET_CATEGORY_NAME) ? (
        <Row padding={[10]}>
          <Column>
            <Row>
              <Column md={3} padding={[10, 5]}>
                <TextField
                  label={<LanguageConfig id={"event.categoryname"} />}
                  name={newConstants.TICKET_CATEGORY_NAME}
                  value={localFields[newConstants.TICKET_CATEGORY_NAME].value}
                  onChange={stateUpdater}
                  error={localFields[newConstants.TICKET_CATEGORY_NAME].error}
                  helperText={localFields[newConstants.TICKET_CATEGORY_NAME].err_msg}
                  required={localFields[newConstants.TICKET_CATEGORY_NAME].is_require}
                />
              </Column>

              {editData &&
                localFields[newConstants.IS_ACTIVE] &&
                localFields[newConstants.IS_ACTIVE].hasOwnProperty('value') && (
                  <Column md={3} padding={[10, 20]} center>
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
                      label={<LanguageConfig id={"general.isactive"} />}
                    />
                  </Column>
                )}
              <Row>
                <Column md={6} padding={[7]}>
                  <GeneralLanguageContainer
                    multi_language={multi_language}
                    multiStateUpdater={multiStateUpdater}
                    constant={newConstants.TICKET_CATEGORY_NAME}
                    fieldLabel='event.categoryname'
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
      ) : null}
    </div>
  );
};
