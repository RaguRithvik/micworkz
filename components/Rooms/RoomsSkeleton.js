import { Divider } from '@material-ui/core';
import React from 'react';
import { Row,Column,Card } from '../../core';  
import Skeleton from '@material-ui/lab/Skeleton';
import { withStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    slider: {
        flexGrow: 1,
        // maxWidth: 500,
    }
}));

export default function RoomsSkeleton() {
    const classes = useStyles();
    return (
        <div> 
            <Row>
                <Column>
                    <Row>
                        <Column md={5} padding={[10]}> 
                        <Card>
                            <Skeleton variant="rect" width={"100%"} height={250}  style={{borderRadius:8}} />
                        </Card>
                        </Column>
                        
                        <Column md={7}>
                            <Row>
                                <Column md={6} padding={[10]}>
                                    <Card noShadow padding={[10,10,5,10]}>
                                        <Row>
                                            <Column padding={[5]} padding={[10,0]}>
                                                <Skeleton variant="rect" width={"100%"} height={12} style={{borderRadius:8}} />
                                            </Column>
                                            <Column>
                                                <Divider/>
                                            </Column> 
                                            <Column padding={[10]}> 
                                                {
                                                    [1,2,3,4,5].map((v,indx)=> <Row key={"Amenities"+indx} padding={[5]}><Skeleton variant="rect" width={10} height={10} style={{borderRadius:8}} /><Skeleton variant="rect" width={"90%"} height={10} style={{borderRadius:8}} /></Row>                                          )   
                                                }
                                            </Column> 
                                            <Column padding={[0]}> 
                                                <Row>
                                                    {
                                                        [1,2].map((val,index)=>(
                                                            <Column md={6}  sm={6}  xs={6} center key={"ci_co"+index} padding={[0,10]} center middle>
                                                                <Skeleton variant="rect" width={"70%"} height={10} style={{borderRadius:8}} />
                                                                <Skeleton variant="rect" width={"50%"} height={18} style={{borderRadius:8,marginTop:5}} />
                                                            </Column> 
                                                        ))
                                                    }
                                                    
                                                </Row>
                                            </Column>
                                        </Row>

                                    </Card>
                                </Column>
                                
                                <Column md={6} padding={[10]}>
                                <Card padding={[20]}>
                                    <Row>
                                        {
                                            [1,2,3,4,5,6].map((val,index)=>(
                                                <Column key={"price_vari_"+index} padding={[5]}><Skeleton variant="rect" width={"80%"} height={10}   style={{borderRadius:8}} /></Column>
                                            ))
                                        }
                                    </Row>
                                    <Skeleton variant="rect" width={"60%"} height={20}   style={{borderRadius:8}} />
                                </Card>
                                </Column>
                            </Row>
                        </Column>
                        <Column>
                        <Row>
                            {
                                [1,2,3,4,5].map((value,index)=>(
                                        <Column md={2} xs={3} sm={3} padding={[5]} key = {"tab_sk_"+index}>
                                            <Skeleton variant="rect" width={"70%"} height={20}/>
                                        </Column>
                                ))
                            } 
                        </Row>
                        </Column>
                    </Row> 
                </Column>  
                <Column padding={[5]}>
                   {
                       [1,2,3,4].map((value,index)=>(
                            <Card margin={[5,0]} padding={[10]} key={"room_collective_"+index}>
                                    <Row>
                                        <Column md={4}>
                                            <Row>
                                                <Column padding={[5]}>
                                                <Skeleton variant="rect" width={"80%"} height={20}  style={{borderRadius:8}} />
                                                </Column>
                                                <Column padding={[5]}>
                                                <Skeleton variant="rect" width={"100%"} height={180}  style={{borderRadius:8}} />
                                                </Column>
                                                <Column padding={[5]}>
                                                    <Row>
                                                        {
                                                            [1,2,3,4].map((value,index)=>(
                                                                <Column md={3} xs={3} sm={3} padding={[5]} key={"sub_image_"+index}>
                                                                <Skeleton variant="rect" width={"100%"} height={50}  />
                                                            </Column>
                                                            ))
                                                        } 
                                                    </Row>
                                                </Column>
                                            </Row>
                                        
                                        </Column>
                                        <Column md={8} padding={[10]}>
                                            {[1,2,3,4].map((value,index)=>(
                                                <Row key={"it_is_room_" +index} >
                                                <Column md={8} xs={8} sm={8}>
                                                    <Row>
                                                        <Column md={1} sm={1} xs={1} padding={[3]}>
                                                        <Skeleton variant="rect" width={"100%"} height={20}  />
                                                        </Column> 
                                                        <Column md={11} sm={11} xs={11} padding={[3]}>
                                                        <Skeleton variant="rect" width={"100%"} height={20}  />
                                                        </Column>
                                                        
                                                        <Column md={1} sm={1} xs={1} padding={[3]}>
                                                        <Skeleton variant="rect" width={"70%"} height={15}  />
                                                        </Column> 
                                                        <Column md={11} sm={11} xs={11} padding={[3]}>
                                                        <Skeleton variant="rect" width={"70%"} height={15}  />
                                                        </Column>
                                                    </Row>
                                                </Column>
                                                <Column md={4} xs={4} sm={4} center>
                                                    <Row>
                                                        <Column padding={[3]}>
                                                        <Skeleton variant="rect" width={"60%"} height={20}  />
                                                        </Column>
                                                        <Column padding={[3]}>
                                                        <Skeleton variant="rect" width={"70%"} height={20}  />                                                   
                                                        </Column>
                                                        <Column padding={[3]}>
                                                        <Skeleton variant="rect" width={"100%"} height={40}  />    
                                                        </Column>
                                                    </Row>
                                                </Column>
                                            </Row> 
                                        
                                            ))}
                                        </Column>
                                    </Row>
                            </Card>
            
                       ))
                   }
                </Column>
            </Row>
        </div>
    )
}

 