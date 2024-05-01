import React, { useState, useEffect, useRef } from 'react';
import { TextField, Text, Card, Row, Column, Glyphi, Loader, CustomAlert, DemandDropDown } from '../../core';
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
  Paper,
  MenuItem
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useStore } from '../../helper/Store';
import { Delete, Edit } from '@material-ui/icons';
import { validator, httpPostRequest } from '../../helper/JsHelper';
import {
  getAllUsers,
  getClientBranchMenuMas,
  createUser,
  deleteUser,
  getClientByKey,
  updateUser
} from '../../helper/RequestPayLoadUser';
import { newConstants, constants, userConstants } from '../../helper/constants';
import PrimaryContainer from '../PrimaryContainer';
import LanguageConfig from "../../helper/LanguageConfig";
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  saveButton: {
    minWidth: 100,
    height: 40,
    margin: 5,
    backgroundColor: "rgb(26, 43, 71);",
    color: "white",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71);",
    },
  },
  AddBtn: {
    padding: 10,
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
  endPadd: {
    placeContent: 'flex-end',
    padding: 8,
  },
  Bold: {
    fontWeight: 'bold',
  },
  editContainer: {
    margin: '0px 0px 10px 0px',
    width: '100%',
  },
}));

export default function Setup() {
  const classes = useStyles();
  const [addEdit, setAddEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const { languages, setAlertMsg } = useStore();
  const [deleteId, setDeleteId] = useState('');

  const [clientBranches, setClientBranches] = useState([]);
  const [menuRights, setMenuRights] = useState([]);

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    [userConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: "SNO" },
    [userConstants.USER_NAME]: { is_hide: false, bool: true, label: "User Name" },
    [userConstants.CREATED_BY]: { is_hide: false, bool: true, label: "Created By" },
    [userConstants.CREATED_ON]: { is_hide: false, bool: true, label: "Created On" },
    [userConstants.LAST_UPDATE_BY]: { is_hide: false, bool: true, label: "Updated By" },
    [userConstants.LAST_UPDATE_ON]: { is_hide: false, bool: true, label: "Updated On" },
    action: { is_hide: true, show: false, bool: true, label: "Action" }
  });

  const loadData = async () => {
    if (!addEdit) {
      setLoader(true);
      let res = await httpPostRequest(getAllUsers(search_key, (currIndex - 1) * pageSize + 1, pageSize));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setData(res[newConstants.DATA][userConstants.CLIENT_USER_LIST]);
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
  };

  const loadBranchesData = async () => {
    let res = await httpPostRequest(getClientBranchMenuMas());
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setClientBranches(res[newConstants.DATA][userConstants.CLIENT_BRANCH_INFOS]);
      setMenuRights(res[newConstants.DATA][userConstants.WEB_MENU_RIGHTS]);
    } else {
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  useEffect(() => {
    loadBranchesData();
  }, []);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };

  const editUserHandler = async key => {
    setAddEdit(false);
    let res = await httpPostRequest(getClientByKey(key));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setEditData(res[constants.DATA]);
      setAddEdit(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAddEdit(false);
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  const deleteUserHandler = async () => {
    if (deleteId !== '') {
      const res = await httpPostRequest(deleteUser(deleteId));
      setDeleteLoader(deleteId);
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setDeleteId('');
        setDeleteLoader('');
        loadData();
        setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
      } else {
        setDeleteId('');
        setDeleteLoader('');
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    } else { setDeleteId('') }
  };

  return (
    <div>
      <Card margin={[0, 0, 10, 0]}>
        {addEdit &&
          <Fade in={addEdit}>
            <EditContainer
              loadData={loadData}
              editData={editData}
              setEditData={setEditData}
              languages={languages}
              setAlertMsg={setAlertMsg}
              setAddEdit={setAddEdit}
              classes={classes}
              clientBranches={clientBranches}
              menuRights={menuRights}
            />
          </Fade>
        }
      </Card>
      <PrimaryContainer
        formName={editData != null && addEdit == true ? "User (Update)" : editData == null && addEdit == true ? "User (Add)" : "Users"}
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
        filter_object={userConstants.ROW_NUMBER}
        editRow={editUserHandler}
        deleteRow={setDeleteId}
        action_key={userConstants.USER_KEY}
        loader={loader}
        deleteLoader={deleteLoader}
        setEditData={setEditData}>
        <CustomAlert
          message={<LanguageConfig id="amenitytype.deletemsg" />}
          open={deleteId != ''}
          setOpen={setDeleteId}
          action={deleteUserHandler}
        />
      </PrimaryContainer>
    </div>
  );
}

const EditContainer = ({ classes, editData, setEditData, setAddEdit, setAlertMsg, clientBranches, menuRights }) => {
  const [userName, setUserName] = useState({ isError: false, value: editData ? editData[userConstants.USER_NAME] : "", msg: "", isRequired: true });
  const [isActive, setIsActive] = useState(editData ? editData[userConstants.IS_ACTIVE] : false);
  const [password, setPassword] = useState({ isError: false, value: "", msg: "", isRequired: true });
  const [confirmPassword, setConfirmPassword] = useState({ isError: false, value: "", msg: "", isRequired: true });
  const [branches, setBranches] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    let branches = [];
    clientBranches.map(el => {
      let isCheck = false, branchKey = '', menuKey = '';
      if (editData) {
        editData[userConstants.USER_BRANCHES].map(data => {
          if (data[userConstants.CLIENT_BRANCH_KEY] === el[userConstants.CLIENT_BRANCH_KEY]) {
            isCheck = true;
            branchKey = data[userConstants.CLIENT_BRANCH_KEY];
            menuKey = data[userConstants.MENU_RIGHTS_MASTER_KEY];
          }
        })
      }
      branches.push({
        isError: false,
        value: { [userConstants.CLIENT_BRANCH_KEY]: branchKey, [userConstants.MENU_RIGHTS_MASTER_KEY]: menuKey },
        msg: '',
        isRequired: isCheck,
        isChecked: isCheck
      })
    });
    setBranches(branches);
  }, [clientBranches, editData]);

  const branchesHandler = (e, i) => {
    let changerName = e.target.name;
    let value = e.target.value;
    let brancheStateCopy = [...branches];
    if (changerName === userConstants.CLIENT_BRANCH_NAME) {
      brancheStateCopy[i].isRequired = e.target.checked;
      brancheStateCopy[i].isChecked = e.target.checked;
      brancheStateCopy[i].value[userConstants.CLIENT_BRANCH_KEY] = value;
      if (e.target.checked == false) {
        brancheStateCopy[i].isError = false;
        brancheStateCopy[i].msg = "";
      }
    } else if (changerName === userConstants.MENU_RIGHTS_MASTER_NAME) {
      brancheStateCopy[i].value[userConstants.MENU_RIGHTS_MASTER_KEY] = value;
      brancheStateCopy[i].isError = false;
      brancheStateCopy[i].msg = "";
    }
    setBranches(brancheStateCopy);
  }

  const saveUserHandler = async () => {
    console.log('razaa save/update', editData);
    let isOK = true;
    if (!userName.value.trim()) {
      setUserName({ ...userName, isError: true, msg: "This is required field!" });
      isOK = false;
    }

    if (password.value.trim() !== confirmPassword.value.trim()) {
      setConfirmPassword({ ...confirmPassword, isError: true, msg: "Password doesn't match!" });
      isOK = false;
    } else {
      setConfirmPassword({ ...confirmPassword, isError: false, msg: "" });
    }

    if (!editData) {
      if (!password.value.trim()) {
        setPassword({ ...password, isError: true, msg: "This is required field!" });
        isOK = false;
      }

      if (!confirmPassword.value.trim()) {
        setConfirmPassword({ ...confirmPassword, isError: true, msg: "This is required field!" });
        isOK = false;
      }
    }

    let branchesClone = [...branches];
    branchesClone.map(branch => {
      if (branch.isRequired) {
        let branchKey = branch.value[userConstants.CLIENT_BRANCH_KEY];
        let menuKey = branch.value[userConstants.MENU_RIGHTS_MASTER_KEY];
        if (!branchKey || !menuKey) {
          branch.isError = true;
          branch.msg = "This is required field!";
          isOK = false;
        }
      } else {
        branch.isError = false;
        branch.msg = "";
      }
    });
    setBranches(branchesClone);

    if (isOK) {
      setLoader(true);
      let userBranches = [];
      branches.map(branch => {
        if (branch.isRequired) {
          userBranches.push({
            [userConstants.CLIENT_BRANCH_KEY]: branch.value[userConstants.CLIENT_BRANCH_KEY],
            [userConstants.MENU_RIGHTS_MASTER_KEY]: branch.value[userConstants.MENU_RIGHTS_MASTER_KEY]
          });
        }
      });

      let body = {
        [userConstants.USER_NAME]: userName.value,
        [userConstants.USER_BRANCHES]: userBranches
      };

      if (editData) {
        body[userConstants.IS_ACTIVE] = isActive;
        body[userConstants.USER_KEY] = editData[userConstants.USER_KEY];
        if (password.value) {
          body[userConstants.PASSWORD] = password.value;
          body[userConstants.CONFIRM_PASSWORD] = confirmPassword.value;
        }
      } else {
        body[userConstants.PASSWORD] = password.value;
        body[userConstants.CONFIRM_PASSWORD] = confirmPassword.value;
      }

      let res;
      if (editData) {
        res = await httpPostRequest(updateUser(body));
      } else {
        res = await httpPostRequest(createUser(body));
      }
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setAlertMsg({ type: 'success', msg: res[constants.DATA_EXCEPTION].err_msg });
        setLoader(false);
        setAddEdit(false);
      } else {
        setLoader(false);
        setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
      }
    }
  };

  return (
    <div>
      <Row padding={[10]}>
        <Column>
          <Row>
            <Column md={3} padding={[10, 5]}>
              <TextField
                label="User ID"
                name={userConstants.USER_NAME}
                id={userConstants.USER_NAME}
                disabled={editData !== null}
                onChange={e => setUserName({ value: e.target.value, isError: e.target.value === "", msg: e.target.value === "" ? "This is required field!" : "", isRequired: true })}
                value={userName.value}
                helperText={userName.msg}
                error={userName.isError}
                required={userName.isRequired}
              />
            </Column>

            <Column md={3} padding={[10, 5]}>
              <TextField
                type="password"
                label="Password"
                name={userConstants.PASSWORD}
                id={userConstants.PASSWORD}
                onChange={e => setPassword({ value: e.target.value, isError: e.target.value === "" && !editData, msg: e.target.value === "" && !editData ? "This is required field!" : "", isRequired: !editData })}
                value={password.value}
                helperText={password.msg}
                error={password.isError}
                required={password.isRequired}
              />
            </Column>
            <Column md={3} padding={[10, 5]} >
              <TextField
                type="password"
                label="Retype Password"
                name={userConstants.CONFIRM_PASSWORD}
                id={userConstants.CONFIRM_PASSWORD}
                onChange={e => setConfirmPassword({ value: e.target.value, isError: e.target.value === "" && !editData, msg: e.target.value === "" && !editData ? "This is required field!" : "", isRequired: !editData })}
                value={confirmPassword.value}
                helperText={confirmPassword.msg}
                error={confirmPassword.isError}
                required={confirmPassword.isRequired}
              />
            </Column>

            {editData &&
              <Column md={1} padding={[10, 5]}>
                <FormControlLabel
                  labelPlacement="start"
                  label="Active"
                  style={{ justifyContent: "flex-end" }}
                  control={<Checkbox color="primary" name={userConstants.IS_ACTIVE} checked={isActive} onChange={e => setIsActive(e.target.checked)} />}
                />
              </Column>
            }

            <Row>
              <Column md={6}>
                <BranchesContainer
                  classes={classes}
                  branchesHandler={branchesHandler}
                  clientBranches={clientBranches}
                  menuRights={menuRights}
                  branches={branches}
                />
              </Column>
            </Row>

            <Column right>
              <Row>
                <Column md={9}></Column>
                <Column right md={3}>
                  <Row style={{ placeContent: 'flex-end' }}>
                    <Button
                      className={classes.saveButton}
                      variant="contained"
                      color="primary"
                      onClick={loader ? console.log('') : saveUserHandler}>
                      <Row>
                        {loader ? (
                          <Column md={1} xs={1} sm={1} center middle>
                            <Loader size={14} color={'white'} />
                          </Column>
                        ) : null}
                        <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} center middle sm={loader ? 11 : 12}>
                          <LanguageConfig id={editData ? "amenitytype.update" : "save"} />
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
                      <LanguageConfig id={"amenitytype.cancel"} />
                    </Button>
                  </Row>
                </Column>
              </Row>
            </Column>
          </Row>
        </Column>
      </Row>
    </div>
  );
};

const BranchesContainer = ({ classes, branchesHandler, clientBranches, menuRights, branches }) => {
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
                        <TableCell className={classes.tableHeadTuple}>Branch</TableCell>
                        <TableCell className={classes.tableHeadTuple}>Menu Rights</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clientBranches.map((val, index) => (
                        <TableRow key={val[userConstants.CLIENT_BRANCH_KEY]}>
                          {branches.map(el => (
                            <>
                              <TableCell className={classes.tableBodyTuple}>
                                <FormControlLabel
                                  labelPlacement="start"
                                  label={val[userConstants.CLIENT_BRANCH_NAME]}
                                  control={<Checkbox checked={val[userConstants.CLIENT_BRANCH_KEY] === el.value[userConstants.CLIENT_BRANCH_KEY] ? el.isChecked : false} color="primary" value={val[userConstants.CLIENT_BRANCH_KEY]} name={userConstants.CLIENT_BRANCH_NAME} onChange={e => branchesHandler(e, index)} />}
                                />
                              </TableCell>
                              <TableCell className={classes.tableBodyTuple}>
                                <TextField
                                  select
                                  size="small"
                                  id={val[userConstants.CLIENT_BRANCH_KEY]}
                                  name={userConstants.MENU_RIGHTS_MASTER_NAME}
                                  variant="outlined"
                                  defaultValue=''
                                  onChange={e => branchesHandler(e, index)}
                                  label="Menu Rights"
                                  value={val[userConstants.CLIENT_BRANCH_KEY] === el.value[userConstants.CLIENT_BRANCH_KEY] ? el.value[userConstants.MENU_RIGHTS_MASTER_KEY] : ""}
                                  helperText={branches.length > 0 ? branches[index].msg : ""}
                                  error={branches.length > 0 ? branches[index].isError : false}
                                  required={branches.length > 0 ? branches[index].isRequired : false}
                                  style={{width: '100%'}}
                                >
                                  {menuRights.map((option) => (
                                    <MenuItem key={option[userConstants.MENU_RIGHTS_MASTER_KEY]} value={option[userConstants.MENU_RIGHTS_MASTER_KEY]}>
                                      {option[userConstants.MENU_RIGHTS_MASTER_NAME]}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </TableCell>
                            </>
                          ))}
                        </TableRow>
                      ))}
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