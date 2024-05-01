import React, { useState } from "react";
import Row from "./Row";
import Column from "./Column";
import Card from "./Card";
import Text from "./Text";
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { httpPostRequestWithForm, httpGetRequest } from "../helper/JsHelper";
import { newConstants } from "../helper/constants";
import { DropzoneArea } from 'material-ui-dropzone';

const useStyles = makeStyles((theme) => ({
excelDropZone:{
    minHeight:130
}
}));

const ExcelUpload = ({ document_name, file, key_, value, error, type, tag, name, onClick, label, onChange, url, uploadFunction,...props }) => {
    const classes = useStyles();
    const [loader, setLoader] = useState(false);
    const uploadExcel = async (e) => {
        if (e && e.length) {
            setLoader(true);
            const res = await httpPostRequestWithForm(uploadFunction(e[0], tag, type));           
            if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
                onChange({ target: { value: res[newConstants.DATA], name: name } })
                setLoader(false);                
            }
            else {
                setLoader(false);
            }
        }
    }

    const filename = (str) => str ? (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()) : "";
    return (
        <div>
            <Card color={error ? "red" : ""} {...props} padding={[5]}>
                <Text bold size={18}>{filename(document_name)}</Text>
                <Row padding={[5]}>
                    <Column >
                        <DropzoneArea
                            dropzoneClass={classes.excelDropZone}
                            acceptedFiles={[".xlsx", ".xls", ".csv"]}
                            showFileNames={true}
                            useChipsForPreview={true}
                            previewChipProps={{color:"primary"}}
                            maxFileSize={5000000}
                            onChange={uploadExcel}
                            onDelte={(e)=>onChange({ target: { value:"", name: name } })}
                            filesLimit={1}
                        />
                    </Column>
                </Row>
            </Card>
        </div>
    );
}

export default ExcelUpload;