import React, { useEffect, useState, useRef } from 'react';
import { Card, Row, Column, Image, Text } from '../../core';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
    mapContainer: {
        height: 400
    }
}));

export default function Location({ data, ...props }) {
    const classes = useStyles();
    const [lng, setLng] = useState(data?.location?.longitude);
    const [lat, setLat] = useState(data?.location?.latitude);
    const [viewport, setViewport] = useState({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        height: 400,
        borderRaddius: 8,
        width: '100%',
        zoom: 15
    });


    return (

        <Card noShadow padding={[10]} margin={[5, 0]} {...props}>
            <Row>
                <Column padding={[5]}>
                    <Text variant={"h1"} component={"h3"} medium >Address </Text></Column>
                <Column padding={[5, 10]}>
                    <Text variant={"p"} component={"h3"} size={14} medium >{data.address + " , pin " + data.postalCode} </Text>
                </Column>
                <Column padding={[5]}>
                    <ReactMapGL
                        mapboxApiAccessToken={'pk.eyJ1Ijoic2lyYWotbWljZSIsImEiOiJja21qeGRkeWowdmxlMzJtdWZrN3Ayd3V5In0.6RnI5nnhz0ilBNuM0vtwpA'}
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        onViewportChange={viewport => {
                            setViewport(viewport);
                        }}
                        {...viewport}
                    >
                        {
                            lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 ?
                                <Marker
                                    latitude={parseFloat(lat)}
                                    longitude={parseFloat(lng)}>
                                    <Room style={{ fontSize: 45, color: 'red' }} />
                                </Marker> : null
                        }
                    </ReactMapGL>
                </Column>
            </Row>
        </Card>
    )
}
