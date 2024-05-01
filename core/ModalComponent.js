import React,{useRef,useEffect} from 'react'
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { Modal,IconButton } from '@material-ui/core'; 
import {styleConcat} from "./ComponentHelper";
import outSideClickListener from "./OutsideClickListener";
import {Cancel} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    closeButton:{
       position:'absolute',
       top:-20,
       right:-20
    },
    paper: {
        "&:focus": {
            outline: "none"
        },
        position: 'absolute',
        // width: theme.spacing.unit * 90,
        width: "80%",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        [theme.breakpoints.down('sm')]: {
            // width: theme.spacing.unit * 35,
            overflowX: "auto",
            height: "70%"
        },
    },
    modal: { 
        position: 'fixed',
        zIndex: 10000,
        paddingTop: '100px',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    modalContent: {
        position:'relative',
        backgroundColor: '#fefefe',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #888',
        width: '80%'
    }
}));


function getModalStyle() {
    const top = 40;
    const left = 43;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const ModalComponent = ({ open, setOpen, children,style, ...props }) => {
    const classes = useStyles();
    // const ref=useRef();
    
    // useEffect(()=>{
    //     console.log(window)
    //     ref.current.style.display = open?"block":"none"; 
    //     console.log(ref.current.style.display)
    // },[open]);

    // outSideClickListener(ref,()=>{
    //     // setOpen(false);
    // }); 

    return (
        <Modal
         open={open}
         onClose={() => setOpen(false)} 
         >
            <div style={styleConcat([getModalStyle(),style])} className={classes.paper} {...props}>
                {children}
            </div>
        </Modal>
    )
}

export default ModalComponent
/*
        <div ref={ref} className={classes.modal} > 
            <div className={classes.modalContent}>
                {children}
                <IconButton className={classes.closeButton} onClick={()=>setOpen(false)}><Cancel/></IconButton>
            </div>
        </div>

        
*/