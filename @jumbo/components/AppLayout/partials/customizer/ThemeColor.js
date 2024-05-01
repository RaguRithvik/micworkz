import React, { useContext } from 'react';
import CmtCard from '../../../../../@coremat/CmtCard';
import CmtCardHeader from '../../../../../@coremat/CmtCard/CmtCardHeader';
import CmtCardContent from '../../../../../@coremat/CmtCard/CmtCardContent';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import CmtGridView from '../../../../../@coremat/CmtGridView';
import Box from '@material-ui/core/Box';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AppContext from '../../../contextProvider/AppContextProvider/AppContext';
import defaultTheme from '../../../../../theme/defaultTheme';
import { THEME_COLORS } from '../../../../constants/CustomizerOptions';

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

const ThemeColor = () => {
  const classes = useStyles();
  const { themeColors, updateThemeColors } = useContext(AppContext);

  const resetColor = () => {
    updateThemeColors({
      primary: defaultTheme.palette.primary.main,
      secondary: defaultTheme.palette.secondary.main,
    });
  };

  return (
    <CmtCard className={classes.cardRoot}>
      <CmtCardHeader title="Theme Color">
        <Button onClick={resetColor}>RESET</Button>
      </CmtCardHeader>
      <CmtCardContent>
        <CmtGridView
          itemPadding={16}
          data={THEME_COLORS}
          column={5}
          renderRow={(item, index) => (
            <Box position="relative" className="pointer" onClick={() => updateThemeColors(item)} key={index}>
              <Box display="flex" borderRadius="borderRadius" overflow="hidden">
                <Box height={32} flex={1} bgcolor={item.primary} />
                <Box height={32} flex={1} bgcolor={item.secondary} />
              </Box>
              {item.primary === themeColors.primary && item.secondary === themeColors.secondary && (
                <CheckCircleIcon className={classes.checkIcon} />
              )}
            </Box>
          )}
        />
      </CmtCardContent>
    </CmtCard>
  );
};

export default ThemeColor;
