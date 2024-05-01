import React from 'react';
import { Container, Box,Checkbox,Button} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Column, Text } from "../../../Core";
const useStyles = makeStyles((theme) => ({
    HotelLanguageSection: {width: '100%', float: 'left', marginTop: '20px',},
    LanguageDouter: {listStyleType: 'none',},
    Roomcommonheader: { padding: '10px 0px', },
    RoomAmenitiesInformation: { listStyleType: 'none', fontSize: '14px', position: 'relative', marginTop: '10px', },
    HotelCheckernow: { position: 'absolute', left: '0px', top: '10px', padding: '0px 0px 0px 40px', },
    LanguageInformationnower: {position: 'relative',},
    LanguageHoredcheckup: {position: 'absolute', top: '10px', right: '0px',},
    Languageheadernow: {fontSize: '35px', marginBottom: '20px',},
    LanguagesInformerdatanew: {position: 'relative', },
    IncluededAddedData: {position:'absolute', top: '0px', right: '0px',},
}));
const amenitydata= [
    {rooms: "Free wifi"},{rooms: "Air conditioning"},{rooms: "Free instant Cofee"},{rooms: "Slippers"},{rooms: "Bathrobes"},{rooms: "Hair dryer"},
    {rooms: "Telephone"},{rooms: "In room safe box"},  
];
const amenitytype= [
    {rooms: "Emergency box"},{rooms: "Towels"},{rooms: "Cofee Tea maker"},{rooms: "Mirror"},{rooms: "Shower"},{rooms: "Satllite/Cable Channel"},
];
const RoomAmenities = () => {
    const classes = useStyles();
    return (
        <div>
        <section className={classes.HotelLanguageSection}>
            
            <Box className={classes.LanguagesInformerdatanew}>
                <h3 className={classes.Languageheadernow}>Room Amenities</h3>
                <Box className={classes.IncluededAddedData}>
                    <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add type</Button>
                </Box>
            </Box>
            <Container>
                <Box className={classes.LanguageInformationnower}>
                     <h3 className={classes.Roomcommonheader}>Room Amenities Types</h3>
                     <Box className={classes.LanguageHoredcheckup}>
                        <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add</Button>
                      </Box>
                </Box>
                <Row>
                {amenitydata.map((val, index) => (
                    <Column md="3" padding={[0,10]}>
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
            <Container>
                <Box className={classes.LanguageInformationnower}>
                     <h3 className={classes.Roomcommonheader}>Room Amenities Now</h3>
                     <Box className={classes.LanguageHoredcheckup}>
                        <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add</Button>
                      </Box>
                </Box>
                <Row>
                {amenitytype.map((val, index) => (
                    <Column md="3" padding={[0,10]}>
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


export default RoomAmenities;