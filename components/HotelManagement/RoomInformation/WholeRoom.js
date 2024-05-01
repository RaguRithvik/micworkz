import React, { useState, useEffect } from 'react';
import { TextField, Text, Card, Row, Column, Loader, CustomAlert, SingelSelectOnDemand, ModalComponent, Touchable } from '../../../core';
import {
  Fade,
  InputLabel,
  Tabs,
  Tab,
  Select,
  Button,
  Typography,
  Box,
  IconButton
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import {httpPostRequest } from '../../../helper/JsHelper';
import {
  getAllRooms
} from '../../../helper/RequestPayLoad';
import PropTypes from 'prop-types';
import RoomPlans from "./RoomPlans"
import { constants, newConstants } from '../../../helper/constants';
// import PrimaryContainer from '..';
import RoomManage from "./RoomManage"
import RoomAmenity from "./Amenities/RoomAmenity"

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
  },
  paper: {
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
    width: 216,
    height: 230,
    overflow: "auto"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabContainer: {
    width: '100%',
  },
  Languageheadernow: {fontSize: '30px', marginBottom: '11px',},
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
  endPadd: {
    placeContent: 'flex-end',
    padding: 8,
  },
  editContainer: {
    margin: '0 0 10px 0px',
  },
  box: {
    flexGrow: 1,
    flexBasis: 0,
  },
  RoomAmenityButton: { fontWeight: '700', width: "66%" },
}));

const WholeRoom = () => {
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [tab, setTab] = useState(0);
  const [loader, setLoader] = useState(false);
  const classes = useStyles()
  const [manageRoom, setManageroom] = useState(false)
  const [storeAmenity,setStoreAmenity]=useState([])
  
  const [tabsData,setTabsData]=useState([])

  useEffect(() => {
    loadRooms()
  }, [])

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const loadRooms = async () => {
    let res = await httpPostRequest(getAllRooms(''));
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setDefaultOptions(
        res[constants.DATA][newConstants.ROOM_CATEGORIES]
      );
    }
  };

const globalState=(index,value)=>{
  let tabsData_ =[...tabsData];
  tabsData_[index] = value 
  setTabsData(tabsData_)

}
console.log(tabsData)

  return (
    <Row >
      <Row>
      <Column >
         <RoomAmenity storeAmenity={storeAmenity} setStoreAmenity={setStoreAmenity}/>
        </Column>
        <Column>
          <Row>
            <Column md={10} xs={10} sm={10}>
            <h3 className={classes.Languageheadernow}>Room Management</h3>
            </Column>
            <Column md={2} xs={2} sm={2} right>
              <Button variant="outlined" color="primary" className={classes.RoomAmenityButton} onClick={() => setManageroom(true)}>Add Rooms</Button>
            </Column>
          </Row>
          <ModalComponent open={manageRoom} setOpen={setManageroom}>
            <RoomManage manageRoom={manageRoom} setManageroom={setManageroom} loadRooms={loadRooms} />
          </ModalComponent>
        </Column>       
        <Column>
          <div className={classes.root}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={tab}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              className={classes.tabs}>
              {defaultOptions.map((value, index) => (
                <Tab label={value["room-name"]} {...a11yProps(index)} />
              ))}
            </Tabs>
            {defaultOptions.map((value, index) => (
              <TabPanel value={tab} index={index} className={classes.tabContainer}>
                <RoomPlans storeAmenity={storeAmenity} globalState={globalState} index={index}/>
              </TabPanel>
            ))}
          </div>
        </Column>
      </Row>
    </Row>
  );
};



const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}> 
        <Box p={3} style={value != index ?{display:'none'}:{}}>
          <Typography>{children}</Typography>
        </Box> 
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


export default WholeRoom
