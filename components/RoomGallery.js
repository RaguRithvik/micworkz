import React from 'react';
import { Container, Box, Checkbox, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Column, Text } from "../../Core";

const useStyles = makeStyles((theme) => ({
    ImageSectionNow: {width: '100%', float: 'left', padding: '10px 0px',},
    GalleryRoomImages: {position: 'relative',},
    addBtnInformer: {position: 'absolute', right: '0px', top: '10px',},
    addBtnInformertype: {position: 'absolute', right: '0px', top: '0px',},
    ImageGalleryNow: {marginBottom: '10px',},
    ImageGalleryHeader: {fontSize: '35px', marginBottom: '20px',},
    ImageGalleryContent: {width: '100%',},
}))
const dataImage=[
    {img: "/images/hotel/hotel1.jpg"},{img: "/images/hotel/hotel2.jpg"},{img: "/images/hotel/hotel3.jpg"},{img: "/images/hotel/hotel4.jpg"},
    {img: "/images/hotel/hotel5.jpg"},
]
const dataImagenow=[
    {img: "/images/hotel/hotel6.jpg"},{img: "/images/hotel/hotel7.jpg"},{img: "/images/hotel/hotel8.jpg"},
    {img: "/images/hotel/hotel9.jpg"},
]
const RoomGallery=()=>{
const classes = useStyles();
    return(
        <div>
            <section className={classes.ImageSectionNow}>
               <Box className={classes.GalleryRoomImages}>
                   <h1 className={classes.ImageGalleryHeader}>Image Gallery</h1>
                   <Box className={classes.addBtnInformer}>
                        <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add type</Button>
                   </Box>
                </Box>
                <Container> 
                    <Box className={classes.GalleryRoomImages}>
                        <h3 className={classes.ImageGalleryNow}>Image Gallery Type</h3>
                        <Box className={classes.addBtnInformertype}>
                                <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add</Button>
                        </Box>  
                    </Box>
                    <Row>
                        {dataImage.map((val, index) => (
                        <Column md="3" padding={[10,10]}>
                            <Box className={classes.ImageEncriptationnow}>
                                <img src={val.img} className={classes.ImageGalleryContent}></img>
                            </Box>                      
                        </Column>
                        ))} 
                    </Row>
                </Container>
                <Container> 
                    <Box className={classes.GalleryRoomImages}>
                    <h3 className={classes.ImageGalleryNow}>Image Gallery Now</h3>
                    <Box className={classes.addBtnInformertype}>
                            <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add</Button>
                    </Box>
                    </Box>
                    <Row>
                        {dataImagenow.map((val, index) => (
                        <Column md="3" padding={[10,10]}>
                            <Box className={classes.ImageEncriptationnow}>
                                <img src={val.img} className={classes.ImageGalleryContent}></img>
                            </Box>                      
                        </Column>
                        ))} 
                    </Row>
                </Container>
               
            </section>
        </div>
    );

}

export default RoomGallery;