import React,{useState} from 'react' 
import { styleConcat } from "./ComponentHelper";
import Skeleton from '@material-ui/lab/Skeleton';


const Image = ({ src, width, height, style,fit, className, ...props }) => {
    const [loaded,setLoaded] = useState(false);
    const styles = [{ objectFit: fit?fit:"" },{display:loaded?"flex":'none',backgroundColor:loaded?"":'red'}, style]
    return <div>
           <img src={src} onLoad={() => setLoaded(true)} className={className} style={styleConcat(styles)} {...props} />
           <Skeleton variant="rect" className={className}  style={{display:!loaded?"flex":'none'}}/>
        </div>
}

export default Image;