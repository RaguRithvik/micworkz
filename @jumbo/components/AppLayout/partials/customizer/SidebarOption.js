import React, { useContext, useState } from 'react';
import CmtCard from '../../../../../@coremat/CmtCard';
import CmtCardHeader from '../../../../../@coremat/CmtCard/CmtCardHeader';
import Button from '@material-ui/core/Button';
import { fade, makeStyles } from '@material-ui/core';
import CmtGridView from '../../../../../@coremat/CmtGridView';
import Box from '@material-ui/core/Box';
import CmtImage from '../../../../../@coremat/CmtImage';
import { SectionLegend } from '../../../CorematDemosComponents';
import AppSwitch from '../../../Common/formElements/AppSwitch';
import CmtCardContent from '../../../../../@coremat/CmtCard/CmtCardContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AppContext from '../../../contextProvider/AppContextProvider/AppContext';
import { THEME_TYPES } from '../../../../constants/ThemeOptions';
import { darkTheme, lightTheme, semiDarkTheme } from '../../../../../theme/themeColors';
import { object } from '@storybook/addon-knobs';
import {
  FLAT_COLOR_OPTIONS,
  GRADIENTS_COLOR_OPTIONS,
  SIDEBAR_BG_IMAGE_OPTIONS,
} from '../../../../constants/CustomizerOptions';

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

const SidebarOption = () => {
  const classes = useStyles();
  const { sidebarStyle, updateSidebarStyle, themeColors, updateThemeColors, themeType } = useContext(AppContext);

  const [showSidebarImage, setSidebarImageStatus] = useState(sidebarStyle.backgroundImage !== '');

  const resetOption = () => {
    updateThemeColors(themeColors);

    let resetColors = {};
    if (themeType === THEME_TYPES.SEMI_DARK) {
      resetColors = {
        ...semiDarkTheme.palette.sidebar,
        navActiveBgColor: themeColors.primary,
      };
    } else if (themeType === THEME_TYPES.DARK) {
      resetColors = {
        ...darkTheme.palette.sidebar,
        navActiveBgColor: themeColors.primary,
      };
    } else if (themeType === THEME_TYPES.LIGHT) {
      resetColors = {
        ...lightTheme.palette.sidebar,
        textActiveColor: themeColors.primary,
        navActiveBgColor: fade(themeColors.primary, 0.1),
      };
    }

    updateSidebarStyle({
      ...resetColors,
      backgroundColor: '',
      backgroundImage: '',
    });
  };

  const onToggleSidebarImage = () => {
    setSidebarImageStatus(!showSidebarImage);

    if (showSidebarImage) {
      let resetColors = sidebarStyle;

      if (sidebarStyle.backgroundColor === '#000') {
        if (themeType === THEME_TYPES.SEMI_DARK) {
          resetColors = {
            ...semiDarkTheme.palette.sidebar,
            navActiveBgColor: themeColors.primary,
            backgroundColor: '',
          };
        } else if (themeType === THEME_TYPES.DARK) {
          resetColors = {
            ...darkTheme.palette.sidebar,
            navActiveBgColor: themeColors.primary,
            backgroundColor: '',
          };
        } else if (themeType === THEME_TYPES.LIGHT) {
          resetColors = {
            ...lightTheme.palette.sidebar,
            textActiveColor: themeColors.primary,
            navActiveBgColor: fade(themeColors.primary, 0.1),
            backgroundColor: '',
          };
        }
      }
      updateSidebarStyle({
        ...sidebarStyle,
        ...resetColors,
        backgroundImage: '',
      });
    }
  };

  const setSidebarImage = (option) => {
    updateSidebarStyle({ ...sidebarStyle, backgroundImage: option.fullImage });
  };

  const setSidebarColor = (color) => {
    updateSidebarStyle({
      ...color,
      backgroundImage: sidebarStyle.backgroundImage,
    });
  };

  const setSidebarGradientColor = (option) => {
    updateSidebarStyle({
      ...option,
      backgroundImage: sidebarStyle.backgroundImage,
    });
  };

  return (
    <CmtCard className={classes.cardRoot}>
      <CmtCardHeader title="Sidebar Option">
        <Button onClick={resetOption}>RESET</Button>
      </CmtCardHeader>
      <CmtCardContent>
        <Box mb={6}>
          <Box mb={4} color="text.secondary">
            Flat Style
          </Box>
          <CmtGridView
            itemPadding={14}
            responsive={object('responsive', {
              xs: 4,
              sm: 6,
              md: 6,
              lg: 6,
              xl: 6,
            })}
            data={FLAT_COLOR_OPTIONS}
            renderRow={(color, index) => (
              <Box key={index} position="relative">
                <Box
                  className="pointer"
                  onClick={() => setSidebarColor(color)}
                  height={40}
                  width={40}
                  borderRadius="50%"
                  bgcolor={color.backgroundColor}
                />
                {sidebarStyle.backgroundColor === color.backgroundColor && <CheckCircleIcon className={classes.checkIcon} />}
              </Box>
            )}
          />
        </Box>
        <Box mb={6}>
          <Box mb={4} color="text.secondary">
            Gradient
          </Box>
          <CmtGridView
            itemPadding={14}
            responsive={object('responsive', {
              xs: 4,
              sm: 6,
              md: 6,
              lg: 6,
              xl: 6,
            })}
            data={GRADIENTS_COLOR_OPTIONS}
            renderRow={(color, index) => (
              <Box key={index} position="relative">
                <Box
                  className="pointer"
                  onClick={() => setSidebarGradientColor(color)}
                  height={40}
                  width={40}
                  borderRadius="50%"
                  style={{
                    background: `linear-gradient(180deg, ${color.backgroundColor.join(', ')})`,
                  }}
                />
                {sidebarStyle.backgroundColor === color.backgroundColor && <CheckCircleIcon className={classes.checkIcon} />}
              </Box>
            )}
          />
        </Box>
        <SectionLegend mb={4}>
          <AppSwitch label="Show Sidebar Image" checked={showSidebarImage} onChange={onToggleSidebarImage} />
        </SectionLegend>

        {showSidebarImage && (
          <CmtGridView
            itemPadding={14}
            column={6}
            data={SIDEBAR_BG_IMAGE_OPTIONS}
            renderRow={(item, index) => (
              <Box key={index} position="relative" className="pointer" onClick={() => setSidebarImage(item)}>
                <CmtImage src={item.image} alt={item.name} />
                {sidebarStyle.backgroundImage === item.fullImage && <CheckCircleIcon className={classes.checkIcon} />}
              </Box>
            )}
          />
        )}
      </CmtCardContent>
    </CmtCard>
  );
};

export default SidebarOption;
