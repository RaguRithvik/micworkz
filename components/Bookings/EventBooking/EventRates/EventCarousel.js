import React from "react";
import { Box, Container } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Row, Column } from "../../../../core";
import { Carousel } from "react-responsive-carousel";
const useStyles = makeStyles((theme) => ({
    AttractionSection: {width: '100%', float: 'left', padding: '10px 0px',},
}));
const dataimage = [
    {
      img: "/images/upcomingevents/events1.jpg",
    },
  
    {
      img: "/images/upcomingevents/events2.jpg",
    },
    
  ];
const AttractionCarousel=()=>{
    const classes = useStyles();
    return(
        <div>
            <section className={classes.AttractionSection}>
                <Container maxWidth="md">
                    <Carouselnow/>
                </Container>
            </section>
        </div>
    )
}

const Carouselnow = () => {
    return (
      <Carousel showThumbs={false} autoPlay="true" interval="4000"
        transitionTime="450"
        emulateTouch="true"
        swipeable="true"
        useKeyboardArrows="true"
        infiniteLoop="true"
      >
        {dataimage.map((val, index) =>
          <div>
            <img alt="" src={val.img} style={{ width: "100%", height: "auto" }} />
            <div className="legend">
            </div>
          </div>
        )}
      </Carousel>
    )
  }



export default AttractionCarousel;