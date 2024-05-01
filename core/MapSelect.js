import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import React, { useState,useEffect} from 'react';
import { Row,Card,Column,ModalComponent,Text,Touchable} from '../core';
import { Button,InputBase,Box} from '@material-ui/core';
import ReactMapGL, { Marker, NavigationControl, FullscreenControl } from 'react-map-gl';
import { Room,Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import {httpGetRequest} from "../helper/JsHelper";
import { MAPBOX_TOKEN } from '../helper/constants'; 
import { mapSearchAutoComplete } from '../helper/RequestPayLoad';

const useStyles = makeStyles((theme) => ({
  searchContainer:{
    width:300
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius, 
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  }
}));

const navControlStyle = {
  top: 36,
  right: 0,
  padding: '10px',
};
const fullscreenControlStyle = {
  top: 0,
  right: 0,
  padding: '10px',
};
const buttonStyle = {
  margin: 5,
};

const MapSelect = ({ openMap, setOpenMap, latLong, setLatLong, ...props }) => {
  //   TODO Add Default Latitude, Longitude
  
  const [viewport, setViewport] = useState({
    latitude: latLong && latLong.latitude ? latLong.latitude : 37.7577,
    longitude: latLong && latLong.longitude ? latLong.longitude : -122.4376,
    zoom: 8,
  });

  const selectLatLng = () => {
    setOpenMap(false);
    setLatLong({ longitude: viewport.longitude, latitude: viewport.latitude })
  };

  return (
    <ModalComponent open={openMap} setOpen={setOpenMap} style={{ height: '90vh', position: 'relative' }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        width="100%"
        height="100%"
        onViewportChange={v => setViewport(v)}>
        <Marker latitude={viewport.latitude} longitude={viewport.longitude} offsetLeft={-20} offsetTop={-10}>
          <Room style={{ color: 'red', fontSize: 40 }} />
        </Marker>
        <FullscreenControl style={fullscreenControlStyle} />
        <NavigationControl style={navControlStyle} />
      </ReactMapGL>
      <Row center middle style={{ position: 'absolute', bottom: 10 }} padding={[0,0,10,0]}>
        <Button onClick={selectLatLng} variant="contained" color="primary" style={buttonStyle}>
          {'Done'}
        </Button>
      </Row>
      <SearchBox setViewport={setViewport} style={{position:'absolute',top:20,left:20}}/>
    </ModalComponent>
  );
};

export default MapSelect;

const SearchBox=({setViewport,...props})=>{
  const classes = useStyles();
  const [key,setKey]=useState("");
  const [loader,setLoader] = useState(false);
  const [result,setResult] = useState([]);

  useEffect(()=>{ 
    apiCaller();
  },[key]) 
  const apiCaller=async()=>{ 
    if(key.length>1){
      setLoader(true);
      let res = await httpGetRequest(mapSearchAutoComplete(key)); 
      if(res&&res.features&&res.features.length)
      {
        setResult(res.features)
      } 
       setLoader(false);
    }
  }
  return(
    <Card {...props} padding={[5]} className={classes.searchContainer}>
      <div className={classes.search}>
          <div className={classes.searchIcon}>
              <Search />
          </div>
          <InputBase
              value={key} 
              onChange={e=>setKey(e.target.value)}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />  
      </div>
      <div>
        <Row> 
          { 
            result.map((value,index)=><Column key={"map_search_"+index} padding={[0,5]}><Box borderBottom={.1} color='#c0c0c0'><Row><Column padding={[5,0]}><Touchable onClick={()=>{
              setViewport({latitude:value.center[1],longitude:value.center[0],zoom: 8})
              setResult([])
            }}><Text color="grey" variant="h3" component="p" size={15}>{value.place_name}</Text></Touchable></Column></Row></Box></Column>)
          }
        </Row> 
      </div>
    </Card>
  )
}