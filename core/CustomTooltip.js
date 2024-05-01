import React  from "react"; 
import { Cancel } from '@material-ui/icons';
import {Column,Row,Card} from "./"; 
import { IconButton } from "@material-ui/core";
 
const CustomTooltip=({open,onClose,clossButton,children,...props})=>{
  
  return( 
    <Card   style={{ position: 'absolute',zIndex:5,borderRadius:5,marginTop:clossButton?30:10,visibility:open?'visible':'hidden'}} {...props}>
        <Row>
          {clossButton&&
          <Column center middle onClick={()=>onClose()} padding={[0,0,10,0]}>
            <IconButton  style={{position:'absolute'}} >
              <Cancel style={{color:'#ff8c3c',fontSize:39}}/>
            </IconButton>
          </Column>}
          <Column>
           {children}
          </Column>
        </Row>
    </Card> 
  )
}

export default CustomTooltip;