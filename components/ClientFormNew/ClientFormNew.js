import React,{useState,useEffect} from 'react';
import { TextField, Text, Card, Row, Column, Glyphi, Loader, CustomAlert, SingelSelectOnDemand, DemandDropDown } from '../../core';
import {
    Fade,
    FormControlLabel,
    Checkbox,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';

const ClientFormNew=()=>{
const [person,setPerson] = useState(null);
    useEffect(async() => {
        const response = await fetch("https://agent.tripwerkz.com/new-api/product-provider-type-link/get");
        console.log(response)
        const data = await response.json();
        const item=data.hcm[0];
        setPerson(item);
    },[]);
return(
    <div>
        <Row>
            <Column md="3">
                    <h3>Hello Every one</h3>
            </Column>
        </Row>
    </div>
)
}
export default ClientFormNew;