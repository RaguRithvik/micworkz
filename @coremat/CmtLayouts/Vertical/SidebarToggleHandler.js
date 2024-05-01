import React, { useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LayoutContext from './LayoutContext/LayoutContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  buttonIcon: {
    color:"#686363"
  }
}));

const SidebarToggleHandler = ({ children,iconOpen,iconClose, ...restProps }) => {
  const { isOpen, setOpen } = useContext(LayoutContext);
  const classes=useStyles();

  return (
    <IconButton  onClick={() => setOpen(!isOpen)} {...restProps}>
      {iconOpen?isOpen?iconClose:iconOpen:(children || <MenuIcon className={classes.buttonIcon} />)}
    </IconButton>
  );
};

export default SidebarToggleHandler;
