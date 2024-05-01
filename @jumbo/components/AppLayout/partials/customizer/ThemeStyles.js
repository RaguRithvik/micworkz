import React, { useContext, useState } from 'react';
import Box from '@material-ui/core/Box';
import CmtImage from '../../../../../@coremat/CmtImage';
import CmtCard from '../../../../../@coremat/CmtCard';
import CmtCardHeader from '../../../../../@coremat/CmtCard/CmtCardHeader';
import CmtCardContent from '../../../../../@coremat/CmtCard/CmtCardContent';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AppContext from '../../../contextProvider/AppContextProvider/AppContext';
import { HEADER_TYPE } from '../../../../constants/ThemeOptions';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    '& .Cmt-header-root': {
      padding: '4px 16px',
    },
    '& .Cmt-card-content': {
      padding: 16,
    },
  },
  checkIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fill: theme.palette.success.main,
  },
}));

const ThemeStyles = () => {
  const classes = useStyles();
  const { headerType, updateHeaderType, isSidebarFixed, setSidebarPosition } = useContext(AppContext);
  const [isHeaderFixed, setHeaderStyle] = useState(headerType === HEADER_TYPE.FIXED);

  const onFixHeaderClick = () => {
    const updatedType = isHeaderFixed ? HEADER_TYPE.STATIC : HEADER_TYPE.FIXED;
    updateHeaderType(updatedType);
    setHeaderStyle(!isHeaderFixed);
  };

  const onResetStyle = () => {
    updateHeaderType(HEADER_TYPE.FIXED);
    setHeaderStyle(true);
  };

  return (
    <CmtCard className={classes.cardRoot}>
      <CmtCardHeader title="Style">
        <Button onClick={onResetStyle}>RESET</Button>
      </CmtCardHeader>
      <CmtCardContent>
        <Box display="flex">
          <Box className="pointer" onClick={() => onFixHeaderClick()}>
            <Box position="relative">
              <CmtImage src="/images/customizer/fix_header.png" alt="Fix Header" />
              {isHeaderFixed && <CheckCircleIcon className={classes.checkIcon} />}
            </Box>
            <Box mt={2}>Fix Header</Box>
          </Box>

          <Box className="pointer" onClick={() => setSidebarPosition(!isSidebarFixed)} ml={4}>
            <Box position="relative">
              <CmtImage src="/images/customizer/fix_sidebar.png" alt="Fix Sidebar" />
              {isSidebarFixed && <CheckCircleIcon className={classes.checkIcon} />}
            </Box>
            <Box mt={2}>Fix Sidebar</Box>
          </Box>
        </Box>
      </CmtCardContent>
    </CmtCard>
  );
};

export default ThemeStyles;
