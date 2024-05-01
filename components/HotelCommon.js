import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Column } from "../../Core";
import { Container, Typography, Box, Tabs, Tab } from "@material-ui/core";
import HotelInformation from "./HotelInformation/HotelInformation";
// import RoomCategory from "./RoomInformation/RoomCategory";
// import RoomSetup from "./RoomInformation/RoomSetup";
import SetupLanguages from "./RoomInformation/SetupLanguages";
import RoomAmenities from "./RoomInformation/RoomAmenities";
import RoomManage from "./RoomInformation/RoomManage";
import Amenities from "./HotelAttributes/Amenities";
import NearbyPlace from "./HotelAttributes/NearbyPlace";
import IssuesHotel from "./HotelAttributes/IssuesHotel";
import DescInformation from "./HotelAttributes/DescInformation";
import RoomGallery from "./RoomGallery";
import RoomPlans from "./RoomRates/RoomPlans";
import PriceComments from "./RoomRates/PriceComments";
import PriceSetup from "./RoomRates/PriceSetup";
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
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
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
                
                  {/* <RoomCategory/>
                  <div className={classes.RoomSetup}>
                    <h3 className={classes.Roomcommonheader}>Room Setup</h3>
                    <RoomSetup/>
                  </div>  */}
                    <SetupLanguages/>
                    <div className={classes.RoomSetup}>
                    <RoomManage/>
                  </div> 
                  <div className={classes.RoomSetup}>
                    <RoomAmenities/>
                  </div> 
                    
                </TabPanel>
                <TabPanel value={value} index={2}>
                   <div className={classes.RoomSetup}>
                     <Amenities/>
                    </div>
                    
                <div className={classes.RoomSetup}>
                    <NearbyPlace/>
                </div >
                <div className={classes.RoomSetup}>
                    <DescInformation/>
                </div>
                <div className={classes.RoomSetup}>
                    <IssuesHotel/>
                </div>
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <RoomGallery/>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <RoomPlans/>
                </TabPanel>
              </Box>
            </Box>
          </Container>
        </div>
      </section>
    </div>
  );
}
