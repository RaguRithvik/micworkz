import React,{useState,useEffect} from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import Box from '@material-ui/core/Box'; 
import { makeStyles } from '@material-ui/styles';
import { httpPostRequest,getDateYYYYMMDD } from '../../../helper/JsHelper';
import { getMothlySales} from '../../../helper/RequestPayLoad';
import {newConstants} from "../../../helper/constants";

const useStyles = makeStyles((theme) => ({
  tooltip: {
    position: 'relative',
    borderRadius: 6,
    padding: '4px 12px',
    backgroundColor: '#6dd1e7',
    color: theme.palette.common.white,
  },
}));

const EtheriumGraph = () => {
  const classes = useStyles();
  
  const [data,setData]=useState([])
  const [dateValue,setDateValue]=useState(getDateYYYYMMDD(new Date()))

  const loadData= async ()=>{
        let res=await httpPostRequest(getMothlySales(dateValue))
        // console.log(getMothlySales(dateValue))
        if(res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE]==200){
           setData(res[newConstants.DATA][newConstants.SALES_DATA][newConstants.DATA])
        }}
        // console.log(data)
  useEffect(()=>{
    loadData()
  },[dateValue])

  return (
    <ResponsiveContainer className="card-img-bottom overflow-hidden" width="100%" height={112}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Tooltip
          labelStyle={{ color: 'black' }}
          cursor={false}
                    content={(data) => {
          return data.payload && data.payload.length && data.payload[0] ? <Box className={classes.tooltip}>${data.payload[0].payload[newConstants.SALES_VALUE]}</Box> : null;
            }}
        />
        <defs>
          <linearGradient id="color5" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1ABBDE" stopOpacity={1} />
            <stop offset="95%" stopColor="#09BCA7" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Area
          dataKey={newConstants.SALES_VALUE}
          type="monotone"
          strokeWidth={0}
          stackId="2"
          stroke="#1ABBDE"
          fill="url(#color5)"
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EtheriumGraph;
