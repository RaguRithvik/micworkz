import React, { useState } from "react";
import Row from "./Row";
import Column from "./Column";
import Card from "./Card";
import Text from "./Text";
import Touchable from "./Touchable";
import { makeStyles } from '@material-ui/core/styles';
import { httpPostRequestWithForm, httpGetRequest } from "../helper/JsHelper";
import { imageUploder, apiDownload } from "../helper/RequestPayLoad";
import { newConstants } from "../helper/constants";
import { DropzoneArea } from 'material-ui-dropzone';


const useStyles = makeStyles((theme) => ({

}));

const DocumentUpload = ({ document_name, file, key_, value, error, type, tag, name, onClick, label, onChange, removeImage, url, ...props }) => {
    const classes = useStyles();
    const [loader, setLoader] = useState(false);
    const uploadImage = async (e) => {
        if (e && e.length) {
            setLoader(true);
            const res = await httpPostRequestWithForm(imageUploder( e[0], tag, type));
            if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
                onChange({ target: { value: res[newConstants.DATA][newConstants.FILE_KEY], name: name } })
                setLoader(false);
            }
            else {
                setLoader(false);
            }
        }
    }

    const downloadFile = async () => {
        let res = await httpGetRequest(apiDownload(value)); 
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(new Blob([res])); 
        a.href = url;
        a.download = file;
        a.click();
        window.URL.revokeObjectURL(url);
    }
    const filename = (str) => str ? (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()) : "";

    return (
        <div>
            <Card color={error ? "red" : ""} {...props} padding={[5]}>
                <Text bold size={18}>{filename(document_name)}</Text>
                <Row padding={[5]}>
                    <Column >
                        <DropzoneArea
                            // acceptedFiles={['image/jpeg', 'image/png', 'pdf', "doc"]}
                            showPreviews={true}
                            maxFileSize={5000000}
                            onChange={uploadImage}
                            filesLimit={1}
                            showPreviews={false}
                        />
                    </Column>
                    {file && file.length > 0 ?
                        <Column>
                            <Touchable onClick={downloadFile}>
                                <Text>{file}</Text>
                            </Touchable>
                        </Column> : null
                    }
                </Row>
            </Card>
        </div>
    );
}

export default DocumentUpload;