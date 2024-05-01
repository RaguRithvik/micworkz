import React,{useState} from "react";
import { RemoveCircle } from '@material-ui/icons';
import { Button } from "@material-ui/core";
import Image from "./Image";
import Row from "./Row";
import Column from "./Column";
import Card from "./Card";
import Text from "./Text";
import Touchable from "./Touchable";
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { httpPostRequestWithForm,httpGetRequest } from "../helper/JsHelper";
import { imageUploder,apiDownload } from "../helper/RequestPayLoad";
import { newConstants } from "../helper/constants";
import {CloudUpload} from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    withUrl: {
        height: 150,
        width: '100%',
        borderRadius: 5  
    },
    withOutUrl: {
        height: 150,
        width: '100%',
        borderRadius: 5 
    },
    container: {
    }
}));

const ImageUpload = ({ key_,value, error,type, tag, name, onClick, label, onChange, removeImage, url, ...props }) => {
    const classes = useStyles();
    const [loader,setLoader]=useState(false);
    const uploadImage = async (e) => {  
        if(e.target.files&&e.target.files.length){
        setLoader(true);
        const res = await httpPostRequestWithForm(imageUploder(e.target.value, e.target.files[0], tag, type));
        if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
            onChange({ target: { value: res[newConstants.DATA][newConstants.FILE_KEY], name: name } })
            setLoader(false);
        }
        else{
            setLoader(false);
        }
     }
    }

    const  downloadFile=async()=>{
       let res = await httpGetRequest(apiDownload(value)); 
       if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
       }
    }

    return (
        <div>
        <Card  className={classes.container}  color={error?"red":""} {...props}>
         <input style={{ display: "none" }} onChange={uploadImage} id={"upload-photo"+key_} accept={tag=="CLIENT_OTHER_DOC"?"":"image/png, image/jpeg"} name={name} type="file" />
            <Row padding={[5]}>
                {value==""?
                <Column >                    
                        <Touchable>
                            <label className={classes[url ? "withUrl" : "withOutUrl"]} htmlFor={"upload-photo"+key_} >
                                <Image fit="contain" src={loader?"/images/loader.gif":url ? url : tag=="CLIENT_OTHER_DOC"?"/images/file.png":"/images/upload.png"} className={classes[url ? "withUrl" : "withOutUrl"]} />
                            </label>
                        </Touchable>
                </Column>:
                <Column> 
                  <Touchable onClick={downloadFile}>               
                     <Image fit="contain" src={loader?"/images/loader.gif":tag=="CLIENT_OTHER_DOC"?"/images/download.png":url } className={classes[url ? "withUrl" : "withOutUrl"]}  />
                  </Touchable>
                </Column>
                }   
            </Row> 
        </Card>
        {value!=""?
        <label htmlFor={"upload-photo"+key_} >
            <IconButton style={{bottom:50,left:10}} color="primary" aria-label="upload picture" component="span">
              <CloudUpload />
            </IconButton>
        </label>:null}
     </div>
    );
}

export default ImageUpload;