import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import { Phone,Email } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import { Row, Column, Image, Card, Text } from "../../core";
import { toLowerCase, callToMobile, openEmail, splitNumberText } from "../../helper/JsHelper";
import { Paper, Tabs, Tab, AppBar, Box } from "@material-ui/core";
import Icon from '@material-ui/core/Icon';
import Rooms from './Rooms';
import Amenities from './Amenities';
import Gallery from "./Gallery";
import Carousel from 'react-material-ui-carousel'

const useStyles = makeStyles((theme) => ({
     currency:{

     },
     maxPrice:{
         paddingLeft:5
     },
     minPrice:{
         paddingLeft:5
     },
     til:{
         paddingLeft:5,
         paddingRight:5
     }
}));

export default function Information({data,...props}) {
    const classes = useStyles();
    return(
        
        <Card noShadow padding={[10]} margin={[5,0]} {...props} >
            <Row>
                <Column padding={[5]}>
                   <Text variant={"h1"} component={"h3"} medium >{data.hotelName}</Text>
                </Column>
                {
                    data.hotelDescription.map((desc,desc_index)=>(
                    <Column padding={[5,10]} key={"hotel_description"+desc_index}>
                      <Row>
                          <Column>                            
                            <Text variant={"p"} component={"h2"}  size={18} medium>{desc.title}</Text>
                          </Column>
                          <Column padding={[5]}>                        
                            <Text variant={"p"} component={"h3"}  size={16}>{desc.description}</Text>
                          </Column>

                      </Row>
                    </Column>
                    ))
                }
                
                 
                
                <Column padding={[5]}>
                   <Text variant={"h1"} component={"h3"} medium >Contacts</Text>
                </Column>
                <Column padding={[10,15]} md={6}>
                    <Row middle>
                        <Text bold variant={"p"} component={"h3"} size={16}>Email</Text>
                        {data.hotelAddress&&data.hotelAddress.email1.length>5&&
                        <Column>
                            <Row>
                                <Column md={1} xs={1} sm={1} right center  padding={[5]}>
                                  <Email/>
                                </Column>
                                <Column md={11} xs={11} sm={11}  padding={[5]} center>
                                  <Text  variant={"p"} component={"h3"} size={16}>{data.hotelAddress.email1}</Text>
                                </Column>
                            </Row>
                        </Column>}
                        {data.hotelAddress&&data.hotelAddress.email2.length>5&&
                        <Column>
                            <Row>
                                <Column md={1} xs={1} sm={1}  padding={[5]} right center> 
                                  <Email/>
                                </Column>
                                
                                <Column md={11} xs={11} sm={11}  padding={[5]} center>
                                  <Text  variant={"p"} component={"h3"} size={16}>{data.hotelAddress.email2}</Text>
                                </Column>
                            </Row>
                        </Column>}
                    </Row>
                </Column>

                <Column padding={[10,15]} md={6}>
                    <Row middle>
                        <Text semibold variant={"p"} component={"h3"} size={16}>Phone</Text>
                        {data.hotelAddress&&data.hotelAddress.officePhone1.length>5&&
                        <Column>
                            <Row>
                                <Column md={1} xs={1} sm={1} right center padding={[5]}>
                                  <Phone/>
                                </Column>
                                
                                <Column md={11} xs={11} sm={11}  padding={[5]} center>
                                  <Text   variant={"p"} component={"h3"}  size={16}>{data.hotelAddress.officePhone1}</Text>
                                </Column>
                            </Row>
                        </Column>}
                        {data.hotelAddress&&data.hotelAddress.officePhone2.length>5&&
                        <Column>
                            <Row>
                                <Column md={1} xs={1} sm={1}  right center  padding={[5]}>
                                  <Phone/>
                                </Column>
                                
                                <Column md={11} xs={11} sm={11}  padding={[5]} center>
                                  <Text  variant={"p"} component={"h3"} size={16}>{data.hotelAddress.officePhone2}</Text>
                                </Column>
                            </Row>
                        </Column>}
                    </Row>
                </Column>
            </Row>
        </Card>
    )
}