import React from 'react';
import { CircularProgress} from '@material-ui/core';

const Loader = ({size,color,...props}) => {
    return <CircularProgress style={{height:size,width:size,color:color}} {...props}/>;
};

export default Loader;