import React, { useState, useEffect, useRef } from 'react';
import { TextField, Card, Row, Column, Loader, CustomAlert } from '../../core';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import {
  Fade,
  Button,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import CheckboxTree from 'react-checkbox-tree';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useStore } from '../../helper/Store';
import { httpPostRequest } from '../../helper/JsHelper';
import {
  getAllUsersRole,
  createUserRole,
  deleteUserRole,
  getClientMenuByKey,
  getAllMenu
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
  const { setAlertMsg } = useStore();
  const [deleteId, setDeleteId] = useState('');

  const [menus, setMenus] = useState([]);

  // for pagination
  const [search_key, setSearchKey] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currIndex, setCurrIndex] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [showCol, setShowCol] = useState({
    [userConstants.ROW_NUMBER]: { is_hide: true, bool: true, label: "SNO" },
    [userConstants.MENU_RIGHTS_NAME]: { is_hide: false, bool: true, label: "Menu Config Name" },
    [userConstants.CREATED_BY]: { is_hide: false, bool: true, label: "Created By" },
    [userConstants.CREATED_ON]: { is_hide: false, bool: true, label: "Created On" },
    [userConstants.LAST_UPDATE_BY]: { is_hide: false, bool: true, label: "Updated By" },
    [userConstants.LAST_UPDATE_ON]: { is_hide: false, bool: true, label: "Updated On" },
    action: { is_hide: true, show: false, bool: true, label: "Action" }
  });

  const loadData = async () => {
    if (!addEdit) {
      setLoader(true);
      let res = await httpPostRequest(getAllUsersRole(search_key, (currIndex - 1) * pageSize + 1, pageSize));
      if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
        setData(res[newConstants.DATA].clientWebMenuRightsMasters);
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
    let res = await httpPostRequest(getAllMenu());
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setMenus(res[newConstants.DATA]);
    } else {
      setAlertMsg({ type: 'error', msg: res[constants.DATA_EXCEPTION].err_msg });
    }
  };

  useEffect(() => {
    loadData();
  }, [addEdit, search_key, pageSize, currIndex]);

  useEffect(() => { loadBranchesData() }, []);

  const search = (e) => {
    setSearchKey(e.target.value);
    setCurrIndex(1);
  };

  const editUserHandler = async key => {
    setAddEdit(false);
    let res = await httpPostRequest(getClientMenuByKey(key));
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
      const res = await httpPostRequest(deleteUserRole(deleteId));
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
              setAlertMsg={setAlertMsg}
              setAddEdit={setAddEdit}
              classes={classes}
              menus={menus}
            />
          </Fade>
        }
      </Card>
      <PrimaryContainer
        formName={editData != null && addEdit == true ? "User Role (Update)" : editData == null && addEdit == true ? "User Role (Add)" : "User Role"}
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
        action_key={userConstants.MENU_RIGHTS_MASTER_KEY}
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

const EditContainer = ({ classes, editData, setEditData, setAddEdit, setAlertMsg, menus }) => {
  const [menuRightsName, setMenuRightsName] = useState({ isError: false, value: editData ? editData[userConstants.MENU_RIGHTS_NAME] : "", msg: "", isRequired: true });
  const [isActive, setIsActive] = useState(editData ? editData[userConstants.IS_ACTIVE] : false);
  const [loader, setLoader] = useState(false);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [menuNodes, setMenuNodes] = useState([]);

  useEffect(() => { setMenuNodes(makeNodes(menus)) }, [menus]);
  useEffect(() => {
    if (editData) {
      let checkedMenus = [];
      editData.clientWebMenus.map(el => checkedMenus.push(el.menuKey));
      setChecked(checkedMenus);
    }
  }, [editData]);

  let makeNodes = menus => {
    let nodes = [];
    menus.map(el => {
      let node = {};
      node.value = el.menuKey;
      node.label = el.menuName;
      if (el.children.length > 0) {
        node.children = makeNodes(el.children);
      }
      nodes.push(node);
    });
    return nodes;
  }

  const saveUserHandler = async () => {
    let isOK = true;
    if (!menuRightsName.value.trim()) {
      setMenuRightsName({ ...menuRightsName, isError: true, msg: "This is required field!" });
      isOK = false;
    }

    if (checked.length === 0) {
      setAlertMsg({ type: 'error', msg: 'Please select the applicable menus!' });
      isOK = false;
    }

    if (isOK) {
      setLoader(true);
      let privList = [];
      checked.map(el => privList.push({ [userConstants.MENU_KEY]: el }));
      let body = {
        [userConstants.MENU_RIGHTS_NAME]: menuRightsName.value,
        [userConstants.LIST_PRIVILEGE]: privList
      };

      if(editData){
        body[userConstants.IS_ACTIVE] =  isActive;
        body[userConstants.MENU_RIGHTS_MASTER_KEY] =  editData[userConstants.MENU_RIGHTS_MASTER_KEY];
      }
      
      let res = await httpPostRequest(createUserRole(body));
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
                label="Menu Rights Name"
                name={userConstants.MENU_RIGHTS_NAME}
                id={userConstants.MENU_RIGHTS_NAME}
                onChange={e => setMenuRightsName({ value: e.target.value, isError: e.target.value === "", msg: e.target.value === "" ? "This is required field!" : "", isRequired: true })}
                value={menuRightsName.value}
                helperText={menuRightsName.msg}
                error={menuRightsName.isError}
                required={menuRightsName.isRequired}
              />
            </Column>
            <Column md={3} padding={[10, 5]}>
              <CheckboxTree
                nodes={menuNodes}
                checked={checked}
                expanded={expanded}
                onCheck={data => setChecked(data)}
                onExpand={data => setExpanded(data)}
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