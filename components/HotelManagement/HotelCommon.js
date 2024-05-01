import React, { useState ,useEffect} from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Column } from "../../Core";
import { Container, Typography, Box, Tabs, Tab } from "@material-ui/core";
import HotelInformation from "./HotelInformation/HotelInformation";
import RoomAmenities from "./RoomInformation/Amenities/RoomAmenity";
import RoomManage from "./RoomInformation/RoomManage";
import Amenities from "./HotelAttributes/Amenities/Amenities";
import NearbyPlaces from "./HotelAttributes/NearbyPlace/NearbyPlaces";
import IssuesHotel from "./HotelAttributes/IssuesHotel";
import RoomPriceSetup from "./RoomInformation/RoomPriceSetup";
import RoomGallery from "./RoomGallery";
import Roomplans from "./RoomInformation/RoomPlans";
import HotelTagsNew from "./HotelAttributes/HotelTagsNew";
import WholeRoom from "./RoomInformation/WholeRoom"

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
       <Box p={3} style={value != index ?{display:'none'}:{}}>
          <Typography>{children}</Typography>
        </Box> 
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  RouterNavbarInverse: {
    width: "100%",
    float: "left",
},
  RouterInformation: {
  backgroundColor: "#fff",
  boxShadow: "0px 0px 20px #ccc",
  borderRadius: "10px",  
},
  RouterNowmax: { width: "100%" },
  SpacerNower:{flex: '1 1',},
  EventsMenuFalse: { position: "relative" },
  ItemInformationNow: {
    width: "100%",
    float: "left",
    marginTop: '20px',
    backgroundColor: "#fff",
    boxShadow: "0px 0px 20px #ccc",
    borderRadius: "10px",
    padding: "20px 40px 20px 40px",
    [theme.breakpoints.down("xs")]: {
      padding: "50px 30px 20px 30px",
    },
  },
  RoomSetup: {marginTop: '20px',},
  Roomcommonheader: {padding: '10px 0px',},
}));

export default function ScrollableTabsButtonForce() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
  setValue(newValue);
};

  return (
    <div>
      <section className={classes.banner_navbar_content}>
        <div className={classes.banner_slogan}>
          <Container>
            <Box className={classes.EventsMenuFalse}>
              <Box className={classes.RouterNavbarInverse}>
                <Box className={classes.RouterInformation}>
                  <Box className={classes.RouterNowmax}>
                    <Box className={classes.ItemOverSeventh}>
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        style={{ justifyContent: "center" }}
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="scrollable force tabs example"
                      >
                        <Tab
                          label="Hotel Info"
                          
                          {...a11yProps(0)}
                        />
                        <Tab
                          label="Room Info"
                          
                          {...a11yProps(1)}
                        />
                        <Tab
                          label="Hotel Attributes"
                          
                          {...a11yProps(2)}
                        />
                        <Tab
                          label="Images"
                          
                          {...a11yProps(3)}
                        />
                        <Tab
                          label="Room Rates"
                          
                          {...a11yProps(4)}
                        />
                      </Tabs>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box className={classes.ItemInformationNow}>
                <TabPanel value={value} index={0}>
                 <HotelInformation/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <div>
                    <WholeRoom/>
                  </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                   <div>
                     <Amenities/>
                    </div>                    
                <div>
                    <NearbyPlaces/>
                </div >
                <div>
                    <IssuesHotel/>
                </div>
                <div>
                    <HotelTagsNew/>
                </div>
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <RoomGallery/>
                </TabPanel>
                <TabPanel value={value} index={4}>
                <RoomPriceSetup/>
                </TabPanel>
              </Box>
            </Box>
          </Container>
        </div>
      </section>
    </div>
  );
}