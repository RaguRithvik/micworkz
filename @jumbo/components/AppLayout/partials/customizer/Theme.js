import React, { useContext } from 'react';
import Box from '@material-ui/core/Box';
import CmtGridView from '../../../../../@coremat/CmtGridView';
import CmtImage from '../../../../../@coremat/CmtImage';
import CmtCard from '../../../../../@coremat/CmtCard';
import CmtCardHeader from '../../../../../@coremat/CmtCard/CmtCardHeader';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CmtCardContent from '../../../../../@coremat/CmtCard/CmtCardContent';
import AppContext from '../../../contextProvider/AppContextProvider/AppContext';
import { THEME_TYPES } from '../../../../constants/ThemeOptions';
import { THEME_TYPE_OPTIONS } from '../../../../constants/CustomizerOptions';

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

const Theme = () => {
  const classes = useStyles();
  const { themeType, updateThemeType } = useContext(AppContext);

  const onResetTheme = () => {
    updateThemeType(THEME_TYPES.LIGHT);
  };

  return (
    <CmtCard className={classes.cardRoot}>
      <CmtCardHeader title="Theme">
        <Button onClick={onResetTheme}>RESET</Button>
      </CmtCardHeader>
      <CmtCardContent>
        <CmtGridView
          itemPadding={16}
          data={THEME_TYPE_OPTIONS}
          renderRow={(item, index) => (
            <Box className="pointer" onClick={() => updateThemeType(item.type)}>
              <Box position="relative">
                <CmtImage key={index} src={item.image} alt={item.title} />
                {themeType === item.type && <CheckCircleIcon className={classes.checkIcon} />}
              </Box>
              <Box mt={2}>{item.title}</Box>
            </Box>
          )}
        />
      </CmtCardContent>
    </CmtCard>
  );
};

export default Theme;
