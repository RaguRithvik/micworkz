import React ,{useState} from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles"; 
import Badge from "@material-ui/core/Badge";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip"; 
import {Room,Hotel,Email,Call,StarHalf,Star,SingleBed,Assistant,Group} from "@material-ui/icons";  
import Button from "@material-ui/core/Button"; 
import { Row,Column,Image,Card,Text } from "../../core";
import { toLowerCase,callToMobile,openEmail,splitNumberText,starRatingFinder } from "../../helper/JsHelper";
import { Paper } from "@material-ui/core";
import { useRouter } from 'next/router'

const useStyles = makeStyles((theme) => ({
  mainImage:{
    width:'100%',
    height:250,
    borderRadius:5
  },
  amenityRoot:{
    position: 'absolute',
    zIndex:11000,
  },
  imageNail:{
    width:"20%",
    height:70,
    padding:2,
    paddingTop:3,
    borderRadius:5
  },
  locationIcons:{
    fontSize:20, 
  },
  containerBody:{
    padding:15,
    [theme.breakpoints.down('sm')]: {
      padding:5 
    }
  }, 
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
    maxHeight: 50,
    alignItems: "center",
  },
  gridTile: {
    maxWidth: "20%",
    maxHeight: 50,
  },
  card: {
    flexGrow: 1,
    margin: 2, 
  },
  itemData: {
    width: "100%",
    marginTop: 0,
    marginBottom: 0,
  },
  margin: {
    margin: theme.spacing(1),
  },
  buttonStyle: {
    width: "100%",
  },
  cardAction: {
    justifyContent: "space-between",
    paddingLeft: "8px",
  },
  hotelPrice: {
    fontSize: "1.3rem",
    color:'#2949D5'
  },
  hotelDuration: {
    fontSize: ".9rem",
    fontWeight:700
  },
  cardContent: {
    paddingTop: "0",
  },
  borderHolder: {
    borderRadius: 5,
  },
}));



const HotelCard = ({ data, ...prop }) => {
  const classes = useStyles();
  const router = useRouter();
  
  const bookNow=()=>{ 
    let query = router.query; 
    let params = { 
      ci: query.ci,
      hid:data.hotelId,
      cg:'HOTEL', 
      co: query.co, 
      rd: query.rd,
      hotelKey:(data.hotelKey),
      clientId:data.clientId,
      productProviderTypeId:data.productProviderTypeId 
    }; 
      router.push({
        pathname: '/dashboard/searchhotels/Rooms',
        query: params   
      })
  } 
  return ( 
      <Card className={classes.card} variant="outlined"  {...prop}>  
          <Row>
            <Column md={4} xs ={12} sm={12}>
              <Row>
                <Column>
                    <Badge anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }} color={data.rate.bestDeal.title!=="0"?"primary":"#ffffff00"} overlap="circle" badgeContent={data.rate.bestDeal.title!=="0"?("Offer : "+data.rate.bestDeal.title+ "%"):""}>
                      <img
                        src={data.images.baseUrl.lg+data.images.featureImageUrl}
                        alt={data.hotelName}
                        title={data.hotelName}
                        className={classes.mainImage}
                        loading="lazy"
                      />
                    </Badge>
                </Column>
                <Column>
                  <Row>
                  {
                  data.images.imageUrls.map((img, index) => ( 
                            <img 
                              key={"sub_img"+index}
                              src={data.images.baseUrl.sm+img}
                              alt={data.hotelName}
                              className={classes.imageNail}
                              loading="lazy"
                            /> 
                        ))}
                  </Row> 
                </Column>
              </Row>
          </Column> 
          <Column md={8} xs={12} sm={12}  className={classes.containerBody}>  
          <Row padding={[0,0,5,0]}>
            <Column md={10}  center>
               <Text variant={"h1"}  component="h6" medium > {data.hotelName} </Text> 
            </Column>
            <Column md={2} right>   
                  {starRatingFinder(data.hotelCategory.categoryName)>0? 
                   <Stars value={starRatingFinder(data.hotelCategory.categoryName)}/>:
                  <Text size={18} color="#003399" bold>{(data.hotelCategory.categoryName)}</Text>} 
            </Column>
          </Row>
          <Divider gutterBottom />
          <Row padding={[10,0]}>
            <Column>
               <Row>
               <Column md={1} xs={2} sm={2} center>
                 <Room className={classes.locationIcons}  />   
               </Column>
               <Column md={11} xs={10} sm={10}> 
                 <Text variant={"p"} gutterBottom component="h6" size={18}>{data.hotelAddress.address}</Text>
               </Column>
             </Row>
            </Column>
            <Column>
               <Row>
               <Column md={1} xs={2} sm={2} center>
                 <Hotel className={classes.locationIcons}/>   
               </Column>
               <Column md={11} xs={10} sm={10}> 
                 <Text variant={"p"} gutterBottom component="h6"  size={18}>{toLowerCase(data.hotelCategory.categoryName)}</Text>
               </Column>
             </Row>
            </Column>
            <Column>
               <Row>
               <Column md={1} xs={2} sm={2} center>
                 <Email />   
               </Column>
               <Column md={11} xs={10} sm={10}> 
                   <Row>
                    <Text variant={"p"} gutterBottom component="h6"  size={18}>{toLowerCase(data.hotelAddress.email1)}</Text>
                     <ContactTooltip data={data.hotelAddress}/>
                   </Row>
               </Column>
             </Row>
            </Column>
            
            <Column>
               <Row>
               <Column md={1} xs={2} sm={2} center>
                 <Assistant />   
               </Column>
               <Column md={11} xs={10} sm={10}> 
                   <Row>
                    <Text variant={"p"} gutterBottom component="h6"  size={18}>{data.hotelAmenity.length +" Amenities"}</Text>
                    </Row>
               </Column>
             </Row>
            </Column>
            <Column>
               <Row>
               <Column md={1} xs={2} sm={2} center>
                 <SingleBed />   
               </Column>
               <Column md={11} xs={10} sm={10}> 
                 {/* <Text variant={"p"} gutterBottom component="h6"  size={18}>{data.roomCategories.selected?data.roomCategories.selected.categoryName+" "+data.roomCategories.selected.roomTypeName:"STANDARD"}</Text> */}
               </Column>
             </Row>
            </Column>
            
            <Column>
               <Row>
               <Column md={1} xs={2} sm={2} center>
                 <Group />   
               </Column>
               <Column md={11} xs={10} sm={10}> 
                 <Text variant={"p"} gutterBottom component="h6"  size={18}>{data.rate.occupancy.adults+" Adult "+data.rate.occupancy.childs+" Childs "+data.rate.occupancy.rooms+" Rooms"}</Text>
               </Column>
             </Row>
            </Column>
          </Row>   
        <Divider variant="middle" />
        <Row center padding={[10,0,0,0]}>
          <Column md={8} sm={7} xs={7} center padding={[0,0,0,10]}> 
            <Text component="h4" className={classes.hotelPrice}>
                  <b>
                    <span style={{ "font-size": "1rem",color:'primary' }}>
                      {data.rate.currency}&nbsp;
                    </span>
                    {data.rate.netRate}
                  </b>
            </Text> 
            <Text component="p" className={classes.hotelDuration}>
                {data.rate.occupancy.rooms+" room / "+data.rate.occupancy.nights+" nights"}
            </Text>
          </Column>
          <Column md={4} sm={5} xs={5} middle center padding={[5]}>
            <Button variant="contained" onClick={bookNow}   color="primary" className={classes.buttonStyle} bold><Row padding={[5,0]} center middle><Text> Book Now</Text></Row></Button> 
          </Column>
        </Row>  
        </Column>
          </Row>
     </Card>
   );
};

export default HotelCard;
 
const ContactTooltip=({data,...prop})=>{
  const [open,setOpen]=useState(false); 
  return (
  <div onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} {...prop}>
     <Text color="blue"  style={{cursor:open?'pointer':"",paddingLeft:10,  textDecoration: open?'underline':'none'}}>more</Text>
     <Paper style={{position: 'absolute',zIndex:1,borderRadius:5,visibility:open?'visible':'hidden'}}>
       <Row padding={[5]}>
          {data.officePhone1&&<Column>
            <ButtonContainer 
              onClick={()=>callToMobile(data.officePhone1)}
              icon={<Call />}
              text={data.officePhone1}
              /> </Column>}
          {data.officePhone2&&<Column>
            <ButtonContainer 
              onClick={()=>callToMobile(data.officePhone2)}
              icon={<Call />}
              text={data.officePhone2}
              /> </Column>
            }
            {data.email1&&<Column>
            <ButtonContainer 
              onClick={()=>openEmail(data.email1)}
              icon={<Email />}
              text={data.email1}
              /> </Column>
            }
       </Row>
     </Paper>
  </div>)
}

const ButtonContainer=({icon,text,...props})=>{
  return (
    <Button variant="outlined"   size="medium" color={'primary'}  style={{borderRadius:10,margin:2}}  startIcon={icon} {...props}>
       <Text color="black">{text} </Text>
    </Button>
  )
}
 
const Stars=({value})=>{
  return (
    <Row>
      { [1,2,3,4,5].map((val)=>(val<=value?<Star color="primary" style={{fontSize:20}}/>:val-value>0&&val-value<1?<StarHalf color="primary" style={{fontSize:20}}/>:<Star  style={{fontSize:20,color:'grey'}}/>)) }
    </Row>
  )
}