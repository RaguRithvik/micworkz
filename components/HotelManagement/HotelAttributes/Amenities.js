import React from 'react';
import { Container, Box, Checkbox, Button } from "@material-ui/core";
import { Row, Column, Text } from "../../../Core";
import { makeStyles } from "@material-ui/core/styles";
import NearbyPlace from "./NearbyPlace";
import DescInformation from "./DescInformation";
import IssuesHotel from "./IssuesHotel";
// import styles from "./style/Nearybyplace.module.css";
// import HotelLanguage from "./HotelLanguage";
const useStyles = makeStyles((theme) => ({
    RoomAmenitiesSection: { width: '100%', float: 'left', },
    Roomcommonheader: { fontSize: '30px', marginBottom: '11px', },
    RoomCategoryre: { width: '100%', position: 'relative', },
    RoomCategoryservices: { position: 'absolute', right: '10px', top: '10px', },
    RoomAmenityAdded: { fontWeight: '700', },
    RoomAmenitiesInformation: { listStyleType: 'none', fontSize: '14px', position: 'relative', marginTop: '10px', },
    HotelCheckernow: { position: 'absolute', left: '0px', top: '10px', padding: '0px 0px 0px 40px', }
}));
const Amenities = () => {
    const classes = useStyles();
    const amenitydata = [
        { rooms: "Fitness Center" }, { rooms: "Swimming pool" }, { rooms: " Anti-viral cleaning products" }, { rooms: "First aid kit" }, { rooms: "Car parking" },
        { rooms: "Safe dining setup" }, { rooms: "Cashless payment service" }, { rooms: "Hand sanitizer" }, { rooms: "Daily disinfection in all rooms" },
        
    ];
    const amenitytype = [
        {rooms: "Hot water linen and laundry washing"},{rooms: "Staff trained in safety protocol"},{rooms: "Daily disinfection in common areas"},
        {rooms: "Hygiene certification"},{rooms: "Temperature check for guests and staff"},{rooms: "Doctor/nurse on call"},
        {rooms: "hysical distancing of at least 1 meter"},{rooms: "Face coverings on staff"},{rooms: "Professional-grade sanitizing services"},
    ];
    return (

        <div>
            <section className={classes.RoomAmenitiesSection}>
                <Box className={classes.RoomCategoryre}>
                    <h1 className={classes.Roomcommonheader}>Amenities</h1>
                    <Box className={classes.RoomCategoryservices}>
                        <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add type</Button>
                    </Box>
                </Box>
                <Container style={{margin: '20px 0px',}}>
                    <Box className={classes.RoomCategoryre}>
                    <Text><b>Amenities Type</b></Text>
                        <Box className={classes.RoomCategoryservices}>
                            <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add</Button>
                        </Box>
                    </Box>
                    <Row>

                        {amenitydata.map((val, index) => (
                            <Column md="3" padding={[0, 10]}>
                                <Box className={classes.RoomAmenitiesInformation}>
                                    <li><Checkbox
                                        size="small"
                                        color="primary"
                                        inputProps={{ "aria-label": "uncontrolled-checkbox" }} /></li>
                                    <Box className={classes.HotelCheckernow}>
                                        <li>{val.rooms}</li>
                                    </Box>
                                </Box>
                            </Column>
                        ))}
                    </Row>
                </Container>
                <Container style={{margin: '20px 0px',}}>
                    <Box className={classes.RoomCategoryre}>
                        <Text><b>Amenities Now</b></Text>
                        <Box className={classes.RoomCategoryservices}>
                            <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add</Button>
                        </Box>
                    </Box>
                    <Row>
                        {amenitytype.map((val, index) => (
                            <Column md="3" padding={[0, 10]}>
                                <Box className={classes.RoomAmenitiesInformation}>
                                    <li><Checkbox
                                        size="small"
                                        color="primary"
                                        inputProps={{ "aria-label": "uncontrolled-checkbox" }} /></li>
                                    <Box className={classes.HotelCheckernow}>
                                        <li>{val.rooms}</li>
                                    </Box>
                                </Box>
                            </Column>
                        ))}
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default Amenities;