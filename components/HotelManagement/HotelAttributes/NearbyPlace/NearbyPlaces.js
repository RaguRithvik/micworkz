import React, { useState, useEffect } from 'react';
import { Container, Box, Checkbox, Button, Table, TableBody, TableContainer, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import { Row, Column, Text, ModalComponent, Glyphi, Loader, TextField, SingelSelectOnDemand } from "../../../../Core";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../style/Nearybyplace.module.css";
import NearPlaceType from "./NearPlaceType"
import NearPlace from "./NearPlace"
import {
    getAllNearPlace,
    getAllNearPlaceTypeY
} from '../../../../helper/RequestPayLoad';
import { getDateYYYYMMDD, validator, httpPostRequest, httpPostRequestWithForm } from '../../../../helper/JsHelper';
import { newConstants, constants } from '../../../../helper/constants';


const useStyles = makeStyles((theme) => ({
    NearyByplacesection: { width: '100%', float: 'left' },
    Roomcommonheader: { padding: '10px 0px', },
    NtearybyIncomeplace: { width: '100%', },
    NearyByplacernow: { fontSize: '25px', },
    SingaporeImagesshow: { width: '100%', maxWidth: '350px', minWidth: '100%', },
    Mouse_Over_me: { color: '#1e7be3', },
    Landmarkvalue: { marginTop: '0px', listStyleType: 'none', },
    Landmarkvaluenow: { marginTop: '0px', cursor: 'pointer', listStyleType: 'none', color: '#3d93f3', },
    NearybyPlaceINformer: { fontSize: '30px', padding: '10px 0px', position: "relative", marginLeft: -7 },
    LandmarkHideCheckbox: { visibility: 'hidden', },
    addTyperNowers: { position: 'relative', },
    LandmarkInformerNow: { position: 'absolute', top: '0px', right: '10px', },
    RoomAmenityAdded: { fontWeight: '700', width: "70%" },
    RoomAmenityButton: { fontWeight: '700', width: "50%" },
}));

const NearbyPlaces = () => {
    const classes = useStyles();
    const [nearPlaceType, setNearPlaceType] = useState(false)
    const [nearPlace, setNearplace] = useState(false)
    const [wholeplaces, setWholeplaces] = useState([])
    const [storePlaces, setStoreplaces] = useState([
        {
            "hotel-near-by-place-desc": "Guangzhou Baiyun International Airport",
            "hotel-near-by-place-key": "meVAGWycL2xEULygzJB79qUsL2FyiJKI6GXbuo+8L2w=",
            "hotel-near-by-place-latitude": "31.23562042738098",
            "hotel-near-by-place-longitude": "121.49913037757005",
            "hotel-near-by-place-type-desc": "gabar",
            "hotel-near-place-type-key": "cFoQ6IfItkmjDiCAONXYNE9Xw8cByLzK0vqWvkQ/tkI="
          }
    ])
    const [nearkey,setNearKey]=useState(null)
    async function init() {
        let Placeresponse = await httpPostRequest(getAllNearPlace(""));
        var resOfPlace = Placeresponse[newConstants.DATA] != null ? Placeresponse[newConstants.DATA]["hotel-near-places"] : []
        let PlaceTyperesponse = await httpPostRequest(getAllNearPlaceTypeY(""));
        let resOftype = PlaceTyperesponse[newConstants.DATA] != null ? PlaceTyperesponse[newConstants.DATA]["hotel-near-place-types"] : []
        var a = resOfPlace.filter(f => (resOftype.map(v => v["hotel-near-place-type-key"])).includes(f["hotel-near-place-type-key"]))
        var b = resOftype.filter(f => !(resOfPlace.map(v => v["hotel-near-place-type-key"])).includes(f["hotel-near-place-type-key"]))
        var origin_=a.concat(b)
        var data=origin_.map((v)=>({
            typeValue:v["hotel-near-place-type-key"],
            typeDesc:v["hotel-near-by-place-type-desc"],
            nearValue:v["hotel-near-by-place-key"]?v["hotel-near-by-place-key"]:null,
            nearDesc:v["hotel-near-by-place-desc"]?v["hotel-near-by-place-desc"]:null,
            lattitude:v['hotel-near-by-place-latitude']?v['hotel-near-by-place-latitude']:null,
            longitude:v["hotel-near-by-place-longitude"]?v["hotel-near-by-place-longitude"]:null
          }))
          const getGroup=(groups, typeDesc,typeValue) => {
            let group = groups.find(g=>g.typeValue===typeValue);
            if(!group){
              group=({typeDesc,typeValue,nearplace:[]});
              groups.push(group);
            }
            return group;
          }
          
          let  grouped = []
          data.forEach(item=> getGroup(grouped,item.typeDesc,item.typeValue).nearplace.push(item))
           const recursiveCall=(array)=>{
            if(array.length){
                return array.map((v)=>({
                    ["hotel-near-by-place-desc"]:v.nearDesc,
                    ["hotel-near-by-place-key"]:v.nearValue,
                    ['hotel-near-by-place-latitude']:v.lattitude,
                    ["hotel-near-by-place-longitude"]:v.longitude,
                    ["hotel-near-by-place-type-desc"]:v.typeDesc,
                    ["hotel-near-place-type-key"]:v.typeValue,
                    }))
            }
            else{
                return []
            }
        }       
        
          let tree=grouped.map((value)=>({    
            ["hotel-near-by-place-type-desc"]:value.typeDesc,
              ["hotel-near-place-type-key"]:value.typeValue,
              nearplace:recursiveCall(value.nearplace)
            })  
        ) 

        setWholeplaces(tree)
    }


    function handleNearPlace(value) {
        const currentIndex = storePlaces.findIndex((f) => f == value);
        if (currentIndex > -1) {
            storePlaces[currentIndex] = null
            setStoreplaces(storePlaces.filter((f) => f != null));
        } else {
            setStoreplaces([...storePlaces, value])
        }
    };

    useEffect(() => {
        init()
    }, [])

    return (
        <div>
            <Container>
                <Box className={classes.NearyByplacesection}>
                    <Row>
                        <Column md={10}>
                            <h1 className={classes.NearybyPlaceINformer}>Nearyby Place</h1>
                        </Column>
                        <Column md={2} right>
                            <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded} onClick={() => setNearPlaceType(true)}>Add type</Button>
                        </Column>
                    </Row>
                    <ModalComponent open={nearPlaceType} setOpen={setNearPlaceType}>
                        <NearPlaceType nearPlaceType={nearPlaceType} setNearPlaceType={setNearPlaceType} init={init} />
                    </ModalComponent>
                    <ModalComponent open={nearPlace} setOpen={setNearplace}>
                        <NearPlace nearkey={nearkey} nearPlace={nearPlace} setNearplace={setNearplace} init={init} />
                    </ModalComponent>
                    <Row>
                        {wholeplaces.length ? wholeplaces.map((val, index) => (
                            <Row margin={[10, 0]}>
                                <Column md={10} xs={10} sm={10}>
                                    <Text bold>{val["hotel-near-by-place-type-desc"]}</Text>
                                </Column>
                                <Column md={2} xs={2} sm={2} right>
                                    <Button variant="outlined" color="primary" className={classes.RoomAmenityButton} onClick={() => {setNearplace(true),setNearKey(val[["hotel-near-place-type-key"]])}}>Add</Button>
                                </Column>
                                <Column md={12}>
                                    <Paper className={styles.LanguageSlectedColorchange}>
                                        <TableContainer className={classes.TableContain}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className={classes.tableHeadTuple}><b>Popular landmarks</b></TableCell>
                                                        <TableCell className={classes.tableHeadTuple}><b>Lattitide</b></TableCell>
                                                        <TableCell className={classes.tableHeadTuple}><b>Longitude</b></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {val.nearplace.map((value, index) => (
                                                    value['hotel-near-by-place-latitude'] != null ?
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className={classes.tableHeadTuple}><div className={styles.dropdown}>
                                                                    <Checkbox
                                                                        size="small"
                                                                        color="primary"
                                                                        inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                                                                        checked={storePlaces.includes(value)}  
                                                                                                                                          
                                                                        onChange={(e) => handleNearPlace(value)} />{value["hotel-near-by-place-desc"]}
                                                                    {/* <div className={styles.dropdownContent}>
                                                        <img src={val.img} className={classes.SingaporeImagesshow} />
                                                    </div> */}
                                                                </div></TableCell>
                                                                <TableCell className={classes.tableHeadTuple}>{value['hotel-near-by-place-latitude']}</TableCell>
                                                                <TableCell className={classes.tableHeadTuple}>{value['hotel-near-by-place-longitude']}</TableCell>
                                                            </TableRow>
                                                        </TableBody> :
                                                        <TableRow>
                                                        <TableCell scope="row" align="center" colSpan={3} rowSpan={2}>
                                                          <Text medium size={14} bold>
                                                            {'No Places Found.'}
                                                          </Text>
                                                        </TableCell>
                                                      </TableRow>
                                                ))}
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Column></Row>)) :
                            <Row>
                                <Column md={12} middle center>
                                    <Text size={16} bold>No records found</Text>
                                </Column>
                            </Row>}
                    </Row>
                </Box>

            </Container>
        </div >
    );
}
export default NearbyPlaces;