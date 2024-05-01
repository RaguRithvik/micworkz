import React, { useState, useEffect, useRef } from 'react';
import { TextField, Text, Card, Row, Column, Loader, CustomAlert, DemandDropDown } from '../../../core';
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
import { fade, makeStyles } from '@material-ui/core/styles';
import {
  createRoomPriceComments,
} from '../../../helper/RequestPayLoad';
import { httpPostRequest, validator } from '../../../helper/JsHelper';
import { constants, newConstants } from '../../../helper/constants';
import { useStore } from '../../../helper/Store';
import LanguageConfig from "../../../helper/LanguageConfig";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    minWidth: 140,
    height: 40,
    margin: 5,
    width: '30%',
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

export default function Setup({commentsFlag,setCommentflag,loadComments}) {
  const classes = useStyles();
  const { languages, setAlertMsg } = useStore();


  return (
    <div>
            <EditContainer
              setAlertMsg={setAlertMsg}
              classes={classes}
              commentsFlag={commentsFlag}
              setCommentflag={setCommentflag}
              loadComments={loadComments}
            />
    </div>
  );
}

const EditContainer = ({ classes,setAlertMsg,loadComments,setCommentflag,commentsFlag}) => {
  const [localFields, setLocalFields] = useState([]);
  const [multi_language, setMultiLanguage] = useState([]);
  const [loader, setLoader] = useState(false);
  const { languages ,copylanguages} = useStore();
  useEffect(() => {
      setLocalFields({
        [newConstants.ROOM_PRICE_COMMENTS_TITLE]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.ROOM_PRICE_COMMENTS_DESC]: {
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
          is_require: true,
          error: false,
          type: 'text',
          err_msg: '',
        },
       [newConstants.ROOM_PRICE_COMMENTS_TITLE]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
        [newConstants.ROOM_PRICE_COMMENTS_DESC]: {
          value: '',
          is_require: true,
          error: false,
          min_length: 2,
          max_length: null,
          type: 'text',
          err_msg: '',
        },
      }))
      setMultiLanguage(Tab_multi)
    
  }, [languages]);

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
    let multi_lang_ = multi_language.filter(f => f[newConstants.ROOM_PRICE_COMMENTS_TITLE].value != "")
    if (!localFields_validation.err) {
      setLoader(true)
        let res = await httpPostRequest(createRoomPriceComments(localFields, multi_lang_));
        if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
          setLoader(false);
          setCommentflag(false);
          loadComments()
          setAlertMsg({ type: 'success', msg: <LanguageConfig id="roompricecomment.successfullysave" /> });
        } else {
          setLoader(false);
          setAlertMsg({ type: 'error', msg: <LanguageConfig id="roompricecomment.tryagain" /> });
        }
      
    } else {
      setAlertMsg({ type: 'error', msg: <LanguageConfig id="roompricecomment.fillrequired" /> });
    }
  };

  return localFields.hasOwnProperty(newConstants.ROOM_PRICE_COMMENTS_DESC) ? (
    <Row padding={[10]}>
      <Column>
        <Row>
          <Column md={6} padding={[10, 5]}>
            <TextField
              label={<LanguageConfig id="roompricecomment.title" />}
              name={newConstants.ROOM_PRICE_COMMENTS_TITLE}
              value={localFields[newConstants.ROOM_PRICE_COMMENTS_TITLE].value}
              onChange={stateUpdater}
              error={
                localFields[newConstants.ROOM_PRICE_COMMENTS_TITLE].error
              }
              helperText={localFields[newConstants.ROOM_PRICE_COMMENTS_TITLE].err_msg}
              required={localFields[newConstants.ROOM_PRICE_COMMENTS_TITLE].is_require}
            />
          </Column>
          <Column md={6}padding={[10, 5]}>
            <TextField
              label={<LanguageConfig id="roompricecomment.description" />}
              name={newConstants.ROOM_PRICE_COMMENTS_DESC}
              value={localFields[newConstants.ROOM_PRICE_COMMENTS_DESC].value}
              onChange={stateUpdater}
              error={
                localFields[newConstants.ROOM_PRICE_COMMENTS_DESC].error
              }
              helperText={
                localFields[newConstants.ROOM_PRICE_COMMENTS_DESC].err_msg
              }
              required={localFields[newConstants.ROOM_PRICE_COMMENTS_DESC].is_require}
            />
          </Column>
          {/* {editData && (
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
                label={<LanguageConfig id="roompricecomment.isactive" />}
              />
            </Column>)
          } */}
          <Row>
          <Column md={12} padding={[7]}>
          <LanguageContainer copylanguages={copylanguages} classes={classes} languages={languages} multi_language={multi_language} multiStateUpdater={multiStateUpdater} />
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
                      {loader && (
                        <Column md={1} xs={1} sm={1} center middle>
                          <Loader size={14} color={'white'} />
                        </Column>)
                      }
                      <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} center middle sm={loader ? 11 : 12}>
                        <LanguageConfig id={ "save"} />
                      </Column>
                    </Row>
                  </Button>
                  <Button
                    onClick={() => {
                      setCommentflag(false);
                    //   setEditData(null);
                    }}
                    className={classes.closeButton}
                    variant="contained">
                    <LanguageConfig id="roompricecomment.cancel" />
                  </Button>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      </Column>
    </Row>
  ) : (
    <p></p>
  );
};

const LanguageContainer = ({ classes, multi_language, multiStateUpdater ,languages,copylanguages}) => {
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
                        <TableCell className={classes.tableHeadTuple}>Title</TableCell>
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
                                label={"Title"}
                                type="text"
                                value={val[newConstants.ROOM_PRICE_COMMENTS_TITLE].value}
                                name={newConstants.ROOM_PRICE_COMMENTS_TITLE}
                                error={val[newConstants.ROOM_PRICE_COMMENTS_TITLE].error}
                                onChange={(e) => multiStateUpdater(e, index)}
                                helperText={val[newConstants.ROOM_PRICE_COMMENTS_TITLE].err_msg}
                              />
                            </TableCell>
                            <TableCell className={classes.tableBodyTuple}>
                              <TextField
                                label={"Description"}
                                type="text"
                                value={val[newConstants.ROOM_PRICE_COMMENTS_DESC].value}
                                name={newConstants.ROOM_PRICE_COMMENTS_DESC}
                                error={val[newConstants.ROOM_PRICE_COMMENTS_DESC].error}
                                onChange={(e) => multiStateUpdater(e, index)}
                                helperText={val[newConstants.ROOM_PRICE_COMMENTS_DESC].err_msg}
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
