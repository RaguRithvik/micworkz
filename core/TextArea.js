import React, { useState } from 'react';
import { TextareaAutosize } from '@material-ui/core'
import { styleConcat } from "./ComponentHelper";
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    textArea: {
        outline: "none ! important",
        borderRadius: 5,
        borderWidth: 2,
        fontSize: 18,
        padding: 5,
        width: '100%',
        minHeight: 60,
        '&:focus': {
            borderColor: 'red'
        },

    }

}));

export default function TextArea({ error, label, style, ...props }) {
    const classes = useStyles();
    const [focus, setFocus] = useState(false)
    return (
        <div>
            <p style={{ fontSize: 14, paddingBottom: 5, color: focus ? "#003399" : "#6790E5" }}>{label}</p>
            <TextareaAutosize onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={styleConcat([style, { borderColor: error ? "red" : !focus ? "#D3D3D3" : "#003399" }])} className={classes.textArea}  {...props} />
        </div>
    )
}
