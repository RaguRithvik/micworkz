import React from 'react';
import  { Container, Box, Checkbox, Button,Table,TableBody,TableContainer,TableCell,TableHead,TableRow,Paper } from "@material-ui/core";
import { Row, Column, Text, } from "../../../Core";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./style/Nearybyplace.module.css";
const useStyles = makeStyles((theme) => ({
    NearyByplacesection: {width: '100%', float: 'left'},
    Roomcommonheader: {padding: '10px 0px',},
    NtearybyIncomeplace: {width: '100%',},
    NearyByplacernow: {fontSize: '25px',},
    SingaporeImagesshow: {width: '100%', maxWidth: '350px', minWidth: '100%',},
    Mouse_Over_me: {color: '#1e7be3',},
    Landmarkvalue: {marginTop: '0px',listStyleType: 'none',},
    Landmarkvaluenow: {marginTop: '0px', cursor: 'pointer', listStyleType: 'none', color: '#3d93f3',},
    NearybyPlaceINformer: {fontSize: '30px', padding: '10px 0px',position:"relative",marginLeft:-7},
    LandmarkHideCheckbox: {visibility: 'hidden',},
    addTyperNowers: {position: 'relative',},
    LandmarkInformerNow: {position: 'absolute', top: '0px', right: '10px',}
}));
const NearybyPlace=()=>{
const nearybydata=[
    {popularmark: "Popular landmarks Singapore Flyer - 1.6 km", img: "/images/payment-declined.png", landmarkdistance: "1$ shop here - 30 m"},
    {popularmark: "Gardens By The Bay East - 2.1 km", img: "/images/payment-declined.png",landmarkdistance: "Streetart - 90 m", },
    {popularmark: "Orchard Road - 2.2 km", img: "/images/payment-declined.png",landmarkdistance: "Doinky Doodles! - 110 m" },
    {popularmark: "Cloud Forest - 2.3 km", img: "/images/payment-declined.png",landmarkdistance: "Raffles Hospital - 130 m" },
    {popularmark: "Chinatown - 2.7 km", img: "/images/payment-declined.png",landmarkdistance: "Polar Bear Gallery - 130 m" },
    {popularmark: "Singapore Botanic Gardens - 4.8 km", img: "/images/payment-declined.png", landmarkdistance: "Polar Bear Gallery - 130 m" },
    {popularmark: "National Orchid Garden - 4.9 km", img: "/images/payment-declined.png",landmarkdistance: "House of Japan - 140 m" },
    {popularmark: "Night Safari - 13.4 km", img: "/images/payment-declined.png",landmarkdistance: "Sultan Mosque - 140 m" },
    {popularmark: "Singapore Zoo - 13.4 km", img: "/images/payment-declined.png", landmarkdistance: "Collezione - 150 m"},
];

const classes = useStyles();
    return(
        <div>
           <Container>
                <Box className={classes.NearyByplacesection}>
                        <h1 className={classes.NearybyPlaceINformer}>Nearyby Place</h1>
                        <Row>                            
                            <Column md={12}>
                            <Paper className={styles.LanguageSlectedColorchange}>
                                <TableContainer className={classes.TableContain}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className={classes.tableHeadTuple}><b>Popular landmarks</b></TableCell>
                                                <TableCell className={classes.tableHeadTuple}><b>Nearby landmarks</b></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {nearybydata.map((val, index) => (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className={classes.tableHeadTuple}><div className={styles.dropdown}>
                                                <Checkbox
                                                    size="small"
                                                    color="primary"
                                                    inputProps={{ "aria-label": "uncontrolled-checkbox" }} />{val.popularmark}
                                                <div className={styles.dropdownContent}>
                                                    <img src={val.img} className={classes.SingaporeImagesshow}/>
                                                </div>
                                            </div></TableCell>
                                                <TableCell className={classes.tableHeadTuple}>{val.landmarkdistance}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                         ))} 
                                    </Table>
                                </TableContainer>     
                           </Paper>
                            </Column>
                        </Row>
                </Box>

           </Container>
        </div>
    );
}
export default NearybyPlace;