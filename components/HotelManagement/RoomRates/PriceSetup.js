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

const priced=[
    {comment: "Normal"},{comment: "Silver"},{comment: "Gold"},{comment: "Diamond"}, {comment: "Platinum"}
];

const pricednow=[
    {comment: "Normal"},{comment: "Silver"},{comment: "Gold"},{comment: "Diamond"}, {comment: "Platinum"}
];

const PriceSetup=()=>{
const classes = useStyles();
    return(
        <div>
            <section className={classes.HotelLanguageSection}>
                
                <Box className={classes.LanguagesInformerdatanew}>
                    <h3 className={classes.Languageheadernow}>Price Setup</h3>
                    <Box className={classes.IncluededAddedData}>
                        <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add type</Button>
                    </Box>
                </Box>
                <Container>
                    <Box className={classes.LanguageInformationnower}>
                         <h3 className={classes.Roomcommonheader}>Price Setup Types</h3>
                         <Box className={classes.LanguageHoredcheckup}>
                            <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add</Button>
                          </Box>
                    </Box>
                    <Row>
                    {priced.map((val, index) => (
                        <Column md="3" padding={[0,10]}>
                           <Box className={classes.RoomAmenitiesInformation}>
                                <li><Checkbox
                                    size="small"
                                    color="primary"
                                    inputProps={{ "aria-label": "uncontrolled-checkbox" }} /></li>
                                <Box className={classes.HotelCheckernow}>
                                    <li>{val.comment}</li>
                                </Box>
                            </Box>
                        </Column> 
                        ))}   
                    </Row>    
                </Container>
                <Container>
                    <Box className={classes.LanguageInformationnower}>
                         <h3 className={classes.Roomcommonheader}>Price Setup Now</h3>
                         <Box className={classes.LanguageHoredcheckup}>
                            <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add</Button>
                          </Box>
                    </Box>
                    <Row>
                    {pricednow.map((val, index) => (
                        <Column md="3" padding={[0,10]}>
                           <Box className={classes.RoomAmenitiesInformation}>
                                <li><Checkbox
                                    size="small"
                                    color="primary"
                                    inputProps={{ "aria-label": "uncontrolled-checkbox" }} /></li>
                                <Box className={classes.HotelCheckernow}>
                                    <li>{val.comment}</li>
                                </Box>
                            </Box>
                        </Column> 
                    ))}   
                    </Row>    
                </Container>
            </section>
        </div>
    );
};
export default PriceSetup;