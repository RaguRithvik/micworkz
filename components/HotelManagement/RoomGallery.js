import React,{useState} from 'react';
import { Container, Box, Checkbox, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Column, Text } from "../../Core";
import styles from "./style/HotelRoom.module.css";
const useStyles = makeStyles((theme) => ({
    ImageSectionNow: {width: '100%', float: 'left', padding: '10px 0px',},
    GalleryRoomImages: {position: 'relative',},
    addBtnInformer: {position: 'absolute', right: '0px', top: '10px',},
    addBtnInformertype: {position: 'absolute', right: '0px', top: '0px',},
    ImageGalleryNow: {padding: '10px 0px 0px 0px', fontSize: '16px',},
    ImageGalleryHeader: {fontSize: '30px', marginBottom: '11px',},
    ImageGalleryContent: {width: '100%',},
    ImageGallerytodya: {marginBottom: '10px',},
    InputboxImplimentation: {position: 'absolute', top: '10px', left: '5px',},
    InputFileFealdernow: {listStyleType: 'none', backgroundColor: '#fff', borderRadius: '5px',}

}))
const dataImage = [
    {img: "/images/hotel/hotel1.jpg"},{img: "/images/hotel/hotel2.jpg"},{img: "/images/hotel/hotel3.jpg"},{img: "/images/hotel/hotel4.jpg"},
    {img: "/images/hotel/hotel5.jpg"},
]
const dataImagenow=[
    {img: "/images/hotel/hotel6.jpg"},{img: "/images/hotel/hotel7.jpg"},{img: "/images/hotel/hotel8.jpg"},
    {img: "/images/hotel/hotel9.jpg"},
]
const RoomGallery=()=>{
const classes = useStyles();
const [gallery,setGallery]=useState([])

function handleGallery(value) {
    const currentIndex = gallery.findIndex((f) => f == value);
    if (currentIndex > -1) {
        gallery[currentIndex] = null
        setGallery(gallery.filter((f) => f != null));
    } else {
        setGallery([...gallery, value])
    }
};
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
                        <Text className={classes.ImageGallerytodya}><b>Image Gallery Type</b></Text>
                        <Box className={classes.addBtnInformertype}>
                                <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add</Button>
                        </Box>  
                    </Box>
                    <Row>
                        {dataImage.map((val, index) => (
                        <Column md="3" padding={[10,10]}>
                            
                                <Box className={styles.ImageEncriptationnow}>
                                    
                                    <img src={val.img} className={classes.ImageGalleryContent}></img>
                                    <Box className={styles.CancelButtoned}>
                                          X
                                    </Box>
                                    <Box className={classes.InputboxImplimentation}>
                                    <li  className={classes.InputFileFealdernow}><Checkbox
                                size="small"
                                color="primary"
                                inputProps={{ "aria-label": "uncontrolled-checkbox" }} 
                                checked={gallery.includes(val)}
                                onChange={(e) => handleGallery(val)} /></li>
                                    </Box>
                                </Box> 
                        </Column>
                        ))} 
                    </Row>
                </Container>
                <Container> 
                    <Box className={classes.GalleryRoomImages}>
                    <Text className={classes.ImageGallerytodya}><b>Image Gallery Now</b></Text>
                    <Box className={classes.addBtnInformertype}>
                        <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded}>Add</Button>
                    </Box>
                    </Box>
                    <Row>
                        {dataImagenow.map((val, index) => (
                        <Column md="3" padding={[10,10]}>
                            <Box className={styles.ImageEncriptationnow}>
                                <img src={val.img} className={classes.ImageGalleryContent}></img>    
                                <Box className={styles.CancelButtoned}>
                                    X
                                </Box>
                                <Box className={classes.InputboxImplimentation}>
                                    <li  className={classes.InputFileFealdernow}><Checkbox
                                    size="small"
                                    color="primary"
                                    inputProps={{ "aria-label": "uncontrolled-checkbox" }} /></li>
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
export default RoomGallery;