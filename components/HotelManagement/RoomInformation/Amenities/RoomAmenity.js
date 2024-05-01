import React, { useState, useEffect } from 'react';
import { Container, Box, Checkbox, Button, FormControlLabel } from "@material-ui/core";
import { Row, Column, Text, ModalComponent, Glyphi, Loader, TextField, SingelSelectOnDemand } from "../../../../Core";
import { makeStyles } from "@material-ui/core/styles";
import { useStore } from '../../../../helper/Store';
import { getDateYYYYMMDD, validator, httpPostRequest } from '../../../../helper/JsHelper';
import {
  getAmmunityType,
  getAllAmmunity
} from '../../../../helper/RequestPayLoad';
import AmenityType from "./AmenityTpe"
import Amenity from "./Amenity"
import { newConstants, constants } from '../../../../helper/constants';

const useStyles = makeStyles((theme) => ({
  RoomAmenitiesSection: { width: '100%', float: 'left', },
  Roomcommonheader: { fontSize: '30px', marginBottom: '11px', },
  RoomCategoryre: { width: '100%', position: 'relative', },
  RoomCategoryservices: { position: 'absolute', right: '10px', top: '10px', },
  RoomAmenityAdded: { fontWeight: '700', width: "70%" },
  RoomAmenityButton: { fontWeight: '700', width: "50%" },
  RoomAmenitiesInformation: { listStyleType: 'none', fontSize: '14px', position: 'relative', marginTop: '10px', },
  HotelCheckernow: { position: 'absolute', left: '0px', top: '10px', padding: '0px 0px 0px 40px', },
  saveButton: {
    width: '30%',
    margin: 5,
    color: "white",
    backgroundColor: "rgb(26, 43, 71)",
    '&:hover': {
      backgroundColor: "rgb(26, 43, 71)",
    }
  },
}));

const RoomAmenity = ({storeAmenity,setStoreAmenity}) => {
  const classes = useStyles();
  const [amenity, setAmenity] = useState(false)
  const [amenityType, setAmenityType] = useState(false)
  const [wholeAmenities, setWholeAmenities] = useState([])
  const {setAlertMsg}=useStore()
 
  const [amenityKey,setAmenityKey]=useState(null)

  async function init() {
    let Amenityresponse = await httpPostRequest(getAllAmmunity(""));
    var resOfamenity = Amenityresponse[newConstants.DATA][newConstants.HOTEL_AMENITIES]
    let AmenityTyperesponse = await httpPostRequest(getAmmunityType(""));
    let resOftype = AmenityTyperesponse[newConstants.DATA][newConstants.HOTEL_AMENITY_TYPES]
    var a = resOfamenity.filter(f => (resOftype.map(v => v["hotel-amenity-type-key"])).includes(f["hotel-amenity-type-key"]))
    var b = resOftype.filter(f => !(resOfamenity.map(v => v["hotel-amenity-type-key"])).includes(f["hotel-amenity-type-key"]))
    var origin_ = a.concat(b)
    // console.log(origin_)
    var data = origin_.map((v) => ({
      typeValue: v["hotel-amenity-type-key"],
      typeDesc: v["hotel-amenity-type-desc"],
      amenityValue: v["hotel-amenity-key"] ? v["hotel-amenity-key"] : null,
      amenityDesc: v["hotel-amenity-name"] ? v["hotel-amenity-name"] : null
    }))
    const getGroup = (groups, typeDesc, typeValue) => {
      let group = groups.find(g => g.typeValue === typeValue);
      if (!group) {
        group = ({ typeDesc, typeValue, amenity: [] });
        groups.push(group);
      }
      return group;
    }

    let grouped = []
    data.forEach(item => getGroup(grouped, item.typeDesc, item.typeValue).amenity.push(item))
    // console.log(grouped)
    const recursiveCall = (array) => {
      if (array.length) {
        return array.map((v) => ({
          label: v.amenityDesc,
          key: v.amenityValue,
        }))
      }
      else {
        return []
      }
    }
    let tree = grouped.map((value) => ({
      label: value.typeDesc,
      key: value.typeValue,
      amenity: recursiveCall(value.amenity)
    })
    )
    setWholeAmenities(tree)
    setStoreAmenity([])
  }


  useEffect(() => {
    init()
  }, [])


  function handleAmenity (value) {
    const currentIndex = storeAmenity.findIndex((f) => f == value);
    if (currentIndex > -1) {
      storeAmenity[currentIndex]=null
      setStoreAmenity(storeAmenity.filter((f) => f != null));
    } else {
      setStoreAmenity([...storeAmenity, value])
    }
  };


  return (

    <div>
      <section className={classes.RoomAmenitiesSection}>
        <Row>
          <Column md={10} >
            <h1 className={classes.Roomcommonheader}>Room Amenities</h1>
          </Column>
          <Column md={2} right>
            <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded} onClick={() => setAmenityType(true)}>Add type</Button>
          </Column>
        </Row>
        <ModalComponent open={amenityType} setOpen={setAmenityType}>
          <AmenityType amenityType={amenityType} setAmenityType={setAmenityType} init={init} setAlertMsg={setAlertMsg}/>
        </ModalComponent>
        <ModalComponent open={amenity} setOpen={setAmenity}>
          <Amenity amenity={amenity} setAmenity={setAmenity} init={init} setAlertMsg={setAlertMsg} amenityKey={amenityKey}/>
        </ModalComponent>
        <Container style={{ margin: '20px 0px', }}>
          {wholeAmenities.map((val, index) =>
            <Row>
              <Column md={10} xs={10} sm={10}>
                <Box className={classes.RoomCategoryre}>
                  <Text><b>{val.label}</b></Text>
                </Box>
              </Column>
              <Column md={2} xs={2} sm={2} right>
                <Button variant="outlined" color="primary" className={classes.RoomAmenityButton} onClick={() => {setAmenity(true),setAmenityKey(val.key)}}>Add</Button>
              </Column>
              <Row>
                {val.amenity?val.amenity.map((value)=>(
                  <Column md="3" padding={[0, 10]}>
                  {value.label!=null?<Box className={classes.RoomAmenitiesInformation} >
                      <li> <Checkbox
                    size="small"
                    color="primary"
                    inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                    checked={storeAmenity.includes(value)}
                    onChange={(e) => handleAmenity(value)}
                  />
                          </li>
                      <Box className={classes.HotelCheckernow}>
                          <li>{value.label}</li>
                      </Box>
                  </Box>:null}
                  </Column>
                )):null}
              </Row>  
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
}



export default RoomAmenity;