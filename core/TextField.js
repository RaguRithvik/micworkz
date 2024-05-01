import React ,{useState,useEffect,useRef,useCallback} from "react";
import { TextField } from "@material-ui/core"; 
import { makeStyles } from '@material-ui/core/styles';
 
const CustomTextFiled=({value,margin,error,helperText,...props})=>{ 
    const [isFocus,setIsFocus] = useState((value+"").length>0);   
    
    
    return (
        <TextField 
            id="outlined-error-helper-text"
            variant="outlined"
            margin={margin==""||margin=="null"?"":"dense"} 
            helperText={error?helperText:""}
            error={error}
            onFocus={()=>setIsFocus(true)}
            onBlur={()=>setIsFocus(value&&(value+"").length>0)}
            value={value}            
            InputProps={{
              style:{
                height:43,
                fontWeight:isFocus?600:500
              }
            }}
            InputLabelProps={{
              style: {
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
                fontSize:"0.9rem",
                color:isFocus?'#6896c2':'black',
                paddingTop:margin==""?isFocus?0:2.6:!margin?3.2:0,
                fontWeight:isFocus?600:500
              } }}
            {...props}
        />
    )
}



export default CustomTextFiled;
